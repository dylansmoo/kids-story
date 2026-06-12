import { artStyleOf, hairWordOf, skinTones, type KidProfile } from "./profile";
import type { Story } from "./stories";
import {
  companionOptions,
  joinNames,
  lengthOptions,
  lessonOptions,
  placeOptions,
  themeOptions,
  type StorySetup,
} from "./storyBuilder";

const describeKid = (profile: KidProfile): string => {
  const skin = (skinTones.find((tone) => tone.id === profile.skinTone) ?? skinTones[1]).label;
  const kidWord = profile.gender === "boy" || profile.gender === "girl" ? profile.gender : "child";
  const glasses = profile.glasses ? ", wearing round glasses" : "";
  return `a ${profile.age || "5"}-year-old ${kidWord} with ${skin.toLowerCase()} skin and ${hairWordOf(
    profile,
  )} ${profile.hairStyle} hair${glasses}`;
};

/** A stable appearance description injected into every illustration prompt. */
export const characterSheet = (kids: KidProfile[]): string => {
  const heroes = kids.filter((kid) => kid.name.trim().length > 0);
  if (heroes.length === 0) return "a happy young child with brown hair";
  if (heroes.length === 1) {
    return `${describeKid(heroes[0])}, always the same character on every page`;
  }
  const described = heroes
    .map((kid, index) => `(${index + 1}) ${describeKid(kid)}`)
    .join("; ");
  return `${heroes.length} children who appear together: ${described}; always the same characters on every page`;
};

const pick = <T extends { id: string }>(options: T[], id: string): T =>
  options.find((option) => option.id === id) ?? options[0];

/** Calls the story API and maps the result onto the app's Story shape. */
export const generateAiStory = async (
  setup: StorySetup,
  kids: KidProfile[],
): Promise<Story> => {
  const theme = pick(themeOptions, setup.themeId);
  const companion = pick(companionOptions, setup.companionId);
  const place = pick(placeOptions, setup.placeId);
  const lesson = pick(lessonOptions, setup.lessonId);
  const length = pick(lengthOptions, setup.lengthId);

  const heroes = kids.filter((kid) => kid.name.trim().length > 0);
  const heroNames = joinNames(heroes.map((kid) => kid.name));
  const petName = setup.companionName.trim();

  const response = await fetch("/api/story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kids: heroes.map((kid) => ({
        name: kid.name.trim(),
        age: kid.age || "5",
        gender: kid.gender,
        description: describeKid(kid),
      })),
      setup: {
        theme: theme.label,
        companion:
          companion.id === "none"
            ? ""
            : petName
              ? `${companion.phrase} named ${petName}`
              : companion.phrase,
        place: place.phrase,
        lesson: lesson.label.toLowerCase(),
        pageCount: length.pages,
        extra: setup.extra.trim(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`story_api_${response.status}`);
  }

  const data = (await response.json()) as {
    title: string;
    subtitle: string;
    pages: Array<{ text: string; readAloud: string; illustration: string }>;
  };

  const fallbackEmojis = [
    theme.emoji,
    place.emoji,
    companion.emoji,
    "\u{1F62E}",
    lesson.emoji,
    "\u{1F389}",
    "\u{1F31F}",
  ];

  return {
    id: `my-${Date.now()}`,
    title: data.title,
    subtitle:
      data.subtitle ||
      (companion.id === "none"
        ? `A ${lesson.label.toLowerCase()} story`
        : `A ${lesson.label.toLowerCase()} story with a ${companion.label.toLowerCase()}`),
    theme: theme.label,
    accent: theme.accent,
    emoji: companion.id === "none" ? theme.emoji : companion.emoji,
    minutes: Math.max(2, Math.round(data.pages.length / 2)),
    heroName: heroNames || undefined,
    kidIds: heroes.map((kid) => kid.id),
    pages: data.pages.map((page, index) => ({
      text: page.text,
      readAloud: page.readAloud,
      emoji: fallbackEmojis[index % fallbackEmojis.length],
      illustration: page.illustration || undefined,
    })),
  };
};

/** Requests one illustration; returns a data URL or null on failure. */
export const illustratePage = async (
  scene: string,
  character: string,
  style: string,
): Promise<string | null> => {
  try {
    const response = await fetch("/api/illustration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scene, character, style }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { image?: string };
    return data.image ?? null;
  } catch {
    return null;
  }
};

/** Shrinks a generated image so saved stories fit comfortably in localStorage. */
export const compressImage = (dataUrl: string, maxSize = 512): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(dataUrl);
        return;
      }
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

export const artStylePrompt = (profile: KidProfile | null): string => artStyleOf(profile).prompt;
