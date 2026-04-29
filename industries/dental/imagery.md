# Imagery — Dental Marketing

Visual cues, photography style, and design tokens for dental-niche agency sites and client deliverables. Loaded by `design-builder` to apply the niche overlay to `design-system/tokens.json`.

## Token overlay

```yaml
brand-hue: blue            # default. Alternate: emerald (for "wellness" positioning)
heading-font: "Inter Tight" # default. Alternate: "Manrope" or "Work Sans"
body-font: "Inter"          # default
radius-style: rounded       # cards rounded-xl. Alternate: tight (rounded-md) for more clinical feel
imagery-style: real-photography
```

The dental niche reads as **clinical, calm, trustworthy** — blue / slate-blue palette is the long-running default for the industry. Avoid:
- Bright reds / oranges (read as "alert" or "discount").
- Yellows (read as "kids dentistry" — fine if that's the sub-segment, otherwise off).
- Heavy gradients or glassmorphism (reads as 2022 design Twitter).

## Photography rules

### Use these
- **Real owner-dentist** in their actual practice, in scrubs. Casual but clinical. With consent.
- **The team during morning huddle.** Authentic, not staged.
- **Real operatory equipment** — chair, light, monitor, modern.
- **Process shots** — patient walking in, front-desk welcoming, hygienist with patient (with patient consent and visible disclosure).
- **Founder portrait** — warm, professional headshot. Shoulders+up. Plain or office background. Smiling not laughing.

### Avoid these
- **Stock photos of beautiful patients.** Detected immediately. Brand-poison.
- **AI-generated dentist with mega-watt smile.** Same.
- **Group of doctors all in white coats holding clipboards looking at camera.** Nobody believes this is real.
- **Tooth illustrations / 3D-rendered teeth as hero imagery.** Very 2010.
- **Before/after smile transformation photos** unless the practice has explicit patient consent + state-board-compliant disclosures. Risky territory.

## Color palette (default — blue)

Reads as: trustworthy, clinical, calm, professional.

- Primary: brand-600 (`#2563eb`).
- Hover: brand-700 (`#1d4ed8`).
- Brand-tint: brand-50 (`#eff6ff`) for soft-bg sections.
- Text primary: neutral-900 (`#18181b`).
- Text secondary: neutral-600 (`#52525b`).
- Backgrounds: white + neutral-50 alternating.

### Alternate — emerald (for "wellness" positioning)

For practices positioning around holistic / preventive / family-wellness angles:

- Primary: brand-600 (emerald `#059669`).
- Reads as: natural, growth, calm, family-oriented.

## Typography rules

- **Headings**: Inter Tight, font-extrabold (800), tracking-tight.
- **Body**: Inter, font-normal (400), leading-relaxed (1.625).
- **Numerals**: tabular-nums on data displays (pricing, metrics).
- **Avoid**: Times New Roman (clinical-but-old), Comic Sans (don't), display fonts (no Lobster, no Pacifico).

## Layout patterns

### Hero
- **Default variant**: split (50/50 with founder photo or process photo on the right).
- **Backup variant**: centered (when founder photo isn't available — replaced by trust micro-bar with metrics).

### Trust micro-bar (under hero)
- Logo strip if 4+ practice logos available with permission.
- Otherwise: 3-up metrics ("14 practices • 9 states • 47% avg. new-patient lift").

### Social proof block
- **Quote variant** preferred for dental: single owner-dentist quote with photo, practice name, location.
- 2-3 quotes placed throughout the page (after problem block, before pricing, near final CTA).

### Pricing block
- **Single-card variant** preferred for dental over compare-3.
- Comparison tables work for multi-tier service ladders (Standard / Plus / Comprehensive) but the single-card with bonus stack converts better at the dental-retainer price point.

### FAQ
- 8 questions. Tilt toward objection handling: PMS integration, HIPAA, contract terms, "I've been burned before," "what if it doesn't work?"

## Iconography

- **Lucide icons** at 20-32px, brand-600 color, in a brand-50 rounded-square background.
- Avoid stock-icon-pack medical icons (the tooth-with-checkmark is a tell).

## Don'ts (full list)

- Glassmorphism / frosted-glass effects.
- Animated background gradients.
- Auto-playing video with sound.
- Tooth illustrations as hero imagery.
- Stock dentist-and-patient photos.
- Before/after smile galleries without state-board-compliant disclosures.
- "Bright smile" / "perfect smile" / "smile of your dreams" copy.
- Multiple aspect ratios for portraits in the same page.
- 6-column logo strips on mobile (max 2 visible at once).

## Final note

The dental aesthetic is restrained on purpose. Owner-dentists are skeptical buyers — the look-and-feel signals the agency understands the audience. Nothing kills a dental agency site faster than design that screams "we work with crypto startups too."
