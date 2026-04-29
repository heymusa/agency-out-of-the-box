---
name: landing-page-funnel
description: When the user wants to build a single-page paid-traffic landing page or a multi-step funnel. Triggers - "landing page", "LP", "Google Ads landing page", "Meta ads landing page", "single CTA page", "funnel", "lead magnet funnel", "VSL funnel", "quiz funnel", "application funnel". Outputs Next.js pages (default) for interactivity. Single CTA, no nav, message-match with traffic source, UTM personalization. For service-agency website pages with full nav and StoryBrand structure, use storybrand-page.
metadata:
  version: 0.1.0
---

# Landing Page / Funnel

You build conversion-optimized landing pages and multi-step funnels for paid traffic. Different beast from `storybrand-page` — these have no nav, one CTA, and live or die on message-match with the ad that sent the visitor.

## Two output modes

### Single-page LP (`/new-landing-page`)

For paid traffic (Google Ads, Meta Ads, LinkedIn Ads). One scroll. One CTA. No nav.

Frameworks: PAS (problem-aware audience) or AIDA (cold-traffic awareness-stage).

### Multi-step funnel (`/new-funnel`)

For higher-ticket offers or qualification funnels. Step 1 captures attention, step 2 qualifies, step 3 books / sells.

Funnel types:
- **Lead magnet → email → call-booking** (low-friction trickle).
- **Quiz → personalized result → call-booking** (qualification + segmentation).
- **VSL (video sales letter) → application → call** (high-ticket / coaching).
- **Free strategy session → application → enrollment** (consultative high-ticket).

## Workflow — single-page LP

### Step 1 — load context

Read `.agents/agency-context.md`. Required: §3 ICP, §4 Pain Points (verbatim), §6 Offer.

If §6 is empty or weak, route to `industry-strategist` to refine the offer first. A weak offer doesn't get saved by good copy.

### Step 2 — gather campaign-specific inputs

Use `AskUserQuestion`:

> "What's the campaign?"
> - Traffic source (Google Search / Meta / LinkedIn / TikTok)
> - Awareness stage (cold / problem-aware / solution-aware / product-aware / most-aware)
> - Primary CTA (book a call / download a lead magnet / start a quiz / submit an application)
> - Headline if known (matches the ad creative)
> - UTM scheme (if doing UTM personalization)

### Step 3 — pick the framework

| Awareness stage | Framework | Hero pattern |
|---|---|---|
| Cold | AIDA | Pattern-interrupt headline |
| Problem-aware | PAS | Pain question |
| Solution-aware | StoryBrand-compressed | Outcome formula |
| Product-aware | Direct offer | "{Specific deliverable} — {price}" |
| Most-aware | Pure offer | The order page |

### Step 4 — write the LP

Single scroll. Sections:

#### 1. Hero (above the fold)
- Headline: matches ad creative within 2 word-shifts. Same promise, same audience.
- Subheadline: specific, anchored.
- Primary CTA (visible without scrolling).
- Trust micro-bar (logos OR "as seen in" OR metric stat).

#### 2. Problem / Agitate (PAS) OR Interest section (AIDA)
- 200-400 words.
- Customer-language verbatim from §4.
- 1 visual reinforcement (chart, testimonial, screenshot, photo).

#### 3. Solution / Offer
- "Here's how we solve it" — your method, in 3-4 named steps.
- Connect each step to a benefit (FAB).

#### 4. Social proof
- Logo strip if you have logos.
- 2-3 testimonials with attribution + photo.
- Aggregate metric ("47% avg. lift across 14 practices").

#### 5. Bonus stack + offer block
- The Hormozi offer block from agency-context §6, formatted for visual scan.
- Anchored bonus values.
- Total value vs price.

#### 6. Guarantee
- Pulled from §6.
- Visually prominent (own block, full-width, contrasting background).

#### 7. FAQ
- 5-7 questions. Pre-empt the objections that cost conversions.
- "How quickly will I see results?"
- "What if it doesn't work for my [specific case]?"
- "What do I have to do?"
- "How is this different from {alternative}?"

#### 8. Final CTA
- Re-state the offer.
- Re-state the guarantee.
- The CTA button.
- A photo of the founder + handwritten-style note ("I'll personally lead your audit. — {name}") if appropriate to the brand voice.

#### 9. Minimal footer
- Just legal links + copyright. No site nav, no link out.

### Step 5 — UTM personalization (optional)

If the operator runs multiple ad creatives per page (e.g., one ad targeting "dental marketing", another targeting "Google Ads for dentists"), use Next.js Server Components + `searchParams` to swap the headline server-side based on `?utm_term=`.

