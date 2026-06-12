import { Fragment } from "react";
import { FALLBACK_NAME } from "./stories";

export const heroName = (name: string): string => name.trim() || FALLBACK_NAME;

/** Renders template text with each {name} token shown as a highlighted hero name. */
export function HeroText({ text, name }: { text: string; name: string }) {
  const display = heroName(name);
  const parts = text.split("{name}");

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && <span className="hero-name">{display}</span>}
        </Fragment>
      ))}
    </>
  );
}
