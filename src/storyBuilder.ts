import { hairWordOf, type KidProfile } from "./profile";
import type { Story, StoryPage } from "./stories";

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
  { id: "adventure", label: "Big Adventure", emoji: "\u{1F5FA}\u{FE0F}", accent: "#ec7d35" },
  { id: "bedtime", label: "Sleepy Bedtime", emoji: "\u{1F319}", accent: "#8a7fc4" },
  { id: "imagination", label: "Make-Believe", emoji: "\u{2728}", accent: "#3da18a" },
  { id: "helping", label: "Helper Day", emoji: "\u{1F9FA}", accent: "#b5533c" },
];

export const companionOptions: CompanionOption[] = [
  { id: "puppy", label: "Puppy", emoji: "\u{1F436}", phrase: "little puppy", antic: "chased its own waggly tail" },
  { id: "kitten", label: "Kitten", emoji: "\u{1F431}", phrase: "fluffy kitten", antic: "pounced on a dancing leaf" },
  { id: "bunny", label: "Bunny", emoji: "\u{1F430}", phrase: "hoppy bunny", antic: "did three happy hops in a row" },
  { id: "dragon", label: "Dragon", emoji: "\u{1F432}", phrase: "friendly dragon", antic: "blew a tiny, warm smoke ring" },
  { id: "teddy", label: "Teddy Bear", emoji: "\u{1F9F8}", phrase: "brave teddy bear", antic: "tumbled head over heels" },
  { id: "pony", label: "Pony", emoji: "\u{1F434}", phrase: "gentle pony", antic: "swished its swishy tail" },
  { id: "fairy", label: "Fairy", emoji: "\u{1F9DA}", phrase: "kind little fairy", antic: "sprinkled a puff of sparkly dust" },
  { id: "superhero", label: "Superhero", emoji: "\u{1F9B8}", phrase: "small superhero friend", antic: "zoomed one happy loop in a tiny cape" },
  { id: "robot", label: "Robot", emoji: "\u{1F916}", phrase: "friendly robot", antic: "beeped a cheerful boop-boop tune" },
  { id: "monster", label: "Silly Monster", emoji: "\u{1F47E}", phrase: "fuzzy little monster", antic: "wiggled its fuzzy ears until everyone giggled" },
  { id: "dino", label: "Dinosaur", emoji: "\u{1F995}", phrase: "baby dinosaur", antic: "stomped one tiny, happy stomp" },
  { id: "none", label: "No companion", emoji: "\u{1F31F}", phrase: "", antic: "" },
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
    id: "snow",
    label: "Snowy Hill",
    emoji: "\u{2744}\u{FE0F}",
    phrase: "the snowy hill",
    sight: "Snowflakes danced in the air and everything sparkled soft and white.",
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
    id: "truth",
    label: "Telling the truth",
    emoji: "\u{2B50}",
    challenge: () =>
      "Crash! Something tipped right over. Nobody saw who did it... except {name}.",
    choice: "{name} stood up tall and said, \u201CIt was me. I am sorry. Let me help fix it.\u201D",
    cheer: "Tell the truth!",
    moral: "Telling the truth makes hearts feel light and strong.",
  },
  {
    id: "tryagain",
    label: "Trying again",
    emoji: "\u{1F501}",
    challenge: () =>
      "{name} tried and tried, but it just would not work. Not even a little bit.",
    choice:
      "{name} wiggled ten fingers, took a big breath, and tried one more time \u2014 slowly, slowly.",
    cheer: "Try, try again!",
    moral: "When something is tricky, a rest and another try works wonders.",
  },
  {
    id: "tidy",
    label: "Tidying up",
    emoji: "\u{1F9F9}",
    challenge: () =>
      "Oh my! Things were scattered everywhere \u2014 what a muddle, what a mess!",
    choice: "{name} sang a tidy-up song and put every single thing back in its home.",
    cheer: "Tidy up, tidy up!",
    moral: "Little helpers make a big, happy difference.",
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
  placeId: string;
  lessonId: string;
  lengthId: string;
  /** Optional free-text details; used by AI generation only. */
  extra: string;
}