```tsx
export default async function Page({ searchParams }: { searchParams: Promise<{ utm_term?: string }> }) {
  const { utm_term } = await searchParams;
  const variants = {
    'dental-marketing': { headline: '...' },
    'dental-google-ads': { headline: '...' }
  };
  const variant = variants[utm_term ?? ''] ?? variants['dental-marketing'];
  return <Hero headline={variant.headline} ... />;
}
```

Enables one URL with N landing-page variants, controlled by ad-side UTM. Massively increases ROAS over a generic LP.

### Step 6 — wire analytics

Invoke `analytics-wiring` skill. Standard events:
- `page_view` (auto)
- `cta_clicked` on the primary CTA
- `lead_submitted` on form success
- `call_booked` if Cal.com embedded

## Workflow — multi-step funnel

### Step 1 — pick the funnel type
Ask the operator (or accept argument from `/new-funnel`).

### Step 2 — design step sequence

#### Lead magnet → email → call funnel
- **Step 1 (squeeze):** headline + sub + lead-magnet preview + form (email only).
- **Step 2 (thank-you / delivery):** confirmation + download link + soft up-sell ("While you're reading, want to chat about how this applies to you?" → call link).
- **Email sequence:** 5-7 emails over 14 days, alternating value + soft pitch. Day-3 is the strong-pitch email.

#### Quiz funnel
- **Step 1 (intro):** "Find your {result type} in 3 minutes" + start button.
- **Steps 2-N (questions):** 5-8 questions. Branching logic on key dimensions.
- **Step N+1 (email gate):** "Where should we send your personalized result?"
- **Step N+2 (result + offer):** Personalized result + matching offer. Direct CTA to book / buy.

#### VSL funnel
- **Step 1 (VSL):** Auto-play muted video (full-width). Application button appears at minute 7.
- **Step 2 (application):** 6-10 qualifying questions. "Do you currently have X in place?"
- **Step 3 (booking):** Cal.com embed + reinforcement that they were qualified.

### Step 3 — Server Actions for form submission

Use Next.js Server Actions with Zod validation:

```ts
'use server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  niche: z.enum(['dental', 'legal', 'home-services', 'b2b'])
});

export async function submitLead(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'invalid' };
  // Send to CRM via Resend / Formspree / Composio
  // Fire analytics event
  return { ok: true };
}
```

### Step 4 — qualifying logic

For application-style funnels, hard-disqualify with explicit messaging:

> "Looks like our service isn't a fit for you right now. We work with {ICP fit criteria}. Here are 3 alternatives that might serve you better: {list}."

Honest disqualification builds trust and reduces unqualified call volume.

### Step 5 — analytics + ship

Same as single-page LP, plus `funnel_step_advanced` events between steps.

---

## Hard rules

### Single-page LP

- **No site nav.** Only the logo (no link) at top.
- **One primary CTA.** Repeated 4-7 times, all pointing to the same destination.
- **No outbound links** in the body (other than the privacy policy / terms in footer).
- **Mobile-first.** 70%+ of paid traffic is mobile.
- **Match the ad.** The headline must be within 2 word-shifts of the ad-creative headline. Message-match is the #1 conversion lever.

### Multi-step funnel

- **Cap step count.** 3-5 steps for most. 7+ becomes a graveyard.
- **Per-step analytics.** Every advance fires `funnel_step_advanced` so the operator sees the drop-off.
- **No lock-in steps.** Back button works. Form data persists between steps.

## Anti-patterns

- **VSL with 30-min run time.** 6-12 minutes max in 2026. Attention spans changed.
- **Quiz funnels that "personalize" with fake results.** If the result is the same regardless of inputs, it's not a quiz, it's a delay tactic. Buyers detect it.
- **"Limited time" countdown timers that reset.** Brand poison.
- **Application funnels that don't actually disqualify.** If everyone gets through, it's not qualifying — it's a lead form with extra steps.

## References

- `references/lp-skeletons.md` — section-by-section LP templates per framework.
- `references/funnel-flows.md` — step-by-step funnel templates with branch logic.
- `references/utm-personalization.md` — Next.js patterns for UTM-driven headline swaps.
- `references/email-sequences.md` — 5-email and 7-email lead-magnet → call sequences with day-by-day copy templates.

## Related skills

- `agency-context` — provides offer + voice + ICP.
- `copy-frameworks` — provides AIDA / PAS / 4Us / FAB formulas.
- `component-library` — provides Hero, FormCard, VideoPlayer, Quiz blocks.
- `analytics-wiring` — instruments funnel events.
- `storybrand-page` — for full-nav agency-website pages (different beast).
