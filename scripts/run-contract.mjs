#!/usr/bin/env node
// Runs every repo-config command in the order the factory uses them, from the repo root, and stops
// at the first failure. scripts/factory-check.sh runs it inside the toolchain image on a clean
// copy of the repo; it also runs as is against a local checkout and DATABASE_URL.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { repoCommands } from './repo-commands.mjs';

const commands = repoCommands();
const steps = [
  ['install'],
  ['build'],
  ['migrate'],
  ['seed', { scenario: 'baseline' }],
  ['test'],
  ['lint'],
  ['typecheck'],
  ['format'],
  ['dbReset'],
  ['seed', { scenario: 'review' }],
];

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(2);
}

const started = Date.now();
for (const [name, params = {}] of steps) {
  const template = commands[name];
  if (!template) {
    console.error(`\n✗ .tyto/config.yaml has no commands.${name}`);
    process.exit(1);
  }
  const command = template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
  if (name === 'test') rmSync('reports/junit', { recursive: true, force: true });
  console.log(`\n▶ ${name}: ${command}`);
  const t0 = Date.now();
  const result = spawnSync('sh', ['-c', command], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`\n✗ ${name} failed (exit ${result.status ?? result.signal})`);
    process.exit(1);
  }
  if (name === 'test') {
    const reports = existsSync('reports/junit')
      ? readdirSync('reports/junit').filter((f) => f.endsWith('.xml'))
      : [];
    if (!reports.length) {
      console.error('\n✗ test wrote no JUnit report under reports/junit/ (repo config reports.junit)');
      process.exit(1);
    }
    console.log(`  JUnit reports: ${reports.sort().join(', ')}`);
  }
  console.log(`✓ ${name} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}
console.log(`\n✓ every repo-config command passed in ${((Date.now() - started) / 1000).toFixed(0)}s`);
