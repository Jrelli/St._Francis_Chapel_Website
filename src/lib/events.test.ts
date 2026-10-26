import { describe, expect, it } from 'vitest';
import {
  buildEventsUrl,
  cleanApiKey,
  groupByDay,
  htmlToText,
  normalizeGoogleEvent,
  parseTitle,
  selectThisWeek,
  selectUpcoming,
  type ChapelEvent,
} from './events';
import { mockEvents } from './mock-events';

describe('parseTitle', () => {
  it.each([
    ['CANCELLED: Daily Mass', 'cancelled', 'Daily Mass'],
    ['Canceled - Daily Mass', 'cancelled', 'Daily Mass'],
    ['changed: Sunday Mass at 11', 'changed', 'Sunday Mass at 11'],
    ['Notice — Potluck moved indoors', 'notice', 'Potluck moved indoors'],
    ['NOTICE:', 'notice', 'Notice'],
  ])('%s', (raw, notice, title) => {
    expect(parseTitle(raw)).toEqual({ notice, title });
  });

  it.each(['Cancellation of debt talk', 'Changes to the schedule', 'Holy High Mass'])(
    'leaves ordinary titles alone: %s',
    (raw) => {
      expect(parseTitle(raw)).toEqual({ title: raw });
    },
  );

  it('falls back for missing titles', () => {
    expect(parseTitle(undefined)).toEqual({ title: 'Event' });
  });
});

describe('htmlToText', () => {
  it('turns Google description HTML into plain text', () => {
    expect(htmlToText('<b>Bring</b> a dish<br>Thanks &amp; God bless&nbsp;you')).toBe(
      'Bring a dish\nThanks & God bless you',
    );
  });

  it('strips tags (output is always rendered as escaped text anyway)', () => {
    expect(htmlToText('<script>alert(1)</script><a href="x">link</a> &#60;3')).toBe(
      'alert(1)link <3',
    );
  });
});

describe('normalizeGoogleEvent', () => {
  it('normalizes a timed occurrence of a repeating event', () => {
    const ev = normalizeGoogleEvent({
      id: 'a',
      summary: 'CHANGED: Holy High Mass',
      location: ' Chapel ',
      recurringEventId: 'r1',
      start: { dateTime: '2026-11-01T10:00:00-06:00' },
      end: { dateTime: '2026-11-01T11:30:00-06:00' },
    });
    expect(ev).toEqual({
      id: 'a',
      title: 'Holy High Mass',
      notice: 'changed',
      start: '2026-11-01T16:00:00.000Z',
      end: '2026-11-01T17:30:00.000Z',
      allDay: false,
      recurring: true,
      location: 'Chapel',
      description: undefined,
    });
  });

  it('treats date-only events as all-day in Chicago', () => {
    const ev = normalizeGoogleEvent({
      id: 'b',
      summary: 'Retreat',
      start: { date: '2026-12-05' },
      end: { date: '2026-12-06' },
    });
    expect(ev?.allDay).toBe(true);
    expect(ev?.start).toBe('2026-12-05T06:00:00.000Z');
    expect(ev?.recurring).toBe(false);
  });

  it('drops cancelled (deleted) instances', () => {
    expect(normalizeGoogleEvent({ id: 'c', status: 'cancelled', start: {}, end: {} })).toBeNull();
  });
});

const ev = (
  id: string,
  start: string,
  end: string,
  extra: Partial<ChapelEvent> = {},
): ChapelEvent => ({
  id,
  title: id,
  start,
  end,
  allDay: false,
  recurring: false,
  ...extra,
});

describe('home page selections', () => {
  // Wednesday Oct 28 2026, noon Chicago.
  const now = new Date('2026-10-28T17:00:00Z');
  const events = [
    ev('past-today', '2026-10-28T13:00:00Z', '2026-10-28T13:45:00Z'),
    ev('routine', '2026-10-29T13:00:00Z', '2026-10-29T13:45:00Z', { recurring: true }),
    ev('cancelled-routine', '2026-10-30T13:00:00Z', '2026-10-30T13:45:00Z', {
      recurring: true,
      notice: 'cancelled',
    }),
    ev('one-off', '2026-10-31T14:00:00Z', '2026-10-31T18:00:00Z'),
    ev('next-week-routine', '2026-11-01T16:00:00Z', '2026-11-01T17:30:00Z', { recurring: true }),
    ev('next-week-event', '2026-11-03T00:00:00Z', '2026-11-03T01:00:00Z'),
  ];

  it('This week = remaining exceptions until Saturday night', () => {
    expect(selectThisWeek(events, now).map((e) => e.id)).toEqual(['cancelled-routine', 'one-off']);
  });

  it('Upcoming = exceptions after this week', () => {
    expect(selectUpcoming(events, now).map((e) => e.id)).toEqual(['next-week-event']);
  });

  it('groups by Chicago day', () => {
    const late = ev('late', '2026-11-01T03:00:00Z', '2026-11-01T04:00:00Z'); // Sat 10pm CDT
    const days = groupByDay([events[3]!, late]);
    expect(days.map((d) => [d.key, d.events.length])).toEqual([['2026-10-31', 2]]);
  });
});

describe('buildEventsUrl', () => {
  it('encodes the calendar ID and expands repeating events', () => {
    const url = new URL(
      buildEventsUrl('c_abc@group.calendar.google.com', 'KEY', new Date(0), new Date(1000)),
    );
    expect(url.pathname).toBe('/calendar/v3/calendars/c_abc%40group.calendar.google.com/events');
    expect(url.searchParams.get('singleEvents')).toBe('true');
    expect(url.searchParams.get('orderBy')).toBe('startTime');
  });
});

describe('mockEvents', () => {
  const now = new Date('2026-10-28T17:00:00Z');
  const mock = mockEvents(now, 30);

  it('labels every sample event', () => {
    expect(mock.every((e) => e.title.startsWith('(Sample) '))).toBe(true);
  });

  it('includes an exception this week so the This Week box is exercised', () => {
    expect(selectThisWeek(mock, now).some((e) => e.notice === 'cancelled')).toBe(true);
  });

  it('replaces the routine Mass that the cancellation stands in for', () => {
    const thursday8am = mock.filter((e) => e.start === '2026-10-29T13:00:00.000Z');
    expect(thursday8am).toHaveLength(1);
    expect(thursday8am[0]?.notice).toBe('cancelled');
  });
});

describe('cleanApiKey', () => {
  it.each([
    ['AIzaKEY', 'AIzaKEY'],
    ['  AIzaKEY\n', 'AIzaKEY'],
    ['"AIzaKEY"', 'AIzaKEY'],
    ["'AIzaKEY' ", 'AIzaKEY'],
    [undefined, ''],
  ])('%j → %j', (raw, clean) => {
    expect(cleanApiKey(raw)).toBe(clean);
  });
});
