import { Fragment } from "react";
import { FALLBACK_NAME } from "./stories";

export const heroName = (name: string): string => name.trim() || FALLBACK_NAME;

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Renders story text: substitutes the {name} token (template stories), then
 * highlights every hero name that appears (AI stories use real names directly).
 */
export function HeroText({
  text,
  name,
  highlightNames,
}: {
  text: string;
  name: string;
  highlightNames?: string[];
}) {
  const display = heroName(name);
  const substituted = text.replaceAll("{name}", display);

  const names = [
    ...new Set(
      [display, ...(highlightNames ?? [])].map((n) => n.trim()).filter((n) => n.length > 0),
    ),
  ];

  if (names.length === 0) {
    return <>{substituted}</>;
  }

  const pattern = new RegExp(`\\b(${names.map(escapeRegex).join("|")})\\b`, "g");
  const parts = substituted.split(pattern);

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {names.includes(part) ? <span className="hero-name">{part}</span> : part}
        </Fragment>
      ))}
    </>
  );
}
