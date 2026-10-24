import { describe, expect, it } from 'vitest';
import { hasRole, highestRole } from './roles';

describe('roles', () => {
  it('ranks owner over admin over member over viewer', () => {
    expect(hasRole('owner', 'admin')).toBe(true);
    expect(hasRole('admin', 'admin')).toBe(true);
    expect(hasRole('member', 'admin')).toBe(false);
    expect(hasRole('viewer', 'member')).toBe(false);
  });

  it('picks the higher role', () => {
    expect(highestRole('member', 'admin')).toBe('admin');
    expect(highestRole('owner', 'viewer')).toBe('owner');
  });
});
