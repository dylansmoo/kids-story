export interface JsonResult {
  status: number;
  body: unknown;
}

const SYSTEM_PROMPT = `You are a children's story creator. You write warm, imaginative, personalized read-aloud stories for young children, with one or more real children starring as the heroes.

Strict content rules:
- Classic, wholesome, family-friendly storytelling only.
- No politics, activism, ideology, modern social controversies, or moral lecturing.
- No gender-identity or sexuality themes. For each child: if their boy/girl word is given, matching natural pronouns (he/him or she/her) are fine; if not given, use no pronouns for that child at all.
- No frightening, violent, sexualised, or adult content. Any challenge stays gentle, and worries are resolved warmly and quickly.
- If extra details from the parent are provided, weave them in only when they fit all the rules above; ignore anything inappropriate.

Story craft rules:
- Tell a REAL story with a proper shape: an inviting opening hook, rising playful action, one gentle challenge or problem, a satisfying turn where the heroes act, a joyful resolution, and a reassuring, cozy ending.
- Each page is one vivid SCENE that moves the story forward - something happens on every page. No filler pages.
- Use vivid sensory details: what things look like, sound like, smell like, feel like. Make the world come alive.
- Use gentle humour: silly moments, funny sounds, playful surprises.
- Use playful sounds children love to shout (whoosh! splash! boop!) and bring back one fun repeated phrase 2-3 times across the story so children can join in.
- Give every hero child their own moments to shine and short lines of spoken dialogue.
- Companion characters have personality: a funny habit, a signature sound, a little quirk that appears more than once.
- Reinforce the chosen lesson through what HAPPENS in the story. Show it, never state it as a lecture. The ending may echo the lesson in one warm, natural line.

Output rules:
- Use the children's real first names naturally throughout the title and pages.
- Respond with only a JSON object in exactly this shape:
{"title": string, "subtitle": string, "pages": [{"text": string, "readAloud": string, "illustration": string}]}
- "readAloud": a 2-6 word line a child can shout along with, tied to that page.
- "illustration": a detailed description of a colourful, playful, child-friendly cartoon illustration showing this exact scene. Describe where the characters are, what they are doing, their expressions, and the setting details. Refer to the children as "the child" or "the children" (no names). Keep every recurring character visually consistent across all pages: same age, appearance, clothing, colours, and distinctive features. No text or letters in the image. Avoid frightening, violent, or adult imagery.`;

const languageForAge = (age: number): string => {
  if (age <= 3) {
    return "Use very short sentences (under 8 words) and everyday words a toddler knows, with lots of sounds and repetition - but keep every scene vivid and eventful.";
  }
  if (age <= 5) {
    return "Use short sentences (under 12 words) and simple vocabulary with playful rhythm and repeated phrases - while keeping scenes rich and alive.";
  }
  return "Use varied sentences up to 15 words, mostly simple words plus a few delicious bigger words a 6-8 year old can sound out.";
};

export interface StoryRequestBody {
  kids?: Array<{
    name?: string;
    description?: string;
    age?: string;
    gender?: string;
  }>;
  setup?: {
    theme?: string;
    companion?: string;
    place?: string;
    lesson?: string;
    pageCount?: number;
    wordsPerPage?: number;
    minutes?: number;
    extra?: string;
  };
}

/** Models in preference order; falls back if the first is unavailable on the key. */
const STORY_MODELS = ["gpt-4.1", "gpt-4o"] as const;

const completeChat = async (
  apiKey: string,
  userPrompt: string,
): Promise<{ ok: boolean; status: number; content?: string; detail?: string }> => {
  for (const model of STORY_MODELS) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (response.ok) {
      const completion = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = completion.choices?.[0]?.message?.content;
      if (content) return { ok: true, status: 200, content };
      return { ok: false, status: 502 };
    }

    const detail = await response.text();
    // Model not available on this key: try the next one. Anything else: stop.
    if (response.status === 404 || detail.includes("model_not_found")) {
      console.warn(`Model ${model} unavailable, trying next`, response.status);
      continue;
    }
    return { ok: false, status: response.status, detail };
  }
  return { ok: false, status: 502, detail: "no_model_available" };
};

