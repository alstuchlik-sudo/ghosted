# PROJECT.md

## Context

HelloPM Cohort 51 — Assignment 2 submission. Three required deliverables:
1. Slide deck (max 10 slides, PDF): problem, user, AI solution, impact
2. Clickable prototype/demo
3. PRD (PDF)

Product: **Ghosted.** — a job-search tracking + AI prep-generation tool.

**Status:** MTP prototype is built and deployed —
https://ghosted-jade.vercel.app (source: `github.com/alstuchlik-sudo/ghosted`).
Slide deck and PRD are still outstanding deliverables.

**Positioning:** the current job market's defining shared pain is being
ghosted — by recruiters, by ATS black holes, by "we'll be in touch." The
product name and tone lean into that directly instead of using neutral
corporate language, which makes the slide deck's problem statement land
harder and gives the demo a distinct personality.

## Problem statement

Active job seekers managing 5+ concurrent pipelines lose track of stage-specific
next actions and role-specific prep, leading to missed follow-ups and
under-prepared interviews — not from lack of effort, but from lack of a single
system that holds context per pipeline.

## Target user

Active job seekers running multiple concurrent applications at once (e.g.
someone tracking 5-10 live pipelines across different companies, each at a
different stage), rather than someone doing a single, occasional job search.

## Scope — MTP (what gets built/demoed)

### 1. Tracking tool (manual)
- Add a pipeline: company, role, JD (link or pasted text), salary, current stage
- Stages: Applied → Screening → Interview → Offer / Rejected
- Set/update next-action date per pipeline
- Staleness nudge: flag any pipeline with no update in N days
- Likelihood: a subjective 0-100 "gut feeling" score per pipeline (fit + odds
  of winning it), set by the user, shown on the overview card and pipeline
  detail — not derived from any tracking data, purely a personal gut check
- Favorites: mark any pipeline as a favorite and filter the overview to
  favorites only
- Pipeline detail view shows every field (JD text, JD link, salary,
  likelihood, next action) inline, with no click-through required — "Edit
  details" is only for editing, never the only way to see the data
- Manual reordering: drag pipeline cards on the overview to prioritize the
  ones you care about most (persists across reloads)
- Sort-by-likelihood: a toggle that re-orders the overview by likelihood
  descending, overriding manual order for as long as it's on
- Status badges show a short explanation of what triggered that label on
  hover (see "What the status labels mean" below)

### 2. AI prep-generation tool
Triggered per pipeline. Takes as input: the JD, the user's CV/experience
profile, and the pipeline's current stage. Produces:
- Tailored CV bullets
- Tailored cover letter
- Interview talking points (mapped to the user's real experience, relevant to
  the current stage and likely questions)

The CV/experience profile is entered once (not per pipeline) as structured
fields, not a single pasted block: bio (name, email, phone, address — contact
fields optional), career objective, professional experience (repeatable:
from/to, employer, role, description), education (repeatable: from/to,
college, degree), core competencies, and training/certifications. Structuring
it this way is what lets prep generation target specific experience entries
and competencies instead of guessing at relevance from free text.

**Core design principle:** tracking data is not a standalone to-do list — it's
the context that makes the AI prep tailored rather than generic. The
differentiator is that prep quality depends on knowing the user's history and
where they are in that specific process, not just "paste a JD, get a
cover letter."

### 3. Ghost Risk Score
A 0-100% predictive score per open pipeline (Applied/Screening/Interview —
not shown on resolved Offer/Rejected pipelines) estimating how likely it is
to go quiet, shown on the overview card and pipeline detail alongside the
top contributing reasons. This is the upgrade from a flat "N days = stale"
timer to a signal that actually weighs patterns: time since last contact
(primary driver), pipeline stage, role seniority (parsed from the role
title), and how "ghost-prone" the JD reads — vague filler language, thin
detail, no team/reporting info, no salary listed. Computed live from
existing pipeline data (`src/lib/ghostRisk.ts`); not a stored field, since
it has to change automatically as time passes without any user action.
Deterministic heuristic, same "mock AI" approach as prep generation — not a
live model call. This is the differentiator slide: "predicts ghosting
before it happens."

