---
name: copy-frameworks
description: When an agent needs proven copywriting formulas for headlines, body sections, or CTAs. Triggers - "headline formula", "AIDA", "PAS", "4Us", "above the fold", "CTA copy", "value prop", "subheadline", "lead paragraph". Loaded as a preloaded skill on the conversion-copywriter agent. Provides the formula library that storybrand-page, landing-page-funnel, and seo-page all reference. Body details live in references/ for progressive disclosure.
metadata:
  version: 0.1.0
---

# Copy Frameworks

You are the formula library. Other agents pull from you when they need a tested headline structure, body framework, or CTA pattern. You don't write entire pages — you provide the building blocks that page-generation skills compose.

## The frameworks at a glance

| Framework | Best for | Skill that uses it |
|---|---|---|
| StoryBrand 7-part | Long-form service pages | `storybrand-page` |
| AIDA | Awareness-stage cold-traffic LPs | `landing-page-funnel` |
| PAS (Problem-Agitate-Solve) | Pain-aware cold-traffic LPs | `landing-page-funnel` |
| 4Us (Useful, Urgent, Unique, Ultra-specific) | Headlines, especially pricing pages | All page-gen skills |
| Hormozi value equation (in copy form) | Pre-CTA pitch sections | `landing-page-funnel`, `storybrand-page` (pricing) |
| FAB (Feature-Advantage-Benefit) | Feature grids on service pages | `storybrand-page`, `seo-page` |

## Headline formulas (quick reference)

When invoked for a headline, pick a formula based on traffic stage:

### Cold traffic (don't know they have the problem)
- **Pain question:** "Tired of {pain point}?"
- **Pattern interrupt:** "{Counter-intuitive claim}. Here's why it works for {ICP}."

### Warm traffic (know they have the problem, exploring solutions)
- **Outcome formula:** "{Achieve dream outcome} without {pain point}"
  → "Add 8-12 new dental patients per month without Groupon discounting"
- **Specificity stack:** "{Number} {what} for {ICP} in {timeframe}"
  → "12 new patients in 90 days for FFS dental practices"
- **Category-define:** "The {category} for {ICP}"
  → "The marketing system for $1M-$5M dental practices"

### Hot traffic (ready to buy)
- **Pure offer:** "{Concrete deliverable} — {investment}"
  → "Done-for-you dental SEO retainer — $3,500/mo, 30-day guarantee"
- **Risk-reversal:** "{Outcome} or your money back"

For full formula library with variations and examples, see `references/headline-formulas.md`.

## Body frameworks (full reference)

### AIDA (Attention → Interest → Desire → Action)

Best for cold-traffic single-page LPs.

- **Attention** — pattern-interrupt headline + bold visual or stat.
- **Interest** — agitate the pain, then introduce the solution (15-20% of page).
- **Desire** — offer details, bonus stack, social proof, guarantee (50% of page).
- **Action** — clear CTA with risk reversal (15% of page).

### PAS (Problem → Agitate → Solve)

Best for pain-aware cold traffic. Compressed — works in 600 words.

- **Problem** — name it specifically.
- **Agitate** — make it feel real. Use customer-language quotes.
- **Solve** — your offer, in one paragraph.

### 4Us — for headlines and subheadlines

Every headline / subheadline should hit at least 3 of:

- **Useful** — clear benefit.
- **Urgent** — time pressure.
- **Unique** — differentiation from alternatives.
- **Ultra-specific** — numbers, names, concretes.

Example: "Add 8-12 high-value new dental patients in 90 days — without Groupon discounting that erodes case acceptance" → useful (new patients), unique (the no-Groupon angle), ultra-specific (8-12, 90 days).

### Hormozi value equation in prose

For pricing-page pre-CTA or LP middle:

> "Imagine [dream outcome — specific, 12 months out]. We deliver [first visible result] within [time delay], with [effort minimization specifics]. Backed by [proof — case studies, guarantee]."

### FAB (Feature → Advantage → Benefit)

For service-page feature grids and case-study deliverables:

- **Feature:** "Custom-built new-patient intake form integrated with Dentrix."
- **Advantage:** "Auto-syncs to your PMS — no manual data entry."
- **Benefit:** "Your front desk saves 2 hours per day."

Always end on the benefit. Buyers buy benefits; features are evidence.

## CTA formulas

### CTA copy structure

`[Strong specific verb] + [specific outcome the user gets]` (+ optional `[low-commitment qualifier]`).

Strong:
- "Get my dental SEO audit"
- "Book my 20-minute strategy call"
- "See pricing for my practice size"
- "Download the 2026 plumber-marketing playbook"

Weak (rewrite):
- "Submit"
- "Sign Up"
- "Get Started"
- "Click Here"
- "Learn More"

### CTA hierarchy

- **Primary** (hero, mid-page, final): direct CTA. One per viewport.
- **Secondary** (transitional): lower commitment. "Watch the 6-min demo", "Download the playbook", "See case studies."

Never two primaries in the same viewport.

### CTA placement
- Hero (above the fold).
- After the problem block.
- After the social proof block.
- After the pricing block.
- Final block.

5-7 placements per page. The buyer should never have to scroll back to find a CTA.

## Subhead patterns

The subheadline expands on the headline with specificity. Patterns:

- **Mechanism:** "{How it works in one sentence}." → "We blend local SEO, paid search, and reactivation campaigns into one ops-light system."
- **Outcome qualifier:** "Built for {specific ICP}, delivered in {timeline}, backed by {guarantee summary}."
- **Proof anchor:** "Used by {N} {ICP} in {city / region}."

Cap at 3 sentences. Mobile measures around 100-120 chars per line.

## Trust signal copy

Trust signals near CTAs use specific anchored language:

Strong:
- "14 dental practices across 9 states. Average new-patient lift: 47% in 90 days."
- "Trusted by 22 PI law firms in cities of 500k+. 6 firms have ranked top-3 organic in 9-12 months."

Weak (avoid):
- "Trusted by businesses everywhere."
- "Industry leader."
- "Award-winning."

## References (load on demand)

- `references/headline-formulas.md` — 18 tested headline structures with examples per niche.
- `references/storybrand-templates.md` — section-by-section StoryBrand long-form templates.
- `references/aida-pas-4us.md` — full AIDA / PAS / 4Us templates with worked examples.
- `references/cta-library.md` — 60+ CTA copy patterns categorized by funnel stage.
- `references/objection-library.md` — common objections with response copy templates.

## Hard rules

- Voice always pulls from `agency-context.md` §8 + `industries/{niche}/voice.md`. Don't invent tone.
- No buzzwords (`rules/conversion.md` §3). The PostToolUse hook will fail you.
- Customer-language verbatim from §4 takes priority over polished agency voice.
- Specificity always — numbers, names, artifacts.

## Related skills

- `storybrand-page` — primary consumer for long-form service pages.
- `landing-page-funnel` — primary consumer for paid-traffic LPs.
- `seo-page` — uses headline formulas for SEO-titled pages.
- `agency-context` — provides voice and proof inputs.
