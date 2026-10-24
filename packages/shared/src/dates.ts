const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** YYYY-MM-DD. */
export const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** "2026-11-03" → "3 Nov 2026". Returns the input unchanged when it is not a calendar date. */
export function formatCalendarDate(date: string): string {
  if (!CALENDAR_DATE.test(date)) return date;
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const month = MONTHS[m - 1];
  return month ? `${d} ${month} ${y}` : date;
}

/** True for a real calendar date in YYYY-MM-DD form (rejects 2026-02-30). */
export function isCalendarDate(date: string): boolean {
  if (!CALENDAR_DATE.test(date)) return false;
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const parsed = new Date(Date.UTC(y, m - 1, d));
  return parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d;
}

/** True when `timeZone` is an IANA zone this runtime knows. */
export function isTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}
