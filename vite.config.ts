import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { createIllustration, createNarration, createStory } from "./api/_lib";

const readApiKey = (root: string): string | undefined => {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  try {
    const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
    const match = env.match(/^OPENAI_API_KEY=(.+)$/m);
    return match?.[1]?.trim();
  } catch {
    return undefined;
  }
};

/** Serves the same /api endpoints as Vercel so AI generation works in local dev. */
const localApi = (): Plugin => ({
  name: "local-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url?.split("?")[0];
      if (url !== "/api/story" && url !== "/api/illustration" && url !== "/api/narrate") {
        next();
        return;
      }

      const respond = (status: number, body: unknown) => {
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      };

      if (req.method !== "POST") {
        respond(405, { error: "method_not_allowed" });
        return;
      }

      const apiKey = readApiKey(server.config.root);
      if (!apiKey) {
        respond(503, { error: "not_configured" });
        return;
      }

      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};

        const result =
          url === "/api/story"
            ? await createStory(body, apiKey)
            : url === "/api/narrate"
              ? await createNarration(body, apiKey)
              : await createIllustration(body, apiKey);
        respond(result.status, result.body);
      } catch (error) {
        console.error("Local API error", error);
        respond(500, { error: "internal_error" });
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), localApi()],
});
