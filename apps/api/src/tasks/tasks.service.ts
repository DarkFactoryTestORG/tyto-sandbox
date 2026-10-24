import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { type Database, schema } from '@plotline/db';
import type {
  ActivityKind,
  Comment,
  CreateTaskInput,
  Label,
  Task,
  TaskListPage,
  TaskListQuery,
  UpdateTaskInput,
  ValidationErrorBody,
} from '@plotline/shared';
import { searchKey } from '@plotline/textkit';
import { and, asc, count, desc, eq, ilike, inArray, sql, type SQL } from 'drizzle-orm';
import type { AuthUser } from '../auth/auth-user';
import { toUserSummary } from '../common/views';
import { InjectDb } from '../db.module';
import { formatDueDate, parseDueDate } from './dates';

const { tasks, projects, memberships, users, labels, taskLabels, comments, activityEvents } = schema;

type TaskRow = typeof tasks.$inferSelect;
type UserRow = typeof users.$inferSelect;

const invalid = (field: string, message: string) =>
  new UnprocessableEntityException({
    statusCode: 422,
    message: `Invalid ${field}`,
    errors: [{ field, message }],
  } satisfies ValidationErrorBody);

@Injectable()
export class TasksService {
  constructor(@InjectDb() private readonly db: Database) {}

