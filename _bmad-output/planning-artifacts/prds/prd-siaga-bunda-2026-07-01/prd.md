---
title: SiAGA Bunda Product Requirements Document
status: final
created: 2026-07-01
updated: 2026-07-01
source_brief: ../../briefs/brief-siaga-bunda-2026-07-01/brief.md
---

# PRD: SiAGA Bunda

## 0. Document purpose

This PRD defines the MVP behavior and quality bounds for SiAGA Bunda, a mobile maternal-health education and research-support product. It is the contract for UX, architecture, epics, stories, implementation, and QA. The source [blueprint](../../../../docs/blueprint.md) is input rather than an approved specification; the [product brief](../../briefs/brief-siaga-bunda-2026-07-01/brief.md) and its [addendum](../../briefs/brief-siaga-bunda-2026-07-01/addendum.md) establish the safety and governance posture. Domain terms are defined in §3, Functional Requirements (FRs) are grouped by feature, and unresolved external approvals are launch gates rather than silent product assumptions.

## 1. Vision and product thesis

SiAGA Bunda gives pregnant Participants a simple, auditable way to learn pregnancy danger signs through seven ordered Modules. Each Module follows the same protocol: Pretest, complete Video exposure, a seven-day Delay, Posttest, then access to the next Module. Researchers can monitor protocol progress and export approved Study Data from a mobile-first surface.

The product thesis is narrow: a guided mobile flow with server-authoritative transitions can improve protocol adherence and data traceability while preserving Participant autonomy. It does not prove attention, comprehension, research validity, or clinical effectiveness. The product is educational, not diagnostic, and must never delay urgent care.

## 2. Users, jobs, and journeys

### 2.1 Jobs to be done

- A Participant needs to understand what the Study involves, consent voluntarily, complete each required activity with clear status, recover from interruptions, and know how to seek urgent care.
- A Researcher needs to identify progress, missing activity, Protocol Deviations, and operational failures without changing Source Records.
- A Study Owner needs versioned, auditable Study Data whose collection matches an approved Study Protocol.
- A Clinical Owner needs control over educational content and urgent-care language so the app cannot be mistaken for diagnosis or reassurance.

### 2.2 Non-users in the MVP

The MVP is not for clinicians delivering care, emergency dispatchers, public self-service users outside the Study, or participants unable to use the approved language and Consent process without a separately approved supported-consent pathway.

### 2.3 Key user journeys

- **UJ-1 — Sari enrolls with informed consent.** Sari opens the Participant surface, reads plain-language Study information, passes a comprehension check, consents to required processing, chooses optional reminder preferences separately, enters only protocol-required data, and receives a Participant Code. If she declines, no Study account or Study Data is created beyond the minimum evidence required by the approved screening policy.
- **UJ-2 — Sari completes a Module.** From the Dashboard, Sari opens the first available Module, completes its Pretest, watches the Video without forward seeking, and sees that the Posttest becomes available after the Delay. When the Posttest is available, she submits it and the next Module unlocks. At every step, urgent-care guidance remains reachable without completing Study activities.
- **UJ-3 — Dewi recovers after interruption.** Dewi loses connectivity and closes the app during a Video. On return, the app reconciles acknowledged progress with the Server Clock, resumes from the last validated position, explains any unacknowledged loss, and never grants completion from device-only state.
- **UJ-4 — Rina monitors the Study.** Rina signs in as a Researcher, sees aggregate progress and operational exceptions, opens a pseudonymized Participant timeline, and requests an approved export. She cannot edit Consent, answers, scores, timestamps, or Learning State.
- **UJ-5 — Sari withdraws.** Sari opens Study help, reviews withdrawal consequences, confirms withdrawal or contacts the Study team, and immediately stops future reminders and Study activities. Her data disposition follows the approved Consent version and Study Protocol and is recorded without rewriting prior Source Records.

## 3. Glossary

