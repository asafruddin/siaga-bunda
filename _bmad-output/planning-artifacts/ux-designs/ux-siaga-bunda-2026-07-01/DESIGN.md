---
name: SiAGA Bunda
description: Calm, accessible Android design system for maternal-health education and research participation.
status: final
sources:
  - ../../prds/prd-siaga-bunda-2026-07-01/prd.md
  - ../../briefs/brief-siaga-bunda-2026-07-01/brief.md
updated: 2026-07-01
colors:
  surface-base: '#FFF8F5'
  surface-raised: '#FFFFFF'
  surface-muted: '#F4EFEC'
  ink-primary: '#1D1B20'
  ink-secondary: '#4E454A'
  ink-disabled: '#777075'
  primary: '#176B5B'
  on-primary: '#FFFFFF'
  primary-container: '#D4F2EA'
  on-primary-container: '#0B3B32'
  researcher: '#315A7D'
  on-researcher: '#FFFFFF'
  researcher-container: '#D7E9F8'
  on-researcher-container: '#173B57'
  warning: '#8A4F00'
  warning-container: '#FFE2B8'
  on-warning-container: '#3A2000'
  danger: '#B3261E'
  on-danger: '#FFFFFF'
  danger-container: '#FFDAD6'
  on-danger-container: '#410002'
  success: '#246B3C'
  success-container: '#C8F0D2'
  on-success-container: '#0A3519'
  outline: '#79747E'
  outline-subtle: '#CAC4D0'
  focus-ring: '#0B57D0'
  scrim: '#000000'
typography:
  display:
    fontFamily: Roboto
    fontSize: 32sp
    fontWeight: '500'
    lineHeight: '40sp'
  headline:
    fontFamily: Roboto
    fontSize: 24sp
    fontWeight: '600'
    lineHeight: '32sp'
  title:
    fontFamily: Roboto
    fontSize: 20sp
    fontWeight: '600'
    lineHeight: '28sp'
  body:
    fontFamily: Roboto
    fontSize: 16sp
    fontWeight: '400'
    lineHeight: '24sp'
  body-strong:
    fontFamily: Roboto
    fontSize: 16sp
    fontWeight: '600'
    lineHeight: '24sp'
  label:
    fontFamily: Roboto
    fontSize: 14sp
    fontWeight: '600'
    lineHeight: '20sp'
  meta:
    fontFamily: Roboto
    fontSize: 14sp
    fontWeight: '400'
    lineHeight: '20sp'
rounded:
  sm: 8dp
  md: 12dp
  lg: 16dp
  full: 9999dp
spacing:
  '1': 4dp
  '2': 8dp
  '3': 12dp
  '4': 16dp
  '5': 24dp
  '6': 32dp
  '7': 40dp
  '8': 48dp
  screen-margin: 16dp
  section-gap: 24dp
