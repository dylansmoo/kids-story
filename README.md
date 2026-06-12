# Little Hero Stories

A simple MVP for a kids story app. The user picks from a small set of ready-made stories and reads
them page by page. Built to start small, then add features along the way.

## MVP scope (current)

- **Kid profiles**: add one or more children with visual appearance pickers (boy/girl, age,
  skin tone, hair colour, hair style, glasses) and a live cartoon avatar built from the picks.
  Appearance details are woven into stories and the avatar appears on every page.
- **Story builder**: tap-to-select choices (no typing) for the kind of story, the companion,
  the place, and the lesson. A template engine assembles a personalized 7-page story.
- **My stories**: built stories are saved on the device and can be re-read or deleted.
- **Story library**: 6 ready-made wholesome stories across themes (bravery, kindness, bedtime,
  sharing, imagination, helping) with favorites.
- **Reader**: large friendly text with the child's name highlighted, a "say it together" line on
  every page for early readers, progress dots, keyboard arrows, a celebration finish screen.
- **Print keepsake**: print any story as a personalized mini-book.
- No accounts, no tracking; everything is stored locally on the device.
- Classic, wholesome, family-friendly content; no pronoun questions.

## AI story magic

The builder first tries real AI generation through two Vercel serverless functions:

- `api/story.ts` — GPT-4o-mini writes a 7-page personalized story from the builder selections.
  Wholesome-content guardrails are baked into the system prompt: classic family-friendly
  storytelling, no politics or ideology, no pronouns for the child, nothing scary.
- `api/illustration.ts` — gpt-image-1 (DALL-E 3 fallback) paints each page in a consistent
  watercolor picture-book style, using a character sheet built from the kid profile so the hero
  looks the same on every page. Illustrations stream in while reading.

If the API isn't configured or reachable, the builder falls back to instant template stories,
so the app always works.

**Setup**: add an `OPENAI_API_KEY` environment variable to the Vercel project
(Settings → Environment Variables) and redeploy. Approximate cost per illustrated story:
under $0.10 with gpt-image-1 low quality.

## Cloud accounts (Google login + members database)

Google sign-in and the members table activate when a Supabase project is connected:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard: Authentication → Providers → enable **Google** (follow their
   Google Cloud OAuth setup), and add your production URL to the redirect allow-list.
3. Run `supabase/schema.sql` in the SQL Editor to create the `members` table.
4. Add env vars to Vercel (and `.env.local` for dev):
   - `VITE_SUPABASE_URL` — the project URL
   - `VITE_SUPABASE_ANON_KEY` — the anon/public key
5. Redeploy. The login screen now shows "Continue with Google"; signed-in parents are stored
   in `members`. Without these vars the app falls back to the on-device email session.

## Planned next

- Audio read-along
- More stories, themes, and seasonal packs
- Accounts and cloud-saved stories

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
