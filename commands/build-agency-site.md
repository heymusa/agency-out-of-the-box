---
description: End-to-end build of the agency's own website (Astro stack, StoryBrand long-form structure). Runs the seo-strategist → conversion-copywriter → design-builder → qa-reviewer pipeline. Output goes to output/agency-site/ and stacks/astro-marketing/. Requires agency-context.md §1-§9 filled.
argument-hint: "[--stack=astro|nextjs] [--pages=all|homepage,about,...] [--niche=dental]"
---

# /build-agency-site

The marquee command. Stands up the agency's own website end-to-end.

## What this command does

1. **Validates `.agents/agency-context.md`** has §1-§9 filled.
2. **Invokes `seo-strategist`** to produce site architecture, keyword map, internal-link graph, schema templates.
3. **Invokes `conversion-copywriter`** to write StoryBrand long-form copy for each page; outputs structured copy props as JSON.
4. **Invokes `design-builder`** (in parallel worktree where possible) to compose pages from blocks, apply industry overlay, run dev build.
5. **Invokes `analytics-wiring`** to instrument the stack with the operator's chosen analytics provider.
6. **Invokes `qa-reviewer`** to run the 9-section QA gate.
7. **Reports** PASS / BLOCK with specific fixes routed to upstream agents.

## Workflow

### Step 1 — preflight

Read `.agents/agency-context.md`. Validate completeness:

- §1 Identity ✓
- §2 Niche ✓
- §3 ICP ✓
- §4 Pain Points ✓ (must have at least 3 verbatim quotes)
- §5 Positioning ✓
- §6 Offer ✓ (Grand-Slam Offer block complete)
- §7 Service Tier Ladder ✓
- §8 Brand Voice ✓
- §9 Visual Identity ✓ (or default tokens applied)
- §11 Proof Inventory — flag if empty (impacts social proof; surface as TODO list to operator)
- §13 Tech / Domain Inventory — flag if empty (blocks `/ship-it`, but doesn't block this command)

If any required section is missing or thin, halt and ask:
> "Required sections missing: §X, §Y. Run /pick-niche first to refine, or fill them manually?"

### Step 2 — resolve arguments

Parse arguments:
- `--stack=astro` (default) or `--stack=nextjs`
- `--pages=all` (default: homepage, services index, all service-pages, about, case-studies, pricing, contact, blog index) or comma-separated subset
- `--niche=dental` (overrides agency-context §2 if present; loads `industries/{niche}/` overlay)

Confirm the page list with the operator if `--pages=all`:
> "Pages to build: {list}. Proceed?"

### Step 3 — invoke seo-strategist

```
Agent(
  subagent_type="seo-strategist",
  description="Site arch + keyword map + schema for {pages}",
  prompt="<context: agency-context, target pages, niche overlay>"
)
```

The strategist runs in a worktree. Returns: `output/seo/site-arch.md`, `output/seo/keyword-map.md`, `output/seo/internal-links.md`, `output/seo/schema-templates/`.

### Step 4 — invoke conversion-copywriter

```
Agent(
  subagent_type="conversion-copywriter",
  description="StoryBrand copy for {pages}",
  prompt="<context: agency-context, site arch from seo-strategist, framework=storybrand>"
)
```

The copywriter runs in a worktree. Returns: `output/copy/{page-slug}.md` and `output/copy/{page-slug}.json` for each page.

### Step 5 — invoke design-builder

```
Agent(
  subagent_type="design-builder",
  description="Compose {pages} into {stack}",
  prompt="<context: agency-context, copy props from conversion-copywriter, schema templates from seo-strategist, niche overlay>"
)
```

The design-builder runs in a worktree. Composes each page from blocks. Updates Tailwind config with industry overlay. Runs `pnpm build` to verify compilation. Returns: `stacks/{stack}/src/pages/*.astro` files written.

### Step 6 — analytics wiring

The design-builder invokes the `analytics-wiring` skill as part of its run (Step 6 in that skill's workflow). If §13 indicates a provider that needs config, surface to operator for IDs / API keys via `AskUserQuestion`.

### Step 7 — invoke qa-reviewer

```
Agent(
  subagent_type="qa-reviewer",
  description="9-section QA gate on agency site",
  prompt="<context: agency-context, paths to pages built, dev server URL>"
)
```

Runs the full QA gate. Returns PASS or BLOCK with fix list.

### Step 8 — handle the verdict

If **PASS:**
- Merge worktrees back to main branch.
- Report success with list of pages built, dev URL, and the deploy command (`/ship-it stacks/{stack}/`).

If **BLOCK:**
- Surface the specific fix list to the operator.
- For each fix, route back to the responsible agent automatically (re-invoke with the fix scope).
- Re-run qa-reviewer after fixes complete.
- Cap at 3 fix iterations before halting and asking the operator to take over.

### Step 9 — recommend next action

Based on what's now live:
- Suggest `/ship-it stacks/{stack}/` if QA passes and §13 is filled.
- Suggest `/new-funnel` if the operator hasn't built a paid-traffic funnel yet.
- Suggest case-study generation if §11 is thin.

## Hard rules

- **Don't proceed without §1-§9 filled.** Halt if missing. The build will produce slop without complete context.
- **Don't auto-deploy.** `/ship-it` is a separate command requiring explicit invocation.
- **Don't fix QA blocks yourself.** Route to upstream agents. You orchestrate; they fix.
- **Don't inline copy or design.** All copy goes through `conversion-copywriter`; all design through `design-builder`.

## Anti-patterns

- **Trying to build all pages in one giant agent run.** Split by page, run agents in parallel via worktrees.
- **Skipping qa-reviewer "because it looks fine."** No. The whole point is the gate.
- **Iterating on QA fixes more than 3 times.** If the agents can't pass after 3 cycles, surface to the operator — there's a structural problem (bad input data, missing assets, etc.) that automation can't solve.

## Example invocations

```
/build-agency-site
→ Default: Astro, all pages, niche from agency-context.

/build-agency-site --pages=homepage,pricing,about
→ Subset.

/build-agency-site --stack=nextjs
→ Use Next.js stack instead of Astro (e.g., for client portal integration).

/build-agency-site --niche=dental
→ Override agency-context niche; load dental overlay.
```
