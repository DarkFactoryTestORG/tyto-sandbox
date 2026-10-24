import { join } from 'node:path';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type { Database } from './client';

/** packages/db, from both src/ (tests run the source) and dist/src/ (built). */
const PACKAGE_ROOT = __dirname.endsWith(join('dist', 'src'))
  ? join(__dirname, '../..')
  : join(__dirname, '..');
export const MIGRATIONS_FOLDER = join(PACKAGE_ROOT, 'migrations');

export async function runMigrations(db: Database): Promise<void> {
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
}

/** Drops everything (the app's tables and drizzle's bookkeeping), then migrates from scratch. */
export async function resetDatabase(db: Database): Promise<void> {
  await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);
  await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);
  await runMigrations(db);
}
