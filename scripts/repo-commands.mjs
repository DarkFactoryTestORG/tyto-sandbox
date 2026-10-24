// Reads the `commands:` map from .tyto/config.yaml without a YAML library (the toolchain image has
// none before install). The block is flat `name: command` lines, optionally quoted, with comments.
import { readFileSync } from 'node:fs';

export function repoCommands(file = '.tyto/config.yaml') {
  const commands = {};
  let inside = false;
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    if (/^commands:\s*$/.test(raw)) {
      inside = true;
      continue;
    }
    if (!inside) continue;
    if (/^\S/.test(raw)) break;
    const m = /^\s+([\w-]+):\s*(.+?)\s*$/.exec(raw.replace(/\s+#.*$/, ''));
    if (!m) continue;
    commands[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return commands;
}
