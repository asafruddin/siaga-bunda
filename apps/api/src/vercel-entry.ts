import { app } from './app.js';

export default {
  fetch: (request: Request) => app.fetch(request),
};
