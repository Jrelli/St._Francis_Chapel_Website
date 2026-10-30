/**
 * Date helpers pinned to the chapel's timezone.
 *
 * Why this exists: Cloudflare builds run in UTC and visitors may be anywhere, but
 * "today", "this week" and "10:00 AM" must always mean the chapel's local time (Eastern Time, East Tennessee).
 * JavaScript's Date is just an instant (ms since 1970, UTC); Intl.DateTimeFormat with
 * an explicit timeZone is how we read and print wall-clock times at the chapel.
 *
 * Shared by build-time code and the browser, so it must not use Node-only APIs.
 */

// Keep in sync with site.calendar.timeZone in src/config/site.ts (a test checks this).
export const TIME_ZONE = 'America/New_York';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface WallTime {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number; // 0 = Sunday
}

// Formatter construction is relatively expensive, so build each one once.
const partsFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  weekday: 'short',
  hourCycle: 'h23', // 0–23; plain hour12:false can yield "24" at midnight
});

/** What a clock on the wall at the chapel reads at this instant. */
export function wallTime(date: Date): WallTime {
  const p: Record<string, string> = {};
  for (const { type, value } of partsFormat.formatToParts(date)) p[type] = value;
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
    second: Number(p.second),
    weekday: WEEKDAYS.indexOf(p.weekday ?? ''),
  };
}

/** The chapel's offset from UTC (in ms) at a given instant; negative, e.g. -4h (EDT) or -5h (EST). */
function offsetAt(ms: number): number {
  const w = wallTime(new Date(ms));
  return Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second) - ms;
}

/**
 * The instant at which the chapel's wall clock reads the given date and time.
 * Out-of-range days roll over (day 32 → next month), which makes date math easy.
 */
export function zonedInstant(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  const asIfUtc = Date.UTC(year, month - 1, day, hour, minute);
  // First guess using the offset at that moment, then correct once in case the
  // guess landed on the other side of a daylight-saving change.
  let ms = asIfUtc - offsetAt(asIfUtc);
  const corrected = asIfUtc - offsetAt(ms);
  if (corrected !== ms) ms = corrected;
  return new Date(ms);
}

/** Midnight (chapel time) at the start of the day containing `date`, shifted by `days`. */
export function startOfDay(date: Date, days = 0): Date {
  const w = wallTime(date);
  return zonedInstant(w.year, w.month, w.day + days);
}

/** Sunday 00:00 (chapel time) of the week containing `date`. Weeks run Sunday–Saturday. */
export function startOfWeek(date: Date): Date {
  return startOfDay(date, -wallTime(date).weekday);
}

/** The following Sunday 00:00 (chapel time): the exclusive end of the current week. */
export function endOfWeek(date: Date): Date {
  return startOfDay(date, 7 - wallTime(date).weekday);
}

/** "YYYY-MM-DD" in chapel time; used to group events by day. */
export function dayKey(date: Date): string {
  const w = wallTime(date);
  return `${w.year}-${String(w.month).padStart(2, '0')}-${String(w.day).padStart(2, '0')}`;
}

/** Parses an all-day date like "2026-11-01" as midnight chapel time. */
export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return zonedInstant(y ?? 1970, m ?? 1, d ?? 1);
}

const dayFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});
const monthFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  month: 'long',
  year: 'numeric',
});
const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
});
const stampFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

/** "October 27, 2026" */
export const formatDate = (d: Date): string => dateFormat.format(d);
/** "Sunday, November 1" */
export const formatDay = (d: Date): string => dayFormat.format(d);
/** "November 2026" */
export const formatMonth = (d: Date): string => monthFormat.format(d);
/** "10:00 AM" */
export const formatTime = (d: Date): string => timeFormat.format(d);
/** "10:00 – 11:30 AM" (shared AM/PM is printed once) */
export const formatTimeRange = (start: Date, end: Date): string =>
  timeFormat.formatRange(start, end);
/** "Mon, Oct 26, 4:00 PM": for "last updated" notes. */
export const formatStamp = (d: Date): string => stampFormat.format(d);