- **Participant** — A person enrolled in the Study and using the Participant surface.
- **Researcher** — An authorized Study team member using the Researcher surface.
- **Study Owner** — The accountable owner of the Study Protocol and research operations.
- **Clinical Owner** — The accountable approver for educational and urgent-care content.
- **Study** — The approved research activity supported by SiAGA Bunda.
- **Study Protocol** — The externally approved definition of eligibility, procedures, timing, instruments, analysis, deviations, withdrawal, and data disposition.
- **Consent** — A versioned record of informed, comprehended, voluntary agreement for a defined processing purpose.
- **Participant Code** — The pseudonymous identifier shown in research workflows instead of direct identifiers.
- **Module** — One ordered learning unit containing a Pretest, Video, Delay, and Posttest.
- **Pretest** — The versioned assessment completed before a Module Video.
- **Video** — The versioned educational media item in a Module.
- **Delay** — The server-authoritative interval from validated Video Completion to Posttest availability. For the MVP, seven days means 168 elapsed hours.
- **Posttest** — The versioned assessment available only after the Delay.
- **Video Completion** — Server-accepted evidence that the Participant viewed the full Video without unvalidated forward progress.
- **Learning State** — The server-authoritative state of a Participant within a Module.
- **Server Clock** — Backend time used for schedules, transitions, and audit events; device time is display-only.
- **Source Record** — An immutable original Consent, answer, score, progress acknowledgement, or event timestamp.
- **Protocol Deviation** — A recorded departure from the Study Protocol that remains visible for review.
- **Study Data** — Data collected or derived for the Study, including Source Records and approved metadata.
- **Urgent-care Guidance** — Clinically approved instructions for obtaining care; it is not diagnosis or triage.

## 4. Features and functional requirements

### 4.1 Enrollment, Consent, and identity separation

**Description:** The Participant enters through a Study-specific enrollment flow. Consent is required and versioned; optional purposes are separate. Direct identifiers are minimized and separated from research activity wherever feasible. Realizes UJ-1 and UJ-5.

#### FR-1: Present approved Study information

The system shall present the active, versioned Study information and Consent text before collecting Study Data.

**Acceptance criteria:**
- The screen includes purpose, procedures, duration, foreseeable risks and benefits, voluntariness, withdrawal, data uses, contacts, and urgent-care boundaries.
- The accepted Consent version, language, timestamp, and Participant identity are recorded as a Source Record.
- A superseded Consent version cannot be used for new enrollment.
- Declining Consent stores no direct identifier; only a non-identifying aggregate outcome may be recorded when the approved Study Protocol requires it.

#### FR-2: Verify Consent comprehension

The system shall require the approved comprehension check before Consent can be accepted.

**Acceptance criteria:**
- Failed comprehension does not create an enrolled account or unlock Study activity.
- Retry, assisted-consent, and exclusion behavior is driven by Study Protocol configuration and recorded.
- Passing answers and the check version are auditable.

#### FR-3: Separate required and optional agreement

The system shall capture Study Consent separately from push-reminder permission and any secondary data use.

**Acceptance criteria:**
- Declining optional purposes does not block enrollment unless the approved Study Protocol explicitly requires that purpose.
- Each purpose has its own version, status, and timestamp.
- Revoking an optional purpose takes effect without rewriting the original Consent record.

#### FR-4: Collect minimum necessary profile data

The system shall collect only fields enabled by the approved Study Protocol.

**Acceptance criteria:**
- Exact address, medical history, birth history, complication history, and partner support are disabled by default.
- Every enabled field has a documented purpose, validation rule, access classification, export rule, and retention rule.
- Required-field errors use plain Indonesian and preserve already entered non-sensitive values.

#### FR-5: Calculate pregnancy dates transparently

When HPHT is required, the system shall calculate HPL and pregnancy age using the clinically approved rule and disclose that the result is an estimate.

**Acceptance criteria:**
- The formula version and input date are stored with the derived values.
- Invalid, unknown, or clinically exceptional inputs do not produce false precision and direct the Participant to a qualified professional.
- Device clock changes do not alter stored calculations.

