# Blind Hunter Prompt — Mobile Scaffold

Use the `bmad-review-adversarial-general` skill. You have no specification, conversation context, or permission to inspect project files. Review only the following best-effort diff. Find at least ten concrete issues; return a Markdown list of descriptions only.

## Diff

```diff
+ root package: added `lint: turbo run lint`
+ turbo.json: added cacheless lint task
+ pnpm workspace: four `apps/*` projects; forces expo-constants 56.0.19; allows @nestjs/core, esbuild and unrs-resolver build scripts
+ gitignore: ignores .expo, expo-env.d.ts, dist, .vercel, environment files

+ apps/mobile/package.json
+ Expo 56.0.13, React Native 0.85.3, React 19.2.3, Expo Router 56.2.12
+ Android export build, strict typecheck, tsx node tests, Expo lint and Expo Doctor scripts
+ production dependencies include expo-dev-client; production OTA is disabled in app config
+ TypeScript 6.0.3 while repository root and backend use TypeScript 5.9.3

+ apps/mobile/app.json
+ name SiAGA Bunda; package id.siagabunda.app; SDK 56; default orientation; light appearance
+ updates.enabled=false; permissions=[]; compile/target SDK 36; minimum SDK 26
+ Expo Router typed routes; CNG build-properties; no EAS project id or credentials

+ apps/mobile/eas.json
+ development and preview internal APK builds; production autoIncrement=true

+ apps/mobile/app/_layout.tsx
+ SafeAreaProvider + dark StatusBar + Expo Router Stack; header hidden; warm background

+ apps/mobile/app/(public)/index.tsx
+ public scrollable shell with product heading and two neutral Indonesian scaffold messages
+ “Aplikasi sedang disiapkan.” / “Fitur peserta dan peneliti belum tersedia.”

+ apps/mobile/app/(participant)/_layout.tsx
+ wraps Slot in ProtectedRoute requiredRole="participant"
+ apps/mobile/app/(researcher)/_layout.tsx
+ wraps Slot in ProtectedRoute requiredRole="researcher"
+ each group contains a plain placeholder screen

+ apps/mobile/src/auth/access.ts
+ type AuthenticatedRole = 'participant' | 'researcher'
+ canAccessRole(session, requiredRole) returns session?.role === requiredRole
+ getSessionSnapshot() always returns null

+ apps/mobile/src/auth/ProtectedRoute.tsx
+ synchronously redirects to "/" when getSessionSnapshot cannot access required role
+ otherwise returns children

+ apps/mobile/src/components/AppShell.tsx
+ SafeAreaView; one ScrollView; centered content at maxWidth 600; 16 horizontal/24 vertical padding

+ apps/mobile/src/theme/tokens.ts
+ typed subset of approved colors, spacing, radii and Roboto text styles

+ tests
+ assert no scaffold session, no unauthenticated protected access, no cross-role access
+ assert package id, typed routes, updates disabled, light appearance, and Android API 36 config

+ README
+ says this is an Android-first non-functional scaffold and protected routes deny until authentication

+ generated pnpm-lock.yaml
+ API/worker Jest configs ignore local .vercel output
```