export const defaultSetup: StorySetup = {
  themeId: themeOptions[0].id,
  companionId: companionOptions[0].id,
  companionName: "",
  placeId: placeOptions[0].id,
  lessonId: lessonOptions[0].id,
  lengthId: lengthOptions[1].id,
  extra: "",
};

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
  const petName = setup.companionName.trim();
  // "Scout" once named, otherwise "the little puppy".
  const ref = hasCompanion ? (petName || `the ${companion.phrase}`) : null;
  const refIntro = hasCompanion
    ? petName
      ? `${petName} the ${companion.phrase}`
      : `the ${companion.phrase}`
    : null;

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
        `The stars were waking up, so {name} and ${refIntro} tiptoed off for one last quiet peek at ${place.phrase}.`,
        `The stars were waking up, so {name} tiptoed off for one last quiet peek at ${place.phrase}.`,
      );
      openCheer = "Tiptoe, tiptoe!";
      ending = `Then it was time for bed. {name} snuggled deep under the blanket${multi ? "s" : ""}, the sleepiest ${kidWord} in town. ${lesson.moral} Goodnight, {name}.`;
      endEmoji = "\u{1F634}";
      title = `Goodnight, ${place.label}`;
      break;
    case "imagination":
      opener = withRef(
        `{name} closed ${multi ? "every eye tight" : "two eyes"} and counted: one, two, three! Poof \u2014 the living room turned into ${place.phrase}, and ${refIntro} came too!`,
        `{name} closed ${multi ? "every eye tight" : "two eyes"} and counted: one, two, three! Poof \u2014 the living room turned into ${place.phrase}!`,
      );
      openCheer = "One, two, three!";
      ending = `With one more blink, {name} ${multi ? "were" : "was"} home again, grinning the biggest grin. ${lesson.moral} What will tomorrow become?`;
      endEmoji = "\u{1F31F}";
      title = `{name}'s Make-Believe ${place.label}`;
      break;
    case "helping":
      opener = withRef(
        `{name} pulled on big helper boots and called ${refIntro}. ${cap(place.phrase)} needed a helper today!`,
        `{name} pulled on big helper boots. ${cap(place.phrase)} needed a helper today!`,
      );
      openCheer = "I can help!";
      ending = `\u201CWhat a wonderful helper${multi ? "s" : ""}!\u201D everyone cheered. {name} stood tall and proud, the best helper ${kidWord} around. ${lesson.moral}`;
      endEmoji = "\u{1F31F}";
      title = `{name}'s Big Helper Day`;
      break;
    default:
      opener = withRef(
        `One bright morning, {name} packed a tiny backpack and called ${refIntro}. Today they would explore ${place.phrase}!`,
        `One bright morning, {name} packed a tiny backpack. Today was the day to explore ${place.phrase}!`,
      );
      openCheer = "Let's go!";
      ending = `{name} marched home, the bravest ${kidWord} in the whole town. ${lesson.moral}`;
      endEmoji = "\u{1F3E1}";
      title = `{name} and the ${place.label} Adventure`;
  }

  const openerPage: StoryPage = { text: opener, readAloud: openCheer, emoji: theme.emoji };
  const sightPage: StoryPage = {
    text: `${cap(place.phrase)} was wonderful. ${place.sight}`,
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
    text: lesson.choice,
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

  const companionLabel =
    companion.id === "none"
      ? "solo"
      : petName
        ? `${companion.label.toLowerCase()} ${petName}`
        : `a ${companion.label.toLowerCase()}`;

  return {
    id: `my-${Date.now()}`,
    title,
    subtitle:
      companion.id === "none"
        ? `A ${lesson.label.toLowerCase()} story`
        : `A ${lesson.label.toLowerCase()} story with ${companionLabel}`,
    theme: theme.label,
    accent: theme.accent,
    emoji: companion.id === "none" ? theme.emoji : companion.emoji,
    minutes: Math.max(2, Math.round(pages.length / 2)),
    pages,
    heroName: heroNames || undefined,
    kidIds: heroes.map((kid) => kid.id),
  };
};
