# Input Reconciliation — `docs/blueprint.md`

## Coverage

- Preserved the Participant sequence, seven Modules, Pretest gating, forward-seek restriction, backend Video Completion, seven-day Delay, Posttest gating, sequential unlock, mobile-first Researcher monitoring, audit events, and export capability.
- Preserved pregnancy-date calculation as a conditional, clinically governed capability.
- Expanded the blueprint’s loading and edge-case hints into explicit enrollment, playback, timing, assessment, notification, Researcher, safety, and privacy failure states.
- Converted broad security, privacy, reliability, usability, and auditability statements into measurable or testable FRs and NFRs.

## Intentional corrections

- Replaced “controlled flow ensures research validity” with the narrower claim that controlled flow can improve protocol adherence and traceability.
- Replaced optional Consent language with required, versioned, comprehended Consent and separate optional purposes.
- Made exact address and broad health/support fields disabled by default pending protocol justification.
- Replaced unrestricted mobile export/sharing with template-based, pseudonymized, approved, expiring export to a controlled destination.
- Defined seven days as 168 elapsed hours from backend-validated Video Completion.

## Deferred to downstream artifacts

- Screen layouts and copy details → UX specification.
- React Native mode, backend stack, schema, APIs, queues, notifications, hosting, and repository structure → architecture.
- Draft epics, stories, and sprint order → regenerated after architecture.

## Unresolved external inputs

- Approved Study Protocol, ethics committee, validated assessments, content versions, owners, vendors, retention, recruitment location, urgent-care contacts, and supported device inventory.
