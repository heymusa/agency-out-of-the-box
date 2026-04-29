---
paths:
  - "**/*.md"
  - "**/*.mdx"
---

# Markdown / docs style

Applies to all markdown files in this repo — skill bodies, rules, READMEs, plan docs, runbooks, industry overlays.

## Core rules

- **One H1 per file.** The H1 is the doc title.
- **H2 for major sections, H3 for subsections, H4 sparingly, never H5+.**
- **Blank line after every header.** Required for correct markdown rendering.
- **Blank line before any list** (CommonMark requirement).
- **Wrap code blocks in language-tagged fences** (` ```ts `, ` ```bash `, ` ```yaml `).
- **Tables for reference data** (frontmatter field reference, comparison matrices). Don't use tables for prose flow.

## Length caps

- **SKILL.md bodies under 500 lines.** Move detail to `references/`. Progressive disclosure.
- **Rule files under 400 lines.** If a rule grows past that, split it.
- **CLAUDE.md under 200 lines.** Cc-bp doctrine for adherence reliability.
- **README under ~600 lines.** It's a pitch + quickstart, not a manual.

## Frontmatter — required fields

For SKILL.md files (under `skills/{name}/`):

```yaml
---
name: skill-name
description: When the user wants to ... Triggers: "...", "...". For X, see y-skill.
metadata:
  version: 0.1.0
---
```

For agent files (under `agents/{name}.md`):

```yaml
---
name: agent-name
description: Use this agent PROACTIVELY when ...
allowedTools: [Read, Write, Edit, Skill, ...]
model: opus | sonnet | haiku
effort: low | medium | high | max
maxTurns: 30
permissionMode: acceptEdits | plan
memory: project | user | local
isolation: worktree
skills:
  - skill-1
  - skill-2
---
```

For rule files (under `rules/{name}.md`):

```yaml
---
paths:
  - "glob/**/*.tsx"
  - "another/glob/**"
---
```

For command files (under `commands/{name}.md`):

```yaml
---
description: Short description of what this command does.
argument-hint: "[optional-argument-name]"
---
```

## Description-field rules

The `description:` field is the most important line in any skill or agent file — it's what Claude uses for auto-discovery via progressive disclosure. Engineer it like a search-result snippet.

- Lead with **when to use it** (not what it is).
- Include **trigger phrases** the operator might type or say (verbatim).
- Include **negative scope** ("for X, see y-skill") to prevent overlap.
- Stay under 1024 characters.

Example, from this toolkit's `agency-context` skill:

> When the user wants to set up, update, or load the agency's foundational context document. Always read .agents/agency-context.md before doing any other agency work — niche, ICP, offer, voice, design tokens, analytics IDs all live here. Triggers: "set up agency context," "what's our positioning," "update the offer," "who is our ICP," or any new agency task. For a new niche from scratch, see niche-research. For offer construction, see offer-design.

## Tone

- Direct. Second person ("You are a conversion strategist.").
- Active voice.
- One idea per paragraph. Two to four sentences max.
- Tables and bullet lists when the structure is genuinely tabular. Otherwise prose.
- No emojis in skill bodies, rules, or commands. Allowed (sparingly) in operator-facing docs (README, runbooks).

## What NOT to put in markdown files

- Embedded screenshots (≥ 100 KB) — link them; don't inline.
- Long generated tables (use a script to generate them on demand).
- Cross-agent-incompatible Claude Code syntax (`` !`shell` `` injection) — stays in skill files only if the skill is Claude-Code-only. For cross-agent skills, inline shell-execution syntax breaks the file in Cursor / Codex / Gemini CLI / Windsurf.
