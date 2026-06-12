import { useState } from "react";
import { heroName } from "../HeroText";
import type { KidProfile } from "../profile";
import type { Story } from "../stories";
import {
  buildStory,
  companionOptions,
  defaultSetup,
  lessonOptions,
  placeOptions,
  themeOptions,
  type StorySetup,
} from "../storyBuilder";

interface BuilderProps {
  profile: KidProfile | null;
  onCreate: (story: Story) => void;
  onBack: () => void;
}

function Builder({ profile, onCreate, onBack }: BuilderProps) {
  const [setup, setSetup] = useState<StorySetup>(defaultSetup);

  const set = <K extends keyof StorySetup>(field: K, value: string) =>
    setSetup((current) => ({ ...current, [field]: value }));

  const theme = themeOptions.find((option) => option.id === setup.themeId) ?? themeOptions[0];
  const companion =
    companionOptions.find((option) => option.id === setup.companionId) ?? companionOptions[0];
  const place = placeOptions.find((option) => option.id === setup.placeId) ?? placeOptions[0];
  const lesson = lessonOptions.find((option) => option.id === setup.lessonId) ?? lessonOptions[0];

  return (
    <div className="builder" style={{ ["--accent" as string]: theme.accent }}>
      <div className="reader-bar">
        <button type="button" className="link-button" onClick={onBack}>
          &larr; Back
        </button>
        <span className="reader-title">Build a story</span>
        <span className="page-count" />
      </div>

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

      <div className="builder-summary">
        <p>
          A <strong>{theme.label.toLowerCase()}</strong> at{" "}
          <strong>{place.label.toLowerCase()}</strong> with a{" "}
          <strong>{companion.label.toLowerCase()}</strong>, about{" "}
          <strong>{lesson.label.toLowerCase()}</strong> &mdash; starring{" "}
          <strong>{heroName(profile?.name ?? "")}</strong>.
        </p>
        <button
          type="button"
          className="nav-button primary make-story"
          onClick={() => onCreate(buildStory(setup, profile))}
        >
          Make my story
        </button>
      </div>
    </div>
  );
}

export default Builder;
