---
stepsCompleted: []
inputDocuments:
  - prds/prd-siaga-bunda-2026-07-01/prd.md
  - architecture/architecture-siaga-bunda-2026-07-01/ARCHITECTURE-SPINE.md
  - ux-designs/ux-siaga-bunda-2026-07-01/DESIGN.md
  - ux-designs/ux-siaga-bunda-2026-07-01/EXPERIENCE.md
---

# SiAGA Bunda - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for SiAGA Bunda, decomposing the requirements from the finalized PRD, UX design contract, and architecture spine into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The system shall present the active, versioned Study information and Consent text before collecting Study Data.

FR2: The system shall require the approved comprehension check before Consent can be accepted.

FR3: The system shall capture Study Consent separately from push-reminder permission and any secondary data use.

FR4: The system shall collect only fields enabled by the approved Study Protocol.

FR5: When HPHT is required, the system shall calculate HPL and pregnancy age using the clinically approved rule and disclose that the result is an estimate.

FR6: The system shall create a Participant Code and use it by default in Study activity and Researcher views.

FR7: The system shall display all seven Modules with their current Learning State and next valid action.

FR8: The backend shall reject any Learning State transition that violates the ordered protocol.

FR9: The system shall make Urgent-care Guidance accessible from enrollment, Dashboard, Video, assessment, locked, waiting, error, and offline states.

FR10: The system shall replace Study actions with an explanation and support route when participation is blocked, completed, or withdrawn.

FR11: The system shall deliver the active Pretest version assigned to the Participant’s Module before Video access.

FR12: The backend shall accept each assigned Pretest or Posttest submission exactly once under retry and concurrency.

FR13: The backend shall calculate scores using the answer key version assigned with the assessment.

FR14: The system shall prevent Researchers from editing accepted answers, scores, or submission timestamps.

FR15: The Video player shall prevent seeking beyond the latest server-acknowledged position plus the architecture-defined playback tolerance.

FR16: The client shall send ordered progress checkpoints that the backend validates against Video duration, elapsed Server Clock time, session continuity, and prior acknowledgements.

FR17: The system shall resume from the last acknowledged position after app closure, connection loss, crash, or device change.

FR18: The backend shall create Video Completion only after acknowledged coverage reaches the full Video and validated elapsed watch time meets the approved threshold.

FR19: The backend shall set `available_at` to the validated Video Completion time plus 168 elapsed hours.

FR20: The backend shall withhold Posttest content and reject submissions before `available_at`.

FR21: The system shall send reminders only to Participants with current permission and active Study status.

FR22: The Dashboard shall show Posttest availability regardless of push-notification outcome.

FR23: The system shall require individually attributable Researcher authentication and server-side role authorization.

FR24: The Researcher surface shall show aggregate enrollment, current Learning State, upcoming/overdue Posttests, Protocol Deviations, and operational failures.

FR25: An authorized Researcher shall view a Participant Code timeline of Consent status, assessment submissions, Video acknowledgements, schedules, reminders, deviations, withdrawal, and corrections.

FR26: The Researcher shall filter by Module, Learning State, schedule range, deviation, and Participant Code.

FR27: An authorized Researcher shall request a Study Protocol-approved export without using an unrestricted mobile share sheet.

FR28: The system shall provide an accessible withdrawal route and record the approved withdrawal outcome.

FR29: Authorized staff shall track access, correction, deletion, restriction, and consent-revocation requests according to applicable policy.

FR30: The system shall record attributable events for Consent, authentication, role changes, Learning State transitions, Source Record creation, corrections, re-identification, exports, withdrawal, configuration, and content publication.

FR31: The system shall version Consent, Study Protocol configuration, Videos, assessments, scoring keys, Urgent-care Guidance, and translations.

FR32: The system shall provide a Study-approved Participant authentication and account-recovery flow that does not expose pregnancy or Study participation to an unverified person.

FR33: An authorized Study Owner or Clinical Owner shall suspend a Study material version and prevent new exposure without rewriting historical assignments.

FR34: The system shall apply approved retention and disposition rules to Study Data, identifiers, exports, audit records, backups, and vendor-held copies.

FR35: The system shall activate a Study Protocol configuration only after required owner approvals and automated consistency checks pass.

FR36: The system shall provide distinct routes for technical Study support, withdrawal/data requests, and urgent-care needs without diagnosing symptoms.

### NonFunctional Requirements

NFR1: During an active pilot, core Participant and Researcher APIs shall achieve at least 99.5% monthly availability, excluding approved maintenance. The Dashboard must communicate maintenance without implying Study completion failure.

