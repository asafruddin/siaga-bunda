// The Hono application is bundled to handler.js by `pnpm build`.
// Every public API path is rewritten here by vercel.json so nested routes do
// not depend on Vercel's framework-specific catch-all filename semantics.
import handler from './handler.js';

export function requestForApp(request: Request) {
  const url = new URL(request.url);
  const route = url.searchParams.get('__route') ?? '';

  url.pathname = `/api${route ? `/${route.replace(/^\/+/, '')}` : ''}`;
  url.searchParams.delete('__route');

  return new Request(url, request);
}

export default {
  fetch(request: Request) {
    return handler.fetch(requestForApp(request));
  },
};
