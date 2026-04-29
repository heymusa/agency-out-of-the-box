---
description: Pick a service-agency niche, validate it against hard criteria, and produce sections 1-7 of agency-context.md (Identity, Niche, ICP, Pain Points, Positioning, Offer, Service Tier Ladder). Cold-start entry point for the toolkit.
argument-hint: "[optional-niche-hint]"
---

# /pick-niche

Cold-start command. Helps the operator pick a niche, validate it, and stand up the foundational `agency-context.md`. The output unblocks every downstream command.

## What this command does

1. **Greets the operator** and asks whether they're starting cold or pivoting an existing pick.
2. **Invokes `industry-strategist`** (Opus, high effort) to run niche research and offer design.
3. **Persists results** to `.agents/agency-context.md` (the keystone document).
4. **Reports downstream readiness** — which other commands are now unblocked.

## Workflow

### Step 1 — orient the operator

Greet briefly. Then ask via `AskUserQuestion`:

> "What's your starting point?"
>
> Options:
> - "Cold start — I haven't picked a niche yet"
> - "I have a niche in mind and want to validate it"
> - "I'm pivoting from an existing niche"
> - "Skip to offer design — niche is set"

If the operator passed an argument (`/pick-niche dental`), use it as the niche hint and skip ahead to the validate path.

### Step 2 — load existing state

Read `.agents/agency-context.md` if it exists. Also check `.claude/agency-context.md` for older setups (offer to migrate).

If the file is partially filled, summarize what's already captured before doing anything else.

### Step 3 — invoke industry-strategist

```
Agent(
  subagent_type="industry-strategist",
  description="Pick + validate niche, design offer",
  prompt="<state from steps 1-2 + any operator inputs>"
)
```

The strategist runs in a worktree (`isolation: worktree` in its frontmatter) so it can take notes and iterate without polluting the main branch. It returns a structured summary.

### Step 4 — present the summary to the operator

Render the strategist's run summary (the structured block from its output contract). Highlight:

- Recommended niche + justification.
- Offer one-liner + investment + guarantee.
- Which downstream commands are now ready.
- Any open questions that still need operator input.

### Step 5 — confirm and persist

Use `AskUserQuestion`:

> "Persist this niche + offer to .agents/agency-context.md?"
>
> Options:
> - "Yes, persist as version 1"
> - "No, let's iterate on the offer first"
> - "No, let's pick a different niche"

On yes:
- Merge the strategist's worktree changes into the main branch.
- Confirm the file is written.
- Suggest next steps (`/build-agency-site` if site is the next priority; `/new-funnel` if running paid traffic first).

On iteration: route back to the strategist with the operator's pushback.

### Step 6 — recommend next action

Based on the operator's stated priorities (recurring revenue retreat → site first; paid traffic now → funnel first), recommend the next slash command.

## Hard rules

- **Do not skip the strategist.** Don't try to write agency-context yourself. The strategist owns sections 1-7.
- **Do not auto-approve.** Always show the operator the summary and ask for explicit confirmation before persisting.
- **Do not write to `stacks/`, `design-system/`, or `industries/`** — out of scope for this command.

## Anti-patterns

- **"Let me just pick something to get started."** Wrong. The niche choice is the most expensive decision in the toolkit. Insist on real research.
- **Asking 15 questions in one message.** Use `AskUserQuestion` one cluster at a time. The strategist handles the deep dive.
- **Accepting "small business" as a niche.** Push back. The strategist knows to refuse this; don't override.

## Example invocations

```
/pick-niche
→ Cold start. Strategist runs full niche research.

/pick-niche dental
→ Argument used as a candidate. Strategist validates against the rubric.

/pick-niche
→ (with existing agency-context.md filled)
→ Asks if validating, pivoting, or skipping to offer design.
```

## What unblocks downstream

After a successful `/pick-niche`:

- `/build-agency-site` — ready iff §1-§9 filled (visual identity §9 may still be TODO; the design-builder can fill defaults).
- `/new-funnel` — ready iff §6, §7 filled.
- `/new-landing-page` — ready iff §6 filled.
- `/new-client-site` — ready iff §1-§9 filled AND a `clients/{name}.md` overlay exists.
- `/ship-it` — ready iff §13 (tech / domain inventory) is filled.
