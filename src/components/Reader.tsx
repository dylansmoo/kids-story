import { useEffect, useState } from "react";
import { HeroText, heroName } from "../HeroText";
import { personalize, type Story } from "../stories";

interface ReaderProps {
  story: Story;
  name: string;
  onExit: () => void;
}

function Reader({ story, name, onExit }: ReaderProps) {
  // `page` ranges 0..pages.length; the final value shows the celebration screen.
  const [page, setPage] = useState(0);
  const pageCount = story.pages.length;
  const finished = page >= pageCount;

  const goBack = () => setPage((current) => Math.max(0, current - 1));
  const goNext = () => setPage((current) => Math.min(pageCount, current + 1));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goBack();
      if (event.key === "ArrowRight" || event.key === " ") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  const current = finished ? null : story.pages[page];

  return (
    <div className="reader" style={{ ["--accent" as string]: story.accent }}>
      <div className="no-print">
        <div className="reader-bar">
          <button type="button" className="link-button" onClick={onExit}>
            &larr; All stories
          </button>
          <span className="reader-title">
            <HeroText text={story.title} name={name} />
          </span>
          <span className="page-count">
            {finished ? "The end" : `${page + 1} / ${pageCount}`}
          </span>
        </div>

        {current ? (
          <div className="reader-page">
            <div className="reader-illustration" aria-hidden="true">
              {current.emoji}
            </div>
            <p className="reader-text">
              <HeroText text={current.text} name={name} />
            </p>
            <div className="read-aloud">
              <span className="read-aloud-label">Say it together</span>
              <span className="read-aloud-line">
                &ldquo;
                <HeroText text={current.readAloud} name={name} />
                &rdquo;
              </span>
            </div>
          </div>
        ) : (
          <div className="reader-page finish">
            <div className="finish-emoji" aria-hidden="true">
              {"\u{1F389}"} {story.emoji} {"\u{1F389}"}
            </div>
            <h2 className="finish-title">
              Hooray, <span className="hero-name">{heroName(name)}</span>!
            </h2>
            <p className="finish-text">
              You were the hero of <HeroText text={story.title} name={name} />. Great reading
              together!
            </p>
            <div className="finish-actions">
              <button type="button" className="nav-button" onClick={() => setPage(0)}>
                Read again
              </button>
              <button type="button" className="nav-button" onClick={() => window.print()}>
                Print keepsake
              </button>
              <button type="button" className="nav-button primary" onClick={onExit}>
                More stories
              </button>
            </div>
          </div>
        )}

        <div className="progress-dots" role="presentation">
          {story.pages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={
                index === page ? "dot active" : index < page ? "dot done" : "dot"
              }
              onClick={() => setPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {!finished && (
          <div className="reader-controls">
            <button type="button" className="nav-button" onClick={goBack} disabled={page === 0}>
              Back
            </button>
            <button type="button" className="nav-button primary" onClick={goNext}>
              {page === pageCount - 1 ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </div>

      <div className="print-story">
        <div className="print-cover">
          <div className="print-cover-emoji">{story.emoji}</div>
          <h1>{personalize(story.title, name)}</h1>
          <p>A Little Hero Story starring {heroName(name)}</p>
        </div>
        {story.pages.map((storyPage, index) => (
          <div className="print-page" key={index}>
            <div className="print-page-emoji">{storyPage.emoji}</div>
            <p className="print-page-text">{personalize(storyPage.text, name)}</p>
            <p className="print-page-aloud">Say it together: &ldquo;{personalize(storyPage.readAloud, name)}&rdquo;</p>
            <span className="print-page-number">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reader;
