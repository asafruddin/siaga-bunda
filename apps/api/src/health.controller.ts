import { Controller, Get } from '@nestjs/common';

export interface HealthResponse {
  service: 'siaga-bunda-api';
  status: 'ok';
}

@Controller('health')
export class HealthController {
  @Get()
  health(): HealthResponse {
    return { service: 'siaga-bunda-api', status: 'ok' };
  }
}
