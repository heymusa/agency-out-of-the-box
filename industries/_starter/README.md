# Industries — Starter Template

Copy this folder to bootstrap a new niche overlay:

```bash
cp -r industries/_starter industries/{your-niche-slug}
$EDITOR industries/{your-niche-slug}/voice.md
$EDITOR industries/{your-niche-slug}/personas.md
$EDITOR industries/{your-niche-slug}/proof-patterns.md
$EDITOR industries/{your-niche-slug}/offers.md
$EDITOR industries/{your-niche-slug}/imagery.md
$EDITOR industries/{your-niche-slug}/compliance.md
```

Then in `.agents/agency-context.md`:

```yaml
## 2. Niche
- niche: {your-niche-slug}
```

Every skill that touches voice, design, copy, or proof will auto-load `industries/{your-niche-slug}/*.md`.

## What to fill in

- **voice.md** — tone, do/don't words, vocabulary, sample sentences, CTA voice.
- **personas.md** — primary buyer, secondary stakeholder, anti-persona, trigger events.
- **proof-patterns.md** — what credible social proof looks like in this industry.
- **offers.md** — typical offers and pricing ranges; service tier ladder.
- **imagery.md** — token overlay, photography rules, color/font choices.
- **compliance.md** — regulatory constraints, form-field restrictions, geographic concerns.

## Reference: dental overlay

`industries/dental/` is the reference implementation. Mirror its structure and depth when filling in a new niche.

## Validation

After filling in, run:

```bash
# In Claude Code:
/pick-niche
# Confirm the niche slug; the strategist will validate the overlay completeness.
```

Or manually verify each file has no `{placeholder}` strings remaining.
