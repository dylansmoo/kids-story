import { useState } from "react";
import { stories, type Story } from "./stories";

function Library({ onSelect }: { onSelect: (story: Story) => void }) {
  return (
    <div className="library">
      <header className="library-header">
        <p className="eyebrow">Little Hero Stories</p>
        <h1>Pick a story to read</h1>
        <p className="subtitle">Choose one of our stories to read together.</p>
      </header>

      <div className="story-grid">
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            className="story-card"
            style={{ ["--accent" as string]: story.accent }}
            onClick={() => onSelect(story)}
          >
            <span className="story-cover" aria-hidden="true">
              {story.emoji}
            </span>
            <span className="story-theme">{story.theme}</span>
            <span className="story-title">{story.title}</span>
            <span className="story-subtitle">{story.subtitle}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Reader({ story, onExit }: { story: Story; onExit: () => void }) {
  const [page, setPage] = useState(0);
  const lastPage = story.pages.length - 1;
  const isFirst = page === 0;
  const isLast = page === lastPage;

  return (
    <div className="reader" style={{ ["--accent" as string]: story.accent }}>
      <div className="reader-bar">
        <button type="button" className="link-button" onClick={onExit}>
          &larr; All stories
        </button>
        <span className="reader-title">{story.title}</span>
        <span className="page-count">
          {page + 1} / {story.pages.length}
        </span>
      </div>

      <div className="reader-page">
        <div className="reader-illustration" aria-hidden="true">
          {story.emoji}
        </div>
        <p className="reader-text">{story.pages[page].text}</p>
      </div>

      <div className="reader-controls">
        <button
          type="button"
          className="nav-button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={isFirst}
        >
          Back
        </button>
        {isLast ? (
          <button type="button" className="nav-button primary" onClick={onExit}>
            Finish
          </button>
        ) : (
          <button
            type="button"
            className="nav-button primary"
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState<Story | null>(null);

  return (
    <main className="app">
      {selected ? (
        <Reader story={selected} onExit={() => setSelected(null)} />
      ) : (
        <Library onSelect={setSelected} />
      )}
    </main>
  );
}

export default App;
