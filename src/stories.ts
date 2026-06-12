export interface StoryPage {
  text: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  theme: string;
  accent: string;
  emoji: string;
  pages: StoryPage[];
}

export const stories: Story[] = [
  {
    id: "brave-little-explorer",
    title: "The Brave Little Explorer",
    subtitle: "A backyard adventure about being brave",
    theme: "Bravery",
    accent: "#ec7d35",
    emoji: "\u{1F9ED}",
    pages: [
      { text: "One sunny morning, a brave little explorer found a tiny map in the garden." },
      { text: "\u201CWhere does it go?\u201D they wondered. The puppy gave a happy bark and led the way." },
      { text: "They came to a little wooden bridge. It looked tall, but they took one slow, careful step." },
      { text: "Step by step, they crossed the bridge. \u201CI can be brave!\u201D they cheered." },
      { text: "At the end of the path was a treasure box full of shiny golden stars." },
      { text: "They carried the stars home and shared one with everyone. The end." },
    ],
  },
  {
    id: "kindness-garden",
    title: "The Kindness Garden",
    subtitle: "A gentle story about helping friends",
    theme: "Kindness",
    accent: "#6fb8cc",
    emoji: "\u{1F33B}",
    pages: [
      { text: "In a cozy little garden, every flower needed a drink of water." },
      { text: "A small helper filled a watering can right up to the top." },
      { text: "Splish, splash! They gave each thirsty flower a gentle drink." },
      { text: "A little bird was lost, so they showed it the way back to its nest." },
      { text: "By the afternoon, the whole garden was happy and bright." },
      { text: "\u201CKind hearts make everything bloom,\u201D they smiled. The end." },
    ],
  },
  {
    id: "sleepy-moon",
    title: "Goodnight, Sleepy Moon",
    subtitle: "A calm bedtime story",
    theme: "Bedtime",
    accent: "#8a7fc4",
    emoji: "\u{1F319}",
    pages: [
      { text: "When the stars came out, a sleepy little one looked up at the moon." },
      { text: "\u201CGoodnight, birds,\u201D they whispered. The birds tucked into their nest." },
      { text: "\u201CGoodnight, puppy,\u201D they yawned. The puppy curled up by the bed." },
      { text: "\u201CGoodnight, moon,\u201D they smiled. The moon glowed soft and warm." },
      { text: "They snuggled under the cozy blanket and closed their eyes." },
      { text: "And the whole world drifted off to a peaceful, happy sleep. The end." },
    ],
  },
];
