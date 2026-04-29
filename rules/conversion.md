---
paths:
  - "stacks/**/*.tsx"
  - "stacks/**/*.astro"
  - "stacks/**/*.mdx"
  - "stacks/**/*.md"
  - "design-system/blocks/**"
  - "output/**"
  - "clients/**/*.md"
  - ".agents/agency-context.md"
---

# Conversion Doctrine — the no-AI-slop rule sheet

This rule loads on every page-build, content edit, and block change. Hard rules below are blocking — if any artifact violates them, the agent must rewrite before passing the artifact downstream. The `qa-reviewer` agent runs the full sweep before `/ship-it` and has authority to block the deploy.

The reason this doctrine is so strict: every shortcut compounds. A "we'll fix it later" placeholder ships, a buzzword headline is left in, a fake testimonial slips through, and the page that was supposed to convert visitors at 4% converts them at 0.6%. The doctrine exists so the system can move fast without the work degrading.

---

## Hard rules (failure conditions — do not pass these)

### 1. No lorem ipsum, no placeholder text, no `[your-X-here]`

Forbidden tokens (case-insensitive substring match in any output file):

- `lorem ipsum`, `lorem`, `dolor sit amet`, `consectetur adipiscing`
- `[your headline]`, `[your-headline]`, `[insert headline]`
- `[your benefit]`, `[insert benefit]`, `[benefit here]`
- `[your CTA]`, `[insert CTA]`, `[click here]`
- `[your tagline]`, `[insert tagline]`
- `your company name`, `your business name`, `your product`
- `placeholder`, `tbd`, `todo: write copy`

If the agent does not have the real content, it inserts an explicit `<!-- TODO: replace with REAL X — DO NOT SHIP -->` comment. The QA gate will block deploy on any such TODO.

### 2. No fabricated stats, testimonials, or case-study results

- Every numeric claim must trace back to `agency-context.md` §11 (Proof Inventory) or be tagged with a `[unverified]` marker that the QA gate flags.
- Every testimonial must include real attribution (name + role + company OR explicit "Anonymous, by request" with a reference to which client).
- Every case-study result must include the client name (or a redaction with consent on file) and a real metric.
- Inventing "Sarah, CEO of TechCo" testimonials is a fire-the-agent offense.

### 3. No buzzword headlines, no "passionate / innovative / dedicated"

Forbidden in headlines, subheadlines, and any prominent copy:

`synergy`, `synergistic`, `world-class`, `cutting-edge`, `bleeding-edge`, `leverage` (verb), `utilize`, `robust`, `seamless`, `seamlessly`, `innovative`, `innovation` (as the value prop), `passionate`, `passionately`, `dedicated`, `comprehensive`, `holistic`, `end-to-end` (as the value prop), `best-in-class`, `mission-critical`, `paradigm-shift`, `paradigm shift`, `game-changer`, `game changer`, `disruptive`, `disrupt` (marketing verb), `transform` (transitive marketing verb), `unlock` (as in "unlock potential"), `empower` (marketing verb), `elevate` (marketing verb), `revolutionize`, `next-generation`, `next-gen`, `state-of-the-art`, `solution provider`.

Body text gets a softer warning — if these words appear in body copy, the agent must justify they're factually correct (e.g., "WCAG-AA compliant" is fine; "world-class compliance" is not).

### 4. No 3-up "passionate / innovative / dedicated" feature grids

Reject any feature grid where each feature is an abstract noun ("Quality", "Excellence", "Service") with a generic description ("We pride ourselves on delivering...").

Every feature in a grid must:
- Reference a concrete deliverable, process, or outcome from `agency-context.md` §6 (Offer) or §7 (Service Tier Ladder).
- Include a specific number, name, timeframe, or named artifact.
- Be parseable by a stranger to the industry within 6 seconds.

Good: "30-day audit + remediation roadmap, delivered as a 12-page PDF you can hand to your dev team."
Bad: "Comprehensive analysis of your digital presence."

### 5. The 5-second test

Every hero (the above-the-fold content) must let a stranger from the target industry answer all three of these in 5 seconds without scrolling:

1. **What is this?** (category + offering, not "AI-powered platform" but "Dental marketing for practices doing $1M-$5M/yr.")
2. **Who is it for?** (the ICP — must be obvious)
3. **What do I do next?** (the CTA must be visually dominant and verbally specific)

If the headline + subheadline + CTA + hero visual together don't satisfy all three, the page fails. The `conversion-copywriter` agent runs a self-test by paraphrasing the answers from only above-the-fold content; if any of the three is hand-wavy, rewrite.

### 6. Specific over vague — every benefit gets a concrete anchor

