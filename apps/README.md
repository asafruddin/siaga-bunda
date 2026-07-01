# Backend deployment proof

`api` and `worker` are independent Vercel project roots from one pnpm workspace. Set each Vercel project's Root Directory to its app folder and pin deployments to Singapore through the checked-in configuration.

Local verification requires Node.js 24 and pnpm 11. The worker additionally needs `CRON_SECRET` only when it starts; tests inject a synthetic value.

This proof does not establish a live deployment or database connection. A complete Preview gate still requires authenticated Vercel projects, an approved synthetic Aurora environment, environment bindings, a real cron invocation, observability inspection, and a rollback drill. Never connect Preview to participant or production Study Data.
