import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `You write personalized read-aloud picture-book stories for children aged 2 to 8.

Strict content rules:
- Classic, wholesome, family-friendly storytelling only.
- No politics, activism, ideology, modern social controversies, or moral lecturing.
- No gender-identity or sexuality themes. Never use pronouns for the child; refer to the child only with the literal token {name}.
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

interface StoryRequestBody {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "not_configured" });
    return;
  }

  const body = (req.body ?? {}) as StoryRequestBody;
  const kid = body.kid ?? {};
  const setup = body.setup ?? {};

  if (!setup.theme || !setup.companion || !setup.place || !setup.lesson) {
    res.status(400).json({ error: "missing_setup" });
    return;
  }

  const genderLine = kid.gender
    ? `The child is a ${kid.gender}. The word "${kid.gender}" may appear naturally (for example "the bravest ${kid.gender} in town"), but never pronouns.`
    : "Do not use gendered words for the child.";

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
      const detail = await response.text();
      console.error("OpenAI story error", response.status, detail);
      res.status(502).json({ error: "generation_failed" });
      return;
    }

    const completion = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: "generation_failed" });
      return;
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
      res.status(502).json({ error: "bad_generation" });
      return;
    }

    res.status(200).json({
      title: story.title,
      subtitle: typeof story.subtitle === "string" ? story.subtitle : "",
      pages: story.pages.map((page) => ({
        text: page.text ?? "",
        readAloud: typeof page.readAloud === "string" ? page.readAloud : "Hooray!",
        illustration: typeof page.illustration === "string" ? page.illustration : "",
      })),
    });
  } catch (error) {
    console.error("Story generation failed", error);
    res.status(502).json({ error: "generation_failed" });
  }
}
