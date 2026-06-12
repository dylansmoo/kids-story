import { useEffect, useState } from "react";
import { characterSheet, compressImage, illustratePage } from "./ai";
import Builder from "./components/Builder";
import Home from "./components/Home";
import ProfileEditor from "./components/ProfileEditor";
import Reader from "./components/Reader";
import { artStyleOf, newKidProfile, type KidProfile } from "./profile";
import { stories as presetStories, type Story } from "./stories";

const KIDS_KEY = "lhs:kids";
const ACTIVE_KID_KEY = "lhs:activeKid";
const FAVORITES_KEY = "lhs:favorites";
const MY_STORIES_KEY = "lhs:myStories";
const LEGACY_NAME_KEY = "lhs:heroName";
const THEME_KEY = "lhs:theme";

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
    setKids((current) => current.filter((kid) => kid.id !== kidId));
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

  /** Paints AI story pages one by one; the reader updates live as images land. */
  const illustrateStory = async (story: Story, profile: KidProfile | null) => {
    const character = characterSheet(profile);
    const style = artStyleOf(profile).prompt;
    for (let index = 0; index < story.pages.length; index += 1) {
      const scene = story.pages[index].illustration;
      if (!scene) continue;
      const image = await illustratePage(scene, character, style);
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
      void illustrateStory(story, activeKid);
    }
  };

  const deleteStory = (storyId: string) => {
    setMyStories((current) => current.filter((story) => story.id !== storyId));
  };

  const readerStory =
    view.screen === "reader"
      ? (myStories.find((story) => story.id === view.storyId) ??
        presetStories.find((story) => story.id === view.storyId) ??
        null)
      : null;

  return (
    <main className="app">
      <button
        type="button"
        className="theme-toggle no-print"
        onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
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
          profile={activeKid}
          onCreate={createStory}
          onBack={() => goTo({ screen: "home" })}
        />
      )}

      {view.screen === "reader" && readerStory && (
        <Reader
          story={readerStory}
          profile={activeKid}
          onExit={() => goTo({ screen: "home" })}
        />
      )}
    </main>
  );
}

export default App;
