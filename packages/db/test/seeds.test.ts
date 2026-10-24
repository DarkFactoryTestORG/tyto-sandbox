import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { connect, type DbHandle } from '../src/client';
import { fixtureId } from '../src/ids';
import { resetDatabase } from '../src/migrations';
import { scenarioFixtures, seedScenario } from '../seeds';

let handle: DbHandle;
beforeAll(() => {
  handle = connect();
});
afterAll(async () => {
  await handle.close();
});

async function count(table: string): Promise<number> {
  const result = await handle.db.execute(sql.raw(`SELECT count(*)::int AS n FROM ${table}`));
  return (result.rows[0] as { n: number }).n;
}

/** Every row of the seeded tables, ordered, as one string. */
async function dump(): Promise<string> {
  const tables = [
    'users',
    'workspaces',
    'memberships',
    'invites',
    'projects',
    'labels',
    'tasks',
    'task_labels',
    'comments',
    'activity_events',
  ];
  const parts: unknown[] = [];
  for (const t of tables)
    parts.push((await handle.db.execute(sql.raw(`SELECT * FROM ${t} ORDER BY 1, 2`))).rows);
  return JSON.stringify(parts);
}

describe('migrations', () => {
  it('build the schema from scratch', async () => {
    await resetDatabase(handle.db);
    expect(await count('users')).toBe(0);
    expect(await count('tasks')).toBe(0);
  });
});

describe('baseline', () => {
  it('has the fixtures the catalogue names, with derived ids', async () => {
    await resetDatabase(handle.db);
    const result = await seedScenario(handle.db, 'baseline');
    for (const name of ['workspace.acme', 'user.owner', 'user.member', 'project.alpha', 'workspace.other']) {
      expect(result.fixtures[name]).toBe(fixtureId(name));
    }
    const acme = await handle.db.execute(
      sql`SELECT slug FROM workspaces WHERE id = ${fixtureId('workspace.acme')}`,
    );
    expect(acme.rows).toEqual([{ slug: 'acme' }]);
  });

  it('is idempotent', async () => {
    const before = await dump();
    await seedScenario(handle.db, 'baseline');
    expect(await dump()).toBe(before);
  });

  it('is deterministic for a given now', async () => {
    const first = await dump();
    await resetDatabase(handle.db);
    await seedScenario(handle.db, 'baseline');
    expect(await dump()).toBe(first);
  });

  it('lists the same fixtures without a database', () => {
    expect(Object.keys(scenarioFixtures('baseline')).sort()).toContain('project.alpha');
  });
});

describe('review', () => {
  it('has every role and pending invites', async () => {
    await resetDatabase(handle.db);
    await seedScenario(handle.db, 'review');
    const roles = await handle.db.execute(
      sql`SELECT DISTINCT role::text AS role FROM memberships ORDER BY 1`,
    );
    expect(roles.rows.map((r) => r.role)).toEqual(['admin', 'member', 'owner', 'viewer']);
    expect(await count(`invites WHERE status = 'pending'`)).toBeGreaterThanOrEqual(2);
  });

  it('moves its dates with --now', async () => {
    await resetDatabase(handle.db);
    await seedScenario(handle.db, 'review', { now: '2027-01-15T12:00:00Z' });
    const due = await handle.db.execute(
      sql`SELECT to_char(due_date AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI') AS due FROM tasks WHERE id = ${fixtureId('task.web-domain')}`,
    );
    expect(due.rows).toEqual([{ due: '2027-01-15 00:00' }]);
  });
});

describe('large-project', () => {
  it('has 50,000 tasks in project.large and 20 in project.small', async () => {
    await resetDatabase(handle.db);
    await seedScenario(handle.db, 'large-project');
    expect(await count(`tasks WHERE project_id = '${fixtureId('project.large')}'`)).toBe(50_000);
    expect(await count(`tasks WHERE project_id = '${fixtureId('project.small')}'`)).toBe(20);
  });
});
