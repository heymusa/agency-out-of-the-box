---
name: offer-design
description: When the user wants to design or refine the agency's core service offer. Triggers - "build the offer", "design the offer", "what should I sell", "Hormozi offer", "grand slam offer", "package my service", "pricing structure", "guarantee", "bonus stack", "offer for {niche}". Uses the Hormozi value equation (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort) to construct an offer customers feel stupid saying no to. Outputs section 6 of agency-context.md and refines section 7 (service tier ladder). For initial niche selection, see niche-research first.
metadata:
  version: 0.1.0
---

# Offer Design

You construct the agency's core offer using Alex Hormozi's value equation. The output is section 6 of `.agents/agency-context.md` (the Grand-Slam Offer) and refinement of section 7 (the service tier ladder).

A Grand-Slam Offer is one where the perceived value so massively outweighs the price that the buyer focuses on what they'll gain rather than what they'll spend. The opposite of "let me think about it." The construction is mechanical, not magical — work the four levers, stack proof, structure a guarantee, anchor bonuses.

## Workflow

### Step 1 — load context

Read `.agents/agency-context.md`. Required sections: §1, §2, §3, §4. If §3 (ICP) or §4 (Pain Points) are empty, stop and route to `niche-research` first. You cannot design an offer without a clear ICP and verbatim pain language.

### Step 2 — work the four levers

The value equation:

```
Value = (Dream Outcome × Perceived Likelihood)  /  (Time Delay × Effort & Sacrifice)
```

Maximize the numerator, minimize the denominator. Walk the operator through each lever, one at a time. Don't dump the framework — converse.

#### Lever 1 — Dream Outcome

Ask: "Imagine your best client 12 months from now. What's measurably different in their business?"

Push for specifics:
- A revenue / lead / patient number with comparison (was X, now Y).
- A constraint that's been removed (no longer chasing leads, no longer training new hires, no longer dependent on one channel).
- An emotional outcome (sleeping at night, weekend off, predictability).

Write the outcome in their words, not yours. Avoid abstractions ("growth", "success"). Demand concreteness.

#### Lever 2 — Perceived Likelihood

The buyer's belief that they'll actually achieve the outcome. This is built with proof, not promises.

Ask: "What evidence do you have that you can produce that outcome?"

Inventory:
- Case studies with real numbers and real client names (or redacted with consent).
- Metrics from your own agency (X clients served, Y leads generated, Z revenue produced).
- Process transparency (a defined methodology you can show in 5 steps).
- Credentials (certifications, awards, press, education).
- Risk reversal (the guarantee — see Step 4).
- Social proof at scale (testimonials, BBB, Google reviews on your own agency).

If proof is thin, flag it. Empty `agency-context.md §11` blocks a strong offer. Recommend: build proof intentionally — pilot 2-3 clients at cost or for case-study rights, document obsessively, get on-camera testimonials. Then return to offer design.

#### Lever 3 — Time Delay

How long until the buyer sees a result. Two horizons:
- **First visible result** (the "win" they can show their spouse / business partner).
- **Full result** (the dream outcome, end-state).

Compress both. Examples:
- First result in week 1: "Audit deck and 3 quick-win recommendations delivered Friday of week 1."
- First result in week 2: "Live Google Ads campaign with first 5 calls booked in week 2."
- First leads by week 4: "Site relaunched + Google Business Profile optimized; first new patient inquiries by end of month 1."

If you can't compress to a first-visible-result inside 30 days, the offer needs restructuring — break the deliverable into a fast quick-win + the longer arc.

#### Lever 4 — Effort & Sacrifice

What the client has to do for it to work. Minimize and surface.

