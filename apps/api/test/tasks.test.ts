import type { INestApplication } from '@nestjs/common';
import { connect, schema } from '@plotline/db';
import { and, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { as, createTestApp, id, MEMBER, OUTSIDER, OWNER, resetAndSeed } from './helpers';

let app: INestApplication;
const alpha = id('project.alpha');
const acme = id('workspace.acme');

beforeAll(async () => {
  await resetAndSeed();
  app = await createTestApp();
});
afterAll(async () => {
  await app.close();
});

async function activityKinds(taskId: string): Promise<string[]> {
  const handle = connect();
  try {
    const rows = await handle.db
      .select({ kind: schema.activityEvents.kind })
      .from(schema.activityEvents)
      .where(and(eq(schema.activityEvents.workspaceId, acme), eq(schema.activityEvents.taskId, taskId)));
    return rows.map((r) => r.kind).sort();
  } finally {
    await handle.close();
  }
}

describe('GET /projects/:id/tasks', () => {
  it('lists the project’s tasks, newest first, with assignees and labels', async () => {
    const res = await as(app, MEMBER).get(`/projects/${alpha}/tasks`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);
    expect(res.body.tasks.map((t: { title: string }) => t.title)).toEqual([
      'Update dependencies',
      'Fix the login redirect loop',
      'Write the launch plan',
      'Kickoff meeting notes',
    ]);
    const bug = res.body.tasks[1];
    expect(bug.assignee).toMatchObject({ name: 'Max Member' });
    expect(bug.labels).toEqual([expect.objectContaining({ name: 'bug' })]);
  });

  it('filters by status and searches titles ignoring accents and case', async () => {
    expect((await as(app, OWNER).get(`/projects/${alpha}/tasks?status=done`)).body.total).toBe(1);
    const found = await as(app, OWNER).get(`/projects/${alpha}/tasks?q=${encodeURIComponent('LAUNCH plán')}`);
    expect(found.body.tasks.map((t: { title: string }) => t.title)).toEqual(['Write the launch plan']);
  });

  it('pages', async () => {
    const res = await as(app, OWNER).get(`/projects/${alpha}/tasks?page=2&pageSize=3`);
    expect(res.body).toMatchObject({ page: 2, pageSize: 3, total: 4 });
    expect(res.body.tasks).toHaveLength(1);
  });

  it('is 404 for someone outside the workspace', async () => {
    expect((await as(app, OUTSIDER).get(`/projects/${alpha}/tasks`)).status).toBe(404);
  });

  it('rejects a bad page size with the field named', async () => {
    const res = await as(app, OWNER).get(`/projects/${alpha}/tasks?pageSize=0`);
    expect(res.status).toBe(422);
    expect(res.body.errors).toEqual([expect.objectContaining({ field: 'pageSize' })]);
  });
});

describe('creating and editing tasks', () => {
  let taskId: string;

  it('creates a task and records the activity', async () => {
    const res = await as(app, MEMBER)
      .post(`/projects/${alpha}/tasks`)
      .send({ title: 'Book the venue', assigneeId: id('user.owner'), labelIds: [id('label.chore')] });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Book the venue', status: 'open', dueDate: null });
    expect(res.body.labels).toEqual([expect.objectContaining({ name: 'chore' })]);
    taskId = res.body.id;
    expect(await activityKinds(taskId)).toEqual(['assigned', 'created']);
  });

  it('rejects an empty title with the field named', async () => {
    const res = await as(app, MEMBER).post(`/projects/${alpha}/tasks`).send({ title: '  ' });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('title');
  });

  it('rejects an assignee from another workspace', async () => {
    const res = await as(app, MEMBER)
      .patch(`/tasks/${taskId}`)
      .send({ assigneeId: id('user.other-owner') });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].field).toBe('assigneeId');
  });

  it('edits the title, description and due date', async () => {
    const res = await as(app, OWNER)
      .patch(`/tasks/${taskId}`)
      .send({ title: 'Book the big venue', description: 'Capacity 200', dueDate: '2026-11-20' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: 'Book the big venue', description: 'Capacity 200' });
    expect(res.body.dueDate).toMatch(/^2026-11-\d\d$/);
    expect((await as(app, OWNER).get(`/tasks/${taskId}`)).body.title).toBe('Book the big venue');
  });

  it('completes and reopens', async () => {
    const done = await as(app, MEMBER).post(`/tasks/${taskId}/complete`);
    expect(done.body.status).toBe('done');
    expect(done.body.completedAt).not.toBeNull();
    expect(await activityKinds(taskId)).toContain('completed');
    const open = await as(app, MEMBER).post(`/tasks/${taskId}/reopen`);
    expect(open.body).toMatchObject({ status: 'open', completedAt: null });
  });

  it('adds and lists comments', async () => {
    const add = await as(app, MEMBER)
      .post(`/tasks/${taskId}/comments`)
      .send({ body: 'Called them, waiting to hear back.' });
    expect(add.status).toBe(201);
    expect(add.body.author.name).toBe('Max Member');
    const list = await as(app, OWNER).get(`/tasks/${taskId}/comments`);
    expect(list.body.map((c: { body: string }) => c.body)).toEqual(['Called them, waiting to hear back.']);
  });

  it('is 404 for someone outside the workspace', async () => {
    expect((await as(app, OUTSIDER).get(`/tasks/${taskId}`)).status).toBe(404);
    expect((await as(app, OUTSIDER).patch(`/tasks/${taskId}`).send({ title: 'x' })).status).toBe(404);
  });

  it('lets only admins and the creator delete', async () => {
    const created = await as(app, OWNER).post(`/projects/${alpha}/tasks`).send({ title: 'Owner’s task' });
    expect((await as(app, MEMBER).delete(`/tasks/${created.body.id}`)).status).toBe(403);
    expect((await as(app, OWNER).delete(`/tasks/${created.body.id}`)).status).toBe(204);
    expect((await as(app, OWNER).get(`/tasks/${created.body.id}`)).status).toBe(404);
  });
});

describe('My tasks', () => {
  it('lists my open tasks', async () => {
    const res = await as(app, MEMBER).get(`/me/tasks?workspaceId=${acme}`);
    expect(res.status).toBe(200);
    expect(res.body.map((t: { title: string }) => t.title)).toContain('Fix the login redirect loop');
    expect(res.body.every((t: { status: string }) => t.status === 'open')).toBe(true);
  });
});
