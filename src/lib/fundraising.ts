/**
 * Build-time fundraising total for the chapel build.
 *
 * - site.fundraising.sheetCsvUrl blank → the raised amount and date typed into site.ts.
 * - URL set → read the Google Sheet (File → Share → Publish to web → CSV) on every build,
 *   so the total updates with the scheduled rebuilds. If the sheet can't be read, the BUILD
 *   FAILS on purpose (same policy as the calendar): the previous deploy stays live rather than
 *   publishing a wrong number.
 *
 * Sheet layout: a header row with "Raised" (required), "Goal" and "As of" columns, and the
 * values in the row below. Amounts may include "$" and commas.
 */
import { site } from '../config/site';

export interface Fundraising {
  raised: number;
  goal: number;
  /** When the total was last updated, as YYYY-MM-DD in chapel time. */
  asOf?: string | undefined;
  source: 'sheet' | 'config';
}

/** "$32,300" / "32300" / "32,300.50" → 32300.5; anything else → undefined. */
export function parseAmount(text: string | undefined): number | undefined {
  const cleaned = (text ?? '').replace(/[$,\s]/g, '');
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return undefined;
  return Number(cleaned);
}

/** "2026-10-27" or "10/27/2026" (how Google Sheets shows US dates) → "2026-10-27". */
export function parseSheetDate(text: string | undefined): string | undefined {
  const t = (text ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
  if (!us) return undefined;
  const [, m, d, y] = us;
  return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`;
}

/** Splits one CSV line, honoring "quoted, values" (Sheets quotes amounts like "$32,300"). */
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      cells.push(cell);
      cell = '';
    } else cell += ch;
  }
  cells.push(cell);
  return cells.map((c) => c.trim());
}

/** Reads the published sheet's CSV. Throws with a plain-English message if it's malformed. */
export function parseFundraisingCsv(csv: string): {
  raised: number;
  goal: number | undefined;
  asOf: string | undefined;
} {
  // Strip a byte-order mark if the export has one.
  const [headerLine, valueLine] = csv.replace(/^\uFEFF/, '').split(/\r?\n/);
  const headers = splitCsvLine(headerLine ?? '').map((h) => h.toLowerCase().replace(/\s+/g, ' '));
  const values = splitCsvLine(valueLine ?? '');
  const cell = (name: string) => {
    const i = headers.indexOf(name);
    return i === -1 ? undefined : values[i];
  };

  const raised = parseAmount(cell('raised'));
  if (raised === undefined) {
    throw new Error(
      'the sheet needs a "Raised" column header with an amount (like $32,300) in the row below it',
    );
  }
  return { raised, goal: parseAmount(cell('goal')), asOf: parseSheetDate(cell('as of')) };
}

let cached: Promise<Fundraising> | undefined;

/** Fetched once per build and shared by every page that shows the total. */
export function getFundraising(): Promise<Fundraising> {
  cached ??= load();
  return cached;
}

async function load(): Promise<Fundraising> {
  const { goal, raised, asOf, sheetCsvUrl } = site.fundraising;
  const fallback: Fundraising = {
    raised: raised.value,
    goal: goal.value,
    asOf: asOf.value || undefined,
    source: 'config',
  };
  const url = sheetCsvUrl.value.trim();
  if (!url) return fallback;

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, { credentials: 'omit', redirect: 'follow' });
      if (!res.ok) throw new Error(`the sheet responded ${res.status} ${res.statusText}`);
      const sheet = parseFundraisingCsv(await res.text());
      const result: Fundraising = {
        raised: sheet.raised,
        goal: sheet.goal ?? fallback.goal,
        asOf: sheet.asOf,
        source: 'sheet',
      };
      console.info(`[fundraising] Loaded the total from the sheet: $${result.raised}.`);
      return result;
    } catch (err) {
      lastError = err;
      console.warn(`[fundraising] Attempt ${attempt} failed: ${String(err)}`);
    }
  }
  throw new Error(
    `[fundraising] Could not read the fundraising sheet (${String(lastError)}). Stopping the ` +
      'build so a wrong total is never published; the previous deploy stays live. Check that ' +
      'the sheet is published to the web as CSV.',
  );
}

/** Share of the goal raised, 0–100 (whole percent). */
export const percentRaised = (f: Pick<Fundraising, 'raised' | 'goal'>): number =>
  f.goal > 0 ? Math.min(100, Math.floor((f.raised / f.goal) * 100)) : 0;

/** "$32,300" */
export const formatDollars = (n: number): string =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