Inventory effort:
- Onboarding calls (cap at 1, max 90 minutes).
- Asset gathering (provide a one-page checklist; do everything you can without it).
- Content production (do it for them; don't ask them to write blog posts).
- Approvals (clear approval cadence, max 2 days SLA).
- Time commitment per week (cap at 30-60 min per week post-onboarding).

Frame this as the explicit "What you bring" + "What we handle" comparison in the pricing section. Light client lift = high perceived value.

### Step 3 — structure the bonus stack

Bonuses make the offer feel like a deal even at the same price. Each bonus must:

1. Solve an objection the buyer has (e.g., "what if my website isn't ready" → bonus: free landing-page build).
2. Have a clear standalone value (anchored at $X — what someone would pay for this alone).
3. Be deliverable at low marginal cost to you (templates, recordings, group resources, one-time setup work you do anyway).

Aim for 3-5 bonuses with anchored values that sum to 2-3x the offer price.

Examples for a dental marketing agency at $3,500/mo:
- Bonus 1: "Done-for-you Google Business Profile optimization (worth $1,500)."
- Bonus 2: "30-day reactivation campaign to your inactive patient list (worth $2,500)."
- Bonus 3: "Custom-built new-patient intake form integrated with your PMS (worth $1,800)."
- Bonus 4: "Quarterly competitor teardown report (worth $1,200/quarter, $4,800/yr)."
- **Total bonus value: $10,600 added on top of the $3,500/mo retainer.**

### Step 4 — design the guarantee

The single biggest lever on perceived likelihood. Three guarantee types:

**Conditional money-back.** "If we don't deliver X by date Y, your next month is free." Specific, measurable, time-bound. Best for offers where you can confidently hit the metric.

**Performance-based.** "We don't get paid unless you hit Z." Best for paid-ads work where the metric is downstream and you have control over it.

**Hybrid (recommended for most agencies).** "Pay the setup fee. We'll deliver [audit + first 30 days of work]. If you don't see [specific metric] by day 30, we refund the setup and unsubscribe you with no further obligation." Reduces both upfront risk and locks confidence in the engagement.

Avoid:
- Vague guarantees ("100% satisfaction guarantee" — meaningless).
- Guarantees on metrics you don't control (revenue is downstream of close rate, sales process, fulfillment — guarantee leads, not revenue).
- Guarantees that turn into refund hell (open-ended, unbounded).

### Step 5 — design urgency and scarcity

Both should be **real**, not manufactured.

**Urgency** (time-bound):
- Cohort-style onboarding: "We onboard 3 new clients per month, on the first Monday."
- Seasonal: "Storm season starts in 6 weeks. Roofers who aren't ranked by then lose the season."
- Deadline-anchored: "End-of-quarter pricing — increases by $X on April 1."

**Scarcity** (capacity-bound):
- Slot capacity: "Currently serving 8 dentists in the [region]. Capacity for 4 more before we add another senior strategist."
- Geographic exclusivity: "We work with one practice per zip code."

Both must be defensible. If a buyer asks "is that real or marketing fluff?" the answer must be the truth.

### Step 6 — write the offer block

Synthesize into a structured offer block that drops into:
- The pricing section of the agency website (`storybrand-page` will pull this).
- The pre-CTA section of the funnel landing page (`landing-page-funnel`).
- Sales-call decks and proposal templates.

Block structure:

```markdown
## The Offer

**For:** {ICP from §3}

**You get:** {core deliverable in 1 sentence}

**Dream outcome:** {12-month result in their words}

**Timeline:** First win in {X days}; full result by {Y months}.

**What we handle / What you bring:** {explicit list}

**Bonuses (yours when you start before {date or capacity}):**
1. {bonus 1} — worth ${value}
2. {bonus 2} — worth ${value}
3. {bonus 3} — worth ${value}
**Total bonus value: ${sum}**

**Guarantee:** {hybrid guarantee structure}

**Investment:** ${price/mo or one-time}

**Capacity:** {slots / cohorts}
```

### Step 7 — refine the service tier ladder

Look at agency-context §7 (Service Tier Ladder). Make sure:
- **Free tier (lead magnet)** ascends naturally to the entry tier. (Audit → strategy call → engagement.)
- **Entry tier** is genuinely valuable on its own AND naturally ladders to the core offer.
- **Core productized offer** is what you just designed in Steps 2-6.
- **Retainer / continuity** captures revenue post-launch.
- **High-ticket / custom** exists for the 5% of clients who want bespoke.

Update §7 with the refined ladder.

### Step 8 — write back to agency-context

Persist the offer block to `.agents/agency-context.md §6`. Show diff. Confirm. Write.

---

## Hard rules

- **No outcome guarantees on metrics outside your control.** Lead volume yes; revenue / close rate / fulfillment quality no.
- **No fake urgency.** "Sale ends in 24 hours!" with a countdown that resets is brand-poison.
- **Bonuses must be deliverable.** Don't anchor a $10k bonus you can't actually produce.
- **Real prices.** No "$X,XXX" placeholder anchors. The operator commits to the price.

## Anti-patterns

- **Premium positioning by proximity to "elite" / "exclusive" / "VIP".** Doesn't work. Specificity does.
- **Bonus stack > core offer.** If the bonuses are worth more than the offer, the offer is the bonus. Restructure.
- **Cheaper-than-competitors as the value lever.** Race to the bottom. Never lead with price.

## References (load on demand)

- `references/value-equation-templates.md` — filled examples for 6 niches.
- `references/guarantee-structures.md` — 8 guarantee templates with sample copy.
- `references/bonus-library.md` — 30+ bonus ideas categorized by industry.
- `references/pricing-anchors.md` — psychology of price anchoring (decoy pricing, charm pricing, package framing).

## Related skills

- `agency-context` — owns the file you're writing into.
- `niche-research` — must complete before this skill runs.
- `storybrand-page` — pulls offer block into the pricing section.
- `landing-page-funnel` — pulls offer block into the pre-CTA section.