#### FR-6: Create separated Participant identity

The system shall create a Participant Code and use it by default in Study activity and Researcher views.

**Acceptance criteria:**
- Direct identifiers are not included in assessment, progress, or analytics records unless explicitly required.
- Re-identification access is limited to authorized roles and audited.
- Duplicate enrollment handling never merges Source Records automatically.

### 4.2 Dashboard and Learning State

**Description:** The Dashboard explains the next valid action and all Module states. The backend accepts only defined transitions; client state cannot unlock content. Realizes UJ-2 and UJ-3.

#### FR-7: Show ordered Module status

The system shall display all seven Modules with their current Learning State and next valid action.

**Acceptance criteria:**
- Locked, Pretest required, Video available, Video in progress, waiting Posttest, Posttest available, completed, and blocked states are visually and textually distinct.
- Locked and waiting states explain why and when the next action becomes possible.
- Status refreshes from the backend after sign-in, foregrounding, and relevant actions.

#### FR-8: Enforce state transitions

The backend shall reject any Learning State transition that violates the ordered protocol.

**Acceptance criteria:**
- A Video cannot start before its Pretest is submitted.
- A Posttest cannot be fetched or submitted before the Delay ends.
- Module N+1 cannot start before Module N Posttest is accepted.
- Rejected attempts create security or Protocol Deviation events without changing Learning State.

#### FR-9: Preserve urgent-care access

The system shall make Urgent-care Guidance accessible from enrollment, Dashboard, Video, assessment, locked, waiting, error, and offline states.

**Acceptance criteria:**
- Access never depends on Study progress or connectivity for the last approved cached guidance.
- Opening guidance does not mark a Study task complete or generate a clinical conclusion.
- Guidance displays its version and emergency contact information approved for the deployment location.

#### FR-10: Handle blocked and withdrawn states

The system shall replace Study actions with an explanation and support route when participation is blocked, completed, or withdrawn.

**Acceptance criteria:**
- A withdrawn Participant cannot start or submit new Study activity.
- A temporary operational block preserves Source Records and shows a non-blaming recovery message.
- Study completion does not imply clinical clearance or absence of danger signs.

### 4.3 Assessments and scoring

**Description:** Each assessment is versioned, submitted idempotently, scored consistently, and immutable after acceptance. Realizes UJ-2 and UJ-3.

#### FR-11: Deliver the assigned Pretest

The system shall deliver the active Pretest version assigned to the Participant’s Module before Video access.

**Acceptance criteria:**
- Question order and navigation follow Study Protocol configuration.
- Required unanswered items block submission with an accessible explanation.
- Starting or saving answers does not unlock the Video.

#### FR-12: Accept an assessment once

The backend shall accept each assigned Pretest or Posttest submission exactly once under retry and concurrency.

**Acceptance criteria:**
- Repeating the same idempotency key returns the original result without duplicate Source Records.
- Conflicting duplicate payloads are rejected and audited.
- A network timeout can be reconciled without asking the Participant to guess whether submission succeeded.

#### FR-13: Score against the assigned key

The backend shall calculate scores using the answer key version assigned with the assessment.

**Acceptance criteria:**
- Score calculation is deterministic and covered by golden test vectors approved by the Study Owner.
- Later question or key changes do not alter historical scores.
- Participant-facing score display is configurable and off by default pending Study Protocol approval.

#### FR-14: Protect assessment Source Records

The system shall prevent Researchers from editing accepted answers, scores, or submission timestamps.

**Acceptance criteria:**
- Corrections are append-only, attributable, reasoned, and limited to an approved role.
- Original and corrected values remain retrievable in the audit history.
- Researcher APIs reject direct mutation of Source Records.

### 4.4 Controlled Video exposure

**Description:** The player permits pause, resume, and replay of acknowledged content but not forward progress beyond the validated watch position. Completion is server-validated. Realizes UJ-2 and UJ-3.

