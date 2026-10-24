import type { INestApplication } from '@nestjs/common';
import { DEV_AUTH_HEADER, SESSION_COOKIE, SEED_PASSWORD } from '../src/test-exports';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestApp, OWNER, resetAndSeed } from './helpers';

let app: INestApplication;
beforeAll(async () => {
  await resetAndSeed();
  app = await createTestApp();
});
afterAll(async () => {
  await app.close();
});

describe('login with a password', () => {
  it('starts a session that /auth/me sees, until logout', async () => {
    const agent = request.agent(app.getHttpServer());
    const login = await agent.post('/auth/login').send({ email: OWNER, password: SEED_PASSWORD });
    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ email: OWNER, name: 'Olivia Owner' });
    expect(login.body).not.toHaveProperty('passwordHash');
    expect(String(login.headers['set-cookie'])).toContain(`${SESSION_COOKIE}=`);

    expect((await agent.get('/auth/me')).body.email).toBe(OWNER);
    expect((await agent.post('/auth/logout')).status).toBe(204);
    expect((await agent.get('/auth/me')).status).toBe(401);
  });

  it('accepts the email in any case', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: OWNER.toUpperCase(), password: SEED_PASSWORD });
    expect(res.status).toBe(200);
  });

  it('refuses a wrong password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: OWNER, password: 'nope' });
    expect(res.status).toBe(401);
  });

  it('needs a session for protected routes', async () => {
    expect((await request(app.getHttpServer()).get('/workspaces')).status).toBe(401);
  });
});

describe('dev auth bypass, on', () => {
  it('logs in through the header', async () => {
    const res = await request(app.getHttpServer()).get('/auth/me').set(DEV_AUTH_HEADER, OWNER);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(OWNER);
  });

  it('logs in through the cookie', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', `${DEV_AUTH_HEADER}=${encodeURIComponent(OWNER)}`);
    expect(res.body.email).toBe(OWNER);
  });

  it('refuses an email no one has', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set(DEV_AUTH_HEADER, 'ghost@plotline.test');
    expect(res.status).toBe(401);
  });
});

describe('dev auth bypass, off', () => {
  let plain: INestApplication;
  beforeAll(async () => {
    plain = await createTestApp({ devAuth: false });
  });
  afterAll(async () => {
    await plain.close();
  });

  it('ignores the header and the cookie', async () => {
    const server = plain.getHttpServer();
    expect((await request(server).get('/auth/me').set(DEV_AUTH_HEADER, OWNER)).status).toBe(401);
    expect((await request(server).get('/auth/me').set('Cookie', `${DEV_AUTH_HEADER}=${OWNER}`)).status).toBe(
      401,
    );
  });
});
