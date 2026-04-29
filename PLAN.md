# Agency-Out-of-the-Box — Master Plan

A Claude-native toolkit for running a service-business agency end-to-end: pick a niche, stand up the agency's own site, generate landing pages and funnels for paid + organic traffic, deliver client websites that actually convert, and ship them — all without AI slop.

**Status:** Research + design plan. No code yet.
**Author:** Musa
**Date:** 2026-04-28

---

## 1. North Star and Non-Goals

### North Star

A single installable Claude Code plugin (and Cowork plugin) that takes an operator from **"I want to start an agency in industry X"** to **"I have a live agency site, a working paid-traffic funnel, and a repeatable client-delivery pipeline"** in days, not months. Every artifact it produces is conversion-grade — not template fill, not lorem ipsum, not "We are passionate about innovation" garbage.

### Non-Goals (what we will refuse to build)

- A 40-skill kitchen sink. Marketingskills already exists for that. We borrow what we need and reference the rest.
- A drag-and-drop visual builder. We're an agentic toolkit, not Webflow.
- A SaaS product-marketing toolkit. The audience is **service agencies**, not B2B SaaS PMM.
- A second design system. We pick one (shadcn/ui + Tailwind tokens) and standardize ruthlessly.
- A multi-agent orchestration deeper than two levels. Subagents can't spawn subagents — that's a cc-bp doctrine and it keeps the system debuggable.

---

## 2. Research Synthesis

The two repositories the user cited, plus the broader 2026 landscape, point to a converging answer. Below is the distillation.

### 2.1 What `shanraisshan/claude-code-best-practice` teaches

The repo is a reference implementation for Claude Code architecture. It is *how* to wire a Claude product, not *what* the product does. The key takeaways:

**The orchestration pattern is Command → Agent → Skill.** A slash command is the user-facing entry point. It owns the conversation flow (greeting, clarifying questions, recap). The command invokes one or more subagents via the Agent tool. Each subagent has *preloaded skills* — markdown files injected into the agent's context at startup as domain knowledge. The command (or the agent) then invokes *invocable skills* via the Skill tool to produce concrete outputs. The example walkthrough is `/weather-orchestrator` → `weather-agent` (with `weather-fetcher` agent skill) → `weather-svg-creator` skill that writes the file. This three-tier separation maps cleanly to strategy / execution / artifact for our use case.

**Two skill patterns.** Agent skills (preloaded via the `skills:` frontmatter field on a subagent) are reference material — the agent reads them and follows the instructions during its run. Invocable skills are more like callable functions — they're invoked via the `Skill` tool and produce a concrete output. The same SKILL.md format powers both. The difference is *when* it loads.

**Subagent definitions are rich.** Frontmatter supports `model`, `effort`, `maxTurns`, `permissionMode`, `memory: project|user|local`, `isolation: worktree`, `hooks`, `mcpServers`, plus `tools` and `disallowedTools` allowlists. We get fine-grained control over each step in the pipeline — we can dial Haiku for cheap copy edits and Opus for the architectural niche-pick step.

**Skill frontmatter is even richer.** 15 fields, including `paths:` glob (the skill auto-loads only when Claude touches matching files), `context: fork` (run in an isolated subagent), `disable-model-invocation`, `user-invocable`, `allowed-tools`, `model`, `effort`, and lifecycle `hooks`. The `paths:` glob is the secret weapon for keeping context small in a multi-stack repo.

**Workflow doctrine.** Keep CLAUDE.md under 200 lines. Use `.claude/rules/*.md` with `paths:` frontmatter so they lazy-load only when relevant. Prefer commands over standalone agents. Plan-mode for complex tasks. Manual `/compact` at ~50% context. Human-gated task lists. Subtasks small enough to finish under 50% context.

**Hooks are the QA gate.** PreToolUse / PostToolUse / SessionStart / Stop / Notification hooks let us enforce policy — for example, fail the build if a generated page contains "Lorem ipsum" or any forbidden buzzword (more on this in §6).

### 2.2 What `coreyhaines31/marketingskills` teaches

This is the gold-standard reference for skill design. 40 marketing skills, plus a tools registry and an integrations layer. The structural lessons matter more than any individual skill's content.

**The single most powerful pattern: a foundational shared context document.** Every skill in the repo starts with the same instruction — "Check `.agents/product-marketing-context.md` first before asking questions." That one file captures product, ICP, positioning, voice, competitors, switching forces. Every other skill cross-references it. This is what eliminates the "tell me about your business again" problem that plagues every AI marketing tool. **We will copy this pattern verbatim — call it `agency-context.md`.**

**Tight scope per skill.** Look at how marketingskills splits CRO: `page-cro`, `signup-flow-cro`, `onboarding-cro`, `form-cro`, `popup-cro`, `paywall-upgrade-cro`. Six different conversion contexts, six different skills. Each one is small (under 500 lines), opinionated, and sharply scoped. The cross-references at the top of each file (`for X, see Y skill`) keep them composable. This is exactly the opposite of building one mega-skill that "does CRO."

**Description-driven discovery.** The `description:` field is loaded into Claude's system prompt as part of progressive disclosure. So every description in marketingskills is engineered with trigger phrases — direct verbs ("optimize this page," "rewrite this copy"), user laments ("nobody's converting," "this page sucks"), and explicit *negative scopes* ("for signup flows, see signup-flow-cro"). Skill discovery is essentially solving the auto-routing problem. We will be equally deliberate.

**References subfolder for progressive disclosure.** The skill body stays under 500 lines. Detailed frameworks, headline formulas, page templates, and reference data live in `references/*.md` and load only when the skill explicitly reads them. This is how marketingskills' `copywriting/SKILL.md` stays scannable while `copywriting/references/copy-frameworks.md` holds the deep formulas.

**Tool registry pattern.** Outside the skills/, marketingskills maintains `tools/integrations/{tool}.md` files (one per third-party tool — GA4, HubSpot, Stripe, Resend, etc.) and a `REGISTRY.md` index. Skills reference tool guides for implementation rather than hardcoding integrations. Composio is used as a single MCP gateway for OAuth-heavy services without their own MCP. We will adopt this pattern but radically smaller — three integrations max in v1.

**Plugin marketplace.** A `.claude-plugin/marketplace.json` lets Claude Code users install the skill bundle with `/plugin install`. This is how we ship.

