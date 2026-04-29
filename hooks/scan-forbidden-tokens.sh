#!/usr/bin/env bash
# scan-forbidden-tokens.sh
#
# PostToolUse hook for the agency-out-of-the-box plugin.
# Runs after every Write or Edit tool use. Scans the touched file for
# forbidden tokens defined in rules/conversion.md. If any hard-rule token
# appears, exits non-zero and the agent is forced to rewrite.
#
# Soft-rule tokens (buzzwords) only trigger warnings written to stderr
# — they do not block the tool use. The qa-reviewer agent does the
# blocking sweep before /ship-it.
#
# Wired in setup/settings.example.json under hooks.PostToolUse.

set -euo pipefail

# Claude passes the touched file path as $CLAUDE_HOOK_FILE_PATH.
# Fall back to scanning stdin if no file path is provided.
FILE="${CLAUDE_HOOK_FILE_PATH:-}"

# Hard rule: only scan content files (not configs or generated artifacts).
# These are the file globs where conversion doctrine applies.
should_scan() {
  local f="$1"
  case "$f" in
    *.tsx|*.jsx|*.astro|*.mdx|*.md|*.html|*.txt) return 0 ;;
    *) return 1 ;;
  esac
}

# Hard tokens — any of these is a blocking failure.
HARD_TOKENS=(
  "lorem ipsum"
  "Lorem ipsum"
  "dolor sit amet"
  "consectetur adipiscing"
  "[your headline]"
  "[your-headline]"
  "[insert headline]"
  "[your benefit]"
  "[insert benefit]"
  "[benefit here]"
  "[your CTA]"
  "[insert CTA]"
  "[your tagline]"
  "[insert tagline]"
  "your company name"
  "Your Company Name"
  "your business name"
  "Your Business Name"
  "your product name"
  "Your Product Name"
)

# Buzzwords — these warn but do not block. The QA gate handles the hard sweep.
BUZZWORDS=(
  "synergy"
  "synergistic"
  "world-class"
  "cutting-edge"
  "bleeding-edge"
  "best-in-class"
  "mission-critical"
  "paradigm shift"
  "paradigm-shift"
  "game-changer"
  "game changer"
  "next-generation"
  "next-gen"
  "state-of-the-art"
  "revolutionize"
  "disruptive"
  "leverage "
  "Leverage "
  "utilize"
  "Utilize"
)

# Soft buzzwords — these warn only when found in headline-like contexts (H1 / H2).
HEADLINE_BUZZWORDS=(
  "innovative"
  "innovation"
  "passionate"
  "dedicated"
  "comprehensive"
  "holistic"
  "robust"
  "seamless"
  "transform "
  "empower"
  "elevate"
  "unlock"
)

if [[ -z "$FILE" || ! -f "$FILE" ]]; then
  # Nothing to scan
  exit 0
fi

if ! should_scan "$FILE"; then
  exit 0
fi

# Skip the rules / docs themselves — they reference the forbidden tokens by definition.
case "$FILE" in
  */rules/conversion.md|*/rules/markdown-docs.md|*/PLAN.md|*/CLAUDE.md|*/README.md|*/skills/ship-checklist/*|*/hooks/scan-forbidden-tokens.sh)
    exit 0
    ;;
esac

# 1. Hard-token scan (blocking)
HARD_HITS=()
for token in "${HARD_TOKENS[@]}"; do
  if grep -i -F -q -- "$token" "$FILE"; then
    HARD_HITS+=("$token")
  fi
done

if [[ ${#HARD_HITS[@]} -gt 0 ]]; then
  echo "❌ FORBIDDEN TOKENS in $FILE — agent must rewrite before continuing." >&2
  for t in "${HARD_HITS[@]}"; do
    echo "   - \"$t\"" >&2
  done
  echo "" >&2
  echo "See rules/conversion.md §1 for the full list and rationale." >&2
  exit 1
fi

# 2. Buzzword warnings (non-blocking)
WARN_HITS=()
for token in "${BUZZWORDS[@]}"; do
  if grep -i -F -q -- "$token" "$FILE"; then
    WARN_HITS+=("$token")
  fi
done

# 3. Headline-buzzword scan (warn if found inside H1 or H2 markdown headings,
# or inside <h1>/<h2> tags in JSX/Astro)
HEADLINE_HITS=()
for token in "${HEADLINE_BUZZWORDS[@]}"; do
  # markdown H1/H2: lines starting with `# ` or `## `
  if grep -E -i "^(#{1,2})\s+.*${token}" "$FILE" >/dev/null 2>&1; then
    HEADLINE_HITS+=("$token (in H1/H2)")
    continue
  fi
  # JSX/Astro <h1>/<h2>: rough match
  if grep -E -i "<h[12][^>]*>[^<]*${token}" "$FILE" >/dev/null 2>&1; then
    HEADLINE_HITS+=("$token (in <h1>/<h2>)")
  fi
done

if [[ ${#WARN_HITS[@]} -gt 0 || ${#HEADLINE_HITS[@]} -gt 0 ]]; then
  echo "⚠️  Buzzword warnings in $FILE (not blocking — qa-reviewer will sweep at /ship-it):" >&2
  for t in "${WARN_HITS[@]}"; do
    echo "   - \"$t\" (body)" >&2
  done
  for t in "${HEADLINE_HITS[@]}"; do
    echo "   - \"$t\"" >&2
  done
fi

exit 0
