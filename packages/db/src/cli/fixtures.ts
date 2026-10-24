// pnpm --filter @plotline/db fixtures --scenario <name>: prints the fixture name → id map as JSON.
// Ids are derived from the names, so no database is needed.
import { scenarioFixtures } from '../../seeds';
import { cliArgs, main } from './args';

void main(async () => {
  const { values, positionals } = cliArgs();
  const name = values.scenario ?? positionals[0] ?? 'baseline';
  console.log(JSON.stringify(scenarioFixtures(name), null, 2));
});
