import { useEffect, useState } from "react";
import Builder from "./components/Builder";
import Home from "./components/Home";
import ProfileEditor from "./components/ProfileEditor";
import Reader from "./components/Reader";
import { newKidProfile, type KidProfile } from "./profile";
import type { Story } from "./stories";

const KIDS_KEY = "lhs:kids";
const ACTIVE_KID_KEY = "lhs:activeKid";
const FAVORITES_KEY = "lhs:favorites";
const MY_STORIES_KEY = "lhs:myStories";
const LEGACY_NAME_KEY = "lhs:heroName";

type View =
  | { screen: "home" }
  | { screen: "profile"; kidId: string | null }
  | { screen: "builder" }
  | { screen: "reader"; story: Story };

const loadJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const loadKids = (): KidProfile[] => {
  const kids = loadJson<KidProfile[]>(KIDS_KEY, []);
  if (kids.length > 0) return kids;

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

  useEffect(() => {
    localStorage.setItem(KIDS_KEY, JSON.stringify(kids));
  }, [kids]);

  useEffect(() => {
    if (activeKidId) localStorage.setItem(ACTIVE_KID_KEY, activeKidId);
  }, [activeKidId]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(MY_STORIES_KEY, JSON.stringify(myStories));
  }, [myStories]);

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

  const createStory = (story: Story) => {
    setMyStories((current) => [story, ...current]);
    goTo({ screen: "reader", story });
  };

  const deleteStory = (storyId: string) => {
    setMyStories((current) => current.filter((story) => story.id !== storyId));
  };

  return (
    <main className="app">
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
          onOpenStory={(story) => goTo({ screen: "reader", story })}
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

      {view.screen === "reader" && (
        <Reader
          story={view.story}
          profile={activeKid}
          onExit={() => goTo({ screen: "home" })}
        />
      )}
    </main>
  );
}

export default App;
