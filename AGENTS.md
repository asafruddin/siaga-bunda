# AGENTS.md — SiAGA Bunda

This file gives AI coding agents the context needed to work safely and consistently in this repository. Read it before making changes. For human onboarding, see [README.md](README.md).

## Mission

SiAGA Bunda is a **maternal-health education and research-support** Android app. It is **educational, not diagnostic**. It must never delay urgent care, imply clinical reassurance from study completion, or expose pregnancy/study context in notifications.

Two mobile surfaces share one app:

| Surface | Users | Navigation (planned) |
| --- | --- | --- |
| **Participant** | Pregnant mothers enrolled in a study | Beranda, Profil; task flows push from there |
| **Researcher** | Authorized study staff | Ringkasan, Peserta, Ekspor; drill-downs for monitoring |

Researchers use a **mobile-first** interface — not a desktop dashboard.

## Authoritative sources (read order)

When implementing a feature, consult these in order:

1. **Story spec** — `_bmad-output/implementation-artifacts/spec-*.md` (if one exists for the task)
2. **Architecture spine** — `_bmad-output/planning-artifacts/architecture/architecture-siaga-bunda-2026-07-01/ARCHITECTURE-SPINE.md`
3. **PRD** — `_bmad-output/planning-artifacts/prds/prd-siaga-bunda-2026-07-01/prd.md`
4. **UX** — `DESIGN.md` and `EXPERIENCE.md` under `_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/`
5. **Epics** — `_bmad-output/planning-artifacts/epics.md`
6. **Blueprint** — `docs/blueprint.md` (historical input only — do not treat as final spec)

If a story spec conflicts with the architecture spine, **stop and ask** — do not silently pick one.

## What exists today vs planned

### Implemented (scaffold)

| Path | Status |
| --- | --- |
| `apps/mobile` | Expo SDK 56 scaffold; public / participant / researcher route groups; `getSessionSnapshot()` always returns `null` (all protected routes denied) |
| `apps/api` | NestJS with `/health` endpoint; Vercel-ready |
| `apps/worker` | NestJS cron controller, job store stub, `CRON_SECRET` guard; Vercel-ready |
| Root workspace | pnpm 11, Turborepo, `build` / `typecheck` / `test` / `lint` |

### Planned (architecture seed — do not invent alternate structure)

```text
packages/contracts/   # Zod schemas, enums, RFC 9457 errors, OpenAPI generation
packages/domain/      # Shared value objects only
packages/db/          # Prisma, migrations, DB roles/triggers
packages/config/      # Typed env configuration
packages/ui/          # Shared mobile primitives from DESIGN tokens
packages/testing/     # Fixtures, clocks, harness
modules/              # identity, consent, study-config, learning, assessment,
                      # notification, research, export, retention, audit
infrastructure/       # AWS CDK, Vercel project config
e2e/                  # Maestro Android flows
```

When scaffolding new packages or modules, follow the structural seed in the architecture spine — do not create ad hoc folders.

## Non-negotiable research-flow invariants

Violating any of these is a **critical defect**, not a style issue.

### Learning protocol

```text
pretest_required → video_available → video_in_progress → waiting_posttest
  → posttest_available → completed
```

- Pretest must be accepted before video access.
- Video forward-seek beyond server-acknowledged position is rejected.
- Video completion requires contiguous validated coverage + elapsed-time bounds (server-side).
- Posttest `available_at` = video completion transaction time + **168 hours** (not calendar days, not client time).
- Next module stays locked until current posttest is accepted.
- Withdrawal/suspension moves to `blocked` from any state.

### Data integrity

- **Source records are insert-only** — no updates or deletes; corrections append linked records.
- **Backend owns learning state** — clients submit commands/observations; optimistic UI never implies acceptance.
- **Idempotency** — mobile mutations use UUIDv7 `Idempotency-Key`; same hash replays response; conflicting hash returns 409.
- **Contracts are single source of truth** — `packages/contracts` defines Zod schemas; no duplicate DTOs per endpoint.

