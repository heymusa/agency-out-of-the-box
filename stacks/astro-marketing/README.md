# Astro Marketing Stack

Default stack for service-agency marketing sites — homepage, services, about, case studies, pricing, blog. Used by `/build-agency-site` and `/new-client-site`.

## How this stack is structured (read first)

This directory does **not** contain a runnable Astro project. It contains:

- **`bootstrap.md`** — the canonical procedure for spinning up a fresh Astro project using the **current official `npm create astro@latest`**, then layering our overlay on top. Pinning framework versions inside this repo would rot in 60–90 days, so we don't.
- **`overlay/`** — the small set of files that are genuinely ours: a Tailwind tokens bridge, the `Layout.astro` (OG tags, Plausible, CTA tracking), a scaffold `index.astro` composed from `design-system/blocks/*`, `robots.txt`, favicon, hero placeholder.

When the `design-builder` agent runs `/build-agency-site`, it follows `bootstrap.md`:

```
npm create astro@latest      ← official, current versions
   ↓
npx astro add tailwind mdx sitemap   ← official integrations
   ↓
copy overlay/ on top         ← our opinions
   ↓
populate from agency-context ← real content from operator's data
```

## Why Astro

- Zero-JS by default — fast LCP, clean Lighthouse scores.
- File-based routing.
- MDX content collections for blog / case studies.
- Image optimization via `astro:assets`.
- Sitemap + robots auto-generation via `@astrojs/sitemap`.

## Quickstart (manual operator run)

```bash
# 1. Bootstrap a fresh Astro project (current Astro version, official flow)
npm create astro@latest -- --template minimal --typescript strict --install --no-git ./output/agency-site

# 2. Add official integrations
cd ./output/agency-site
npx astro add tailwind mdx sitemap --yes

# 3. Apply our overlay
cp -R ../../stacks/astro-marketing/overlay/. ./
ln -s ../../design-system ./design-system

# 4. Run
npm run dev    # http://localhost:4321
```

The `design-builder` agent does steps 1–3 automatically. See `bootstrap.md` for full detail and the `tsconfig.json` patch.

## Token + design system

The overlay's `tailwind.config.ts` imports `../../design-system/tokens.json` and resolves the active brand hue. Block components live at `design-system/blocks/*.astro` and are imported via the `@design-system/*` path alias.

To switch the brand-hue (e.g., from blue to emerald):

1. Update `industries/{niche}/imagery.md` to set `brand-hue: emerald`.
2. Update `tailwind.config.ts` line `const ACTIVE_BRAND_HUE = 'emerald';`.
3. Restart `npm run dev` — Tailwind regenerates with the emerald palette.

The `design-builder` agent does this automatically from `agency-context.md` §9.

## What lives in the overlay

```
overlay/
├── astro.config.mjs              # integrations + prefetch + static output
├── tailwind.config.ts            # token bridge (resolves design-system tokens)
├── src/
│   ├── layouts/Layout.astro      # shared layout: OG tags, Plausible, CTA tracking
│   └── pages/index.astro         # reference homepage scaffold (TODO-gated; QA blocks shipping it)
└── public/
    ├── robots.txt
    ├── favicon.svg               # default — replace with real brand favicon
    └── images/hero-placeholder.svg
```

## Output target (after `/build-agency-site`)

The agent populates these paths inside the bootstrapped project:

- `src/pages/index.astro`
- `src/pages/services/index.astro` and `src/pages/services/{slug}.astro`
- `src/pages/about.astro`
- `src/pages/pricing.astro`
- `src/pages/case-studies/index.astro` and `src/pages/case-studies/{slug}.astro`
- `src/pages/contact.astro`
- `src/content/blog/{slug}.mdx`

For `/new-client-site`, the same overlay is applied to a fresh project under `output/clients/{slug}-site/`.

## Deploy

Default: Vercel.

```bash
vercel deploy --prod
```

Alternates: Cloudflare Pages (`npx wrangler pages deploy ./dist`), Netlify, Fly.io static.
