import { describe, expect, it } from 'vitest';
import { decodeCursor, encodeCursor } from './cursor';

describe('cursor', () => {
  it('round-trips a position', () => {
    const p = { at: '2026-10-01T09:00:00.000Z', id: '6d2c8f1e-0000-5000-8000-000000000000' };
    expect(decodeCursor(encodeCursor(p))).toEqual(p);
  });

  it('rejects anything else', () => {
    expect(decodeCursor('not-a-cursor')).toBeUndefined();
    expect(decodeCursor(Buffer.from('["x","y"]').toString('base64url'))).toBeUndefined();
  });
});
