---
name: SiAGA Bunda
status: final
sources:
  - ../../prds/prd-siaga-bunda-2026-07-01/prd.md
  - ../../briefs/brief-siaga-bunda-2026-07-01/brief.md
updated: 2026-07-01
---

# SiAGA Bunda — Experience Spine

## Foundation

Android-only mobile MVP with role-separated Participant and Researcher experiences. Navigation and controls follow Material 3 conventions; [DESIGN.md](./DESIGN.md) owns visual identity and tokens. This spine owns information architecture, behavior, state, interaction, language, accessibility, and flow. The app is educational and research-facing, never diagnostic. The Server Clock and backend Learning State are authoritative.

The product may ship as one binary with mutually exclusive authenticated roles, but role selection is not a casual switch: a Participant session cannot expose Researcher routes, cached data, or navigation. Study configuration and publication are internal operational workflows, not part of the polished mobile navigation.

## Information Architecture

### Public and shared surfaces

| Surface | Reached from | Purpose |
|---|---|---|
| Launch and orientation | Cold open | Explain Study-bound purpose; enter Participant enrollment or Researcher sign-in |
| Urgent-care Guidance | Persistent action from all Participant surfaces | Show approved care-seeking instruction without diagnosis or Study gating |
| Study support | Help action | Separate technical support, withdrawal/data requests, and urgent-care contacts |
| Session recovery | Sign-in/recovery link or expired session | Recover verified access without revealing enrollment status |

### Participant surfaces

| Surface | Reached from | Purpose |
|---|---|---|
| Study information | Orientation | Explain purpose, procedures, duration, risk, benefit, autonomy, contacts, and data use |
| Consent review | Study information | Review required Consent and separate optional purposes |
| Comprehension check | Consent review | Verify understanding before acceptance |
| Registration | Passed comprehension | Collect only Study-configured identity and pregnancy fields |
| Dashboard | Successful enrollment / returning Participant | Show all seven Module cards, next action, schedule, support, and withdrawal access |
| Module detail | Module card | Explain current Learning State and the four-step sequence |
| Assessment intro | Module detail | Explain question count, completion behavior, and whether score is shown |
| Assessment questions | Assessment intro | Complete one Pretest or Posttest with persistent local draft state |
| Assessment review | Last question | Resolve unanswered items and confirm one-time submission |
| Assessment receipt | Accepted submission | Confirm acceptance and show next valid action, never clinical meaning |
| Video | Accepted Pretest / resume action | Watch, pause, replay, use captions/transcript, and recover acknowledged progress |
| Video receipt | Validated Video Completion | Confirm exposure and explain the 168-hour Delay |
| Waiting | Dashboard / Module detail | Show localized Posttest availability and optional reminder status |
| Notification preference | Waiting / profile | Explain neutral notifications and open Android permission prompt contextually |
| Profile and Study choices | Dashboard account action | View Participant Code, Consent versions, optional purposes, support, and withdrawal |
| Withdrawal | Profile / support | Explain consequence, confirm intent, and stop future Study activity/reminders |
| Participation ended | Withdrawal/completion/block | Show final status, approved data-disposition message, support, and Urgent-care Guidance |

### Researcher surfaces

| Surface | Reached from | Purpose |
|---|---|---|
| Researcher sign-in | Orientation | Individually attributable authentication and recovery |
| Researcher overview | Sign-in | Aggregate enrollment, Learning State, schedules, deviations, and operational failures |
| Participant list | Overview metric / navigation | Paginated, pseudonymous monitoring with filters |
| Participant timeline | Participant row | Auditable Source Record events, versions, schedules, deviations, and withdrawal |
| Module monitoring | Overview / navigation | Compare progress and exceptions by Module |
| Results summary | Overview / navigation | Approved aggregate Pretest/Posttest reporting with denominators |
| Deviations and failures | Overview alert | Review invalid transitions, schedule, notification, content, and operational exceptions |
| Export requests | Overview / navigation | Request approved template to controlled destination and monitor status |
| Researcher session/security | Account action | End sessions, reauthenticate, and view support/security contacts |

Participant bottom navigation has two destinations: **Beranda** and **Profil**. Module, assessment, Video, waiting, support, and Consent are pushed or modal task surfaces. Researcher bottom navigation has **Ringkasan**, **Peserta**, and **Ekspor**; Monitoring, Results, and Deviations are Overview drill-downs. No drawer and no nested modal stack.

