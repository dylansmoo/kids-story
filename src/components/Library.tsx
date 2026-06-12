import { HeroText, heroName } from "../HeroText";
import { stories, type Story } from "../stories";

interface LibraryProps {
  name: string;
  onNameChange: (name: string) => void;
  favorites: string[];
  onToggleFavorite: (storyId: string) => void;
  onSelect: (story: Story) => void;
}

function Library({ name, onNameChange, favorites, onToggleFavorite, onSelect }: LibraryProps) {
  return (
    <div className="library">
      <header className="library-header">
        <p className="eyebrow">Little Hero Stories</p>
        <h1>
          Stories starring <span className="hero-name">{heroName(name)}</span>
        </h1>
        <p className="subtitle">Pick a story and read it together, one page at a time.</p>
      </header>

      <div className="hero-setup">
        <label htmlFor="hero-name-input">Who is the hero?</label>
        <input
          id="hero-name-input"
          className="hero-input"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Your child's first name"
          maxLength={20}
          autoComplete="off"
        />
        <p className="hero-hint">Every story stars your child by name. You can change it anytime.</p>
      </div>

      <div className="story-grid">
        {stories.map((story) => {
          const isFavorite = favorites.includes(story.id);
          return (
            <article
              key={story.id}
              className="story-card"
              style={{ ["--accent" as string]: story.accent }}
            >
              <button
                type="button"
                className="card-open"
                onClick={() => onSelect(story)}
                aria-label={`Read ${story.title.replaceAll("{name}", heroName(name))}`}
              />
              <button
                type="button"
                className={isFavorite ? "fav-button active" : "fav-button"}
                onClick={() => onToggleFavorite(story.id)}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={isFavorite}
              >
                {isFavorite ? "\u2665" : "\u2661"}
              </button>
              <span className="story-cover" aria-hidden="true">
                {story.emoji}
              </span>
              <span className="story-theme">{story.theme}</span>
              <span className="story-title">
                <HeroText text={story.title} name={name} />
              </span>
              <span className="story-subtitle">{story.subtitle}</span>
              <span className="story-meta">
                {story.pages.length} pages &middot; about {story.minutes} min
              </span>
            </article>
          );
        })}
      </div>

      <p className="values-note">
        Classic, wholesome stories. No politics, no lectures &mdash; just imagination, kindness, and
        bedtime smiles.
      </p>
    </div>
  );
}

export default Library;
