import { hairWordOf, kidWordOf, type KidProfile } from "./profile";
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
  /** Phrase used in sentences, e.g. "little puppy". */
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
  challenge: (companion: string) => string;
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
  { id: "dragon", label: "Friendly Dragon", emoji: "\u{1F432}", phrase: "friendly dragon", antic: "blew a tiny, warm smoke ring" },
  { id: "teddy", label: "Teddy Bear", emoji: "\u{1F9F8}", phrase: "brave teddy bear", antic: "tumbled head over heels" },
  { id: "pony", label: "Pony", emoji: "\u{1F434}", phrase: "gentle pony", antic: "swished its swishy tail" },
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
    challenge: (companion) =>
      `Suddenly the way ahead looked big and dark. The ${companion} hid behind {name}.`,
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
];

export interface StorySetup {
  themeId: string;
  companionId: string;
  placeId: string;
  lessonId: string;
}

export const defaultSetup: StorySetup = {
  themeId: themeOptions[0].id,
  companionId: companionOptions[0].id,
  placeId: placeOptions[0].id,
  lessonId: lessonOptions[0].id,
};

const cap = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

const pick = <T extends { id: string }>(options: T[], id: string): T =>
  options.find((option) => option.id === id) ?? options[0];

/** Assembles a complete personalized story from the parent's selections. */
export const buildStory = (setup: StorySetup, profile: KidProfile | null): Story => {
  const theme = pick(themeOptions, setup.themeId);
  const companion = pick(companionOptions, setup.companionId);
  const place = pick(placeOptions, setup.placeId);
  const lesson = pick(lessonOptions, setup.lessonId);

  const kidWord = kidWordOf(profile);
  const hairWord = profile ? hairWordOf(profile) : "soft";
  const glassesBit = profile?.glasses ? " pushed up two round glasses," : "";

  let opener: string;
  let openCheer: string;
  let ending: string;
  let endEmoji: string;
  let title: string;

  switch (theme.id) {
    case "bedtime":
      opener = `The stars were waking up, so {name} and the ${companion.phrase} tiptoed off for one last quiet peek at ${place.phrase}.`;
      openCheer = "Tiptoe, tiptoe!";
      ending = `Then it was time for bed. {name} snuggled deep under the blanket, the sleepiest ${kidWord} in town. ${lesson.moral} Goodnight, {name}.`;
      endEmoji = "\u{1F634}";
      title = `Goodnight, ${place.label}`;
      break;
    case "imagination":
      opener = `{name} closed two eyes and counted: one, two, three! Poof \u2014 the living room turned into ${place.phrase}, and the ${companion.phrase} came too!`;
      openCheer = "One, two, three!";
      ending = `With one more blink, {name} was home again, grinning the biggest grin. ${lesson.moral} What will tomorrow become?`;
      endEmoji = "\u{1F31F}";
      title = `{name}'s Make-Believe ${place.label}`;
      break;
    case "helping":
      opener = `{name} pulled on big helper boots and called the ${companion.phrase}. ${cap(place.phrase)} needed a helper today!`;
      openCheer = "I can help!";
      ending = `\u201CWhat a wonderful helper!\u201D everyone cheered. {name} stood tall and proud, the best helper ${kidWord} around. ${lesson.moral}`;
      endEmoji = "\u{1F31F}";
      title = `{name}'s Big Helper Day`;
      break;
    default:
      opener = `One bright morning, {name} packed a tiny backpack and called the ${companion.phrase}. Today they would explore ${place.phrase}!`;
      openCheer = "Let's go!";
      ending = `{name} marched home, the bravest ${kidWord} in the whole town. ${lesson.moral}`;
      endEmoji = "\u{1F3E1}";
      title = `{name} and the ${place.label} Adventure`;
  }

  const pages: StoryPage[] = [
    { text: opener, readAloud: openCheer, emoji: theme.emoji },
    {
      text: `${cap(place.phrase)} was wonderful. ${place.sight}`,
      readAloud: "Wow!",
      emoji: place.emoji,
    },
    {
      text: `The ${companion.phrase} ${companion.antic}. {name} laughed, patted down ${hairWord} hair,${glassesBit} and clapped along.`,
      readAloud: "Ha ha ha!",
      emoji: companion.emoji,
    },
    {
      text: lesson.challenge(companion.phrase),
      readAloud: "Uh oh!",
      emoji: "\u{1F62E}",
    },
    {
      text: lesson.choice,
      readAloud: lesson.cheer,
      emoji: lesson.emoji,
    },
    {
      text: `And just like that, everything was better than before. The ${companion.phrase} did a happy dance around {name}.`,
      readAloud: "Hooray!",
      emoji: "\u{1F389}",
    },
    {
      text: ending,
      readAloud: "The end!",
      emoji: endEmoji,
    },
  ];

  return {
    id: `my-${Date.now()}`,
    title,
    subtitle: `A ${lesson.label.toLowerCase()} story with a ${companion.label.toLowerCase()}`,
    theme: theme.label,
    accent: theme.accent,
    emoji: companion.emoji,
    minutes: 3,
    pages,
    heroName: profile?.name?.trim() || undefined,
  };
};
