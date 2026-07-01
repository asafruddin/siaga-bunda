import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { WORKER_CONFIG, WorkerConfig } from './config';
import { CronAuthGuard } from './cron-auth.guard';
import { JOB_STORE, JobStore } from './job-store';

@Controller('api/cron')
export class CronController {
  constructor(
    @Inject(JOB_STORE) private readonly jobStore: JobStore,
    @Inject(WORKER_CONFIG) private readonly config: WorkerConfig,
  ) {}

  @Get('drain')
  @UseGuards(CronAuthGuard)
  drain() {
    return this.jobStore.drain(this.config.batchSize);
  }
}
