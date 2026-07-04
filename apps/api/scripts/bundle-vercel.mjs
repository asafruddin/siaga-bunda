import * as esbuild from 'esbuild';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

await esbuild.build({
  entryPoints: [resolve(root, 'src/vercel-entry.ts')],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: resolve(root, 'api/index.js'),
  alias: {
    '@siaga/shared': resolve(root, '../../packages/shared/dist/index.js'),
  },
  external: ['@supabase/supabase-js', 'hono', 'jose', 'zod'],
  logLevel: 'info',
});
