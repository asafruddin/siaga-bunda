import { InjectionToken } from '@nestjs/common';

export interface DrainResult {
  claimed: number;
  completed: number;
  failed: number;
}

export interface JobStore {
  drain(limit: number): Promise<DrainResult>;
}

export const JOB_STORE = 'JOB_STORE' as unknown as InjectionToken<JobStore>;

export class NoopJobStore implements JobStore {
  async drain(_limit: number): Promise<DrainResult> {
    return { claimed: 0, completed: 0, failed: 0 };
  }
}
