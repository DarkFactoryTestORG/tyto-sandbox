import type { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { as, createTestApp, id, MEMBER, OUTSIDER, OWNER, resetAndSeed } from './helpers';

let app: INestApplication;
const acme = id('workspace.acme');

beforeAll(async () => {
  await resetAndSeed();
  app = await createTestApp();
});
afterAll(async () => {
  await app.close();
});

describe('workspaces', () => {
  it('lists mine, with my role', async () => {
    const res = await as(app, MEMBER).get('/workspaces');
    expect(res.body).toEqual([{ id: acme, slug: 'acme', name: 'Acme', role: 'member' }]);
  });

  it('finds one by slug, and hides others', async () => {
    expect((await as(app, OWNER).get('/workspaces/by-slug/acme')).body.role).toBe('owner');
    expect((await as(app, OWNER).get('/workspaces/by-slug/other')).status).toBe(404);
    expect((await as(app, OUTSIDER).get(`/workspaces/${acme}`)).status).toBe(404);
  });

  it('lists members and labels for members', async () => {
    const members = await as(app, MEMBER).get(`/workspaces/${acme}/members`);
    expect(members.body.map((m: { user: { email: string } }) => m.user.email).sort()).toEqual([
      MEMBER,
      OWNER,
    ]);
    const labels = await as(app, MEMBER).get(`/workspaces/${acme}/labels`);
    expect(labels.body.map((l: { name: string }) => l.name)).toEqual(['bug', 'chore']);
  });
});

describe('roles', () => {
  it('lets an owner change a member’s role, and not a member', async () => {
    const membershipId = id('membership.acme-member');
    expect(
      (await as(app, MEMBER).patch(`/workspaces/${acme}/members/${membershipId}`).send({ role: 'admin' }))
        .status,
    ).toBe(403);
    const res = await as(app, OWNER)
      .patch(`/workspaces/${acme}/members/${membershipId}`)
      .send({ role: 'viewer' });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('viewer');
  });

  it('stops a viewer from editing tasks and creating projects', async () => {
    const taskId = id('task.alpha-plan');
    expect((await as(app, MEMBER).get(`/tasks/${taskId}`)).status).toBe(200);
    expect((await as(app, MEMBER).patch(`/tasks/${taskId}`).send({ title: 'x' })).status).toBe(403);
    expect((await as(app, MEMBER).post(`/workspaces/${acme}/projects`).send({ name: 'Nope' })).status).toBe(
      403,
    );
  });

  it('never changes the owner’s role', async () => {
    const res = await as(app, OWNER)
      .patch(`/workspaces/${acme}/members/${id('membership.acme-owner')}`)
      .send({ role: 'admin' });
    expect(res.status).toBe(400);
  });
});

describe('projects', () => {
  it('creates a project with a slug from its name', async () => {
    const res = await as(app, OWNER).post(`/workspaces/${acme}/projects`).send({ name: 'Q4 Launch — Café' });
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('q4-launch-cafe');
    const again = await as(app, OWNER).post(`/workspaces/${acme}/projects`).send({ name: 'Q4 launch: café' });
    expect(again.body.slug).toBe('q4-launch-cafe-2');
    const bySlug = await as(app, OWNER).get(`/workspaces/${acme}/projects/by-slug/q4-launch-cafe`);
    expect(bySlug.body.id).toBe(res.body.id);
  });
});

describe('invites', () => {
  it('lets an admin invite, and the invitee accept', async () => {
    const invite = await as(app, OWNER)
      .post(`/workspaces/${acme}/invites`)
      .send({ email: 'Other-Owner@plotline.test' });
    expect(invite.status).toBe(201);
    expect(invite.body).toMatchObject({
      email: 'other-owner@plotline.test',
      role: 'member',
      status: 'pending',
    });

    expect((await as(app, MEMBER).get(`/invites/${invite.body.id}`)).status).toBe(404);
    const accepted = await as(app, OUTSIDER).post(`/invites/${invite.body.id}/accept`);
    expect(accepted.status).toBe(200);
    expect(accepted.body).toMatchObject({ slug: 'acme', role: 'member' });

    const members = await as(app, OWNER).get(`/workspaces/${acme}/members`);
    expect(members.body.filter((m: { user: { email: string } }) => m.user.email === OUTSIDER)).toHaveLength(
      1,
    );
    expect((await as(app, OWNER).get(`/workspaces/${acme}/invites`)).body).toEqual([]);
  });

  it('refuses invites from non-admins and for existing members', async () => {
    expect(
      (await as(app, MEMBER).post(`/workspaces/${acme}/invites`).send({ email: 'x@plotline.test' })).status,
    ).toBe(403);
    expect((await as(app, OWNER).post(`/workspaces/${acme}/invites`).send({ email: MEMBER })).status).toBe(
      409,
    );
  });
});

describe('billing and Slack', () => {
  it('shows billing to admins only', async () => {
    const res = await as(app, OWNER).get(`/workspaces/${acme}/billing`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ plan: 'monthly', seatPriceCents: 800 });
    expect(res.body.seats).toBeGreaterThanOrEqual(2);
    expect((await as(app, MEMBER).get(`/workspaces/${acme}/billing`)).status).toBe(403);
  });

  it('connects Slack without ever returning the token', async () => {
    expect((await as(app, OWNER).get(`/workspaces/${acme}/slack`)).status).toBe(404);
    const res = await as(app, OWNER)
      .put(`/workspaces/${acme}/slack`)
      .send({ teamName: 'Acme HQ', botToken: 'xoxb-1-abc' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'connected', teamName: 'Acme HQ' });
    expect(JSON.stringify(res.body)).not.toContain('xoxb');
    const bad = await as(app, OWNER)
      .put(`/workspaces/${acme}/slack`)
      .send({ teamName: 'Acme', botToken: 'nope' });
    expect(bad.status).toBe(422);
  });
});

describe('profile', () => {
  it('updates the timezone, and rejects unknown zones', async () => {
    expect((await as(app, OWNER).patch('/me').send({ timezone: 'America/Chicago' })).body.timezone).toBe(
      'America/Chicago',
    );
    const bad = await as(app, OWNER).patch('/me').send({ timezone: 'Mars/Base' });
    expect(bad.status).toBe(422);
    expect(bad.body.errors[0].field).toBe('timezone');
  });
});
