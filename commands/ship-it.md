---
description: Run the full QA gate on a built site / LP / funnel. On PASS, prepare deploy config (Vercel default, Cloudflare Pages alternate). The qa-reviewer agent has block authority — the operator cannot override a BLOCK without manually running each fix.
argument-hint: "<path-to-site-or-lp> [--target=vercel|cloudflare]"
---

# /ship-it

The deploy gate. Runs the QA suite. On PASS, generates deploy config + walks the operator through deployment.

## What this command does

1. **Resolves the path** to the artifact under review (site / LP / funnel).
2. **Starts a dev preview** for QA inspection.
3. **Invokes `qa-reviewer`** with the 9-section rubric.
4. **On PASS:**
   - Generates deploy config for the chosen target.
   - Surfaces final deploy command(s) to the operator.
   - Updates `.agents/agency-context.md` §15 (Build Log).
5. **On BLOCK:**
   - Surfaces the specific fix list to the operator.
   - Routes fixes to upstream agents.
   - Re-runs QA after fixes (capped at 3 cycles).

## Workflow

### Step 1 — resolve path

Accept the path argument. Validate it points to one of:
- `output/agency-site/` (full agency site)
- `output/clients/{slug}-site/` (client site)
- `output/lps/{campaign-slug}/` (paid-traffic LP)
- `output/funnels/{name}/` (multi-step funnel)
- `stacks/astro-marketing/` or `stacks/nextjs-funnel/` (in-stack edits)

If unclear, list candidates from `output/` and ask:
> "Which artifact to ship?"

### Step 2 — preflight

Read `.agents/agency-context.md` §13 (Tech / Domain Inventory). Required for deploy:
- Domain (or operator confirms a Vercel-generated subdomain is acceptable for v1)
- Hosting target (Vercel / Cloudflare / other)
- Analytics IDs (already wired by `analytics-wiring`)

If §13 is empty:
> "Tech inventory §13 is empty. Configure now or deploy to a generated Vercel URL?"

### Step 3 — start dev preview

```bash
cd <path>
pnpm install
pnpm build       # production build, catches TS / build errors
pnpm preview &   # serve the production build for QA
# capture preview URL
```

If `pnpm build` fails, halt and surface errors. Don't run QA on a broken build.

### Step 4 — invoke qa-reviewer

```
Agent(
  subagent_type="qa-reviewer",
  description="9-section QA gate on {path}",
  prompt="<context: path, preview URL, agency-context, target deploy>"
)
```

The reviewer runs the full rubric. Returns PASS or BLOCK.

### Step 5a — handle PASS

Generate deploy config:

**Vercel (default):**
- Verify `vercel.json` exists in the project (the toolkit's stack templates ship one).
- Set environment variables prompt: `vercel env add` for each required key from §13 (Plausible domain, Resend API key, etc.).
- Surface the deploy command:
  ```bash
  vercel --prod
  ```
- After deploy, capture the production URL. Append to `.agents/agency-context.md` §15:
  ```markdown
  - {site-name} v1 deployed: {date} → {url}
  ```

**Cloudflare Pages (alternate):**
- Verify `wrangler.toml` exists OR generate one.
- Surface the deploy command:
  ```bash
  npx wrangler pages deploy ./dist  # for Astro
  npx wrangler pages deploy ./.vercel/output/static  # for Next.js export
  ```

If domain is set in §13:
- Verify DNS:
  ```bash
  dig +short {domain}
  ```
- If not pointing to deploy target, surface DNS config to operator.
- Configure custom domain in deploy provider (manual via dashboard for v1; future automation via Vercel/Cloudflare API).

Surface a launch checklist to the operator:
1. Run the deploy command.
2. Verify production URL loads.
3. Verify analytics fire (open dev console, click a CTA, check the analytics dashboard within 5 min).
4. Submit the contact form with test data, verify CRM/Resend received.
5. Smoke-test mobile on a real device (not just dev tools emulation).

### Step 5b — handle BLOCK

Display the qa-reviewer's BLOCK report verbatim. For each fix:

- Identify the responsible upstream agent.
- Re-invoke the agent with a tightly-scoped prompt: "Fix item N: {specific issue}."
- Capture the agent's diff.
- After all fixes, re-run qa-reviewer.

Cap at 3 cycles. If still BLOCK after 3 cycles, halt and surface to the operator:
> "QA has blocked 3 times on {N} issues. Likely a structural problem (missing assets / unclear context / framework misfit). Recommend reviewing {specific input file} before continuing."

### Step 6 — post-deploy follow-up (PASS only)

After confirmed deploy:
- Suggest scheduling Lighthouse re-runs weekly via a scheduled task (Skill: `schedule`).
- Suggest setting up uptime monitoring (free: UptimeRobot; paid: Better Uptime).
- Suggest configuring search-console + analytics-tag-manager verification.

## Hard rules

- **No deploy without PASS.** The qa-reviewer's BLOCK is authoritative. Operator can override only by manually running each fix and re-requesting review.
- **No auto-deploy.** This command prepares the deploy command. The operator runs it explicitly. The toolkit does not push to production for the operator.
- **No PII in deploy logs.** Generated env-var prompts redact values from any output.
- **`pnpm build` must pass before QA.** Don't run QA on a broken build.

## Anti-patterns

- **"Deploy first, fix issues live."** No. The whole point of the gate is to catch issues before they hit prod.
- **Skipping the smoke-test on real device.** Dev-tools mobile emulation lies about touch targets and font rendering. 30 seconds on a real iPhone catches issues.
- **Deploying to "the same place every time."** If §13 isn't set, ask. Don't default to a Vercel personal account that might not be the right place.

## Example invocations

```
/ship-it output/agency-site/
/ship-it output/clients/smile-bright-dental-site/ --target=vercel
/ship-it output/lps/hyper-local-austin/ --target=cloudflare
/ship-it stacks/astro-marketing/
```