Surface closure: every PRD journey and FR-facing user need has a surface. Internal Study publication and retention jobs have no end-user surface and are specified downstream as controlled operational tooling.

## Voice and Tone

Participant microcopy is plain Indonesian, respectful, non-blaming, and direct. Use **Anda** by default. Use **Ibu {name}** only if the approved content and Participant preference support it. Researcher copy uses concise operational nouns and verbs without implying clinical judgment.

| Situation | Use | Avoid |
|---|---|---|
| Locked Module | “Selesaikan posttest Modul 1 untuk membuka modul berikutnya.” | “Akses ditolak.” |
| Waiting | “Posttest tersedia 8 Juli 2026, 14.30 WIB.” | “Kembali dalam 7 hari.” |
| Saved progress | “Kemajuan tersimpan sampai 04:32.” | “Video hampir selesai!” |
| Offline | “Koneksi terputus. Kemajuan terakhir yang tersimpan tetap aman.” | “Terjadi kesalahan jaringan.” |
| Submission receipt | “Jawaban Anda sudah diterima.” | “Jawaban Anda benar/aman.” |
| Withdrawal | “Anda dapat berhenti dari penelitian kapan saja tanpa hukuman.” | “Yakin ingin menyerah?” |
| Notification prompt | “Izinkan pengingat netral saat posttest tersedia.” | “Aktifkan notifikasi agar tidak tertinggal!” |
| Researcher stale data | “Diperbarui 12 menit lalu. Tarik untuk mencoba lagi.” | “Semua data terbaru.” |

Urgent-care text is a versioned clinical artifact. UX supplies structure—heading, short instruction, contact/action, and “app ini tidak mendiagnosis”—but not unapproved clinical wording.

## Component Patterns

Visual specifications live in `DESIGN.md` components.

| Component | Use | Behavioral rules |
|---|---|---|
| App Shell | Every surface | One primary vertical scroll region; preserve scroll and draft on recoverable error. |
| Top App Bar | Task and detail surfaces | Back returns without losing safe draft; Urgent-care action is visible on Participant tasks. |
| Primary Button | One commit per screen | Disabled only with an adjacent reason; loading prevents duplicate action and remains announced. |
| Secondary Button | Alternate/recovery action | Never visually competes with urgent-care action or withdrawal consequence. |
| Danger Button | Final destructive confirmation | Used only after consequence text; withdrawal remains reversible only if Study policy says so. |
| Text Field | Registration, sign-in, filters | Persistent label, inline validation after blur/submit, input mode appropriate to field, no health examples in placeholder. |
| Choice Row | Consent comprehension and assessments | Whole row selects; single-select by default; selection survives navigation until accepted or invalidated. |
| Consent Section | Consent review | Required and optional purposes are separate; opening details does not toggle agreement. |
| Status Banner | Offline, stale, failure, suspension | States consequence and recovery; persists until resolved or explicitly dismissed when safe. |
| Module Card | Dashboard | Tap only when a valid detail/action exists; locked cards open explanation instead of doing nothing. |
| Progress Stepper | Module detail | Four literal steps; current step announced; complete means accepted Study state only. |
| Video Player | Video | Play/pause/replay/captions/transcript; constrained scrubber; backgrounding pauses; resume begins at last acknowledged position. |
| Waiting Card | Waiting and Dashboard | Shows exact local date/time/time zone, refresh, and reminder preference; Server Clock remains authoritative. |
| Urgent-care Card | All Participant surfaces | Opens approved guidance immediately; never submits assessment, completes Video, or changes Learning State. |
| State Panel | Empty/loading/error/offline/permission | Title, consequence, one valid primary recovery, optional support link; no dead ends. |
| Researcher Summary Card | Overview | Value + denominator + last refresh; tap opens filtered list; small-cell suppression is explicit. |
| Participant Row | Participant list | Pseudonymous by default; tap opens timeline; no swipe actions or Source Record mutation. |
| Filter Chip | Researcher lists | Multi-select when dimensions combine; “Hapus filter” visible; selection announced. |
| Timeline Event | Participant timeline | Collapsed summary opens details; original and correction appear as linked events, never replacement. |
| Export Panel | Export requests | Show template, purpose, destination, approver, expiry, status; step-up auth before submit/retrieve. |
| Bottom Sheet | Filters and confirmations | One level only; returns focus to trigger; destructive sheets cannot be dismissed by accidental outside tap. |

