/**
 * Calendar events: the shape the site uses, plus conversion from Google Calendar's API.
 * Shared by the build (src/lib/calendar.ts) and the browser (this-week.ts).
 */
import { dayKey, endOfWeek, parseDateOnly, TIME_ZONE } from './dates';

export type NoticeKind = 'cancelled' | 'changed' | 'notice';

export interface ChapelEvent {
  id: string;
  /** Title with any "CANCELLED:" / "CHANGED:" / "NOTICE:" prefix removed. */
  title: string;
  notice?: NoticeKind | undefined;
  /** ISO 8601 instants. All-day events start at midnight Chicago time. */
  start: string;
  end: string;
  allDay: boolean;
  /** True for an occurrence of a repeating event (e.g. the weekly Sunday Mass). */
  recurring: boolean;
  location?: string | undefined;
  description?: string | undefined;
}

/** The subset of Google's Event resource we request (see `fields` in buildEventsUrl). */
export interface GoogleEvent {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  recurringEventId?: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

interface GoogleEventsPage {
  items?: GoogleEvent[];
  nextPageToken?: string;
}

export const NOTICE_LABELS: Record<NoticeKind, string> = {
  cancelled: 'Cancelled',
  changed: 'Changed',
  notice: 'Notice',
};

// Editors mark exceptions by starting the title with one of these words and a colon.
const NOTICE_PREFIX = /^\s*(cancell?ed|changed?|notice)\s*[:\-–—]\s*/i;

export function parseTitle(raw: string | undefined): { title: string; notice?: NoticeKind } {
  const text = (raw ?? '').trim() || 'Event';
  const match = NOTICE_PREFIX.exec(text);
  if (!match) return { title: text };
  const word = (match[1] ?? '').toLowerCase();
  const notice: NoticeKind = word.startsWith('cancel')
    ? 'cancelled'
    : word.startsWith('change')
      ? 'changed'
      : 'notice';
  return { title: text.slice(match[0].length).trim() || NOTICE_LABELS[notice], notice };
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/**
 * Google event descriptions may contain HTML. We never inject that HTML into the page;
 * we reduce it to plain text, which is then always rendered as text (auto-escaped).
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
      if (code[0] === '#') {
        const n =
          code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
        return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : '';
      }
      return ENTITIES[code.toLowerCase()] ?? whole;
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function toInstant(t: { date?: string; dateTime?: string }): string | undefined {
  if (t.dateTime) return new Date(t.dateTime).toISOString();
  if (t.date) return parseDateOnly(t.date).toISOString();
  return undefined;
}

export function normalizeGoogleEvent(g: GoogleEvent): ChapelEvent | null {
  if (g.status === 'cancelled') return null;
  const start = toInstant(g.start);
  const end = toInstant(g.end) ?? start;
  if (!start || !end) return null;
  const { title, notice } = parseTitle(g.summary);
  const description = g.description ? htmlToText(g.description) : '';
  return {
    id: g.id,
    title,
    notice,
    start,
    end,
    allDay: !g.start.dateTime,
    recurring: Boolean(g.recurringEventId),
    location: g.location?.trim() || undefined,
    description: description || undefined,
  };
}

export function buildEventsUrl(
  calendarId: string,
  apiKey: string,
  timeMin: Date,
  timeMax: Date,
  pageToken?: string,
): string {
  const params = new URLSearchParams({
    key: apiKey,
    singleEvents: 'true', // expand repeating events into individual dates
    orderBy: 'startTime',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    timeZone: TIME_ZONE,
    maxResults: '250',
    // Ask only for the fields we use: smaller, faster responses.
    fields:
      'nextPageToken,items(id,status,summary,description,location,recurringEventId,start,end)',
  });
  if (pageToken) params.set('pageToken', pageToken);
  return `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
}

/**
 * Fetches and normalizes events between two instants. Throws on any HTTP error.
 * Error messages deliberately never include the URL, because it contains the API key.
 */
export async function fetchGoogleEvents(
  calendarId: string,
  apiKey: string,
  timeMin: Date,
  timeMax: Date,
  options: { signal?: AbortSignal; maxPages?: number } = {},
): Promise<ChapelEvent[]> {
  const events: ChapelEvent[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < (options.maxPages ?? 10); page++) {
    const res = await fetch(buildEventsUrl(calendarId, apiKey, timeMin, timeMax, pageToken), {
      signal: options.signal ?? null,
      credentials: 'omit',
    });
    if (!res.ok) {
      throw new Error(
        `Google Calendar API responded ${res.status} ${res.statusText}${await googleErrorMessage(res)}`,
      );
    }
    const body = (await res.json()) as GoogleEventsPage;
    for (const item of body.items ?? []) {
      const ev = normalizeGoogleEvent(item);
      if (ev) events.push(ev);
    }
    pageToken = body.nextPageToken;
    if (!pageToken) break;
  }
  return sortEvents(events);
}

/**
 * Google explains failures in the response body, e.g. "API key not valid" or "Requests from
 * referer <empty> are blocked". Those messages never echo the key, so they're safe to log.
 */
async function googleErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: { message?: string } };
    const message = body.error?.message?.slice(0, 300);
    return message ? `: ${message}` : '';
  } catch {
    return '';
  }
}

/** Removes whitespace and wrapping quotes that often sneak in when pasting a key. */
export function cleanApiKey(key: string | undefined): string {
  return (key ?? '')
    .trim()
    .replace(/^["']|["']$/g, '')
    .trim();
}

export function sortEvents(events: ChapelEvent[]): ChapelEvent[] {
  return [...events].sort(
    (a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title),
  );
}

/**
 * "Exceptions" are what the home page's This Week box shows: anything that isn't a plain
 * occurrence of the regular schedule. One-time events count, and so does any repeating
 * occurrence an editor has marked CANCELLED/CHANGED/NOTICE.
 */
export const isException = (e: ChapelEvent): boolean => !e.recurring || e.notice !== undefined;

/** Events overlapping the half-open window [from, to). */
export function eventsBetween(events: ChapelEvent[], from: Date, to: Date): ChapelEvent[] {
  const lo = from.toISOString();
  const hi = to.toISOString();
  return events.filter((e) => e.end > lo && e.start < hi);
}

/** Home page "This week": exceptions from now until Saturday night. */
export function selectThisWeek(events: ChapelEvent[], now: Date): ChapelEvent[] {
  return eventsBetween(events, now, endOfWeek(now)).filter(isException);
}

/** Home page "Upcoming events": exceptions after this week, soonest first. */
export function selectUpcoming(events: ChapelEvent[], now: Date, limit = 6): ChapelEvent[] {
  const after = endOfWeek(now).toISOString();
  return events.filter((e) => e.start >= after && isException(e)).slice(0, limit);
}

export interface EventDay {
  key: string; // YYYY-MM-DD
  date: Date;
  events: ChapelEvent[];
}

/** Groups (already sorted) events by their Chicago start date. */
export function groupByDay(events: ChapelEvent[]): EventDay[] {
  const days: EventDay[] = [];
  for (const e of events) {
    const date = new Date(e.start);
    const key = dayKey(date);
    const last = days[days.length - 1];
    if (last?.key === key) last.events.push(e);
    else days.push({ key, date, events: [e] });
  }
  return days;
}
