import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createStory, ipFrom, withinLimit, type StoryRequestBody } from "./_lib";

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

  if (!withinLimit("story", ipFrom(req.headers), 30)) {
    res.status(429).json({ error: "rate_limited" });
    return;
  }

  const result = await createStory((req.body ?? {}) as StoryRequestBody, apiKey);
  res.status(result.status).json(result.body);
}
