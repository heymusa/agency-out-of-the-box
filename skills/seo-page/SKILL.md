---
name: seo-page
description: When the user wants to generate SEO-driven content pages or run programmatic-SEO at scale - pillar pages, cluster pages, location-based pages, comparison/alternative pages. Triggers - "SEO page", "blog post", "pillar page", "cluster", "programmatic SEO", "city pages", "service-area pages", "competitor alternative page", "{X} vs {Y}". Outputs structured content with schema markup, internal-link suggestions, and real content fill from agency-context. For conversion-driven service pages, use storybrand-page instead.
metadata:
  version: 0.1.0
---

# SEO Page

You generate SEO-driven content pages — pages whose primary job is ranking organically and driving long-tail traffic, not directly converting cold visitors. The agency's content engine.

Three modes:

1. **Pillar / cluster** — long-form authoritative pages on a topic (3000-5000 words) plus supporting cluster pages (800-1500 words) that link back.
2. **Programmatic** — templated pages × data combinations (e.g., `dental-marketing-{city}`, where city loops over 240 zips).
3. **Comparison / alternative** — `{competitor} alternatives`, `{us} vs {them}`, `best {category} for {ICP}`.

## Workflow

### Step 1 — load context

Read `.agents/agency-context.md`. Required: §1, §2, §3, §6, §10 (Competitive Landscape).

Load `industries/{niche}/voice.md` and `industries/{niche}/proof-patterns.md`.

### Step 2 — determine the page type

Use `AskUserQuestion`:

> "What kind of SEO page?"
> - "Pillar (long-form authority)"
> - "Cluster (supporting topic page)"
> - "Programmatic batch (location × service)"
> - "Comparison / alternative"

Or accept the type as an argument from `/build-agency-site`.

### Step 3 — keyword + intent research

For pillar / cluster:
- Identify the target keyword (operator provides or research suggests).
- Determine intent (informational, commercial-investigative, transactional).
- Research the SERP — what's the dominant content type? (List, how-to, comparison, ultimate guide, tool.)
- Match intent. If SERP is informational, don't try to rank a sales page.

For programmatic:
- Get the data set (cities, services, ICPs, etc.) from operator or generate from context.
- Define the URL pattern (`/dental-marketing/{city-slug}/`).
- Confirm the data set has enough uniqueness per page to clear E-E-A-T thresholds (see hard rules below).

For comparison:
- The competitor list comes from agency-context §10.
- One page per competitor (or per category alternative).

### Step 4 — write the page

Page structure depends on type. All include:

- **H1** — the target keyword, naturally phrased.
- **Lead paragraph** — answer the searcher's question in the first 60 words.
- **Table of contents** for long-form (>2000 words).
- **Internal links** — at least 3 to related pages on the agency site.
- **External links** — 1-3 authoritative outbound (industry associations, government data, peer-reviewed).
- **Schema** — `Article` for posts, `FAQPage` for FAQ blocks, `Service` for service-anchored pages, `BreadcrumbList` for nav.
- **CTA** — contextual, not aggressive. Mid-page transitional CTA + final-section direct CTA.

#### Pillar / cluster structure
1. H1 + lead paragraph (answer fast).
2. Table of contents.
3. Subheadings (H2/H3) with one main idea per section.
4. Original data, frameworks, or research where possible.
5. Embedded media (charts, screenshots, original diagrams).
6. FAQ block (6-10 questions, schema-marked).
7. Author bio (E-E-A-T).
8. Internal-link block ("Related reading: ...").
9. CTA.

#### Programmatic structure (per page)
- H1 with the variable: "Dental Marketing in {City}, {State}"
- Lead paragraph WITH local-specific content (population, dental association mentions, ZIP-specific data — not just `${city}`).
- Service-area description.
- Local case study OR local pain-point reference (if available).
- Local trust signals (BBB chapter, local reviews count).
- Service-list with city-relevant pricing if available.
- FAQ specific to the city / region.
- Schema: `LocalBusiness` + `Service`.

