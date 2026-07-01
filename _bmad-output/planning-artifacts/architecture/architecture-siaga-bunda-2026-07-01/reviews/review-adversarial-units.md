# Adversarial Unit Compatibility Review

## Verdict

The initial spine allowed independently built modules to diverge on research reads, immediate revocation, audit atomicity, and retention ownership. AD-6, AD-15, AD-16, AD-21, AD-22, and AD-23 now close those holes.

## Pair attacks resolved

- Learning and Assessment cannot each update progression: Assessment emits acceptance; Learning alone owns `participant_module` and the state machine.
- Research monitoring and Export cannot invent separate joins/metrics: both consume the Research-owned projection and watermark.
- Retention cannot delete foreign tables: it orchestrates module disposition ports.
- Source mutation cannot commit without mandatory audit: both share a transaction through the security-definer audit function.
- Cognito logout and local authorization cannot disagree for more than a request: every request checks local session version/device grant in addition to JWT.
- API and Worker cannot invent job semantics: one outbox envelope, SQS consumer idempotency, and no async Learning State ownership bind both.
- Mobile and backend cannot disagree on success: mobile observations never authorize state and all commits reconcile idempotently.

No remaining pair of feature-level units can obey every AD yet select conflicting ownership or mutation paths.
