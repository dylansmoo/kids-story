import { useEffect, useState } from "react";
import Library from "./components/Library";
import Reader from "./components/Reader";
import type { Story } from "./stories";

const NAME_KEY = "lhs:heroName";
const FAVORITES_KEY = "lhs:favorites";

const loadName = (): string => localStorage.getItem(NAME_KEY) ?? "";

const loadFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

function App() {
  const [name, setName] = useState(loadName);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [selected, setSelected] = useState<Story | null>(null);

  useEffect(() => {
    localStorage.setItem(NAME_KEY, name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (storyId: string) => {
    setFavorites((current) =>
      current.includes(storyId)
        ? current.filter((id) => id !== storyId)
        : [...current, storyId],
    );
  };

  const openStory = (story: Story) => {
    setSelected(story);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="app">
      {selected ? (
        <Reader story={selected} name={name} onExit={() => setSelected(null)} />
      ) : (
        <Library
          name={name}
          onNameChange={setName}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelect={openStory}
        />
      )}
    </main>
  );
}

export default App;
