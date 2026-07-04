import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('API routing', () => {
  it('serves API metadata at the base path', async () => {
    const response = await app.request('/api');
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      data: { service: 'siaga-bunda-api', status: 'online' },
    });
  });

  it('matches nested login routes for POST requests', async () => {
    const response = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      success: false,
      error: { code: 'VALIDATION_ERROR' },
    });
  });

  it('returns the standard envelope for unknown routes', async () => {
    const response = await app.request('/api/does/not/exist');
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({
      success: false,
      error: { code: 'NOT_FOUND' },
    });
  });
});
