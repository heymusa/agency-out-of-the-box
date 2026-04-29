---
name: agency-context
description: When the user wants to set up, view, or update the agency's foundational context document. Always check .agents/agency-context.md FIRST before doing any other agency work — niche, ICP, offer, voice, design tokens, analytics IDs all live here. Triggers - "set up agency context", "what's our positioning", "update the offer", "who is our ICP", "load context", or any new agency task. For a brand-new niche pick from scratch, see niche-research. For Hormozi offer construction, see offer-design.
metadata:
  version: 0.1.0
---

# Agency Context — the keystone

You manage the single source of truth for the agency: `.agents/agency-context.md`. Every other agency skill in this toolkit reads this file before asking the operator any questions about their business. Your job is to keep it accurate, complete, and actively-used.

## Why this skill exists

Without a foundational context document, every skill re-asks the same questions: who's your ICP, what's your offer, who's your competition. That wastes the operator's time, eats Claude's context window, and drifts the brand voice across artifacts. This file fixes that. Read it once, every skill respects it forever.

## Core operations

You handle four operations:

1. **Load** — read the file and summarize its current state for the operator or a downstream agent.
2. **Bootstrap** — create the file from scratch (or auto-draft from existing artifacts the operator points at).
3. **Update** — change specific sections in response to operator input or downstream skill output.
4. **Validate** — check completeness; flag missing sections that downstream skills depend on.

Never silently rewrite the file. Always show diffs and ask for confirmation before persisting changes.

---

## Workflow

### Step 1 — check if the file exists

The canonical path is `.agents/agency-context.md`. Also check `.claude/agency-context.md` for older setups; if found there but not in `.agents/`, offer to move it.

**If it exists:** read it, summarize what's captured, and ask the operator which sections they want to update. Don't volunteer to refresh sections they didn't ask about.

**If it doesn't exist:** offer two paths.

1. **Auto-draft from existing artifacts** (recommended when the operator already has *something* — an existing site, a LinkedIn profile, a pitch deck, a Notion brain dump). Ask them to share the URL or file paths. You read everything you can, draft sections 1-9, and present the draft for review.
2. **Walk through from scratch** — go section by section, conversationally. Don't dump the whole schema. Ask, capture, confirm, move on.

If they're starting completely cold (no industry picked yet), hand off to the `niche-research` skill via the `industry-strategist` agent. That skill produces the V1 of this document.

### Step 2 — gather information

For auto-drafting, harvest from any of these sources the operator can provide:

- Existing website (URL — fetch it)
- LinkedIn profile / company page
- Pitch deck or one-pager
- Existing marketing copy or sales emails
- README files in their repo
- A "describe what we do in 3 sentences" voice memo transcript

For walk-through-from-scratch, follow the schema below in order. Push for **verbatim customer language** in §4 (Pain Points) — exact phrases customers use are more valuable than polished company-voice paraphrases. Ask "what do clients literally say in the discovery call when describing the problem?"

### Step 3 — write or update

Persist to `.agents/agency-context.md`. The file is plain markdown; don't introduce structure beyond the schema. Operators edit this file directly between sessions, and skills parse it by section heading.

If you're updating, show a diff (or describe the changes section by section) and ask for confirmation before writing.

### Step 4 — validate completeness

After any write, run a completeness check:

- Required for ALL skills: §1 Identity, §2 Niche, §3 ICP, §8 Voice.
- Required for `/build-agency-site`: + §5 Positioning, §6 Offer, §9 Visual.
- Required for `/new-funnel`: + §6 Offer, §7 Service Tier Ladder.
- Required for `/ship-it`: + §13 Tech / Domain Inventory.

Report which downstream commands are unblocked vs blocked.

---

## Schema (copy this into the file when bootstrapping)

