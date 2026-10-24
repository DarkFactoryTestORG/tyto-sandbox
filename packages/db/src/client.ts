import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

export interface DbHandle {
  db: Database;
  pool: Pool;
  close(): Promise<void>;
}

export function connect(url = requireDatabaseUrl()): DbHandle {
  const pool = new Pool({ connectionString: url, max: 10 });
  const db = drizzle(pool, { schema });
  return { db, pool, close: () => pool.end() };
}

export function requireDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const url = env.DATABASE_URL;
  if (!url)
    throw new Error('DATABASE_URL is not set (e.g. postgres://plotline:plotline@localhost:5432/plotline)');
  return url;
}