components:
  app-shell:
    background: '{colors.surface-base}'
    foreground: '{colors.ink-primary}'
  top-app-bar:
    background: '{colors.surface-base}'
    foreground: '{colors.ink-primary}'
    min-height: 64dp
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.on-primary}'
    radius: '{rounded.md}'
    min-height: 52dp
  button-secondary:
    background: '{colors.surface-raised}'
    foreground: '{colors.primary}'
    border: '{colors.primary}'
    radius: '{rounded.md}'
    min-height: 52dp
  button-danger:
    background: '{colors.danger}'
    foreground: '{colors.on-danger}'
    radius: '{rounded.md}'
    min-height: 52dp
  text-field:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.outline}'
    focus-border: '{colors.focus-ring}'
    radius: '{rounded.sm}'
    min-height: 56dp
  choice-row:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.outline-subtle}'
    selected-border: '{colors.primary}'
    selected-background: '{colors.primary-container}'
    radius: '{rounded.md}'
    min-height: 56dp
  consent-section:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.outline-subtle}'
    radius: '{rounded.lg}'
  status-banner:
    background: '{colors.surface-muted}'
    foreground: '{colors.ink-primary}'
    radius: '{rounded.md}'
  module-card:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.outline-subtle}'
    radius: '{rounded.lg}'
    min-height: 96dp
  progress-stepper:
    active: '{colors.primary}'
    complete: '{colors.success}'
    pending: '{colors.outline}'
  video-player:
    background: '#000000'
    foreground: '#FFFFFF'
    radius: '{rounded.md}'
  waiting-card:
    background: '{colors.warning-container}'
    foreground: '{colors.on-warning-container}'
    radius: '{rounded.lg}'
  urgent-care-card:
    background: '{colors.danger-container}'
    foreground: '{colors.on-danger-container}'
    border: '{colors.danger}'
    radius: '{rounded.lg}'
  state-panel:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.outline-subtle}'
    radius: '{rounded.lg}'
  researcher-summary-card:
    background: '{colors.researcher-container}'
    foreground: '{colors.on-researcher-container}'
    radius: '{rounded.lg}'
  participant-row:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    divider: '{colors.outline-subtle}'
    min-height: 72dp
  filter-chip:
    background: '{colors.surface-raised}'
    foreground: '{colors.researcher}'
    selected-background: '{colors.researcher}'
    selected-foreground: '{colors.on-researcher}'
    radius: '{rounded.full}'
    min-height: 48dp
  timeline-event:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    marker: '{colors.researcher}'
  export-panel:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.outline-subtle}'
    radius: '{rounded.lg}'
  bottom-sheet:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    radius-top: '{rounded.lg}'
---

# SiAGA Bunda — Design Spine

## Brand & Style

SiAGA Bunda should feel calm, trustworthy, and plainly useful under stress. It is maternal-health education inside a research context, not a baby lifestyle brand and not a clinical monitoring console. The visual language uses warm surfaces, high-contrast text, restrained color, literal status labels, and generous touch targets. It avoids infantilizing pink palettes, decorative medical imagery, gamification, and celebratory treatment of Study completion.

The Android MVP inherits Material 3 interaction conventions but fixes a product palette and component layer so state meanings remain consistent across devices. Light mode is the tested MVP appearance; dark mode is deferred until every health, error, and status combination receives equivalent contrast validation.

## Colors

- **Primary teal `{colors.primary}`** identifies the Participant’s safe primary action and active Study step. White text on teal must meet at least 4.5:1 contrast.
- **Researcher blue `{colors.researcher}`** distinguishes the Researcher surface without implying a separate brand. It never appears as a Participant progress status.
- **Warm surface `{colors.surface-base}`** reduces a sterile dashboard feel while keeping content legible. Raised cards use `{colors.surface-raised}` rather than shadows for hierarchy.
- **Danger red `{colors.danger}`** is reserved for urgent-care guidance, destructive confirmation, and safety-critical failure. It never decorates ordinary assessment errors or low scores.
- **Warning amber `{colors.warning}`** means waiting, delayed, or attention required—not clinical danger.
- **Success green `{colors.success}`** means a system action or Study step was accepted. It never means the pregnancy is healthy or clinically safe.
- **Focus blue `{colors.focus-ring}`** remains distinct from semantic status colors and is visible on every interactive surface.

Every status combines color with text and an icon or structural cue. No Study meaning is color-only.

## Typography

Roboto is inherited from Android and must honor system font scaling through 200%. `{typography.display}` is reserved for first-run orientation and major completion headings; routine screens use `{typography.headline}` or `{typography.title}`. Body copy never drops below `{typography.meta}` and Consent, Urgent-care Guidance, errors, and assessment options use `{typography.body}`.

Avoid all caps, narrow weights, justified paragraphs, and truncating health or Consent content. Numeric dates pair a localized human form with time zone when timing affects access.

## Layout & Spacing

Use a single-column mobile layout with `{spacing.screen-margin}` and an 8dp rhythm. Primary actions sit after the content they commit, not persistently over Consent or assessment text. Major sections use `{spacing.section-gap}`; related label/value groups use `{spacing.2}` or `{spacing.3}`.

At 200% font scaling, controls wrap vertically and remain in reading order. Horizontal carousels, dense data tables, and two-column forms are prohibited. Researcher aggregates use stacked cards and paginated lists.