**What we will NOT borrow.** 35 of the 40 marketingskills are SaaS-product-marketing-flavored — `aso-audit`, `churn-prevention`, `referral-program`, `paywall-upgrade-cro`, `community-marketing`, `marketing-psychology`. They are excellent skills, but they are not the agency-builder critical path. We pull in only the ones that cleanly serve our use case (`page-cro`, `copywriting`, `copy-editing`, `seo-audit`, `analytics-tracking`, `cold-email`) — and we depend on them by reference (the operator can install marketingskills as a sibling plugin), not by duplication.

### 2.3 Conversion frameworks the toolkit must encode

These are the frameworks that separate a converting agency site from a generic one. Every page-building skill we write must offer at least one of these as a structural template the agent can pick from.

**StoryBrand 7-part framework (Donald Miller).** The default for service-agency websites. Cast the customer as the hero, the agency as the guide. Seven beats: Character (who the customer is) → Problem (external + internal + philosophical) → Guide (empathy + authority) → Plan (3-4 numbered steps) → Call to Action (direct primary + transitional secondary) → Failure (stakes if they don't act) → Success (vivid picture of outcome). Every winning agency website maps to this skeleton. This is our default page structure for `/build-agency-site`.

**Hormozi's Grand-Slam Offer / Value Equation.** `Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)`. To make an offer "so good people feel stupid saying no," you maximize the numerator (paint the dream and prove you can deliver it) and minimize the denominator (compress the timeline and remove their work). The `offer-design` skill walks the operator through the four levers and produces a concrete offer block (deliverable list, guarantee, urgency, scarcity, bonus stack) that drops directly into the agency's pricing page and the funnel's pre-CTA section.

**Russell Brunson's Value Ladder.** Free / lead-magnet → low-ticket entry → core offer → high-ticket / continuity. For a service agency, the ladder is typically: free audit or report → paid teardown ($50-200) → productized service ($1k-10k) → retainer / fractional ($5k-25k/mo). The funnel skills design the squeeze-page, sales-page, and order-bump elements that move a stranger from one rung to the next.

**AIDA, PAS, 4Us.** Tactical headline and section formulas — Attention/Interest/Desire/Action; Problem/Agitate/Solve; Useful/Urgent/Unique/Ultra-specific. Loaded into the `copy-frameworks` reference file. The copywriter agent picks the formula that matches the page type (cold-traffic landing pages lean PAS; warm-list email sequences lean AIDA; pricing pages lean 4Us).

**The conversion checklist (page-cro, distilled).** Value prop clarity, headline effectiveness, CTA placement / copy / hierarchy, visual hierarchy and scannability, trust signals and social proof placement near CTAs, objection handling, friction-point removal. This becomes the rubric the QA reviewer agent grades every page against before `ship-it` lets it deploy.

### 2.4 What the 2026 stack landscape says

Recent surveys of AI landing-page generators and the Astro-vs-Next.js debate point in a clean direction:

**Astro for content / SEO sites.** Zero JS by default, partial hydration, file-based routing, content collections with type-safe frontmatter, MDX support. It is faster to ship and faster to load than Next.js for marketing content — and it's better for SEO because there's no client-side JS to delay LCP. This is the right default for `/build-agency-site` and `/new-client-site`.

**Next.js for app-like funnels.** When the funnel includes a quiz, a multi-step form, payment, dynamic personalization based on UTM, or a calendar-embed with logic — that's Next.js territory. App Router + Server Actions + edge rendering. Default for `/new-funnel`.

**Tailwind + shadcn/ui (CLI components).** This is the 2026 consensus design system for AI-generated UI. shadcn ships components as code (you own them after `npx shadcn add`), so the agent can edit them freely. Tailwind tokens in `tailwind.config.ts` plus shadcn primitives plus a hand-built block library (Hero, SocialProof, FeatureGrid, Pricing, FAQ, CTA, Footer) is the entire surface area we need.

**Forms / booking / analytics defaults.** Resend or Formspree for forms (no auth headache). Cal.com or SavvyCal for booking. Plausible for privacy-first analytics, GA4 if the client insists, PostHog for funnels with event tracking. We pick one of each as the default and let the operator swap.

---

## 3. The Architecture — Where the Puzzle Pieces Click Together

The system has six layers. Each layer has one job. The point of leanness is that every line of every layer earns its keep.

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: SLASH COMMANDS  (the user-facing surface, 6 verbs)    │
│  /pick-niche  /build-agency-site  /new-landing-page             │
│  /new-funnel  /new-client-site    /ship-it                      │
└────────────────────┬────────────────────────────────────────────┘
                     │  invokes
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: SUBAGENTS  (5 specialists with preloaded skills)      │
│  industry-strategist • conversion-copywriter • design-builder   │
│  seo-strategist • qa-reviewer                                   │
└────────────────────┬────────────────────────────────────────────┘
                     │  reads + invokes
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: SKILLS  (11 tightly-scoped skills)                    │
│  agency-context (foundation) • niche-research • offer-design    │
│  storybrand-page • landing-page-funnel • seo-page               │
│  design-system • component-library • copy-frameworks            │
│  analytics-wiring • ship-checklist                              │
└────────────────────┬────────────────────────────────────────────┘
                     │  produces output into
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: STARTER STACKS  (2 opinionated templates)             │
│  stacks/astro-marketing  •  stacks/nextjs-funnel                │
└────────────────────┬────────────────────────────────────────────┘
                     │  styled by
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 5: DESIGN SYSTEM  (one set of tokens, primitives, blocks)│
│  tokens.json  •  primitives/  •  blocks/                        │
└────────────────────┬────────────────────────────────────────────┘
                     │  flavored by
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 6: INDUSTRY OVERLAYS  (per-niche voice + proof patterns) │
│  industries/dental  •  industries/legal  •  industries/...      │
└─────────────────────────────────────────────────────────────────┘
```

### 3.1 Repository layout

```
agency-out-of-the-box/
├── README.md                               # The pitch + install + quickstart
├── CLAUDE.md                               # <200 lines: doctrine + workflow
├── .claude-plugin/
│   └── marketplace.json                    # Plugin marketplace manifest
├── .claude/
│   ├── settings.json                       # Hooks, allowedTools, MCP config
│   ├── rules/                              # Lazy-loaded rules with paths: globs
│   │   ├── conversion.md                   # paths: pages/**, blocks/**
│   │   ├── design-system.md                # paths: **/*.{tsx,jsx,css,html}
│   │   ├── industry-voice.md               # paths: content/**, copy/**
│   │   └── markdown-docs.md                # paths: **/*.md
│   ├── commands/
│   │   ├── pick-niche.md
│   │   ├── build-agency-site.md
│   │   ├── new-landing-page.md
│   │   ├── new-funnel.md
│   │   ├── new-client-site.md
│   │   └── ship-it.md
│   ├── agents/
│   │   ├── industry-strategist.md          # skills: niche-research, offer-design, agency-context
│   │   ├── conversion-copywriter.md        # skills: storybrand-page, landing-page-funnel, copy-frameworks, agency-context
│   │   ├── design-builder.md               # skills: design-system, component-library, agency-context
│   │   ├── seo-strategist.md               # skills: seo-page, agency-context
│   │   └── qa-reviewer.md                  # skills: ship-checklist, agency-context
│   └── skills/
│       ├── agency-context/SKILL.md         # ★ The keystone
│       ├── niche-research/
│       ├── offer-design/
│       ├── storybrand-page/
│       ├── landing-page-funnel/
│       ├── seo-page/
│       ├── design-system/
│       ├── component-library/
│       ├── copy-frameworks/
│       ├── analytics-wiring/
│       └── ship-checklist/
├── stacks/
│   ├── astro-marketing/                    # Astro + Tailwind + shadcn
│   └── nextjs-funnel/                      # Next.js App Router + Tailwind + shadcn
├── design-system/
│   ├── tokens.json                         # Color / type / spacing / radius scale
│   ├── primitives/                         # Button, Section, Container, Card, ...
│   └── blocks/                             # Hero, SocialProof, FeatureGrid, Pricing, FAQ, CTA, Footer
├── industries/
│   ├── _starter/                           # Empty template — copy to bootstrap a new niche
│   ├── dental/
│   ├── legal/
│   ├── home-services/
│   └── b2b-saas-consultant/
└── workflows/                              # End-to-end runbooks (markdown, human-readable)
    ├── 01-niche-to-positioning.md
    ├── 02-positioning-to-site.md
    ├── 03-site-to-funnel.md
    ├── 04-funnel-to-client-delivery.md
    └── 05-shipping-and-handoff.md
```

### 3.2 The skill inventory — 11 skills, every one justified

The cull from "what marketingskills offers" to "what a service-agency builder actually needs" is the most important architectural decision. Here is each skill with its job, its inputs, its outputs, and why it earns its slot.

**1. `agency-context` — the keystone.** The single shared context document at `.agents/agency-context.md`. Captures: chosen niche, ICP (decision-maker, secondary stakeholder, anti-persona), positioning statement, the Grand-Slam Offer, brand voice guide (3 do-words, 3 don't-words, sample sentences), three-tier price ladder, design tokens (color, type, radius scale), domain + analytics IDs, and a roster of clients with active deliverables. Every other skill reads this file before doing anything. When the operator runs `/build-agency-site`, no one asks "who is your audience?" — it's already there.

**2. `niche-research` — pick + validate.** Walks the operator through industry selection: TAM signals, competitor density, demand stability, project ticket size, ad-cost-per-lead by industry, common pain points. Outputs the first three sections of agency-context. Cross-references publicly available data (Census economic activity reports, BLS, Glassdoor for salary signals) but stays opinionated about what makes an industry good for an agency play (recurring revenue is possible, the buyer has authority, the average deal size justifies a multi-touch funnel).

**3. `offer-design` — build the Grand-Slam Offer.** The Hormozi value-equation skill. Walks the four levers — dream outcome, perceived likelihood (proof), time delay (timeline), effort/sacrifice (what the client has to do). Outputs a concrete offer block: deliverable list, money-back guarantee structure, scarcity / urgency mechanism, bonus stack with anchored value. Drops directly into the pricing section of the agency site.

**4. `storybrand-page` — generate a 7-part page.** Takes the Character / Problem / Guide / Plan / CTA / Failure / Success structure and turns it into a wired-up page (Astro by default). Includes hero, problem-agitation block, "We get you" guide block, 3-step plan block, dual CTA (direct + transitional), failure / stakes block, success / outcome block, social proof placement, FAQ, and final CTA. Every section's copy must come from agency-context — no placeholders.

**5. `landing-page-funnel` — single-page paid-traffic LP.** AIDA / PAS for cold traffic. No nav. One headline. One CTA. Trust block above the fold. Single goal (book a call, request audit, download lead magnet). Includes a Cal.com / SavvyCal embed or a Formspree-wired form. Outputs into `stacks/nextjs-funnel/` because dynamic UTM personalization usually applies.

**6. `seo-page` — content / SEO page generator.** Pillar + cluster structure, schema markup (Article, Service, FAQ, BreadcrumbList), internal linking suggestions, real-content fill from the agency-context (no thin AI-generated word salad). Includes a programmatic-SEO sub-mode for cities × services pages (`/dental-marketing/austin/`, `/dental-marketing/dallas/`) that respects E-E-A-T (uniqueness threshold, real local data, no template clone).

**7. `design-system` — token enforcement + alignment doctrine.** Loaded as an agent skill on `design-builder`. Reads `design-system/tokens.json`. Enforces: 4px spacing grid, max 3 type sizes per breakpoint, max 2 fonts (heading + body), one accent color + neutrals, button states (default/hover/disabled/loading) all defined. Outputs nothing on its own — it is the doctrine that prevents `design-builder` from drifting into AI slop.

**8. `component-library` — block-level UI builder.** The catalog: Hero (3 variants), SocialProof (logo strip / quote / metric), FeatureGrid (3-up / 2-up / alternating), Pricing (3-tier / single-card), FAQ, CTA banner, Footer. Each block is a real .tsx file in `design-system/blocks/`. Skill instructs the design-builder agent to compose pages from these blocks rather than write components from scratch.

**9. `copy-frameworks` — the formula library.** Headline formulas (outcome / specificity / social proof / question). Body formulas (AIDA / PAS / 4Us / Hormozi value equation as a prose template). CTA copy (Strong-Verb + Specific-Outcome + Implied-Stake). Loaded as agent skill on `conversion-copywriter`. Body lives in `references/` so progressive disclosure keeps the SKILL.md small.

**10. `analytics-wiring` — instrumentation done right.** Default: Plausible script + GA4 if client insists + PostHog if the funnel needs event tracking. Standardized event names (`lead_submitted`, `cta_clicked`, `pricing_viewed`, `call_booked`). Sets up conversion goals. Outputs the integration snippet directly into the stack's layout file. Includes consent banner where regulation requires.

**11. `ship-checklist` — the QA gate.** The QA-reviewer agent's preloaded skill. Runs through: Lighthouse score thresholds (Perf ≥ 90 mobile, A11y ≥ 95, SEO ≥ 95), schema validation, no broken links, no `lorem`, no forbidden buzzwords (synergy, leverage, world-class, cutting-edge, robust, seamless, innovative, passionate, dedicated), every CTA tested, mobile-viewport screenshots taken with Playwright, real social proof present (or marked TODO with explicit warning), all images have alt text, OG image exists, favicon exists, robots.txt + sitemap.xml present, redirects from old paths configured. Failure stops `/ship-it`.

That's it. Eleven skills. The temptation to add `social-content`, `email-sequence`, `cold-email`, `referral-program`, `customer-research`, `competitor-profiling`, etc. is strong — and we resist it. If the operator wants those, they install marketingskills as a sibling plugin. We don't duplicate.

### 3.3 The agent inventory — 5 specialists

Each subagent has a tight job, a preloaded skill set, a model dial, and an effort budget. The cc-bp doctrine (subagents can't spawn subagents) means the command layer is the only orchestrator. Agents are pure specialists.

| Agent | Job | Preloaded skills | Model | Effort | Notes |
|---|---|---|---|---|---|
| `industry-strategist` | Pick the niche, write positioning + offer | agency-context, niche-research, offer-design | opus | high | Highest stakes — bad niche pick poisons everything downstream. |
| `conversion-copywriter` | Write all marketing copy across all pages | agency-context, copy-frameworks, storybrand-page, landing-page-funnel | sonnet | high | Reads voice from agency-context, never invents tone. |
| `design-builder` | Compose pages from blocks, enforce tokens | agency-context, design-system, component-library | sonnet | medium | Receives copy + structure; produces .tsx/.astro. |
| `seo-strategist` | Site arch, schema, programmatic SEO | agency-context, seo-page | sonnet | medium | Owns sitemap.xml, schema, internal-link map. |
| `qa-reviewer` | Final gate before any deploy | agency-context, ship-checklist | sonnet | high | Must run Playwright + Lighthouse via MCP. Has authority to block `/ship-it`. |

Setting `isolation: worktree` on `design-builder` and `seo-strategist` lets them run in parallel on independent git worktrees during a build, which compresses wall-clock time substantially. The `qa-reviewer` runs serially at the end.

### 3.4 The command inventory — 6 verbs, that's the whole product

The slash-command surface is the entire UX. If you can't do it from a slash command, it's not in the product.

**`/pick-niche`** — Cold start. Runs `industry-strategist`. Asks operator for industry candidate(s) or runs research mode. Outputs a complete `agency-context.md` v1. Asks for human approval before persisting.

**`/build-agency-site`** — End-to-end agency-website build. Pipeline: `seo-strategist` (site arch) → `conversion-copywriter` (StoryBrand long-form home, services, about, pricing pages) → `design-builder` (compose into Astro stack) → `analytics-wiring` → `qa-reviewer` (review, do not ship). Outputs a runnable Astro project under `output/{niche-slug}-site/`.

**`/new-landing-page <campaign-name>`** — Single-page paid-traffic LP. Pipeline: `conversion-copywriter` (PAS or AIDA) → `design-builder` (Next.js stack, no nav, one CTA) → `analytics-wiring` (UTM capture + conversion event). Outputs under `output/lps/{campaign}/`.

**`/new-funnel <funnel-type>`** — Multi-step funnel. Funnel types: lead-magnet → email → call-booking; quiz → personalized result → call-booking; VSL → application → call. Pipeline: `conversion-copywriter` (per-step copy) → `design-builder` (Next.js multi-step) → `analytics-wiring` (per-step event). Outputs under `output/funnels/{name}/`.

**`/new-client-site <client-name>`** — Same pipeline as `/build-agency-site`, but reads a `clients/{client-name}.md` overlay (their ICP, their offer, their voice) and uses it instead of agency-context. The agency operator sells the website service; this command delivers it.

**`/ship-it <site-path>`** — Runs `qa-reviewer` with full QA suite (Playwright screenshots + Lighthouse + schema validate + link check + buzzword scan). On pass, prepares deploy config (Vercel by default, Netlify alternate). On fail, returns a blocking checklist. Will NOT auto-deploy without operator confirmation.

### 3.5 The starter stacks — two, opinionated

The "what generated artifact" decision is where most agency tools fail (Webflow lock-in / WordPress rot / no-code limits). We pick code, but two opinionated flavors.

**`stacks/astro-marketing/`** — Astro 5 + Tailwind 4 + shadcn primitives + MDX content collections + Astro Image. Structure: `src/pages/` (file-based routes), `src/content/` (MDX collections per page type), `src/components/blocks/` (linked from `design-system/blocks/`), `src/lib/` (utilities). Default deployment: Vercel or Cloudflare Pages.

**`stacks/nextjs-funnel/`** — Next.js 15 App Router + Tailwind 4 + shadcn primitives + Server Actions + Zod for form validation + react-hook-form. Structure: `app/` route groups for funnel steps, `app/actions/` for server actions (form submit, payment intent, call-booking). Default deployment: Vercel.

Both stacks share `design-system/` via a relative import or pnpm workspace. Both ship with a working analytics integration, OG image generation, sitemap.xml, robots.txt, and a populated favicon set.

### 3.6 The design system — one set of opinions

Three files of doctrine that prevent the slop:

- `design-system/tokens.json` — 6 neutrals (50-950), 1 brand accent (50-950), 1 success / warning / error semantic, type scale `(12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72)`, spacing scale `(0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128)` × 4px, radius scale `(0, 4, 8, 12, 16, 24, 9999)`, two fonts (Inter + Geist Mono is a defensible default; per-niche overrides via the industry overlay).
- `design-system/primitives/` — Button, Input, Textarea, Select, Card, Section, Container, Badge, Separator, Tabs, Accordion. shadcn defaults with token-bound variables.
- `design-system/blocks/` — Hero (3 variants), SocialProof (logos / quote / metric), FeatureGrid (3-up / alternating), Pricing (3-tier / single), FAQ, CTABanner, Footer. Each block is a real .tsx, real props, real defaults, real Storybook entry.

Industry overlays (`industries/{niche}/`) can override tokens (color shifts, font swap), and supplement blocks (e.g., dental might add a `BeforeAfterGallery` block, legal might add a `CredentialsBar` block). Overlays cannot replace blocks — they extend.

### 3.7 Industry overlays — the niche flavor layer

Each `industries/{niche}/` folder contains six small files:

- `voice.md` — vocabulary do's, jargon don'ts, sample sentences in the right voice.
- `personas.md` — typical decision-maker, secondary stakeholder, anti-persona.
- `proof-patterns.md` — what credible social proof looks like in this industry (BBB / Yelp for home services, peer-reviewed publications for medical, deal volume for B2B SaaS consultants).
- `offers.md` — typical service offers and pricing ranges.
- `imagery.md` — visual cues, photography style, color tendencies, do-not-use stock images.
- `compliance.md` — regulatory constraints (HIPAA, GDPR, CCPA, ABA advertising rules for legal, dental advertising rules per state).

When `agency-context.md` says `niche: dental`, every skill that touches copy or design auto-loads `industries/dental/*.md`. New industries are added by copying `industries/_starter/` and filling in.

### 3.8 MCP integrations — three, no more

The principle is: only integrate what ends a sentence with "because we can't do it without it."

- **Playwright MCP** — for `qa-reviewer` to take responsive screenshots, run Lighthouse in headless Chrome, click through CTAs to verify they go where they say they go.
- **Context7 MCP** — for live framework docs (Astro / Next.js / Tailwind / shadcn) so the design-builder doesn't hallucinate APIs.
- **Composio MCP** — single OAuth-gateway for HubSpot / Salesforce / Calendly / Slack / Sheets if the operator wants real CRM/booking integration. Optional, opt-in.

That is the full integration plane in v1. We deliberately exclude: GA4 / Stripe / Mailchimp / SendGrid / Resend / SEMrush / Ahrefs MCPs. Either they're scripts the agent writes (analytics tags, Resend SDK calls), or they're in marketingskills (which is a sibling install for the operator who wants them).

---

## 4. The Conversion Doctrine — the "no AI slop" rule sheet

This is `.claude/rules/conversion.md`. It loads on `paths: pages/**, blocks/**, content/**, **/*.tsx, **/*.astro, **/*.md` (so it activates on every page-build). The QA gate enforces it.

**Hard rules (failure conditions, the agent must not ship):**

1. **No lorem ipsum.** Ever. The `qa-reviewer` greps for `Lorem ipsum`, `[your headline]`, `[insert benefit]`, `Lorem`, `dolor sit amet` and fails the build if found.
2. **No fabricated stats or testimonials.** Numbers must come from `agency-context.md` or a referenced source. Testimonials must include a real attribution (name + role + company OR explicit "Anonymous, by request" note). Fake quotes are a fire-the-agent offense.
3. **No buzzword headlines.** Forbidden: synergy, world-class, cutting-edge, leverage, utilize, robust, seamless, innovative, passionate, dedicated, comprehensive, holistic, end-to-end, best-in-class, mission-critical, paradigm-shift, game-changer, disruptive, transform (as marketing verb).
4. **No 3-up "passionate / innovative / dedicated" feature grids.** Every feature must reference a concrete deliverable or outcome from agency-context.
5. **The 5-second test.** Every hero headline must pass: a stranger from the target industry reads only above-the-fold and can answer (a) what is this? (b) who is it for? (c) what's the next step? If not, agent fails the page.
6. **Specific over vague.** Every benefit claim must include a number, timeframe, name, or concrete artifact. Reject: "Save time on reporting." Accept: "Cut your weekly reporting from 4 hours to 15 minutes with the auto-generated dashboard."
7. **One primary CTA per viewport.** Header CTA + hero CTA + final CTA all point to the same conversion. No conflicting goals on the same page (no "Book a call" beside "Download the ebook" beside "Subscribe to newsletter" — pick one).
8. **Real social proof or explicit TODO.** Every page must include a social-proof block with attributed proof. If unavailable, the agent inserts a `<!-- TODO: replace with real client quote — DO NOT SHIP -->` and the QA reviewer flags it as a release blocker.
9. **Mobile first, always.** Every block has a mobile-tested layout. The QA reviewer takes 375px and 414px screenshots and visually inspects.
10. **Accessibility floor.** Lighthouse a11y ≥ 95. Real alt text on every image (not "image" or filename). Color contrast WCAG AA. Focus states on every interactive.

**Soft rules (warnings, but not blockers):**

- Prefer rhetorical questions over statements when addressing pain.
- Prefer customer's verbatim language over polished company language (mirror voice-of-customer from agency-context).
- One idea per section.
- Two-line cap on headlines.
- Three-sentence cap on subheadlines.
- Active voice over passive.

The doctrine is enforced via a `PostToolUse` hook on `Write` / `Edit` that scans the file for forbidden tokens, plus the `qa-reviewer` runs the full sweep before `/ship-it`. The doctrine is the difference between "agentic page builder" and "agentic site that looks human-built."

---

## 5. The Keystone — `agency-context.md`

The single document that every skill reads. Below is the schema (the actual file the `niche-research` and `offer-design` skills will fill in). Capturing this once, well, eliminates 90% of the back-and-forth that wastes context in agentic page builds.

```markdown
# Agency Context — {Agency Name}

## 1. Identity
- Agency name:
- Domain:
- Tagline (10-12 words max):
- Founder / operator name + bio (3 sentences):

## 2. Niche
- Primary industry:
- Sub-segment within the industry:
- Geography (local / national / global):
- Industry overlay loaded: industries/{niche}/

## 3. Ideal Customer Profile (ICP)
- Decision maker (role + seniority):
- Secondary stakeholder (role):
- Anti-persona (who is NOT a fit):
- Company / practice size:
- Annual revenue band:
- Trigger event (what makes them search now):

## 4. Pain Points (verbatim from interviews / reviews / forums where possible)
- Top 3 pains, in customer's own words:
- The cost of not solving (time / money / opportunity):
- Emotional tension (stress / fear / doubt):

## 5. Positioning Statement
- Format: For {ICP} who {pain}, we are {category} that {differentiation}, unlike {alternative} which {falls short how}.

## 6. The Grand-Slam Offer (Hormozi)
- Core deliverable:
- Dream outcome (what life looks like 12 months later):
- Perceived likelihood — proof stack (case studies, certifications, guarantees):
- Time delay (timeline to first result, full result):
- Effort & sacrifice (what the client must do — minimize):
- Guarantee structure (money-back / performance / hybrid):
- Urgency mechanism (cohort / seasonal / capacity):
- Scarcity mechanism (slots / waitlist):
- Bonus stack (3-5 bonuses, each anchored at standalone value):

## 7. Service Tier Ladder (Brunson value ladder)
- Free: lead magnet / audit / report
- Entry (paid, low-ticket):
- Core productized service:
- Retainer / continuity:
- High-ticket / custom:

## 8. Brand Voice
- Three do-words (e.g., "direct, warm, technical"):
- Three don't-words (e.g., "not corporate, not bro-y, not academic"):
- Sample sentence in the right voice:
- Sample sentence in the WRONG voice:

## 9. Visual Identity
- Brand color (hex + token):
- Accent color:
- Heading font:
- Body font:
- Photography style (real / stock / illustrated):
- Imagery do's and don'ts:

## 10. Competitive Landscape
- Direct competitors (3-5 with URL):
- Where each falls short:
- What we do better:

## 11. Proof Inventory
- Case studies (with metrics, redacted if needed):
- Client logos available for use:
- Testimonials with attribution:
- Awards / certifications / press:

## 12. Compliance Constraints
- Industry regulations:
- Geographic regulations (GDPR / CCPA / etc.):
- Off-limits claims:

## 13. Tech / Domain Inventory
- Domain registrar:
- DNS / Cloudflare account:
- Hosting (Vercel / Cloudflare Pages):
- Analytics: Plausible / GA4 / PostHog (with IDs):
- Email / forms: Resend / Formspree (with API key reference):
- Booking: Cal.com / SavvyCal:
- CRM (if any):

## 14. Active Clients (for `/new-client-site` overlays)
- {client-1} — see clients/{client-1}.md
- {client-2} — see clients/{client-2}.md

## 15. Build Log
- Site v1 deployed: {date} → {url}
- Funnel v1 deployed: {date} → {url}
- Last reviewed: {date}
```

The file is ~200 lines, machine-readable enough that skills can parse it, human-readable enough that the operator edits it directly. New skills only add to it; they never silently rewrite it.

---

## 6. Two End-to-End Workflow Walkthroughs

### Workflow A — Operator stands up their own dental-marketing agency from cold

**Day 1, 30 minutes.** Operator runs `/pick-niche`. The `industry-strategist` agent (Opus, high effort) runs niche-research, asks 8-10 questions about the operator's background, asks if they have a niche in mind. They say "dental." Strategist pulls `industries/dental/*.md`, runs offer-design, drafts a complete `agency-context.md` v1. Asks operator to review, edits sections 4-7 collaboratively. Operator approves.

**Day 1-2, 4 hours wall-clock (much less of operator's time, agents run async).** Operator runs `/build-agency-site`. Pipeline kicks off: `seo-strategist` drafts site architecture (Home, Services, About, Case Studies, Pricing, Contact, Blog index, FAQ). `conversion-copywriter` (Sonnet, high effort) writes StoryBrand long-form for each page, pulling voice from agency-context and overlay from industries/dental. `design-builder` composes pages into the Astro stack. `analytics-wiring` adds Plausible. Pipeline halts and asks operator for: real client logos to embed, real testimonial(s) for hero block, founder photo. Without those, the QA gate will block deployment.

**Day 2 evening.** Operator runs `/ship-it`. `qa-reviewer` runs Playwright across mobile + desktop, runs Lighthouse, scans buzzwords, validates schema. One TODO is unresolved (a placeholder testimonial). QA blocks. Operator pastes the real quote. Re-runs `/ship-it`. Passes. Vercel deploy config is generated. Operator runs `vercel deploy --prod`. Site is live.

**Day 3-4.** Operator runs `/new-landing-page hyper-local-austin` for a Google Ads campaign targeting Austin dentists. Two hours later, a 1-page LP is in `output/lps/hyper-local-austin/` with PAS-style copy, single Cal.com CTA, UTM-aware analytics. Ship-it gate, deploy. Run Google Ads.

### Workflow B — Operator delivers a $5k website to their first client

The operator just signed `Smile Bright Dental` for $5k. Now they need to actually deliver the site.

**Setup (15 min).** Operator creates `clients/smile-bright-dental.md` (a smaller version of agency-context, focused on this one client's specifics — their ICP, their voice, their proof). The doc inherits agency-context for things like analytics defaults but overrides identity / positioning / voice / colors.

**Build (3-4 hours of agent runs, ~30 min of operator review).** Operator runs `/new-client-site smile-bright-dental`. Same pipeline as `/build-agency-site` but reads from the client overlay. Conversion-copywriter writes the StoryBrand pages from Smile Bright's perspective. Design-builder applies their brand colors / typography while keeping the same component spine. Analytics-wiring uses the client's GA4 (they insist on GA4 because their ad agency uses it).

**Deliver.** Operator does a 30-minute review with the client over Loom, captures change requests, runs them through `conversion-copywriter` and `design-builder` selectively. Final pass through `qa-reviewer`. Deploys to a staging URL. Client signs off. Operator updates DNS to production.

**The repeatability.** Every subsequent client follows the same path. The agency's marginal cost of delivering a 6-figure-quality marketing website drops to a fraction of what it was. That is the actual product.

---

## 7. Phased Build Roadmap

The build is sequenced so each phase produces something usable on its own. We do not ship a half-finished kitchen sink.

### Phase 0 — Foundation (Day 1)

- [ ] Repo skeleton with all directories from §3.1 created (empty placeholder READMEs).
- [ ] `CLAUDE.md` (under 200 lines): repository overview, the doctrine, the workflow rules.
- [ ] `.claude-plugin/marketplace.json` — installable shell.
- [ ] `.claude/settings.json` — hooks scaffold (PreToolUse / PostToolUse / Stop / SessionStart), allowedTools list, MCP servers.
- [ ] `.claude/rules/conversion.md` — the full doctrine from §4.
- [ ] `.claude/rules/design-system.md` — 4px grid, type scale, color discipline.
- [ ] `.claude/rules/markdown-docs.md` — borrowed from cc-bp.
- [ ] `agency-context` skill + the schema from §5.
- [ ] First validation pass: install the plugin in a sandbox, confirm context-loading works.

**Deliverable end of Phase 0:** A plugin that does nothing useful yet, but boots cleanly and enforces the doctrine globally.

### Phase 1 — Strategy layer (Days 2-3)

- [ ] `niche-research` skill — including `references/industry-data-sources.md` and `references/validation-checklist.md`.
- [ ] `offer-design` skill — including `references/value-equation-templates.md` and `references/guarantee-structures.md`.
- [ ] `industry-strategist` agent (Opus, high effort, preloads the three skills).
- [ ] `/pick-niche` command.
- [ ] Manual smoke test on three niches: dental, plumber, B2B fractional CFO.

**Deliverable end of Phase 1:** The operator can run `/pick-niche` and get a usable agency-context.md v1.

### Phase 2 — Build layer, Astro stack (Days 4-7)

- [ ] `design-system/tokens.json` + primitives + first 5 blocks (Hero / SocialProof / FeatureGrid / CTABanner / Footer).
- [ ] `stacks/astro-marketing/` working starter (real Astro 5 project, Tailwind 4, shadcn primitives wired, MDX content collections, sitemap, robots, OG image generator).
- [ ] `design-system` skill (token enforcement doctrine).
- [ ] `component-library` skill (block usage rules).
- [ ] `copy-frameworks` skill + the references library (StoryBrand long-form, AIDA / PAS / 4Us, headline formulas, CTA formulas).
- [ ] `storybrand-page` skill (the full 7-part page generator).
- [ ] `seo-page` skill (pillar / cluster / schema / programmatic).
- [ ] `seo-strategist`, `conversion-copywriter`, `design-builder` agents.
- [ ] `analytics-wiring` skill (Plausible default, GA4 alternative, PostHog opt-in).
- [ ] `industries/dental/` overlay as the first reference industry (full six files).
- [ ] `/build-agency-site` command (orchestrates seo-strategist → conversion-copywriter → design-builder → analytics-wiring).
- [ ] End-to-end smoke test: pick-niche → build-agency-site → manual eyeball on the output.

**Deliverable end of Phase 2:** From `agency-context.md`, the system produces a complete, runnable Astro agency website that doesn't smell like AI.

### Phase 3 — Funnels + SEO (Days 8-10)

- [ ] `stacks/nextjs-funnel/` starter (Next.js 15 App Router, Tailwind, shadcn, Server Actions, Zod / RHF, UTM capture).
- [ ] `landing-page-funnel` skill (PAS / AIDA, single-CTA, UTM personalization).
- [ ] `/new-landing-page` command.
- [ ] `/new-funnel` command (lead-magnet / quiz / VSL variants).
- [ ] Programmatic-SEO sub-mode of `seo-page` (cities × services pages, with E-E-A-T uniqueness threshold).
- [ ] `industries/legal/`, `industries/home-services/`, `industries/b2b-saas-consultant/` overlays.

**Deliverable end of Phase 3:** Operator can spin up paid-traffic LPs and multi-step funnels, plus has 4 industries supported out of the box.

### Phase 4 — Ship (Days 11-12)

- [ ] Playwright MCP integration in `.claude/settings.json`.
- [ ] `ship-checklist` skill — full QA rubric from §4.
- [ ] `qa-reviewer` agent — has authority to block deploys.
- [ ] `/ship-it` command — runs QA, on pass produces deploy config (Vercel + Cloudflare alternates).
- [ ] PostToolUse hook for live buzzword scanning (fast feedback, not waiting for ship-it).
- [ ] Lighthouse threshold enforcement.
- [ ] Schema validation via Schema.org's official validator (web fetch).

**Deliverable end of Phase 4:** No site ships without passing the gate. The "AI slop" problem is structurally prevented, not just discouraged.

### Phase 5 — Polish, distribution, docs (Day 13+)

- [ ] README.md with the pitch, install instructions, quickstart.
- [ ] `workflows/01..05` runbooks — narrative end-to-end docs that explain the system to a human operator.
- [ ] Marketplace.json polish, screenshots, demo gif.
- [ ] Public install via `/plugin marketplace add {repo}`.
- [ ] Showcase: operator runs the toolkit on three real industries and publishes the resulting agency sites as case studies.

---

## 8. Non-Obvious Design Decisions and Trade-offs

These are the choices where the easy default would be the wrong default.

**Why two stacks (Astro + Next.js), not one.** Astro is genuinely better for content sites — faster, cheaper to host, easier to SEO. Next.js is genuinely better for interactive funnels — server actions, dynamic personalization, payment flows. Forcing both into one stack means one of them is worse than it should be. The cost of two stacks is one extra README. We pay it.

**Why shadcn as code, not a UI library import.** Because the agent must be able to edit the components freely. A library import (`import { Button } from '@some/ui'`) is a black box; the agent can't change padding without forking. shadcn ships as code we own. Tradeoff: more files in the repo. Win: the agent can iterate visually without abstraction leaks.

**Why one keystone context file, not a database.** The `agency-context.md` file pattern is markdown for a reason. A database would let us query and version, but it would require running infrastructure and would hide changes from `git diff`. Markdown gives us source-of-truth in plain text, version control, human editability, and zero ops. We accept the cost of "you have to read the whole file" because the file is 200 lines.

**Why no email / cold-email / referral skills.** Those are post-launch growth concerns. The toolkit's job is to get the operator to "I have a real, converting site I can drive traffic to." Once they're there, marketingskills handles the rest as a sibling install. Bundling everything makes the toolkit unfocused.

**Why no AI image generation skill.** The temptation to integrate DALL-E / Midjourney / Flux is strong. But: (1) AI hero images are the #1 telltale sign of an AI-built site; (2) real founder photos and real client photos convert dramatically better; (3) we'd be teaching agents bad habits. The doctrine instead is: agency-context tracks `imagery_status` per page, and the QA gate flags missing-real-image as a TODO, not as a "let me generate something."

**Why Opus only for `industry-strategist`.** Niche selection compounds — bad pick, every downstream skill produces beautifully crafted irrelevance. Worth the spend. Sonnet handles 90% of build work where we have strong constraints (templates, doctrine, agency-context). Haiku is reserved for high-volume editing-only tasks (programmatic-SEO city × service pages where the LM only fills slots).

**Why `qa-reviewer` has block authority over `/ship-it`.** Without a hard gate, every shortcut compounds. With a hard gate, the agent is forced to push the slop out before the ship attempt, not after. This is the single most important architectural decision for the "no AI slop" goal.

**Why subagents in worktrees.** Two reasons. (1) Parallelism — `seo-strategist` writes content arch while `design-builder` shells out the Astro project, no merge conflicts. (2) Cleanup — if a subagent goes off-track, throwing away the worktree is one git command, not a manual revert.

---

## 9. Open Questions for You

Before Phase 0, a few decisions sharpen the build:

1. **Is the toolkit for the user (you) only, or shipped as a public plugin?** Public changes the polish bar (README, demo video, screenshots). It also changes whether industries/* ships pre-built or ships empty.
2. **What is the first reference industry?** The roadmap above defaults to `dental` because the niche signals are strong (high LTV, geographic ICP, recurring revenue, well-understood pains). If you have a different one already in mind (or already running an agency in), build that overlay first.
3. **Astro vs Next.js as default for `/build-agency-site`.** The plan above defaults to Astro. If you anticipate every agency site needing dynamic personalization (logged-in client portal, dynamic case studies), it could justify Next.js as default and Astro as alternate. My recommendation stays Astro for v1.
4. **Plausible vs GA4 as default analytics.** Plausible is privacy-first, faster, simpler, costs $9/mo. GA4 is free but tracker-heavy and complex. Default Plausible, fall back to GA4 on operator request.
5. **Do you want client billing built in?** Stripe Checkout + a minimal `/new-client-onboarding` command could automate proposal → payment → client overlay creation. That is a Phase 6 addition if there's appetite.

---

## 10. Appendix — Concrete Snippets You Can Drop In

### A. `agency-context` skill SKILL.md (skeleton)

```markdown
---
name: agency-context
description: When the user wants to set up, update, or load the agency's foundational context document. Always read .agents/agency-context.md before doing any other agency work — niche, ICP, offer, voice, design tokens, analytics IDs all live here. Triggers: "set up agency context," "what's our positioning," "update the offer," "who is our ICP," or any new agency task. For a new niche from scratch, see niche-research. For offer construction, see offer-design.
metadata:
  version: 0.1.0
---

# Agency Context

You manage the agency's single source of truth: `.agents/agency-context.md`. Every other agency skill reads this file before asking any questions about the agency.

## Workflow

1. If `.agents/agency-context.md` exists, read it and summarize back what's captured. Ask which sections need updating.
2. If it doesn't exist, offer two paths:
   a. Auto-draft from existing artifacts (operator's existing site, README, LinkedIn) — recommended.
   b. Walk through the schema section by section.
3. Keep the schema from §5 of PLAN.md as the canonical structure.
4. Never silently rewrite. Always show diffs and ask for confirmation.

## Sections (see PLAN.md §5 for full schema)

[the 15 sections, each with field-level prompts]
```

### B. `industry-strategist` agent definition (skeleton)

```markdown
---
name: industry-strategist
description: Use this agent PROACTIVELY when the user is picking a niche, validating an industry, or building out positioning + offer for an agency. Owns the agency-context document v1.
allowedTools:
  - Read
  - Write
  - Edit
  - Skill
  - WebSearch
  - WebFetch
model: opus
effort: high
maxTurns: 30
permissionMode: acceptEdits
memory: project
isolation: worktree
skills:
  - agency-context
  - niche-research
  - offer-design
---

# Industry Strategist

You are an expert positioning consultant for service-business agencies. Your job is to help the operator pick a niche, validate it, and produce a complete agency-context.md.

[full body — followed playbook for niche selection, ICP synthesis, Hormozi value-equation construction, positioning statement drafting]
```

### C. `.claude/rules/conversion.md` (head)

```markdown
---
paths:
  - "stacks/**/*.tsx"
  - "stacks/**/*.astro"
  - "design-system/blocks/**"
  - "output/**"
  - "**/*.md"
  - "**/*.mdx"
---

# Conversion Doctrine

[full doctrine from PLAN.md §4]

## Forbidden tokens (case-insensitive)

synergy, synergistic, world-class, cutting-edge, leverage, utilize, robust, seamless, innovative, passionate, dedicated, comprehensive, holistic, end-to-end, best-in-class, mission-critical, paradigm-shift, game-changer, disruptive, transform (as transitive marketing verb), Lorem, Lorem ipsum, [your headline], [insert benefit], dolor sit amet

## PostToolUse hook

A bash hook scans every file written by Claude for any forbidden token. If found, the hook fails and the agent must rewrite.
```

---

## 11. References (the research that fed this plan)

**Repos studied directly**
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — Command → Agent → Skill orchestration; subagent + skill frontmatter spec; hooks system; the `paths:` glob lazy-loading pattern.
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — the `product-marketing-context` foundational pattern; tight per-skill scope; `references/` for progressive disclosure; tools registry; plugin marketplace.

**Conversion frameworks**
- [How To Use the StoryBrand Framework To Create a Landing Page That Converts](https://www.chatterbuzzmedia.com/blog/storybrand-framework-landing-page/)
- [The 7 Main Parts Of A StoryBrand Website (and 5 reasons it converts)](https://www.kairosdigital.com/2021/04/the-7-main-parts-of-a-storybrand-website-and-5-reasons-it-converts/)
- [$100M Offers: Key Insights & Takeaways from Alex Hormozi (value equation)](https://loxie.app/learnwithloxie/100m-offers)
- [Alex Hormozi's Value Equation Explained](https://quantumbyte.ai/articles/alex-hormozi-value-equation-app-monetization)
- [DotCom Secrets by Russell Brunson — Summary and Notes (value ladder, funnels)](https://dansilvestre.com/summaries/dotcom-secrets-summary/)

**Stack choice**
- [Astro vs Next.js: Which Framework Should You Use in 2026?](https://pagepro.co/blog/astro-nextjs/)
- [AI Landing Page Generator 2026: 15 Best Tools to Create High-Converting Pages](https://www.nxcode.io/resources/news/ai-landing-page-generator-2026)

**Skills + agent architecture**
- [Anthropic — Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Anthropic — Agent Skills (Claude API Docs)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Extend Claude with skills (Claude Code Docs)](https://code.claude.com/docs/en/skills)
- [Anthropic — The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en)
- [VoltAgent — awesome-agent-skills (1000+ skills, cross-agent)](https://github.com/VoltAgent/awesome-agent-skills)
- [GitHub — anthropics/skills (official skills repo)](https://github.com/anthropics/skills)
