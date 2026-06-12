export interface KidProfile {
  id: string;
  name: string;
  age: string;
  gender: "boy" | "girl" | "";
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  glasses: boolean;
}

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
