import { useMemo, useState } from "react";
import { defaultPreferences, generateStory } from "./storyGenerator";
import type {
  IllustrationStyle,
  ReadingLevel,
  StoryLength,
  StoryPreferences,
  StoryTheme,
  StoryTone,
} from "./types";

const readingLevels: Array<{ value: ReadingLevel; label: string; helper: string }> = [
  {
    value: "pre-reader",
    label: "Pre-reader",
    helper: "Parent reads aloud, child joins repeated lines.",
  },
  {
    value: "early-reader",
    label: "Early reader",
    helper: "Simple words and short read-together lines.",
  },
  {
    value: "read-aloud",
    label: "Read-aloud",
    helper: "A richer story led by the parent.",
  },
];

const tones: Array<{ value: StoryTone; label: string }> = [
  { value: "bedtime", label: "Bedtime calm" },
  { value: "adventurous", label: "Adventure" },
  { value: "silly", label: "Silly fun" },
  { value: "gentle", label: "Gentle and sweet" },
];

const themes: Array<{ value: StoryTheme; label: string }> = [
  { value: "bravery", label: "Bravery" },
  { value: "kindness", label: "Kindness" },
  { value: "responsibility", label: "Responsibility" },
  { value: "sharing", label: "Sharing" },
  { value: "imagination", label: "Imagination" },
];

const illustrationStyles: Array<{ value: IllustrationStyle; label: string }> = [
  { value: "storybook-watercolor", label: "Storybook watercolor" },
  { value: "soft-crayon", label: "Soft crayon" },
  { value: "classic-picture-book", label: "Classic picture book" },
  { value: "bright-cartoon", label: "Bright cartoon" },
];

const updateText =
  <K extends keyof StoryPreferences>(
    setPreferences: React.Dispatch<React.SetStateAction<StoryPreferences>>,
    field: K,
  ) =>
  (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPreferences((current) => ({ ...current, [field]: event.target.value }));
  };

const updateCheckbox =
  <K extends keyof StoryPreferences>(
    setPreferences: React.Dispatch<React.SetStateAction<StoryPreferences>>,
    field: K,
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences((current) => ({ ...current, [field]: event.target.checked }));
  };

