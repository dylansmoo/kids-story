import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createStory, type StoryRequestBody } from "./_lib";

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

  const result = await createStory((req.body ?? {}) as StoryRequestBody, apiKey);
  res.status(result.status).json(result.body);
}
