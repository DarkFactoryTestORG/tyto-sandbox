import type { Database } from '../src/client';
import { baseline } from './baseline';
import { largeProject, largeProjectBulk } from './large-project';
import { Seeder } from './lib';
import { review } from './review';

export { SEED_PASSWORD } from './lib';

/** The fixed "now" seeds use unless told otherwise. */
export const DEFAULT_SEED_NOW = '2026-10-01T09:00:00Z';

interface Scenario {
  description: string;
  build(s: Seeder): void;
  bulk?(db: Database, s: Seeder): Promise<void>;
}

export const scenarios = {
  baseline: { description: 'The fixtures the issue catalogue names, plus a few tasks', build: baseline },
  'large-project': {
    description: 'baseline, plus project.large (50,000 tasks) and project.small (20)',
    build: largeProject,
    bulk: largeProjectBulk,
  },
  review: { description: 'baseline, plus the reviewer dataset (seeds/review/README.md)', build: review },
} satisfies Record<string, Scenario>;

export type ScenarioName = keyof typeof scenarios;

export interface SeedResult {
  scenario: ScenarioName;
  now: string;
  /** Fixture name → id. */
  fixtures: Record<string, string>;
}

function scenario(name: string): Scenario {
  const found = (scenarios as Record<string, Scenario>)[name];
  if (!found)
    throw new Error(`unknown scenario "${name}"; expected one of: ${Object.keys(scenarios).join(', ')}`);
  return found;
}

function resolveNow(now?: string): Date {
  const value = now ?? process.env.PLOTLINE_SEED_NOW ?? DEFAULT_SEED_NOW;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`invalid seed "now": ${value}`);
  return date;
}

/** Seeds a migrated database. Safe to re-run: existing rows are left alone. */
export async function seedScenario(
  db: Database,
  name: string,
  opts: { now?: string } = {},
): Promise<SeedResult> {
  const sc = scenario(name);
  const seeder = new Seeder(resolveNow(opts.now));
  sc.build(seeder);
  await seeder.write(db);
  await sc.bulk?.(db, seeder);
  return { scenario: name as ScenarioName, now: seeder.now.toISOString(), fixtures: seeder.fixtures };
}

/** The fixture map of a scenario, without touching a database. */
export function scenarioFixtures(name: string): Record<string, string> {
  const seeder = new Seeder(resolveNow());
  scenario(name).build(seeder);
  return seeder.fixtures;
}
