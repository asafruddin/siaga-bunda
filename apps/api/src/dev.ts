import { existsSync, readFileSync } from 'node:fs';
import { serve } from '@hono/node-server';
import { app } from './app.js';

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    if (!(key in process.env)) process.env[key] = trimmed.slice(eq + 1);
  }
}

const port = Number(process.env.PORT ?? 3000);
const server = serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API listening on http://localhost:${info.port}`);
  },
);
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Stop the other process (lsof -i :${port}) or run PORT=${port + 1} pnpm dev`,
    );
    process.exit(1);
  }
  throw error;
});
