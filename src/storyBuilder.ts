import { artStyleOf, artStyles, hairWordOf, type KidProfile } from "./profile";
import type { Story, StoryPage } from "./stories";

/** Illustration style prompt: per-story choice, else the lead kid's profile style. */
export const resolveArtStyle = (
  setup: { artStyleId: string },
  leadKid: KidProfile | null,
): string =>
  (artStyles.find((style) => style.id === setup.artStyleId) ?? artStyleOf(leadKid)).prompt;

export interface ThemeOption {
  id: string;
  label: string;
  emoji: string;
  accent: string;
}

export interface CompanionOption {
  id: string;
  label: string;
  emoji: string;
  /** Phrase used in sentences, e.g. "little puppy". Empty for "none". */
  phrase: string;
  /** A playful thing the companion does mid-story. */
  antic: string;
}

export interface PlaceOption {
  id: string;
  label: string;
  emoji: string;
  /** Phrase used in sentences, e.g. "the sunny backyard". */
  phrase: string;
  /** A sensory line describing the place. */
  sight: string;
}

export interface LessonOption {
  id: string;
  label: string;
  emoji: string;
  /** Challenge line; companionRef is e.g. "the little puppy" / "Scout", or null when no companion. */
  challenge: (companionRef: string | null) => string;
  choice: string;
  cheer: string;
  moral: string;
}

export const themeOptions: ThemeOption[] = [
  { id: "adventure", label: "Big Adventure", emoji: "\u{1F5FA}\u{FE0F}", accent: "#f4724b" },
  { id: "bedtime", label: "Sleepy Bedtime", emoji: "\u{1F319}", accent: "#8b7fd4" },
  { id: "imagination", label: "Make-Believe", emoji: "\u{2728}", accent: "#2fa897" },
  { id: "helping", label: "Helper Day", emoji: "\u{1F9FA}", accent: "#c75fa8" },
];

/** Standard options are idea-starters; "custom" lets parents write their own. */
export const companionOptions: CompanionOption[] = [
  { id: "puppy", label: "Puppy", emoji: "\u{1F436}", phrase: "little puppy", antic: "chased its own waggly tail" },
  { id: "kitten", label: "Kitten", emoji: "\u{1F431}", phrase: "fluffy kitten", antic: "pounced on a dancing leaf" },
  { id: "dragon", label: "Dragon", emoji: "\u{1F432}", phrase: "friendly dragon", antic: "blew a tiny, warm smoke ring" },
  { id: "fairy", label: "Fairy", emoji: "\u{1F9DA}", phrase: "kind little fairy", antic: "sprinkled a puff of sparkly dust" },
  { id: "dino", label: "Dinosaur", emoji: "\u{1F995}", phrase: "baby dinosaur", antic: "stomped one tiny, happy stomp" },
  { id: "none", label: "No companion", emoji: "\u{1F31F}", phrase: "", antic: "" },
  { id: "custom", label: "Your own", emoji: "\u{270F}\u{FE0F}", phrase: "", antic: "did something wonderfully silly" },
];

export const placeOptions: PlaceOption[] = [
  {
    id: "backyard",
    label: "Sunny Backyard",
    emoji: "\u{1F333}",
    phrase: "the sunny backyard",
    sight: "Flowers nodded hello and a butterfly came along to visit.",
  },
  {
    id: "beach",
    label: "Sparkly Beach",
    emoji: "\u{1F3D6}\u{FE0F}",
    phrase: "the sparkly beach",
    sight: "Waves went swish, swish, and the sand tickled ten little toes.",
  },
  {
    id: "forest",
    label: "Friendly Forest",
    emoji: "\u{1F332}",
    phrase: "the friendly forest",
    sight: "Tall trees waved their leafy arms and squirrels peeked out to say hello.",
  },
  {
    id: "castle",
    label: "Toy Castle",
    emoji: "\u{1F3F0}",
    phrase: "the toy castle on the hill",
    sight: "Flags fluttered from the towers and the gate creaked open just for them.",
  },
  {
    id: "space",
    label: "Outer Space",
    emoji: "\u{1F680}",
    phrase: "outer space",
    sight: "Stars twinkled like night-lights and a comet zoomed past with a whoosh.",
  },
  {
    id: "custom",
    label: "Your own",
    emoji: "\u{270F}\u{FE0F}",
    phrase: "",
    sight: "It was even better than they imagined. Wonderful things waited everywhere.",
  },
];

