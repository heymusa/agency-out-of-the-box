---
description: Build a website for a specific client. Same pipeline as /build-agency-site but reads from a clients/{name}.md overlay (their ICP, voice, offer, brand) instead of the agency's own context. The agency operator delivers the website service via this command.
argument-hint: "<client-slug> [--stack=astro|nextjs] [--pages=all|...]"
---

# /new-client-site

Delivers a website for a specific client. The agency's repeatable production pipeline.

## What this command does

1. **Validates `clients/{slug}.md`** exists and contains the client's specifics (their ICP, offer, voice, design tokens, content).
2. **Loads the client overlay** as a context replacement for `.agents/agency-context.md` (only for this run).
3. **Runs the same pipeline as `/build-agency-site`** — seo-strategist → conversion-copywriter → design-builder → qa-reviewer — but scoped to the client's brand.
4. **Outputs** to `output/clients/{slug}-site/` so multiple clients can be in flight simultaneously.

## Workflow

### Step 1 — locate or create the client overlay

If `<client-slug>` is provided as an argument:
- Check for `clients/{slug}.md`.
- If exists, load it.
- If not exists, offer to create it from a template:
  > "No client file found at clients/{slug}.md. Create one from clients/_template.md and walk through the fields?"

If no argument, list active clients from `.agents/agency-context.md` §14:
> "Which client?"
> Options: list of active clients + "Create new client".

### Step 2 — bootstrap a client overlay (if new)

A client overlay is a smaller version of agency-context, focused on this one client. Schema:

```markdown
# Client Context — {Client Name}

## Inherits from agency-context.md
Sections inherited unless overridden: 13 (Tech defaults), 12 (Compliance — agency's general practice).

## 1. Client identity
- Name:
- Domain:
- Founder / contact:
- Engagement scope: {what we're delivering — site / site + funnel / etc.}
- Engagement budget: {fee structure}
- Engagement timeline: {kickoff date, target launch date}

## 2. Their niche
- Industry:
- Sub-segment:
- Geography:
- Industry overlay: industries/{niche}/

## 3. Their ICP
... (same schema as agency-context §3)

## 4. Their pain points (verbatim from their customers, not theirs)
... (same schema as agency-context §4)

## 5. Their positioning
... (same schema as agency-context §5)

## 6. Their offer
... (same schema as agency-context §6)

## 7. Their service tiers (if applicable)
... (same schema as agency-context §7)

## 8. Their voice
- Three do-words:
- Three don't-words:
- Sample right voice:
- Sample wrong voice:

## 9. Their visual
- Brand color:
- Accent color:
- Heading font:
- Body font:
- Photography style:
- Imagery do's / don'ts:

## 10. Their competitors
... (same schema as agency-context §10)

## 11. Their proof inventory
... (same schema as agency-context §11) — this is THEIR proof, not the agency's.

## 12. Their compliance
... (same schema as agency-context §12)

## 13. Tech / domain (overrides default)
- Hosting: {Vercel / their hosting / etc.}
- Analytics: {their GA4 / Plausible / etc.}
- CMS: {if any}
- Forms: {Resend on their domain / Formspree / their CRM}
- Booking: {their Cal.com / their internal scheduler}
```

The client overlay schema mirrors agency-context's, so every skill's "read context first" step works identically.

### Step 3 — confirm pipeline parameters

Use `AskUserQuestion`:
> "Confirm pipeline parameters?"
> - Stack: {astro / nextjs} (default from agency-context §13 or operator preference)
> - Pages: all / subset
> - Niche overlay: {industries/{niche}/} (from client overlay §2)

### Step 4 — run the pipeline (delegated to /build-agency-site internals)

The same chain as `/build-agency-site`, but with two key changes:

1. The agents read the client overlay instead of (in addition to) `.agents/agency-context.md`. They merge: client overlay takes precedence on §1-§13; agency-context provides §14 (active client list — for cross-references), §11 inherited proof if client doesn't have any (rare).

2. Output goes to `output/clients/{slug}-site/` instead of `output/agency-site/`. The stack used (`stacks/astro-marketing/` or `stacks/nextjs-funnel/`) is not modified — the output is a fresh project under output/, scaffolded from the stack template.

### Step 5 — handle pipeline output

Same PASS / BLOCK / route-fix handling as `/build-agency-site`.

### Step 6 — handoff package

When QA passes:
- Generate a delivery package: `output/clients/{slug}-handoff/`.
- Includes: built site, deploy instructions tailored to the client's hosting, analytics IDs (if client provided), CMS export (if client uses one), credentials checklist for the client to provision.
- Generate a Loom-ready presentation script: `output/clients/{slug}-handoff/walkthrough-script.md` — a 5-minute script the operator records over the staging URL.

### Step 7 — update agency-context

Append to `.agents/agency-context.md` §14:
```markdown
- {client-slug} — see clients/{client-slug}.md — site v1 deployed {date} → {url}
```

### Step 8 — recommend next

- Suggest `/new-funnel --client={slug}` if the engagement includes a paid-traffic funnel.
- Suggest a follow-up `/new-client-site {slug} --pages=case-studies/{their-clients}` once the client launches and gets results.

## Hard rules

- **Client overlay is required.** Don't run without `clients/{slug}.md`.
- **Don't merge client work into the agency's main brand.** Output stays under `output/clients/{slug}-site/` until the operator explicitly decides to also publish it as a case-study.
- **Don't share client proof.** Section 11 of the client overlay is THEIR proof. Don't mix it into the agency's proof inventory unless explicitly authorized.
- **Compliance per client.** Each client's `clients/{slug}.md §12` overrides the agency default. (E.g., a healthcare client triggers HIPAA-aware forms.)

## Anti-patterns

- **Reusing the agency's homepage layout 1:1 for the client.** The client's ICP / voice / offer is different. Pipeline must reproduce from their context, not paste-and-edit.
- **Skipping QA "because the client is anxious."** No. Worse to ship buzzword-headline slop to a paying client.

## Example invocations

```
/new-client-site smile-bright-dental
→ Loads clients/smile-bright-dental.md, runs pipeline.

/new-client-site austin-roofing-co --stack=nextjs
→ Override stack.

/new-client-site
→ List active clients, prompt for selection or new-client setup.
```