### Security and privacy

- Two Cognito pools: Participant (SMS OTP), Researcher (password + required TOTP). Access tokens ≤ 5 minutes.
- API validates JWT **and** local device grant, session version, study membership, and role on every request.
- Direct identifiers live in `identity` schema; study activity uses Participant Code only.
- Re-identification requires role, fresh TOTP step-up, reason code, and audit append.
- Notifications use neutral templates only; opaque route nonces; no study/pregnancy context in payloads.
- Exports: worker writes KMS-encrypted S3 objects; mobile never receives bytes or presigned URLs.
- Logs and telemetry are redacted — no request bodies, answers, tokens, phone numbers, or direct identifiers.
- **Never** put secrets, AWS credentials, or answer keys in mobile code or client storage.

### Mobile storage rules (AD-14)

| Data | Where |
| --- | --- |
| Server-fetched state | TanStack Query — **memory only** |
| Refresh credentials, installation ID, small assessment drafts | SecureStore — scoped, cleared on logout/revocation/withdrawal |
| Registration / consent drafts | Memory only |
| Answer keys, export data, AWS credentials | **Never on device** |

### Deployment boundary (AD-17)

- Vercel projects: `apps/api` and `apps/worker`, separate projects, region `sin1`.
- AWS: `ap-southeast-1` (Aurora, Cognito, S3, CloudFront, KMS).
- Dev / Preview / Production are isolated. **Never connect Preview or local to real study data.**

## Coding conventions

Match existing code in the file you edit. When no convention exists, follow the architecture spine consistency table:

| Concern | Convention |
| --- | --- |
| TypeScript | `camelCase` variables/functions, `PascalCase` types |
| PostgreSQL | `snake_case` |
| HTTP API | `/api/v1`, JSON, cursor pagination, RFC 9457 errors |
| Events | `module.entity.action.v1` (past tense) |
| IDs | UUIDv7 at application boundary (`uuid` 13.0.2) |
| Time | Store `timestamptz` UTC; JSON as RFC 3339 with `Z` |
| Scores | Integer correct/total + scoring-key version — no floats |
| DB | One schema per module owner; forward-only migrations |
| Authorization | Deny by default; sensitive reads need purpose/reason + audit |

### Backend module shape (hexagonal)

Each module under `modules/` owns:

- Domain models and policies (no adapter imports)
- Application services and ports
- Adapters (PostgreSQL, Cognito, S3, FCM)
- Its own tables/schema

Cross-module behavior uses application commands or committed outbox events — **never** direct writes to another module's tables.

### Mobile

- Expo SDK 56, React Native 0.85, React 19.2, Android API 36.
- Expo Router with typed routes; route groups: `(public)`, `(participant)`, `(researcher)`.
- Light mode only; warm Material 3 surfaces per `DESIGN.md`.
- Indonesian copy for user-facing text; use **Anda** by default; plain language, no pressure or clinical reassurance.
- 48dp minimum touch targets; WCAG 2.2 AA-equivalent accessibility.
- Theme tokens live in `apps/mobile/src/theme/tokens.ts` — extend from DESIGN spec, do not invent colors.

### Testing expectations

- Domain: exhaust every learning-state transition.
- Integration: real PostgreSQL, concurrency, idempotency, clock boundaries.
- API: auth, duplicate submissions, authorization failures.
- Mobile: unit tests for guards/config; Maestro for end-to-end Android flows (when `e2e/` exists).
- CI blocks on contract drift, migration failure, invariant failure, or missing FR-to-test mapping.

Verification command before finishing any change:

```bash
pnpm build && pnpm typecheck && pnpm test && pnpm lint
```

## Common agent mistakes — do NOT