export const lessonOptions: LessonOption[] = [
  {
    id: "brave",
    label: "Being brave",
    emoji: "\u{1F4AA}",
    challenge: (companionRef) =>
      companionRef
        ? `Suddenly the way ahead looked big and dark. ${cap(companionRef)} hid behind {name}.`
        : "Suddenly the way ahead looked big and dark. {name} stopped and looked and looked.",
    choice: "{name} took one deep breath and one careful step. Then another. Brave hearts go first!",
    cheer: "I can be brave!",
    moral: "Being brave means trying even when something feels big.",
  },
  {
    id: "kind",
    label: "Being kind",
    emoji: "\u{2764}\u{FE0F}",
    challenge: () =>
      "Then they heard a tiny sniffle. A little friend was sitting all alone, feeling sad.",
    choice: "{name} sat down close and shared a warm, friendly smile. \u201CWant to play with us?\u201D",
    cheer: "Kind hearts help!",
    moral: "A little kindness can turn a sad day into a sunny one.",
  },
  {
    id: "share",
    label: "Sharing",
    emoji: "\u{1F91D}",
    challenge: () =>
      "There was only one yummy snack left in the backpack \u2014 and everyone was hungry.",
    choice:
      "{name} broke the snack into pieces, one for every friend. \u201CThere is enough for everyone!\u201D",
    cheer: "Share, share, share!",
    moral: "Good things feel even better when they are shared.",
  },
  {
    id: "friends",
    label: "Making friends",
    emoji: "\u{1F44B}",
    challenge: () =>
      "A new face peeked out, looking shy. Making a new friend felt a little wobbly.",
    choice: "{name} waved and said, \u201CHi! Want to play with us?\u201D Wobbly turned into wonderful.",
    cheer: "Hi, new friend!",
    moral: "Saying hello is how every friendship begins.",
  },
  {
    id: "resilience",
    label: "Bouncing back",
    emoji: "\u{1F308}",
    challenge: () =>
      "Whoops! The plan flopped. For a moment everything felt upside down.",
    choice:
      "{name} took a big breath, gave a little shake, and said, \u201CThat's okay. Let's try another way!\u201D",
    cheer: "Bounce back up!",
    moral: "When things go wrong, brave hearts bounce back and try another way.",
  },
  {
    id: "custom",
    label: "Your own",
    emoji: "\u{270F}\u{FE0F}",
    challenge: () =>
      "Then came a tricky moment that made everyone stop and think.",
    choice: "{name} took a big breath and remembered what mattered most.",
    cheer: "We can do it!",
    moral: "Every day is a chance to learn something wonderful.",
  },
];

export interface LengthOption {
  id: string;
  label: string;
  emoji: string;
  /** AI story shape. */
  pages: number;
  wordsPerPage: number;
  minutes: number;
}

export const lengthOptions: LengthOption[] = [
  { id: "short", label: "Short", emoji: "\u{1F401}", pages: 8, wordsPerPage: 55, minutes: 5 },
  { id: "medium", label: "Medium", emoji: "\u{1F430}", pages: 12, wordsPerPage: 70, minutes: 10 },
  { id: "long", label: "Long", emoji: "\u{1F418}", pages: 16, wordsPerPage: 80, minutes: 15 },
];

export interface StorySetup {
  themeId: string;
  companionId: string;
  /** Optional name the parent gave the companion (e.g. the family dog's name). */
  companionName: string;
  /** Parent-written companion when companionId is "custom". */
  companionCustom: string;
  placeId: string;
  /** Parent-written place when placeId is "custom". */
  placeCustom: string;
  lessonId: string;
  /** Parent-written lesson when lessonId is "custom". */
  lessonCustom: string;
  lengthId: string;
  /** Illustration style for this story (art style id). */
  artStyleId: string;
  /** Optional free-text details; used by AI generation only. */
  extra: string;
}

export const defaultSetup: StorySetup = {
  themeId: themeOptions[0].id,
  companionId: companionOptions[0].id,
  companionName: "",
  companionCustom: "",
  placeId: placeOptions[0].id,
  placeCustom: "",
  lessonId: lessonOptions[0].id,
  lessonCustom: "",
  lengthId: lengthOptions[1].id,
  artStyleId: "",
  extra: "",
};

const stripArticle = (text: string): string =>
  text.trim().replace(/^(a|an|the)\s+/i, "");

const cap = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const pick = <T extends { id: string }>(options: T[], id: string): T =>
  options.find((option) => option.id === id) ?? options[0];

