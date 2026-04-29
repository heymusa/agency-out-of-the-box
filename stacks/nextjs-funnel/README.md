# Next.js Funnel Stack

For interactive paid-traffic funnels — single-page LPs with UTM personalization, multi-step funnels with Server Actions, quizzes, VSLs, applications.

Used by `/new-landing-page` and `/new-funnel`.

## How this stack is structured (read first)

Like the Astro stack, this directory does **not** contain a runnable Next.js project. It contains:

- **`bootstrap.md`** — the canonical procedure for spinning up a fresh Next.js project using the **current official `create-next-app`**, then layering our overlay.
- **`overlay/`** — the small set of files that are genuinely ours: Tailwind tokens bridge, `next.config.ts` with our defaults, root layout (Plausible + CTA tracking), scaffold landing page, default lead Server Action with Zod, thank-you page, robots.

```
npx create-next-app@latest    ← official, current versions
   ↓
npm install zod react-hook-form ...   ← only the deps we add on top
   ↓
copy overlay/ on top          ← our opinions
   ↓
populate from agency-context  ← real campaign brief from operator
```

## Why Next.js (and not Astro)

Astro is the right choice for content-heavy SEO sites (`stacks/astro-marketing`). Next.js earns its place when the page needs:

- Server Actions for form submission with Zod validation.
- Dynamic personalization (UTM-driven headline swaps via `searchParams`).
- Multi-step state management between funnel steps.
- Real-time payment / booking integration.
- Edge-rendered geo / device personalization.

If you don't need any of those, prefer the Astro stack — it's faster.

## Quickstart (manual operator run)

```bash
# 1. Bootstrap with the current official Next + Tailwind setup
npx create-next-app@latest --typescript --tailwind --app --no-src-dir --eslint --no-git \
  --import-alias "@/*" ./output/funnel-site

# 2. Add the deps our scaffold uses
cd ./output/funnel-site
npm install zod react-hook-form @hookform/resolvers clsx lucide-react

# 3. Apply our overlay
cp -R ../../stacks/nextjs-funnel/overlay/. ./
ln -s ../../design-system ./design-system

# 4. Run
npm run dev    # http://localhost:3000
```

The `design-builder` agent does steps 1–3 automatically. See `bootstrap.md` for the `tsconfig.json` patch and env-var checklist.

## Token + design system

The overlay's `tailwind.config.ts` imports `../../design-system/tokens.json` — the same tokens the Astro stack uses, so brand stays consistent between the agency site and its funnels.

The `design-system/blocks/*.astro` work directly in Astro. For Next.js, the `design-builder` agent generates `.tsx` mirrors of any block on first use (Hero, SocialProof, FeatureGrid, Pricing, FAQ, CTABanner, Footer all have JSX equivalents).

## What lives in the overlay

```
overlay/
├── next.config.ts             # strict mode, AVIF/WebP, typed routes, transpilePackages
├── tailwind.config.ts         # token bridge
├── app/
│   ├── layout.tsx             # root layout: OG, Plausible, CTA tracking
│   ├── page.tsx               # reference LP scaffold (TODO-gated)
│   ├── globals.css            # Tailwind + heading/body font wiring
│   ├── actions/lead.ts        # default lead Server Action (Zod-validated)
│   └── thank-you/page.tsx     # fires lead_submitted event
└── public/
    └── robots.txt             # disallows /thank-you/
```

## Environment variables

The `analytics-wiring` skill writes `.env.local`:

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — Plausible domain.
- `RESEND_API_KEY` *or* `FORMSPREE_PROJECT_ID` — for lead delivery.
- `CALCOM_USERNAME` *or* `CALCOM_LINK` — booking embed.

## Multi-step funnel pattern

`/new-funnel` outputs into `app/funnels/{name}/`:

- `app/funnels/{name}/page.tsx` — step 1.
- `app/funnels/{name}/step-2/page.tsx`, `step-3/page.tsx`, …
- `app/funnels/{name}/actions.ts` — step-specific Server Actions and qualification logic.
- `app/funnels/{name}/_components/StepShell.tsx` — shared progress bar + back button.

Form data persists across steps via URL `searchParams` (no PII) plus `localStorage` fallback. Every step transition fires `funnel_step_advanced` analytics.

## Deploy

Default: Vercel.

```bash
vercel deploy --prod
```
