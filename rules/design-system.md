---
paths:
  - "stacks/**/*.tsx"
  - "stacks/**/*.jsx"
  - "stacks/**/*.astro"
  - "stacks/**/*.css"
  - "design-system/**"
---

# Design System Doctrine

Loaded whenever an agent touches a component, page, or stylesheet. Enforces token discipline and structural alignment so every artifact looks like it came from one designer, not five different AI runs.

---

## The token contract

The single source of truth is `design-system/tokens.json`. Agents read tokens via:
- Tailwind config (`stacks/*/tailwind.config.ts` references the same tokens)
- CSS variables on `:root` (for shadcn primitive overrides)
- Direct import (for component prop defaults)

**Never hardcode** colors, spacing, font sizes, radii, or shadows. Use tokens.

```tsx
// ✗ Wrong — hardcoded
<div className="p-[14px] text-[15px] bg-[#0066ff]">

// ✓ Right — token-bound
<div className="p-3 text-sm bg-brand-500">
```

---

## Color discipline

- **6 neutrals** scaled `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. These cover backgrounds, borders, text-secondary, text-primary.
- **1 brand accent**, scaled identically. Use `500` as the on-screen brand. `600` for hover. `100` for tinted backgrounds.
- **3 semantic colors**: `success`, `warning`, `error`. Used for state — never as the primary brand expression.
- No more than **3 colors visible in any single block** (excluding white / near-black neutrals).
- Industry overlays in `industries/{niche}/` may shift the brand-accent hue, but cannot expand the palette.

---

## Spacing discipline (4px grid)

All spacing maps to a 4px base. Tailwind's spacing scale already does this — use it.

Allowed: `p-0, p-1, p-2, p-3, p-4, p-6, p-8, p-12, p-16, p-24, p-32, p-48, p-64, p-96, p-128`.

**Never use arbitrary values** like `p-[7px]` unless documented in `tokens.json`. If you find yourself reaching for an arbitrary spacing, the layout is wrong.

Section vertical padding pattern:
- Tight (within a card): `py-6` mobile, `py-8` desktop.
- Standard (a section): `py-16` mobile, `py-24` desktop.
- Hero / large (above-the-fold): `py-24` mobile, `py-32 lg:py-40` desktop.

---

## Type scale

Two fonts max: one heading, one body. Mono optional for code blocks.

Type scale (from tokens, mapped to Tailwind):
- `text-xs` (12px) — fine print, captions
- `text-sm` (14px) — body small, labels
- `text-base` (16px) — body default
- `text-lg` (18px) — body large, lead paragraphs
- `text-xl` (20px) — small headings
- `text-2xl` (24px) — H4
- `text-3xl` (30px) — H3
- `text-4xl` (36px) — H2
- `text-5xl` (48px) — H1 mobile / H2 desktop
- `text-6xl` (60px) — H1 desktop standard
- `text-7xl` (72px) — H1 hero

**Per breakpoint, max 3 type sizes visible.** Don't mix `text-xl`, `text-2xl`, `text-3xl`, `text-4xl` in one viewport — pick three.

Headings:
- Tight tracking (`tracking-tight`).
- Bold or extrabold (`font-bold` or `font-extrabold`).
- Mobile cap: 2 lines.
- Desktop cap: 3 lines.

Body:
- `leading-relaxed` for paragraphs (1.625).
- Max 75 characters per line on body (`max-w-prose` or `max-w-[65ch]`).
- Color: neutral-700 on light, neutral-200 on dark (not pure black/white — too high contrast).

---

## Radius scale

Allowed: `rounded-none, rounded-sm (4px), rounded-md (8px), rounded-lg (12px), rounded-xl (16px), rounded-2xl (24px), rounded-full`.

Pick one as the project's "card radius" (typically `rounded-xl`) and use it consistently. Buttons can be 1 step tighter (`rounded-lg` if cards are `rounded-xl`).

---

## Buttons — full state coverage

Every button must define five states. shadcn's `Button` primitive does this; don't fight it.

- **default** — base style
- **hover** — slight darken or accent shift
- **focus-visible** — ring (token-bound), 2px offset
- **disabled** — `opacity-50, cursor-not-allowed`, all interaction stripped
- **loading** — spinner + disabled + no double-submit (Button has a `loading` prop in our wrapper)

Hierarchy:
- **Primary** — solid brand-500, white text. One per viewport.
- **Secondary** — outline, brand-700 text. Used for "transitional" CTAs.
- **Ghost** — text-only, brand-700. Used in nav and inline links.
- **Destructive** — solid error-600. Reserved for confirm-delete flows.

CTA button width:
- Mobile: full-width inside its container (`w-full`).
- Desktop: auto-width with `px-6` minimum, `px-8` standard.

---

## Composition — assemble blocks, don't write components

For pages, **always compose from `design-system/blocks/`**. The block library is:

- `Hero` — three variants (centered, split, asymmetric)
- `SocialProof` — three variants (logo strip, single quote, metric grid)
- `FeatureGrid` — three variants (3-up cards, 2-up alternating, icon row)
- `Pricing` — two variants (3-tier compare, single-card)
- `FAQ` — accordion
- `CTABanner` — full-width call-to-action band
- `Footer` — full footer with sitemap, legal, social, address

If a block doesn't exist in the library and you need one, **add it to the library** rather than building it inline in a page. Pages are compositions; blocks are the components.

---

## Industry overlay — color and font flex

`industries/{niche}/imagery.md` may declare:
- `brand-hue: <name>` — references a curated set (default: blue; alternates: emerald, slate, indigo, amber, rose).
- `heading-font: <google-font-name>` — alternate heading font (the default Inter Tight stays unless overridden).
- `body-font: <google-font-name>` — body font (default Inter stays unless overridden).
- `radius-style: tight | rounded | very-rounded` — maps to `md | xl | 2xl` for cards.
- `imagery-style: real-photography | illustrated | abstract`.

Overlays cannot:
- Add new tokens outside the scale.
- Add new block variants (only the central block library can).
- Override doctrine rules (e.g., still need 5-state buttons, still need 4px grid).

---

## Anti-patterns (do not do these)

- **Glassmorphism / heavy gradients / drop shadows on text.** They smell of "AI-generated tribute to 2022 design Twitter."
- **Centered text everywhere.** Hero centered is fine; entire page centered reads as a slide deck.
- **Stock-photo hero with happy diverse team in glass office.** It is a tell. Use real founder / team / process photos. If unavailable, use abstract or illustration, not stock.
- **Animated background gradients.** They tax the GPU and rarely pay for it.
- **Cookie-banner that covers the hero.** Use a slim bottom-anchored bar. Don't break the hero.
- **Auto-playing video with sound.** Mute by default; muted videos can autoplay.
- **6-column logo strips on mobile.** Mobile shows 2 logos at a time max.

---

## How this rule is enforced

The `design-builder` agent has this rule preloaded via the `design-system` skill. Every component it writes goes through:

1. **Token check.** Grep for hex codes, arbitrary px values, or fonts not in `tokens.json`. Fail on first match.
2. **Block-composition check.** Page files (under `stacks/*/src/pages/` or `stacks/*/app/`) cannot define new visual primitives — they must import from `design-system/blocks/` and `design-system/primitives/`.
3. **State-coverage check.** Buttons that lack focus-visible or disabled state are flagged.
4. **Visual diff via Playwright** (during `/ship-it` QA): screenshots at 5 viewports compared against the design-tokens spec sheet.

If `design-builder` finds itself wanting to break a rule, it must surface the trade-off to the operator via `AskUserQuestion` rather than silently violating.
