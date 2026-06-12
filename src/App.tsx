import { useEffect, useRef, useState } from "react";
import { characterSheet, compressImage, illustratePage } from "./ai";
import Builder from "./components/Builder";
import Home from "./components/Home";
import Login from "./components/Login";
import ProfileEditor from "./components/ProfileEditor";
import Reader from "./components/Reader";
import { artStyleOf, newKidProfile, type KidProfile } from "./profile";
import { stories as presetStories, type Story } from "./stories";
import { supabase } from "./supabase";

const KIDS_KEY = "lhs:kids";
const ACTIVE_KID_KEY = "lhs:activeKid";
const FAVORITES_KEY = "lhs:favorites";
const MY_STORIES_KEY = "lhs:myStories";
const LEGACY_NAME_KEY = "lhs:heroName";
const THEME_KEY = "lhs:theme";
const ADULT_KEY = "lhs:adultConfirmed";
const SESSION_KEY = "lhs:session";

type View =
  | { screen: "home" }
  | { screen: "profile"; kidId: string | null }
  | { screen: "builder" }
  | { screen: "reader"; storyId: string };

const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full (large illustrated stories) — the app keeps working in memory.
  }
};

const loadKids = (): KidProfile[] => {
  const kids = loadJson<KidProfile[]>(KIDS_KEY, []);
  if (kids.length > 0) {
    // Fill in any fields added since the profile was saved.
    return kids.map((kid) => ({ ...newKidProfile(), ...kid }));
  }

  // Migrate the old single hero-name setup into a first kid profile.
  const legacyName = localStorage.getItem(LEGACY_NAME_KEY)?.trim();
  if (legacyName) {
    return [{ ...newKidProfile(), name: legacyName }];
  }
  return [];
};

