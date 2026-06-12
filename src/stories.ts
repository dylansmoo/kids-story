export interface StoryPage {
  /** Page text. "{name}" is replaced with the child's name. */
  text: string;
  /** A short line the child can say out loud with the parent. */
  readAloud: string;
  /** Scene emoji used as the page illustration placeholder. */
  emoji: string;
  /** Scene description for the image model (AI-generated stories only). */
  illustration?: string;
  /** Illustration: a static path for presets, or a data URL for generated stories. */
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
  /** Set on stories created in the builder: the hero name(s) at creation time. */
  heroName?: string;
  /** Profile ids of the kids starring in this story. */
  kidIds?: string[];
  /** Illustration style prompt chosen for this story. */
  artStyle?: string;
  /** Show the "say it together" line on each page. Defaults to true for presets. */
  readTogether?: boolean;
}

/** Used when no hero name has been set. Reads naturally anywhere a name appears. */
export const FALLBACK_NAME = "Little Hero";

export const personalize = (text: string, name: string): string =>
  text.replaceAll("{name}", name.trim() || FALLBACK_NAME);

export const stories: Story[] = [
  {
    id: "brave-little-explorer",
    title: "{name} and the Whispering Woods",
    subtitle: "A watercolor adventure about being brave",
    theme: "Bravery",
    accent: "#f4724b",
    emoji: "\u{1F9ED}",
    minutes: 5,
    pages: [
      {
        text: "One sunny morning, {name} found a curly old map under the doormat. It smelled like adventure! The little puppy sniffed it and wagged so hard its whole body wiggled. \u201CTo the Whispering Woods!\u201D said {name}, pulling on two trusty boots. \u201CBrave hearts go first!\u201D",
        readAloud: "Brave hearts go first!",
        emoji: "\u{1F5FA}\u{FE0F}",
        image: "/presets/brave-little-explorer/1.jpg",
      },
      {
        text: "Crunch, crunch went the leafy path. The tall trees waved their branchy arms hello, and somewhere high above, a squirrel chattered like a tiny alarm clock. {name} marched in front. The puppy bounced behind, ears flapping like little flags.",
        readAloud: "Crunch, crunch!",
        emoji: "\u{1F332}",
        image: "/presets/brave-little-explorer/2.jpg",
      },
      {
        text: "Then the path stopped. A wobbly wooden bridge hung over a giggling stream. The puppy peeked through {name}'s legs and whimpered. {name}'s heart went pitter-patter, pitter-patter. The bridge looked very wobbly indeed.",
        readAloud: "Uh oh!",
        emoji: "\u{1F309}",
        image: "/presets/brave-little-explorer/3.jpg",
      },
      {
        text: "{name} took one big breath, as deep as the sea. \u201CBrave hearts go first,\u201D whispered {name}, and took one careful step. Creak! Then another. Creak, creak! The bridge sang its creaky song, and {name} kept going, slow and steady.",
        readAloud: "Creak, creak!",
        emoji: "\u{1F463}",
        image: "/presets/brave-little-explorer/4.jpg",
      },
      {
        text: "Made it! The puppy zoomed across in three happy hops and ran two whole circles around {name}. And there, under a mossy stone, sat a little wooden box with a brass button nose. \u201CTreasure!\u201D gasped {name}.",
        readAloud: "We did it!",
        emoji: "\u{1F4E6}",
        image: "/presets/brave-little-explorer/5.jpg",
      },
      {
        text: "Inside glowed a hundred golden star stickers \u2014 explorer stars! {name} pressed one onto the puppy's nose. The puppy went cross-eyed trying to see it, then sneezed a tiny proud sneeze. {name} laughed until the trees laughed too.",
        readAloud: "Ha ha ha!",
        emoji: "\u{2B50}",
        image: "/presets/brave-little-explorer/6.jpg",
      },
      {
        text: "That evening, {name} stuck a golden star on the window, right where the sunset could shine through it. The bridge had been wobbly, but {name} had wobbled across anyway. Because that's the secret, you know. Brave hearts go first.",
        readAloud: "Brave hearts go first!",
        emoji: "\u{1F3E1}",
        image: "/presets/brave-little-explorer/7.jpg",
      },
    ],
  },
  {
    id: "goodnight-little-star",
    title: "Goodnight, Little Star",
    subtitle: "A cozy felt-craft bedtime story",
    theme: "Bedtime",
    accent: "#8b7fd4",
    emoji: "\u{2B50}",
    minutes: 5,
    pages: [
      {
        text: "It was almost bedtime, warm and slow, when {name} spotted something odd: a tiny star tangled in the curtain, glowing soft as a night-light. \u201CHello,\u201D whispered {name}. The little star blinked shyly and gave the smallest twinkle.",
        readAloud: "Hello, little star!",
        emoji: "\u{2B50}",
        image: "/presets/goodnight-little-star/1.jpg",
      },
      {
        text: "\u201CAchoo!\u201D The star sneezed a puff of silver sparkles all over the rug. \u201CI slipped off the sky,\u201D it twinkled sadly. \u201CAnd now I can't reach my mama moon.\u201D {name} stood up tall. \u201CDon't worry. I'll help you home.\u201D",
        readAloud: "Achoo!",
        emoji: "\u{2728}",
        image: "/presets/goodnight-little-star/2.jpg",
      },
      {
        text: "Tiptoe, tiptoe, out to the garden they went, the star riding in {name}'s cupped hands like a firefly in a nest. The grass was cool and dewy between ten little toes. The moonflowers turned their sleepy faces to watch.",
        readAloud: "Tiptoe, tiptoe!",
        emoji: "\u{1F33F}",
        image: "/presets/goodnight-little-star/3.jpg",
      },
      {
        text: "{name} climbed the garden swing and swung high, high, higher \u2014 wheee! \u2014 but the sky was still too far. The little star's glow grew dim and worried, like a candle in the wind. \u201COh no,\u201D whispered {name}. \u201CThink, think, think.\u201D",
        readAloud: "Think, think, think!",
        emoji: "\u{1F320}",
        image: "/presets/goodnight-little-star/4.jpg",
      },
      {
        text: "Then {name} remembered: stars come out when lullabies do! So {name} hummed the softest lullaby, the one for very sleepy nights. And with every la-la-la, the little star glowed brighter... and lighter... and lifted right up out of {name}'s hands!",
        readAloud: "La, la, la!",
        emoji: "\u{1F3B6}",
        image: "/presets/goodnight-little-star/5.jpg",
      },
      {
        text: "Up and up the little star floated, twirling like a happy snowflake going the wrong way, all the way home to its mama moon. It blinked three times \u2014 blink, blink, blink. That's star language for thank you, {name}.",
        readAloud: "Blink, blink, blink!",
        emoji: "\u{1F31D}",
        image: "/presets/goodnight-little-star/6.jpg",
      },
      {
        text: "Back in a warm, snuggly bed, {name} watched the little star shine through the window, the brightest one in the whole sky. \u201CGoodnight, little star,\u201D yawned {name}. \u201CGoodnight, goodnight.\u201D And the star twinkled until morning, keeping watch.",
        readAloud: "Goodnight, goodnight!",
        emoji: "\u{1F634}",
        image: "/presets/goodnight-little-star/7.jpg",
      },
    ],
  },
  {
    id: "cardboard-rocket",
    title: "{name} and the Cardboard Rocket",
    subtitle: "A comic-style make-believe space adventure",
    theme: "Imagination",
    accent: "#2fa897",
    emoji: "\u{1F680}",
    minutes: 5,
    pages: [
      {
        text: "Rain tapped on the window \u2014 tap, tap, tap \u2014 but {name} wasn't watching the rain. {name} was drawing buttons on a giant cardboard box. Red button. Green button. One extra-squiggly emergency button. Bolt the toy robot climbed in too. \u201CCo-pilot ready! Beep!\u201D",
        readAloud: "Beep, beep!",
        emoji: "\u{1F4E6}",
        image: "/presets/cardboard-rocket/1.jpg",
      },
      {
        text: "{name} pressed the squiggly button and grabbed the crayon controls. \u201CThree... two... one... ZOOM!\u201D The living room melted away, and suddenly there were stars everywhere \u2014 above, below, and even in {name}'s socks.",
        readAloud: "Three, two, one \u2014 ZOOM!",
        emoji: "\u{1F30C}",
        image: "/presets/cardboard-rocket/2.jpg",
      },
      {
        text: "A comet whooshed past with a fizzy tail. \u201CAchoo!\u201D it sneezed, dusting the rocket in glitter. Bolt beeped the giggles. {name} steered left around a marshmallow asteroid, then right around a planet wearing polka dots.",
        readAloud: "Whoosh!",
        emoji: "\u{2604}\u{FE0F}",
        image: "/presets/cardboard-rocket/3.jpg",
      },
      {
        text: "But just before the Moon \u2014 sputter, sputter, phut \u2014 the rocket ran out of zoom! It drifted, slow as a bedtime yawn. \u201CWarning! No more zoom!\u201D beeped Bolt. {name} tapped a chin and thought very hard indeed.",
        readAloud: "Uh oh!",
        emoji: "\u{1F62E}",
        image: "/presets/cardboard-rocket/4.jpg",
      },
      {
        text: "Then {name} grinned a lightbulb grin. \u201CBolt! Rockets run on imagination \u2014 and giggles are pure rocket fuel!\u201D So {name} told the rocket its favourite joke. The engines snorted... chuckled... then burst out laughing. \u201CThree, two, one \u2014 ZOOM!\u201D",
        readAloud: "Three, two, one \u2014 ZOOM!",
        emoji: "\u{1F4A1}",
        image: "/presets/cardboard-rocket/5.jpg",
      },
      {
        text: "They looped the Moon twice, waved to an astronaut teddy bear floating by with a flask of warm milk, and planted a crayon-drawn flag right at the tippy-top of the tallest moon-hill. It flapped proudly in the space breeze.",
        readAloud: "Hooray!",
        emoji: "\u{1F6F8}",
        image: "/presets/cardboard-rocket/6.jpg",
      },
      {
        text: "When the rocket bumped softly back onto the carpet, the rain had stopped and a rainbow leaned across the sky. {name} patted the box. \u201CGood rocket.\u201D Tomorrow, it might be a submarine. Or a dragon. Or anything at all \u2014 that's how imagination works.",
        readAloud: "The end!",
        emoji: "\u{1F308}",
        image: "/presets/cardboard-rocket/7.jpg",
      },
    ],
  },
];
