<div align="center">

# Agency-Out-of-the-Box

### Run a service-agency end-to-end with Claude Code. No AI slop.

**Pick a niche → stand up your own agency site → ship paid-traffic landing pages and funnels → deliver client websites → ship them.** All gated by an opinionated anti-slop QA layer that blocks deploys with lorem ipsum, fabricated testimonials, or buzzword headlines.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built for Claude Code](https://img.shields.io/badge/Built%20for-Claude%20Code-D97706?logo=anthropic&logoColor=white)](https://docs.claude.com/en/docs/claude-code/overview)
[![Plugin marketplace](https://img.shields.io/badge/Install-Plugin%20Marketplace-7C3AED)](https://docs.claude.com/en/docs/claude-code/plugins)
[![Status](https://img.shields.io/badge/Status-v0.1%20alpha-orange)](PLAN.md)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discussions](https://img.shields.io/badge/GitHub-Discussions-181717?logo=github)](https://github.com/heymusa/agency-out-of-the-box/discussions)

`agency` · `service-business` · `claude-code` · `claude-skills` · `landing-page` · `funnel` · `conversion` · `storybrand` · `hormozi` · `astro` · `nextjs` · `seo`

[**Quickstart**](#-quickstart) · [**The doctrine**](#-the-anti-ai-slop-doctrine) · [**How it works**](#%EF%B8%8F-how-it-works) · [**FAQ**](#-faq) · [**Roadmap**](#%EF%B8%8F-roadmap)

</div>

---

## 🩻 The pain it solves

Every "AI website builder" today produces template fill. Generic "We are passionate about innovation" headlines. Fabricated testimonials. Lorem ipsum waiting to be replaced. Three-up feature grids that say nothing. Fake stats. Buzzwords that pass the spell-check but fail the conversion test.

For a real service agency, that output is **worse than useless** — it ships, it underperforms, and you spend the next two weekends rewriting it by hand.

**The numbers:**

| Without this toolkit | With this toolkit |
|---|---|
| Buying a $5k–$15k Webflow build for the agency site | One operator + Claude Code, **2–4 days** to live |
| Hiring a copywriter at $2k–$8k per landing page | LP scaffolded in **30–60 min** with conversion frameworks baked in |
| Paying a CRO agency $3k–$10k to audit conversion rate | QA gate runs before every deploy, **free**, blocks slop automatically |
| Generic AI builder output → 0.5–1.5% conversion | Framework-driven output (StoryBrand / PAS / Grand-Slam Offer) → typical **2–6%** when the offer + proof are real |

The toolkit isn't a magic-money button. It's the leverage layer between **a competent agency operator who knows their niche** and **the 200 hours of plumbing** that used to stand between them and a live, converting business.

---

## 🚀 Who this is for

| If you are... | This toolkit makes sense |
|---|---|
| 🦷 An operator starting a **dental marketing** agency | Yes — `industries/dental/` is the reference overlay |
| ⚖️ Building **legal SEO** or family-law lead-gen | Yes — overlay templates compliant with ABA advertising rules |
| 🏠 Doing **home-services lead-gen** (HVAC, roofing, plumbing) | Yes — local-SEO + Google LSA-friendly funnels |
| 💼 A **fractional consultant / B2B agency** | Yes — high-ticket offer construction + value-ladder funnels |
| 🩺 Running a **med-spa, chiropractic, or healthcare** marketing play | Yes — HIPAA-aware overlays, `_starter/` ready to fork |
| 🤖 A **SaaS product-marketing team** | **No** — use [`marketingskills`](https://github.com/coreyhaines31/marketingskills) instead. The two plugins co-install cleanly. |
| 🎨 Want a **drag-and-drop UI builder** | No — this is an agentic toolkit, not Webflow |

---

## ⚡ Quickstart

### Install (Claude Code plugin — recommended)

```bash
# In any Claude Code session, in your project directory:
/plugin marketplace add heymusa/agency-out-of-the-box
/plugin install agency-out-of-the-box
```

Claude Code drops everything into `.claude/`:
- Skills → `.claude/skills/`
- Agents → `.claude/agents/`
- Commands → `.claude/commands/`
- Rules → `.claude/rules/`
- Hooks → `.claude/hooks/`

Then merge `setup/settings.example.json` into your `.claude/settings.json` to wire the forbidden-token scan hook + Playwright/Context7 MCP servers.

### Or clone directly

```bash
git clone git@github.com:heymusa/agency-out-of-the-box.git my-agency
cd my-agency
chmod +x hooks/*.sh
cp setup/settings.example.json .claude/settings.json
claude
```

### Run the pipeline

```bash
# 1. Pick a niche, validate it, produce .agents/agency-context.md
> /pick-niche

# 2. Stand up your agency's own website (StoryBrand long-form, Astro stack)
> /build-agency-site

# 3. Spin up a paid-traffic landing page (PAS or AIDA, single CTA, Next.js)
> /new-landing-page hyper-local-austin

# 4. Build a multi-step funnel (lead-magnet → email → call-booking)
> /new-funnel lead-magnet-to-call

# 5. Deliver a client site (drops a clients/{name}.md overlay)
> /new-client-site smile-bright-dental

# 6. Run the QA gate and prep deploy config
> /ship-it output/agency-site/
```

That's the entire UX. **Six commands.** No menus. No dashboards.

---

## 🧠 What you get

### 6 slash commands (the entire surface)

| Command | What it does |
|---|---|
| `/pick-niche` | Validates an industry, picks an offer, writes `.agents/agency-context.md` v1. |
| `/build-agency-site` | End-to-end build of your agency's own site (StoryBrand structure, Astro stack). |
| `/new-landing-page` | Single paid-traffic LP (PAS or AIDA, Next.js stack, single CTA). |
| `/new-funnel` | Multi-step funnel (lead-magnet / quiz / VSL variants). |
| `/new-client-site` | Same pipeline as `/build-agency-site` but for a specific client overlay. |
| `/ship-it` | QA gate (Lighthouse + schema + buzzword scan + Playwright). On pass, prep deploy. |

### 11 skills (every one earning its slot)

`agency-context` · `niche-research` · `offer-design` · `storybrand-page` · `landing-page-funnel` · `seo-page` · `design-system` · `component-library` · `copy-frameworks` · `analytics-wiring` · `ship-checklist`

### 5 specialist agents

`industry-strategist` (Opus, niche + offer) · `conversion-copywriter` (Sonnet, all marketing copy) · `design-builder` (Sonnet, page composition from blocks) · `seo-strategist` (Sonnet, site arch + schema) · `qa-reviewer` (Sonnet, blocks deploys that fail QA)

### 2 stacks — bootstrapped fresh, never vendored

- **`stacks/astro-marketing/`** → for content / SEO sites. Bootstraps with the **current** `npm create astro@latest`.
- **`stacks/nextjs-funnel/`** → for interactive funnels. Bootstraps with the **current** `npx create-next-app@latest`.

> 🧹 **Stack hygiene rule.** We do **not** vendor framework versions inside this repo — pinning Astro / Next would rot in 60–90 days. Each stack ships a `bootstrap.md` (the canonical, always-current init procedure) plus a small `overlay/` of the files we genuinely own (Tailwind tokens bridge, layouts, scaffold pages, lead Server Action). The `design-builder` agent runs the official scaffolder at runtime and applies the overlay. Always current, never decaying.

### 4 industry overlays (and a `_starter/`)

`industries/dental/` (reference) · `industries/legal/` · `industries/home-services/` · `industries/b2b-saas-consultant/` · `industries/_starter/` (fork to add your own)

Each overlay carries voice, personas, pain points (verbatim customer language), proof patterns, imagery direction, and compliance constraints.

---

## 🚫 The anti-AI-slop doctrine

Hard rules. Enforced by `rules/conversion.md` + the `qa-reviewer` agent's block authority over `/ship-it`:

- ❌ **No lorem ipsum**, no `[your headline here]`, no `[insert benefit]`.
- ❌ **No fabricated stats or testimonials.** Every quote needs an attribution.
- ❌ **No buzzword headlines.** `synergy`, `world-class`, `cutting-edge`, `leverage`, `utilize`, `robust`, `seamless`, `innovative`, `passionate`, `dedicated`, `revolutionary`, `next-generation`, `disrupting` — all banned.
- ❌ **No 3-up "passionate / innovative / dedicated" feature grids.**
- ✅ **Every benefit gets a number, name, or concrete artifact.** "Save time on reporting" is rejected. "Cut your weekly reporting from 4 hours to 15 minutes" ships.
- ✅ **5-second test:** a stranger sees the hero and answers (a) what is this? (b) who is it for? (c) what's next?
- ✅ **One primary CTA per viewport.** No conflicting goals.
- ✅ **Real social proof or explicit `<!-- TODO: ... DO NOT SHIP -->` markers.** No invented quotes.
- ✅ **Mobile-first, a11y ≥ 95, WCAG AA contrast, focus states.**

The PostToolUse hook scans every file Claude writes for forbidden tokens and rejects the write. The `qa-reviewer` agent re-runs the doctrine check + a Playwright run + a Lighthouse pass before `/ship-it` is allowed to proceed.

---

## 🏗️ How it works

```
┌────────────────────────────────────────────────────────────────────┐
│  COMMAND  →  AGENT (preloaded skills)  →  SKILL  →  ARTIFACT       │
│                                                                    │
│  /pick-niche  →  industry-strategist (Opus)                        │
│                  ├─ skill: agency-context                          │
│                  ├─ skill: niche-research                          │
│                  └─ skill: offer-design       →  agency-context.md │
│                                                                    │
│  /build-agency-site  →  seo-strategist     →  site-arch.md         │
│                      →  conversion-copywriter →  copy/*.md         │
│                      →  design-builder        →  pages/*.astro     │
│                      →  qa-reviewer          →  PASS / BLOCK       │
└────────────────────────────────────────────────────────────────────┘
```

Three rules keep the system debuggable:

1. **`agency-context.md` is the single source of truth.** Every skill reads it before asking. You never describe your business twice.
2. **Subagents do not spawn subagents.** Only commands orchestrate. Two-level nesting max.
3. **`qa-reviewer` has block authority.** It can refuse `/ship-it` deploys. That gate is the whole product.

See [`PLAN.md`](PLAN.md) for the full architecture.

---

## 🆚 How this compares

| | **agency-out-of-the-box** | Webflow AI / Framer AI | Raw Claude Code | `marketingskills` |
|---|---|---|---|---|
| Anti-slop QA gate | ✅ Built-in, blocks deploy | ❌ | ❌ | ❌ |
| Conversion frameworks (StoryBrand / Hormozi / PAS) | ✅ Encoded as skills | ❌ Generic templates | ⚠️ You bring them | ⚠️ Some |
| Industry-specific voice / compliance overlays | ✅ Per-niche | ❌ | ❌ | ⚠️ SaaS-flavoured |
| One foundational context document | ✅ `agency-context.md` | ❌ | ❌ | ✅ `product-marketing-context.md` |
| Hand-built design-system blocks | ✅ Tailwind tokens + 9 blocks | ⚠️ Visual builder only | ❌ | ❌ |
| Vendored framework versions (rot risk) | ✅ Bootstraps current | N/A — hosted | ❌ | ❌ |
| Audience | Service agencies | Hobbyist / startup | General | SaaS PMM |
| Open source | ✅ MIT | ❌ | Partial | ✅ MIT |

The two repos that share DNA — [`shanraisshan/claude-code-best-practice`](https://github.com/shanraisshan/claude-code-best-practice) for the orchestration pattern and [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills) for the skill-design pattern — are deliberately referenced and partially borrowed. This repo is service-agency-shaped where they are SaaS-shaped or framework-shaped.

---

## 📚 Repository layout

```
.claude-plugin/        Plugin marketplace manifest
skills/                Eleven SKILL.md modules (the work units)
agents/                Five subagent definitions
commands/              Six slash-command entry points
rules/                 Lazy-loaded rules (conversion doctrine, design system)
hooks/                 Lifecycle hooks (forbidden-token scan, etc.)
setup/                 Settings template the operator merges in
design-system/         Tokens + primitives + blocks (shared across stacks)
stacks/                Bootstrap procedures + overlays — NOT vendored frameworks
industries/            Per-niche overlays
PLAN.md                Master plan + architecture
CLAUDE.md              Agent contract — Claude reads this first
CONTRIBUTING.md        How to land a PR without bouncing the doctrine gate
```

---

## ❓ FAQ

<details>
<summary><b>How is this different from just prompting Claude to "build me an agency website"?</b></summary>
<br>

Three things:

1. **The keystone context file** (`agency-context.md`) means every skill reads your niche, ICP, offer, voice once and respects it forever. Without it, every prompt re-asks the same questions.
2. **Conversion frameworks are encoded as skills.** StoryBrand, Hormozi's Grand-Slam Offer, Brunson's value ladder, AIDA, PAS — all available as structural templates the agent picks from based on page type. You don't have to remember the seven StoryBrand beats; the skill does.
3. **The QA gate has block authority.** A raw Claude run will happily ship "We are passionate about innovation" if you don't catch it. The hook + `qa-reviewer` won't let it.

</details>

<details>
<summary><b>Why don't you ship `package.json` files inside `stacks/`?</b></summary>
<br>

Because Astro 5 → 6, Next 15 → 16, Tailwind 3 → 4 — these all happen on cycles shorter than this repo's expected shelf life. Vendoring a `package.json` with `astro@4.16.10` guarantees that someone cloning this in three months hits a stale starter.

Instead, each stack ships `bootstrap.md` documenting the **current official init command** (`npm create astro@latest`, `npx create-next-app@latest`). The `design-builder` agent runs that at project init, then applies our small `overlay/` of files we genuinely own.

This is the same pattern shadcn/ui uses (CLI generates, you own the output) and it ages well.

</details>

<details>
<summary><b>Can I use this with Cowork instead of Claude Code?</b></summary>
<br>

The skills, agents, and commands are spec-compliant with the Claude Agent Skills format, so they should run under any Claude harness that supports skills (including Cowork). The plugin marketplace install is Claude-Code-specific; for Cowork, clone and reference the directories directly.

</details>

<details>
<summary><b>How much does it cost to run?</b></summary>
<br>

A full `/build-agency-site` run typically uses:
- 1–2 Opus runs for niche / offer (≈ 200k–500k input tokens)
- 4–8 Sonnet runs for SEO + copy + design + QA (≈ 1–3M input tokens combined)

At Anthropic API pricing, that's **$10–$30 per agency site build** end-to-end. Far cheaper than $5k–$15k for a Webflow-style commission.

</details>

<details>
<summary><b>Is the QA gate strict enough that it'll annoy me?</b></summary>
<br>

By design, yes. The forbidden-token list is aggressive (50+ buzzwords). The 5-second test is unforgiving. The 9-section QA pass blocks deploys for things like "no real social proof, only TODO markers."

You can disable individual checks per project via `.claude/settings.local.json` overrides, but the default posture is "block first, override second." That's the whole product.

</details>

<details>
<summary><b>Why MIT? Can I fork and resell?</b></summary>
<br>

Yes. Use it for your own agency, your clients, fork and resell, white-label it, build a SaaS on top — go for it. Attribution is appreciated but not required. See [`LICENSE`](LICENSE).

</details>

---

## 🗺️ Roadmap

- [x] v0.1 — six commands, eleven skills, five agents, four industry overlays, anti-slop QA gate
- [ ] v0.2 — `cold-email-cadence` skill, `case-study-builder` skill, `seo-cluster` skill (programmatic SEO for service businesses)
- [ ] v0.3 — `analytics-wiring` deep integrations (Composio for CRM/email handoff)
- [ ] v0.4 — `pricing-experimenter` skill (A/B test pricing copy + structure with PostHog feature flags)
- [ ] v0.5 — Visual editor preview using Playwright MCP (operator approves block compositions before generation locks them in)
- [ ] v1.0 — additional industry overlays (med-spa, immigration-law, e-commerce-DTC), multi-tenant client-site management, deploy automation (Vercel deploy hook, DNS via Cloudflare API)

Open issues for any of the above to help prioritise.

---

## 🤝 Contributing

PRs welcome — read [`CONTRIBUTING.md`](CONTRIBUTING.md) first. The short version:

- One concern per commit. One concern per PR.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- Run `./hooks/scan-forbidden-tokens.sh` before pushing.
- Don't re-introduce framework boilerplate inside `stacks/` outside `overlay/`.
- New industry overlays: copy `industries/_starter/`, fill all six files.

The most-wanted contributions: **new industry overlays** (one of the highest-leverage spots in the repo), **new design-system blocks**, **doctrine sharpening** in `rules/conversion.md`, and **bug fixes** in the QA gate.

If you ship an agency using this, **open a [Discussion](https://github.com/heymusa/agency-out-of-the-box/discussions)** with a screenshot — we're collecting case studies for the v1.0 launch.

---

## 📜 License

[MIT](LICENSE) — use it however you want. For your own agency, for your clients, fork and resell.

---

## 🙏 Credits

Standing on the shoulders of:

- [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) and the [Agent Skills spec](https://agentskills.io) — Anthropic.
- [`shanraisshan/claude-code-best-practice`](https://github.com/shanraisshan/claude-code-best-practice) — the orchestration-pattern reference.
- [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills) — the skill-design pattern + the foundational-context-file insight.
- Donald Miller (StoryBrand), Alex Hormozi (Grand-Slam Offer), Russell Brunson (Value Ladder), Eugene Schwartz (Awareness Levels) — the conversion frameworks encoded throughout.
- [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS](https://tailwindcss.com), [Astro](https://astro.build), [Next.js](https://nextjs.org) — the stack.

---

<div align="center">

**If this saved you a weekend, [star the repo](https://github.com/heymusa/agency-out-of-the-box) — that's how I know to keep building it.**

[⬆ back to top](#agency-out-of-the-box)

</div>
