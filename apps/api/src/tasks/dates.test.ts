import { describe, expect, it } from 'vitest';
import { formatDueDate, InvalidDueDateError, parseDueDate, zoneOffsetMinutes } from './dates';

describe('zoneOffsetMinutes', () => {
  it('knows standard and summer time', () => {
    expect(zoneOffsetMinutes(new Date('2026-01-15T12:00:00Z'), 'America/New_York')).toBe(-300);
    expect(zoneOffsetMinutes(new Date('2026-07-15T12:00:00Z'), 'America/New_York')).toBe(-240);
    expect(zoneOffsetMinutes(new Date('2026-07-15T12:00:00Z'), 'Asia/Kolkata')).toBe(330);
    expect(zoneOffsetMinutes(new Date('2026-07-15T12:00:00Z'), 'UTC')).toBe(0);
  });
});

describe('parseDueDate', () => {
  it('stores a UTC user’s date at UTC midnight', () => {
    expect(parseDueDate('2026-11-03', 'UTC').toISOString()).toBe('2026-11-03T00:00:00.000Z');
  });

  it('round-trips for a user east of UTC', () => {
    expect(formatDueDate(parseDueDate('2026-11-03', 'Asia/Tokyo'))).toBe('2026-11-03');
  });

  it('rejects anything that is not a calendar date', () => {
    expect(() => parseDueDate('2026-13-01', 'UTC')).toThrow(InvalidDueDateError);
    expect(() => parseDueDate('tomorrow', 'UTC')).toThrow(InvalidDueDateError);
  });
});

describe('formatDueDate', () => {
  it('returns null for no due date', () => {
    expect(formatDueDate(null)).toBeNull();
  });
});
