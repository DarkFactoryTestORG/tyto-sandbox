import { Injectable } from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import { eq, sql } from 'drizzle-orm';
import { InjectDb } from '../db.module';

@Injectable()
export class UsersRepository {
  constructor(@InjectDb() private readonly db: Database) {}

  findById(id: string) {
    return this.db.query.users.findFirst({ where: eq(schema.users.id, id) });
  }

  findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(sql`lower(${schema.users.email})`, email.toLowerCase()),
    });
  }
}
