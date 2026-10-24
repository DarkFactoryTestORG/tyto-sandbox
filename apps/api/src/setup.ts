import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { DbHandle } from '@plotline/db';
import { SESSION_COOKIE } from '@plotline/shared';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import passport from 'passport';
import type { AppConfig } from './config';
import { DB_HANDLE } from './db.module';

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/** Session cookies backed by Postgres, then Passport. Shared by main.ts and the tests. */
export function configureApp(app: INestApplication, config: AppConfig): void {
  const handle = app.get<DbHandle>(DB_HANDLE);
  const PgStore = connectPgSimple(session);
  (app as NestExpressApplication).set('trust proxy', 1);
  app.use(
    session({
      name: SESSION_COOKIE,
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new PgStore({ pool: handle.pool, tableName: 'session', createTableIfMissing: false }),
      cookie: { httpOnly: true, sameSite: 'lax', secure: 'auto', maxAge: THIRTY_DAYS },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableShutdownHooks();
}
