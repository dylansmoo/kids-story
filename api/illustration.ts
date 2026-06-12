import type { VercelRequest, VercelResponse } from "@vercel/node";

const STYLE =
  "Soft watercolor children's picture book illustration, warm pastel colors, rounded friendly shapes, gentle storybook light, cozy and cheerful mood";

const SAFETY =
  "Wholesome, calm, child-friendly scene. Absolutely no text, letters, numbers, or words in the image. Nothing scary or sad.";

interface IllustrationRequestBody {
  scene?: string;
  character?: string;
}

const generate = async (
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

  const body = (req.body ?? {}) as IllustrationRequestBody;
  if (!body.scene) {
    res.status(400).json({ error: "missing_scene" });
    return;
  }

  const prompt = `${STYLE}. The main character: ${
    body.character ?? "a happy young child"
  }. Scene: ${body.scene}. ${SAFETY}`;

  try {
    let result = await generate(apiKey, "gpt-image-1", prompt);

    // gpt-image-1 requires a verified OpenAI org; fall back to DALL-E 3 if unavailable.
    if (!result.ok && result.status >= 400 && result.status < 500) {
      console.warn("gpt-image-1 unavailable, falling back to dall-e-3", result.detail);
      result = await generate(apiKey, "dall-e-3", prompt);
    }

    if (!result.ok || !result.b64) {
      console.error("Illustration failed", result.status, result.detail);
      res.status(502).json({ error: "illustration_failed" });
      return;
    }

    res.status(200).json({ image: `data:image/png;base64,${result.b64}` });
  } catch (error) {
    console.error("Illustration failed", error);
    res.status(502).json({ error: "illustration_failed" });
  }
}