| Mistake | Why it is wrong |
| --- | --- |
| Fake role toggle for dev convenience | Becomes an authorization assumption; use `getSessionSnapshot()` port pattern |
| Client-side posttest unlock from device clock or push notification | Server computes `available_at`; notifications are informational only |
| Caching learning state in SecureStore or AsyncStorage | AD-14: server cache is memory-only |
| Skipping idempotency keys on mutations | AD-4: duplicate submissions corrupt source records |
| Editing source records in place | AD-5: insert-only with correction append |
| Duplicating Zod/DTO types outside `packages/contracts` | AD-2: one contract source |
| Cross-module repository/table access | AD-1: hexagonal boundaries enforced by lint and DB roles |
| Adding clinical/urgent-care copy without approved content artifact | Scaffold reserves routes; content needs Clinical Owner approval |
| Connecting to production APIs or study data in dev/scaffold work | Privacy and ethics violation |
| Enabling production OTA updates | AD-18: production EAS Update disabled |
| iOS-specific product behavior in MVP | Android-only per NFR-11 |
| Desktop researcher UI | Mobile-first per PRD |
| Inventing epics/stories when a spec exists | Follow `_bmad-output/implementation-artifacts/` story specs |

## Glossary (use these terms consistently)

| Term | Meaning |
| --- | --- |
| Participant | Enrolled person using the participant surface |
| Researcher | Authorized study staff using the researcher surface |
| Participant Code | Pseudonymous display identifier in study workflows |
| Module | One of seven ordered units: Pretest + Video + Delay + Posttest |
| Learning State | Server-authoritative module progress state |
| Server Clock | Backend `transaction_timestamp()` — not device time |
| Source Record | Immutable original consent, answer, score, or acknowledgement |
| Video Completion | Server-validated full video watch evidence |
| Delay | 168 elapsed hours from video completion to posttest availability |
| Protocol Deviation | Recorded departure from study protocol |
| Urgent-care Guidance | Approved care-seeking instructions — not diagnosis |

## Workspace commands

```bash
pnpm install                          # Install all workspace packages
pnpm build                            # Build all apps
pnpm typecheck                        # TypeScript check all apps
pnpm test                             # Test all apps
pnpm lint                             # Lint all apps

pnpm --filter @siaga-bunda/mobile start
pnpm --filter @siaga-bunda/api dev
pnpm --filter @siaga-bunda/worker dev
```

Package names: `@siaga-bunda/mobile`, `@siaga-bunda/api`, `@siaga-bunda/worker`.

## Implementation workflow

1. Find or create a story spec in `_bmad-output/implementation-artifacts/`.
2. Read bound architecture decisions (AD-* references in the spec).
3. Implement the smallest change that satisfies acceptance criteria.
4. Do not expand scope into adjacent stories (auth, content, DB) unless the spec requires it.
5. Run full workspace verification.
6. If using BMAD dev/review skills, follow `docs/bmad-workflow.md`.

## File touchpoints by task type

| Task | Start here |
| --- | --- |
| Mobile UI / routes | `apps/mobile/app/`, `apps/mobile/src/` |
| Mobile theme/components | `apps/mobile/src/theme/`, `apps/mobile/src/components/` |
| Route guards / session | `apps/mobile/src/auth/` |
| API endpoints | `apps/api/src/` → future `modules/*/adapters/http/` |
| Cron / outbox jobs | `apps/worker/src/` → future `modules/*/adapters/worker/` |
| Shared API contracts | `packages/contracts/` (when created) |
| Database schema | `packages/db/` (when created) |
| Infrastructure | `infrastructure/` (when created) |

## Out of MVP scope

Do not implement unless explicitly requested with upstream product change:

- iOS
- Multi-study tenancy
- Desktop researcher UI
- Offline completion of assessments or video
- Service extraction from modular monolith
- Production OTA updates

## Questions to ask the human

Stop and ask when:

- A story spec is missing and the change touches learning state, consent, identity, exports, or retention.
- Clinical, consent, or urgent-care copy is needed but no approved content artifact exists.
- The change requires EAS credentials, Play Store, Cognito pools, Aurora, or real study data.
- Architecture spine and story spec appear to conflict.
- You need to choose between calendar days and elapsed hours for scheduling (answer: **168 elapsed hours** per PRD).
