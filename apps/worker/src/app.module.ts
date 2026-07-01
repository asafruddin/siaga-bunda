import { Module } from '@nestjs/common';
import { readWorkerConfig, WORKER_CONFIG } from './config';
import { CronAuthGuard } from './cron-auth.guard';
import { CronController } from './cron.controller';
import { JOB_STORE, NoopJobStore } from './job-store';

@Module({
  controllers: [CronController],
  providers: [
    CronAuthGuard,
    { provide: WORKER_CONFIG, useFactory: () => readWorkerConfig(process.env) },
    { provide: JOB_STORE, useClass: NoopJobStore },
  ],
})
export class AppModule {}