Reject:
- "Save time on your workflow."
- "Streamline your operations."
- "Grow your business."
- "Boost engagement."

Accept:
- "Cut your weekly reporting from 4 hours to 15 minutes — the auto-generated dashboard pulls from GA4, Stripe, and your CRM."
- "Replace 3 disconnected tools (Sheets, Slack, Notion) with one shared workspace."
- "Add 8-12 qualified consultations per month from local search, with no ad spend."

### 7. One primary CTA per viewport

- Header CTA + hero CTA + final CTA all point to the same conversion event.
- A page can have a secondary "transitional" CTA (download a guide, watch a video) but only one **primary** CTA per scroll-section.
- No "Book a call" beside "Subscribe to newsletter" beside "Download the ebook" — pick one.

### 8. Real social proof or explicit TODO

Every page must include at least one social-proof block above the final CTA. If the agency has a real testimonial / logo / metric, use it. If not, insert:

```html
<!-- TODO: replace with REAL client quote, real logo, or real metric — DO NOT SHIP -->
```

The QA gate fails the build on any unresolved TODO of this form.

### 9. Mobile-first, accessibility floor

- Lighthouse Performance ≥ 90 on mobile (3G throttle).
- Lighthouse Accessibility ≥ 95.
- Lighthouse Best Practices ≥ 95.
- Lighthouse SEO ≥ 95.
- Real, descriptive alt text on every image (not the filename, not "image", not "[image description]").
- WCAG AA color contrast (4.5:1 body, 3:1 large text).
- Visible focus states on every interactive element.
- All forms are keyboard-navigable end to end.
- Touch targets ≥ 44 × 44 px.

### 10. CTA copy must communicate value, not action

Reject: "Submit", "Sign Up", "Learn More", "Get Started", "Click Here".
Accept: "Get my dental SEO audit", "See pricing for my practice size", "Book my 20-minute strategy call", "Download the 2026 plumber-marketing playbook".

CTA copy formula: `[Strong verb] + [specific outcome they get]`. Optionally add `+ [low-commitment qualifier]` ("free", "no card required", "20 min").

---

## Soft rules (warnings, not blockers — but `qa-reviewer` flags them)

- **Prefer rhetorical questions when addressing pain.** "Tired of chasing dental insurance reimbursements?" beats "Many dentists are tired of chasing dental insurance reimbursements."
- **Mirror the customer's verbatim language** from `agency-context.md` §4 (Pain Points). The exact phrase the operator's customers use is more valuable than a polished paraphrase.
- **One idea per section.** Each section advances one argument. Build a logical flow down the page.
- **Two-line cap on headlines** (mobile measure, ~40-60 chars per line).
- **Three-sentence cap on subheadlines.**
- **Active voice over passive.** "We deliver the audit in 14 days" not "The audit is delivered in 14 days."
- **Confident, not qualified.** Cut "almost", "really", "very", "quite", "perhaps", "may help", "could potentially".
- **No exclamation points** in marketing copy. They read as desperate.
- **No emojis in headlines.** Restrained use in body copy is fine if the brand voice supports it.

---

## How this rule is enforced at runtime

### PostToolUse hook

`hooks/scan-forbidden-tokens.sh` runs on every `Write` and `Edit` tool use. If a forbidden hard-rule token appears in the written file, the hook exits non-zero and the agent must rewrite. Soft-rule warnings are logged but do not block.

### `qa-reviewer` gate before `/ship-it`

The QA agent does a full sweep:
1. Forbidden-token scan across all output files.
2. Lighthouse run on mobile + desktop emulation.
3. Schema.org validation via the official validator.
4. Playwright screenshots at 375px, 414px, 768px, 1024px, 1440px — visual diff against the design tokens.
5. Link check (no broken internal or external links).
6. Forms: every form is submitted with test data and the success state is captured.
7. CTAs: every primary CTA is clicked and the destination is verified.
8. TODO scan: any `<!-- TODO: ... DO NOT SHIP -->` blocks the deploy.

The QA agent does not have authority to *fix* — only to *block*. Fixes route back to the `conversion-copywriter` or `design-builder` agent.

---

## Why these rules

These rules are downstream of one observation: an agency website that converts at 4% of cold traffic is a different business than one that converts at 0.6%. The difference is not the tech stack. It is the doctrine encoded in the words on the page. Buzzwords cost money. Vague benefits cost money. Conflicting CTAs cost money. The doctrine exists to prevent that.

**Sources:** This doctrine is downstream of Donald Miller's StoryBrand framework (clarity over cleverness), Alex Hormozi's value equation ($100M Offers — specificity in the dream-outcome and proof-stack), and the page-cro skill in [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills/blob/main/skills/page-cro/SKILL.md).
