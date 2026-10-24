import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { runMigrations, type DbHandle } from '@plotline/db';
import { DEV_AUTH_HEADER } from '@plotline/shared';
import { AppModule } from './app.module';
import { loadConfig } from './config';
import { DB_HANDLE } from './db.module';
import { configureApp } from './setup';

async function bootstrap(): Promise<void> {
  const config = loadConfig();
  const logger = new Logger('Plotline');
  const app = await NestFactory.create(AppModule.register(config));
  configureApp(app, config);
  if (config.migrateOnStart) {
    await runMigrations(app.get<DbHandle>(DB_HANDLE).db);
    logger.log('migrations applied');
  }
  if (config.devAuth) {
    logger.warn('*'.repeat(78));
    logger.warn(`DEV AUTH BYPASS IS ON (PLOTLINE_DEV_AUTH=1): any request with ${DEV_AUTH_HEADER}: <email>`);
    logger.warn('acts as that user. Never run this outside development, tests and previews.');
    logger.warn('*'.repeat(78));
  }
  await app.listen(config.port, '0.0.0.0');
  logger.log(`listening on :${config.port}`);
}

bootstrap().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
