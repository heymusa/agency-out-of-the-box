'use server';

import { z } from 'zod';

// Default lead-submission Server Action. Funnels can extend with extra fields
// per-funnel via additional zod schemas; the validate() pattern stays consistent.

const leadSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(1).optional(),
  phone: z.string().min(7).optional(),
  // funnel-specific fields:
  niche: z.string().optional(),
  practice_size: z.enum(['under-1m', '1m-3m', '3m-5m', 'over-5m']).optional(),
  primary_goal: z.string().max(500).optional(),
  // tracking:
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadResult =
  | { ok: true; redirectTo?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // TODO: send to CRM / Resend / Composio.
  // The /new-funnel command wires this to the operator's chosen integration.
  // Default fallback: log to server console (visible in dev).
  console.info('[lead-submitted]', parsed.data);

  // Server-side analytics ping (Plausible accepts via API; here we emit via the client redirect target).
  // The actual `lead_submitted` event fires from the client-side via the cta_clicked delegation OR
  // via a 1px tracking pixel on the thank-you page. Pick one to avoid double-firing.

  return {
    ok: true,
    redirectTo: '/thank-you',
  };
}