export const createStory = async (
  body: StoryRequestBody,
  apiKey: string,
): Promise<JsonResult> => {
  const kids = (body.kids ?? []).filter((kid) => kid.name?.trim());
  const setup = body.setup ?? {};

  if (!setup.theme || !setup.place || !setup.lesson) {
    return { status: 400, body: { error: "missing_setup" } };
  }

  const heroes = kids.length > 0 ? kids : [{ name: "Little Hero", age: "5", gender: "", description: "a young child" }];

  // Language level follows the youngest child in the story.
  const youngest = Math.min(
    ...heroes.map((kid) => Math.max(1, Math.min(10, Number(kid.age) || 5))),
  );
  const pageCount = Math.max(4, Math.min(20, Number(setup.pageCount) || 10));
  const wordsPerPage = Math.max(30, Math.min(120, Number(setup.wordsPerPage) || 60));
  const minutes = Math.max(2, Math.min(20, Number(setup.minutes) || 5));

  const kidLines = heroes
    .map((kid) => {
      const genderNote = kid.gender
        ? `${kid.gender}; matching pronouns are fine`
        : "no boy/girl word given; use no pronouns for this child";
      return `- ${kid.name?.trim()}, age ${Number(kid.age) || 5} (${genderNote}). Appearance: ${
        kid.description ?? "a young child"
      }.`;
    })
    .join("\n");

  const extra = setup.extra?.trim()
    ? `\nExtra details from the parent: ${setup.extra.trim().slice(0, 500)}`
    : "";

  const userPrompt = `The hero${heroes.length > 1 ? "es" : ""} of this story:
${kidLines}
You may weave one or two appearance details in naturally.

Write exactly ${pageCount} pages. Each page is one scene of roughly ${wordsPerPage} words (a little fewer for toddlers). The whole story should take about ${minutes} minutes to read aloud.
Language level for the youngest listener (age ${youngest}): ${languageForAge(youngest)}

Story type: ${setup.theme}.${
    setup.companion ? `\nCompanion character: a ${setup.companion}. Give it real personality.` : "\nNo companion character; the heroes have the adventure on their own."
  }
Setting: ${setup.place}.
Lesson the children gently learn (show, don't preach): ${setup.lesson}.${extra}`;

  try {
    const result = await completeChat(apiKey, userPrompt);
    if (!result.ok || !result.content) {
      console.error("OpenAI story error", result.status, result.detail);
      return { status: 502, body: { error: "generation_failed" } };
    }
    const content = result.content;

    const story = JSON.parse(content) as {
      title?: string;
      subtitle?: string;
      pages?: Array<{ text?: string; readAloud?: string; illustration?: string }>;
    };

    if (
      typeof story.title !== "string" ||
      !Array.isArray(story.pages) ||
      story.pages.length < 4 ||
      story.pages.some((page) => typeof page.text !== "string")
    ) {
      return { status: 502, body: { error: "bad_generation" } };
    }

    return {
      status: 200,
      body: {
        title: story.title,
        subtitle: typeof story.subtitle === "string" ? story.subtitle : "",
        pages: story.pages.map((page) => ({
          text: page.text ?? "",
          readAloud: typeof page.readAloud === "string" ? page.readAloud : "Hooray!",
          illustration: typeof page.illustration === "string" ? page.illustration : "",
        })),
      },
    };
  } catch (error) {
    console.error("Story generation failed", error);
    return { status: 502, body: { error: "generation_failed" } };
  }
};

const STYLE =
  "Soft watercolor children's picture book illustration, warm pastel colors, rounded friendly shapes, gentle storybook light, cozy and cheerful mood";

const SAFETY =
  "Wholesome, calm, child-friendly scene. Absolutely no text, letters, numbers, or words in the image. Nothing scary or sad.";

export interface IllustrationRequestBody {
  scene?: string;
  character?: string;
  /** Art style sentence chosen on the kid's profile. */
  style?: string;
}

const generateImage = async (
  apiKey: string,
  model: "gpt-image-1" | "dall-e-3",
  prompt: string,
): Promise<{ ok: boolean; status: number; b64?: string; detail?: string }> => {
  const payload: Record<string, unknown> = {
    model,
    prompt,
    size: "1024x1024",
    n: 1,
  };
  if (model === "gpt-image-1") {
    payload.quality = "low";
  } else {
    payload.quality = "standard";
    payload.response_format = "b64_json";
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, detail: await response.text() };
  }

  const result = (await response.json()) as { data?: Array<{ b64_json?: string }> };
  const b64 = result.data?.[0]?.b64_json;
  return b64 ? { ok: true, status: 200, b64 } : { ok: false, status: 502 };
};

export const createIllustration = async (
  body: IllustrationRequestBody,
  apiKey: string,
): Promise<JsonResult> => {
  if (!body.scene) {
    return { status: 400, body: { error: "missing_scene" } };
  }

  const prompt = `${body.style?.trim() || STYLE}. The main character: ${
    body.character ?? "a happy young child"
  }. Scene: ${body.scene}. ${SAFETY}`;

  try {
    let result = await generateImage(apiKey, "gpt-image-1", prompt);

    // gpt-image-1 requires a verified OpenAI org; fall back to DALL-E 3 if unavailable.
    if (!result.ok && result.status >= 400 && result.status < 500) {
      console.warn("gpt-image-1 unavailable, falling back to dall-e-3", result.detail);
      result = await generateImage(apiKey, "dall-e-3", prompt);
    }

    if (!result.ok || !result.b64) {
      console.error("Illustration failed", result.status, result.detail);
      return { status: 502, body: { error: "illustration_failed" } };
    }

    return { status: 200, body: { image: `data:image/png;base64,${result.b64}` } };
  } catch (error) {
    console.error("Illustration failed", error);
    return { status: 502, body: { error: "illustration_failed" } };
  }
};