/** Joins kid names into natural English: "Tim", "Tim and Ava", "Tim, Ava and Sam". */
export const joinNames = (names: string[]): string => {
  const clean = names.map((name) => name.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(", ")} and ${clean[clean.length - 1]}`;
};

/** Assembles a complete personalized story from the parent's selections. */
export const buildStory = (setup: StorySetup, kids: KidProfile[]): Story => {
  const theme = pick(themeOptions, setup.themeId);
  const companion = pick(companionOptions, setup.companionId);
  const place = pick(placeOptions, setup.placeId);
  const lesson = pick(lessonOptions, setup.lessonId);
  const length = pick(lengthOptions, setup.lengthId);

  const heroes = kids.filter((kid) => kid.name.trim().length > 0);
  const multi = heroes.length > 1;
  const heroNames = joinNames(heroes.map((kid) => kid.name));

  const hasCompanion = companion.id !== "none";
  const companionPhrase =
    companion.id === "custom"
      ? stripArticle(setup.companionCustom) || "little friend"
      : companion.phrase;
  const petName = setup.companionName.trim();
  // "Scout" once named, otherwise "the little puppy".
  const ref = hasCompanion ? (petName || `the ${companionPhrase}`) : null;
  const refIntro = hasCompanion
    ? petName
      ? `${petName} the ${companionPhrase}`
      : `the ${companionPhrase}`
    : null;

  const placePhrase =
    place.id === "custom" ? setup.placeCustom.trim() || "a wonderful place" : place.phrase;
  const placeLabel =
    place.id === "custom" ? cap(stripArticle(placePhrase)) : place.label;

  const lessonCustom = setup.lessonCustom.trim().replace(/\.+$/, "");
  const lessonChoice =
    lesson.id === "custom" && lessonCustom
      ? `{name} took a big breath and remembered what mattered: ${lessonCustom.toLowerCase()}. And that made all the difference.`
      : lesson.choice;
  const lessonMoral =
    lesson.id === "custom" && lessonCustom ? `${cap(lessonCustom)}.` : lesson.moral;

  const kidWord = multi
    ? "heroes"
    : heroes[0]?.gender === "boy"
      ? "boy"
      : heroes[0]?.gender === "girl"
        ? "girl"
        : "hero";
  const hairWord = heroes[0] ? hairWordOf(heroes[0]) : "soft";
  const glassesBit = heroes[0]?.glasses ? " pushed up two round glasses," : "";

  let opener: string;
  let openCheer: string;
  let ending: string;
  let endEmoji: string;
  let title: string;

  const withRef = (withCompanion: string, alone: string) =>
    hasCompanion ? withCompanion : alone;

  switch (theme.id) {
    case "bedtime":
      opener = withRef(
        `The stars were waking up, so {name} and ${refIntro} tiptoed off for one last quiet peek at ${placePhrase}.`,
        `The stars were waking up, so {name} tiptoed off for one last quiet peek at ${placePhrase}.`,
      );
      openCheer = "Tiptoe, tiptoe!";
      ending = `Then it was time for bed. {name} snuggled deep under the blanket${multi ? "s" : ""}, the sleepiest ${kidWord} in town. ${lessonMoral} Goodnight, {name}.`;
      endEmoji = "\u{1F634}";
      title = `Goodnight, ${placeLabel}`;
      break;
    case "imagination":
      opener = withRef(
        `{name} closed ${multi ? "every eye tight" : "two eyes"} and counted: one, two, three! Poof \u2014 the living room turned into ${placePhrase}, and ${refIntro} came too!`,
        `{name} closed ${multi ? "every eye tight" : "two eyes"} and counted: one, two, three! Poof \u2014 the living room turned into ${placePhrase}!`,
      );
      openCheer = "One, two, three!";
      ending = `With one more blink, {name} ${multi ? "were" : "was"} home again, grinning the biggest grin. ${lessonMoral} What will tomorrow become?`;
      endEmoji = "\u{1F31F}";
      title = `{name}'s Make-Believe ${placeLabel}`;
      break;
    case "helping":
      opener = withRef(
        `{name} pulled on big helper boots and called ${refIntro}. ${cap(placePhrase)} needed a helper today!`,
        `{name} pulled on big helper boots. ${cap(placePhrase)} needed a helper today!`,
      );
      openCheer = "I can help!";
      ending = `\u201CWhat a wonderful helper${multi ? "s" : ""}!\u201D everyone cheered. {name} stood tall and proud, the best helper ${kidWord} around. ${lessonMoral}`;
      endEmoji = "\u{1F31F}";
      title = `{name}'s Big Helper Day`;
      break;
    default:
      opener = withRef(
        `One bright morning, {name} packed a tiny backpack and called ${refIntro}. Today they would explore ${placePhrase}!`,
        `One bright morning, {name} packed a tiny backpack. Today was the day to explore ${placePhrase}!`,
      );
      openCheer = "Let's go!";
      ending = `{name} marched home, the bravest ${kidWord} in the whole town. ${lessonMoral}`;
      endEmoji = "\u{1F3E1}";
      title = `{name} and the ${placeLabel} Adventure`;
  }

  const openerPage: StoryPage = { text: opener, readAloud: openCheer, emoji: theme.emoji };
  const sightPage: StoryPage = {
    text: `${cap(placePhrase)} was wonderful. ${place.sight}`,
    readAloud: "Wow!",
    emoji: place.emoji,
  };
  const anticPage: StoryPage = hasCompanion
    ? {
        text: `${cap(ref!)} ${companion.antic}. {name} laughed, patted down ${hairWord} hair,${glassesBit} and clapped along.`,
        readAloud: "Ha ha ha!",
        emoji: companion.emoji,
      }
    : {
        text: `{name} did a twirl, a hop, and one very silly wiggle dance. Then {name} patted down ${hairWord} hair${glassesBit ? "," + glassesBit.slice(0, -1) : ""} and giggled.`,
        readAloud: "Wiggle, wiggle!",
        emoji: "\u{1F483}",
      };
  const challengePage: StoryPage = {
    text: lesson.challenge(ref),
    readAloud: "Uh oh!",
    emoji: "\u{1F62E}",
  };
  const choicePage: StoryPage = {
    text: lessonChoice,
    readAloud: lesson.cheer,
    emoji: lesson.emoji,
  };
  const resolutionPage: StoryPage = {
    text: hasCompanion
      ? `And just like that, everything was better than before. ${cap(ref!)} did a happy dance around {name}.`
      : `And just like that, everything was better than before. {name} did a happy dance right on the spot.`,
    readAloud: "Hooray!",
    emoji: "\u{1F389}",
  };
  const endingPage: StoryPage = { text: ending, readAloud: "The end!", emoji: endEmoji };

  // Extra pages used only for long stories.
  const peekabooPage: StoryPage = {
    text: hasCompanion
      ? `{name} and ${ref} played peek-a-boo behind the biggest thing they could find. Found you! Found you!`
      : `{name} played peek-a-boo behind the biggest thing around. Peek! Found you!`,
    readAloud: "Peek-a-boo!",
    emoji: "\u{1F648}",
  };
  const restPage: StoryPage = {
    text: hasCompanion
      ? `Then it was time for a tiny rest. ${cap(ref!)} snuggled up close, and {name} hummed a quiet song.`
      : `Then it was time for a tiny rest. {name} found a soft spot and hummed a quiet song.`,
    readAloud: "Snuggle time!",
    emoji: "\u{1F60A}",
  };
  const songPage: StoryPage = {
    text: hasCompanion
      ? `All the way back, {name} and ${ref} sang a happy little song. La la la, what a day!`
      : `All the way back, {name} sang a happy little song. La la la, what a day!`,
    readAloud: "La la la!",
    emoji: "\u{1F3B6}",
  };

  const pages: StoryPage[] =
    length.id === "short"
      ? [openerPage, anticPage, challengePage, choicePage, endingPage]
      : length.id === "long"
        ? [
            openerPage,
            sightPage,
            peekabooPage,
            anticPage,
            restPage,
            challengePage,
            choicePage,
            resolutionPage,
            songPage,
            endingPage,
          ]
        : [
            openerPage,
            sightPage,
            anticPage,
            challengePage,
            choicePage,
            resolutionPage,
            endingPage,
          ];

  const lessonText =
    lesson.id === "custom" && lessonCustom ? lessonCustom.toLowerCase() : lesson.label.toLowerCase();
  const companionLabel = petName
    ? `${companionPhrase} ${petName}`
    : `a ${companionPhrase}`;

  return {
    id: `my-${Date.now()}`,
    title,
    subtitle: hasCompanion
      ? `A story about ${lessonText}, with ${companionLabel}`
      : `A story about ${lessonText}`,
    theme: theme.label,
    accent: theme.accent,
    emoji: hasCompanion && companion.id !== "custom" ? companion.emoji : theme.emoji,
    minutes: Math.max(2, Math.round(pages.length / 2)),
    pages,
    heroName: heroNames || undefined,
    kidIds: heroes.map((kid) => kid.id),
    artStyle: resolveArtStyle(setup, heroes[0] ?? null),
  };
};
