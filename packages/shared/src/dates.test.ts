import { describe, expect, it } from 'vitest';
import { formatCalendarDate, isCalendarDate, isTimeZone } from './dates';

describe('formatCalendarDate', () => {
  it('formats a calendar date for display', () => {
    expect(formatCalendarDate('2026-11-03')).toBe('3 Nov 2026');
  });

  it('leaves anything else alone', () => {
    expect(formatCalendarDate('soon')).toBe('soon');
  });
});

describe('isCalendarDate', () => {
  it('accepts real dates', () => {
    expect(isCalendarDate('2028-02-29')).toBe(true);
  });

  it('rejects impossible dates and other shapes', () => {
    expect(isCalendarDate('2026-02-30')).toBe(false);
    expect(isCalendarDate('2026-1-3')).toBe(false);
    expect(isCalendarDate('2026-11-03T00:00:00Z')).toBe(false);
  });
});

describe('isTimeZone', () => {
  it('knows IANA zones', () => {
    expect(isTimeZone('America/New_York')).toBe(true);
    expect(isTimeZone('Mars/Olympus_Mons')).toBe(false);
  });
});
