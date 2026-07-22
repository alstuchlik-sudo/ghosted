# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Ghosted.** — a job-search tracking + AI prep-generation tool, built as the
HelloPM Cohort 51 Assignment 2 submission (slide deck, clickable prototype, PRD).
The name and tone lean into the shared job-market pain of being ghosted by
recruiters/companies — the product is honest and funny about it rather than
neutral corporate copy.

See `PROJECT.md` for full scope, deliverables, and roadmap. Read it first when
picking up work in this repo.

**Status:** the MTP prototype is built and deployed — live at
https://ghosted-jade.vercel.app, source pushed to
`github.com/alstuchlik-sudo/ghosted` (GitHub → Vercel auto-deploy on push to
`main`). Slide deck and PRD are separate, not-yet-built deliverables.

## Implementation notes

- **Stack:** React + TypeScript + Vite + Tailwind v4 + react-router-dom. No
  backend — all state (`Pipeline[]`, `Profile`) lives in `localStorage` via
  the context/store in `src/store/store.tsx`.
- **AI prep generation is not a real model call.** `src/lib/prepGenerator.ts`
  is a deterministic keyword-matcher: it scores the JD against a skill lexicon
  and the user's core competencies, then picks/tailors matching lines from
  structured experience entries. This was a deliberate choice (no API key,
  no backend, works offline) — swapping in a real LLM call is a contained
  change to this one file, but confirm with the user first since it adds
  real infra/cost to what's meant to be a lightweight demo.
- **Profile is structured, not free text** (`src/types/index.ts`): `bio`
  (email/phone/address, all optional), `careerObjective`, repeatable
  `experience[]` (from/to/employer/role/description) and `education[]`
  (from/to/college/degree) entries, plus `coreCompetencies[]` and
  `trainingCertifications[]` as string lists. The prep generator reads
  directly from these fields — don't reintroduce a free-text CV blob without
  updating `prepGenerator.ts` to match.
- **Storage keys are versioned** (`ghosted:pipelines:v2`, `ghosted:profile:v2`,
  `ghosted:seeded:v2` in `store.tsx`). Bump the suffix again if you change
  either shape incompatibly, so existing demo browsers reseed cleanly instead
  of loading stale/malformed data.
- **Status/staleness logic** lives in `src/lib/status.ts` (thresholds,
  color mapping, the "They texted back!" / "Ghosted" / "Getting quiet" labels)
  — keep new status copy there, not scattered across components.
- Verify UI changes with a real browser pass (Playwright, installed
  temporarily and removed after — it's not a permanent devDependency) before
  calling a change done; this app has no automated test suite.

## Product summary (quick reference)

- User manually tracks job pipelines (company, role, JD, stage, next-action date).
- System flags stale pipelines (no update in N days).
- Per pipeline, user can trigger AI prep generation, which uses the JD + the
  user's CV/experience + the current pipeline stage to produce:
  1. Tailored CV bullets
  2. Tailored cover letter
  3. Interview talking points (mapped to real experience, relevant to that stage)

The tracking data is not just a to-do list — it's the context that makes the AI
prep output tailored instead of generic. Don't design features that break that
link (e.g. a "prep generator" that only takes a JD with no stage/history context).

## Tone and copy

Status labels and nudges should be written in plain, honest, slightly funny
language — not neutral SaaS copy. This is core to the product's identity, not
decoration.

- Use it: "Ghosted", "Getting quiet", "They texted back!", "1 pipeline just
  crossed into ghost territory"
- Don't use it: "No response received", "Status: stale", "Follow-up required"

Keep the humor light and self-aware, never bitter or discouraging — the user
is going through a genuinely hard job search, so the tone should feel like a
friend making it bearable, not mocking the situation.

A small ghost mascot can appear in the app icon and empty states, but don't
overuse it — one visual joke per screen, not a gimmick repeated everywhere.

## Scope discipline

This is an assignment MTP (max ~10 slides, one clickable demo, one PRD). Only
build what's needed to demo the core loop end-to-end:
add pipeline → log stage → generate prep → see staleness nudge.

Do NOT build, even if it seems easy to add:
- Email parsing / inbox connection (Gmail auto-tracking) — this is an explicit
  Phase 2/3 roadmap item, not part of the demo. If asked to "just add" it,
  flag that it's out of MTP scope before proceeding.
- Multi-user auth, billing, or real persistence beyond what's needed for a demo
- Any AI feature that ignores pipeline stage/context (defeats the differentiator)

## Working style

- Prefer a working clickable prototype over polished infrastructure — this is a
  demo artifact, not a production system.
- When generating CV/cover letter/talking-points content, keep prompts and
  sample outputs realistic and reusable for the actual slide deck screenshots.
- Flag scope creep against PROJECT.md before adding anything not listed there.
