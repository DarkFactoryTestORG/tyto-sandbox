// Seat proration. A workspace pays per seat per cycle (monthly, or yearly at 12× the monthly
// price). A seat added part-way through a cycle is charged for the days left, including the day it
// was added; a seat removed is credited for the days left, on the next invoice.

export type Plan = 'monthly' | 'annual';

/** A billing cycle: `start` inclusive, `end` exclusive, both YYYY-MM-DD. */
export interface Cycle {
  start: string;
  end: string;
}

const DAY = 86_400_000;

function parse(date: string): Date {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
}

function format(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** The anchor's day of month in (year, month), clamped to the month's length (31 → 28 in February). */
function anchoredDate(year: number, month: number, day: number): Date {
  const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(day, last)));
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / DAY);
}

/** The cycle that contains `on`, for cycles anchored at `anchor`. */
export function cycleContaining(anchor: string, plan: Plan, on: string): Cycle {
  const a = parse(anchor);
  const d = parse(on);
  const step = plan === 'annual' ? 12 : 1;
  let year = d.getUTCFullYear();
  let month = plan === 'annual' ? a.getUTCMonth() : d.getUTCMonth();
  let start = anchoredDate(year, month, a.getUTCDate());
  if (start > d) {
    month -= step;
    start = anchoredDate(year, month, a.getUTCDate());
  }
  year = start.getUTCFullYear();
  month = start.getUTCMonth();
  const end = anchoredDate(year, month + step, a.getUTCDate());
  return { start: format(start), end: format(end) };
}

export function cyclePriceCents(plan: Plan, seatPriceCents: number): number {
  return plan === 'annual' ? seatPriceCents * 12 : seatPriceCents;
}

/**
 * The charge (positive) or credit (negative), in cents, for changing the seat count by `delta`
 * on `on`.
 */
export function prorateSeatChange(input: {
  plan: Plan;
  anchor: string;
  seatPriceCents: number;
  on: string;
  delta: number;
}): number {
  const cycle = cycleContaining(input.anchor, input.plan, input.on);
  const total = daysBetween(cycle.start, cycle.end);
  const remaining = daysBetween(input.on, cycle.end);
  if (remaining <= 0 || input.delta === 0) return 0;
  const perSeat = Math.round((cyclePriceCents(input.plan, input.seatPriceCents) * remaining) / total);
  return perSeat * input.delta;
}
