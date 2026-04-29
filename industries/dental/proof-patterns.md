# Proof Patterns — Dental Marketing

What credible social proof looks like for a dental marketing agency. Loaded by `conversion-copywriter` and `seo-strategist` to know what kind of proof to ask for from `agency-context.md §11` and how to render it.

## Hierarchy of proof (most → least persuasive)

1. **Owner-dentist video testimonial** with the practice visible behind them. Specific numbers ("we went from 18 to 32 net-new patients per month over 6 months").
2. **Written attributed testimonial** with photo + practice name + location.
3. **Case study with redacted financials** — explicit metrics with consent.
4. **Aggregate metrics** ("47% avg. new-patient lift across 14 practices in 9 states").
5. **Peer endorsements** in dental community publications / podcasts (Dental Economics, Dentaltown, Mark Costes Dentalpreneur).
6. **Certifications / partnerships** (Google Partner, Meta Business Partner, ADA partner status if applicable).
7. **Logo strip** — practice logos with permission. Anonymized "Top 10 dental practices we work with" doesn't move the needle.

## What buyers find persuasive

### Specific & verifiable
- "Dr. Sarah Chen — Westlake Dental, Austin TX. Went from 22 net-new/mo to 38 net-new/mo over 4 months. New-patient revenue lifted from $84k/mo to $137k/mo."
- "Dr. Marcus Patel — Patel Family Dentistry, Tampa FL. Top-3 organic ranking for 'Tampa dental implants' in 7 months. Reduced Google Ads spend from $8k/mo to $2.4k/mo while maintaining inquiry volume."

### Aggregate but anchored
- "14 practices currently in active engagement across 9 states."
- "Average net-new patient increase: 47% in 90 days."
- "Average reduction in Google Ads spend (post-SEO maturity): 64%."

### Industry-specific authority
- "Founder Dr. {Name} ran a 12-op family practice in {City} for 9 years before building this."
- "Featured in Dental Economics Q3 2024 issue — 'The end of PPO-only practices.'"

## What buyers find suspicious (avoid)

### Fabricated patterns
- "Sarah J., dentist." — no full name, no practice, no city = invented.
- "Top 1% of dental marketers nationally." — undefined ranking, immediate skepticism.
- "Helping dentists since 2015." — unless 2015 is real, don't.

### Unattributed metrics
- "Most of our clients see growth." — meaningless.
- "Up to 300% ROI." — "up to" is the dead-giveaway.

### Stock testimonial photos
- Smiling young couple in suits in front of a window. Buyers know.

### Self-superlative claims
- "The #1 dental marketing agency." — most state dental boards prohibit superlative advertising even by service vendors. Definitely won't fly in copy aimed at dentists.
- "Best in the industry." Same.

## Standard social-proof block placements

Per the StoryBrand structure, social proof appears at these locations on a dental agency site:

1. **Above-the-fold trust micro-bar** — logo strip OR aggregate metric ("Trusted by 14 practices across 9 states").
2. **After the problem block** — single attributed testimonial that speaks to the specific pain.
3. **Mid-page metrics block** — 3-up metrics grid.
4. **Pre-pricing reinforcement** — case-study snippet with metrics.
5. **Case studies index page** — full library, filterable by practice size / pain solved.
6. **Final CTA reinforcement** — owner-dentist video testimonial, optional.

## Case-study format

When the agency has a case study, render it on `/case-studies/{slug}/` using this structure:

```markdown
# {Practice Name}, {City}

> "{Pull-quote from owner-dentist, specific outcome}"
> — Dr. {Last Name}, owner

## Background
- Practice size: {N ops, $X annual collections}
- Stage: {established / acquired / new owner / retiring transition}
- Primary pain: {specific from §4 of agency-context}

## What we did
1. {Workstream 1 with timeline}
2. {Workstream 2 with timeline}
3. {Workstream 3 with timeline}

## Results (period: {dates})
- Net new patients/mo: {before} → {after} ({% lift})
- New-patient revenue: ${before}/mo → ${after}/mo
- Google Ads spend: ${before}/mo → ${after}/mo
- Hygiene schedule density: {before}% → {after}%
- Other metric specific to engagement

## What's next
- {Continued retainer / new initiatives}
```

Every case study must include:
- A real photo (owner-dentist, practice, or both).
- Real metrics (redact dollar figures with consent if needed; use %% deltas always).
- A direct CTA to "Book a strategy call to see if we can deliver similar results for your practice."

## Trust-language patterns

For the trust micro-bar under the hero:

Strong:
- "Trusted by 14 fee-for-service practices across 9 states."
- "8 of our clients have ranked top-3 organic locally in 9-12 months."

Weak:
- "Trusted by dentists everywhere."
- "Industry leader."

For the about page:

Strong:
- "{Founder name} is a former practice owner — 9 years running Westlake Family Dentistry, $3.2M in collections, 12 ops, before transitioning to dental marketing in 2023."

Weak:
- "Our team is passionate about helping practices grow."

## Compliance — proof must respect

- HIPAA: no patient PHI in any case study. Practice names yes (with consent); patient names never.
- State dental boards: no "best" / "#1" claims (see `compliance.md`).
- Patient testimonials: if a patient testimonial appears in a case study, it must include written patient release on file. Most state boards require visible disclosures: "Individual results may vary." Footnote near the testimonial.
