import { InjectionToken } from '@nestjs/common';

export interface WorkerConfig {
  cronSecret: string;
  batchSize: number;
}

export const WORKER_CONFIG = 'WORKER_CONFIG' as unknown as InjectionToken<WorkerConfig>;

export function readWorkerConfig(env: NodeJS.ProcessEnv): WorkerConfig {
  const cronSecret = env.CRON_SECRET?.trim();
  if (!cronSecret) {
    throw new Error('CRON_SECRET is required');
  }

  return { cronSecret, batchSize: 25 };
}
