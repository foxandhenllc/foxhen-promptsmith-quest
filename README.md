# Promptsmith Quest

A playable prompt-building puzzle with constraints, QA gates, and final prompt scoring.

![Demo screenshot](docs/demo-screenshot.png)

## Live Demo

- Demo: [https://freetoolsforpeople.com/promptsmith-quest](https://freetoolsforpeople.com/promptsmith-quest)
- Repository: [https://github.com/foxandhenllc/foxhen-promptsmith-quest](https://github.com/foxandhenllc/foxhen-promptsmith-quest)

## Purpose

Playable prompt-building puzzle for assembling constraints, quality gates, scoring, and exportable prompt handoffs.

## Fully Working Behaviors

- Three-level prompt-building quest with changing challenge briefs, required categories, locked categories, max block counts, and pass scores.
- Drag-and-drop or click-to-add prompt blocks into a staged forge.
- Scoring feedback for missing gates, locked categories, ordering bonus, concision, and level pass/fail state.
- Persistent best score stored locally with `localStorage`.
- Copy/export prompt handoff with the assembled prompt and scoring notes.
- Deterministic test hooks exposed as `window.render_game_to_text` and `window.advanceTime`.
- No backend, auth, external service calls, production data, or customer work.

## Fork Notes

All prompt blocks and challenges are fictional local sample data. Customize blocks, scoring, or level constraints in `src/gameLogic.ts`; no credentials are needed.

## SEO / AIO Discoverability

**Plain-language answer:** Use this repo as a playable prompt-building puzzle for assembling constraints, quality gates, scoring, and exportable prompt handoffs.

**Who it helps:** AI builders, educators, and teams practicing prompt quality gates.

**Search intents covered:**

- prompt engineering game
- prompt quality gate puzzle
- AI prompt training game
- prompt handoff export

**Why this repo is useful:** It teaches prompt structure through interaction rather than static advice, with scoring and exportable results.

## Local Run

```bash
npm install
npm run dev
npm run build
```
