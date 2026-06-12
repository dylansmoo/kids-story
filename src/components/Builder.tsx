import { useEffect, useState } from "react";
import { generateAiStory } from "../ai";
import { Avatar } from "../Avatar";
import { artStyleOf, artStyles, type KidProfile } from "../profile";
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

const funFacts = [
  "Octopuses have three hearts!",
  "A giraffe's tongue can be as long as your whole arm.",
  "Honey never goes bad \u2014 even after a thousand years!",
  "Butterflies taste things with their feet.",
  "Sea otters hold hands while they sleep so they don't drift apart.",
  "A group of flamingos is called a flamboyance.",
  "Elephants can't jump \u2014 but they are wonderful swimmers!",
  "Your heart beats about one hundred thousand times every day.",
  "Some snails can nap for three whole years.",
  "A sneeze zooms out faster than a race car.",
  "Some penguins give a pebble to a penguin they like.",
  "The Moon drifts away from Earth as fast as your fingernails grow.",
  "Cows have best friends and feel sad without them.",
  "Lightning is five times hotter than the surface of the Sun.",
  "Dolphins call each other by name with special whistles.",
  "Some frogs freeze solid in winter, then thaw out and hop away in spring!",
  "Bees do a waggle dance to tell their friends where the flowers are.",
  "Tigers have striped skin, not just striped fur.",
  "There are more stars in the sky than grains of sand on every beach on Earth.",
  "Sloths can take a whole month to finish one leaf lunch.",
];

function LoadingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * funFacts.length));

  useEffect(() => {
    const messageTimer = setInterval(
      () => setMessageIndex((index) => (index + 1) % loadingMessages.length),
      2400,
    );
    const factTimer = setInterval(
      () => setFactIndex((index) => (index + 1) % funFacts.length),
      5000,
    );
    return () => {
      clearInterval(messageTimer);
      clearInterval(factTimer);
    };
  }, []);

  return (
    <div className="gen-overlay" role="status">
      <div className="gen-card">
        <span className="gen-emoji" aria-hidden="true">
          {"\u{1FA84}"}
        </span>
        <p className="gen-message">{loadingMessages[messageIndex]}</p>
        <p className="gen-hint">Magic stories take about half a minute.</p>
        <div className="fun-fact">
          <span className="fun-fact-label">Did you know?</span>
          <p className="fun-fact-text">{funFacts[factIndex]}</p>
        </div>
      </div>
    </div>
  );
}

function Builder({ kids, activeKid, onCreate, onBack }: BuilderProps) {
  const [setup, setSetup] = useState<StorySetup>(() => ({
    ...defaultSetup,
    artStyleId: artStyleOf(activeKid).id,
  }));
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

      <p className="picker-hint builder-intro">
        The options are just ideas to get you started &mdash; pick &ldquo;Your own&rdquo; in any
        section to write anything you like.
      </p>

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
        {setup.themeId === "custom" && (
          <label className="inline-field">
            Describe the kind of story
            <input
              className="hero-input"
              value={setup.themeCustom}
              onChange={(event) => set("themeCustom", event.target.value)}
              placeholder="e.g. a pirate treasure hunt"
              maxLength={60}
              autoComplete="off"
            />
          </label>
        )}
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
        {setup.companionId === "custom" && (
          <label className="inline-field">
            Describe your companion
            <input
              className="hero-input"
              value={setup.companionCustom}
              onChange={(event) => set("companionCustom", event.target.value)}
              placeholder="e.g. a rainbow robot dragon"
              maxLength={60}
              autoComplete="off"
            />
          </label>
        )}
        {setup.companionId !== "none" && (
          <label className="inline-field">
            Companion's name <span className="optional-tag">optional</span>
            <input
              className="hero-input"
              value={setup.companionName}
              onChange={(event) => set("companionName", event.target.value)}
              placeholder="e.g. your real pet's name"
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
        {setup.placeId === "custom" && (
          <label className="inline-field">
            Describe the place
            <input
              className="hero-input"
              value={setup.placeCustom}
              onChange={(event) => set("placeCustom", event.target.value)}
              placeholder="e.g. grandma's magical garden"
              maxLength={60}
              autoComplete="off"
            />
          </label>
        )}
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
        {setup.lessonId === "custom" && (
          <label className="inline-field">
            What should the story teach?
            <input
              className="hero-input"
              value={setup.lessonCustom}
              onChange={(event) => set("lessonCustom", event.target.value)}
              placeholder="e.g. being patient while baking"
              maxLength={80}
              autoComplete="off"
            />
          </label>
        )}
      </section>

      <section className="builder-section">
        <h2 className="picker-heading">Illustration style</h2>
        <div className="chip-grid">
          {artStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={setup.artStyleId === style.id ? "big-chip selected" : "big-chip"}
              onClick={() => set("artStyleId", style.id)}
              aria-pressed={setup.artStyleId === style.id}
            >
              {activeKid ? (
                <Avatar profile={{ ...activeKid, artStyle: style.id }} size={48} />
              ) : (
                <span className="big-chip-emoji">{"\u{1F3A8}"}</span>
              )}
              <span>{style.label}</span>
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
        <h2 className="picker-heading">Say-it-together lines?</h2>
        <p className="picker-hint">
          A short line on each page (like &ldquo;Whoosh, whoosh!&rdquo;) for kids to shout along.
        </p>
        <div className="chip-row">
          <button
            type="button"
            className={!setup.readTogether ? "chip selected" : "chip"}
            onClick={() => set("readTogether", false)}
            aria-pressed={!setup.readTogether}
          >
            No, just the story
          </button>
          <button
            type="button"
            className={setup.readTogether ? "chip selected" : "chip"}
            onClick={() => set("readTogether", true)}
            aria-pressed={setup.readTogether}
          >
            Yes, include them
          </button>
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
          <strong>
            {setup.themeId === "custom"
              ? setup.themeCustom.trim() || "your own story"
              : theme.label.toLowerCase()}
          </strong>{" "}
          at{" "}
          <strong>
            {setup.placeId === "custom"
              ? setup.placeCustom.trim() || "your own place"
              : place.label.toLowerCase()}
          </strong>
          {setup.companionId !== "none" && (
            <>
              {" "}
              with{" "}
              <strong>
                {setup.companionName.trim() ||
                  (setup.companionId === "custom"
                    ? setup.companionCustom.trim() || "your own companion"
                    : `a ${companion.label.toLowerCase()}`)}
              </strong>
            </>
          )}
          , about{" "}
          <strong>
            {setup.lessonId === "custom"
              ? setup.lessonCustom.trim() || "your own lesson"
              : lesson.label.toLowerCase()}
          </strong>{" "}
          &mdash; starring <strong>{starring}</strong>.
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
