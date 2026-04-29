---
name: storybrand-page
description: When the user wants to generate a service-agency website page using the StoryBrand 7-part structure - homepage, services page, about, case-study page, or any service-business marketing page. Triggers - "build the agency site", "write the homepage", "storybrand page", "service page copy", "about page", "agency website". Outputs runnable Astro page files (or Next.js if the operator overrides). Casts the customer as the hero, the agency as the guide. For paid-traffic single-page LPs (no nav, single CTA), use landing-page-funnel instead. For SEO-driven content pages, use seo-page.
metadata:
  version: 0.1.0
---

# StoryBrand Page

You generate complete, production-quality pages for a service-business agency website using Donald Miller's 7-part StoryBrand framework. The customer is the hero. The agency is the guide.

This is the default skill for `/build-agency-site` and `/new-client-site`. Outputs go into `stacks/astro-marketing/src/pages/` (default) or `stacks/nextjs-funnel/app/` (if overridden).

## The 7-part structure (every long-form page must hit all 7)

1. **Character** — The customer (the hero). Their identity, their want.
2. **Problem** — External (the visible problem), Internal (how it makes them feel), Philosophical (why it shouldn't be that way).
3. **Guide** — The agency. Empathy ("we get it") + Authority (proof you can lead them).
4. **Plan** — The path forward. 3-4 numbered steps, each obvious.
5. **Call to Action** — Direct CTA (primary) + transitional CTA (low-commitment).
6. **Failure** — What's at stake if they don't act. Avoid melodrama.
7. **Success** — Vivid picture of the outcome.

These map to **page sections** in this order: Hero (Character + Problem framed) → Problem block (full 3-layer problem articulation) → Guide block (empathy + authority) → Plan block (3-4 steps) → CTA banner (direct CTA) → Social proof (proves the guide is trustworthy) → Failure / Stakes block → Success / Vision block → Pricing (the offer) → FAQ (objection handling) → Final CTA (direct + transitional).

## Workflow

### Step 1 — load context

Read `.agents/agency-context.md`. Required sections:

- §1 Identity, §3 ICP, §4 Pain Points, §5 Positioning, §6 Offer, §8 Voice, §9 Visual.

If any are missing, stop and route to `industry-strategist` to fill the gaps. Don't write copy without context.

Also load `industries/{niche}/voice.md` and `industries/{niche}/proof-patterns.md`.

### Step 2 — pick the page type

Pages this skill generates:

- **Homepage** — full 7-part structure, all sections.
- **Services index** — a directory of service offerings, each linking to a deeper service page.
- **Service page** (e.g., `/services/dental-seo`) — 7-part structure scoped to one service.
- **About** — guide-heavy, 3 sections (founder story, philosophy, team).
- **Case study** — proof-heavy, the customer's transformation as a story.
- **Pricing** — the offer block from §6, plus comparison table, FAQ, guarantee.
- **Contact** — short page, form + booking embed.

Ask the operator which page(s) to generate, or generate the full set if invoked from `/build-agency-site`.

### Step 3 — draft the copy, section by section

For each section, follow the doctrine in `.claude/rules/conversion.md`:

- 5-second test on the hero.
- Specific over vague — every benefit anchored in numbers / names / artifacts.
- Customer-language verbatim from §4 of agency-context.
- One primary CTA per viewport.
- Real social proof (no fabrication).

#### Hero (Character + Problem framed)
- **Headline** — outcome-focused, 5-second test pass. Formulas:
  - "{Achieve dream outcome} without {pain point}"
  - "The {category} for {ICP} who {trigger event}"
  - "{Number-anchored result} for {ICP}"
- **Subheadline** — 1-2 sentences, expand on the headline with specificity.
- **Primary CTA** — strong verb + specific outcome ("Book my 20-min strategy call", "Get my dental SEO audit").
- **Hero visual** — TODO marker if no real image; never AI-generated stock. Real founder, real team, real process photo.

#### Social proof bar (under the hero)
Logo strip OR metric strip OR single anchored quote. Pulls from agency-context §11.

#### Problem block (full 3-layer)
- **External problem** (what they see): "Your phones aren't ringing. New-patient inquiries are down 30% since 2023."
- **Internal problem** (how they feel): "You're working harder than ever and the practice still feels stuck."
- **Philosophical problem** (why it shouldn't be this way): "Owning a practice in 2026 shouldn't mean working IN it 50 hours a week to fight for the leads a single Google update can take away."

This block is 3-4 sentences total. Compressed, not bloated.

#### Guide block (empathy + authority)
- **Empathy** — one paragraph. "We've sat in your chair. The founder ran a 12-op practice in [city] for 9 years before building this."
- **Authority** — anchored in agency-context §11 proof inventory. Number of clients served, years in industry, signature method or framework.

#### Plan block (3-4 numbered steps)
Each step:
- Verb-led ("Audit", "Activate", "Iterate").
- One sentence of detail.
- Time-bound where possible ("Day 1-7", "Week 2", "Month 3").

Three or four steps. Five is too many.

#### Direct CTA
Repeat the primary CTA from the hero. Same destination.

#### Failure / Stakes (compressed)
- 2-3 sentences of what's at stake if they don't act. Tied to §4 (Pain Points) — the cost of not solving.
- No melodrama. No "you'll lose everything." Adult tone.

#### Success / Vision (compressed)
- 2-3 sentences painting the post-engagement state.
- Specific. "Your hygienist schedule is full 4 weeks out. Your case acceptance is up 22%. You're home for dinner."
- Tied to §6 Dream Outcome.

#### Pricing block
Pulls the offer block from agency-context §6. Includes:
- Investment (price/mo + setup if applicable).
- What's included.
- Bonus stack with anchored values.
- Guarantee (with the structure from §6).
- Urgency / scarcity mechanism.

If multiple tiers in §7, render the comparison.

#### FAQ block
6-10 questions. The objections from §6's effort/sacrifice + common implementation worries. Real answers, not "we'll work with you to find what's right." Specific.

#### Final CTA
- Primary direct CTA repeated.
- Transitional CTA below it (lower commitment — "Download the playbook", "Watch the 6-min demo").

### Step 4 — render to the stack

Compose the page using `design-system/blocks/`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '@design-system/blocks/Hero.astro';
import SocialProof from '@design-system/blocks/SocialProof.astro';
import ProblemBlock from '@design-system/blocks/ProblemBlock.astro';
// ... etc
---

<Layout title="..." description="...">
  <Hero variant="centered" headline="..." subheadline="..." cta={{ label: '...', href: '...' }} />
  <SocialProof variant="logos" items={[...]} />
  <ProblemBlock external="..." internal="..." philosophical="..." />
  <!-- ... -->
</Layout>
```

Never write components from scratch. Compose. If a block doesn't exist, halt and request it from the `component-library` skill.

### Step 5 — write OG metadata + schema

For every page generated:

- `<title>` — 50-60 chars max, specific.
- `<meta name="description">` — 140-160 chars.
- Open Graph image (default to a generated OG card; component-library has `OGImage`).
- Schema.org markup: `Service` schema for service pages, `Article` for case studies, `FAQPage` for FAQ block, `Organization` for the homepage.

### Step 6 — self-check

Before declaring done, run the self-test:

1. **5-second test** — paraphrase what the hero communicates from above-the-fold only. Pass / fail / rewrite.
2. **Forbidden-token scan** — grep for buzzwords from `rules/conversion.md`.
3. **Real social proof check** — every quote / metric / logo traces to agency-context §11. Anything not real is marked TODO.
4. **One-CTA-per-viewport check** — visual scan of the rendered page, top to bottom.
5. **Specificity scan** — every benefit has a number, name, or concrete artifact.

If any check fails, rewrite the affected section before passing the file downstream.

---

## Hard rules

- **Pull voice from `agency-context.md` §8 + `industries/{niche}/voice.md`.** Don't invent tone.
- **Real proof or TODO.** Every quote / logo / metric is real or marked `<!-- TODO: replace with REAL ... DO NOT SHIP -->`.
- **Compose, don't re-implement.** Blocks come from `design-system/blocks/`.
- **The hero passes the 5-second test.** Non-negotiable.
- **Buzzword-free headlines.** The PostToolUse hook will fail your write otherwise.

## Anti-patterns

- **Long Problem block.** Three layers in 3-4 sentences total. Not three paragraphs.
- **"We are passionate about" guide block.** Empathy is shown by demonstrating you've sat in their chair, not by claiming you care.
- **Plan with 7 steps.** Three or four. Cap.
- **Pricing page that reads like an apology.** Confidence, no qualifiers.
- **FAQ that dodges the real objection.** If they're going to ask "how do I know you can deliver?" — answer it directly. Don't deflect to "every situation is unique."

## References

- `references/page-templates.md` — homepage / service-page / case-study / about / pricing skeletons.
- `references/headline-formulas.md` — 18 tested headline structures.
- `references/section-transitions.md` — natural prose transitions between sections (no "Without further ado" garbage).

## Related skills

- `agency-context` — read first.
- `copy-frameworks` — referenced for headline / CTA / body formulas.
- `component-library` — provides the blocks you compose from.
- `design-system` — provides the tokens that bind the blocks.
- `seo-page` — for SEO-driven content pages instead of conversion-driven service pages.
- `landing-page-funnel` — for paid-traffic single-page LPs.
