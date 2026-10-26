/**
 * Sample events used when no Google API key is configured, so the site still builds and
 * every component can be seen working. Titles start with "(Sample)", and the pages also
 * show a "sample events" label, so these can never be mistaken for real times.
 *
 * Dates are relative to "now" so the sample always looks current.
 */
import { startOfWeek, wallTime, zonedInstant } from './dates';
import { parseTitle, sortEvents, type ChapelEvent } from './events';

interface Slot {
  title: string;
  hour: number;
  minute?: number;
  durationMin: number;
  location?: string;
  description?: string;
}

const SUNDAY_MASS: Slot = { title: 'Holy High Mass', hour: 10, durationMin: 90 };
const DAILY_MASS: Slot = {
  title: 'Daily Mass',
  hour: 8,
  durationMin: 45,
  location: 'Holy Crucifixion Hermitage, Newport',
};
const ADORATION: Slot = { title: 'Eucharistic Adoration', hour: 17, durationMin: 180 };

/** Weekly pattern: index = weekday (0 = Sunday). */
const WEEKLY: Slot[][] = [
  [SUNDAY_MASS],
  [DAILY_MASS],
  [DAILY_MASS],
  [DAILY_MASS],
  [DAILY_MASS, ADORATION],
  [DAILY_MASS],
  [DAILY_MASS],
];

/** One-time items, placed `dayOffset` days after today. */
const ONE_OFF: (Slot & { dayOffset: number; replacesRecurring?: boolean; allDay?: boolean })[] = [
  {
    dayOffset: 1,
    title: 'CANCELLED: Daily Mass',
    hour: 8,
    durationMin: 45,
    replacesRecurring: true,
    description: 'Father is traveling. Confessions are still available on Sunday.',
  },
  {
    dayOffset: 3,
    title: 'Chapel land work day',
    hour: 9,
    durationMin: 240,
    description: 'Bring gloves and water. Lunch provided.',
  },
  { dayOffset: 9, title: 'Rosary and Benediction', hour: 18, durationMin: 60 },
  { dayOffset: 12, title: 'Chapel build committee meeting', hour: 13, durationMin: 60 },
  { dayOffset: 20, title: 'Feast day Sung Mass', hour: 18, minute: 30, durationMin: 75 },
  { dayOffset: 27, title: 'Parish retreat day', hour: 0, durationMin: 0, allDay: true },
];

function makeEvent(
  id: string,
  slot: Slot,
  y: number,
  m: number,
  d: number,
  recurring: boolean,
  allDay = false,
): ChapelEvent {
  const start = zonedInstant(y, m, d, allDay ? 0 : slot.hour, allDay ? 0 : (slot.minute ?? 0));
  const end = allDay
    ? zonedInstant(y, m, d + 1)
    : new Date(start.getTime() + slot.durationMin * 60_000);
  const { title, notice } = parseTitle(slot.title);
  return {
    id,
    title: `(Sample) ${title}`,
    notice,
    start: start.toISOString(),
    end: end.toISOString(),
    allDay,
    recurring,
    location: slot.location,
    description: slot.description,
  };
}

export function mockEvents(now: Date, days: number): ChapelEvent[] {
  const events: ChapelEvent[] = [];
  const today = wallTime(now);
  const replaced = new Set<string>();

  ONE_OFF.forEach((o, i) => {
    const ev = makeEvent(
      `mock-once-${i}`,
      o,
      today.year,
      today.month,
      today.day + o.dayOffset,
      Boolean(o.replacesRecurring),
      o.allDay,
    );
    if (o.replacesRecurring) replaced.add(ev.start);
    events.push(ev);
  });

  // Start from Sunday so this week's earlier days exist too (callers filter by date).
  const sunday = wallTime(startOfWeek(now));
  for (let i = 0; i < days + 7; i++) {
    const date = wallTime(zonedInstant(sunday.year, sunday.month, sunday.day + i, 12));
    for (const slot of WEEKLY[date.weekday] ?? []) {
      const ev = makeEvent(
        `mock-weekly-${i}-${slot.hour}`,
        slot,
        date.year,
        date.month,
        date.day,
        true,
      );
      if (!replaced.has(ev.start)) events.push(ev);
    }
  }

  return sortEvents(events);
}
