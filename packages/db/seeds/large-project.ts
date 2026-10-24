// `large-project`: baseline, plus project.large with 50,000 tasks and project.small with 20, both
// in workspace.acme. The large one is inserted with one generate_series statement; its ids are
// md5-derived, so they are as stable as the fixture ids.
import { sql } from 'drizzle-orm';
import type { Database } from '../src/client';
import { baseline } from './baseline';
import type { Seeder } from './lib';

export const LARGE_PROJECT_TASKS = 50_000;
export const SMALL_PROJECT_TASKS = 20;

export function largeProject(s: Seeder): void {
  baseline(s);
  const acme = s.fixtures['workspace.acme']!;
  s.project('project.large', acme, { slug: 'large', name: 'Large', description: '50,000 tasks.' });
  const small = s.project('project.small', acme, { slug: 'small', name: 'Small', description: '20 tasks.' });
  const assignees = [s.fixtures['user.owner']!, s.fixtures['user.member']!, null];
  for (let i = 1; i <= SMALL_PROJECT_TASKS; i++) {
    s.task(`task.small-${i}`, small, {
      title: `Small task ${i}`,
      assigneeId: assignees[i % 3] ?? null,
      dueDate: i % 4 === 0 ? s.dueIn(i) : null,
      createdDaysAgo: SMALL_PROJECT_TASKS - i,
      done: i % 5 === 0,
    });
  }
}

/** Runs after the Seeder has written project.large: the bulk rows. */
export async function largeProjectBulk(db: Database, s: Seeder): Promise<void> {
  const project = s.fixtures['project.large']!;
  const owner = s.fixtures['user.owner']!;
  const member = s.fixtures['user.member']!;
  const now = s.now.toISOString();
  // Titles are ASCII, so lower() equals textkit's searchKey for them.
  await db.execute(sql`
    INSERT INTO tasks (id, project_id, title, search_key, status, assignee_id, due_date, created_by_id, created_at, updated_at, completed_at)
    SELECT
      md5('plotline:task.large-' || i)::uuid,
      ${project}::uuid,
      'Large task ' || i,
      'large task ' || i,
      (CASE WHEN i % 7 = 0 THEN 'done' ELSE 'open' END)::task_status,
      CASE i % 3 WHEN 0 THEN ${owner}::uuid WHEN 1 THEN ${member}::uuid ELSE NULL END,
      CASE WHEN i % 10 = 0 THEN date_trunc('day', ${now}::timestamptz AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' + (i % 60) * interval '1 day' ELSE NULL END,
      ${owner}::uuid,
      ${now}::timestamptz - (${LARGE_PROJECT_TASKS} - i) * interval '1 minute',
      ${now}::timestamptz - (${LARGE_PROJECT_TASKS} - i) * interval '1 minute',
      CASE WHEN i % 7 = 0 THEN ${now}::timestamptz - interval '1 hour' ELSE NULL END
    FROM generate_series(1, ${LARGE_PROJECT_TASKS}) AS i
    ON CONFLICT (id) DO NOTHING
  `);
}