```markdown
# Agency Context — {Agency Name}

> Single source of truth. Every skill reads this first. Edit by hand or via /pick-niche, /agency-context update.

## 1. Identity
- **Agency name:**
- **Domain:**
- **Tagline (10-12 words max):**
- **Founder / operator:** {name}, {one-sentence bio}, {city}, {LinkedIn URL}

## 2. Niche
- **Primary industry:**
- **Sub-segment:**
- **Geography:** local | regional | national | global
- **Industry overlay loaded:** industries/{niche}/

## 3. Ideal Customer Profile (ICP)
- **Decision maker:** {role + seniority}
- **Secondary stakeholder:** {role}
- **Anti-persona (NOT a fit):**
- **Company / practice size:**
- **Annual revenue band:**
- **Trigger event (what makes them search now):**

## 4. Pain Points (verbatim where possible)
- **Top 3 pains, in customer's words:**
  1.
  2.
  3.
- **Cost of not solving (time / money / opportunity):**
- **Emotional tension (stress / fear / doubt):**

## 5. Positioning Statement
> For {ICP} who {pain}, we are {category} that {differentiation}, unlike {alternative} which {falls short how}.

## 6. The Grand-Slam Offer (Hormozi value equation)
- **Core deliverable:**
- **Dream outcome (12 months out):**
- **Perceived likelihood — proof stack:**
- **Time delay (first result, full result):**
- **Effort & sacrifice (what client must do — minimize):**
- **Guarantee structure:**
- **Urgency mechanism:**
- **Scarcity mechanism:**
- **Bonus stack (each anchored at standalone value):**

## 7. Service Tier Ladder (Brunson value ladder)
- **Free:** {lead magnet / audit / report}
- **Entry (low-ticket):**
- **Core productized service:**
- **Retainer / continuity:**
- **High-ticket / custom:**

## 8. Brand Voice
- **Three do-words:** {e.g., direct, warm, technical}
- **Three don't-words:** {e.g., not corporate, not bro-y, not academic}
- **Sample sentence in the right voice:**
- **Sample sentence in the WRONG voice:**

## 9. Visual Identity
- **Brand color (hex + token name):**
- **Accent color:**
- **Heading font:**
- **Body font:**
- **Photography style:** real | illustrated | abstract
- **Imagery do's:**
- **Imagery don'ts:**

## 10. Competitive Landscape
- **Direct competitors:**
  - {name} — {URL} — {how they fall short}
- **Secondary competitors:**
- **Indirect competitors:**

## 11. Proof Inventory
- **Case studies (with metrics):**
- **Client logos available for use:**
- **Testimonials (with attribution):**
- **Awards / certifications / press:**

## 12. Compliance Constraints
- **Industry regulations:** {e.g., HIPAA, ABA advertising rules}
- **Geographic regulations:** {e.g., GDPR, CCPA}
- **Off-limits claims:**

## 13. Tech / Domain Inventory
- **Domain registrar:**
- **DNS / Cloudflare:**
- **Hosting:** Vercel | Cloudflare Pages | other
- **Analytics:** Plausible | GA4 | PostHog ({IDs})
- **Email / forms:** Resend | Formspree ({API key reference})
- **Booking:** Cal.com | SavvyCal
- **CRM:** {if any}

## 14. Active Clients (for /new-client-site overlays)
- {client-1} — see clients/{client-1}.md
- {client-2} — see clients/{client-2}.md

## 15. Build Log
- Site v1 deployed: {date} → {url}
- Funnel v1 deployed: {date} → {url}
- Last reviewed: {date}
```

---

## When you're called by another skill / agent

If a downstream skill (e.g., `storybrand-page`, `landing-page-funnel`) calls you to load context, return:

1. The full content of `.agents/agency-context.md` (no truncation — sections are short).
2. The path to the loaded industry overlay (`industries/{niche}/` files).
3. A flag indicating which sections are TODO / empty.

Do not paraphrase. Downstream skills want the raw text.

## Anti-patterns

- **Don't auto-fill values from training knowledge.** If section X is empty, ask. Don't guess at "what most dental marketing agencies' positioning probably looks like."
- **Don't expand scope.** This skill manages one file. It doesn't write the offer, it captures the offer. The `offer-design` skill writes; this skill stores.
- **Don't allow drift.** If a downstream skill suggests changing the brand voice mid-build, surface the conflict to the operator. Don't silently overwrite §8.
- **Don't truncate verbatim customer language.** Keep the messy phrasing — that's the gold.

## Related skills

- `niche-research` — bootstrap §1-§3 from scratch.
- `offer-design` — build out §6 (Grand-Slam Offer) and refine §7 (Service Tier Ladder).
- All other agency-out-of-the-box skills — read this file as their first action.
