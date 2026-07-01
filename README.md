# SiAGA Bunda

**Kenali Tanda Bahaya, Lindungi Ibu dan Bayi**

SiAGA Bunda is an Android-first mobile application for pregnant mothers and mobile researchers. Participants learn pregnancy danger signs through seven ordered learning modules. Researchers monitor protocol progress and export approved study data — all from mobile surfaces.

The product enforces a controlled research flow: **Consent → Pretest → full video watch → 168-hour delay → Posttest → next module**. The backend owns learning state, schedules, and source records; the client submits observations and never authorizes transitions on its own.

## Repository layout

pnpm 11 + Turborepo monorepo. Node.js **24.x** required.

```text
siaga-bunda/
  apps/
    mobile/       # Expo SDK 56 Android app (Participant + Researcher routes)
    api/          # NestJS HTTP API — separate Vercel project root
    worker/       # NestJS cron/job worker — separate Vercel project root
  packages/       # Planned: contracts, domain, db, config, ui, testing
  modules/        # Planned: hexagonal backend modules (identity, learning, …)
  infrastructure/ # Planned: AWS CDK + Vercel environment config
  e2e/            # Planned: Maestro flows + fixture controls
  docs/           # Blueprint and BMAD workflow guide
  _bmad-output/   # Finalized PRD, UX, architecture, epics, implementation specs
```

**Current state:** Early scaffold. `apps/mobile`, `apps/api`, and `apps/worker` exist with health checks, route guards, and deployment proof. Shared packages, backend modules, database, and infrastructure are defined in architecture but not yet implemented.

## Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | 24.x |
| pnpm | 11.x |
| Android SDK / emulator | For mobile development builds |

## Getting started

```bash
# Install dependencies (frozen lockfile in CI)
pnpm install

# Run all workspace tasks
pnpm build
pnpm typecheck
pnpm test
pnpm lint
```

### Mobile (`apps/mobile`)

```bash
pnpm --filter @siaga-bunda/mobile start     # Expo dev client
pnpm --filter @siaga-bunda/mobile android   # Launch on Android emulator/device
```

See [apps/mobile/README.md](apps/mobile/README.md) for scaffold details. EAS signing, Play Store, and production services are not configured yet.

### API (`apps/api`)

```bash
pnpm --filter @siaga-bunda/api dev          # Local NestJS watch mode
```

Deployed as an independent Vercel project rooted at `apps/api`, pinned to Singapore (`sin1`).

### Worker (`apps/worker`)

```bash
pnpm --filter @siaga-bunda/worker dev       # Local NestJS watch mode
```

Requires `CRON_SECRET` at runtime. Deployed as a separate Vercel project rooted at `apps/worker`. See [apps/README.md](apps/README.md).

## Core invariants

These rules are non-negotiable across mobile, API, and worker code:

1. **Server-authoritative learning state** — PostgreSQL transaction time drives transitions; device clocks never unlock content.
2. **Ordered module protocol** — Pretest before video; no forward seeking; video completion validated server-side; posttest available only after **168 elapsed hours**; next module locked until posttest accepted.
3. **Immutable source records** — Consent, answers, scores, and progress acknowledgements are insert-only; corrections append linked records.
4. **Idempotent mutations** — Every mobile mutation carries a UUIDv7 `Idempotency-Key`.
5. **Identity separation** — Participant codes in study activity; direct identifiers isolated in the identity module.
6. **Mobile stores the minimum** — Memory-only TanStack Query cache; scoped SecureStore for credentials and small drafts only.
7. **Exports never become mobile files** — Researchers request exports; workers write encrypted S3 objects; mobile sees status only.

Full architecture decisions: [_bmad-output/planning-artifacts/architecture/architecture-siaga-bunda-2026-07-01/ARCHITECTURE-SPINE.md](_bmad-output/planning-artifacts/architecture/architecture-siaga-bunda-2026-07-01/ARCHITECTURE-SPINE.md).

## Documentation map

| Document | Purpose |
| --- | --- |
| [docs/blueprint.md](docs/blueprint.md) | Original product blueprint (input, not final spec) |
| [docs/bmad-workflow.md](docs/bmad-workflow.md) | BMAD planning and implementation workflow |
| [_bmad-output/planning-artifacts/prds/prd-siaga-bunda-2026-07-01/prd.md](_bmad-output/planning-artifacts/prds/prd-siaga-bunda-2026-07-01/prd.md) | Final PRD — FR/NFR contract |
| [_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/DESIGN.md](_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/DESIGN.md) | Design tokens and component spec |
| [_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/EXPERIENCE.md](_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/EXPERIENCE.md) | UX flows and states |
| [_bmad-output/planning-artifacts/epics.md](_bmad-output/planning-artifacts/epics.md) | Epic and story breakdown |
| [AGENTS.md](AGENTS.md) | AI agent context, rules, and conventions |

## Stack

| Layer | Technology |
| --- | --- |
| Mobile | Expo SDK 56, React Native 0.85, React 19.2, Expo Router |
| Backend | NestJS 11, modular monolith, transactional outbox |
| Contracts | Zod 4 → OpenAPI 3.1 (planned in `packages/contracts`) |
| Database | Aurora PostgreSQL 17 (planned) |
| Auth | Amazon Cognito — separate Participant (SMS OTP) and Researcher (password + TOTP) pools |
| Hosting | Vercel (`sin1`) + AWS `ap-southeast-1` |
| CI / E2E | Turborepo, Jest, Maestro (planned) |

## Development workflow

Planning artifacts are produced through BMAD skills (see [docs/bmad-workflow.md](docs/bmad-workflow.md)). Implementation follows story specs in `_bmad-output/implementation-artifacts/`.

Before adding features:

1. Read the relevant story spec or epic.
2. Confirm the change respects architecture spine invariants (AD-1 through AD-24).
3. Run `pnpm build && pnpm typecheck && pnpm test && pnpm lint` before finishing.

## License

Private repository. All rights reserved.
