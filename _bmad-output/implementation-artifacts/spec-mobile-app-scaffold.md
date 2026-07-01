---
title: 'Expo React Native Mobile App Scaffold'
type: 'feature'
created: '2026-07-01'
status: 'in-review'
baseline_commit: 'NO_VCS'
context:
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-siaga-bunda-2026-07-01/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-siaga-bunda-2026-07-01/EXPERIENCE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The approved product includes an Android React Native application for Participant and Researcher experiences, but the monorepo currently contains only backend API and worker projects.

**Approach:** Add `apps/mobile` as an Expo SDK 56 application using Expo Router, TypeScript strict mode, Continuous Native Generation, and the approved light-mode design foundation. Establish public, Participant, and Researcher route boundaries without inventing authentication, clinical content, or feature behavior before their stories are approved.

## Boundaries & Constraints

**Always:** Use Expo SDK 56, React Native 0.85, React 19.2, Android API 36, pnpm workspace commands, Expo Router typed routes, portrait-first responsive layout, system font scaling, 48dp touch targets, light appearance, safe areas, and DESIGN semantic tokens. Use Indonesian only for neutral scaffold copy. Keep Participant and Researcher routes structurally separate and deny access to protected placeholders until authentication is implemented.

**Ask First:** Any EAS project creation/linking, Expo account authentication, signing credentials, Google Play registration, Android application-ID change from `id.siagabunda.app`, native prebuild output committed to the repository, analytics/telemetry integration, or external service credentials.

**Never:** Implement fake role selection as authorization; add unapproved medical or urgent-care instructions; connect to production APIs or Study Data; enable production OTA updates; scaffold iOS-specific product behavior; persist sensitive data; claim enrollment, authentication, or research flows are implemented.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| App launch | Fresh Android development build | Public scaffold screen renders inside safe areas with product name and development status | No backend or account is required |
| Protected route | Direct link to Participant or Researcher placeholder without authenticated role | Access is denied and returned to the public scaffold | No protected content or cached role state is shown |
| Large text | Android font scale at 200% and 320dp portrait width | Content remains readable, scrollable, and operable | No clipped labels or horizontal scrolling |
| System dark mode | Device requests dark appearance | App keeps the explicitly approved light theme | No unvalidated dark color substitutions |

</frozen-after-approval>

## Code Map

- `apps/mobile/package.json`, `app.json`, `eas.json` -- Expo project identity, Android configuration, scripts, and development/production build policy.
- `apps/mobile/app/` -- Expo Router root and separated public, Participant, and Researcher route groups.
- `apps/mobile/src/theme/` -- typed subset of the approved semantic DESIGN tokens used by the scaffold.
- `apps/mobile/src/components/` -- accessible shell primitives with safe-area and responsive behavior.
- Root workspace files -- include mobile in build, typecheck, test, lint, and Expo health checks without breaking API/worker tasks.

## Tasks & Acceptance

**Execution:**
- [x] `apps/mobile` project metadata -- add the Expo SDK 56/React Native 0.85 Android application with CNG, typed routes, explicit light appearance, API 36 configuration, and production OTA disabled.
- [x] `apps/mobile/app` -- create the root public scaffold and guarded Participant/Researcher route groups without fake authentication.
- [x] `apps/mobile/src/theme` and shell components -- encode the required semantic foundation and accessible responsive layout.
- [x] Mobile tests/config -- verify rendering, protected-route denial logic, configuration invariants, and TypeScript/lint correctness.
- [x] Root workspace configuration -- integrate mobile commands and correct existing pnpm build-script policy configuration.

**Acceptance Criteria:**
- Given Node.js 24 and pnpm 11, when the workspace installs and runs build, typecheck, test, and lint, then mobile, API, and worker projects pass together.
- Given the mobile project, when Expo configuration is inspected, then it resolves to SDK 56, Android package `id.siagabunda.app`, API 36, typed routes, light appearance, and no production OTA channel.
- Given an Android emulator or Expo development build, when the app launches, then the public shell renders without credentials while protected route guards expose no Participant or Researcher content.
- Given no Expo account or signing credentials, when verification completes, then local readiness is reported separately from the pending EAS/Play deployment proof.

## Spec Change Log

## Design Notes

The scaffold creates navigation and design-system seams, not product flows. Route guards should depend on an authentication-state port whose initial implementation always returns unauthenticated. This prevents a convenient development role toggle from becoming an authorization assumption. Clinical guidance needs an approved content artifact, so this scaffold reserves its future route without supplying medical wording.

## Verification

**Commands:**
- `pnpm install --frozen-lockfile` -- expected: reproducible installation across all workspace projects.
- `pnpm build && pnpm typecheck && pnpm test && pnpm lint` -- expected: every workspace task passes.
- `pnpm --filter @siaga-bunda/mobile exec expo config --type public` -- expected: validated Android/Expo configuration with no secrets.
- `pnpm --filter @siaga-bunda/mobile exec expo-doctor` -- expected: dependency and project checks pass.
