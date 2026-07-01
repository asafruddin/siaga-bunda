---
title: SiAGA Bunda PRD Addendum
status: final
created: 2026-07-01
updated: 2026-07-01
---

# SiAGA Bunda PRD Addendum

## Inputs and reconciliation posture

- `docs/blueprint.md` supplies the initial product flow, screen concepts, requirements, data model ideas, API ideas, and draft delivery breakdown.
- The completed product brief and addendum narrow the product to an educational Study instrument and establish research, ethics, privacy, consent, and clinical-safety launch gates.
- Draft epics, architecture, schema, APIs, and sprint plans from the blueprint are intentionally not approved here. They remain source material for downstream UX, architecture, and story generation.

## Decisions reserved for architecture

- Expo versus bare React Native and the supported mobile-platform matrix.
- Backend framework, hosting, PostgreSQL deployment, queues, notification provider, video delivery, and observability stack.
- Authentication credential type, token lifetime, secure storage, Researcher step-up authentication, and device-binding policy.
- Exact progress-checkpoint tolerance and anti-forgery algorithm.
- Pseudonymization boundary, key management, backup encryption, audit-store implementation, and controlled-export transport.
- Monorepo/package structure, environments, CI/CD, infrastructure as code, and secrets management.

## Product decisions that architecture must preserve

- The backend owns Learning State, the Server Clock, assessment acceptance, scoring, Video Completion, Posttest scheduling, role authorization, and export authorization.
- All retryable mutations are idempotent; accepted Source Records are immutable and corrections are append-only.
- Notifications are optional delivery hints. Dashboard state remains authoritative.
- The mobile client never contains answer keys, privileged export credentials, or authority to unlock a Module.
- Urgent-care Guidance remains reachable during ordinary Study failures and does not depend on Study completion.
