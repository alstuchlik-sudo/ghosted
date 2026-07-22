# Ghosted.

Clickable prototype for the HelloPM Cohort 51 Assignment 2 submission. See
`PROJECT.md` for scope and `CLAUDE.md` for working conventions.

## Run it

```bash
npm install
npm run dev
```

Data (pipelines + CV/profile) persists to `localStorage` — no backend. First
load seeds five sample pipelines and a sample CV so the demo has something to
show immediately; edit or delete them freely.

## What's here

- **Dashboard** (`/`) — pipeline cards, staleness nudge banners, status badges
- **Add/Edit pipeline** (`/pipeline/new`, `/pipeline/:id/edit`) — company,
  role, JD, stage, next-action date
- **Pipeline detail** (`/pipeline/:id`) — log updates/stage changes, history,
  trigger AI prep generation
- **My CV** (`/profile`) — the CV/experience text used as context for prep
  generation

AI prep generation (`src/lib/prepGenerator.ts`) is template-based, not a real
LLM call — it matches JD keywords against the CV text to produce tailored CV
bullets, a cover letter, and stage-specific talking points. Good enough for
demo screenshots and a live clickable walkthrough; swapping in a real model
call later is a contained change to that one file.
