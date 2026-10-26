/**
 * Live "This week" refresh, running in visitors' browsers.
 *
 * The page already contains a build-time list. This script:
 *   1. hides any events on the page that have already ended (the build may be hours old);
 *   2. if a browser API key is configured, fetches this week's events straight from Google
 *      Calendar (5-second timeout) and swaps in the fresh list;
 *   3. on any failure, quietly keeps the build-time list. Nothing breaks.
 *
 * DOM is built with createElement/textContent (never innerHTML), so calendar text can't
 * inject markup.
 */
import { PUBLIC_GOOGLE_CALENDAR_BROWSER_KEY } from 'astro:env/client';
import { endOfWeek, formatDay, formatStamp, formatTimeRange, startOfDay } from '../lib/dates';
import {
  cleanApiKey,
  fetchGoogleEvents,
  groupByDay,
  NOTICE_LABELS,
  selectThisWeek,
  type ChapelEvent,
} from '../lib/events';

const TIMEOUT_MS = 5000;
const BROWSER_KEY = cleanApiKey(PUBLIC_GOOGLE_CALENDAR_BROWSER_KEY);

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Browser twin of EventList.astro. Keep the markup identical. */
function renderEventDays(events: ChapelEvent[]): HTMLOListElement {
  const list = el('ol', 'event-days');
  list.setAttribute('role', 'list');
  for (const day of groupByDay(events)) {
    const dayItem = el('li', 'event-day');
    dayItem.append(el('h3', 'event-day__date', formatDay(day.date)));
    const items = el('ul', 'event-items');
    items.setAttribute('role', 'list');
    for (const e of day.events) {
      const item = el('li', 'event');
      item.dataset.end = e.end;
      if (e.notice) item.dataset.notice = e.notice;
      item.append(
        el(
          'p',
          'event__when',
          e.allDay ? 'All day' : formatTimeRange(new Date(e.start), new Date(e.end)),
        ),
      );
      const title = el('p', 'event__title');
      if (e.notice) title.append(el('span', `badge badge--${e.notice}`, NOTICE_LABELS[e.notice]));
      title.append(e.title);
      item.append(title);
      if (e.location) item.append(el('p', 'event__where', e.location));
      if (e.description) item.append(el('p', 'event__desc', e.description));
      items.append(item);
    }
    dayItem.append(items);
    list.append(dayItem);
  }
  return list;
}

/** Removes events that have ended, and any day or list left empty. */
function pruneEnded(root: ParentNode, now: Date): void {
  const nowIso = now.toISOString();
  root.querySelectorAll<HTMLElement>('.event[data-end]').forEach((item) => {
    if ((item.dataset.end ?? '') <= nowIso) item.remove();
  });
  root.querySelectorAll('.event-day').forEach((day) => {
    if (!day.querySelector('.event')) day.remove();
  });
}

function showEvents(body: HTMLElement, events: ChapelEvent[]): void {
  body.replaceChildren(
    events.length > 0
      ? renderEventDays(events)
      : el('p', 'this-week__empty', 'No changes to the regular schedule this week.'),
  );
}

async function refresh(section: HTMLElement): Promise<void> {
  const body = section.querySelector<HTMLElement>('[data-this-week-body]');
  const status = section.querySelector<HTMLElement>('[data-live-status]');
  if (!body) return;

  const now = new Date();
  pruneEnded(document, now);
  if (!body.querySelector('.event')) {
    showEvents(body, []);
  }

  const calendarId = section.dataset.calendarId;
  if (!BROWSER_KEY || !calendarId) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const events = await fetchGoogleEvents(
      calendarId,
      BROWSER_KEY,
      startOfDay(now),
      endOfWeek(now),
      { signal: controller.signal, maxPages: 1 },
    );
    showEvents(body, selectThisWeek(events, new Date()));
    section.querySelector('[data-sample-note]')?.remove();
    if (status) status.textContent = `Up to date as of ${formatStamp(new Date())}.`;
  } catch {
    // Network error, timeout, or API problem: keep the build-time list as-is.
  } finally {
    clearTimeout(timer);
  }
}

const section = document.querySelector<HTMLElement>('[data-this-week]');
if (section) void refresh(section);
