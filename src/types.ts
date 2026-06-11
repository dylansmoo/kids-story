export type ReadingLevel = "pre-reader" | "early-reader" | "read-aloud";

export type StoryLength = "short" | "medium";

export type StoryTone = "bedtime" | "adventurous" | "silly" | "gentle";

export type StoryTheme =
  | "bravery"
  | "kindness"
  | "responsibility"
  | "sharing"
  | "imagination";

export type IllustrationStyle =
  | "storybook-watercolor"
  | "soft-crayon"
  | "classic-picture-book"
  | "bright-cartoon";

export interface StoryPreferences {
  childName: string;
  childAge: string;
  readingLevel: ReadingLevel;
  favoriteThings: string;
  setting: string;
  companion: string;
  theme: StoryTheme;
  tone: StoryTone;
  length: StoryLength;
  lesson: string;
  illustrationStyle: IllustrationStyle;
  parentValuesFilter: boolean;
  avoidPoliticalThemes: boolean;
  avoidGenderIdeology: boolean;
  avoidScaryContent: boolean;
}

export interface StoryPage {
  title: string;
  text: string;
  illustrationPrompt: string;
  readTogetherLine: string;
}

export interface GeneratedStory {
  title: string;
  subtitle: string;
  guardrails: string[];
  pages: StoryPage[];
}
