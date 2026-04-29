---
name: design-system
description: When an agent needs to enforce design tokens, alignment, type scale, or color discipline on a page or component. Triggers - "design tokens", "color palette", "spacing scale", "type system", "tailwind config", "shadcn theme", "alignment", "visual consistency", "brand colors". Loaded as a preloaded skill on the design-builder agent. Reads from design-system/tokens.json. Provides doctrine, not components — see component-library for actual blocks.
metadata:
  version: 0.1.0
---

# Design System

You are the design doctrine. Loaded as a preloaded skill on the `design-builder` agent. Your job is to ensure every page, component, and stylesheet respects the token system in `design-system/tokens.json`.

You don't write components — `component-library` does that. You enforce that whoever writes them uses the right colors, spacing, type scale, and radii.

## The contract

Single source of truth: `design-system/tokens.json`.

Tokens propagate to:
- `stacks/astro-marketing/tailwind.config.ts` (and similarly for Next.js)
- CSS variables on `:root` (consumed by shadcn primitives)
- Direct imports for component prop defaults

Agents NEVER hardcode hex codes, arbitrary px values, or fonts not in tokens.json.

## Token categories

```jsonc
{
  "color": {
    "neutral": { "50, 100, 200, ..., 900, 950": "..." },  // 11 stops
    "brand":   { "50, 100, ..., 950": "..." },             // 11 stops
    "success": { "500, 600, 100": "..." },
    "warning": { "500, 600, 100": "..." },
    "error":   { "500, 600, 100": "..." }
  },
  "font": {
    "heading": "Inter Tight, system-ui, sans-serif",
    "body":    "Inter, system-ui, sans-serif",
    "mono":    "Geist Mono, ui-monospace, monospace"
  },
  "fontSize": { "xs": "0.75rem", "sm": "0.875rem", ... "7xl": "4.5rem" },
  "spacing":  { "0": 0, "1": "4px", "2": "8px", ... "128": "512px" },
  "radius":   { "none": 0, "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "2xl": "24px", "full": "9999px" },
  "shadow":   { "sm, md, lg, xl, none": "..." }
}
```

## Industry overlays — token shifts

Industries can shift the brand-accent hue and font choices via `industries/{niche}/imagery.md`:

```yaml
brand-hue: indigo | emerald | rose | amber | slate | blue (default)
heading-font: <google-font-name>
body-font: <google-font-name>
radius-style: tight | rounded | very-rounded   # maps to md / xl / 2xl
imagery-style: real-photography | illustrated | abstract
```

Apply the overlay by:
1. Reading `industries/{niche}/imagery.md`.
2. Resolving the brand-hue to one of the 11-stop scales in `tokens.json` (curated set).
3. Updating `tailwind.config.ts` and the CSS variable definitions.
4. Re-emitting the design-tokens manifest.

Industries cannot:
- Add new tokens outside the scale.
- Override structural rules (4px grid, 5-state buttons, 3-color cap per block).

## Hard checks (the doctrine you enforce)

When `design-builder` writes a component / page, you run these checks before passing the file downstream:

### 1. No hardcoded colors

Reject any of:
- `#xxxxxx` hex codes in JSX/CSS (except in `tokens.json` itself)
- `rgb(...)` / `rgba(...)` literals
- Tailwind arbitrary color values like `bg-[#0066ff]`

Accept:
- Tailwind classes referencing the token palette (`bg-brand-500`, `text-neutral-700`)
- CSS variables (`var(--color-brand-500)`)

### 2. No arbitrary spacing

Reject:
- Tailwind arbitrary values like `p-[14px]`, `gap-[7px]`
- Inline `style={{ padding: '13px' }}`

Accept:
- Token-scale Tailwind classes (`p-3`, `gap-4`, `mt-12`)
- Token-scale CSS variables

### 3. Max 3 type sizes per breakpoint per block

A block (Hero, FeatureGrid, etc.) at any single viewport breakpoint can have at most 3 distinct text sizes. If you find yourself reaching for a 4th, the hierarchy is wrong — collapse two.

### 4. Max 3 colors visible per block

Excluding pure white, near-black neutrals, and brand-accent. Three semantic colors max in any single block.

### 5. Buttons have all 5 states

Default, hover, focus-visible, disabled, loading. shadcn's primitive button handles this; don't fight it. If a custom button is written, it implements all 5.

### 6. Alignment lives on the 4px grid

All spacing maps to a 4px base. Token spacing scale is `0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256` px (Tailwind classes `0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64`).

### 7. Body line length capped at 75 chars

Use `max-w-prose` (75ch) or `max-w-[65ch]` on body containers. Headings can be wider.

### 8. WCAG AA contrast

Body text on background ≥ 4.5:1. Large text (18pt+ or 14pt bold) ≥ 3:1. Brand-500 on white must clear 4.5:1. If not, the brand-hue shift in the industry overlay is wrong — pick a darker stop for body, lighter for backgrounds.

## How agents invoke this skill

`design-builder` reads this skill at startup (preloaded). Every component / page write triggers the checks above. Failures route back to the design-builder for rewrite.

Other agents (`conversion-copywriter`, `seo-strategist`) do not need to invoke this directly — they work in markdown / content; design enforcement happens when their content gets rendered into JSX/Astro by `design-builder`.

## Anti-patterns

- **"It's just one hex code."** No it isn't. One hex code becomes ten. Tokens or rejection.
- **Auto-generating Tailwind themes from "the brand color."** Curated 11-stop scales are in tokens.json. Don't run `chroma.js` and call it a palette.
- **Glassmorphism / heavy gradients / drop shadows on text.** They smell of "AI-generated 2022 design." `rules/design-system.md` lists these as anti-patterns.
- **Centered text everywhere.** Hero centered is fine; entire page centered is a slide deck.
- **6-column logo strips on mobile.** Mobile shows 2 logos at a time max. Use `SocialProof` block's responsive variant.

## References

- `references/token-resolution.md` — how `industries/{niche}/imagery.md` resolves to token shifts.
- `references/contrast-table.md` — WCAG AA contrast pairs for the curated brand-hue palettes.

## Related skills

- `component-library` — actual block implementations.
- `agency-context` — §9 visual identity feeds the token overlay.
- `storybrand-page`, `landing-page-funnel`, `seo-page` — consume the tokens via composed blocks.
