# CLAUDE.md

Guidance for Claude (Code, Cowork, or any agent) working inside this repo.

## What this repo is

**Agency-Out-of-the-Box** — a Claude-native toolkit for running a service-business agency end-to-end. Pick a niche, stand up the agency's own site, generate landing pages and funnels, deliver client websites that actually convert, ship them. Without AI slop.

**Audience:** the operator running a service-agency play (dental marketing, legal SEO, home-services lead-gen, B2B fractional consulting, etc.).

**Not audience:** SaaS PMM teams. They have [marketingskills](https://github.com/coreyhaines31/marketingskills), which can install alongside this toolkit.

## The doctrine — read this before doing anything

1. **`agency-context.md` is the single source of truth.** It lives at `.agents/agency-context.md`. Every skill reads it before asking questions. Never ask the operator something that's already in the file.
2. **No AI slop.** The full rule sheet is in `.claude/rules/conversion.md`. The short version: no lorem ipsum, no fabricated testimonials, no buzzword headlines, no generic "passionate / innovative / dedicated" feature grids, every benefit must include a specific outcome with numbers or names, and every page must pass the 5-second test.
3. **Specific over vague, always.** "Save time on reporting" → reject. "Cut your weekly reporting from 4 hours to 15 minutes" → ship.
4. **One primary CTA per viewport.** No conflicting goals.
5. **Real social proof or explicit TODO.** No invented quotes. If we don't have a real testimonial yet, the agent inserts a `<!-- TODO: replace with real client quote — DO NOT SHIP -->` and `qa-reviewer` blocks the deploy.
6. **Mobile-first, accessibility floor.** Lighthouse a11y ≥ 95, real alt text, WCAG AA contrast, focus states.

## How the system is wired

```
COMMAND  →  AGENT (with preloaded skills)  →  SKILL  →  artifact
```

- **Commands** are the operator's entry points (`/pick-niche`, `/build-agency-site`, etc.). Source: `commands/` (top level). Installed to `.claude/commands/` via the plugin marketplace.
- **Agents** are specialist subagents with preloaded skills. Source: `agents/`. Installed to `.claude/agents/`. The five agents are `industry-strategist`, `conversion-copywriter`, `design-builder`, `seo-strategist`, `qa-reviewer`.
- **Skills** are tightly-scoped instruction modules. Source: `skills/`. Installed to `.claude/skills/`. Eleven skills total — see the README for the full inventory.

**Repo layout convention.** This repo follows the Claude Code plugin marketplace convention (matching [marketingskills](https://github.com/coreyhaines31/marketingskills)): the plugin's content lives at the top level (`skills/`, `agents/`, `commands/`, `rules/`, `hooks/`). The marketplace manifest is in `.claude-plugin/marketplace.json`. When operators install the plugin, Claude Code merges the content into their project's `.claude/` directory.

**Subagents do not spawn other subagents.** Only commands orchestrate. If you find yourself needing nested orchestration, that's the command's job, not an agent's.

## Workflow rules

- Commands ask `AskUserQuestion` for any decision the operator hasn't already settled in `agency-context.md`.
- Long pipelines (multi-page sites) split into worktrees so `seo-strategist` and `design-builder` can run in parallel without merge conflicts. Set `isolation: worktree` in the agent frontmatter.
- For copy-heavy steps, agents read voice from `agency-context.md` §8 and the loaded `industries/{niche}/voice.md`. They never invent voice.
- For visual steps, agents read tokens from `design-system/tokens.json` and compose pages from `design-system/blocks/`. They never write components from scratch when a block exists.
- Every artifact passes through `qa-reviewer` before any `/ship-it` deploy. The QA gate has block authority — that is intentional.

## Default tech choices (overridable per project)

- **Marketing / SEO sites** → Astro + Tailwind + shadcn primitives + MDX content collections. Always bootstrap with the current `npm create astro@latest` (see `stacks/astro-marketing/bootstrap.md`) — do **not** vendor framework versions.
- **Funnels / interactive pages** → Next.js App Router + Tailwind + shadcn + Server Actions. Always bootstrap with the current `npx create-next-app@latest` (see `stacks/nextjs-funnel/bootstrap.md`).
- **Forms** → Resend or Formspree.
- **Booking** → Cal.com.
- **Analytics** → Plausible (default), GA4 (alternate), PostHog (event-tracking funnels).
- **Hosting** → Vercel (default), Cloudflare Pages (alternate).

**Stack hygiene rule.** Never re-introduce `package.json`, `tsconfig.json`, or framework configs into `stacks/*/` (outside `overlay/`). Frameworks ship breaking changes; we delegate version selection to upstream's official scaffolders and only carry the small set of files we genuinely own (Tailwind token bridge, layouts, scaffold pages, lead actions).

## Skill discovery — how Claude knows when to use what

Skills auto-load via their `description:` frontmatter. Trigger phrases live there. If a skill should activate only on certain files, set `paths:` glob in the frontmatter.

Rules in `.claude/rules/*.md` lazy-load via their `paths:` frontmatter — they're scoped to where they apply (conversion rules apply to page files, design-system rules apply to component files, etc.). Never put rules at top-level without `paths:` unless the rule truly needs to fire on every session.

## Reference docs in this repo

- `README.md` — the user-facing pitch and quickstart.
- `PLAN.md` — the master plan: architecture, skill inventory, roadmap.
- `rules/conversion.md` — the no-AI-slop doctrine.
- `rules/design-system.md` — token discipline, alignment, type scale.
- `industries/{niche}/` — per-niche voice, personas, proof patterns, compliance constraints.
- `design-system/` — tokens, primitives, blocks (shared across stacks).
- `stacks/{name}/bootstrap.md` — the canonical, version-free init procedure for that stack.

## When you don't know — search this repo first

Before relying on training knowledge or external docs, check `rules/`, `skills/*/SKILL.md`, `industries/{niche}/`, and `PLAN.md`. They are the authoritative source for this toolkit.

## Git commit etiquette

One concern per commit. Skill changes commit separately from doctrine changes commit separately from stack-template changes. Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
