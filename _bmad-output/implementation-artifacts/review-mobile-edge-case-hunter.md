# Edge Case Hunter Prompt — Mobile Scaffold

Use the `bmad-review-edge-case-hunter` skill. Treat the files below as the best-effort diff because this workspace has no VCS baseline. You may read only these changed files and their directly imported dependencies. Walk every branch and boundary reachable from changed lines, then return only the required JSON array.

Changed scope:

- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`
- `apps/mobile/package.json`, `apps/mobile/app.json`, `apps/mobile/eas.json`, `apps/mobile/tsconfig.json`, `apps/mobile/eslint.config.js`
- every source and test file under `apps/mobile/app`, `apps/mobile/src`, and `apps/mobile/test`
- `apps/api/jest.config.cjs`, `apps/worker/jest.config.cjs`

Also consider direct deep links, route transitions during future session hydration, stale or malformed session roles, safe-area initialization, 320dp width, 200% font scaling, Android dark-mode requests, orientation changes, absent native credentials, and monorepo command behavior.
