# Adversarial Review — SiAGA Bunda PRD

- The original draft omitted Participant authentication and account recovery, which would have made device loss and shared-phone use undefined; FR-32 now makes both explicit without exposing enrollment status.
- A clinically unsafe Video or answer key could previously remain available after discovery; FR-33 now provides attributable suspension and controlled re-publication.
- Retention was stated as policy but lacked executable disposition behavior across exports, backups, and vendors; FR-34 now closes that gap.
- A partially configured Study could previously enroll Participants; FR-35 now requires atomic activation, approvals, and consistency checks.
- Technical, withdrawal, and urgent-care support could have collapsed into an unsafe generic contact path; FR-36 now separates routes and prevents support from mutating research state.
- “Seven days” is a methodological choice masquerading as product behavior unless the Study Protocol approves it; the PRD uses a precise 168-hour default but blocks activation if it conflicts with the approved protocol.
- A no-forward-seek rule can punish legitimate interruption or accessibility behavior; FR-15 through FR-18 preserve pause/replay/recovery and require architecture to bound tolerance without granting client authority.
- The mobile-first export premise is a leakage trap; FR-27 prohibits unrestricted share sheets and requires template, destination, approval, expiry, and audit controls.
- Consent could degrade into checkbox theater; FR-1 through FR-3 require content, comprehension, versioning, optional-purpose separation, and non-identifying decline handling.
- “Pseudonymous by default” still permits dangerous re-identification creep; FR-6, FR-25, FR-27, and FR-30 make access exceptional and attributable.
- A zero-loss claim alongside a 15-minute RPO was internally ambiguous; NFR-2 now distinguishes synchronously acknowledged Source Records from reconstructable derived operational data.
- Conditional iOS scope would destabilize UX and architecture; the MVP now makes an explicit Android-only decision and defers iOS.
- The PRD cannot establish ethical or legal compliance by prose; §6 and §10 correctly retain institutional approval, legal/privacy review, and named accountability as hard pilot gates.