#### FR-15: Restrict forward seeking

The Video player shall prevent seeking beyond the latest server-acknowledged position plus a small playback tolerance defined by architecture.

**Acceptance criteria:**
- Pause, resume, and replay of previously acknowledged content remain available.
- OS media controls, playback rate, scrub gestures, and client requests cannot grant forward progress.
- Accessibility controls remain operable without creating a bypass.

#### FR-16: Acknowledge progress idempotently

The client shall send ordered progress checkpoints that the backend validates against Video duration, elapsed Server Clock time, session continuity, and prior acknowledgements.

**Acceptance criteria:**
- Duplicate and out-of-order checkpoints do not inflate progress.
- Implausible progress is rejected and recorded without silently penalizing legitimate interruption.
- Reinstall, device switching, and device-clock changes cannot increase acknowledged position.

#### FR-17: Recover interrupted playback

The system shall resume from the last acknowledged position after app closure, connection loss, crash, or device change.

**Acceptance criteria:**
- The Participant sees the acknowledged resume point before playback restarts.
- Unacknowledged local progress is not represented as saved.
- Temporary connectivity loss follows the approved buffering/retry policy and cannot create Video Completion offline.

#### FR-18: Validate Video Completion

The backend shall create Video Completion only after acknowledged coverage reaches the full Video and validated elapsed watch time meets the approved threshold.

**Acceptance criteria:**
- Client completion events alone cannot create Video Completion.
- Completion is idempotent and records Video version, first start, completion time, acknowledged duration, and validation outcome.
- Video Completion atomically starts the Delay once.

### 4.5 Delay, Posttest availability, and reminders

**Description:** The Server Clock determines availability. Notifications are optional hints; the Dashboard is authoritative. Realizes UJ-2 and UJ-3.

#### FR-19: Schedule the Posttest

The backend shall set `available_at` to the validated Video Completion time plus 168 elapsed hours.

**Acceptance criteria:**
- Scheduling is atomic with Video Completion and idempotent.
- Device time, timezone, daylight-saving changes, and notification status cannot advance availability.
- The Participant sees the localized availability date and time derived from `available_at`.

#### FR-20: Enforce Posttest availability

The backend shall withhold Posttest content and reject submissions before `available_at`.

**Acceptance criteria:**
- Direct API calls and cached client routes cannot retrieve questions early.
- At or after `available_at`, availability does not depend on notification delivery.
- Late completion remains available according to the Study Protocol window and is labeled for deviation analysis when applicable.

#### FR-21: Send privacy-safe reminders

The system shall send reminders only to Participants with current permission and active Study status.

**Acceptance criteria:**
- Lock-screen text is neutral and contains no pregnancy, health, assessment, or Study detail by default.
- Revocation, logout, withdrawal, invalid tokens, and device reassignment stop future delivery.
- Delivery attempts, provider responses, retries, and final outcomes are auditable.

#### FR-22: Provide reminder fallback

The Dashboard shall show Posttest availability regardless of push-notification outcome.

**Acceptance criteria:**
- Notification denial or failure never blocks progression.
- The Dashboard refreshes availability using the Server Clock.
- Support can distinguish schedule failure from delivery failure without seeing assessment answers.

### 4.6 Researcher monitoring and controlled export

**Description:** The Researcher surface is mobile-first, pseudonymous by default, least-privileged, and read-only for Source Records. Realizes UJ-4.

#### FR-23: Authenticate and authorize Researchers

The system shall require individually attributable Researcher authentication and server-side role authorization.

**Acceptance criteria:**
- Shared Researcher accounts are prohibited.
- Participant sessions cannot access Researcher APIs or screens.
- Repeated failure, session expiry, revocation, and lost-device response follow the security policy.

#### FR-24: Show operational Study overview

The Researcher surface shall show aggregate enrollment, current Learning State, upcoming/overdue Posttests, Protocol Deviations, and operational failures.

