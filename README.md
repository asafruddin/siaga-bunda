# SiAGA Bunda

Monorepo MVP for pregnancy danger-sign education and controlled research monitoring.

## Modules

- `apps/mobile`: Expo SDK 56 app for respondents and researchers.
- `apps/api`: Hono API deployable as one Vercel Function.
- `packages/shared`: shared schemas, types, and pregnancy calculations.
- `supabase`: PostgreSQL schema, RLS, reporting views, and seed content.

## Setup

Requirements: Node.js 22.13+, pnpm 10, a Supabase project, and (for push notifications) an Expo/EAS project.

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

- Replace development JWT/job secrets and seeded video URLs.
- Configure the Vercel variables and cron authorization.
- Configure EAS project ID and Expo access token for push delivery.
- Review retention/deletion policy and researcher access before collecting real health data.
- Test the native splash and notification flow in release builds.
