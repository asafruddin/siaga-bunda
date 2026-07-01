import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import { WORKER_CONFIG, WorkerConfig } from './config';

interface HeaderRequest {
  header(name: string): string | undefined;
}

function secureEqual(left: string, right: string): boolean {
  const leftHash = createHash('sha256').update(left).digest();
  const rightHash = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

@Injectable()
export class CronAuthGuard implements CanActivate {
  constructor(@Inject(WORKER_CONFIG) private readonly config: WorkerConfig) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<HeaderRequest>();
    const expected = `Bearer ${this.config.cronSecret}`;
    if (!secureEqual(request.header('authorization') ?? '', expected)) {
      throw new HttpException(
        {
          type: 'https://siaga-bunda.invalid/problems/unauthorized',
          title: 'Unauthorized',
          status: 401,
          code: 'WORKER_UNAUTHORIZED',
        },
        401,
      );
    }
    return true;
  }
}
