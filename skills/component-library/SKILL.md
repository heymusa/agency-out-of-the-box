---
name: component-library
description: When an agent needs to compose a page from prebuilt blocks instead of writing JSX/Astro from scratch. Triggers - "build the hero", "add a pricing block", "feature grid", "compose page", "block library", "page sections". Provides the catalog of available blocks (Hero, SocialProof, FeatureGrid, Pricing, FAQ, CTABanner, Footer) under design-system/blocks/. Loaded as a preloaded skill on design-builder. Page-gen skills compose pages from these — they do NOT write components inline.
metadata:
  version: 0.1.0
---

# Component Library

You are the catalog. When `design-builder` (or `storybrand-page`, `landing-page-funnel`, `seo-page` via `design-builder`) needs a section of a page, you tell them which block to import and what props to pass.

The blocks live at `design-system/blocks/`. Each is a real, production-quality `.astro` (and `.tsx` for Next.js use) component with sensible defaults, full prop typing, and built-in token-binding. They are NOT examples — they are the ones we ship.

## The catalog

### Hero — `design-system/blocks/Hero.astro`
Three variants:
- `centered` — single-column, headline + subheadline + CTA stack, optional image below.
- `split` — 50/50 left content, right image (or video).
- `asymmetric` — 60/40 left content, right image, with a colored accent panel behind the image.

Props:
```ts
{
  variant: 'centered' | 'split' | 'asymmetric',
  headline: string,
  subheadline?: string,
  primaryCta: { label: string, href: string },
  secondaryCta?: { label: string, href: string },  // transitional
  image?: { src: string, alt: string },           // real images only — never AI-generated stock
  trustBar?: { label: string, items: string[] }   // optional logo strip OR metric stat
}
```

### SocialProof — `design-system/blocks/SocialProof.astro`
Three variants:
- `logos` — 4-6 client logo strip with optional headline ("Trusted by:").
- `quote` — single attributed testimonial with photo + name + role + company.
- `metrics` — 3-up metric grid (e.g., "47% avg. lift", "14 practices", "9 states").

Props:
```ts
{
  variant: 'logos' | 'quote' | 'metrics',
  heading?: string,
  logos?: { src: string, alt: string, href?: string }[],
  quote?: { text: string, author: { name: string, role: string, company: string, photo?: string } },
  metrics?: { value: string, label: string }[]   // exactly 3 items
}
```

### FeatureGrid — `design-system/blocks/FeatureGrid.astro`
Three variants:
- `cards-3up` — 3 cards in a row, each with icon + heading + body + (optional) link.
- `alternating` — alternating left-right rows; image one side, content the other.
- `icon-row` — icon + 1-line heading + 1-sentence body, dense 4-up grid.

Props:
```ts
{
  variant: 'cards-3up' | 'alternating' | 'icon-row',
  heading: string,
  subheading?: string,
  features: {
    icon?: string,            // lucide-react icon name
    heading: string,
    body: string,             // FAB-format: feature → advantage → benefit
    href?: string,
    image?: { src: string, alt: string }   // for alternating variant
  }[]
}
```

### Pricing — `design-system/blocks/Pricing.astro`
Two variants:
- `compare-3` — 3-tier comparison with "Recommended" badge on the middle tier.
- `single-card` — single-tier with full bonus stack and guarantee.

Props:
```ts
{
  variant: 'compare-3' | 'single-card',
  heading: string,
  subheading?: string,
  guarantee?: { label: string, body: string },
  tiers: {
    name: string,
    price: string,                // formatted: "$3,500/mo"
    setup?: string,               // optional one-time
    description: string,
    features: string[],           // bullets
    bonuses?: { label: string, anchorValue: string }[],
    cta: { label: string, href: string },
    recommended?: boolean
  }[]
}
```

### FAQ — `design-system/blocks/FAQ.astro`
Accordion. Includes JSON-LD `FAQPage` schema markup automatically.