#### Comparison structure
- H1: "{Us} vs {Them}: A {Year} Comparison" or "{N} Best Alternatives to {Them}"
- Lead paragraph: who this comparison is for.
- Comparison table (features × tools).
- Section per alternative with honest pros/cons.
- "When to choose {Us}" section (your ICP fit).
- "When to choose {Them}" section (their ICP fit) — be honest, builds trust.
- CTA.

### Step 5 — internal-link audit

Before publishing:
- This page links to ≥ 3 other agency pages.
- ≥ 2 other agency pages now link TO this page (`seo-strategist` updates the affected pages).
- All links use descriptive anchor text (no "click here").

### Step 6 — schema + meta

- `<title>` — keyword-front-loaded, 50-60 chars.
- `<meta name="description">` — 140-160 chars, includes keyword + benefit.
- Open Graph tags (image required, 1200×630).
- Schema.org JSON-LD (validated via the official validator before pass-through).

### Step 7 — render to stack

Default: `stacks/astro-marketing/src/content/blog/` for pillar/cluster, `src/pages/[city].astro` for programmatic.

Use Astro content collections for type-safe frontmatter. Use MDX for embedded components in long-form posts.

---

## Hard rules

### E-E-A-T uniqueness threshold

Every page (especially programmatic) must clear minimum uniqueness:

- **Title + H1**: locally / topically unique (no two pages share the same title).
- **Lead paragraph**: minimum 120 words of locally / topically unique content. No `${city}` template-string-only.
- **At least one specific local data point** per programmatic page: population, dental practice count, local association mention, regional regulation, named neighborhood, etc.
- **At least one local proof asset** OR explicit "We're new to {city}, here's what we've delivered for similar markets" honesty.

If a programmatic batch can't clear this threshold for a given segment, **skip that segment**. Don't publish thin pages — Google's helpful-content updates will detect them and penalize the whole site.

### No keyword stuffing

- Target keyword in H1 once, in title once, in lead paragraph once, in 1-2 H2s naturally. Never more.
- Synonyms and related terms throughout.
- Density target: 0.5-1.5%, not higher.

### No copy-paste from competitors

- The skill never duplicates competitor content. If you're tempted to rephrase a competitor's pillar page, write a better one with original data instead.

### Author + freshness signals

- Every long-form post has an author byline tied to a real person at the agency (founder by default, named team member if applicable).
- Updated-at date visible.
- For programmatic pages, "Reviewed for {city} on {date}" — and actually review them quarterly.

## Anti-patterns

- **Programmatic pages that are pure template fill.** Google calls this "doorway pages" and de-indexes them. Earn the rank.
- **Listicles where every entry is your own product.** "Best X tools" with you at #1 reads like a paid placement (because it is). Honest comparison wins long-term.
- **Pillar pages that read like SEO garbage.** Buyers can tell. Write for humans first; SEO second.
- **Stuffing FAQs with question-keywords from People-Also-Ask.** Use real questions your sales / support / customer-research has surfaced.

## References

- `references/keyword-intent-matching.md` — SERP intent classification rubric.
- `references/programmatic-uniqueness-checklist.md` — the full E-E-A-T threshold per page type.
- `references/schema-templates.md` — JSON-LD templates for Article / Service / FAQPage / LocalBusiness / BreadcrumbList.
- `references/internal-link-patterns.md` — pillar-cluster linking, hub-and-spoke, supporting-content patterns.

## Related skills

- `agency-context` — provides voice, proof, competitor list.
- `copy-frameworks` — provides headline patterns for SEO-titled pages.
- `component-library` — provides ContentLayout, FAQ, ProseSection blocks.
- `analytics-wiring` — instruments the page with conversion events.
- `storybrand-page` — for conversion-anchored pages (different intent).
