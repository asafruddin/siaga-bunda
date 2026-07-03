import { describe, expect, it } from 'vitest';
import { app } from '../src/app';
describe('health endpoint', () => {
  it('uses the standard response envelope', async () => {
    const response = await app.request('/api/health');
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      data: { service: 'siaga-bunda-api', status: 'healthy' },
    });
  });
});