**Acceptance criteria:**
- Counts define their denominator and last-refresh time.
- Small-cell suppression and role rules prevent unintended re-identification.
- Empty, loading, stale, partial, and error states are explicit.

#### FR-25: Show a pseudonymized Participant timeline

An authorized Researcher shall view a Participant Code timeline of Consent status, assessment submissions, Video acknowledgements, schedules, reminders, deviations, withdrawal, and corrections.

**Acceptance criteria:**
- Direct identifiers are hidden unless the role and task require re-identification.
- Source answers are hidden from roles not approved to view them.
- Every re-identification and sensitive detail view is audited.

#### FR-26: Filter and locate records safely

The Researcher shall filter by Module, Learning State, schedule range, deviation, and Participant Code.

**Acceptance criteria:**
- Search does not expose results across Study or role boundaries.
- Pagination and filters remain stable during refresh.
- No filter permits inference of suppressed sensitive groups.

#### FR-27: Request controlled export

An authorized Researcher shall request a Study Protocol-approved export without using an unrestricted mobile share sheet.

**Acceptance criteria:**
- Export templates define allowed columns, pseudonymization, purpose, approving role, destination, retention, and expiry.
- Generation and retrieval are separately authorized and fully audited.
- Raw direct identifiers, Consent evidence, tokens, secrets, and unnecessary event payloads are excluded by default.
- Revoked or expired exports cannot be retrieved.

### 4.7 Withdrawal, data rights, and auditability

**Description:** Participation remains voluntary, data rights are operable, and important actions are attributable without mutable history. Realizes UJ-5 and supports all journeys.

#### FR-28: Support withdrawal

The system shall provide an accessible withdrawal route and record the approved withdrawal outcome.

**Acceptance criteria:**
- Withdrawal immediately blocks new Study activity and reminders.
- The Participant sees the approved explanation of retained, deleted, or anonymized data and a Study contact.
- Withdrawal does not require completing an assessment or contacting a partner/family member.

#### FR-29: Process data-subject requests

Authorized staff shall track access, correction, deletion, restriction, and consent-revocation requests according to applicable policy.

**Acceptance criteria:**
- Requests have identity verification, status, deadline, decision, and completion evidence.
- Legal or Study retention exceptions are reasoned and communicated through the approved process.
- Fulfillment covers primary stores, caches, exports, backups, and vendors according to policy.

#### FR-30: Maintain append-only audit events

The system shall record attributable events for Consent, authentication, role changes, Learning State transitions, Source Record creation, corrections, re-identification, exports, withdrawal, configuration, and content publication.

**Acceptance criteria:**
- Audit events include actor, action, target, result, Server Clock timestamp, correlation identifier, and reason where required.
- Application roles cannot alter or delete audit history.
- Audit payloads avoid unnecessary direct identifiers and secrets.

#### FR-31: Version Study materials

The system shall version Consent, Study Protocol configuration, Videos, assessments, scoring keys, Urgent-care Guidance, and translations.

**Acceptance criteria:**
- Each Source Record resolves to the exact versions presented or applied.
- Publishing a new version does not mutate historical assignments.
- Activation requires the approvals configured for Study Owner, Clinical Owner, and privacy roles.

### 4.8 Operational safeguards

**Description:** Account recovery, content suspension, retention, configuration activation, and safety contacts must preserve Study boundaries during operational change or incident response. Supports all journeys.

#### FR-32: Authenticate and recover Participant access

The system shall provide a Study-approved Participant authentication and account-recovery flow that does not expose pregnancy or Study participation to an unverified person.

**Acceptance criteria:**
- Enrollment binds the Participant Code to an approved credential without using predictable pregnancy or identity facts as secrets.
- Recovery verifies the Participant through the approved channel, invalidates displaced sessions, and is audited.
- Failed recovery does not reveal whether a phone number or identity is enrolled.

#### FR-33: Suspend unsafe or invalid Study material

An authorized Study Owner or Clinical Owner shall suspend a Study material version and prevent new exposure without rewriting historical assignments.

