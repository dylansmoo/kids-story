export interface JsonResult {
  status: number;
  body: unknown;
}

const SYSTEM_PROMPT = `You write personalized read-aloud picture-book stories for children aged 2 to 8.

Strict content rules:
- Classic, wholesome, family-friendly storytelling only.
- No politics, activism, ideology, modern social controversies, or moral lecturing.
- No gender-identity or sexuality themes. If the child's boy/girl word is given, you may use matching natural pronouns (he/him or she/her); if it is not given, use no pronouns for the child at all.
- Nothing scary, violent, or sad without a quick, warm resolution. Any challenge stays gentle and cozy.
- Simple words and short sentences (under 15 words). Warm, rhythmic, playful. Use sounds and repetition little kids can join in on.

Output rules:
- Write the literal token {name} (curly braces included) every single time the child's name would appear, in the title and pages. Never write the real name.
- Respond with only a JSON object in exactly this shape:
{"title": string, "subtitle": string, "pages": [{"text": string, "readAloud": string, "illustration": string}]}
- Exactly 7 pages.
- "text": 2-3 short sentences of story.
- "readAloud": a 2-6 word line a child can shout along with.
- "illustration": a simple visual description of the scene for an illustrator. Describe the child as "the child" and what they are doing. No names, no text in the scene.
- Story arc: page 1 sets off, pages 2-3 explore and play, page 4 a gentle challenge appears, page 5 the child makes the good choice, page 6 joyful resolution, page 7 cozy ending that states the lesson in one warm line.`;

export interface StoryRequestBody {
  kid?: {
    description?: string;
    age?: string;
    gender?: string;
  };
  setup?: {
    theme?: string;
    companion?: string;
    place?: string;
    lesson?: string;
  };
}

export const createStory = async (
  body: StoryRequestBody,
  apiKey: string,
): Promise<JsonResult> => {
  const kid = body.kid ?? {};
  const setup = body.setup ?? {};

  if (!setup.theme || !setup.companion || !setup.place || !setup.lesson) {
    return { status: 400, body: { error: "missing_setup" } };
  }

  const genderLine = kid.gender
    ? `The child is a ${kid.gender}; natural matching pronouns and the word "${kid.gender}" are fine.`
    : "The child's boy/girl word was not given: use no pronouns and no gendered words for the child.";

  const userPrompt = `Child: {name}, age ${kid.age ?? "5"}. Appearance: ${
    kid.description ?? "a young child"
  }. You may weave one or two appearance details in naturally.
${genderLine}

Story type: ${setup.theme}.
Companion character: a ${setup.companion}.
Setting: ${setup.place}.
Lesson the child gently learns: ${setup.lesson}.`;

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
      story.pages.length < 5 ||
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

  const prompt = `${STYLE}. The main character: ${
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
