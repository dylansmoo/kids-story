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

## Planned next

- LLM story generation behind the same builder inputs, with parent-set guardrails
- Per-page illustration generation using the consistent avatar character
- Audio read-along
- More stories, themes, and seasonal packs

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