Props:
```ts
{
  heading: string,
  items: { question: string, answer: string }[]   // 6-10 items recommended
}
```

### CTABanner — `design-system/blocks/CTABanner.astro`
Full-width call-to-action band. Used between major sections and as the final CTA before the footer.

Props:
```ts
{
  heading: string,
  body?: string,
  primaryCta: { label: string, href: string },
  secondaryCta?: { label: string, href: string },
  variant?: 'solid-brand' | 'subtle' | 'inverse'   // default: solid-brand
}
```

### Footer — `design-system/blocks/Footer.astro`
Full footer. Sitemap, legal links, social, address (if local business). Pulls org details from `agency-context.md` §1 + §13 + §12.

Props:
```ts
{
  org: { name: string, address?: string, phone?: string, email?: string },
  sitemap: { heading: string, links: { label: string, href: string }[] }[],
  social?: { platform: 'linkedin' | 'twitter' | 'instagram' | 'youtube', href: string }[],
  legal: { links: { label: string, href: string }[] }   // privacy, terms, etc.
}
```

## How to use

When a page-gen skill (`storybrand-page`, `landing-page-funnel`, `seo-page`) needs a section, it consults this catalog and:

1. Picks the right block + variant.
2. Constructs the props from `agency-context.md` + skill-specific copy.
3. Imports the block into the page file.
4. Composes — never duplicates the block's internals.

Example (in `storybrand-page`):

```astro
---
import Hero from '@design-system/blocks/Hero.astro';
import SocialProof from '@design-system/blocks/SocialProof.astro';
import FeatureGrid from '@design-system/blocks/FeatureGrid.astro';
import Pricing from '@design-system/blocks/Pricing.astro';
import FAQ from '@design-system/blocks/FAQ.astro';
import CTABanner from '@design-system/blocks/CTABanner.astro';
import Footer from '@design-system/blocks/Footer.astro';
---

<Hero variant="split" headline="..." subheadline="..." primaryCta={{...}} />
<SocialProof variant="metrics" metrics={[...]} />
<FeatureGrid variant="cards-3up" heading="..." features={[...]} />
<Pricing variant="single-card" heading="..." tiers={[...]} guarantee={{...}} />
<FAQ heading="..." items={[...]} />
<CTABanner heading="..." primaryCta={{...}} />
<Footer org={...} sitemap={...} legal={...} />
```

## Adding a new block

If a page needs a section that no existing block covers, **add the block to `design-system/blocks/`**. Don't write it inline in the page.

Process:
1. Create `design-system/blocks/{BlockName}.astro` (and `.tsx` for Next.js mirror).
2. Implement with token-bound styling (no hardcoded colors / spacing).
3. Cover the 5 button states if it has buttons.
4. Add a Storybook entry (`design-system/blocks/{BlockName}.stories.tsx`) with at least 2 variants.
5. Add the block to this catalog with prop typing.
6. Commit. Then use it.

## Hard rules

- **Pages compose; pages do not implement.** A page file under `stacks/*/src/pages/` or `stacks/*/app/` cannot define a new visual primitive. It only imports.
- **Token-bound only.** No hardcoded styles. The `design-system` skill checks this on every write.
- **Real images only.** Block props that take an image require a real image path (or marked TODO). No AI-generated stock.

## Anti-patterns

- **Building a custom hero "just for this page."** It becomes a maintenance nightmare. Add a Hero variant or use `asymmetric`.
- **Forking a block to tweak one thing.** Make the block more flexible via props instead.
- **Inline `<div className="bg-blue-500 p-4 ...">` ad-hoc card patterns.** That's a missing block. Add it to the library.

## Related skills

- `design-system` — token enforcement, the doctrine these blocks adhere to.
- `storybrand-page`, `landing-page-funnel`, `seo-page` — primary consumers.
- `agency-context` — provides org / proof / offer data that gets passed as props.