  async list(user: AuthUser, projectId: string, query: TaskListQuery): Promise<TaskListPage> {
    const project = await this.db.query.projects.findFirst({ where: eq(projects.id, projectId) });
    if (!project) throw new NotFoundException('Project not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, project.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Project not found');

    const filters: SQL[] = [eq(tasks.projectId, projectId)];
    if (query.status) filters.push(eq(tasks.status, query.status));
    if (query.q) filters.push(ilike(tasks.searchKey, `%${searchKey(query.q)}%`));
    const where = and(...filters);
    const [{ total } = { total: 0 }] = await this.db.select({ total: count() }).from(tasks).where(where);
    const rows = await this.db
      .select({ task: tasks, assignee: users })
      .from(tasks)
      .leftJoin(users, eq(users.id, tasks.assigneeId))
      .where(where)
      .orderBy(desc(tasks.createdAt), desc(tasks.id))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);
    const out: Task[] = [];
    for (const row of rows) out.push(this.view(row.task, row.assignee, await this.labelsOf(row.task.id)));
    return { tasks: out, page: query.page, pageSize: query.pageSize, total };
  }

  async create(user: AuthUser, projectId: string, input: Required<CreateTaskInput>): Promise<Task> {
    const project = await this.db.query.projects.findFirst({ where: eq(projects.id, projectId) });
    if (!project) throw new NotFoundException('Project not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, project.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Project not found');
    if (membership.role === 'viewer') throw new ForbiddenException('Viewers cannot create tasks');

    if (input.assigneeId) await this.requireMember(project.workspaceId, input.assigneeId);
    await this.requireLabels(project.workspaceId, input.labelIds);
    const id = await this.db.transaction(async (tx) => {
      const [row] = await tx
        .insert(tasks)
        .values({
          projectId,
          title: input.title,
          description: input.description,
          searchKey: searchKey(input.title),
          assigneeId: input.assigneeId,
          dueDate: input.dueDate ? parseDueDate(input.dueDate, user.timezone) : null,
          createdById: user.id,
        })
        .returning();
      if (input.labelIds.length)
        await tx.insert(taskLabels).values(input.labelIds.map((labelId) => ({ taskId: row!.id, labelId })));
      await this.record(tx, project.workspaceId, 'created', user.id, row!.id);
      if (input.assigneeId) await this.record(tx, project.workspaceId, 'assigned', user.id, row!.id);
      return row!.id;
    });
    return this.load(id);
  }

  async get(user: AuthUser, taskId: string): Promise<Task> {
    const found = await this.findWithWorkspace(taskId);
    if (!found) throw new NotFoundException('Task not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, found.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Task not found');

    return this.load(taskId);
  }

  async update(user: AuthUser, taskId: string, input: UpdateTaskInput): Promise<Task> {
    const found = await this.findWithWorkspace(taskId);
    if (!found) throw new NotFoundException('Task not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, found.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Task not found');
    if (membership.role === 'viewer') throw new ForbiddenException('Viewers cannot edit tasks');

    if (input.assigneeId) await this.requireMember(found.workspaceId, input.assigneeId);
    if (input.labelIds) await this.requireLabels(found.workspaceId, input.labelIds);
    const set: Partial<typeof tasks.$inferInsert> = { updatedAt: new Date() };
    if (input.title !== undefined)
      Object.assign(set, { title: input.title, searchKey: searchKey(input.title) });
    if (input.description !== undefined) set.description = input.description;
    if (input.assigneeId !== undefined) set.assigneeId = input.assigneeId;
    if (input.dueDate !== undefined)
      set.dueDate = input.dueDate === null ? null : parseDueDate(input.dueDate, user.timezone);
    await this.db.transaction(async (tx) => {
      await tx.update(tasks).set(set).where(eq(tasks.id, taskId));
      if (input.labelIds) {
        await tx.delete(taskLabels).where(eq(taskLabels.taskId, taskId));
        if (input.labelIds.length)
          await tx.insert(taskLabels).values(input.labelIds.map((labelId) => ({ taskId, labelId })));
      }
      if (input.assigneeId && input.assigneeId !== found.task.assigneeId) {
        await this.record(tx, found.workspaceId, 'assigned', user.id, taskId);
      }
    });
    return this.load(taskId);
  }

  async complete(user: AuthUser, taskId: string): Promise<Task> {
    const found = await this.findWithWorkspace(taskId);
    if (!found) throw new NotFoundException('Task not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, found.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Task not found');
    if (membership.role === 'viewer') throw new ForbiddenException('Viewers cannot complete tasks');

    if (found.task.status === 'open') {
      await this.db.transaction(async (tx) => {
        const now = new Date();
        await tx
          .update(tasks)
          .set({ status: 'done', completedAt: now, updatedAt: now })
          .where(eq(tasks.id, taskId));
        await this.record(tx, found.workspaceId, 'completed', user.id, taskId);
      });
    }
    return this.load(taskId);
  }

  async reopen(user: AuthUser, taskId: string): Promise<Task> {
    const found = await this.findWithWorkspace(taskId);
    if (!found) throw new NotFoundException('Task not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, found.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Task not found');
    if (membership.role !== 'owner' && membership.role !== 'admin' && membership.role !== 'member') {
      throw new ForbiddenException('Viewers cannot reopen tasks');
    }

    await this.db
      .update(tasks)
      .set({ status: 'open', completedAt: null, updatedAt: new Date() })
      .where(eq(tasks.id, taskId));
    return this.load(taskId);
  }

  async remove(user: AuthUser, taskId: string): Promise<void> {
    const found = await this.findWithWorkspace(taskId);
    if (!found) throw new NotFoundException('Task not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, found.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Task not found');
    const isAdmin = membership.role === 'owner' || membership.role === 'admin';
    if (!isAdmin && found.task.createdById !== user.id) {
      throw new ForbiddenException('Only admins and the task’s creator can delete it');
    }

    await this.db.delete(tasks).where(eq(tasks.id, taskId));
  }

  async comments(user: AuthUser, taskId: string): Promise<Comment[]> {
    const found = await this.findWithWorkspace(taskId);
    if (!found) throw new NotFoundException('Task not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, found.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Task not found');

    const rows = await this.db
      .select({ c: comments, author: users })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.authorId))
      .where(eq(comments.taskId, taskId))
      .orderBy(asc(comments.createdAt), asc(comments.id));
    return rows.map(({ c, author }) => commentView(c, author));
  }

  async addComment(user: AuthUser, taskId: string, body: string): Promise<Comment> {
    const found = await this.findWithWorkspace(taskId);
    if (!found) throw new NotFoundException('Task not found');
    const membership = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, found.workspaceId), eq(memberships.userId, user.id)),
    });
    if (!membership) throw new NotFoundException('Task not found');
    if (membership.role === 'viewer') throw new ForbiddenException('Viewers cannot comment');

    const row = await this.db.transaction(async (tx) => {
      const [c] = await tx.insert(comments).values({ taskId, authorId: user.id, body }).returning();
      await this.record(tx, found.workspaceId, 'commented', user.id, taskId);
      return c!;
    });
    const author = await this.db.query.users.findFirst({ where: eq(users.id, user.id) });
    return commentView(row, author!);
  }

  /** Open tasks assigned to `user` in workspaces they belong to, soonest due first. */
  async assignedTo(user: AuthUser, workspaceId?: string): Promise<Task[]> {
    const filters: SQL[] = [eq(tasks.assigneeId, user.id), eq(tasks.status, 'open')];
    if (workspaceId) filters.push(eq(projects.workspaceId, workspaceId));
    const rows = await this.db
      .selectDistinct({ task: tasks, assignee: users })
      .from(tasks)
      .innerJoin(projects, eq(projects.id, tasks.projectId))
      .innerJoin(
        memberships,
        and(eq(memberships.workspaceId, projects.workspaceId), eq(memberships.userId, user.id)),
      )
      .leftJoin(users, eq(users.id, tasks.assigneeId))
      .where(and(...filters))
      .orderBy(sql`${tasks.dueDate} ASC NULLS LAST`, desc(tasks.createdAt), desc(tasks.id));
    const out: Task[] = [];
    for (const row of rows) out.push(this.view(row.task, row.assignee, await this.labelsOf(row.task.id)));
    return out;
  }

  private async findWithWorkspace(taskId: string) {
    const [row] = await this.db
      .select({ task: tasks, workspaceId: projects.workspaceId })
      .from(tasks)
      .innerJoin(projects, eq(projects.id, tasks.projectId))
      .where(eq(tasks.id, taskId))
      .limit(1);
    return row;
  }

  private async load(taskId: string): Promise<Task> {
    const [row] = await this.db
      .select({ task: tasks, assignee: users })
      .from(tasks)
      .leftJoin(users, eq(users.id, tasks.assigneeId))
      .where(eq(tasks.id, taskId));
    if (!row) throw new NotFoundException('Task not found');
    return this.view(row.task, row.assignee, await this.labelsOf(taskId));
  }

  private async labelsOf(taskId: string): Promise<Label[]> {
    const rows = await this.db
      .select({ id: labels.id, name: labels.name, color: labels.color })
      .from(taskLabels)
      .innerJoin(labels, eq(labels.id, taskLabels.labelId))
      .where(eq(taskLabels.taskId, taskId))
      .orderBy(asc(labels.name));
    return rows;
  }

  private async requireMember(workspaceId: string, userId: string): Promise<void> {
    const m = await this.db.query.memberships.findFirst({
      where: and(eq(memberships.workspaceId, workspaceId), eq(memberships.userId, userId)),
    });
    if (!m) throw invalid('assigneeId', 'must be a member of the workspace');
  }

  private async requireLabels(workspaceId: string, labelIds: string[]): Promise<void> {
    if (!labelIds.length) return;
    const found = await this.db
      .select({ id: labels.id })
      .from(labels)
      .where(and(eq(labels.workspaceId, workspaceId), inArray(labels.id, labelIds)));
    if (found.length !== new Set(labelIds).size)
      throw invalid('labelIds', 'must be labels of this workspace');
  }

  private async record(
    tx: Pick<Database, 'insert'>,
    workspaceId: string,
    kind: ActivityKind,
    actorId: string,
    taskId: string,
  ): Promise<void> {
    await tx.insert(activityEvents).values({ workspaceId, kind, actorId, taskId });
  }

  private view(t: TaskRow, assignee: UserRow | null, taskLabelsList: Label[]): Task {
    return {
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      description: t.description,
      status: t.status,
      assignee: assignee ? toUserSummary(assignee) : null,
      dueDate: formatDueDate(t.dueDate),
      labels: taskLabelsList,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      completedAt: t.completedAt?.toISOString() ?? null,
    };
  }
}

function commentView(c: typeof comments.$inferSelect, author: UserRow): Comment {
  return {
    id: c.id,
    taskId: c.taskId,
    author: toUserSummary(author),
    body: c.body,
    createdAt: c.createdAt.toISOString(),
  };
}
