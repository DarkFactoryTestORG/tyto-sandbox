import { createHash } from 'node:crypto';

/**
 * A stable UUID (version 5 layout) for a seed fixture name such as `user.owner`. Seeds, tests and
 * evidence all derive the same id from the name, so `{seed:user.owner}` never needs a lookup.
 */
export function fixtureId(name: string): string {
  const hash = createHash('sha1').update(`plotline:${name}`).digest();
  hash[6] = (hash[6]! & 0x0f) | 0x50;
  hash[8] = (hash[8]! & 0x3f) | 0x80;
  const hex = hash.subarray(0, 16).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
