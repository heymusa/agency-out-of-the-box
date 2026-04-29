---
description: Build a single-page paid-traffic landing page (Next.js stack, no nav, single CTA). Optimized for Google / Meta / LinkedIn ads. Optionally personalizes by UTM. Requires agency-context.md §6 (offer) filled.
argument-hint: "<campaign-slug> [--source=google|meta|linkedin|tiktok] [--awareness=cold|problem-aware|solution-aware]"
---

# /new-landing-page

Single-page paid-traffic landing page. Different beast from `/build-agency-site` — no nav, one CTA, lives or dies on message-match with the ad.

## What this command does

1. **Validates `.agents/agency-context.md` §6** (Grand-Slam Offer) is filled.
2. **Gathers campaign-specific inputs** (traffic source, awareness stage, ad-creative headline for message-match).
3. **Invokes `conversion-copywriter`** to draft hero + body using PAS / AIDA / StoryBrand-compressed.
4. **Invokes `design-builder`** to compose the LP into the Next.js stack (no nav layout).
5. **Invokes `analytics-wiring`** to instrument with `cta_clicked`, `lead_submitted`, `call_booked` events.
6. **Invokes `qa-reviewer`** for the QA gate scoped to LP rules (single CTA, no nav, message-match).
7. **Outputs** to `output/lps/{campaign-slug}/` with deploy-ready Next.js project.

## Workflow

### Step 1 — preflight

Read `.agents/agency-context.md`. Required: §3, §6.

If §6 (Grand-Slam Offer) is empty or weak, halt:
> "Offer §6 is empty or thin. Run /pick-niche or /agency-context update --section=offer first."

### Step 2 — gather campaign inputs

Use `AskUserQuestion`:

**Question 1: Traffic source**
- Google Search (high intent, branded + non-branded keywords)
- Meta (Facebook / Instagram, broader interest targeting)
- LinkedIn (B2B job-title targeting)
- TikTok (interest + creator-driven)

**Question 2: Awareness stage**
- Cold (don't know they have the problem) → AIDA
- Problem-aware (know the pain, exploring) → PAS
- Solution-aware (comparing solutions) → StoryBrand-compressed
- Product-aware / most-aware → Direct offer / order page

**Question 3: Primary CTA**
- Book a call (Cal.com / SavvyCal embed)
- Download a lead magnet (form → email gate)
- Start a quiz (multi-step → result page)
- Submit an application (qualifying form)
- Buy directly (Stripe / Lemon Squeezy embed)

**Question 4: Ad creative match (free-text)**
> "What's the headline of the ad sending traffic here? (For message-match — the LP headline should be within 2 word-shifts of this.)"

**Question 5 (optional): UTM personalization**
> "Run multiple ad creatives to this LP with personalized headlines per UTM?"
> - Yes — set up UTM-driven Server Component variants
> - No — single static headline

### Step 3 — write campaign brief

Persist `output/lps/{campaign-slug}/brief.md` with:
- Campaign name, traffic source, awareness stage.
- Primary CTA + destination.
- Ad-creative headline.
- UTM scheme (if personalizing).

### Step 4 — invoke conversion-copywriter

```
Agent(
  subagent_type="conversion-copywriter",
  description="LP for {campaign-slug}, framework={PAS/AIDA/SB-compressed}",
  prompt="<context: agency-context, campaign brief, framework choice>"
)
```

Outputs: `output/lps/{campaign-slug}/copy.md` and `output/lps/{campaign-slug}/copy.json`.

### Step 5 — invoke design-builder

```
Agent(
  subagent_type="design-builder",
  description="Compose LP into stacks/nextjs-funnel",
  prompt="<context: copy props, output target=output/lps/{campaign-slug}, layout=no-nav>"
)
```

The design-builder uses a no-nav layout variant: just logo + final-CTA + minimal footer. Composes Hero, Problem (PAS) or Interest (AIDA), Solution, SocialProof, Pricing/Offer, Guarantee, FAQ, FinalCTA, MinimalFooter.

If UTM personalization was selected, the design-builder writes a Server Component page that reads `searchParams` and switches headline based on `utm_term`.

### Step 6 — analytics wiring

Standard events: `cta_clicked` (primary CTA), `lead_submitted` (form), `call_booked` (Cal.com hook), plus campaign-source attribution captured to UTMs.

### Step 7 — QA gate

```
Agent(
  subagent_type="qa-reviewer",
  description="QA gate on LP — LP-specific rubric (single CTA, no nav, message-match)",
  prompt="<context: campaign brief, LP path>"
)
```

QA-reviewer's LP-specific checks:
- No site nav (only logo at top, no link).
- One primary CTA. Repeated 4-7 times, all to the same destination.
- Hero headline within 2 word-shifts of the ad-creative headline.
- Mobile-first verified at 375px and 414px (most paid traffic is mobile).
- All sections of LP rubric in `landing-page-funnel` skill respected.

### Step 8 — output deploy package

If QA passes:
- `output/lps/{campaign-slug}/` is a complete, deployable Next.js project.
- Include `output/lps/{campaign-slug}/DEPLOY.md` with one-click Vercel deploy instructions.
- Suggest the operator runs `/ship-it output/lps/{campaign-slug}/` (which adds Lighthouse + final QA before deploy).

### Step 9 — recommend next

- Suggest building 2-3 LP variants per ad creative (UTM-personalized) if running paid budget > $5k/mo.
- Suggest creating a follow-up email sequence via `/new-funnel lead-magnet-to-call` if LP CTA is a lead magnet.

## Hard rules

- **Single CTA enforced.** No "Book a call" beside "Subscribe to newsletter." Pick one.
- **Message-match enforced.** Ad headline → LP headline within 2 word-shifts. The QA gate fails if drift is too large.
- **Mobile-first enforced.** All checks at 375px first, then desktop.
- **No site navigation.** LPs are not the website.

## Anti-patterns

- **Treating the LP like a homepage.** Different beast. No nav, no "About" link, no menu.
- **A/B testing the offer instead of the headline.** Test headlines, ad creative, hero image — those have the biggest leverage. The offer is fixed.
- **Adding a chatbot on the LP.** Distracting and brand-dilutive. Chatbot belongs on the agency site, not on a paid-traffic LP.

## Example invocations

```
/new-landing-page hyper-local-austin
→ Default: cold, Google Search, primary CTA = book call.

/new-landing-page meta-q2-2026 --source=meta --awareness=problem-aware
→ Meta-targeted, problem-aware audience, PAS framework.

/new-landing-page linkedin-fractional-cfos --source=linkedin --awareness=solution-aware
→ B2B LinkedIn, solution-aware audience, StoryBrand-compressed.
```
