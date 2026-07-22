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
- Add a pipeline: company, role, JD (link or pasted text), current stage
- Stages: Applied → Screening → Interview → Offer / Rejected
- Set/update next-action date per pipeline
- Staleness nudge: flag any pipeline with no update in N days

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
