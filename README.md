# SiAGA Bunda Apps

Monorepo MVP for pregnancy danger-sign education and controlled research monitoring.

## Modules

- `apps/mobile`: Expo SDK 56 app for respondents and researchers.
- `apps/api`: Hono API deployable as one Vercel Function.
- `packages/shared`: shared schemas, types, and pregnancy calculations.
- `supabase`: PostgreSQL schema, RLS, reporting views, and seed content.

## Setup

Requirements: Node.js 22.13+, pnpm 10, and a Supabase project.

1. Install packages: `pnpm install`.
2. Apply `supabase/migrations/202607030001_initial_schema.sql`, then `supabase/seed.sql` in Supabase.
3. Copy `apps/api/.env.example` to `apps/api/.env.local` and set real server secrets.
4. Copy `apps/mobile/.env.example` to `apps/mobile/.env.local` and set public values only.
5. Start API: `pnpm --filter @siaga/api dev`.
6. Start mobile: `pnpm --filter @siaga/mobile dev`.

For an Android emulator, use `http://10.0.2.2:3000/api`; for a physical device use the development machine's LAN address. Replace all seeded `storage.example.com` URLs with real videos before testing playback.

## Researcher account

Create the user through Supabase Authentication, then link its UUID:

```sql
insert into public.users(auth_user_id, role, email)
values ('AUTH_USER_UUID', 'researcher', 'researcher@example.com');
```

## Validation

Run `pnpm typecheck` and `pnpm test`. API responses follow `{ success, data }` or `{ success, error }`. The service-role key belongs only in the API/Vercel environment.

## Production checklist

- Set the Vercel project **Root Directory** to `apps/api`.
- Use **Framework Preset: Other**. Keep **Output Directory** as `public` (the repo includes an empty `apps/api/public` folder for Vercel).
- Build command and install command are defined in `apps/api/vercel.json` for the pnpm monorepo.
- Add API environment variables in Vercel: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `JWT_SECRET`, `POSTTEST_DELAY_DAYS`, `ALLOWED_ORIGINS`.
- Replace development JWT secrets and seeded video URLs.
- Review retention/deletion policy and researcher access before collecting real health data.
- Test the native splash flow in release builds.
