import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { connect, fixtureId, resetDatabase, seedScenario, type SeedResult } from '@plotline/db';
import { DEV_AUTH_HEADER } from '@plotline/shared';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { type AppConfig, loadConfig } from '../src/config';
import { configureApp } from '../src/setup';

/** The API on the test database (DATABASE_URL), with the dev auth bypass on unless overridden. */
export async function createTestApp(overrides: Partial<AppConfig> = {}): Promise<INestApplication> {
  const config: AppConfig = {
    ...loadConfig({ ...process.env, NODE_ENV: 'test', PLOTLINE_DEV_AUTH: '1' }),
    ...overrides,
  };
  const app = await NestFactory.create(AppModule.register(config), { logger: false });
  configureApp(app, config);
  await app.init();
  return app;
}

/** A fresh schema with `scenario` seeded. Integration test files call it in beforeAll. */
export async function resetAndSeed(scenario = 'baseline'): Promise<SeedResult> {
  const handle = connect();
  try {
    await resetDatabase(handle.db);
    return await seedScenario(handle.db, scenario);
  } finally {
    await handle.close();
  }
}

/** Requests as the seeded user with `email`, through the dev auth bypass. */
export function as(app: INestApplication, email: string) {
  const server = app.getHttpServer();
  const withUser = (r: request.Test) => r.set(DEV_AUTH_HEADER, email);
  return {
    get: (url: string) => withUser(request(server).get(url)),
    post: (url: string) => withUser(request(server).post(url)),
    patch: (url: string) => withUser(request(server).patch(url)),
    put: (url: string) => withUser(request(server).put(url)),
    delete: (url: string) => withUser(request(server).delete(url)),
  };
}

export const OWNER = 'owner@plotline.test';
export const MEMBER = 'member@plotline.test';
export const OUTSIDER = 'other-owner@plotline.test';

export const id = fixtureId;
