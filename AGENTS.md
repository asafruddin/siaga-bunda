# AGENTS.md — SiAGA Bunda

> **This file is the single source of truth for any AI agent working in this repository.**
> Read it fully before planning or editing. When a request conflicts with these rules,
> follow this file and flag the conflict. When you add a new convention, document it here
> so future agents inherit the context.

---

## 1. Project overview

SiAGA Bunda is an MVP for **pregnancy danger-sign education** and **controlled research
monitoring**. Two roles use the system:

- **Respondent** (pregnant mother): registers, watches 7 ordered education videos, and
  completes a pretest before and a posttest after each video.
- **Researcher**: logs in to monitor respondents, view aggregate results, and export
  anonymized data.

The core respondent state machine (enforced **only** by the API) is:

```
pretest_required → video_available → video_in_progress → waiting_posttest
  → posttest_available → completed
```

Completing a posttest creates the next video's `pretest_required` row. Posttest becomes
available `POSTTEST_DELAY_DAYS` (default 7) after the video is completed.

---

## 2. Tech stack

| Area        | Choice                                                        |
| ----------- | ------------------------------------------------------------- |
| Monorepo    | pnpm workspaces + Turborepo (`turbo`)                         |
| Language    | TypeScript (strict), ESM (`"type": "module"` in API)          |
| Mobile      | Expo SDK 56, Expo Router (file-based), React 19, React Native |
| Mobile data | TanStack Query (server state) + Zustand (local/session state) |
| Backend     | Hono on a single Vercel Function, deployed as `/api/*`        |
| Database    | Supabase (PostgreSQL, RLS, SQL views, RPC)                    |
| Auth        | Supabase Auth (researcher) + app-issued JWT (`jose`)          |
| Validation  | Zod schemas in `packages/shared`                              |
| Formatting  | Prettier (`.prettierrc`: single quotes, semicolons, width 80) |
| Node        | 22.13+, pnpm 10                                               |

Do not introduce new libraries or state-management patterns without a clear need. Prefer
the tools already in use.

---

## 3. Monorepo structure

```
siaga-bunda/
  apps/
    api/                         # Hono API (one Vercel Function)
      api/index.ts               # Vercel entrypoint → handle(app)
      src/
        app.ts                   # ALL routes live here (single Hono app)
        lib.ts                   # db(), auth, researcher, ok/fail, row, audit, issueToken
        dev.ts                   # local node server + .env loader
      tests/                     # vitest
      vercel.json                # rewrites + cron for posttest reminders
    mobile/                      # Expo app
      app/                       # Expo Router routes (THIN — re-export only)
      src/
        components/ui.tsx        # shared UI primitives (Screen, Button, Field, ...)
        features/<feature>/      # feature modules (see §5)
        services/                # api.ts, session.ts, notifications.ts
        theme.ts                 # color tokens
  packages/
    shared/src/index.ts          # zod schemas, types, pregnancy calculations
  supabase/
    migrations/                  # authoritative schema, RLS, views, RPC
    seed.sql                     # videos + questions seed
  docs/                          # architecture, api-contract, schema, testing, ux-flow
```

---

## 4. Path aliases & imports

- Mobile uses the `@/` alias → `apps/mobile/src/` (`tsconfig.json` `paths`).
  - Use `@/components/ui`, `@/services/api`, `@/theme`, `@/features/...`.
  - Inside a feature, use **relative** imports for its own `lib/` and `components/`
    (e.g. `../lib/format`), and `@/` for cross-cutting modules.
