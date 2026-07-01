import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { WorkerConfig, WORKER_CONFIG } from '../src/config';

describe('Cron drain endpoint', () => {
  let app: INestApplication;
  const config: WorkerConfig = { cronSecret: 'test-secret', batchSize: 25 };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(WORKER_CONFIG)
      .useValue(config)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  it('runs a bounded no-op drain for Vercel Cron', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/cron/drain')
      .set('Authorization', 'Bearer test-secret')
      .expect(200);
    expect(response.body).toEqual({ claimed: 0, completed: 0, failed: 0 });
  });

  it.each([undefined, 'Bearer wrong-secret'])('rejects invalid authorization', async (authorization) => {
    const pending = request(app.getHttpServer()).get('/api/cron/drain');
    if (authorization) pending.set('Authorization', authorization);
    const response = await pending.expect(401);
    expect(response.body).toEqual({
      type: 'https://siaga-bunda.invalid/problems/unauthorized',
      title: 'Unauthorized',
      status: 401,
      code: 'WORKER_UNAUTHORIZED',
    });
  });
});
