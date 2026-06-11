import type {
  GeneratedStory,
  IllustrationStyle,
  ReadingLevel,
  StoryPreferences,
  StoryTheme,
  StoryTone,
} from "./types";

const themeDetails: Record<
  StoryTheme,
  { noun: string; lesson: string; challenge: string; treasure: string }
> = {
  bravery: {
    noun: "bravery",
    lesson: "being brave means doing the right thing even when it feels big",
    challenge: "a tiny bridge that looked taller than it was",
    treasure: "a golden badge of courage",
  },
  kindness: {
    noun: "kindness",
    lesson: "a kind heart can make a hard day softer",
    challenge: "a lost little friend who needed help",
    treasure: "a basket of warm thank-you stars",
  },
  responsibility: {
    noun: "responsibility",
    lesson: "small helpers can do important things",
    challenge: "a wobbly wagon full of important packages",
    treasure: "a blue ribbon for being dependable",
  },
  sharing: {
    noun: "sharing",
    lesson: "good things feel brighter when they are shared",
    challenge: "one shiny picnic blanket and many hungry guests",
    treasure: "a table full of happy treats",
  },
  imagination: {
    noun: "imagination",
    lesson: "a good imagination can turn an ordinary day into a grand adventure",
    challenge: "a plain cardboard box waiting to become something wonderful",
    treasure: "a map to a make-believe kingdom",
  },
};

const toneOpeners: Record<StoryTone, string> = {
  bedtime: "When the moon peeked through the curtains",
  adventurous: "One bright morning, just after breakfast",
  silly: "On a giggly afternoon when socks kept sliding away",
  gentle: "On a quiet day with soft clouds overhead",
};

const toneEndings: Record<StoryTone, string> = {
  bedtime: "The room grew cozy, the stars blinked good night, and the adventure tucked itself away until tomorrow.",
  adventurous: "The day ended with muddy shoes, a proud smile, and one more story to tell.",
  silly: "Everyone laughed so hard that even the teapot gave a tiny whistle.",
  gentle: "The world felt peaceful, and the happy lesson stayed warm in every heart.",
};

const illustrationStyles: Record<IllustrationStyle, string> = {
  "storybook-watercolor": "warm watercolor picture-book style",
  "soft-crayon": "soft crayon texture with rounded shapes",
  "classic-picture-book": "classic illustrated picture-book style",
  "bright-cartoon": "bright friendly cartoon style",
};

const readingLevelNotes: Record<ReadingLevel, string> = {
  "pre-reader": "short read-aloud lines, repeated phrases, and simple words",
  "early-reader": "simple sentences with repeated words a child can help read",
  "read-aloud": "slightly richer read-aloud language for a parent-led story",
};

export const defaultPreferences: StoryPreferences = {
  childName: "Milo",
  childAge: "5",
  readingLevel: "early-reader",
  favoriteThings: "dinosaurs, red boots, pancakes",
  setting: "a sunny backyard",
  companion: "a loyal puppy named Scout",
  theme: "bravery",
  tone: "adventurous",
  length: "short",
  lesson: "tell the truth and help others",
  illustrationStyle: "storybook-watercolor",
  parentValuesFilter: true,
  avoidPoliticalThemes: true,
  avoidGenderIdeology: true,
  avoidScaryContent: true,
};

