# Compliance — {Industry Name}

> Copy this file when bootstrapping a new industry overlay.
> Document regulatory constraints that affect copy + design + form fields for this niche.

## Industry regulator(s)

- {Regulator name 1} — {jurisdiction, what they regulate}
- {Regulator name 2} — {jurisdiction, what they regulate}

### Common prohibited claims

Most {industry regulators} prohibit:
- **{Prohibited claim type 1}** — {detail}
- **{Prohibited claim type 2}** — {detail}
- **{Prohibited claim type 3}** — {detail}

### State / region variations

- **{State / region 1}**: {specifics}
- **{State / region 2}**: {specifics}

When generating copy:
- {Specific things to avoid}
- {Specific disclosures required}

## Privacy / data constraints

### Industry-specific privacy laws

- {Law 1, e.g., HIPAA, FERPA, FCRA}
- {Law 2}

### Form field constraints

- **Default form fields:** {what's safe}
- **Off-limits fields:** {what's not}
- **Form provider compliance:** {which providers are okay; which require special config}

### Analytics tracking

- {Default analytics provider for this niche}
- {Tracking restrictions}

## Geography — GDPR / CCPA

If serving:
- **California (CCPA)**: {requirements}
- **EU (GDPR)**: {requirements}
- **Other jurisdictions**: {requirements}

## Trademark / IP usage

- {Rules around using client name / logo}
- {Rules around case-study redaction}

## What this means for the QA gate

`qa-reviewer` runs these specific checks for {industry} sites:

1. {Specific scan / check 1}
2. {Specific scan / check 2}
3. {Specific scan / check 3}
4. {Specific scan / check 4}
5. {Specific scan / check 5}

## Compliance escalation

If a generated artifact ambiguously violates a regulation, the `qa-reviewer` does NOT auto-fix. It flags the section and requires the operator to confirm. Compliance is a legal call, not an automation call.
