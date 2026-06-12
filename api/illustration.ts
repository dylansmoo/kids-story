import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createIllustration, type IllustrationRequestBody } from "./_lib";

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

  const result = await createIllustration(
    (req.body ?? {}) as IllustrationRequestBody,
    apiKey,
  );
  res.status(result.status).json(result.body);
}
