export interface StoryPage {
  /** Page text. "{name}" is replaced with the child's name. */
  text: string;
  /** A short line the child can say out loud with the parent. */
  readAloud: string;
  /** Scene emoji used as the page illustration placeholder. */
  emoji: string;
  /** Scene description for the image model (AI-generated stories only). */
  illustration?: string;
  /** Generated illustration as a data URL, filled in as images finish painting. */
  image?: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  accent: string;
  emoji: string;
  minutes: number;
  pages: StoryPage[];
  /** Set on stories created in the builder: the hero's name at creation time. */
  heroName?: string;
}

/** Used when no hero name has been set. Reads naturally anywhere a name appears. */
export const FALLBACK_NAME = "Little Hero";

export const personalize = (text: string, name: string): string =>
  text.replaceAll("{name}", name.trim() || FALLBACK_NAME);

export const stories: Story[] = [
  {
    id: "brave-little-explorer",
    title: "The Brave Little Explorer",
    subtitle: "A backyard adventure about being brave",
    theme: "Bravery",
    accent: "#ec7d35",
    emoji: "\u{1F9ED}",
    minutes: 3,
    pages: [
      {
        text: "One sunny morning, {name} found a tiny map hiding under a garden leaf.",
        readAloud: "A map! A map!",
        emoji: "\u{1F5FA}\u{FE0F}",
      },
      {
        text: "\u201CWhere does it go?\u201D wondered {name}. The puppy barked happily and led the way.",
        readAloud: "This way!",
        emoji: "\u{1F436}",
      },
      {
        text: "The path came to a little wooden bridge. It looked tall. It looked wobbly.",
        readAloud: "Uh oh!",
        emoji: "\u{1F309}",
      },
      {
        text: "{name} took a deep breath and one slow, careful step. Then another. Then another!",
        readAloud: "I can be brave!",
        emoji: "\u{1F463}",
      },
      {
        text: "Step by step, {name} crossed the whole bridge. The puppy cheered with a happy howl.",
        readAloud: "I did it!",
        emoji: "\u{1F389}",
      },
      {
        text: "At the end of the path sat a treasure box, glowing with shiny golden stars.",
        readAloud: "Wow!",
        emoji: "\u{1F31F}",
      },
      {
        text: "{name} carried the stars home and shared one with everyone. What a brave explorer!",
        readAloud: "The end!",
        emoji: "\u{1F3E1}",
      },
    ],
  },
  {
    id: "kindness-garden",
    title: "The Kindness Garden",
    subtitle: "A gentle story about helping friends",
    theme: "Kindness",
    accent: "#6fb8cc",
    emoji: "\u{1F33B}",
    minutes: 3,
    pages: [
      {
        text: "In a cozy little garden, every flower was thirsty for a morning drink.",
        readAloud: "Good morning, flowers!",
        emoji: "\u{1F337}",
      },
      {
        text: "{name} filled the green watering can right up to the very top.",
        readAloud: "Splish, splash!",
        emoji: "\u{1FAB4}",
      },
      {
        text: "One by one, {name} gave each flower a gentle drink. The petals stretched up happily.",
        readAloud: "Thank you, {name}!",
        emoji: "\u{1F33A}",
      },
      {
        text: "Then {name} heard a tiny chirp. A little bird had lost its way home.",
        readAloud: "Cheep, cheep!",
        emoji: "\u{1F426}",
      },
      {
        text: "{name} walked slowly and softly, and showed the little bird the way back to its nest.",
        readAloud: "Follow me!",
        emoji: "\u{1FABA}",
      },
      {
        text: "By the afternoon, the whole garden was bright, happy, and humming with bees.",
        readAloud: "Buzz, buzz!",
        emoji: "\u{1F41D}",
      },
      {
        text: "\u201CKind hearts make everything bloom,\u201D smiled {name}. And the garden agreed.",
        readAloud: "The end!",
        emoji: "\u{1F308}",
      },
    ],
  },
  {
    id: "sleepy-moon",
    title: "Goodnight, Sleepy Moon",
    subtitle: "A calm story for bedtime",
    theme: "Bedtime",
    accent: "#8a7fc4",
    emoji: "\u{1F319}",
    minutes: 2,
    pages: [
      {
        text: "When the stars came out, {name} looked up at the big, friendly moon.",
        readAloud: "Hello, moon!",
        emoji: "\u{2B50}",
      },
      {
        text: "\u201CGoodnight, birds,\u201D whispered {name}. The birds tucked into their cozy nest.",
        readAloud: "Goodnight, birds!",
        emoji: "\u{1F426}",
      },
      {
        text: "\u201CGoodnight, puppy,\u201D yawned {name}. The puppy curled up by the bed.",
        readAloud: "Goodnight, puppy!",
        emoji: "\u{1F415}",
      },
      {
        text: "\u201CGoodnight, moon,\u201D smiled {name}. The moon glowed soft and warm.",
        readAloud: "Goodnight, moon!",
        emoji: "\u{1F31D}",
      },
      {
        text: "{name} snuggled under the cozy blanket and closed two sleepy eyes.",
        readAloud: "So cozy!",
        emoji: "\u{1F6CF}\u{FE0F}",
      },
      {
        text: "And the whole world drifted off to a peaceful, happy sleep. Goodnight, {name}.",
        readAloud: "Goodnight!",
        emoji: "\u{1F4A4}",
      },
    ],
  },
  {
    id: "pancake-picnic",
    title: "The Great Pancake Picnic",
    subtitle: "A yummy story about sharing",
    theme: "Sharing",
    accent: "#d96aa0",
    emoji: "\u{1F95E}",
    minutes: 3,
    pages: [
      {
        text: "On Saturday morning, {name} helped make a tall, wobbly tower of pancakes.",
        readAloud: "Flip, flop, flip!",
        emoji: "\u{1F95E}",
      },
      {
        text: "\u201CLet\u2019s have a picnic!\u201D said {name}, packing the basket with care.",
        readAloud: "Picnic time!",
        emoji: "\u{1F9FA}",
      },
      {
        text: "But at the park, one friend came. Then two. Then three! And only one blanket.",
        readAloud: "One, two, three!",
        emoji: "\u{1F9D2}",
      },
      {
        text: "{name} thought hard. Then {name} smiled. \u201CThere is room for everyone!\u201D",
        readAloud: "Room for everyone!",
        emoji: "\u{1F4A1}",
      },
      {
        text: "Everyone squeezed together, and {name} shared the pancakes one by one.",
        readAloud: "Yum, yum, yum!",
        emoji: "\u{1F37D}\u{FE0F}",
      },
      {
        text: "The pancakes tasted even better shared with friends. Everyone cheered for {name}!",
        readAloud: "Hooray!",
        emoji: "\u{1F973}",
      },
      {
        text: "On the walk home, {name} carried an empty basket and a very full heart.",
        readAloud: "The end!",
        emoji: "\u{2764}\u{FE0F}",
      },
    ],
  },
  {
    id: "cardboard-ship",
    title: "Captain {name} and the Cardboard Ship",
    subtitle: "An imagination adventure in the living room",
    theme: "Imagination",
    accent: "#3da18a",
    emoji: "\u{26F5}",
    minutes: 3,
    pages: [
      {
        text: "A big cardboard box sat in the living room. Most people saw a box. {name} saw a ship!",
        readAloud: "A ship!",
        emoji: "\u{1F4E6}",
      },
      {
        text: "Captain {name} climbed aboard and raised a blanket sail high in the sky.",
        readAloud: "Raise the sail!",
        emoji: "\u{26F5}",
      },
      {
        text: "The carpet turned into a big blue sea, with pillow islands all around.",
        readAloud: "Splash, splash!",
        emoji: "\u{1F30A}",
      },
      {
        text: "\u201CDolphins ahead!\u201D called Captain {name}. The dolphins flipped and waved hello.",
        readAloud: "Hello, dolphins!",
        emoji: "\u{1F42C}",
      },
      {
        text: "A friendly whale showed the way to Treasure Island, just past the couch.",
        readAloud: "Thank you, whale!",
        emoji: "\u{1F433}",
      },
      {
        text: "There, {name} dug up the greatest treasure of all: a chest full of bedtime cookies!",
        readAloud: "Treasure!",
        emoji: "\u{1F36A}",
      },
      {
        text: "Captain {name} sailed home for supper. Tomorrow, the box might be a rocket!",
        readAloud: "The end!",
        emoji: "\u{1F680}",
      },
    ],
  },
  {
    id: "big-helper-day",
    title: "The Big Helper Day",
    subtitle: "A proud story about being responsible",
    theme: "Helping",
    accent: "#b5533c",
    emoji: "\u{1F9FA}",
    minutes: 3,
    pages: [
      {
        text: "One bright morning, {name} put on big helper boots. Today was Big Helper Day!",
        readAloud: "I can help!",
        emoji: "\u{1F462}",
      },
      {
        text: "First, {name} fed the goldfish exactly two pinches. Not three. Not ten. Two!",
        readAloud: "One, two!",
        emoji: "\u{1F420}",
      },
      {
        text: "Next, {name} lined up all the toys so each one could find its home.",
        readAloud: "Tidy up, tidy up!",
        emoji: "\u{1F9F8}",
      },
      {
        text: "Then came the big job: carrying the laundry basket all the way down the hall.",
        readAloud: "Heave ho!",
        emoji: "\u{1F9FA}",
      },
      {
        text: "The basket wobbled. {name} walked slowly and carefully... and made it!",
        readAloud: "Steady, steady!",
        emoji: "\u{1F4AA}",
      },
      {
        text: "\u201CWhat a wonderful helper,\u201D everyone said. {name} stood tall and proud.",
        readAloud: "I did it!",
        emoji: "\u{1F31F}",
      },
      {
        text: "That night, {name} fell fast asleep, dreaming of tomorrow\u2019s big jobs.",
        readAloud: "The end!",
        emoji: "\u{1F634}",
      },
    ],
  },
];