**Acceptance criteria:**
- Suspension immediately blocks new starts and explains the operational hold without clinical reassurance.
- In-progress handling follows a versioned incident decision and records affected Participants.
- Re-publication requires configured approvals and creates a new active version or documented reinstatement event.

#### FR-34: Enforce retention and disposition

The system shall apply approved retention and disposition rules to Study Data, identifiers, exports, audit records, backups, and vendor-held copies.

**Acceptance criteria:**
- Each data class has an approved retention trigger, period, disposition, and exception authority.
- Disposition jobs are idempotent, produce immutable evidence, and surface failures for remediation.
- Anonymization claims require a documented method and verification; otherwise data remains classified as personal.

#### FR-35: Activate Study configuration safely

The system shall activate a Study Protocol configuration only after required owner approvals and automated consistency checks pass.

**Acceptance criteria:**
- Checks cover seven ordered Modules, assigned material versions, scoring keys, Delay, late window, Consent, Urgent-care Guidance, roles, retention, and export template.
- Activation is atomic, versioned, and auditable; partial configuration cannot enroll Participants.
- Material changes after enrollment create a new configuration version and follow the approved migration or re-consent decision.

#### FR-36: Route support and safety contacts

The system shall provide distinct routes for technical Study support, withdrawal/data requests, and urgent-care needs without diagnosing symptoms.

**Acceptance criteria:**
- Contact routes and hours are deployment-configured, versioned, and available from all Participant states.
- A technical support interaction cannot grant Learning State transitions or alter Source Records.
- Safety contacts follow the approved escalation procedure and record only the minimum Study event metadata required by policy.

## 5. Cross-cutting non-functional requirements

- **NFR-1 Availability:** During an active pilot, core Participant and Researcher APIs shall achieve at least 99.5% monthly availability, excluding approved maintenance. The Dashboard must communicate maintenance without implying Study completion failure.
- **NFR-2 Durability:** Accepted Source Records and Learning State transitions shall use transactionally durable, synchronously replicated persistence with a zero-data-loss objective for acknowledged writes. Derived operational data may use a recovery-point objective of 15 minutes; service recovery-time objective is four hours.
- **NFR-3 Performance:** On the supported baseline Android device and a stable 4G connection, p95 Dashboard API response shall be under 2 seconds and p95 non-video mutation response under 3 seconds. The UI shall show progress within 300 ms for longer operations.
- **NFR-4 Accessibility:** Participant workflows shall meet WCAG 2.2 AA-equivalent mobile criteria, support screen readers and text scaling to 200%, provide 48×48 dp minimum touch targets, never rely on color alone, and include captions/transcripts for Videos.
- **NFR-5 Language and comprehension:** Participant content shall use clinically and ethics-approved Indonesian. Consent and urgent-care content shall undergo comprehension testing with the target population before pilot launch.
- **NFR-6 Security:** All network traffic shall use current TLS; sensitive data shall be encrypted at rest; secrets shall not ship in clients; authorization shall be checked server-side for every protected operation; and the release shall have no unresolved critical or high security findings.
- **NFR-7 Privacy:** Study Data shall be purpose-limited, minimized, role-restricted, retained and deleted by policy, and excluded from application logs and analytics unless explicitly approved. A data-flow inventory and privacy impact assessment are pilot gates.
- **NFR-8 Session safety:** Researcher sessions shall use short-lived access credentials, revocable refresh credentials, inactivity expiry, secure local storage, and reauthentication for re-identification and export operations.
- **NFR-9 Reliability:** Every mutation exposed to mobile retry shall be idempotent. State transitions, assessment submission, Video Completion, scheduling, withdrawal, and export requests shall have concurrency tests.
- **NFR-10 Observability:** The service shall expose redacted metrics and traces for authentication, progress rejection, schedule creation, notification outcomes, export, and state-transition failure with correlation identifiers and alert thresholds defined before pilot.
- **NFR-11 Compatibility:** The MVP is Android-only and shall support the two most recent major Android versions represented in the approved pilot device inventory. Each release shall be verified on the lowest-memory, smallest-screen supported device.
- **NFR-12 Data location and vendors:** Hosting region, subprocessors, notification provider, video delivery, backup location, and cross-border transfers require documented Study Owner and privacy approval before real data is used.
- **NFR-13 Audit retention:** Audit and Source Record retention periods shall be configured from the approved Study Protocol and legal schedule, with immutable disposition evidence.
- **NFR-14 Safe failure:** The product shall fail closed for authorization, early access, invalid transitions, and export; it shall fail open only for access to cached Urgent-care Guidance.
- **NFR-15 Testability:** Every FR shall map to at least one automated or documented acceptance test. Research-flow invariants shall have API-level tests independent of UI tests.

