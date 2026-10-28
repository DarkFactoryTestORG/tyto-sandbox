// Factory tooling (TYTO phase 26), not app code: rolls back the last applied migration so the
// factory's migrate-roundtrip gate can run up → down → up. Drizzle has no down migrations, so each
// migration may have a hand-written `migrations/down/<tag>.sql`; this runs the newest applied
// one's and forgets it in drizzle's bookkeeping, so `migrate` applies it again.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import pg from 'pg';

const root = join(import.meta.dirname, '..', 'migrations');
const journal = JSON.parse(readFileSync(join(root, 'meta', '_journal.json'), 'utf8'));
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const applied = await client.query(
    'SELECT id FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 1',
  );
  if (!applied.rowCount) {
    console.log('nothing to roll back');
  } else {
    const count = (await client.query('SELECT count(*)::int AS n FROM drizzle.__drizzle_migrations')).rows[0]
      .n;
    const entry = journal.entries[count - 1];
    const down = join(root, 'down', `${entry.tag}.sql`);
    if (!existsSync(down))
      throw new Error(`no down migration for ${entry.tag}: add migrations/down/${entry.tag}.sql`);
    await client.query('BEGIN');
    await client.query(readFileSync(down, 'utf8'));
    await client.query('DELETE FROM drizzle.__drizzle_migrations WHERE id = $1', [applied.rows[0].id]);
    await client.query('COMMIT');
    console.log(`rolled back ${entry.tag}`);
  }
} catch (error) {
  await client.query('ROLLBACK').catch(() => {});
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end();
}
