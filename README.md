# Promptsmith Quest

A playable prompt-building puzzle with constraints, QA gates, and final prompt scoring.

![Demo screenshot](docs/demo-screenshot.png)

## Live Demo

- Demo: [https://foxhen-promptsmith-quest.vercel.app](https://foxhen-promptsmith-quest.vercel.app)
- Repository: [https://github.com/foxandhenllc/foxhen-promptsmith-quest](https://github.com/foxandhenllc/foxhen-promptsmith-quest)

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

## Local Run

```bash
npm install
npm run dev
npm run build
```