## State Patterns

### Global and Participant states

| State | Surfaces | Treatment |
|---|---|---|
| Cold load | Dashboard, Overview, lists | Layout-matched skeleton; no fake values or status. After timeout, replace with State Panel. |
| Refreshing | Data surfaces | Keep current content, show refresh status, announce completion without stealing focus. |
| Empty | Lists/results | Explain whether no records exist or filters removed all records; offer valid next action. |
| Offline | All | Persistent Status Banner. Read cached Dashboard and approved Urgent-care Guidance; block server-authoritative commits with preserved draft and retry. |
| Stale/partial | Dashboard, Researcher | Show last refresh and which sections are unavailable; never merge stale and fresh totals without labels. |
| Generic error | All | Preserve input/draft; identify failed action; retry is idempotent; support link includes correlation code, not sensitive payload. |
| Session expired | All authenticated | Preserve non-sensitive draft in memory, reauthenticate, then reconcile before resubmitting. Clear sensitive cache on role/session revocation. |
| First launch offline | Orientation | Show a bundled, clinically approved baseline Urgent-care Guidance and explain that Study enrollment needs a connection. Never show stale Study configuration as enrollable. |
| Enrollment closed/ineligible | Enrollment | State that enrollment cannot continue, avoid revealing sensitive eligibility logic, show approved Study contact, and retain no direct identifier unless protocol requires it. |
| Re-consent required | Dashboard/task open | Block new Study activity, present changed sections plus full Consent, rerun configured comprehension, and preserve prior Consent history. Urgent-care Guidance remains available. |
| Required app update | Launch/task open | Block incompatible Study mutations, preserve accepted state and encrypted draft, provide update action and support; never bypass a safety/content revocation. |
| Device storage unavailable | Forms/assessment/Video | Stop claiming local save, identify what remains only in memory, offer safe retry after freeing space, and prevent navigation that would silently discard answers. |
| Permission denied | Notification | Explain Dashboard fallback and route to Android settings; no repeated permission prompt loop. |
| Content locked | Module | Card remains legible; detail states prerequisite and next available action. |
| Waiting | Module | Exact `available_at`, time zone, optional reminder, manual refresh, and Dashboard fallback. At the displayed boundary, refresh against the backend before changing state; device time alone never unlocks. |
| Content suspended | Module/Video/assessment | Stop new exposure; explain Study hold, preserve accepted records, provide support and Urgent-care Guidance. |
| Withdrawn | All Study tasks | Replace actions with disposition summary, support, and Urgent-care Guidance; cancel reminders. |
| Withdrawal pending offline | Profile/Participation Ended | Stop local reminders and new tasks immediately, keep an encrypted pending request, retry when online, and label withdrawal unconfirmed until backend acceptance. |
| Study completed | Dashboard | Confirm Study procedure completion without health conclusion; retain support/data choices. |

### Video and assessment recovery states

| State | Treatment |
|---|---|
| Video buffering | Pause progress acknowledgement; show buffering only after 500 ms; never advance saved position. |
| Connection loss during Video | Pause after buffer exhaustion, show last acknowledged time, preserve playback context, retry manually/automatically with status. |
| App backgrounded/interrupted | Pause; on return reconcile with backend and explain if local position moves backward. |
| Invalid progress rejected | Return to last acknowledged position with neutral explanation; record event; support path for repeated legitimate failure. |
| Video completion pending | Disable navigation that implies completion; show “Memeriksa kemajuan…” and reconcile idempotently. |
| Material suspended during playback | Pause at the next server check/foreground, discard no accepted progress, open Content Suspended state, and require a versioned Study decision before resuming. |
| Assessment draft offline | Permit local navigation only; show unsent state; do not reveal acceptance or unlock next step. |
| Submission timeout | Keep answers locked locally, query submission status by idempotency key, then show receipt or retry. |
| Conflicting duplicate | Do not overwrite; show original acceptance and a support/reference code. |
| Unanswered item | Assessment Review links directly to each missing number; no shame or red-only cue. |

### Researcher and export states