### 4. Auto-drafted follow-up nudge
Closes the loop from "detected" to "drafted" to "ready to send." The moment
a pipeline's status crosses into **Getting quiet** or **Ghosted**, a
"Follow-up nudge" section appears automatically on that pipeline's detail
page (and a compact risk/nudge hint appears on its overview card) — the
user doesn't have to remember to check. A "Draft a follow-up" CTA button
generates both an email and a LinkedIn message, tailored to the pipeline's
stage and exactly how much time has passed since the last update, in a
tone that's deliberately neither desperate nor passive — and, where
possible, references one concrete, JD-relevant highlight from the user's
CV/experience profile as a value-add reminder. Same deterministic
generation approach as prep generation (`src/lib/followUpGenerator.ts`),
stored on the pipeline like `prep` so a draft persists once generated and
can be regenerated ("Redraft").

### 5. About page
A dedicated page (nav: Pipelines / My CV / About) explaining the app's
capabilities in plain language — including what feeds the Ghost Risk Score
and how auto-drafted follow-ups work — and giving a full glossary of every
status label with the exact trigger condition — the same explanation shown
in each badge's hover tooltip, so the two never say different things. Exists
because the status logic (day thresholds, stage-derived labels) isn't
otherwise self-explanatory to a new user or a demo evaluator.

**What the status labels mean** (day thresholds live in `src/lib/status.ts`,
constants `STALE_QUIET_DAYS` / `STALE_GHOSTED_DAYS` / `TEXTED_BACK_WINDOW_DAYS`):
- **Active** (teal) — updated within the last 7 days.
- **Getting quiet** (amber) — no update in 7+ days.
- **Ghosted** (coral) — no update in 14+ days.
- **They texted back!** (blue) — the stage moved forward in the last 2 days.
- **They said yes!** (blue) — pipeline reached the Offer stage.
- **It's not you, it's them** (slate) — pipeline marked Rejected.

## Design and tone

- Pipeline status labels use honest, funny, plain language instead of neutral
  SaaS copy — e.g. "Ghosted", "Getting quiet", "They texted back!" instead of
  "No response" or "Status: stale".
- Staleness nudges are written the same way (e.g. "1 pipeline just crossed
  into ghost territory. Want a nudge drafted?").
- Tone stays light and self-aware, never bitter or discouraging — the humor
  should make a hard job search feel a little more bearable, not mock it.
- A small ghost mascot can appear in the app icon and empty states only — one
  visual joke per screen, not repeated as a gimmick throughout the UI.
- Color coding for statuses: red/coral = ghosted, amber = going quiet,
  teal/green = active and healthy, blue = genuine positive movement (callback,
  offer). Color should reinforce the emotional read at a glance.
- The likelihood score reuses the same red/amber/teal ramp (low/mid/high) for
  visual consistency, but it's a distinct signal from pipeline status — status
  is derived from tracking activity, likelihood is the user's own gut call.

## Out of scope for MTP

- Automated stage detection or tracking triggers of any kind
- Auth, multi-user support, billing
- Production-grade persistence/infrastructure

Tracking entries are fully manual for this demo. Automation is intentionally
deferred — see Roadmap.

## Roadmap (stated in PRD, not built for demo)

**Phase 2 — Email-assisted stage updates**
User pastes an email (e.g. a recruiter reply); AI suggests a stage update
(e.g. "this looks like a move from Applied to Screening") for the user to
confirm.

**Phase 3 — Connected inbox auto-tracking**
Gmail connection auto-detects and updates pipeline stages from incoming email,
removing manual logging entirely.

This phasing is intentional: it lets the MTP prove the value of contextual AI
prep and staleness nudges before taking on the complexity and trust cost of
inbox access.

## Deliverable notes

- **Slide deck:** problem → user → AI solution → impact, ≤10 slides, PDF
- **Prototype/demo:** clickable flow showing add pipeline → stage update →
  staleness nudge → trigger AI prep → view generated CV/cover letter/talking
  points
- **PRD:** focused on the MTP scope above, with the roadmap phases included as
  future work, not current scope
