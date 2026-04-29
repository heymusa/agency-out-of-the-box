# Design System

Tokens, primitives, and blocks shared across all stacks (`stacks/astro-marketing/`, `stacks/nextjs-funnel/`, and any future stacks).

## Layout

```
design-system/
├── tokens.json              Source of truth for color / type / spacing / radius / shadow
├── primitives/              Lowest-level UI atoms (Button, Input, Card, Section, Container, Badge)
└── blocks/                  Page-level compositions (Hero, SocialProof, FeatureGrid, Pricing, FAQ, CTABanner, Footer)
```

## How tokens flow

- `tokens.json` is the source of truth.
- Each stack reads the tokens via its `tailwind.config.ts` (which imports `tokens.json` and maps it to Tailwind's theme).
- shadcn-style CSS variables on `:root` consume the same tokens for primitive theming.
- Industry overlays in `industries/{niche}/imagery.md` may shift the brand-hue (one of the curated 6 in tokens) and fonts; the toolkit never goes off-scale.

## Block ↔ stack compatibility

Blocks are written in `.astro` (the canonical form). Each block also has a `.tsx` mirror for use in the Next.js stack. Both implementations use the same prop signatures.

When `design-builder` composes a page, it picks the matching extension based on the target stack:
- Astro stack → `import Hero from '@design-system/blocks/Hero.astro';`
- Next.js stack → `import Hero from '@design-system/blocks/Hero.tsx';`

## Adding a new block

1. Create `design-system/blocks/{BlockName}.astro` AND `design-system/blocks/{BlockName}.tsx`.
2. Implement with token-bound styling — no hardcoded hex / px / fonts.
3. Cover all 5 button states for any contained buttons.
4. Add prop typing (TypeScript types alongside the .tsx).
5. Update `skills/component-library/SKILL.md` catalog with the new block + props signature.
6. Commit. Then it's available for use.

## Anti-patterns

See `rules/design-system.md` for the full anti-pattern list. Highlights:
- No glassmorphism / heavy gradients / drop shadows on text.
- No centered text everywhere (hero centered fine; whole page centered = slide deck).
- No 6-column logo strips on mobile.
- No animated background gradients.
- No auto-playing video with sound.
