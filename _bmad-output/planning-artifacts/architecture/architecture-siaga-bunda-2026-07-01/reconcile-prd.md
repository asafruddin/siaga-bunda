# Architecture Reconciliation — Final PRD

## Result

All FR-1 through FR-36 and NFR-1 through NFR-15 are covered by an AD, convention, structural seed, or explicit external configuration dependency. The six research-flow invariants are owned by AD-3, AD-4, AD-8, and AD-9. Consent, withdrawal, privacy, re-identification, export, audit, retention, content suspension, configuration activation, support routing, and recovery have explicit owners and mutation paths.

## External gates preserved

Study Protocol, ethics approval, named owners, clinical content, retention periods, vendor approvals, and urgent-care details remain activation inputs rather than architecture guesses. AD-13 and AD-16 fail production Study activation when those inputs are incomplete.

## Intentional technical departures from the blueprint

- Mobile requests exports but never receives export bytes.
- Research monitoring reads a pseudonymous projection rather than joining operational tables.
- Notifications do not drive Posttest availability.
- Separate Cognito pools preserve Participant passwordless access and mandatory Researcher TOTP.
- The backend begins as a modular monolith, not microservices.