const sanitize = (value: string, fallback: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const firstFavorite = (favoriteThings: string) => {
  const [first] = favoriteThings
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return first ?? "favorite things";
};

const makeReadTogetherLine = (name: string, theme: StoryTheme) => {
  const themeWord = themeDetails[theme].noun;
  return `${name} can say: "I can choose ${themeWord}!"`;
};

const buildGuardrails = (preferences: StoryPreferences) => {
  const guardrails = [
    `Written for age ${sanitize(preferences.childAge, "under 7")} with ${readingLevelNotes[preferences.readingLevel]}.`,
    "Uses the child's name naturally instead of asking for pronouns.",
    "Keeps the story warm, wholesome, and parent-guided.",
  ];

  if (preferences.parentValuesFilter) {
    guardrails.push("Parent values filter: classic, family-friendly storytelling with no lectures.");
  }

  if (preferences.avoidPoliticalThemes) {
    guardrails.push("Avoids political, activist, or modern social-issue themes.");
  }

  if (preferences.avoidGenderIdeology) {
    guardrails.push("Avoids gender ideology and sexuality themes.");
  }

  if (preferences.avoidScaryContent) {
    guardrails.push("Avoids scary imagery, peril, and harsh conflict.");
  }

  return guardrails;
};

export const generateStory = (preferences: StoryPreferences): GeneratedStory => {
  const childName = sanitize(preferences.childName, "Your Little Hero");
  const setting = sanitize(preferences.setting, "a sunny backyard");
  const companion = sanitize(preferences.companion, "a friendly helper");
  const favorite = firstFavorite(preferences.favoriteThings);
  const lesson = sanitize(preferences.lesson, themeDetails[preferences.theme].lesson);
  const theme = themeDetails[preferences.theme];
  const illustrationStyle = illustrationStyles[preferences.illustrationStyle];
  const pageCount = preferences.length === "short" ? 6 : 8;

  const basePages = [
    {
      title: "A Little Hero Wakes Up",
      text: `${toneOpeners[preferences.tone]}, ${childName} found a tiny note beside ${favorite}. It said, "Today needs a helper with ${theme.noun}."`,
      illustrationPrompt: `${illustrationStyle}; ${childName} smiling in ${setting}, discovering a tiny note near ${favorite}; cozy and cheerful.`,
      readTogetherLine: makeReadTogetherLine(childName, preferences.theme),
    },
    {
      title: "The Map Begins",
      text: `${childName} tucked the note away and met ${companion}. Together they followed a dotted map through ${setting}.`,
      illustrationPrompt: `${illustrationStyle}; ${childName} and ${companion} following a dotted map through ${setting}; friendly path, soft light.`,
      readTogetherLine: `${childName} can point and say: "This way!"`,
    },
    {
      title: "A Small Problem",
      text: `Soon they found ${theme.challenge}. ${childName} took one careful breath and remembered: ${theme.lesson}.`,
      illustrationPrompt: `${illustrationStyle}; a very gentle version of ${theme.challenge}; ${childName} pausing calmly with ${companion} nearby.`,
      readTogetherLine: `${childName} can say: "I can try."`,
    },
    {
      title: "The Helper's Choice",
      text: `${childName} chose to ${lesson}. Step by step, the problem became smaller and the smiles became bigger.`,
      illustrationPrompt: `${illustrationStyle}; ${childName} making a good choice, helping in a wholesome child-safe scene; bright smiles.`,
      readTogetherLine: `${childName} can say: "Good choices help!"`,
    },
    {
      title: "The Happy Surprise",
      text: `At the end of the path, ${childName} found ${theme.treasure}. It was not just for one person. It was for everyone to enjoy.`,
      illustrationPrompt: `${illustrationStyle}; ${childName} finding ${theme.treasure}; joyful, colorful, no scary elements.`,
      readTogetherLine: `${childName} can say: "Hooray!"`,
    },
    {
      title: "Home With a Brave Heart",
      text: `${childName} came home with a proud smile. ${toneEndings[preferences.tone]}`,
      illustrationPrompt: `${illustrationStyle}; ${childName} returning home to a cozy family-friendly scene; warm ending, bedtime-safe.`,
      readTogetherLine: `${childName} can say: "The end!"`,
    },
    {
      title: "One More Kind Thing",
      text: `Before supper, ${childName} used the lesson again in one small way. A small good thing made the whole room brighter.`,
      illustrationPrompt: `${illustrationStyle}; ${childName} doing one simple helpful task at home; wholesome and calm.`,
      readTogetherLine: `${childName} can say: "I can help."`,
    },
    {
      title: "Tomorrow's Adventure",
      text: `That night, ${childName} wondered where the next map might lead. Maybe tomorrow would need another little hero.`,
      illustrationPrompt: `${illustrationStyle}; moonlit bedroom with a tiny map on a nightstand; peaceful, cozy, child-safe.`,
      readTogetherLine: `${childName} can whisper: "Tomorrow!"`,
    },
  ];

  return {
    title: `${childName} and the ${theme.treasure.replace(/^a |^an |^the /i, "")}`,
    subtitle: `A ${preferences.tone} story about ${theme.noun}`,
    guardrails: buildGuardrails(preferences),
    pages: basePages.slice(0, pageCount),
  };
};
