---
description: Build a multi-step paid-traffic funnel (Next.js stack with Server Actions). Funnel types - lead-magnet → email → call, quiz → personalized result → call, VSL → application → call, free-strategy-session → application → enrollment. Each step instrumented with funnel_step_advanced events.
argument-hint: "<funnel-name> --type=lead-magnet|quiz|vsl|application"
---

# /new-funnel

Multi-step funnel. For higher-ticket offers ($3k+) or qualification-heavy flows where a single LP isn't enough.

## What this command does

1. **Validates `.agents/agency-context.md` §6, §7** (offer + service tiers).
2. **Gathers funnel-specific inputs** (type, steps, qualifying criteria).
3. **Invokes `conversion-copywriter`** for per-step copy.
4. **Invokes `design-builder`** for multi-step composition with Server Actions.
5. **Invokes `analytics-wiring`** for `funnel_step_advanced` event chain.
6. **Invokes `qa-reviewer`** with funnel-specific QA (per-step analytics, no-lock-in steps, persistent form data).
7. **Outputs** deployable Next.js project under `output/funnels/{name}/`.

## Workflow

### Step 1 — preflight

Read `.agents/agency-context.md`. Required: §6, §7.

### Step 2 — pick funnel type

Use `AskUserQuestion`:

**Lead-magnet → email → call** (low-friction, $1-3k offers, top-of-funnel)
- Step 1: squeeze page (lead magnet pitch + form).
- Step 2: thank-you / delivery + soft up-sell.
- Step 3 (over 14-day email sequence): nurture, pitch, book call.

**Quiz → personalized result → call** ($2-5k offers, qualification + segmentation)
- Step 1: intro.
- Steps 2-N: 5-8 questions with branching.
- Step N+1: email gate.
- Step N+2: personalized result + matching offer + CTA.

**VSL → application → call** (high-ticket $5-25k, coaching / consulting)
- Step 1: VSL (6-12 min, application button appears at minute 7).
- Step 2: application (6-10 qualifying questions).
- Step 3: booking (Cal.com embed if qualified, polite redirect if not).

**Free-strategy-session → application → enrollment** (premium $25k+, consultative high-ticket)
- Step 1: VSL or sales letter pitching the strategy session.
- Step 2: application (deeper than the VSL funnel — financials, current state).
- Step 3: 60-min strategy session via Cal.com.
- Step 4: enrollment offer (separate URL, locked behind step-3 attendance).

### Step 3 — gather funnel-specific inputs

Per funnel type, use `AskUserQuestion` for the missing inputs:

- Lead-magnet funnel: lead-magnet topic, lead-magnet asset (PDF / video / template), email sequence length (default 5).
- Quiz funnel: topic, dimensions (5-8 questions), result archetypes (typically 4-6).
- VSL funnel: VSL recording (URL or "TODO: operator records"), application qualifying questions.
- Strategy-session funnel: positioning of the session, session duration, qualifying criteria.

### Step 4 — write funnel brief

Persist `output/funnels/{name}/brief.md`.

### Step 5 — invoke conversion-copywriter (per step)

For each step in the funnel, the copywriter produces `output/funnels/{name}/copy/step-{N}.json`.

For the email sequence (lead-magnet funnel), the copywriter produces `output/funnels/{name}/email-sequence.md` with day-by-day copy.

For the quiz, the copywriter produces:
- `output/funnels/{name}/quiz-questions.json` (questions + branching logic + scoring)
- `output/funnels/{name}/quiz-results.json` (per-archetype copy + matching offer)

### Step 6 — invoke design-builder

```
Agent(
  subagent_type="design-builder",
  description="Compose {N}-step funnel into stacks/nextjs-funnel",
  prompt="<context: funnel brief, copy per step, target=output/funnels/{name}, type={type}>"
)
```

Builds:
- `app/funnels/{name}/page.tsx` — step 1.
- `app/funnels/{name}/step-2/page.tsx` etc.
- `app/funnels/{name}/actions.ts` — Server Actions for form submission, advancement, qualification logic.
- Form data persisted across steps using URL searchParams + localStorage fallback (no PII in URL).

### Step 7 — analytics wiring

Per-step events: `funnel_step_advanced` with `funnel_id={name}`, `from_step={N}`, `to_step={N+1}`.

VSL funnel adds: `video_played`, `video_25/50/75/100`.

Quiz funnel adds: `quiz_started`, `quiz_completed` (with `result_archetype`), per-question `quiz_answered`.

Application funnel adds: `application_submitted`, `application_qualified` / `application_disqualified`.

### Step 8 — QA gate

QA-reviewer's funnel-specific checks:
- Each step's primary CTA fires `funnel_step_advanced`.
- Back button works (browser back returns to previous step with form data preserved).
- Forward navigation re-validates input (no broken state).
- Disqualification flow (if applicable) is honest, polite, and provides alternatives.
- Email sequence (if applicable) has all N emails written and queued in the operator's ESP (or marked TODO).
- VSL plays on all 5 viewports.

### Step 9 — output package

`output/funnels/{name}/` includes:
- The Next.js project (deployable).
- The brief.
- The email sequence (if applicable) — with import-ready format for ConvertKit / Customer.io / Mailchimp.
- DEPLOY.md with Vercel + email-provider setup steps.

### Step 10 — recommend next

- Suggest connecting the funnel to a CRM (Composio MCP can wire HubSpot / Salesforce / Close).
- Suggest A/B testing the headline + offer angle (use `--variant=B` on a re-run).

## Hard rules

- **Cap step count at 5.** 7+ becomes a graveyard.
- **Per-step analytics required.** No optional. If `funnel_step_advanced` doesn't fire on every transition, QA blocks.
- **Form data persists across steps.** Back-button friendly. No "session expired" mid-funnel.
- **Honest disqualification.** If everyone qualifies, the funnel isn't qualifying — it's a lead form with extra steps.

## Anti-patterns

- **Step 1 with 12 form fields.** No. Step 1 is name + email + maybe one qualifying field.
- **Quiz where the result is the same regardless of inputs.** Brand-poison. Buyers detect immediately.
- **VSL with auto-play sound.** Mute by default; muted videos can autoplay.
- **No back button / step navigation.** Hostile UX.

## Example invocations

```
/new-funnel q2-launch --type=lead-magnet
/new-funnel dental-quiz --type=quiz
/new-funnel high-ticket-coaching --type=vsl
/new-funnel fractional-cfo-strategy-session --type=application
```
