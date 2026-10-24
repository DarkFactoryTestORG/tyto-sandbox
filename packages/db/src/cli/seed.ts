// pnpm --filter @plotline/db seed --scenario <name> [--now <ISO time>] [--fixtures <file>]
// Seeds a migrated database. --fixtures writes the fixture name → id map as JSON.
import { writeFileSync } from 'node:fs';
import { scenarios, seedScenario } from '../../seeds';
import { connect } from '../client';
import { cliArgs, main } from './args';

void main(async () => {
  const { values, positionals } = cliArgs();
  const name = values.scenario ?? positionals[0];
  if (!name)
    throw new Error(
      `usage: seed --scenario <${Object.keys(scenarios).join('|')}> [--now <time>] [--fixtures <file>]`,
    );
  const handle = connect();
  try {
    const started = Date.now();
    const result = await seedScenario(handle.db, name, values.now ? { now: values.now } : {});
    if (values.fixtures) writeFileSync(values.fixtures, `${JSON.stringify(result.fixtures, null, 2)}\n`);
    console.log(
      `seeded ${result.scenario} (now=${result.now}, ${Object.keys(result.fixtures).length} fixtures) in ${Date.now() - started} ms`,
    );
  } finally {
    await handle.close();
  }
});
