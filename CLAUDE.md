# CLAUDE.md

Static site for **Saint Francis Mission Chapel** (Traditional Latin Mass / SSPX mission, New Market, TN).
Astro 7 → Cloudflare Worker serving static assets only (Workers Builds; not the older Pages product), ~$0/year, no backend. Human docs: [README.md](README.md) (setup, deploy,
DNS cutover), [CONTENT_GUIDE.md](CONTENT_GUIDE.md) (volunteer editors),
[CONTENT_TO_CONFIRM.md](CONTENT_TO_CONFIRM.md) (unconfirmed facts).

## Status (as of 2026-10-26)

- **Phase 1 done:** scaffold, config, layout, home page, stub pages, calendar module, docs, CI.
- **Phase 2 (not started; plan first):** bulletins from a Google Drive folder (build-time, same mock
  fallback as the calendar), locations data file + maps + print-directions view, Chapel Build photo
  gallery (`src/assets/photos/`), real page copy.
- **Testing setup:** the owner's personal Google Cloud keys plus a personal test calendar, via
  `GOOGLE_CALENDAR_ID` in the local `.env`. Verified working locally (build fetch and live refresh).
  Cloudflare Worker `st-francis-chapel-website` deploys from GitHub `main`. Its build variables
  (Settings → Build → Build variables and secrets) hold the keys plus `GOOGLE_CALENDAR_ID`
  (delete that one before launch).
- **Domain:** registered at GoDaddy; DNS host not yet known. office@saintfrancischapel.com is a
  live **Google Workspace** mailbox, so DNS cutover must preserve its MX/SPF/DKIM/DMARC (README guide).

## Working agreements with the owner

- The owner is a CS student (C#/Java/Python/C++), newer to web frameworks. **Briefly explain
  non-obvious choices.**
- **Propose a short plan and wait for approval** before starting a new phase or larger feature.
- **Ask first** before adding any paid service, analytics, third-party tracking, cookies, or
  third-party embeds (e.g. Google Maps iframes can set cookies), and **before every `git push`**.
- Commit in small, logical steps with clear messages, on `main` (origin:
  github.com/Jrelli/St._Francis_Chapel_Website). CI (`.github/workflows/ci.yml`) runs on push.
- **Secrets:** `.env` holds real API keys. Never print, read aloud, or commit them (to check it,
  list variable names only). If the owner pastes a key in chat, recommend rotating it.
- **All content is unconfirmed** unless marked `confirmed: true`. Don't invent facts (times,
  policies, places). Use a `<Placeholder>` and add the item to CONTENT_TO_CONFIRM.md.
- **No SSPX/Capuchin/other org logos** until permission is confirmed (`LogoPlaceholder.astro`).
  The chapel seal is the chapel's own mark and is approved.

## Commands

Node 24 (`.node-version`). `npm run dev` · `npm run build` · `npm test` · `npm run lint` ·
`npm run check` · `npm run format` · **`npm run verify`** (everything CI runs; run before committing).

## Architecture and invariants

- **Site facts** live only in `src/config/site.ts` as `fact(value, confirmed, todo)`. Templates hide
  blank values with `has()` from `src/lib/config.ts`. Never render an empty `mailto:`/`tel:`/link.
  `Fact.astro` outlines unconfirmed values in dev only.
- **Regular schedule:** `src/data/schedule.yaml`, Zod-validated in `src/lib/schedule.ts`.
- **Calendar** (`src/lib/calendar.ts`, build time): no key → labelled sample data
  (`mock-events.ts`); key set but Google fails → **throw** (Cloudflare keeps the last good deploy).
  Keep this policy. `GOOGLE_CALENDAR_ID` overrides `site.calendar.id` for testing and shows a
  "Test calendar" note.
- **Exceptions rule** (`isException` in `src/lib/events.ts`): non-recurring events, or any event
  whose title starts with `CANCELLED:`/`CHANGED:`/`NOTICE:`. CONTENT_GUIDE.md documents this for
  editors. Change both together.
- **Dates:** always use `src/lib/dates.ts` (America/Chicago via Intl). Never use local-time
  `Date` getters. Builds run in UTC. Tests cover DST and run with `TZ=Asia/Tokyo`.
- `src/lib/events.ts` and `dates.ts` are **shared with the browser**: no Node APIs there.
- `EventList.astro` and `renderEventDays()` in `src/scripts/this-week.ts` produce **identical markup**.
  Keep them in sync. Event styles are global (in `global.css`) because scoped styles don't reach
  DOM built in the browser.
- **Calendar text is untrusted:** render it as text only. Never use `set:html`/`innerHTML` with it.
- **CSP** (`public/_headers`) forbids inline script/style. So: no `style=""` attributes, no
  `define:vars`, keep `build.inlineStylesheets: 'never'` and `vite.build.assetsInlineLimit: 0`.
  New external origins (fetch, embeds) must be added to the CSP.
- **API keys:** `GOOGLE_API_KEY` is a build-only secret; `PUBLIC_GOOGLE_CALENDAR_BROWSER_KEY` ships to
  the browser and must stay referrer- and API-restricted. Env schema is in `astro.config.mjs`.
- **A11y:** WCAG AA colors (tokens in `global.css`), large type for older readers, Mass times above
  the fold on phones. `role="list"` on unstyled lists is intentional (Safari); the ESLint rule
  allows it. The mobile nav collapses via `@media (scripting: enabled)` (no inline JS).

## Gotchas

- **Keep `wrangler.jsonc`** (static assets only, `dist/`). Without it, Cloudflare's
  `npx wrangler deploy` auto-runs `astro add cloudflare` (SSR adapter, KV, Images bindings) and
  rebuilds the site without the build variables. Don't add the Cloudflare adapter; the site is
  fully static. Check changes with `npx wrangler deploy --dry-run` (no login needed).

- ESLint 10: `eslint-plugin-jsx-a11y` doesn't support it, so the project uses the
  `eslint-plugin-jsx-a11y-x` fork.
- Visual checks: headless Chrome/Edge enforces a ~500px minimum window, so `--window-size=390`
  screenshots lie. Use DevTools-protocol device emulation for true phone widths.
- Astro 7 is newer than much training data. Check `node_modules/astro` types/docs before assuming
  config APIs.
- Windows dev machine; `.gitattributes` forces LF (Prettier expects it).
