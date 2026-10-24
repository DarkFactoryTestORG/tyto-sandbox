import type { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { as, createTestApp, id, OUTSIDER, OWNER, resetAndSeed } from './helpers';

let app: INestApplication;
const acme = id('workspace.acme');

beforeAll(async () => {
  await resetAndSeed('review');
  app = await createTestApp();
});
afterAll(async () => {
  await app.close();
});

type Page = { events: { id: string; at: string; actorId: string }[]; nextCursor: string | null };

describe('GET /workspaces/:id/activity', () => {
  it('returns every event once, newest first, across pages', async () => {
    const seen: Page['events'] = [];
    let cursor: string | null = null;
    let pages = 0;
    do {
      const res = await as(app, OWNER).get(
        `/workspaces/${acme}/activity${cursor ? `?cursor=${cursor}` : ''}`,
      );
      expect(res.status).toBe(200);
      const page = res.body as Page;
      seen.push(...page.events);
      cursor = page.nextCursor;
      pages++;
    } while (cursor && pages < 10);
    expect(new Set(seen.map((e) => e.id)).size).toBe(seen.length);
    const times = seen.map((e) => e.at);
    expect([...times].sort().reverse()).toEqual(times);
    expect(seen.length).toBeGreaterThan(5);
  });

  it('filters by actor', async () => {
    const ny = id('user.ny');
    const res = await as(app, OWNER).get(`/workspaces/${acme}/activity?actorId=${ny}`);
    expect(res.body.events.length).toBeGreaterThan(0);
    expect(res.body.events.every((e: { actorId: string }) => e.actorId === ny)).toBe(true);
  });

  it('is 404 for a non-member and 400 for a forged cursor', async () => {
    expect((await as(app, OUTSIDER).get(`/workspaces/${acme}/activity`)).status).toBe(404);
    expect((await as(app, OWNER).get(`/workspaces/${acme}/activity?cursor=forged`)).status).toBe(400);
  });
});
