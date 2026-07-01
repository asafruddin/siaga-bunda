# Acceptance Auditor Prompt — Mobile Scaffold

Audit the implementation against the approved specification and its source contracts. Read:

- `_bmad-output/implementation-artifacts/spec-mobile-app-scaffold.md`
- `_bmad-output/planning-artifacts/architecture/architecture-siaga-bunda-2026-07-01/ARCHITECTURE-SPINE.md`
- `_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/DESIGN.md`
- `_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/EXPERIENCE.md`
- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`
- all files under `apps/mobile`
- `apps/api/jest.config.cjs`, `apps/worker/jest.config.cjs`

The baseline is `NO_VCS`; treat the listed files as the review scope. Check every frozen rule, task, acceptance criterion, configuration claim, accessibility boundary, privacy/safety constraint, and verification claim. Distinguish implementation defects from missing human-approved content or external EAS/Play credentials. Return a Markdown findings list with severity, file/location, violated requirement, evidence, and minimal correction. Return `No findings` only if every requirement is supported by evidence.
