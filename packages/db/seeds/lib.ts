// Building blocks for seed scenarios. Every row gets a fixed id (fixtureId of its fixture name)
// and timestamps relative to a fixed "now", so a scenario always produces the same database.
// Inserts ignore conflicts, so re-running a scenario on a seeded database changes nothing.
import bcrypt from 'bcryptjs';
import { searchKey } from '@plotline/textkit';
import type { Database } from '../src/client';
import { fixtureId } from '../src/ids';
import * as s from '../src/schema';

/** The password of every seeded account. Throwaway sandbox credentials. */
export const SEED_PASSWORD = 'plotline';
/** bcrypt with a fixed salt keeps the hash, and so the database, identical between runs. */
const FIXED_SALT = '$2b$10$plotlineseedsaltfixed.';
let passwordHash: string | undefined;
const hashPassword = () => (passwordHash ??= bcrypt.hashSync(SEED_PASSWORD, FIXED_SALT));

type Role = (typeof s.roleEnum.enumValues)[number];
const DAY = 86_400_000;

export interface SeedContext {
  db: Database;
  now: Date;
}

/** Collects rows by table and records every fixture name it hands out. */
export class Seeder {
  readonly fixtures: Record<string, string> = {};
  private readonly rows = {
    users: [] as (typeof s.users.$inferInsert)[],
    workspaces: [] as (typeof s.workspaces.$inferInsert)[],
    memberships: [] as (typeof s.memberships.$inferInsert)[],
    invites: [] as (typeof s.invites.$inferInsert)[],
    projects: [] as (typeof s.projects.$inferInsert)[],
    labels: [] as (typeof s.labels.$inferInsert)[],
    tasks: [] as (typeof s.tasks.$inferInsert)[],
    taskLabels: [] as (typeof s.taskLabels.$inferInsert)[],
    comments: [] as (typeof s.comments.$inferInsert)[],
    activity: [] as (typeof s.activityEvents.$inferInsert)[],
  };

  constructor(readonly now: Date) {}

  /** `now` shifted by whole days (negative is the past). */
  days(n: number): Date {
    return new Date(this.now.getTime() + n * DAY);
  }

  /** A due date n days from now, stored as UTC midnight (what the API stores for a UTC user). */
  dueIn(n: number): Date {
    const d = this.days(n);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  id(fixture: string): string {
    const id = fixtureId(fixture);
    this.fixtures[fixture] = id;
    return id;
  }

  user(fixture: string, v: { email: string; name: string; timezone?: string; avatarUrl?: string }): string {
    const id = this.id(fixture);
    this.rows.users.push({
      id,
      passwordHash: hashPassword(),
      timezone: 'UTC',
      createdAt: this.days(-120),
      ...v,
    });
    return id;
  }

  workspace(
    fixture: string,
    v: { slug: string; name: string; plan?: 'monthly' | 'annual'; billingAnchor?: string },
  ): string {
    const id = this.id(fixture);
    this.rows.workspaces.push({ id, billingAnchor: '2026-01-01', createdAt: this.days(-120), ...v });
    return id;
  }

  member(
    fixture: string,
    workspaceId: string,
    userId: string,
    role: Role,
    createdAt = this.days(-90),
  ): string {
    const id = this.id(fixture);
    this.rows.memberships.push({ id, workspaceId, userId, role, createdAt });
    return id;
  }

  invite(
    fixture: string,
    workspaceId: string,
    email: string,
    v: { role?: Role; invitedById?: string } = {},
  ): string {
    const id = this.id(fixture);
    this.rows.invites.push({ id, workspaceId, email, createdAt: this.days(-2), ...v });
    return id;
  }

  project(
    fixture: string,
    workspaceId: string,
    v: { slug: string; name: string; description?: string },
  ): string {
    const id = this.id(fixture);
    this.rows.projects.push({ id, workspaceId, createdAt: this.days(-60), ...v });
    return id;
  }

  label(fixture: string, workspaceId: string, name: string, color: string): string {
    const id = this.id(fixture);
    this.rows.labels.push({ id, workspaceId, name, color });
    return id;
  }

  task(
    fixture: string,
    projectId: string,
    v: {
      title: string;
      description?: string;
      assigneeId?: string | null;
      dueDate?: Date | null;
      createdById?: string;
      done?: boolean;
      createdDaysAgo?: number;
      labelIds?: string[];
    },
  ): string {
    const id = this.id(fixture);
    const createdAt = this.days(-(v.createdDaysAgo ?? 14));
    this.rows.tasks.push({
      id,
      projectId,
      title: v.title,
      description: v.description ?? '',
      searchKey: searchKey(v.title),
      status: v.done ? 'done' : 'open',
      assigneeId: v.assigneeId ?? null,
      dueDate: v.dueDate ?? null,
      createdById: v.createdById ?? null,
      createdAt,
      updatedAt: createdAt,
      completedAt: v.done ? this.days(-1) : null,
    });
    for (const labelId of v.labelIds ?? []) this.rows.taskLabels.push({ taskId: id, labelId });
    return id;
  }

  comment(fixture: string, taskId: string, authorId: string, body: string, daysAgo = 3): string {
    const id = this.id(fixture);
    this.rows.comments.push({ id, taskId, authorId, body, createdAt: this.days(-daysAgo) });
    return id;
  }

  activity(
    fixture: string,
    v: {
      workspaceId: string;
      kind: 'created' | 'completed' | 'assigned' | 'commented';
      actorId: string;
      taskId: string;
      at: Date;
    },
  ): string {
    const id = this.id(fixture);
    this.rows.activity.push({ id, ...v });
    return id;
  }

  /** Inserts everything collected, parents first. */
  async write(db: Database): Promise<void> {
    const r = this.rows;
    await db.transaction(async (tx) => {
      const put = async <T extends Parameters<typeof tx.insert>[0]>(
        table: T,
        values: T['$inferInsert'][],
      ) => {
        for (let i = 0; i < values.length; i += 1000) {
          await tx
            .insert(table)
            .values(values.slice(i, i + 1000))
            .onConflictDoNothing();
        }
      };
      await put(s.users, r.users);
      await put(s.workspaces, r.workspaces);
      await put(s.memberships, r.memberships);
      await put(s.invites, r.invites);
      await put(s.projects, r.projects);
      await put(s.labels, r.labels);
      await put(s.tasks, r.tasks);
      await put(s.taskLabels, r.taskLabels);
      await put(s.comments, r.comments);
      await put(s.activityEvents, r.activity);
    });
  }
}
