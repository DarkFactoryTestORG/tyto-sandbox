import { describe, expect, it } from 'vitest';
import { decryptSecret, encryptSecret } from './crypto';

describe('secrets', () => {
  it('round-trips', () => {
    const sealed = encryptSecret('xoxb-123-abc', 'k');
    expect(sealed).not.toContain('xoxb');
    expect(decryptSecret(sealed, 'k')).toBe('xoxb-123-abc');
  });

  it('fails with the wrong key', () => {
    expect(() => decryptSecret(encryptSecret('xoxb-1', 'k'), 'other')).toThrow();
  });
});
