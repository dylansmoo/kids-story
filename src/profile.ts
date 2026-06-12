export interface KidProfile {
  id: string;
  name: string;
  age: string;
  gender: "boy" | "girl" | "";
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  glasses: boolean;
  /** Art style for the profile picture and story illustrations. */
  artStyle: string;
}

export interface ArtStyleOption {
  id: string;
  label: string;
  /** Short kid-friendly description shown under the sample. */
  desc: string;
  /** Real generated sample image of this style. */
  thumb: string;
  /** Style sentence used in illustration prompts. */
  prompt: string;
  /** Avatar frame colors. */
  frame: string;
  frameDark: string;
}

export const artStyles: ArtStyleOption[] = [
  {
    id: "watercolor",
    label: "Watercolor",
    desc: "Soft, dreamy paint",
    thumb: "/art-styles/watercolor.jpg",
    prompt:
      "Soft watercolor children's picture book illustration, warm pastel colors, rounded friendly shapes, gentle storybook light, cozy and cheerful mood",
    frame: "#fde8cf",
    frameDark: "#e8b88a",
  },
  {
    id: "crayon",
    label: "Crayon",
    desc: "Waxy hand-drawn strokes",
    thumb: "/art-styles/crayon.jpg",
    prompt:
      "Children's crayon drawing style, waxy textured strokes, bright happy colors, playful hand-drawn look, cheerful and silly mood",
    frame: "#fdf3c0",
    frameDark: "#e8d36a",
  },
  {
    id: "cartoon",
    label: "Cartoon",
    desc: "Bold and bright",
    thumb: "/art-styles/cartoon.jpg",
    prompt:
      "Bright modern cartoon style for preschoolers, bold clean outlines, vivid cheerful colors, big expressive eyes, fun energetic mood",
    frame: "#d4ecf7",
    frameDark: "#7fc4e0",
  },
  {
    id: "papercut",
    label: "Paper craft",
    desc: "Layered cut-out paper",
    thumb: "/art-styles/papercut.jpg",
    prompt:
      "Paper cut-out collage illustration style, layered colored paper shapes with soft shadows, handmade craft look, warm and cozy mood",
    frame: "#e3f0d6",
    frameDark: "#a3c97f",
  },
  {
    id: "clay",
    label: "Clay",
    desc: "Squishy clay characters",
    thumb: "/art-styles/clay.jpg",
    prompt:
      "Claymation style children's illustration, soft plasticine clay characters with visible clay texture, rounded chunky shapes, warm playful lighting, cheerful mood",
    frame: "#f3d2c0",
    frameDark: "#d99b76",
  },
  {
    id: "pixel",
    label: "Pixel",
    desc: "Chunky game pixels",
    thumb: "/art-styles/pixel.jpg",
    prompt:
      "Cute pixel art children's illustration, chunky friendly pixels, bright cheerful retro game palette, simple adorable shapes",
    frame: "#cfe5f5",
    frameDark: "#86b8dd",
  },
  {
    id: "comic",
    label: "Comic",
    desc: "Comic-book pop",
    thumb: "/art-styles/comic.jpg",
    prompt:
      "Kid-friendly comic book illustration style, bold black outlines, gentle halftone dots, vibrant primary colors, playful energy",
    frame: "#fde0a8",
    frameDark: "#e8b04e",
  },
  {
    id: "felt",
    label: "Felt",
    desc: "Soft stitched fabric",
    thumb: "/art-styles/felt.jpg",
    prompt:
      "Handmade felt and fabric craft illustration style, soft stitched fabric textures, plush cozy characters, warm handmade look",
    frame: "#e8ddf3",
    frameDark: "#b393d9",
  },
];

export const artStyleOf = (profile: KidProfile | null): ArtStyleOption =>
  artStyles.find((style) => style.id === profile?.artStyle) ?? artStyles[0];

export interface ColorOption {
  id: string;
  label: string;
  color: string;
  /** Word used when the trait is mentioned inside a story. */
  word?: string;
}

export const skinTones: ColorOption[] = [
  { id: "porcelain", label: "Porcelain", color: "#f8dcc8" },
  { id: "fair", label: "Fair", color: "#f3cba5" },
  { id: "golden", label: "Golden", color: "#e0ac7e" },
  { id: "tan", label: "Tan", color: "#c68a55" },
  { id: "brown", label: "Brown", color: "#9c6238" },
  { id: "deep", label: "Deep", color: "#6e4226" },
];

export const hairColors: ColorOption[] = [
  { id: "black", label: "Black", color: "#2f2a26", word: "black" },
  { id: "brown", label: "Brown", color: "#5d3a1e", word: "brown" },
  { id: "lightbrown", label: "Light brown", color: "#9c6b30", word: "light brown" },
  { id: "blonde", label: "Blonde", color: "#e7bd5e", word: "golden" },
  { id: "red", label: "Red", color: "#b5532c", word: "red" },
];

export interface HairStyleOption {
  id: string;
  label: string;
}

export const hairStyles: HairStyleOption[] = [
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "curly", label: "Curly" },
  { id: "pigtails", label: "Pigtails" },
];

export const ages = ["2", "3", "4", "5", "6", "7", "8"];

export const genders: Array<{ id: "boy" | "girl"; label: string }> = [
  { id: "boy", label: "Boy" },
  { id: "girl", label: "Girl" },
];

export const newKidProfile = (): KidProfile => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `kid-${Date.now()}`,
  name: "",
  age: "5",
  gender: "",
  skinTone: skinTones[1].id,
  hairColor: hairColors[1].id,
  hairStyle: hairStyles[0].id,
  glasses: false,
  artStyle: artStyles[0].id,
});

export const skinColorOf = (profile: KidProfile): string =>
  (skinTones.find((tone) => tone.id === profile.skinTone) ?? skinTones[1]).color;

export const hairColorOf = (profile: KidProfile): string =>
  (hairColors.find((color) => color.id === profile.hairColor) ?? hairColors[1]).color;

export const hairWordOf = (profile: KidProfile): string =>
  (hairColors.find((color) => color.id === profile.hairColor) ?? hairColors[1]).word ?? "soft";

/** "boy" | "girl" | "hero" — used in story endings without pronouns. */
export const kidWordOf = (profile: KidProfile | null): string =>
  profile?.gender === "boy" ? "boy" : profile?.gender === "girl" ? "girl" : "hero";
