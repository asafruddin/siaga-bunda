import { readWorkerConfig } from '../src/config';

describe('Worker configuration', () => {
  it('fails closed without CRON_SECRET', () => {
    expect(() => readWorkerConfig({})).toThrow('CRON_SECRET is required');
  });

  it('does not expose the secret in its failure', () => {
    expect(() => readWorkerConfig({ CRON_SECRET: '   ' })).toThrow('CRON_SECRET is required');
  });
});
