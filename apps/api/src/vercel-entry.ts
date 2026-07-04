import { app } from './app.js';

const serve = (request: Request) => app.fetch(request);

export const GET = serve;
export const POST = serve;
export const PUT = serve;
export const PATCH = serve;
export const DELETE = serve;
export const OPTIONS = serve;
export const HEAD = serve;
