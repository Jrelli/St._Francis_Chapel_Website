import { describe, expect, it } from 'vitest';
import {
  dayKey,
  endOfWeek,
  formatDay,
  formatTimeRange,
  parseDateOnly,
  startOfWeek,
  wallTime,
  zonedInstant,
} from './dates';

// Run as if the computer were in Tokyo: results must not depend on the machine's timezone
// (Cloudflare builds in UTC; visitors can be anywhere).
process.env.TZ = 'Asia/Tokyo';

const iso = (d: Date) => d.toISOString();

describe('wallTime', () => {
  it('reads Chicago wall-clock time', () => {
    const w = wallTime(new Date('2026-07-04T15:00:00Z')); // 10:00 CDT, a Saturday
    expect(w).toMatchObject({ year: 2026, month: 7, day: 4, hour: 10, minute: 0, weekday: 6 });
  });

  it('uses 0 (not 24) for midnight', () => {
    expect(wallTime(new Date('2026-07-04T05:00:00Z')).hour).toBe(0);
  });
});

describe('zonedInstant across daylight-saving changes', () => {
  it('handles summer time (CDT, UTC-5)', () => {
    expect(iso(zonedInstant(2026, 3, 8, 10))).toBe('2026-03-08T15:00:00.000Z'); // DST began 2am
  });

  it('handles the fall-back day: midnight is still CDT, 10am is CST', () => {
    expect(iso(zonedInstant(2026, 11, 1, 0))).toBe('2026-11-01T05:00:00.000Z');
    expect(iso(zonedInstant(2026, 11, 1, 10))).toBe('2026-11-01T16:00:00.000Z');
  });

  it('rolls over out-of-range days', () => {
    expect(iso(zonedInstant(2026, 10, 32))).toBe(iso(zonedInstant(2026, 11, 1)));
  });
});

describe('weeks run Sunday to Saturday in Chicago', () => {
  it('finds the week around a Wednesday', () => {
    const wed = new Date('2026-10-28T17:00:00Z');
    expect(iso(startOfWeek(wed))).toBe('2026-10-25T05:00:00.000Z');
    expect(iso(endOfWeek(wed))).toBe('2026-11-01T05:00:00.000Z');
  });

  it('treats Saturday 10pm Chicago as Saturday, even though it is already Sunday in UTC', () => {
    const satNight = new Date('2026-11-01T03:00:00Z');
    expect(wallTime(satNight).weekday).toBe(6);
    expect(iso(startOfWeek(satNight))).toBe('2026-10-25T05:00:00.000Z');
  });

  it('handles a week that starts in CDT and ends in CST', () => {
    const wed = new Date('2026-11-04T18:00:00Z');
    expect(iso(startOfWeek(wed))).toBe('2026-11-01T05:00:00.000Z');
    expect(iso(endOfWeek(wed))).toBe('2026-11-08T06:00:00.000Z');
  });
});

describe('date-only values and formatting', () => {
  it('parses all-day dates as Chicago midnight', () => {
    expect(iso(parseDateOnly('2026-12-25'))).toBe('2026-12-25T06:00:00.000Z');
  });

  it('keys and formats by Chicago date', () => {
    const lateSat = new Date('2026-11-01T03:00:00Z');
    expect(dayKey(lateSat)).toBe('2026-10-31');
    expect(formatDay(lateSat)).toBe('Saturday, October 31');
  });

  it('formats a time range', () => {
    const range = formatTimeRange(zonedInstant(2026, 11, 1, 10), zonedInstant(2026, 11, 1, 11, 30));
    expect(range).toMatch(/^10:00\s*–\s*11:30\sAM$/);
  });
});
