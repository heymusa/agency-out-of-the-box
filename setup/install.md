# Install / Setup

The toolkit ships as a Claude Code plugin marketplace. Two install paths.

## Path A — install as a Claude Code plugin (recommended)

```bash
# Inside a Claude Code session, in any project directory:
/plugin marketplace add musayyab/agency-out-of-the-box
/plugin install agency-out-of-the-box
```

Claude Code will:
- Drop the skills into `.claude/skills/`
- Drop the agents into `.claude/agents/`
- Drop the commands into `.claude/commands/`
- Drop the rules into `.claude/rules/`
- Drop the hooks into `.claude/hooks/`

Then merge `setup/settings.example.json` into your project's `.claude/settings.json` (or `.claude/settings.local.json` for personal-only). This wires the PostToolUse hook for forbidden-token scanning and the Playwright + Context7 MCP servers.

## Path B — clone and use as a project

```bash
git clone https://github.com/musayyab/agency-out-of-the-box.git my-agency
cd my-agency

# Make the hook executable
chmod +x hooks/*.sh

# Merge the settings template into your project's .claude/settings.json
cp setup/settings.example.json .claude/settings.json   # if you don't have one
# OR manually merge the hooks + mcpServers blocks if you already have settings

# Start Claude
claude
```

> **Note on stacks.** The `stacks/astro-marketing/` and `stacks/nextjs-funnel/` directories do **not** ship a runnable framework scaffold. Pinning Astro / Next versions in this repo would rot in 2–3 months. Instead, each stack contains a `bootstrap.md` documenting the **current official** init procedure (`npm create astro@latest`, `npx create-next-app@latest`) plus an `overlay/` of the small set of files we genuinely own (Tailwind tokens bridge, layouts, scaffold pages, lead Server Action). The `design-builder` agent runs the bootstrap procedure automatically the first time `/build-agency-site`, `/new-landing-page`, or `/new-funnel` needs a project; you don't run anything manually.

## Verify

In a Claude session:

```bash
> /pick-niche
```

You should see the `industry-strategist` agent kick off. If it doesn't, check that:
1. `agents/industry-strategist.md` is in `.claude/agents/` (or top-level if you cloned)
2. `commands/pick-niche.md` is in `.claude/commands/` (or top-level)
3. Your `.claude/settings.json` does not have `disableAllHooks: true`

## Common gotchas

- **Hook script not executable** — run `chmod +x hooks/scan-forbidden-tokens.sh`.
- **Playwright MCP fails to start** — first run `npx -y @playwright/mcp@latest install` to download the browser binaries.
- **Tokens.json not found** — the `design-system/` folder must be at the repo root. If installed as a plugin, the plugin install should drop a copy under `.claude/`. If cloned, it stays at the root.
- **Conversion doctrine isn't firing** — check that `rules/conversion.md` has the `paths:` frontmatter and your file path matches one of the globs.
