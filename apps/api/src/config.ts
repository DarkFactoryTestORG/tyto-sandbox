export interface AppConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  sessionSecret: string;
  /** Key material for secrets stored in the database (Slack bot tokens). */
  secretKey: string;
  /** The dev auth bypass (PLOTLINE_DEV_AUTH=1). Refused when NODE_ENV=production. */
  devAuth: boolean;
  /** Run migrations before listening (PLOTLINE_MIGRATE_ON_START=1). */
  migrateOnStart: boolean;
  /** Enabled feature flags (PLOTLINE_FLAGS, comma-separated). */
  flags: string[];
}

export const APP_CONFIG = Symbol('APP_CONFIG');

const DEV_SESSION_SECRET = 'plotline-dev-session-secret';
const DEV_SECRET_KEY = 'plotline-dev-secret-key';

/** Reads the API's configuration from the environment. Throws on an unsafe combination. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const nodeEnv = env.NODE_ENV ?? 'development';
  const production = nodeEnv === 'production';
  const devAuth = env.PLOTLINE_DEV_AUTH === '1';
  if (devAuth && production) {
    throw new Error(
      'PLOTLINE_DEV_AUTH=1 is refused when NODE_ENV=production: the dev auth bypass lets anyone log in as anyone',
    );
  }
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  if (production && !env.SESSION_SECRET)
    throw new Error('SESSION_SECRET is required when NODE_ENV=production');
  if (production && !env.PLOTLINE_SECRET_KEY)
    throw new Error('PLOTLINE_SECRET_KEY is required when NODE_ENV=production');
  const port = Number(env.PORT ?? 4000);
  if (!Number.isInteger(port) || port <= 0) throw new Error(`PORT must be a port number, got "${env.PORT}"`);
  return {
    nodeEnv,
    port,
    databaseUrl: env.DATABASE_URL,
    sessionSecret: env.SESSION_SECRET ?? DEV_SESSION_SECRET,
    secretKey: env.PLOTLINE_SECRET_KEY ?? DEV_SECRET_KEY,
    devAuth,
    migrateOnStart: env.PLOTLINE_MIGRATE_ON_START === '1',
    flags: (env.PLOTLINE_FLAGS ?? '')
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean),
  };
}