## Elevation & Depth

Hierarchy comes from tonal surfaces, borders, spacing, and headings. Use Material elevation only for the Top App Bar during scroll and for a Bottom Sheet above a scrim. Module cards, result summaries, and forms do not float. Shadows must never be the only boundary between interactive regions.

## Shapes

`{rounded.sm}` belongs to inputs; `{rounded.md}` to actions and compact panels; `{rounded.lg}` to major cards and sheets. Full pills are reserved for Filter Chips and compact, non-critical labels. Urgent-care cards use the same calm geometry as other cards; urgency comes from language and contrast, not jagged or alarming decoration.

## Components

- **App Shell** — `{components.app-shell}`; one vertical scroll region below a native-safe Top App Bar.
- **Top App Bar** — `{components.top-app-bar}`; title, Back when needed, and at most two labeled/icon actions. Urgent-care access may appear as a visible text action, never icon-only.
- **Primary / Secondary / Danger Buttons** — `{components.button-primary}`, `{components.button-secondary}`, `{components.button-danger}`; full-width on Participant commit screens, label-first, loading state preserves width and label context.
- **Text Field** — `{components.text-field}`; persistent label, helper/error text below, never placeholder-only. Error border pairs with text and screen-reader announcement.
- **Choice Row** — `{components.choice-row}`; whole row is tappable, selection uses border, fill, control state, and text announcement.
- **Consent Section** — `{components.consent-section}`; scannable heading and paragraphs with separate required/optional controls. Never compress Consent into a single checkbox row.
- **Status Banner** — `{components.status-banner}`; inline operational status with title, consequence, and one recovery action.
- **Module Card** — `{components.module-card}`; sequence number, title, literal Learning State, next action, and availability time when relevant. Locked cards remain readable, not disabled-opacity ghosts.
- **Progress Stepper** — `{components.progress-stepper}`; Pretest → Video → Wait → Posttest. Always paired with text; no percentage implies comprehension.
- **Video Player** — `{components.video-player}`; native play/pause, replay, captions, transcript, elapsed/total time, and constrained scrubber. Forward-unavailable region is visibly distinct and explained.
- **Waiting Card** — `{components.waiting-card}`; localized date/time, time zone, refresh action, and notification preference status.
- **Urgent-care Card** — `{components.urgent-care-card}`; clinically approved heading, direct action, and boundary that the app does not diagnose. It remains high in the reading order.
- **State Panel** — `{components.state-panel}`; shared empty/loading/error/offline/permission pattern with literal title, consequence, and valid next action.
- **Researcher Summary Card** — `{components.researcher-summary-card}`; metric label, value, denominator, last refresh, and drill-down target.
- **Participant Row** — `{components.participant-row}`; Participant Code, Learning State, next milestone, and exception marker. Direct identifiers never appear by default.
- **Filter Chip** — `{components.filter-chip}`; selected state has text and checked semantics; never rely on blue fill alone.
- **Timeline Event** — `{components.timeline-event}`; event label, Server Clock timestamp, status, version/deviation context, and expandable detail.
- **Export Panel** — `{components.export-panel}`; template, purpose, destination, approval, expiry, and request status. No generic “Share” affordance.
- **Bottom Sheet** — `{components.bottom-sheet}`; confirmation and filters only, one level deep, dismissible unless acknowledging a destructive consequence.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Use explicit Indonesian state labels and next actions | Use color-only badges, unexplained locks, or medical jargon |
| Keep urgent-care access visible during every Study task | Hide safety information behind completion or connectivity |
| Say a Study step is complete | Say the Participant or pregnancy is “safe,” “normal,” or “healthy” |
| Show Participant Code by default to Researchers | Put name, phone, address, or pregnancy detail in list rows |
| Preserve entered data after recoverable errors | Clear a form or assessment because the network failed |
| Use calm, literal feedback | Add confetti, streaks, scores-as-rewards, or pressure copy |
| Use neutral notification previews | Mention pregnancy, danger signs, tests, or the Study on a lock screen |
