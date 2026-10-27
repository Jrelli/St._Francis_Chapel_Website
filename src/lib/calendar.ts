/**
 * Build-time calendar loader. Runs only during `astro build` / `astro dev`, never in the browser.
 *
 * - No GOOGLE_API_KEY → sample events (clearly labelled on the page).
 * - Key set but Google fails → the BUILD FAILS on purpose. Cloudflare then keeps the
 *   last good deploy online, which is better than silently publishing sample events.
 * - GOOGLE_CALENDAR_ID set → read that calendar instead of the one in site.ts. For testing
 *   only; pages show a "test calendar" note so it can't go unnoticed in production.
 */
import { GOOGLE_API_KEY, GOOGLE_CALENDAR_ID } from 'astro:env/server';
import { site } from '../config/site';
import { startOfDay } from './dates';
import { cleanApiKey, eventsBetween, fetchGoogleEvents, type ChapelEvent } from './events';
import { mockEvents } from './mock-events';

export const DAYS_AHEAD = 90;

const configuredId = site.calendar.id.value.trim();
const overrideId = (GOOGLE_CALENDAR_ID ?? '').trim();

/** The calendar this build reads (also handed to the browser for the live refresh). */
export const calendarId = overrideId || configuredId;
/** True when GOOGLE_CALENDAR_ID points somewhere other than the configured calendar. */
export const isTestCalendar = overrideId !== '' && overrideId !== configuredId;

export interface EventFeed {
  events: ChapelEvent[];
  source: 'google' | 'mock';
  /** ISO instant the data was fetched; shown as "As of …" if live refresh fails. */
  fetchedAt: string;
}

// Several pages need events; fetch once per build and share the promise.
let cached: Promise<EventFeed> | undefined;

export function getEventFeed(): Promise<EventFeed> {
  cached ??= load();
  return cached;
}

/**
 * On Cloudflare Pages, says which environment is building. Variables are set separately for
 * Production and Preview, which is the usual reason one is "missing".
 */
function cloudflareEnvNote(): string {
  const branch = process.env.CF_PAGES_BRANCH;
  if (!process.env.CF_PAGES || !branch) return '';
  return ` (Cloudflare Pages build of branch "${branch}"; check this environment's variables)`;
}

async function load(): Promise<EventFeed> {
  const now = new Date();
  const from = startOfDay(now);
  const to = startOfDay(now, DAYS_AHEAD);
  const apiKey = cleanApiKey(GOOGLE_API_KEY);

  if (isTestCalendar) {
    console.warn(
      '[calendar] GOOGLE_CALENDAR_ID is set: reading a TEST calendar instead of the one in ' +
        'src/config/site.ts. Remove it from production settings before launch.',
    );
  }

  // GOOGLE_CALENDAR_ID means someone intends real data, so sample events would only confuse.
  if (!apiKey && overrideId) {
    throw new Error(
      '[calendar] GOOGLE_CALENDAR_ID is set but GOOGLE_API_KEY is missing or empty in this ' +
        `environment${cloudflareEnvNote()}. Add the build key, then redeploy.`,
    );
  }

  if (!apiKey || !calendarId) {
    console.warn(
      `[calendar] ${apiKey ? 'No calendar ID' : 'No GOOGLE_API_KEY'} set${cloudflareEnvNote()}: ` +
        'using SAMPLE events.',
    );
    return {
      events: eventsBetween(mockEvents(now, DAYS_AHEAD), from, to),
      source: 'mock',
      fetchedAt: now.toISOString(),
    };
  }

  // Google API keys are 39 characters starting with "AIza". Reporting only the length is safe
  // and catches the common mistakes (pasting the wrong value, or a truncated key).
  if (!/^AIza[\w-]{35}$/.test(apiKey)) {
    console.warn(
      `[calendar] GOOGLE_API_KEY doesn't look like a Google API key ` +
        `(expected 39 characters starting with "AIza"; got ${apiKey.length} characters).`,
    );
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const events = await fetchGoogleEvents(calendarId, apiKey, from, to);
      console.info(`[calendar] Loaded ${events.length} events from Google Calendar.`);
      return { events, source: 'google', fetchedAt: now.toISOString() };
    } catch (err) {
      lastError = err;
      console.warn(`[calendar] Attempt ${attempt} failed: ${String(err)}`);
    }
  }
  throw new Error(
    `[calendar] Could not load Google Calendar events (${String(lastError)}). ` +
      'Stopping the build so sample data is never published; the previous deploy stays live. ' +
      'Check the API key restrictions and that the calendar is public.',
  );
}