function App() {
  const [kids, setKids] = useState<KidProfile[]>(loadKids);
  const [activeKidId, setActiveKidId] = useState<string | null>(
    () => localStorage.getItem(ACTIVE_KID_KEY) ?? null,
  );
  const [favorites, setFavorites] = useState<string[]>(() => loadJson(FAVORITES_KEY, []));
  const [myStories, setMyStories] = useState<Story[]>(() => loadJson(MY_STORIES_KEY, []));
  const [view, setView] = useState<View>({ screen: "home" });
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light",
  );
  const [session, setSession] = useState<{ email: string } | null>(() =>
    loadJson<{ email: string } | null>(SESSION_KEY, null),
  );

  const signIn = (email: string) => {
    const next = { email };
    saveJson(SESSION_KEY, next);
    localStorage.setItem(ADULT_KEY, "true");
    setSession(next);
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    if (supabase) void supabase.auth.signOut();
  };

  // Cloud sign-in (Google via Supabase) when configured.
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const applyUser = (email: string | undefined, userId: string | undefined) => {
      if (!email || !userId) return;
      signIn(email);
      void client
        .from("members")
        .upsert({ id: userId, email, last_seen_at: new Date().toISOString() });
    };

    void client.auth.getSession().then(({ data }) => {
      applyUser(data.session?.user.email ?? undefined, data.session?.user.id);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event, authSession) => {
      if (authSession) {
        applyUser(authSession.user.email ?? undefined, authSession.user.id);
      }
    });
    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => saveJson(KIDS_KEY, kids), [kids]);

  useEffect(() => {
    if (activeKidId) localStorage.setItem(ACTIVE_KID_KEY, activeKidId);
  }, [activeKidId]);

  useEffect(() => saveJson(FAVORITES_KEY, favorites), [favorites]);

  useEffect(() => saveJson(MY_STORIES_KEY, myStories), [myStories]);

  const activeKid = kids.find((kid) => kid.id === activeKidId) ?? kids[0] ?? null;

  const goTo = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0 });
  };

  const saveKid = (profile: KidProfile) => {
    setKids((current) => {
      const exists = current.some((kid) => kid.id === profile.id);
      return exists
        ? current.map((kid) => (kid.id === profile.id ? profile : kid))
        : [...current, profile];
    });
    setActiveKidId(profile.id);
    goTo({ screen: "home" });
  };

  const deleteKid = (kidId: string) => {
    const kid = kids.find((entry) => entry.id === kidId);
    if (!window.confirm(`Delete ${kid?.name || "this child"}'s profile?`)) return;
    setKids((current) => current.filter((entry) => entry.id !== kidId));
    if (activeKidId === kidId) setActiveKidId(null);
    goTo({ screen: "home" });
  };

  const toggleFavorite = (storyId: string) => {
    setFavorites((current) =>
      current.includes(storyId)
        ? current.filter((id) => id !== storyId)
        : [...current, storyId],
    );
  };

  const setPageImage = (storyId: string, pageIndex: number, image: string) => {
    setMyStories((current) =>
      current.map((story) =>
        story.id === storyId
          ? {
              ...story,
              pages: story.pages.map((page, index) =>
                index === pageIndex ? { ...page, image } : page,
              ),
            }
          : story,
      ),
    );
  };

  /** Stories whose remaining illustrations should stop (deleted mid-paint). */
  const stoppedPainting = useRef<Set<string>>(new Set());

  /** Paints AI story pages one by one; the reader updates live as images land. */
  const illustrateStory = async (story: Story, heroes: KidProfile[]) => {
    const character = characterSheet(heroes);
    const style = story.artStyle ?? artStyleOf(heroes[0] ?? null).prompt;
    for (let index = 0; index < story.pages.length; index += 1) {
      if (stoppedPainting.current.has(story.id)) return;
      const scene = story.pages[index].illustration;
      if (!scene) continue;
      const image = await illustratePage(scene, character, style);
      if (stoppedPainting.current.has(story.id)) return;
      if (image) {
        const compressed = await compressImage(image);
        setPageImage(story.id, index, compressed);
      }
    }
  };

  const createStory = (story: Story) => {
    setMyStories((current) => [story, ...current]);
    goTo({ screen: "reader", storyId: story.id });
    if (story.pages.some((page) => page.illustration)) {
      const heroes = kids.filter((kid) => story.kidIds?.includes(kid.id));
      void illustrateStory(story, heroes.length > 0 ? heroes : activeKid ? [activeKid] : []);
    }
  };

  const deleteStory = (storyId: string) => {
    if (!window.confirm("Delete this story?")) return;
    stoppedPainting.current.add(storyId);
    setMyStories((current) => current.filter((story) => story.id !== storyId));
  };

  const readerStory =
    view.screen === "reader"
      ? (myStories.find((story) => story.id === view.storyId) ??
        presetStories.find((story) => story.id === view.storyId) ??
        null)
      : null;

  if (!session) {
    return (
      <main className="app">
        <button
          type="button"
          className="theme-toggle no-print"
          onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          <span aria-hidden="true">{theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}</span>
          <span className="theme-toggle-label">{theme === "light" ? "Dark" : "Light"}</span>
        </button>
        <Login onComplete={signIn} />
      </main>
    );
  }

  return (
    <main className="app">
      <button
        type="button"
        className="theme-toggle no-print"
        onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        <span aria-hidden="true">{theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}</span>
        <span className="theme-toggle-label">{theme === "light" ? "Dark" : "Light"}</span>
      </button>

      {view.screen === "home" && (
        <Home
          kids={kids}
          activeKid={activeKid}
          onSelectKid={setActiveKidId}
          onAddKid={() => goTo({ screen: "profile", kidId: null })}
          onEditKid={(kidId) => goTo({ screen: "profile", kidId })}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          myStories={myStories}
          onDeleteStory={deleteStory}
          onOpenStory={(story) => goTo({ screen: "reader", storyId: story.id })}
          onBuildStory={() => goTo({ screen: "builder" })}
          email={session.email}
          onSignOut={signOut}
        />
      )}

      {view.screen === "profile" && (
        <ProfileEditor
          initial={view.kidId ? (kids.find((kid) => kid.id === view.kidId) ?? null) : null}
          canDelete={kids.length > 0}
          onSave={saveKid}
          onDelete={deleteKid}
          onCancel={() => goTo({ screen: "home" })}
        />
      )}

      {view.screen === "builder" && (
        <Builder
          kids={kids}
          activeKid={activeKid}
          onCreate={createStory}
          onBack={() => goTo({ screen: "home" })}
        />
      )}

      {view.screen === "reader" && readerStory && (
        <Reader
          story={readerStory}
          kids={kids}
          activeKid={activeKid}
          onExit={() => goTo({ screen: "home" })}
        />
      )}
    </main>
  );
}

export default App;
