#!/usr/bin/env node
// changelog-format: every line a pull request adds to CHANGELOG.md's lists must end with the issue
// it closes, "(#n)". Usage: node scripts/check-changelog.mjs [<base ref>]  (default origin/dev)
import { execFileSync } from 'node:child_process';

const base = process.argv[2] ?? process.env.CHANGELOG_BASE ?? 'origin/dev';
let diff;
try {
  diff = execFileSync('git', ['diff', '--unified=0', `${base}...HEAD`, '--', 'CHANGELOG.md'], {
    encoding: 'utf8',
  });
} catch (error) {
  console.error(`changelog-format: cannot diff against ${base}: ${error.message}`);
  process.exit(2);
}

const added = diff
  .split('\n')
  .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
  .map((line) => line.slice(1))
  .filter((line) => /^\s*[-*]\s+/.test(line));

const bad = added.filter((line) => !/\(#\d+\)\s*$/.test(line));
if (bad.length) {
  console.error('changelog-format: these CHANGELOG.md entries must end with the issue reference "(#n)":');
  for (const line of bad) console.error(`  ${line.trim()}`);
  // A GitHub annotation, so the failure shows on the PR's Files tab.
  if (process.env.GITHUB_ACTIONS) {
    console.log(
      `::error file=CHANGELOG.md,title=changelog-format::${bad.length} entr${bad.length === 1 ? 'y does' : 'ies do'} not end with "(#n)"`,
    );
  }
  process.exit(1);
}
console.log(
  `changelog-format: ${added.length} new entr${added.length === 1 ? 'y' : 'ies'}, all end with (#n)`,
);
