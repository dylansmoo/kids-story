export interface JsonResult {
  status: number;
  body: unknown;
}

const SYSTEM_PROMPT = `You write personalized read-aloud picture-book stories for children aged 2 to 8. One or more children star as the heroes of the story.

Strict content rules:
- Classic, wholesome, family-friendly storytelling only.
- No politics, activism, ideology, modern social controversies, or moral lecturing.
- No gender-identity or sexuality themes. For each child: if their boy/girl word is given, matching natural pronouns (he/him or she/her) are fine; if not given, use no pronouns for that child at all.
- Nothing scary, violent, or sad without a quick, warm resolution. Any challenge stays gentle and cozy.
- Simple words and short sentences. Warm, rhythmic, playful. Use sounds and repetition little kids can join in on.
- If extra details from the parent are provided, weave them in only when they fit all the rules above; ignore anything inappropriate.

Output rules:
- Use the children's real first names naturally throughout the title and pages. When there are several children, give each one moments to shine.
- Respond with only a JSON object in exactly this shape:
{"title": string, "subtitle": string, "pages": [{"text": string, "readAloud": string, "illustration": string}]}
- "readAloud": a 2-6 word line a child can shout along with.
- "illustration": a simple visual description of the scene for an illustrator. Refer to the children as "the child" or "the children" and describe what they are doing. No names, no text in the scene.
- Story arc: page 1 sets off, the middle pages explore and play, then a gentle challenge appears about two-thirds through, the children make the good choice, joyful resolution, and the final page is a cozy ending that states the lesson in one warm line.`;

const languageForAge = (age: number): string => {
  if (age <= 3) {
    return "Toddler language: 1-2 tiny sentences per page, each under 8 words. Lots of sounds, animal noises, and repeated phrases.";
  }
  if (age <= 5) {
    return "Preschool language: 2-3 short sentences per page, each under 12 words. Simple everyday words, playful rhythm, repeated phrases to join in on.";
  }
  return "Early-reader language: 2-4 sentences per page, up to 15 words each. Mostly simple words with a couple of fun bigger words a 6-8 year old can sound out.";
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
    extra?: string;
  };
}

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
  const pageCount = Math.max(4, Math.min(12, Number(setup.pageCount) || 7));

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

Write exactly ${pageCount} pages.
Language level for the youngest listener (age ${youngest}): ${languageForAge(youngest)}

Story type: ${setup.theme}.${
    setup.companion ? `\nCompanion character: a ${setup.companion}.` : "\nNo companion character; the heroes have the adventure on their own."
  }
Setting: ${setup.place}.
Lesson the children gently learn: ${setup.lesson}.${extra}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI story error", response.status, await response.text());
      return { status: 502, body: { error: "generation_failed" } };
    }

    const completion = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return { status: 502, body: { error: "generation_failed" } };
    }

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