NFR2: Accepted Source Records and Learning State transitions shall use transactionally durable, synchronously replicated persistence with a zero-data-loss objective for acknowledged writes. Derived operational data may use a recovery-point objective of 15 minutes; service recovery-time objective is four hours.

NFR3: On the supported baseline Android device and a stable 4G connection, p95 Dashboard API response shall be under 2 seconds and p95 non-video mutation response under 3 seconds. The UI shall show progress within 300 ms for longer operations.

NFR4: Participant workflows shall meet WCAG 2.2 AA-equivalent mobile criteria, support screen readers and text scaling to 200%, provide 48×48 dp minimum touch targets, never rely on color alone, and include captions/transcripts for Videos.

NFR5: Participant content shall use clinically and ethics-approved Indonesian. Consent and urgent-care content shall undergo comprehension testing with the target population before pilot launch.

NFR6: All network traffic shall use current TLS; sensitive data shall be encrypted at rest; secrets shall not ship in clients; authorization shall be checked server-side for every protected operation; and the release shall have no unresolved critical or high security findings.

NFR7: Study Data shall be purpose-limited, minimized, role-restricted, retained and deleted by policy, and excluded from application logs and analytics unless explicitly approved. A data-flow inventory and privacy impact assessment are pilot gates.

NFR8: Researcher sessions shall use short-lived access credentials, revocable refresh credentials, inactivity expiry, secure local storage, and reauthentication for re-identification and export operations.

NFR9: Every mutation exposed to mobile retry shall be idempotent. State transitions, assessment submission, Video Completion, scheduling, withdrawal, and export requests shall have concurrency tests.

NFR10: The service shall expose redacted metrics and traces for authentication, progress rejection, schedule creation, notification outcomes, export, and state-transition failure with correlation identifiers and alert thresholds defined before pilot.

NFR11: The MVP is Android-only and shall support the two most recent major Android versions represented in the approved pilot device inventory. Each release shall be verified on the lowest-memory, smallest-screen supported device.

NFR12: Hosting region, subprocessors, notification provider, video delivery, backup location, and cross-border transfers require documented Study Owner and privacy approval before real data is used.

NFR13: Audit and Source Record retention periods shall be configured from the approved Study Protocol and legal schedule, with immutable disposition evidence.

NFR14: The product shall fail closed for authorization, early access, invalid transitions, and export; it shall fail open only for access to cached Urgent-care Guidance.

NFR15: Every FR shall map to at least one automated or documented acceptance test. Research-flow invariants shall have API-level tests independent of UI tests.

### Additional Requirements

AR1: Epic 1 Story 1 must scaffold the greenfield pnpm 11/Turborepo monorepo with `apps/mobile`, independently deployable Vercel projects at `apps/api` and `apps/worker`, the shared packages, backend modules, infrastructure, and E2E directories defined by the architecture seed.

AR2: The mobile starter must use Expo SDK 56, React Native 0.85, React 19.2, Android API 36, development builds, Continuous Native Generation, and no production OTA updates.

AR3: The backend must remain one modular-monolith codebase with separate Vercel API and bounded job-function entrypoints, hexagonal module boundaries, import enforcement, and no cross-module table writes.

AR4: `packages/contracts` must define Zod 4 schemas once, generate OpenAPI 3.1, expose glossary enums, and standardize cursor pagination and RFC 9457 errors.

AR5: PostgreSQL transaction time and a single locked Learning State aggregate must own every transition; client time and cached state can never authorize access.

AR6: Every mobile mutation must use UUIDv7 idempotency keys, request-hash conflict detection, response replay, row locking, and final unique constraints.

AR7: Source Record tables must be insert-only with update/delete-denying triggers; corrections append linked records and effective views retain history.

AR8: Use separate Cognito pools in AWS `ap-southeast-1`: Participant SMS OTP and Researcher password plus required TOTP, five-minute access tokens, and local device/session/membership authorization on every request.

AR9: Direct identity data and Study activity must use separate schemas, roles, and service boundaries; re-identification requires role, fresh TOTP step-up, reason, and atomic audit.

AR10: Video delivery must use versioned S3 content, short-lived signed CloudFront access, playback sessions, sequenced 10-second checkpoints, contiguous coverage, elapsed-time bounds, and encoding-only completion tolerances.

AR11: Video Completion and one Posttest schedule must commit atomically, with `available_at` computed from database transaction time plus 168 hours.

AR12: All async effects must use durable PostgreSQL outbox/job tables drained in bounded batches by a once-per-minute Vercel Cron worker, with idempotency, checkpointing, bounded backoff, a `failed_job` poison queue, alerting, and audited replay; Vercel Cron is only a trigger and no job may own Learning State.