| State | Treatment |
|---|---|
| Suppressed aggregate | Display “Tidak ditampilkan untuk melindungi privasi” without enabling inference through adjacent totals. |
| No deviations | Explicit zero state with last evaluation time, not an empty screen. |
| Reauthentication required | Preserve export form, open secure step-up, return to confirmation after success. |
| Export queued/generating | Status timeline and safe exit; no repeated request button. |
| Export approval required | Show approver role and request time, not unnecessary identity. |
| Export ready | Show controlled destination and expiry; retrieval still checks authorization. |
| Export failed | Show stage-safe reason and retry/request-support action; no raw provider error. |
| Export expired/revoked | Remove retrieval action; retain audit-safe metadata and allow a new request. |

## Interaction Primitives

- **Tap-first:** every action has a minimum 48dp target. No long-press, swipe, drag, or hover-only primary behavior.
- **Back:** returns one level and preserves safe drafts. Back during an unsent assessment or withdrawal confirmation requests confirmation with explicit consequence.
- **Pull to refresh:** allowed on Dashboard, Overview, Participant list, timeline, and Waiting. It never changes Server Clock rules or resubmits a mutation.
- **Pagination:** Researcher lists use explicit incremental loading with item count; no endless scroll that loses context.
- **System permission:** ask for notifications only after Video Completion explains the benefit; one app-authored pre-prompt, then the Android prompt.
- **Deep link from reminder:** authenticate if needed, resolve current backend state, and open Posttest only if available; otherwise open Waiting with an explanation.
- **Keyboard:** next/previous field actions follow form order; Enter never submits multi-question assessments or Consent.
- **Sensitive local state:** encrypt permitted drafts, scope them to the verified account and Study version, expire them by policy, and delete them on submission, withdrawal acceptance, logout, role change, or revocation.
- **Task switcher and screenshots:** obscure authenticated Participant and Researcher content in Android recents; block screenshots on Researcher and re-identification/export surfaces; document any Participant accessibility exception.
- **Concurrent device state:** before every commit and after foregrounding, reconcile assigned version and Learning State; a stale device never overwrites a newer accepted state.
- **Banned:** celebratory confetti, countdown pressure, streaks, auto-advancing assessment questions, forced notification permission, hidden withdrawal, biometric inference, and client-only success states.

## Accessibility Floor

- Meet WCAG 2.2 AA-equivalent mobile behavior and the PRD’s 200% font-scaling requirement.
- TalkBack labels include role, name, state, and position where meaningful: “Modul 2 dari 7, terkunci.”
- Reading and focus order follow the visual order. On error, focus moves to the error summary; each item links to the field/question.
- Touch targets are at least 48×48dp with at least 8dp separation for adjacent high-risk actions.
- Captions and a transcript are available for every Video. Transcript does not create Video Completion and may not substitute for exposure unless the Study Protocol explicitly approves an accessibility equivalence.
- Progress, lock, waiting, error, selection, and success never rely on color alone.
- Motion is non-essential. Respect Reduce Motion; no parallax, auto-scrolling, or time-limited animation.
- Timeout warnings provide enough time to extend Participant form sessions. Researcher session limits may be stricter but must preserve unsent export form values safely.
- Plain-language comprehension testing includes low literacy, screen reader, text scaling, reduced dexterity, low bandwidth, older Android hardware, and shared-device contexts.
- Urgent-care Guidance remains available with TalkBack and from the first public orientation surface. A clinically approved baseline is bundled for first-launch offline use; later approved versions replace it atomically.

## Responsive & Platform

Android portrait is primary. All Participant flows support portrait widths from 320dp upward and font scaling to 200%. Landscape is supported for Video and remains operable elsewhere, but no layout depends on landscape. Tablets center a single reading column with a maximum content width of 600dp; Researcher aggregates may use two summary columns only when text scaling and minimum card width remain valid.

Android system Back, notification channels, secure screenshots for sensitive Researcher surfaces, autofill rules, and accessibility services follow platform conventions. The MVP is light-mode-only and must declare that appearance explicitly rather than render unverified system-dark colors.

## Safety, Consent, and Privacy Experience Rules

- Urgent-care Guidance outranks Study progression. It is one tap away and never gated by login after an approved cached copy exists.
- Consent is read, understood, and accepted in separate beats. Optional reminder and secondary-use choices are not preselected.
- Direct identifiers never appear in notification text, researcher list rows, analytics events, screenshots of sensitive Researcher surfaces, or support correlation codes.
- Withdrawal language is neutral and available from Dashboard/Profile without contacting a partner. The final screen says what happens to future activity, reminders, and existing data under the approved Consent.
- Scores are hidden unless the active Study configuration approves display. If shown, the copy describes Study answers, not health status.
- No completion screen says “healthy,” “safe,” “normal,” or equivalent.

