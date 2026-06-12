import { useEffect, useState } from "react";
import { generateAiStory } from "../ai";
import { Avatar } from "../Avatar";
import type { KidProfile } from "../profile";
import type { Story } from "../stories";
import {
  buildStory,
  companionOptions,
  defaultSetup,
  joinNames,
  lengthOptions,
  lessonOptions,
  placeOptions,
  themeOptions,
  type StorySetup,
} from "../storyBuilder";

interface BuilderProps {
  kids: KidProfile[];
  activeKid: KidProfile | null;
  onCreate: (story: Story) => void;
  onBack: () => void;
}

const loadingMessages = [
  "Dreaming up the story...",
  "Choosing the best words...",
  "Asking the companion to join...",
  "Sprinkling in the lesson...",
  "Almost ready...",
];

function LoadingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setMessageIndex((index) => (index + 1) % loadingMessages.length),
      2400,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="gen-overlay" role="status">
      <div className="gen-card">
        <span className="gen-emoji" aria-hidden="true">
          {"\u{1FA84}"}
        </span>
        <p className="gen-message">{loadingMessages[messageIndex]}</p>
        <p className="gen-hint">Magic stories take about half a minute.</p>
      </div>
    </div>
  );
}

function Builder({ kids, activeKid, onCreate, onBack }: BuilderProps) {
  const [setup, setSetup] = useState<StorySetup>(defaultSetup);
  const [heroIds, setHeroIds] = useState<string[]>(activeKid ? [activeKid.id] : []);
  const [loading, setLoading] = useState(false);
  const [aiFailed, setAiFailed] = useState(false);

  const set = <K extends keyof StorySetup>(field: K, value: StorySetup[K]) =>
    setSetup((current) => ({ ...current, [field]: value }));

  const toggleHero = (kidId: string) =>
    setHeroIds((current) =>
      current.includes(kidId)
        ? current.length > 1
          ? current.filter((id) => id !== kidId)
          : current
        : [...current, kidId],
    );

  const heroes = kids.filter((kid) => heroIds.includes(kid.id));

  const theme = themeOptions.find((option) => option.id === setup.themeId) ?? themeOptions[0];
  const companion =
    companionOptions.find((option) => option.id === setup.companionId) ?? companionOptions[0];
  const place = placeOptions.find((option) => option.id === setup.placeId) ?? placeOptions[0];
  const lesson = lessonOptions.find((option) => option.id === setup.lessonId) ?? lessonOptions[0];
  const length = lengthOptions.find((option) => option.id === setup.lengthId) ?? lengthOptions[1];

  const makeStory = async () => {
    setLoading(true);
    setAiFailed(false);
    try {
      const story = await generateAiStory(setup, heroes);
      onCreate(story);
    } catch {
      setLoading(false);
      setAiFailed(true);
    }
  };

  const starring = heroes.length > 0 ? joinNames(heroes.map((kid) => kid.name)) : "Little Hero";

  return (
    <div className="builder" style={{ ["--accent" as string]: theme.accent }}>
      <div className="reader-bar">
        <button type="button" className="link-button" onClick={onBack}>
          &larr; Back
        </button>
        <span className="reader-title">Build a story</span>
        <span className="page-count" />
      </div>

      {kids.length > 0 && (
        <section className="builder-section">
          <h2 className="picker-heading">Who is in this story?</h2>
          <div className="chip-row">
            {kids.map((kid) => (
              <button
                key={kid.id}
                type="button"
                className={heroIds.includes(kid.id) ? "hero-pick selected" : "hero-pick"}
                onClick={() => toggleHero(kid.id)}
                aria-pressed={heroIds.includes(kid.id)}
              >
                <Avatar profile={kid} size={44} />
                <span>{kid.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="builder-section">
        <h2 className="picker-heading">What kind of story?</h2>
        <div className="chip-grid">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={setup.themeId === option.id ? "big-chip selected" : "big-chip"}
              onClick={() => set("themeId", option.id)}
              aria-pressed={setup.themeId === option.id}
            >
              <span className="big-chip-emoji">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="builder-section">
        <h2 className="picker-heading">Who comes along?</h2>
        <div className="chip-grid">
          {companionOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={setup.companionId === option.id ? "big-chip selected" : "big-chip"}
              onClick={() => set("companionId", option.id)}
              aria-pressed={setup.companionId === option.id}
            >
              <span className="big-chip-emoji">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
        {setup.companionId !== "none" && (
          <label className="inline-field">
            Companion's name <span className="optional-tag">optional</span>
            <input
              className="hero-input"
              value={setup.companionName}
              onChange={(event) => set("companionName", event.target.value)}
              placeholder={`e.g. your real ${companion.label.toLowerCase()}'s name`}
              maxLength={24}
              autoComplete="off"
            />
          </label>
        )}
      </section>

      <section className="builder-section">
        <h2 className="picker-heading">Where does it happen?</h2>
        <div className="chip-grid">
          {placeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={setup.placeId === option.id ? "big-chip selected" : "big-chip"}
              onClick={() => set("placeId", option.id)}
              aria-pressed={setup.placeId === option.id}
            >
              <span className="big-chip-emoji">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="builder-section">
        <h2 className="picker-heading">What's the lesson?</h2>
        <div className="chip-grid">
          {lessonOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={setup.lessonId === option.id ? "big-chip selected" : "big-chip"}
              onClick={() => set("lessonId", option.id)}
              aria-pressed={setup.lessonId === option.id}
            >
              <span className="big-chip-emoji">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="builder-section">
        <h2 className="picker-heading">How long a story?</h2>
        <div className="chip-grid">
          {lengthOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={setup.lengthId === option.id ? "big-chip selected" : "big-chip"}
              onClick={() => set("lengthId", option.id)}
              aria-pressed={setup.lengthId === option.id}
            >
              <span className="big-chip-emoji">{option.emoji}</span>
              <span>{option.label}</span>
              <span className="big-chip-sub">
                &asymp; {option.minutes} min &middot; {option.pages} pages
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="builder-section">
        <h2 className="picker-heading">
          Your plot idea or extra details <span className="optional-tag">optional</span>
        </h2>
        <textarea
          className="extra-input"
          value={setup.extra}
          onChange={(event) => set("extra", event.target.value)}
          placeholder="e.g. A treasure hunt for grandma's birthday. They love pancakes. Please avoid mentioning storms."
          rows={3}
          maxLength={500}
        />
        <p className="picker-hint">
          A plot, favourite things, or anything to avoid. Used in magic stories; content rules
          always apply.
        </p>
      </section>

      <div className="builder-summary">
        <p>
          A <strong>{length.label.toLowerCase()}</strong>{" "}
          <strong>{theme.label.toLowerCase()}</strong> at{" "}
          <strong>{place.label.toLowerCase()}</strong>
          {setup.companionId !== "none" && (
            <>
              {" "}
              with <strong>
                {setup.companionName.trim() || `a ${companion.label.toLowerCase()}`}
              </strong>
            </>
          )}
          , about <strong>{lesson.label.toLowerCase()}</strong> &mdash; starring{" "}
          <strong>{starring}</strong>.
        </p>

        {aiFailed ? (
          <div className="ai-fallback">
            <p>
              The story magic isn&rsquo;t reachable right now, but an instant story is ready to
              go.
            </p>
            <div className="finish-actions">
              <button type="button" className="nav-button" onClick={makeStory}>
                Try magic again
              </button>
              <button
                type="button"
                className="nav-button primary"
                onClick={() => onCreate(buildStory(setup, heroes))}
              >
                Make instant story
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="nav-button primary make-story"
            onClick={makeStory}
            disabled={loading}
          >
            {loading ? "Making magic..." : "Make my story"}
          </button>
        )}
      </div>

      {loading && <LoadingOverlay />}
    </div>
  );
}

export default Builder;
