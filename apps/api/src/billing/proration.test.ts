import { describe, expect, it } from 'vitest';
import { cycleContaining, prorateSeatChange } from './proration';

describe('cycleContaining', () => {
  it('finds the monthly cycle around a date', () => {
    expect(cycleContaining('2026-01-01', 'monthly', '2026-11-16')).toEqual({
      start: '2026-11-01',
      end: '2026-12-01',
    });
  });
});

describe('prorateSeatChange', () => {
  it('charges half a month for a seat added halfway through a 30-day cycle', () => {
    expect(
      prorateSeatChange({
        plan: 'monthly',
        anchor: '2026-01-01',
        seatPriceCents: 800,
        on: '2026-11-16',
        delta: 1,
      }),
    ).toBe(400);
  });

  it('charges the whole month for a seat added on the first day', () => {
    expect(
      prorateSeatChange({
        plan: 'monthly',
        anchor: '2026-01-01',
        seatPriceCents: 800,
        on: '2026-11-01',
        delta: 1,
      }),
    ).toBe(800);
  });
});
