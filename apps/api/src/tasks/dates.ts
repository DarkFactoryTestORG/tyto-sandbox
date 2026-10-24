// Due dates: turning what the client sends into what is stored, and back.
//
// The web app sends a due date as YYYY-MM-DD, picked in the user's own timezone (their profile's
// `timezone`). It is stored in tasks.due_date, a timestamptz, and returned as YYYY-MM-DD again.

import { isCalendarDate } from '@plotline/shared';

/** The wire format of a due date, in both directions. */
export const DUE_DATE_FORMAT = 'YYYY-MM-DD';

/** The UTC offset of `timeZone` at `at`, in minutes (New York in winter → −300). */
export function zoneOffsetMinutes(at: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((wall - at.getTime()) / 60_000);
}

export class InvalidDueDateError extends Error {
  constructor(readonly input: string) {
    super(`"${input}" is not a date in ${DUE_DATE_FORMAT} form`);
  }
}

/**
 * The timestamp to store for a due date the user picked. The date is taken at midnight and
 * expressed in the user's timezone, so it lines up with the day they chose.
 *
 * @param input the picked date, YYYY-MM-DD
 * @param timeZone the user's IANA timezone
 */
export function parseDueDate(input: string, timeZone: string): Date {
  if (!isCalendarDate(input)) throw new InvalidDueDateError(input);
  const midnight = new Date(`${input}T00:00:00.000Z`);
  const offset = zoneOffsetMinutes(midnight, timeZone);
  return new Date(midnight.getTime() + offset * 60_000);
}

/** The YYYY-MM-DD the API returns for a stored due date. */
export function formatDueDate(stored: Date | null): string | null {
  return stored ? stored.toISOString().slice(0, 10) : null;
}
