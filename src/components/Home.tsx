import { Avatar } from "../Avatar";
import { HeroText, heroName } from "../HeroText";
import type { KidProfile } from "../profile";
import { stories, type Story } from "../stories";

interface HomeProps {
  kids: KidProfile[];
  activeKid: KidProfile | null;
  onSelectKid: (kidId: string) => void;
  onAddKid: () => void;
  onEditKid: (kidId: string) => void;
  favorites: string[];
  onToggleFavorite: (storyId: string) => void;
  myStories: Story[];
  onDeleteStory: (storyId: string) => void;
  onOpenStory: (story: Story) => void;
  onBuildStory: () => void;
  email: string;
  onSignOut: () => void;
}

function Home({
  kids,
  activeKid,
  onSelectKid,
  onAddKid,
  onEditKid,
  favorites,
  onToggleFavorite,
  myStories,
  onDeleteStory,
  onOpenStory,
  onBuildStory,
  email,
  onSignOut,
}: HomeProps) {
  const activeName = activeKid?.name ?? "";

  return (
    <div className="home">
      <header className="library-header">
        <p className="eyebrow">Little Hero Stories</p>
        <h1>
          Stories starring <span className="hero-name">{heroName(activeName)}</span>
        </h1>
        <p className="subtitle">Pick a story or build a brand new one together.</p>
      </header>

      <div className="kid-row">
        {kids.map((kid) => (
          <div key={kid.id} className={kid.id === activeKid?.id ? "kid-chip active" : "kid-chip"}>
            <button
              type="button"
              className="kid-select"
              onClick={() => onSelectKid(kid.id)}
              aria-pressed={kid.id === activeKid?.id}
            >
              <Avatar profile={kid} size={48} />
              <span>{kid.name}</span>
            </button>
            <button
              type="button"
              className="kid-edit"
              onClick={() => onEditKid(kid.id)}
              aria-label={`Edit ${kid.name}`}
            >
              {"\u270E"}
            </button>
          </div>
        ))}
        <button type="button" className="add-kid" onClick={onAddKid}>
          + {kids.length === 0 ? "Add your child" : "Add another"}
        </button>
      </div>

      <button type="button" className="cta-card" onClick={onBuildStory}>
        <span className="cta-emoji" aria-hidden="true">
          {"\u{1FA84}"}
        </span>
        <span className="cta-copy">
          <span className="cta-title">Build a brand new story</span>
          <span className="cta-sub">
            Pick the adventure, the friend, the place, and the lesson.
          </span>
        </span>
        <span className="cta-arrow" aria-hidden="true">
          &rarr;
        </span>
      </button>

      {myStories.length > 0 && (
        <>
          <h2 className="shelf-title">My stories</h2>
          <div className="story-grid">
            {myStories.map((story) => (
              <article
                key={story.id}
                className="story-card"
                style={{ ["--accent" as string]: story.accent }}
              >
                <button
                  type="button"
                  className="card-open"
                  onClick={() => onOpenStory(story)}
                  aria-label={`Read ${story.title.replaceAll(
                    "{name}",
                    story.heroName ?? heroName(activeName),
                  )}`}
                />
                <button
                  type="button"
                  className="fav-button"
                  onClick={() => onDeleteStory(story.id)}
                  aria-label="Delete story"
                  title="Delete story"
                >
                  {"\u{1F5D1}\u{FE0F}"}
                </button>
                <span className="story-cover" aria-hidden="true">
                  {story.emoji}
                </span>
                <span className="story-theme">{story.theme}</span>
                <span className="story-title">
                  <HeroText text={story.title} name={story.heroName ?? activeName} />
                </span>
                <span className="story-subtitle">{story.subtitle}</span>
                <span className="story-meta">
                  {story.pages.length} pages &middot; about {story.minutes} min
                </span>
              </article>
            ))}
          </div>
        </>
      )}

      <h2 className="shelf-title">Story library</h2>
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
                onClick={() => onOpenStory(story)}
                aria-label={`Read ${story.title.replaceAll("{name}", heroName(activeName))}`}
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
                <HeroText text={story.title} name={activeName} />
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
      <div className="signed-in-row">
        <span>Signed in as {email}</span>
        <button type="button" className="link-button" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Home;
