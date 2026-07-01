# SiAGA Bunda BMAD Workflow

This guide turns [`blueprint.md`](./blueprint.md) into implementation-ready BMAD artifacts. The blueprint is the source document; it is not yet a finalized BMAD planning artifact.

Run each BMAD workflow in a fresh Codex chat to prevent context from one workflow leaking into another.

## 1. Refine the Product Brief

This step is optional, but recommended because SiAGA Bunda handles health-related data and supports a controlled research process.

Invoke:

```text
Use bmad-product-brief to create a product brief from docs/blueprint.md.
Treat the blueprint as source material. Challenge assumptions and highlight unresolved research, privacy, consent, and clinical-safety decisions.
```

Expected output:

```text
_bmad-output/planning-artifacts/.../brief.md
```

Focus on:

- Research protocol and ethics approval
- Participant consent
- Indonesian health-data and privacy requirements
- Data retention and deletion
- Whether "7 days" means a calendar date or exactly 168 hours
- Offline use, device switching, and clock manipulation
- Measurable MVP success targets

The blueprint already contains scope and personas, so use BMAD's fast path unless deeper coaching is needed.

## 2. Create the PRD

This step is required.

Invoke:

```text
Use bmad-prd to create a PRD using docs/blueprint.md and the completed product brief.

Preserve these invariants:
- pretest before video
- no forward skipping
- backend-validated video completion
- posttest available only after 7 days
- next video locked until the previous posttest is completed
- researcher experience remains mobile-first
```

The PRD should contain:

- Traceable functional requirements
- Measurable non-functional requirements
- Acceptance criteria
- Failure states and edge cases
- Explicit out-of-scope items
- Research and privacy constraints

Do not treat the draft epics in the blueprint as final at this stage.

## 3. Design the UX

UX design is optional in BMAD, but strongly recommended because both product surfaces are mobile interfaces.

Invoke:

```text
Use bmad-ux with the PRD and docs/blueprint.md.
Create the respondent and researcher mobile UX, including loading, empty, error, offline, locked, waiting, notification-denied, and interrupted-video states.
```

Pay special attention to:

- Pregnant users with different levels of digital literacy
- Accessibility and large touch targets
- Clear, friendly Indonesian copy
- Explanations for locked content and waiting periods
- Recovery after network, notification, or playback failures

Expected output: a UX specification under `_bmad-output/planning-artifacts`.

## 4. Create the Architecture

This step is required.

Invoke:

```text
Use bmad-architecture with the finalized PRD and UX specification.

Define the React Native app, backend, PostgreSQL model, authentication, authorization, video-progress validation, posttest scheduling, push notifications, audit trail, exports, privacy controls, testing strategy, and deployment structure.
```

Resolve these architecture decisions:

- Monorepo and package structure
- Expo versus bare React Native
- Backend framework
- Authentication model for respondents and researchers
- Server-authoritative time and learning-state transitions
- Idempotent progress and test submissions
- Notification retry and dashboard fallback behavior
- Export authorization and sensitive-data handling

## 5. Generate Final Epics and Stories

This step is required and must follow architecture.

Invoke:

```text
Use bmad-create-epics-and-stories with the finalized PRD, UX, and architecture.
Regenerate the epics and stories rather than copying the draft breakdown from docs/blueprint.md.
Include Given/When/Then acceptance criteria and requirement traceability.
```

BMAD should reconcile user value, requirements, and actual architectural dependencies when establishing the implementation order.

## 6. Run the Implementation-Readiness Gate

This step is required before application scaffolding or feature development.

Invoke:

```text
Use bmad-check-implementation-readiness.
Validate alignment between the PRD, UX, architecture, epics, stories, and every research-flow invariant.
```

Fix all critical findings before writing application code. The readiness report should demonstrate that every requirement is covered by the architecture and at least one story.

## 7. Generate Sprint Tracking

This step is required and starts BMAD's implementation phase.

Invoke:

```text
Use bmad-sprint-planning to generate the implementation plan from the approved epics and stories.
```

Expected output:

```text
_bmad-output/implementation-artifacts/sprint-status.yaml
```

Let BMAD determine the implementation order. The suggested sprints in the blueprint remain useful input, but architectural dependencies may change their sequence.

## 8. Run the Story Development Cycle

For every story, use a fresh chat and run these workflows in order:

```text
bmad-create-story
bmad-create-story with the validate action
bmad-dev-story
bmad-code-review
```

If code review identifies problems, return to `bmad-dev-story`. Move to the next story only after implementation, tests, and review pass.

The repeating cycle is:

```text
Create story -> Validate story -> Develop and test -> Code review
                                      ^                  |
                                      |------ fixes -----|
```

## 9. Add Automated QA

After implementing a coherent user flow, invoke:

```text
Use bmad-qa-generate-e2e-tests for the completed respondent learning flow.
```

Prioritize automated coverage for:

- Pretest gating
- Forward-seek rejection
- Video-progress recovery
- Server-side completion validation
- Seven-day posttest restriction
- Duplicate submissions
- Next-video unlocking
- Researcher authorization
- Export permissions
- Timezone and device-clock manipulation

## 10. Review Progress Continuously

Use the sprint-status workflow whenever an implementation-status summary or recommendation is needed:

```text
bmad-sprint-status
```

At the end of each epic, optionally run:

```text
bmad-retrospective
```

## Recommended Starting Point

Start in a fresh Codex chat with:

```text
Use bmad-product-brief to create a product brief from docs/blueprint.md.
Treat the blueprint as source material. Challenge assumptions and highlight unresolved research, privacy, consent, and clinical-safety decisions. Use the fast path.
```

Do not scaffold the React Native application until the implementation-readiness gate passes.