AR13: Notification tokens must be installation-bound, lifecycle-revoked, and sent only through approved neutral FCM templates with opaque route nonces.

AR14: Exports must wait for a Research projection watermark, use repeatable-read snapshots, write KMS-encrypted objects to controlled S3 destinations, and never deliver bytes or presigned URLs to mobile.

AR15: Study configuration must version and atomically activate Consent, comprehension, fields, seven Modules, Videos, assessments, keys, Delay, late window, Urgent-care Guidance, support, retention, and exports only after approvals and consistency checks.

AR16: Mobile server cache must remain memory-only; SecureStore may contain scoped credentials, installation ID, and small assessment drafts, while registration/Consent drafts stay memory-only and sensitive state is cleared on lifecycle boundaries.

AR17: Mandatory audit events must append atomically through a security-definer function, use an insert-only role and per-Study/day digest chain, and anchor signed digests to S3 Object Lock.

AR18: Retention must be policy-driven, dry-run first, dual-approved, executed through module-owned disposition ports, and produce immutable evidence across primary, backup, export, and vendor copies.

AR19: Development, Preview, and Production must be isolated; production must run the NestJS API and bounded worker as separate Vercel Pro projects pinned to `sin1`, with Aurora PostgreSQL Serverless v2, S3/CloudFront, Cognito, KMS, Secrets Manager, and CloudWatch in AWS `ap-southeast-1`. Production database access must use Vercel AWS Marketplace OIDC/RDS IAM plus Static IP allowlisting at minimum, or Enterprise Secure Compute when private VPC access is required. Singapore processing and every other vendor transfer require documented Study Owner/privacy approval before real data.

AR20: Delivery must be migration-first and backward-compatible, use a frozen lockfile, signed EAS/Play builds, additive migrations, and delayed cleanup releases for destructive changes.

AR21: Vercel Observability/OpenTelemetry, AWS CloudWatch, logs, traces, jobs, and support codes must propagate one correlation ID while excluding request bodies, answers, tokens, phone numbers, and direct identifiers; alerts must cover cron absence, oldest-due-job age, and poison jobs.

AR22: Researcher aggregates, timelines, deviations, and export inputs must come from one idempotent, rebuildable, pseudonymous event projection with explicit freshness and outbox watermark.

AR23: Vercel Firewall, Cognito, and API-level abuse controls must protect OTP, recovery, playback sessions, submissions, re-identification, exports, and support endpoints without revealing enrollment; cron/job endpoints must validate Vercel's `CRON_SECRET` and application workload authorization.

AR24: Aurora PostgreSQL, content, exports, audit anchors, logs, and backups must use separate KMS purposes; OIDC/RDS IAM must provide short-lived database access, Secrets Manager must own rotating provider secrets, and TLS 1.2+ must protect transport.

AR25: CI must test state transitions, real PostgreSQL behavior, concurrency, contracts, auth, idempotency, time boundaries, Maestro Android flows, migrations, security scans, and FR-to-test traceability.

AR26: Before feature implementation proceeds, CI must deploy `apps/api` and `apps/worker` to Vercel Preview pinned to `sin1` and prove `/health`, one synthetic serializable Aurora transaction, one cron-triggered outbox drain, redacted observability, environment isolation, bundle/payload/duration limits, and rollback to a prior deployment.

### UX Design Requirements

UX-DR1: Implement the complete DESIGN token set for surfaces, ink, Participant primary, Researcher accent, warning, danger, success, outlines, focus, typography, spacing, and radii; all semantic color pairs must preserve the validated AA contrast.

UX-DR2: Implement a light-mode-only Android Material 3 visual layer with warm surfaces, tonal hierarchy, restrained elevation, single-column forms, and no gamification, infantilizing pink, or clinical-reassurance styling.

UX-DR3: Implement App Shell and Top App Bar primitives with one scroll region, safe areas, stable back behavior, and visible Participant Urgent-care access.

UX-DR4: Implement Primary, Secondary, and Danger Button variants with 52dp minimum height, preserved label context during loading, and adjacent reasons for disabled states.

UX-DR5: Implement Text Field with persistent label, appropriate input mode, helper/error text, focus treatment, preserved safe input, and no placeholder-only instructions.

UX-DR6: Implement Choice Row with whole-row targets, single-selection semantics, persisted draft choice, and non-color selected feedback.

UX-DR7: Implement Consent Section with scannable required and optional purposes; opening details must never toggle agreement.

UX-DR8: Implement Status Banner with title, consequence, recovery action, persistence rules, TalkBack announcement, and safe dismissal behavior.

