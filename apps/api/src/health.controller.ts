import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { type Database } from '@plotline/db';
import { sql } from 'drizzle-orm';
import { InjectDb } from './db.module';

@Controller('health')
export class HealthController {
  constructor(@InjectDb() private readonly db: Database) {}

  @Get()
  async health(): Promise<{ status: 'ok' }> {
    try {
      await this.db.execute(sql`SELECT 1`);
    } catch {
      throw new ServiceUnavailableException('database unreachable');
    }
    return { status: 'ok' };
  }
}
