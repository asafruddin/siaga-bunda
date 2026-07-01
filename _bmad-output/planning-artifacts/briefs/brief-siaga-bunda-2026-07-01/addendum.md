---
title: SiAGA Bunda Product Brief Addendum
status: draft
created: 2026-07-01
updated: 2026-07-01
---

# SiAGA Bunda Product Brief Addendum

## Assumption and decision register

| Blueprint premise | Challenge | Decision or evidence needed |
|---|---|---|
| Enforced flow ensures research validity | It documents exposure and sequencing, not attention, comprehension, causal effect, representativeness, or instrument validity. | Approved protocol, analysis plan, validated instruments, deviation taxonomy, and prespecified missing-data treatment. |
| Video must reach 100% and cannot be skipped | Strict controls may disadvantage low-connectivity, disabled, interrupted, or shared-device users and may select for persistence. | Pilot evidence; accessibility behavior; replay/resume policy; legitimate exception and deviation handling. |
| Posttest opens exactly seven days later | The interval appears asserted rather than justified and “exactly” is ambiguous across time zones, device clocks, and downtime. | Protocol rationale; server clock; availability window; late-completion rule; notification retry and manual recovery policy. |
| Completing a posttest unlocks the next module | Locking may improve sequence fidelity but can feel coercive or conceal the right to stop. | Withdrawal affordance, non-penalization language, researcher follow-up rules, and handling of incomplete participation. |
| Registration requires broad identity, address, and medical history | Several fields may be unnecessary for the endpoint and increase harm if exposed. | Field-by-field necessity, purpose, access, retention, export, and deletion justification. Prefer participant codes and coarse location where possible. |
| “Consent checkbox if needed” | Consent is foundational, not optional UI. A checkbox alone does not demonstrate informed, comprehended, voluntary consent. | Ethics-approved consent script and version; comprehension check; timestamp; re-consent trigger; withdrawal contact; separate optional purposes. |
| Researcher can export respondent data | Raw export creates the highest-leakage path and mobile sharing can bypass controls. | Pseudonymization, minimum columns, approval workflow, expiry, watermark/audit, secure destination, and prohibition on uncontrolled share sheets. |
| Scores should be visible to researchers | Individual results can influence behavior and unblind or bias follow-up. | Blinding rules, role access, aggregation thresholds, and when individual results become visible. |
| Pregnancy dates and history are educational context | Incorrect calculations or interpretations may be mistaken for clinical advice. | Clinically approved formula, uncertainty/exceptions, clear non-diagnostic copy, and referral to a qualified professional. |
| Push reminders are harmless | Lock-screen text can reveal pregnancy or study participation; tokens and shared devices introduce privacy risks. | Neutral default copy, in-app preference, permission timing, token lifecycle, and no sensitive content in notification payloads. |
| Mobile-first researcher UI is sufficient | Mobile improves reach but may be poor for large-data review and controlled export. | Researcher workflow testing and a decision on whether export administration belongs on a more controlled surface. |

## Safety and governance requirements for downstream PRD

- Define a named clinical content owner, study principal investigator, data controller, security owner, and incident decision-maker.
- Keep educational messaging distinct from clinical advice. Every danger-sign module needs clinically approved “seek care now” guidance that works without completing the study flow.
- Version videos, questions, scoring keys, consent text, escalation instructions, and translations. Store which version each participant received.
- Treat app outages, skipped checkpoints, duplicate submissions, clock anomalies, device changes, researcher contact, and manual corrections as explicit protocol deviations rather than silently repairing records.
- Never overwrite source answers, scores, or consent records. Corrections should be append-only, attributable, reasoned, and approved.
- Define adverse-event and safety-signal intake even if the app does not solicit symptoms; users may still contact researchers after viewing danger-sign content.
- Separate identifiable contact data from study responses where feasible. Use participant IDs in monitoring and export views by default.
- Document retention and disposition for enrolled users, screen failures, withdrawals, study closure, backups, logs, exports, and vendor-held copies.
- Ensure participant support does not become informal diagnosis. Provide scripted boundaries and escalation routes for researchers.

## Research still required

1. Interview pregnant participants across literacy, age, device, connectivity, disability, and shared-phone contexts; include consent comprehension and notification privacy.
2. Observe researchers performing monitoring, deviation review, follow-up, and export tasks on mobile before committing to a mobile-only surface.
3. Have maternal-health clinicians review every video, question, answer key, calculation, and escalation path; document review cadence and evidence sources.
4. Have a statistician or methodologist validate endpoints, question equivalence, sample assumptions, seven-day timing, attrition handling, and whether the sequence introduces learning or selection effects.
5. Complete ethics, privacy/legal, threat-model, and vendor/data-location reviews before collecting real participant data.

## Source-material disposition

The blueprint’s product vision, two-sided mobile model, seven-module sequence, audit needs, and initial scope are distilled into the brief. Detailed screen inventory, proposed architecture, schema, APIs, epics, and sprint plan remain in the blueprint for PRD and architecture work; they are not treated as approved product decisions. The challenges above preserve the blueprint’s meaningful unresolved assumptions for downstream resolution.