UX-DR9: Implement Module Card with sequence, title, literal Learning State, next action, availability time, and an explanatory detail route for locked content.

UX-DR10: Implement the four-step Progress Stepper using text plus visual state and no implication that percentage equals comprehension.

UX-DR11: Implement Video Player controls for play, pause, replay, captions, transcript, elapsed/total time, constrained scrubber, acknowledged progress, and background interruption.

UX-DR12: Implement Waiting Card with exact localized availability date/time/timezone, backend-boundary refresh, reminder preference, and Dashboard fallback.

UX-DR13: Implement Urgent-care Card and public guidance route that never changes Study state, remains one tap away, supports TalkBack, and uses a bundled approved baseline on first-launch offline.

UX-DR14: Implement State Panel for loading, empty, generic error, offline, stale, partial, permission-denied, and support-code states without dead ends.

UX-DR15: Implement Researcher Summary Card with metric, denominator, last refresh, suppression state, and filtered drill-down.

UX-DR16: Implement Participant Row using Participant Code, Learning State, milestone, and exception only; never show direct identity by default or expose swipe mutations.

UX-DR17: Implement Filter Chip with multi-select semantics, explicit selected state, TalkBack feedback, and a visible clear-all action.

UX-DR18: Implement Timeline Event with Server Clock timestamp, version, result, deviation/correction links, expandable details, and immutable-history presentation.

UX-DR19: Implement Export Panel with template, purpose, destination, approver, expiry, step-up state, job status, audit reference, and no mobile share/download affordance.

UX-DR20: Implement Bottom Sheet for filters and destructive confirmations with one-level depth, restored focus, and protection against accidental destructive dismissal.

UX-DR21: Implement Participant navigation with Beranda and Profil; task surfaces push from them and role state cannot expose Researcher routes or caches.

UX-DR22: Implement Researcher navigation with Ringkasan, Peserta, and Ekspor; Monitoring, Results, Deviations, timeline, and security are explicit drill-downs.

UX-DR23: Implement enrollment states for Study information, Consent, comprehension, registration, closed/ineligible, connection failure, unconfirmed OTP, duplicate enrollment, and superseded/re-consent content.

UX-DR24: Implement Dashboard states for cold load, refresh, offline cache, stale/partial data, locked, waiting, blocked, withdrawn, Study completed, required update, and content suspension.

UX-DR25: Implement assessment states for draft, unanswered review, offline unsent, submission pending, timeout reconciliation, accepted receipt, conflicting duplicate, and hidden/configured score display.

UX-DR26: Implement Video recovery for buffering, network loss, background/crash, storage failure, invalid progress rejection, pending completion, device switching, and material suspension during playback.

UX-DR27: Implement notification flows with one contextual pre-prompt after Video Completion, Android permission handling, denial/settings recovery, neutral previews, authenticated deep-link reconciliation, and no repeated prompt loop.

UX-DR28: Implement withdrawal with neutral consequence copy, cancel/confirm, offline pending state, idempotent reconciliation, participation-ended receipt, reminder cancellation, data-disposition summary, and persistent support/guidance.

UX-DR29: Implement Researcher list/overview states for loading, empty, filtered-empty, stale, partial, suppressed aggregate, no deviations, revoked session, and unauthorized re-identification.

UX-DR30: Implement export states for step-up required, queued, generating, approval required, ready, failed, expired, and revoked while preserving the request form safely.

UX-DR31: Honor Android Back, pull-to-refresh only on read surfaces, explicit pagination, keyboard field order, no implicit Enter submission, and foreground concurrency reconciliation.

UX-DR32: Encrypt and scope permitted local drafts, obscure authenticated content in Android recents, block screenshots on Researcher/re-identification/export surfaces, and clear state on submission or account/session lifecycle changes.

UX-DR33: Meet the accessibility floor: TalkBack role/name/state/position, reading-order focus, linked error summary, 48dp targets with 8dp separation for risky actions, 200% text, non-color meaning, Reduce Motion, captions/transcript, and extendable timeouts.

UX-DR34: Support portrait widths from 320dp, landscape Video, operable landscape elsewhere, centered 600dp tablet reading column, and at most two Researcher summary columns when scaling permits.

UX-DR35: Use approved plain Indonesian with `Anda` by default, exact date/time copy, non-blaming recovery, no pressure language, and no “healthy,” “safe,” or “normal” conclusion from Study completion or scores.

UX-DR36: Implement all five named PRD journeys end-to-end, including their documented climax and failure path, using the spine contracts rather than inventing alternate navigation.

### FR Coverage Map

{{requirements_coverage_map}}

## Epic List

{{epics_list}}