- Shared code is imported from the workspace package `@siaga/shared` (never reach into
  another app's `src`).
- Import order (top to bottom): React → React Native → third-party → `expo-*` →
  `@siaga/shared` → `@/` modules → relative modules.

---

## 5. Mobile screen organization (STRICT)

Keep feature UI modular. **Never put multiple screens in one file.**

### Required structure

```
apps/mobile/src/features/<feature>/
  screens/
    index.ts                     # barrel re-exports ONLY
    <screen-name>-screen.tsx     # exactly one exported screen component per file
  components/                    # small UI pieces reused across screens
  lib/                           # formatters, shared styles, types, domain helpers
```

Examples (already implemented):

- `features/researcher/screens/home-screen.tsx` → exports `ResearcherHome`
- `features/respondent/screens/dashboard-screen.tsx` → exports `DashboardScreen`

### Rules

1. **One screen per file.** A screen is a top-level, route-facing component
   (`DashboardScreen`, `ExportScreen`, `RespondentDetail`, ...).
2. **Route files stay thin.** Files under `apps/mobile/app/` must only re-export from
   `@/features/<feature>/screens` or wrap a single screen. No business logic, no fetching,
   no styles in route files. Two accepted patterns:

   ```tsx
   // app/researcher/home.tsx
   export { ResearcherHome as default } from '@/features/researcher/screens';
   ```

   ```tsx
   // app/respondent/videos/[id]/pretest.tsx
   import { TestScreen } from '@/features/respondent/screens';
   export default function Screen() {
     return <TestScreen type="pretest" />;
   }
   ```

3. **Shared code extraction:**
   - Reused UI → `components/` (one component per file).
   - Date/format/status/domain helpers → `lib/`.
   - Styles shared by 2+ screens → `lib/styles.ts`. Screen-specific styles stay in that
     screen file via `StyleSheet.create` named `styles`.
   - Feature-local types → `lib/types.ts`.
4. **Barrel exports.** `screens/index.ts` re-exports public screens so route imports like
   `@/features/researcher/screens` keep working. It contains re-exports only.
5. **Split monoliths.** If a screen file exceeds ~250 lines, extract subcomponents into
   `components/` or co-located private components.
6. **Feature isolation.** Respondent and researcher are separate features. Do not
   cross-import between them. Share only via `@/components/ui` and `@/services/*`.

### Naming

- Screen files: kebab-case with `-screen` suffix → `respondent-detail-screen.tsx`.
- Screen exports: PascalCase matching the domain → `RespondentDetail`.
- Component files: kebab-case → `profile-row.tsx` exporting `ProfileRow`.
- Helper files: kebab-case → `status-label.ts`.

---

## 6. UI & styling conventions

- Build screens from the shared primitives in `@/components/ui`: `Screen`, `Title`,
  `Button`, `Field`, `Card`, `Progress`, `Badge`, `Loading`, `Notice`. Do not re-implement
  these.
- `Screen` renders the safe area, scroll container, and an automatic **← Kembali** back
  button. Pass `showBack={false}` on root screens (dashboards, home, onboarding).
- Never hardcode hex colors in screens. Use tokens from `@/theme` (`colors.primary`,
  `colors.text`, `colors.muted`, `colors.danger`, ...). The only exception is one-off
  decorative colors already localized in a component's own `StyleSheet`.
- Use `StyleSheet.create` and name the object `styles` (screen/component-local) or export
  a named sheet from `lib/styles.ts` for shared styles.
- All user-facing copy is **Bahasa Indonesia**, warm and respectful (address mothers as
  "Ibu"). Keep tone consistent with existing strings.

---

## 7. State management

- **Server state → TanStack Query.** Fetch through the `api()` helper inside `useQuery` /
  mutations. Use stable, descriptive `queryKey`s (e.g. `['respondent-detail', id]`).
  Invalidate with `queryClient.invalidateQueries()` after mutations.
- **Session/local state → Zustand.** `useSession` (`@/services/session`) holds the JWT and
  role, persisted in `expo-secure-store`. `useRegistration` holds the multi-step
  registration draft. Read imperatively when outside React with `useStore.getState()`.
- Do not store server data in Zustand or duplicate Query cache into local state.

---

## 8. API request patterns

### 8.1 Response envelope (contract)

Every JSON response follows one shape (types in `@siaga/shared`):

```ts
// success
{ "success": true, "data": <T> }
// failure
{ "success": false, "error": { "code": string, "message": string } }
```

`export` is the one exception: it returns raw CSV (`text/csv`) with a BOM.

### 8.2 Mobile client

Always go through the typed helpers in `@/services/api` — never call `fetch` directly for
JSON endpoints:

```ts
import { api, post, put } from '@/services/api';

const videos = await api<Video[]>('/videos'); // GET
await post(`/videos/${id}/start`); // POST
await put('/respondents/me', patch); // PUT
```

- The client injects `Authorization: Bearer <token>` from `useSession` automatically.
- Non-2xx or `success:false` throws `ApiError(code, message, status)`. Surface
  `error.message` (already localized) to the user via `Alert` or `Notice`.
- The base URL is `EXPO_PUBLIC_API_BASE_URL`. Emulator/device notes: iOS sim
  `http://localhost:3000/api`, Android emu `http://10.0.2.2:3000/api`, physical device
  uses the machine LAN IP.
- CSV export is the documented exception that uses raw `fetch` (see `export-screen.tsx`)
  because it streams a file rather than JSON.

### 8.3 Backend routes (`apps/api/src/app.ts`)

- All routes live on one Hono app under `basePath('/api')`. Keep new routes here, grouped
  with related endpoints.
- Return via helpers from `lib.ts`: `ok(c, data, status?)` and
  `fail(c, code, message, status?)`. Do not hand-roll `c.json({ success: ... })`.
- Validate every request body with a Zod schema (prefer schemas from `@siaga/shared`).
  On failure return `fail(c, 'VALIDATION_ERROR', <first issue message>)`.
- Protect routes with middleware: `auth` (valid JWT) and `researcher` (role gate).
  Researcher routes are already guarded by `app.use('/researcher/*', auth, researcher)`.
- Access the DB only via `db()` (Supabase service-role client). Unwrap query results with
  `row(...)` so Supabase errors throw consistently.
- The API is the **only** place that performs state transitions and trust decisions.
  Never trust client-reported progress: reject forward seeks and impossible watch times
  (see `/videos/:id/progress`).
- Write an `audit(action, userId?, respondentId?, entityId?, metadata?)` entry for every
  meaningful state change (registration, start, progress, complete, submit, export, ...).
- Error messages returned to clients are in Bahasa Indonesia. Internal errors are hidden
  in production (`onError` handler).

### 8.4 Security principles

- The Supabase **service-role key lives only in the API/Vercel environment**. It must
  never appear in the mobile app or any `EXPO_PUBLIC_*` variable.
- Mobile only ever holds the app JWT (in SecureStore) and public anon values.
- `JWT_SECRET` and `JOB_SECRET` must be strong and environment-specific. The cron job
  endpoint (`/jobs/send-posttest-reminders`) authenticates with `X-Job-Secret`.
- Researcher exports use anonymized `respondent_code` (hashed) — never export direct
  identifiers.
- Enforce authorization on the server. Do not rely on hiding UI as a security measure.

---

## 9. Shared package (`@siaga/shared`)

- Home for cross-cutting **types**, **Zod schemas**, and **pure domain functions**
  (`calculateHpl`, `calculatePregnancyWeeks`, `score`).
- Put any logic used by both mobile and API here, and keep it free of platform APIs
  (no React, no Node, no Supabase).
- When you change a schema, update both consumers and run typecheck across the workspace.

---

## 10. Environment variables

- API (`apps/api/.env.local`): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `SUPABASE_ANON_KEY`, `JWT_SECRET`, `JOB_SECRET`, `EXPO_ACCESS_TOKEN`,
  `POSTTEST_DELAY_DAYS`, `ALLOWED_ORIGINS`.
- Mobile (`apps/mobile/.env.local`): `EXPO_PUBLIC_API_BASE_URL`,
  `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`,
  `EXPO_PUBLIC_EAS_PROJECT_ID`. Only `EXPO_PUBLIC_*` values are safe on the client.
- `.env.local` is gitignored. Never commit real secrets. Never print secrets in output.

---

## 11. Coding style & principles

- **Prettier is authoritative.** Run `pnpm format` before finishing any change. Config:
  single quotes, semicolons, trailing commas, 80-char width, 2-space indent.
- **TypeScript strict.** Avoid `any` in new code. Type API payloads through
  `@siaga/shared` types or local `lib/types.ts`. (Existing `any` in `app.ts` is legacy;
  do not expand it.)
- **Comments explain intent, not mechanics.** Do not narrate code. Only comment
  non-obvious trade-offs or constraints (e.g. why a seek is rejected).
- **Small, single-purpose modules.** One screen/component/concern per file. Prefer pure,
  testable helpers in `lib/`.
- **No dead code / unused deps.** Remove replaced files (e.g. old monolith screens) rather
  than leaving them.
- **Consistency over novelty.** Match existing patterns (naming, envelope, helpers) before
  inventing new ones.
- **Fail loud on the server, gracefully on the client.** Server throws/`fail`s with a
  code; client catches `ApiError` and shows the localized message.

---

## 12. Commands

Run from the repo root unless noted.

| Task            | Command                           |
| --------------- | --------------------------------- |
| Install         | `pnpm install`                    |
| Start API (dev) | `pnpm --filter @siaga/api dev`    |
| Start mobile    | `pnpm --filter @siaga/mobile dev` |
| Typecheck all   | `pnpm typecheck`                  |
| Test all        | `pnpm test`                       |
| Lint all        | `pnpm lint`                       |
| Format          | `pnpm format`                     |
| Format check    | `pnpm format:check`               |

Apply DB changes by running `supabase/migrations/*.sql` then `supabase/seed.sql` in the
Supabase SQL editor.

---

## 13. Testing

- Automated tests cover the response envelope and pure shared calculations
  (`vitest`). Add tests for new shared functions and critical API behavior.
- High-risk manual scenarios (verify before release): forward-seek attempts, app
  background/resume during playback, duplicate test submission, early posttest access,
  role escalation, expired JWT, failed push delivery, pagination, export anonymization.
- For the 7-day flow, set `POSTTEST_DELAY_DAYS=0` **only** in a disposable environment.

---

## 14. Definition of done (checklist for every change)

Before considering a task complete:

1. [ ] Follows the folder/screen structure in §5 (one screen per file, thin routes).
2. [ ] Uses shared UI primitives, theme tokens, and the `api()` client (no ad-hoc fetch
       for JSON, no hardcoded colors).
3. [ ] Request bodies validated with Zod; responses use `ok`/`fail`; audit logged for
       state changes (API changes).
4. [ ] No secrets added to client code or committed env files.
5. [ ] `pnpm typecheck` passes.
6. [ ] `pnpm format` run.
7. [ ] Tests updated/added where behavior changed; `pnpm test` passes.
8. [ ] Old/replaced files removed; imports updated.
9. [ ] This file updated if you introduced a new convention.

---

## 15. Reference docs

Deeper detail lives in `docs/`:

- `docs/architecture.md` — trust boundaries and state transitions.
- `docs/api-contract.md` — endpoint list and envelope.
- `docs/database-schema.md` — schema, views, RLS.
- `docs/ux-flow.md` — respondent and researcher flows.
- `docs/testing-strategy.md` — QA scenarios.
