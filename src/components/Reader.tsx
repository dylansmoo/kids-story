import { useEffect, useRef, useState } from "react";
import { narratePage } from "../ai";
import { Avatar } from "../Avatar";
import { HeroText, heroName } from "../HeroText";
import { downloadStoryPdf } from "../pdf";
import type { KidProfile } from "../profile";
import { personalize, type Story } from "../stories";

interface ReaderProps {
  story: Story;
  kids: KidProfile[];
  activeKid: KidProfile | null;
  onExit: () => void;
}

function Reader({ story, kids, activeKid, onExit }: ReaderProps) {
  // `page` ranges 0..pages.length; the final value shows the celebration screen.
  const [page, setPage] = useState(0);
  const pageCount = story.pages.length;
  const finished = page >= pageCount;
  const name = story.heroName ?? activeKid?.name ?? "";

  const heroes = story.kidIds
    ? kids.filter((kid) => story.kidIds?.includes(kid.id))
    : activeKid
      ? [activeKid]
      : [];
  // Highlight each hero's name, plus parts of a joined heroName for deleted profiles.
  const highlightNames = [
    ...heroes.map((kid) => kid.name),
    ...(story.heroName ? story.heroName.split(/,\s*|\s+and\s+/) : []),
  ];

  const goBack = () => setPage((current) => Math.max(0, current - 1));
  const goNext = () => setPage((current) => Math.min(pageCount, current + 1));

  // Read-aloud narration for the current page.
  const audioCache = useRef<Map<number, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [narrating, setNarrating] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const stopNarration = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setNarrating(false);
  };

  const toggleNarration = async () => {
    if (narrating) {
      stopNarration();
      return;
    }
    const pageIndex = page;
    let url = audioCache.current.get(pageIndex) ?? null;
    if (!url) {
      setAudioLoading(true);
      url = await narratePage(personalize(story.pages[pageIndex].text, name));
      setAudioLoading(false);
      if (url) audioCache.current.set(pageIndex, url);
    }
    if (!url) return;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setNarrating(false);
    void audio.play();
    setNarrating(true);
  };

  // Stop audio when the page changes or the reader closes.
  useEffect(() => {
    stopNarration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  useEffect(() => () => stopNarration(), []);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      await downloadStoryPdf(story, name);
    } finally {
      setDownloading(false);
    }
  };

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
            <HeroText text={story.title} name={name} highlightNames={highlightNames} />
          </span>
          <span className="page-count">
            {finished ? "The end" : `${page + 1} / ${pageCount}`}
          </span>
        </div>

        {current ? (
          <div className="reader-page">
            <div className="reader-illustration" aria-hidden="true">
              {current.image ? (
                <img className="scene-img" src={current.image} alt="" />
              ) : (
                <>
                  <span className="scene-emoji">{current.emoji}</span>
                  {current.illustration && (
                    <span className="painting-note">{"\u{1F3A8}"} painting this page...</span>
                  )}
                </>
              )}
              {heroes.length > 0 && (
                <span className="scene-avatar">
                  {heroes.map((kid) => (
                    <Avatar key={kid.id} profile={kid} size={heroes.length > 1 ? 64 : 84} />
                  ))}
                </span>
              )}
            </div>
            <button
              type="button"
              className="narrate-button"
              onClick={toggleNarration}
              disabled={audioLoading}
              aria-label={narrating ? "Stop reading aloud" : "Read this page to me"}
              title={narrating ? "Stop" : "Read to me"}
            >
              {audioLoading ? "\u23F3" : narrating ? "\u23F8\u{FE0F}" : "\u{1F50A}"}
            </button>
            <p className="reader-text">
              <HeroText text={current.text} name={name} highlightNames={highlightNames} />
            </p>
            {story.readTogether !== false && (
              <div className="read-aloud">
                <span className="read-aloud-label">Say it together</span>
                <span className="read-aloud-line">
                  &ldquo;
                  <HeroText text={current.readAloud} name={name} highlightNames={highlightNames} />
                  &rdquo;
                </span>
              </div>
            )}
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
              You were the hero{heroes.length > 1 ? "es" : ""} of{" "}
              <HeroText text={story.title} name={name} highlightNames={highlightNames} />. Great
              reading together!
            </p>
            <div className="finish-actions">
              <button type="button" className="nav-button" onClick={() => setPage(0)}>
                Read again
              </button>
              <button type="button" className="nav-button" onClick={() => window.print()}>
                Print
              </button>
              <button type="button" className="nav-button" onClick={downloadPdf} disabled={downloading}>
                {downloading ? "Making PDF..." : "Download PDF"}
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
            {storyPage.image ? (
              <img className="print-page-img" src={storyPage.image} alt="" />
            ) : (
              <div className="print-page-emoji">{storyPage.emoji}</div>
            )}
            <p className="print-page-text">{personalize(storyPage.text, name)}</p>
            {story.readTogether !== false && (
              <p className="print-page-aloud">
                Say it together: &ldquo;{personalize(storyPage.readAloud, name)}&rdquo;
              </p>
            )}
            <span className="print-page-number">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reader;