## 6. Constraints, approvals, and safety guardrails

### 6.1 Research and ethics

- The accredited ethics committee, Study Protocol identifier, eligibility, sample, primary endpoint, instruments, analysis, missing-data treatment, compensation, deviation policy, and adverse-event process must be approved before pilot recruitment.
- Seven Modules and the 168-hour Delay are product defaults derived from the blueprint and must match the approved Study Protocol before activation.
- “Research compliant,” “valid,” and clinical-effectiveness claims are prohibited unless supported by the responsible authority and evidence.

### 6.2 Clinical safety

- The Clinical Owner must approve every Video, assessment item, answer key, pregnancy calculation, and Urgent-care Guidance version.
- The app does not collect symptoms for diagnosis or provide personalized reassurance. A report or recognition of a danger sign routes to approved urgent-care instructions, not a Study workflow.
- Content review dates, withdrawal of unsafe content, safety-signal intake, and incident escalation must exist before pilot launch.

### 6.3 Consent and Participant autonomy

- Consent is required, versioned, comprehended, and revocable; a checkbox alone is insufficient.
- Study progression may be constrained, but participation may not be. Withdrawal is available at all times without penalty or partner authorization.
- Researcher follow-up, reminders, and compensation must not create undue pressure and must follow the approved Study Protocol.

### 6.4 Privacy and governance

- The legal data controller, lawful processing bases, data-subject process, retention schedule, breach process, vendor contracts, data location, and cross-border posture require qualified review.
- Health and pregnancy data are handled as sensitive Study Data. Researchers see pseudonymous data by default, and exports use controlled destinations.
- Production-like testing uses synthetic data until all pilot gates pass.

## 7. Non-goals and MVP scope

### 7.1 In scope

- One Study configuration with seven ordered Modules.
- Participant enrollment, Consent, profile, Dashboard, assessments, controlled Video playback, Delay, reminders, Posttest, withdrawal, and support.
- Mobile-first Researcher authentication, overview, pseudonymized timeline, filtering, deviations, and controlled export.
- Backend authority for time, Learning State, scoring, progress validation, scheduling, audit, and permissions.
- Operational tooling required to publish approved versions and respond to incidents, even if it is not a polished public dashboard.

### 7.2 Explicitly out of scope

- Diagnosis, symptom triage, personalized care recommendations, clinical monitoring, telemedicine, or emergency dispatch.
- Chat, community, payments, advertisements, AI assistants, or engagement gamification.
- Uncontrolled offline Video completion or offline assessment submission.
- Researcher mutation of Source Records or unrestricted local export sharing.
- iOS support in the MVP; the initial pilot is Android-only and must define a supported device inventory.
- Multiple simultaneous studies, complex organization hierarchies, or general-purpose learning-platform features.
- Claims of improved maternal or fetal outcomes in the MVP.

## 8. Success metrics and counter-metrics

### 8.1 Release and protocol integrity

