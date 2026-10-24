import { parseArgs } from 'node:util';

export function cliArgs() {
  return parseArgs({
    options: {
      scenario: { type: 'string', short: 's' },
      now: { type: 'string' },
      fixtures: { type: 'string' },
    },
    allowPositionals: true,
  });
}

export async function main(run: () => Promise<void>): Promise<void> {
  try {
    await run();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
