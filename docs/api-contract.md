# API contract

Base path: `/api`. Every JSON success is `{ "success": true, "data": ... }`; every error is `{ "success": false, "error": { "code", "message" } }`.

Authenticated endpoints use `Authorization: Bearer <jwt>`. Researcher endpoints additionally validate the researcher role.

Implemented endpoints:

- `GET /health`
- `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- `POST /respondents/register`, `GET|PUT /respondents/me`
- `GET /videos`, `GET /videos/:id`
- `POST /videos/:id/start|progress|complete`
- `GET /videos/:id/pretest|posttest`
- `POST /videos/:id/pretest/submit`, `POST /videos/:id/posttest/submit`
- `GET /researcher/overview|respondents|respondents/:id|videos/monitoring`
- `GET /researcher/results/pretest|posttest|comparison`
- `POST /researcher/export`
