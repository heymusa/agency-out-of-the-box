# Compliance — Dental Marketing

Regulatory constraints loaded automatically when `agency-context.md §2 niche: dental`. The `qa-reviewer` agent uses this to flag potential violations before deploy.

## State dental board advertising rules

Dental advertising in the U.S. is regulated at the **state dental board** level. Most state boards have rules that affect both the dentist's own marketing AND vendors (us) producing copy on their behalf.

### Common prohibited claims

Most state dental boards prohibit:

- **Superlatives without verification.** "Best dentist," "#1 in {city}," "top-rated" — most state boards require these be either verifiable or removed.
- **Implied guarantees of treatment outcomes.** "Pain-free dentistry" — okay descriptively, not okay as a guarantee.
- **Comparative advertising.** "Better than {competitor practice}" — prohibited in most states.
- **Misleading credentials.** "Specialist" can only be used if the dentist is ADA-recognized in that specialty (orthodontics, periodontics, endodontics, etc.).
- **Patient testimonials without disclosure.** Most states require "Individual results may vary" near patient testimonials.

### State variations to know

- **Texas, California, Florida, New York**: stricter. Require explicit disclosure on testimonials.
- **Most states**: prohibit "Best of {city}" without verifiable third-party recognition.
- **Florida**: requires the dentist's license number visible on the practice website.
- **California**: requires disclosure of AI-generated content if used in advertising (CCPA-adjacent rule).

When generating copy:
- Avoid "best," "#1," "top," "leading" without backing.
- Add "Individual results may vary" near any patient testimonial in case studies.
- Add license-number visibility where the practice's state requires it.

## HIPAA constraints

The Health Insurance Portability and Accountability Act applies to:

- **Patient PHI in marketing.** Never publish patient names, photos, treatment details without explicit written authorization.
- **Reactivation campaigns.** Email / SMS to inactive patient lists IS allowed under TCPA + HIPAA marketing exceptions for treatment purposes — BUT only if the patient hasn't opted out.
- **Form submissions on the practice's site.** Any form that collects more than name + email + phone + appointment-request needs to either (a) NOT collect PHI, or (b) be on a HIPAA-compliant form provider (Resend / Formspree are NOT HIPAA-compliant out of the box; HIPAA-eligible alternatives include Paperform with HIPAA add-on or Formidable Forms with custom config).

### Hard rules

- **Default form fields:** name, email, phone, "what brings you in?" (free text, optional). Never: medical history, insurance details, current medications, prior treatments, X-rays.
- **PMS integration:** the practice connects their PMS (Dentrix / Open Dental / Eaglesoft) on their side; the agency does NOT pull PHI through API integrations the agency controls.
- **Analytics tracking:** Plausible default (no PII). If GA4, configure to NOT capture form-field values (we use the `cta_clicked` and `lead_submitted` events without PII).
- **Cookie consent:** for sites collecting any patient information beyond contact details, default to "essential only" cookies until consent.

## TCPA (Telephone Consumer Protection Act)

If running SMS reactivation campaigns:
- Initial SMS must include opt-out instructions ("Reply STOP to opt out").
- Cannot send marketing SMS between 9 PM and 8 AM in the recipient's local time zone.
- Patients on the agency's "stop" list cannot receive any future SMS.
- Cap at 1 marketing SMS per week per patient.
- Always honor opt-outs within 24 hours.

## ADA Code of Ethics (relevant sections)

The American Dental Association code applies to ADA-member dentists. Even when not a member, ADA conventions are persuasive in disputes.

- **Truth in advertising.** Claims must be substantiated.
- **Communication of fees.** Fees must be presented honestly and clearly. Avoid bait-and-switch.
- **Patient communications.** Cannot disparage other practitioners.

## Practice-name and trademark usage

- The agency cannot use the practice's name and logo in our portfolio without written consent.
- The practice cannot claim agency-built websites are entirely "their work" without crediting (this comes up at enterprise — be clear about IP in the contract).

## Geography — GDPR / CCPA

If the practice serves patients in California (CCPA) or visitors arrive from California:
- Cookie consent banner with "reject all" option.
- Privacy policy must include CCPA disclosures.
- Right-to-delete request workflow.

If serving any EU patients (rare for U.S. practices but possible for border practices):
- GDPR-compliant cookie consent.
- DPA signed with the practice if processing EU patient data.

## What this means for the QA gate

`qa-reviewer` runs these specific checks for dental sites:

1. Scan all copy for `best`, `#1`, `top dentist`, `leading {city}` — flag for human review.
2. Scan all testimonials for "Individual results may vary" disclaimer or similar — flag if missing.
3. Verify form fields don't include PHI-adjacent fields (medical history, current medications, etc.).
4. Verify cookie consent banner present if California / EU traffic possible.
5. Verify privacy policy + terms exist at footer-linked URLs.
6. Verify no patient photos on the site that would need explicit release (stock with "model used" still requires the disclosure if the photo implies a treatment outcome).

## Compliance escalation

If a generated artifact ambiguously violates a state board rule, the `qa-reviewer` does NOT auto-fix. It flags the specific section and requires the operator (or the practice's compliance contact) to confirm. Compliance is a legal call, not an automation call.
