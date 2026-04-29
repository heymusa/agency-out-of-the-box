# Next.js Funnel Stack — Bootstrap Procedure

> **Why this file exists.** Same reason as the Astro stack — pinning Next.js / React / Tailwind versions inside this repo guarantees decay. We use the **official `create-next-app`** at init time and apply our overlay on top. Our overlay carries only what is genuinely ours: Tailwind token bridge, root layout with Plausible + tracking delegation, the lead-submission Server Action, scaffold pages.
>
> The `design-builder` agent runs this procedure when `/new-landing-page` or `/new-funnel` first scaffolds a Next.js project.

## Step 1 — scaffold a fresh Next.js project

Run the **current official Next init** (don't pin versions in this repo):

```bash
npx create-next-app@latest \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --eslint \
  --no-git \
  --import-alias "@/*" \
  ./output/funnel-site
```

Flags explained:
- `--typescript` — matches the typed lead-action and form schemas.
- `--tailwind` — the official scaffold installs Tailwind with the current correct integration (Tailwind 4 + `@tailwindcss/postcss` as of late 2025; `create-next-app` keeps this current).
- `--app` — App Router. Required for our Server Actions in `app/actions/lead.ts`.
- `--no-src-dir` — overlay paths use `app/` directly (not `src/app/`).
- `--no-git` — parent toolkit owns git.

The agent should **not** hardcode a Next major version. If a future `create-next-app` flips defaults (e.g., Turbopack-only, or new flag names), update this file's flags rather than vendoring a `package.json`.

## Step 2 — add the runtime deps the funnel scaffold needs

`create-next-app` ships with React + Next + Tailwind. Our scaffold adds:

```bash
cd ./output/funnel-site
npm install zod react-hook-form @hookform/resolvers clsx lucide-react
```

These exist for:
- **`zod`** — schema validation in the Server Action.
- **`react-hook-form` + `@hookform/resolvers`** — multi-step funnel form state.
- **`clsx`** — class composition.
- **`lucide-react`** — icon set used by FeatureGrid / Pricing blocks.

If you're building a **single-step LP** (one form, one CTA), you can skip `react-hook-form` and use the native `<form action={submitLead}>` pattern. The lead action supports both.

## Step 3 — apply the overlay

```bash
# from the toolkit repo root
cp -R stacks/nextjs-funnel/overlay/. ./output/funnel-site/

# Make the shared design-system reachable (symlink so block edits propagate)
ln -s ../../design-system ./output/funnel-site/design-system
```

Overlay contents:

| Overlay file | Purpose |
|---|---|
| `next.config.ts` | Strict mode, AVIF/WebP, typed routes, `transpilePackages` for shared design-system. |
| `tailwind.config.ts` | Token bridge — same `tokens.json` as the Astro stack so brand stays consistent across funnels and the agency site. |
| `app/layout.tsx` | Root layout: OG tags, Plausible, font preconnect, `cta_clicked` delegation. |
| `app/page.tsx` | Scaffold LP — single-CTA hero + final CTA, full TODO markers. |
| `app/globals.css` | Tailwind directives + heading/body font wiring. |
| `app/actions/lead.ts` | Default lead-submission Server Action with Zod schema. Funnels extend the schema per-step. |
| `app/thank-you/page.tsx` | Default thank-you page (fires `lead_submitted` event). |
| `public/robots.txt` | Disallow `/thank-you/`, allow root. |

## Step 4 — wire the design-system path alias

Patch the freshly-bootstrapped `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@design-system/*": ["./design-system/*"]
    }
  }
}
```

The `design-builder` agent merges this rather than overwriting, to preserve whatever defaults `create-next-app` picked.

## Step 5 — verify

```bash
cd ./output/funnel-site
npm run dev      # http://localhost:3000 — should render the scaffold
npm run build    # type-check + production build
```

## Step 6 — environment variables

Funnels typically need:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible domain — read at build time, replaces `data-domain`. |
| `RESEND_API_KEY` *or* `FORMSPREE_PROJECT_ID` | Lead delivery integration. |
| `CALCOM_USERNAME` *or* `CALCOM_LINK` | Booking integration. |

The `analytics-wiring` skill prompts for these via `AskUserQuestion` and writes them into `.env.local`.

## Step 7 — pre-`/ship-it` checklist

- [ ] `agency-context.md` §13 filled.
- [ ] `.env.local` has the analytics + form keys.
- [ ] No `<!-- TODO: ... DO NOT SHIP -->` markers remain.
- [ ] Lead action posts to a real destination (CRM / Resend / Composio), not just `console.info`.

## Multi-step funnel pattern

`/new-funnel` writes additional files into `app/funnels/{name}/`:

- `app/funnels/{name}/page.tsx` — step 1.
- `app/funnels/{name}/step-2/page.tsx`, `step-3/page.tsx`, ...
- `app/funnels/{name}/actions.ts` — step-specific Server Actions and qualification logic.
- `app/funnels/{name}/_components/StepShell.tsx` — shared progress bar + back button.

Form data persists across steps via URL `searchParams` (no PII) plus `localStorage` fallback. Every step transition fires `funnel_step_advanced` analytics.

## What this overlay does NOT bring

- **No Next.js / React version pin.** We trust `create-next-app` to pick the current LTS.
- **No `package.json`, `tsconfig.json`, `postcss.config.*`, `.gitignore`.** All generated fresh.

The overlay stays small and ages slowly.