function App() {
  const [preferences, setPreferences] = useState<StoryPreferences>(defaultPreferences);
  const story = useMemo(() => generateStory(preferences), [preferences]);

  const applyTemplate = (tone: StoryTone, theme: StoryTheme, setting: string) => {
    setPreferences((current) => ({
      ...current,
      tone,
      theme,
      setting,
    }));
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">MVP concept</p>
          <h1>Little Hero Stories</h1>
          <p className="hero-text">
            A parent-guided story builder for kids under 7. Gather a few details, keep the
            content classic and wholesome, then preview a personalized illustrated story where
            the child is the hero.
          </p>
          <div className="hero-actions">
            <a href="#builder" className="button button-primary">
              Build a story
            </a>
            <a href="#guardrails" className="button button-secondary">
              See content filter
            </a>
          </div>
        </div>

        <div className="hero-card" aria-label="Story preview sample">
          <div className="book-cover">
            <span className="cover-sun" />
            <span className="cover-cloud cover-cloud-one" />
            <span className="cover-cloud cover-cloud-two" />
            <div className="cover-title">
              <span>Custom</span>
              <strong>Picture Book</strong>
            </div>
          </div>
          <div>
            <p className="card-kicker">Designed for</p>
            <ul className="mini-list">
              <li>Parent read-alouds</li>
              <li>Simple repeat lines</li>
              <li>Wholesome lessons</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mvp-strip" aria-label="MVP workflow">
        <div>
          <span>1</span>
          <strong>Parent details</strong>
          <p>Name, age, favorites, setting, helper.</p>
        </div>
        <div>
          <span>2</span>
          <strong>Values filter</strong>
          <p>Keep stories classic, safe, and parent-approved.</p>
        </div>
        <div>
          <span>3</span>
          <strong>Story preview</strong>
          <p>Page text, read-together line, illustration note.</p>
        </div>
      </section>

      <section id="builder" className="builder-grid">
        <form className="panel form-panel">
          <div className="panel-heading">
            <p className="eyebrow">Parent intake</p>
            <h2>Create the first draft</h2>
            <p>
              The MVP keeps the form short and avoids open-ended prompting. Parents guide the
              story through simple, safe choices.
            </p>
          </div>

          <div className="quick-starts" aria-label="Story templates">
            <button
              type="button"
              onClick={() => applyTemplate("bedtime", "kindness", "a cozy moonlit bedroom")}
            >
              Bedtime kindness
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("adventurous", "bravery", "a sunny backyard")}
            >
              Backyard adventure
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("silly", "imagination", "a blanket fort kingdom")}
            >
              Silly imagination
            </button>
          </div>

          <div className="form-section">
            <h3>Child details</h3>
            <div className="field-grid">
              <label>
                Child's first name
                <input
                  value={preferences.childName}
                  onChange={updateText(setPreferences, "childName")}
                  placeholder="Milo"
                />
              </label>
              <label>
                Age
                <input
                  value={preferences.childAge}
                  onChange={updateText(setPreferences, "childAge")}
                  inputMode="numeric"
                  placeholder="5"
                />
              </label>
            </div>

            <fieldset>
              <legend>Reading support</legend>
              <div className="choice-list">
                {readingLevels.map((level) => (
                  <label key={level.value} className="radio-card">
                    <input
                      type="radio"
                      name="readingLevel"
                      value={level.value}
                      checked={preferences.readingLevel === level.value}
                      onChange={updateText(setPreferences, "readingLevel")}
                    />
                    <span>
                      <strong>{level.label}</strong>
                      <small>{level.helper}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="form-section">
            <h3>Story ingredients</h3>
            <label>
              Favorite things
              <textarea
                value={preferences.favoriteThings}
                onChange={updateText(setPreferences, "favoriteThings")}
                rows={3}
                placeholder="dinosaurs, pancakes, red boots"
              />
            </label>
            <div className="field-grid">
              <label>
                Main setting
                <input
                  value={preferences.setting}
                  onChange={updateText(setPreferences, "setting")}
                  placeholder="a sunny backyard"
                />
              </label>
              <label>
                Friendly companion
                <input
                  value={preferences.companion}
                  onChange={updateText(setPreferences, "companion")}
                  placeholder="a loyal puppy named Scout"
                />
              </label>
            </div>
            <div className="field-grid">
              <label>
                Story lesson
                <input
                  value={preferences.lesson}
                  onChange={updateText(setPreferences, "lesson")}
                  placeholder="tell the truth and help others"
                />
              </label>
              <label>
                Length
                <select
                  value={preferences.length}
                  onChange={updateText(setPreferences, "length")}
                >
                  <option value={"short" satisfies StoryLength}>Short: 6 pages</option>
                  <option value={"medium" satisfies StoryLength}>Medium: 8 pages</option>
                </select>
              </label>
            </div>
            <div className="field-grid">
              <label>
                Theme
                <select value={preferences.theme} onChange={updateText(setPreferences, "theme")}>
                  {themes.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tone
                <select value={preferences.tone} onChange={updateText(setPreferences, "tone")}>
                  {tones.map((tone) => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Illustration style
              <select
                value={preferences.illustrationStyle}
                onChange={updateText(setPreferences, "illustrationStyle")}
              >
                {illustrationStyles.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div id="guardrails" className="form-section guardrail-box">
            <div>
              <p className="eyebrow">Parent values filter</p>
              <h3>Content boundaries</h3>
              <p>
                The MVP makes the default story classic, family-friendly, non-political, and
                focused on imagination, character, family, friendship, and parent-approved lessons.
              </p>
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={preferences.parentValuesFilter}
                onChange={updateCheckbox(setPreferences, "parentValuesFilter")}
              />
              <span>Use classic wholesome storytelling with no moral lectures.</span>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={preferences.avoidPoliticalThemes}
                onChange={updateCheckbox(setPreferences, "avoidPoliticalThemes")}
              />
              <span>Avoid political, activist, and modern social-issue themes.</span>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={preferences.avoidGenderIdeology}
                onChange={updateCheckbox(setPreferences, "avoidGenderIdeology")}
              />
              <span>Avoid gender ideology and sexuality themes.</span>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={preferences.avoidScaryContent}
                onChange={updateCheckbox(setPreferences, "avoidScaryContent")}
              />
              <span>Avoid scary images, harsh conflict, or unsafe situations.</span>
            </label>
          </div>
        </form>

        <section className="panel preview-panel" aria-live="polite">
          <div className="panel-heading">
            <p className="eyebrow">Generated draft</p>
            <h2>{story.title}</h2>
            <p>{story.subtitle}</p>
          </div>

          <div className="storybook-meta">
            {story.guardrails.map((guardrail) => (
              <span key={guardrail}>{guardrail}</span>
            ))}
          </div>

          <div className="storybook">
            {story.pages.map((page, index) => (
              <article className="story-page" key={`${page.title}-${index}`}>
                <div className="page-illustration" aria-hidden="true">
                  <div className="illustration-sky" />
                  <div className="illustration-hill" />
                  <div className="illustration-character">{preferences.childName.slice(0, 1)}</div>
                </div>
                <div className="page-copy">
                  <span className="page-number">Page {index + 1}</span>
                  <h3>{page.title}</h3>
                  <p>{page.text}</p>
                  <blockquote>{page.readTogetherLine}</blockquote>
                  <details>
                    <summary>Illustration note</summary>
                    <p>{page.illustrationPrompt}</p>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="next-steps panel">
        <div>
          <p className="eyebrow">What this MVP proves</p>
          <h2>Ready for real generation later</h2>
        </div>
        <ul>
          <li>Parent intake can be completed without asking for pronouns.</li>
          <li>Content boundaries are visible and can become backend prompt rules.</li>
          <li>Story output is structured page-by-page for future image generation.</li>
          <li>Each page includes a child participation line for early readers.</li>
        </ul>
      </section>
    </main>
  );
}

export default App;
