---
title: 'Vercel Backend Deployment Proof'
type: 'chore'
created: '2026-07-01'
status: 'in-progress'
baseline_commit: 'NO_VCS'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-siaga-bunda-2026-07-01/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository contains planning documents but no backend code, package workspace, or Vercel configuration, so deployability cannot currently be demonstrated.

**Approach:** Create the smallest production-shaped pnpm/Turborepo proof: a NestJS health API and an independently deployable bounded worker endpoint, both configured as Vercel projects in Singapore and covered by local build/tests. Keep database integration behind a port because no approved Aurora environment or credentials exist yet.

## Boundaries & Constraints

**Always:** Use Node.js 24, pnpm 11, NestJS 11, TypeScript strict mode, the architecture's `apps/api` and `apps/worker` project roots, Vercel `sin1`, explicit environment validation, redacted responses, and deterministic tests. Make both projects independently buildable by Vercel from the monorepo.

**Ask First:** Any real Vercel deployment, Vercel project creation/linking, paid-plan change, AWS/Aurora provisioning, domain/DNS change, secret upload, or use of production/participant data.

**Never:** Claim a successful live deployment without deployment evidence; embed credentials; connect Preview to production data; introduce SQS or a long-lived worker; implement health-data features; use local disk for durability; weaken the readiness gate beyond this isolated deployability proof.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| API healthy | `GET /health` | 200 JSON with service and status only | No environment, dependency, or Study data leaks |
| Worker authorized | `GET /api/cron/drain` with valid bearer secret | 200 with bounded no-op drain result | No durable job is acknowledged without an adapter commit |
| Worker unauthorized | Missing or invalid bearer secret | 401 RFC 9457-style JSON | Constant generic response; no secret comparison details |
| Missing required config | Worker starts without cron secret | Startup/build-time validation fails closed | Clear non-secret diagnostic |

</frozen-after-approval>

## Code Map

- `package.json`, `pnpm-workspace.yaml`, `turbo.json` -- pinned monorepo commands and project graph.
- `apps/api/` -- NestJS HTTP application, health route, tests, and Vercel project configuration.
- `apps/worker/` -- bounded cron handler, authorization, configuration validation, tests, and Vercel project configuration.
- `.gitignore`, `.env.example` -- exclude secrets and document only safe variable names.

## Tasks & Acceptance

**Execution:**
- [ ] Root workspace files -- define pinned package manager, shared scripts, and reproducible build/test/typecheck tasks.
- [ ] `apps/api` -- implement a serverless-compatible NestJS bootstrap and minimal redacted health contract.
- [ ] `apps/worker` -- implement a serverless-compatible, secret-protected bounded drain endpoint with a replaceable job-store port.
- [ ] `apps/api/vercel.json`, `apps/worker/vercel.json` -- configure Node.js runtime, `sin1`, Fluid Compute-compatible functions, and the minute cron route.
- [ ] Tests and documentation -- cover the I/O matrix and state exactly what remains necessary for a live Preview proof.

**Acceptance Criteria:**
- Given a clean checkout with Node.js 24 and pnpm 11, when dependencies install and build/test/typecheck commands run, then both backend projects pass without AWS or Vercel credentials.
- Given either app as a Vercel project root, when Vercel builds it, then its NestJS handler is discoverable without a container or writable filesystem assumption.
- Given no authenticated Vercel/AWS context, when verification completes, then results distinguish local deployability evidence from the still-pending live Preview/Aurora proof.

## Spec Change Log

## Design Notes

Vercel's NestJS support converts an application into a function. The worker is therefore an HTTP-triggered bounded job runner, not a daemon. A no-op job-store adapter proves the deployment boundary while preventing a fake database claim; Aurora transaction and durable outbox verification remain the first infrastructure story once approved credentials exist.

## Verification

**Commands:**
- `pnpm install --frozen-lockfile` -- expected: lockfile installs reproducibly.
- `pnpm build && pnpm typecheck && pnpm test` -- expected: both projects compile and all tests pass.
- `pnpm dlx vercel build --cwd apps/api` and `pnpm dlx vercel build --cwd apps/worker` -- expected: local Vercel builds pass when the CLI supports unlinked local builds; otherwise document the exact link/auth prerequisite without claiming success.