## Key Flows

### Flow UJ-1 — Sari enrolls with informed consent

1. Sari opens the app and chooses **Mulai sebagai peserta**.
2. Orientation explains that this is education within a Study and displays persistent Urgent-care access.
3. Sari reads Study information in sections and opens any term she does not understand.
4. Consent Review separates required Study processing from optional reminders and secondary use.
5. Sari completes the Comprehension Check. Incorrect responses explain the relevant concept and follow the configured retry/assistance rule.
6. After passing, she accepts Consent and completes only enabled Registration fields.
7. The backend creates her Participant Code and opens Dashboard.
8. **Climax:** Dashboard says “Pendaftaran selesai” and shows Module 1’s exact next action, while Profile shows the Consent version and withdrawal route.

Failure path: connection fails before acceptance → inputs remain local and marked unsent; no Consent success or account is shown until backend acceptance is reconciled.

### Flow UJ-2 — Sari completes a Module

1. Sari opens the first available Module Card.
2. Module Detail shows Pretest → Video → Wait → Posttest and the current step.
3. She completes and reviews the Pretest, then submits once.
4. Assessment Receipt confirms acceptance and enables Video.
5. She watches the Video; she can pause, replay, enable captions, and read the transcript, but cannot seek beyond acknowledged progress.
6. The backend validates Video Completion and starts the 168-hour Delay.
7. Waiting shows the exact local date/time and offers a neutral reminder permission.
8. At availability, Sari opens the Posttest from Dashboard, submits it, and receives a receipt.
9. **Climax:** Dashboard marks the Module “Selesai” and unlocks the next Module with its Pretest action—without claiming clinical safety or benefit.

Failure path: notification never arrives → Dashboard independently shows Posttest availability; no support intervention is required.

### Flow UJ-3 — Dewi recovers after interrupted Video

1. Dewi watches until 04:32 acknowledged progress.
2. Connectivity drops; the player pauses after buffered content can no longer be validated.
3. A Status Banner says the last saved point is 04:32 and offers retry.
4. Dewi closes the app and returns later, possibly on another verified device.
5. The app loads backend state and offers **Lanjutkan dari 04:32**.
6. Playback resumes from the acknowledged position; any later local-only position is not represented as saved.
7. **Climax:** after the remaining Video is validated, Dewi receives one Video Receipt and one Posttest schedule despite retries.

Failure path: repeated valid playback is rejected → keep the acknowledged position, show a correlation code, and route to technical Study support; never manually mark complete from the client.

### Flow UJ-4 — Rina monitors the Study

1. Rina signs in with her individual Researcher account.
2. Overview shows counts with denominators, last refresh, due/overdue Posttests, deviations, and operational failures.
3. She opens a filtered Participant list and selects a Participant Code.
4. Timeline shows accepted events, versions, and any linked correction without exposing direct identity by default.
5. Rina returns to Export Requests, chooses an approved template and purpose, and reviews the controlled destination.
6. Step-up authentication succeeds and the request enters its approval/generation state.
7. **Climax:** Export Ready shows the approved destination, expiry, and audit reference; there is no unrestricted mobile Share action.

Failure path: authorization changes while the export generates → retrieval is denied, status becomes revoked, and the audit reference remains visible.

### Flow UJ-5 — Sari withdraws

1. Sari opens Profile and chooses **Berhenti dari penelitian**.
2. Withdrawal explains that participation is voluntary, what future Study actions stop, and how existing data will be handled under her Consent.
3. She may cancel safely or confirm without completing another Study task or providing a reason.
4. The backend accepts withdrawal, revokes future Study actions, and cancels reminders.
5. **Climax:** Participation Ended shows the effective time, disposition summary, support/data-request contact, and Urgent-care Guidance.

Failure path: submission times out → the app queries withdrawal status before offering retry; it never sends duplicate requests or continues reminders while status is uncertain.

## Visual Reference Coverage

No mockups, wireframes, or imported brand assets were produced in this headless run. Every IA surface is **spine-only** and must be built from these component and state contracts. `DESIGN.md` and `EXPERIENCE.md` win over future mockups on conflict.
