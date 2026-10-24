import { describe, expect, it } from 'vitest';
import { loadConfig } from './config';

const base = { DATABASE_URL: 'postgres://localhost/plotline' };

describe('loadConfig', () => {
  it('refuses the dev auth bypass in production', () => {
    expect(() =>
      loadConfig({
        ...base,
        NODE_ENV: 'production',
        PLOTLINE_DEV_AUTH: '1',
        SESSION_SECRET: 's',
        PLOTLINE_SECRET_KEY: 'k',
      }),
    ).toThrow(/PLOTLINE_DEV_AUTH=1 is refused/);
  });

  it('turns the bypass on only for exactly 1', () => {
    expect(loadConfig({ ...base, PLOTLINE_DEV_AUTH: '1' }).devAuth).toBe(true);
    expect(loadConfig({ ...base, PLOTLINE_DEV_AUTH: 'true' }).devAuth).toBe(false);
    expect(loadConfig(base).devAuth).toBe(false);
  });

  it('requires real secrets in production', () => {
    expect(() => loadConfig({ ...base, NODE_ENV: 'production' })).toThrow(/SESSION_SECRET/);
    expect(() => loadConfig({ ...base, NODE_ENV: 'production', SESSION_SECRET: 's' })).toThrow(
      /PLOTLINE_SECRET_KEY/,
    );
  });

  it('parses feature flags', () => {
    expect(loadConfig({ ...base, PLOTLINE_FLAGS: 'recurring-tasks, ,beta' }).flags).toEqual([
      'recurring-tasks',
      'beta',
    ]);
  });

  it('requires DATABASE_URL', () => {
    expect(() => loadConfig({})).toThrow(/DATABASE_URL/);
  });
});