- **SM-1:** 100% of automated invariant tests reject Pretest bypass, forward-progress forgery, early Posttest access, duplicate submission effects, premature Module unlock, unauthorized Researcher access, and unapproved export. Validates FR-8, FR-12, FR-15–FR-20, FR-23, FR-27.
- **SM-2:** 100% of accepted Consent, assessment, Video Completion, schedule, withdrawal, correction, re-identification, and export events resolve to actor, Server Clock time, and applicable content/configuration versions in the pilot audit sample. Validates FR-1–FR-3, FR-12–FR-14, FR-18–FR-21, FR-25, FR-27–FR-31.
- **SM-3:** Zero unresolved critical/high security or clinical-safety findings at pilot release. Validates NFR-6 and §6.

### 8.2 Participant and research outcomes

- **SM-4:** Enrollment comprehension-pass, Module completion, Delay-to-Posttest completion, attrition, withdrawal, and Protocol Deviation rates are reported with denominators and predefined cohort cuts; numeric targets must be supplied by the Study Owner before pilot activation. Validates FR-1–FR-22 and FR-28.
- **SM-5:** Pretest/Posttest completeness and prespecified knowledge-change results are computable using the approved analysis plan; the product does not define a favorable effect target. Validates FR-11–FR-14 and FR-20.
- **SM-6:** At least 95% of moderated pilot participants complete enrollment and one Module without facilitator correction; failures are classified by literacy, accessibility, device, connectivity, and shared-device context. Validates UJ-1–UJ-3.

### 8.3 Counter-metrics

- **SM-C1:** Do not maximize completion by obscuring withdrawal, over-notifying, or weakening comprehension checks.
- **SM-C2:** Do not maximize recorded watch duration; it is exposure evidence, not proof of attention or benefit.
- **SM-C3:** Do not minimize Protocol Deviations by deleting, rewriting, or excluding inconvenient records.
- **SM-C4:** Do not increase researcher convenience through broader identifiers, weaker export controls, or Source Record mutation.

## 9. Failure states and edge cases

- Enrollment: declined or failed Consent, duplicate phone, unsupported minor/supported-consent case, unknown HPHT, partial registration, and superseded Consent.
- Session/device: lost or replaced phone, shared device, revoked researcher access, token reuse, simultaneous sessions, reinstall, and app downgrade.
- Playback: poor connectivity, buffering, backgrounding, phone call interruption, crash, media-control seek, duration mismatch, Video version withdrawal, and out-of-order checkpoints.
- Time/schedule: device-clock manipulation, timezone travel, exact-boundary requests, delayed jobs, duplicate jobs, outage across `available_at`, and late Posttest.
- Assessment: incomplete answers, double tap, timeout after acceptance, conflicting retry, stale question version, and score-key correction.
- Notification: permission denied, token invalid, delivery delayed, duplicate reminder, sensitive lock-screen preview, and device reassignment.
- Researcher: empty or stale aggregates, suppressed small cells, unauthorized re-identification, export expiry, interrupted generation, and destination failure.
- Safety/privacy: danger sign recognized mid-task, unsafe content recalled, accidental identifier exposure, data-subject request, breach, withdrawal during an in-flight request, and vendor outage.

## 10. Open questions and external gates

These do not prevent UX or architecture work when treated as configurable policies, but they block real Participant recruitment or production Study Data:

1. Which Study Protocol and accredited ethics committee approval govern the pilot?
2. Who are the named Study Owner, Clinical Owner, data controller, privacy owner, and security incident owner?
3. Are minors or Participants requiring supported consent eligible?
4. Which profile fields, assessment instruments, Video versions, score-display behavior, late window, follow-up rules, and numeric research targets are approved?
5. Which Android devices, Indonesian language variants, accessibility needs, and connectivity conditions define the supported pilot population?
6. What are the approved hosting region, vendors, retention periods, export destination, breach procedure, and data-subject workflow?
7. What urgent-care contacts and escalation instructions apply to the recruitment location?

## 11. Assumptions index

No unresolved product assumptions remain. The 168-hour Delay and Android-only MVP are explicit product decisions; external Study approvals remain listed in §10.
