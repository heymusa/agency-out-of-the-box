# Contributing to Agency-Out-of-the-Box

Thanks for showing up. This toolkit is opinionated by design — its value comes from saying "no" to AI slop. Every contribution should sharpen that edge, not blunt it.

## TL;DR

1. Open an issue **before** you write a big PR. We may have a reason your idea conflicts with the doctrine.
2. One concern per commit, one concern per PR.
3. Run the doctrine checks (forbidden-token scan, frontmatter validation) before pushing.
4. Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

## What we welcome

- ✅ **New industry overlays.** Copy `industries/_starter/` to `industries/{your-niche}/` and fill in voice, personas, proof patterns, compliance constraints. Real domain expertise wins here.
- ✅ **New design-system blocks** (`design-system/blocks/*.astro`) that compose into a recognised conversion pattern. Must include `.tsx` mirror or note that one is needed for the Next.js stack.
- ✅ **Bug fixes** in skills, agents, hooks, or the QA gate.
- ✅ **Doctrine sharpening** in `rules/conversion.md` — new buzzword bans, sharper failure modes for the 5-second test, etc.
- ✅ **Better default copy / better scaffolds.** As long as they're clearly TODO-gated so the QA gate refuses to ship them.

## What we politely refuse

- ❌ **More than 11 skills.** The repo's leverage comes from leanness. New work usually belongs in an existing skill or a sibling plugin (e.g., `marketingskills`).
- ❌ **A second design system.** We picked one (Tailwind tokens + shadcn primitives + hand-built blocks) and we standardise.
- ❌ **Vendoring framework versions** into `stacks/`. Astro / Next versions belong upstream; our overlay stays small. See `stacks/*/bootstrap.md`.
- ❌ **PRs that re-introduce buzzword copy** in scaffolds, READMEs, or examples ("seamless", "world-class", "passionate", "innovative", "synergy", etc.). The hook will block your commit anyway, but please save us both the time.
- ❌ **PRs that bypass the QA gate** (`disableAllHooks`, removing forbidden-token checks, etc.).

## Local setup

```bash
git clone git@github.com:heymusa/agency-out-of-the-box.git
cd agency-out-of-the-box
chmod +x hooks/*.sh
```

There is no top-level `node_modules` — this repo is configuration + markdown + a few `.astro`/`.tsx` overlay files. The stacks are bootstrapped at runtime per project (see `stacks/*/bootstrap.md`).

## Doctrine checks (run these before opening a PR)

```bash
# 1. Forbidden-token scan — catches "lorem ipsum", buzzwords, fabricated stats
./hooks/scan-forbidden-tokens.sh design-system/ industries/ commands/ skills/

# 2. Frontmatter validation — every SKILL.md, agent .md, command .md must parse
find skills agents commands -name '*.md' -exec node -e '
  const fs = require("fs");
  const path = process.argv[1];
  const m = fs.readFileSync(path, "utf8").match(/^---\n([\s\S]*?)\n---/);
  if (!m) { console.error("Missing frontmatter:", path); process.exit(1); }
' {} \;

# 3. Line-cap enforcement — SKILL bodies stay under 500 lines, CLAUDE.md under 200
find skills -name 'SKILL.md' | xargs wc -l | awk '$1 > 500 { print "Over 500 lines:", $2; exit 1 }'
wc -l CLAUDE.md | awk '$1 > 200 { print "CLAUDE.md over 200:", $2; exit 1 }'
```

## PR checklist

Copy this into your PR description:

```markdown
- [ ] One concern. (No combining a skill change with a doctrine change with a stack template change.)
- [ ] Conventional commit prefix on every commit (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- [ ] Forbidden-token scan passes locally.
- [ ] Frontmatter parses on every changed `SKILL.md` / agent / command file.
- [ ] If you added a new skill, it earns its slot. (Why is the existing one not enough?)
- [ ] If you added a new industry overlay, all six files (`voice.md`, `personas.md`, `pain-points.md`, `proof-patterns.md`, `imagery.md`, `compliance.md`) are populated.
- [ ] If you added a block, you also added the `.tsx` mirror or noted it's pending.
- [ ] No buzzwords or lorem ipsum in any artifact (including TODO scaffolds — those use `<!-- TODO: ... DO NOT SHIP -->` markers, never fake content).
- [ ] No re-introduced framework boilerplate inside `stacks/` (outside `overlay/`).
```

## Commit style

```
feat(skill): add cold-email-cadence skill
fix(rule): tighten 5-second test failure mode for above-fold conflicts
docs: clarify bootstrap procedure for Next.js 16 changes
chore(industry): bootstrap home-services overlay from _starter
refactor(agent): split design-builder into pre-composer / composer phases
```

One concern per commit. If your work touches three concerns, that's three commits.

## Reporting issues

- 🐛 **Bug:** open a `bug` issue — include the command you ran, the agent/skill that misbehaved, the actual output, and the expected output.
- 💡 **Feature idea:** open a `feature` issue *first* — describe the use case before writing code. Some ideas conflict with our non-goals (see `PLAN.md` §1) and we'll tell you upfront.
- 🏷️ **Industry overlay request:** open a `niche` issue — describe the niche, the operator's likely background, the regulations, and the typical price-point. We'll help you draft the overlay.

## Code of conduct

See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Short version: be direct, attack ideas not people, no harassment, no spam.

## Questions

Open a [Discussion](https://github.com/heymusa/agency-out-of-the-box/discussions) or DM the maintainer on [GitHub](https://github.com/heymusa).
