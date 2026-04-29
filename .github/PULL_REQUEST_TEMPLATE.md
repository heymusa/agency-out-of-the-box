<!--
Thank you for contributing! Please fill out the sections below so a reviewer can land your change quickly.
-->

## What this PR does

<!-- One or two sentences. -->

## Why

<!-- Concrete problem this solves or scenario this enables. Link the issue. -->

Closes #

## Scope

- [ ] **One concern.** This PR doesn't combine a skill change with a doctrine change with a stack-template change.
- [ ] **Conventional commits** (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`) on every commit.

## Doctrine checks

- [ ] `./hooks/scan-forbidden-tokens.sh` passes on changed files.
- [ ] No buzzwords introduced (`seamless`, `world-class`, `passionate`, `innovative`, `synergy`, `leverage`, `utilize`, `robust`, `cutting-edge`, `dedicated`).
- [ ] No lorem ipsum, no `[your headline here]`, no `[insert benefit]`.
- [ ] If TODO content was added to a scaffold, it uses the `<!-- TODO: ... DO NOT SHIP -->` marker so the QA gate blocks deploy.

## Type-specific checks

<!-- Tick the section(s) that apply. -->

### Skill change
- [ ] Frontmatter parses (`name`, `description`, optional `paths:` glob).
- [ ] Body stays under 500 lines.
- [ ] Triggers documented in the `description:` field.
- [ ] If a new skill: justify why an existing skill couldn't absorb the work.

### Agent change
- [ ] Frontmatter has `model`, `allowedTools`, `skills:` list.
- [ ] Doesn't spawn other subagents (only commands orchestrate).

### Command change
- [ ] `argument-hint:` documents flags.
- [ ] Workflow has explicit halt conditions when context is missing.
- [ ] Calls `qa-reviewer` before any deploy step.

### Industry overlay
- [ ] All six files filled (`voice.md`, `personas.md`, `pain-points.md`, `proof-patterns.md`, `imagery.md`, `compliance.md`).
- [ ] Pain points include verbatim customer language, not polished paraphrase.

### Stack overlay change
- [ ] No re-introduced `package.json`, `tsconfig.json`, `next.config.*`, `astro.config.*` outside `overlay/`.
- [ ] `bootstrap.md` updated if the init flow changed.

### Design-system block
- [ ] `.astro` block renders standalone with no missing tokens.
- [ ] `.tsx` mirror added (or noted as pending in the PR description).
- [ ] Uses tokens, not hardcoded colours / spacing / radii.

## Screenshots / output

<!-- For block / page changes, paste a screenshot. For skill / agent changes, paste a transcript excerpt. -->

## Checklist for the reviewer

- [ ] Doctrine compliance (anti-AI-slop rules).
- [ ] Scope discipline (one concern).
- [ ] No regressions in existing skills / commands.
