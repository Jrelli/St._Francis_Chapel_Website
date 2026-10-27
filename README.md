# Saint Francis Mission Chapel website

Static website for Saint Francis Mission Chapel, a Traditional Latin Mass mission in New Market,
Tennessee. Built with [Astro](https://astro.build) and hosted free on Cloudflare (Workers static assets).

- **No server, database, logins or cookies.** Every page is plain HTML built ahead of time.
- **Volunteers never touch code.** Events come from a public Google Calendar, and (Phase 2)
  bulletins come from a Google Drive folder. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md).
- **Unconfirmed facts** are tracked in [CONTENT_TO_CONFIRM.md](CONTENT_TO_CONFIRM.md).

**Contents:** [Local development](#local-development) · [Project layout](#project-layout) ·
[Environment variables & Google setup](#environment-variables--google-setup) ·
[How the calendar works](#how-the-calendar-works) ·
[Deploying to Cloudflare](#deploying-to-cloudflare) ·
[Scheduled rebuilds](#scheduled-rebuilds) · [Domain cutover guide](#domain-cutover-guide) ·
[Security notes](#security-notes) · [Costs](#costs)

---

## Local development

Requires **Node.js 24** (any version ≥ 22.23.4 works; `.node-version` pins 24 for Cloudflare).

```sh
npm install
cp .env.example .env     # optional: add API keys; without them you get sample events
npm run dev              # http://localhost:4321, reloads as you edit
```

| Command           | What it does                                                      |
| ----------------- | ----------------------------------------------------------------- |
| `npm run dev`     | Local dev server. Unconfirmed config values get a dotted outline. |
| `npm run build`   | Builds the site into `dist/` and lists unconfirmed facts.         |
| `npm run preview` | Serves the built `dist/` folder.                                  |
| `npm run lint`    | ESLint, including accessibility rules for `.astro` files.         |
| `npm run format`  | Formats everything with Prettier (`format:check` only checks).    |
| `npm run check`   | TypeScript type-checking for `.ts` and `.astro` files.            |
| `npm test`        | Unit tests (Vitest) for the date/timezone and calendar logic.     |
| `npm run verify`  | All of the above, as CI runs it.                                  |

Recommended VS Code extensions are listed in `.vscode/extensions.json`; VS Code offers to install them.

## Project layout

```
public/                  Copied as-is: _headers (security), robots.txt, favicons
src/
  config/site.ts         ← ALL site-wide facts (name, address, email, links, calendar ID…)
  config/nav.ts          Header and footer menu links
  data/schedule.yaml     ← The regular weekly Mass/Confession/Adoration schedule
  lib/
    calendar.ts          Build-time Google Calendar fetch (or sample data)
    events.ts            Event model, Google API conversion, "exception" rules
    dates.ts             All date math, pinned to America/Chicago
    mock-events.ts       Sample events used when no API key is set
    schedule.ts          Loads and validates schedule.yaml
  scripts/               Small browser scripts: mobile menu, live "This week"
  components/            Header, Footer, Schedule, ThisWeek, EventList, placeholders…
  layouts/BaseLayout.astro   The page shell (head tags, header, footer)
  pages/                 One file per URL (about/faq.astro → /about/faq/)
  styles/                global.css (design tokens, events), print.css
  assets/                Images (optimized at build). Put photos in assets/photos/.
.github/workflows/       CI checks and the scheduled rebuild
media/                   Raw originals; git-ignored, never published
```

**Astro in one paragraph (for C#/Java folks):** an `.astro` file is a component. The part between the
`---` fences is TypeScript that runs **at build time only** (like a server-side template's code-behind);
below it is HTML with `{expressions}`. `<style>` blocks are scoped to that component. A `<script>`
tag is the only code that ships to the browser, and Astro bundles it into a separate `.js` file.

## Environment variables & Google setup

| Variable                             | Where it's used                       | Secret?                                                    |
| ------------------------------------ | ------------------------------------- | ---------------------------------------------------------- |
| `GOOGLE_API_KEY`                     | Build only (server side)              | Yes. Never sent to browsers.                               |
| `PUBLIC_GOOGLE_CALENDAR_BROWSER_KEY` | Visitors' browsers (live "This week") | No, it's visible in the page, **so it must be restricted** |
| `GOOGLE_CALENDAR_ID`                 | Build; **testing only**               | No. Overrides the calendar in `site.ts` (see below)        |

All are optional. Locally they go in `.env` (git-ignored); in production, in Cloudflare (see below).
The calendar ID and Drive folder ID are **not** secrets and live in `src/config/site.ts`.

**Why two keys?** A key restricted to our website only works when the request comes from a browser
on our website. The build runs on Cloudflare's servers, which send no website "referrer", so it needs
its own key, kept secret instead.

### One-time Google setup

Use a chapel-owned Google account, not a personal one.

1. **Make the calendar public.** In Google Calendar, open the calendar's _Settings and sharing →
   Access permissions for events_ → tick **Make available to public** → **See all event details**.
2. **Create a Google Cloud project** at <https://console.cloud.google.com> (free; no billing account
   is needed for these APIs at our volume).
3. **Enable the API:** _APIs & Services → Library →_ **Google Calendar API** → Enable.
   (Phase 2 also enables **Google Drive API** for bulletins.)
4. **Create the build key:** _APIs & Services → Credentials → Create credentials → API key_.
   (Use this main Credentials page. The Calendar API's own Credentials tab only offers OAuth and
   service accounts, which we don't need.) Edit it:
   - Name: `build-key`
   - **API restrictions → Restrict key →** Google Calendar API (and Drive API in Phase 2)
   - Application restrictions: _None_ (it's kept secret instead)
5. **Create the browser key** the same way. Edit it:
   - Name: `browser-key`
   - **API restrictions →** Google Calendar API **only**
   - **Application restrictions → Websites**, add:
     - `https://saintfrancischapel.com/*`
     - `https://*.saintfrancischapel.com/*`
     - `https://*.<your-subdomain>.workers.dev/*` (your Worker's address; see Deploying)
     - `http://localhost:4321/*` (optional, for testing live mode locally)
6. Put the keys in `.env` locally and in Cloudflare (next sections). Run `npm run build` and look
   for `[calendar] Loaded N events from Google Calendar.`

### Testing with your own calendar

To try things without touching the chapel calendar, make a separate **public** calendar in your
own Google account and set `GOOGLE_CALENDAR_ID` to its ID (_Settings and sharing → Integrate
calendar_). The build logs a warning, and the pages show a **"Test calendar"** note while it's set,
so it can't slip into production unnoticed. Delete the variable to go back to the chapel calendar.

- Locally: put it in `.env`.
- On Cloudflare: add it to the Build variables while testing, and **delete it before launch**.
- Keys created in a personal Google Cloud project work for testing. For launch, recreate them in a
  chapel-owned project so the site doesn't depend on one person's account.

A useful set of test events: a weekly repeating event; one occurrence of it renamed
`CANCELLED: …` (saved as _This event_); a `CHANGED: …` event and an all-day `NOTICE: …` this week;
a one-time event this week with formatting in its description; and an event 2–3 weeks out.

## How the calendar works

```
Google Calendar ──(build, every ~3h)──► static HTML: This week, Upcoming, Calendar page
       └────────(visitor's browser, on page load)──► refreshes "This week" live
```

- **Build time** (`src/lib/calendar.ts`): fetches the next 90 days once per build. Repeating events
  are expanded into individual dates. Descriptions are converted to plain text (no HTML from the
  calendar ever reaches the page).
- **What counts as an "exception"** (shown in _This week_ and _Upcoming events_): any one-time event,
  plus any occurrence whose title starts with `CANCELLED:`, `CHANGED:` or `NOTICE:`. Plain
  occurrences of repeating events (the weekly Mass) are left out of those boxes because the regular
  schedule already shows them; the Calendar page lists everything.
- **In the browser** (`src/scripts/this-week.ts`): hides events that have already ended, then (if
  the browser key is set) fetches this week from Google with a 5-second timeout and swaps in the
  fresh list. On any failure, the build-time list stays, labelled "As of …". Without JavaScript the
  build-time list still shows.
- **No API key:** sample events are used, every title starts with "(Sample)", and a red dashed
  "Sample events, not real times" note is shown.
- **Key set but Google fails:** the build **fails on purpose** after one retry. Cloudflare keeps the
  previous deploy online, so sample data can never replace real events.
- **Timezone:** builds run in UTC and visitors can be anywhere, so all date math goes through
  `src/lib/dates.ts`, which uses `America/Chicago` explicitly. Tests cover daylight-saving changes.

## Deploying to Cloudflare

The site is deployed as a **Cloudflare Worker with static assets only** (no server code). That's
what Cloudflare's dashboard creates by default now; it behaves like the older "Pages" product,
and requests for static files are free and unlimited. [`wrangler.jsonc`](wrangler.jsonc) tells
Cloudflare to upload `dist/` as-is. **Keep that file:** without it, the deploy step auto-installs an
SSR adapter and rebuilds the site without our variables.

Use a chapel-owned Cloudflare account. The free plan is enough.

1. Push this repository to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → pick the repo.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (the default)
   - Node version comes from `.node-version` automatically.
4. **Settings → Build → Build variables and secrets.** These are the ones the build reads.
   (The separate _Settings → Variables & Secrets_ list is for Worker code at runtime; this site
   has none, so variables there do nothing.)
   - `GOOGLE_API_KEY`: the build key
   - `PUBLIC_GOOGLE_CALENDAR_BROWSER_KEY`: the browser key
5. Deploy. The site appears at `https://st-francis-chapel-website.<your-subdomain>.workers.dev`.
   Every push to `main` redeploys.

`public/_headers` is applied by Cloudflare automatically (CSP and other security headers). If you
later embed something (e.g. a map), its domain must be added to the CSP there or it will be blocked.

## Scheduled rebuilds

Calendar changes reach the static pages on the next build, so we rebuild every 3 hours.
(The live "This week" box doesn't wait. It updates immediately in visitors' browsers.)

1. Cloudflare: the Worker → **Settings → Builds → Deploy Hooks** → add one (name: `scheduled`,
   branch: `main`). Copy the URL. **Treat it like a password:** anyone with it can trigger builds.
2. GitHub: repo → **Settings → Secrets and variables → Actions → New repository secret**:
   name `CF_DEPLOY_HOOK_URL`, value = the hook URL.
3. Test: GitHub → **Actions → Scheduled rebuild → Run workflow**, then watch a new deployment
   appear in Cloudflare.

Notes:

- Every 3 hours ≈ 240 builds/month. Each build takes about a minute, well within the free plan's
  build allowance. Change the `cron:` line in `.github/workflows/scheduled-rebuild.yml` to adjust.
- **GitHub pauses scheduled workflows in a public repo after 60 days without commits** and emails
  the repo owner. Re-enable it on the Actions tab. If that becomes a nuisance, an alternative is a
  free Cloudflare Worker with a Cron Trigger that POSTs the same hook.
- Need an update right now? Use **Run workflow** (above), or **Retry build** on the Worker's
  _Deployments_ tab in Cloudflare.

## Domain cutover guide

> **Document only. Nothing here is automated.** Do this after the site works on its `*.workers.dev` address.

**What we know (2026-10-26):** the domain is registered at **GoDaddy**, and
**office@saintfrancischapel.com is a live Google Workspace mailbox**. That means branch **(a)**
below applies: email must keep working through the move. Still to find out: where DNS is hosted.

The plan: keep GoDaddy as the registrar, move **DNS** to Cloudflare (free), then point the domain
at the Cloudflare Worker that serves the site. The canonical address is **`https://saintfrancischapel.com`** (apex); `www`
redirects to it.

Pick a quiet time (a weekday, not Saturday night before Mass). DNS changes can take a few hours to
spread everywhere.

### Step 0: Find out where DNS is hosted

GoDaddy → **My Products → Domains → saintfrancischapel.com → DNS → Nameservers**.

- `ns##.domaincontrol.com` → DNS is hosted at **GoDaddy** (the usual case). Records are on the
  _DNS Records_ tab.
- Anything else (e.g. `ns-cloud-x.googledomains.com`, a web host's servers) → DNS is hosted
  **there**; do the inventory in that provider's dashboard instead.

### Step 1: Inventory every existing DNS record (always first)

Write down **every** record before changing anything: type, name, value, priority, TTL. A
screenshot of the full records table, plus a text copy, is ideal. If the provider offers
**Export zone file**, save that too. Look especially for:

| Type      | Name                | Typical Google Workspace value                                         | Why it matters                        |
| --------- | ------------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| MX        | `@`                 | `smtp.google.com` (priority 1), **or** the older five `ASPMX…` records | Delivers incoming mail. **Critical.** |
| TXT       | `@`                 | `v=spf1 include:_spf.google.com ~all`                                  | SPF: who may send as us               |
| TXT       | `google._domainkey` | `v=DKIM1; k=rsa; p=…` (long)                                           | DKIM signature key. Easy to miss.     |
| TXT       | `_dmarc`            | `v=DMARC1; p=…`                                                        | DMARC policy                          |
| TXT       | `@`                 | `google-site-verification=…`                                           | Proves domain ownership to Google     |
| CNAME / A | various             | anything else (other services, verification)                           | Keep unless you know it's unused      |

Double-check from outside with a terminal (Windows PowerShell works):

```sh
nslookup -type=MX  saintfrancischapel.com
nslookup -type=TXT saintfrancischapel.com
nslookup -type=TXT google._domainkey.saintfrancischapel.com
nslookup -type=TXT _dmarc.saintfrancischapel.com
nslookup -type=NS  saintfrancischapel.com
```

If there's no DKIM record, check Google Admin → **Apps → Google Workspace → Gmail → Authenticate
email**. You can generate one there and add it later in Cloudflare.

GoDaddy often adds a **"Parked"** `A @` record, a `www` CNAME to the parked page, and sometimes
**domain forwarding**. Those are for GoDaddy's placeholder page: note them, but don't carry them
over, because Cloudflare replaces them. Turn off any GoDaddy domain forwarding.

### Step 2: Add the domain to Cloudflare and verify the import

1. Cloudflare → **Add a domain** → `saintfrancischapel.com` → **Free** plan.
2. Cloudflare scans and imports existing records. **Compare the import line by line against your
   Step 1 inventory.** Add anything missing (DKIM and long TXT records are the usual misses), and
   delete the GoDaddy parking records.
3. Email-related records must be **DNS only (grey cloud)**. MX and TXT can't be proxied anyway;
   any `A`/`CNAME` used by mail must not be proxied either.
4. Cloudflare shows two nameservers (e.g. `ada.ns.cloudflare.com`). Keep that page open.

### Step 3: Email branch

**(a) Email already exists on the domain. This is our case (Google Workspace).**
Before switching nameservers, confirm Cloudflare has the exact **MX**, **SPF**, **DKIM**,
**DMARC** and **google-site-verification** records from Step 1. If any are missing, mail can bounce
or land in spam. Don't change their values during the move; one change at a time.

**(b) No email on the domain (for reference).**
Nothing to preserve; email can be added any time later, for example:

- **Google Workspace for Nonprofits** (free tier for eligible nonprofits; full mailboxes), or
- **Cloudflare Email Routing** (free; forwards `office@…` to existing inboxes, no mailboxes).

That choice is ours to make later. Meanwhile, consider publishing `v=spf1 -all` (TXT `@`) and
`v=DMARC1; p=reject` (TXT `_dmarc`) so nobody can spoof mail from the unused domain. **Remove
those before** setting up real email.

### Step 4: Turn off DNSSEC at the registrar

If DNSSEC is on, switching nameservers while it's on can make the whole domain (site **and email**)
unreachable.

1. GoDaddy → the domain → **DNS → DNSSEC** (or _Domain Settings → DNSSEC_). If it's on, turn it
   off / delete the DS records.
2. Wait until the DS record is gone (often a few hours, up to the DS record's TTL, sometimes
   24–48 h). Check: `nslookup -type=DS saintfrancischapel.com` returns no DS answer.

### Step 5: Change nameservers at GoDaddy

GoDaddy → the domain → **DNS → Nameservers → Change Nameservers → "I'll use my own
nameservers"** → enter the two Cloudflare nameservers → Save.

Cloudflare emails when the domain is **Active** (often under an hour, up to 24 h). **Leave the old
GoDaddy records untouched** until everything is verified; they are the rollback plan.

**Rollback:** switch the nameservers back to GoDaddy's defaults. The old records are still there.

### Step 6: Re-enable DNSSEC, in Cloudflare

Cloudflare → the domain → **DNS → Settings → DNSSEC → Enable**. It shows a DS record; add it at
GoDaddy (**DNSSEC → Add DS record**). Cloudflare confirms when it's active.

### Step 7: Connect the custom domains to the site, with one canonical address

1. The Worker → **Settings → Domains & Routes → Add → Custom domain** → `saintfrancischapel.com`.
   Repeat for `www.saintfrancischapel.com`. Cloudflare creates the DNS records and HTTPS
   certificates.
2. Redirect `www` to the apex: Cloudflare → the domain → **Rules → Redirect Rules → Create rule
   from template → "Redirect from WWW to Root"**: 301, keep path and query string.
   (The site's own `_redirects` file can't redirect between hostnames, so this is done at the zone.)
3. **SSL/TLS → Edge Certificates → Always Use HTTPS: On.**
4. The browser API key already allows `saintfrancischapel.com` (see Google setup). Nothing to change.

### Step 8: Post-cutover checklist

- [ ] `https://saintfrancischapel.com` loads with a padlock (no certificate warning)
- [ ] `https://www.saintfrancischapel.com` redirects to `https://saintfrancischapel.com`
- [ ] `http://saintfrancischapel.com` redirects to `https://…`
- [ ] Deep links work through the redirect, e.g. `www.saintfrancischapel.com/calendar/`
- [ ] "This week" shows _Up to date as of …_ on the live domain (browser key works there)
- [ ] **Email in:** send from an outside account (e.g. a personal Gmail) to
      office@saintfrancischapel.com and confirm it arrives
- [ ] **Email out:** reply from office@ and confirm it arrives, not in spam. In Gmail, _Show
      original_ on the received message should say SPF **PASS**, DKIM **PASS**, DMARC **PASS**
- [ ] Google Admin Toolbox **Check MX** (<https://toolbox.googleapps.com/apps/checkmx/>) reports
      no problems
- [ ] DNSSEC shows **Active** in Cloudflare
- [ ] A scheduled rebuild ran successfully after the cutover
- [ ] Then, and only then, tidy up: nothing needs deleting at GoDaddy, but note in
      CONTENT_TO_CONFIRM.md that DNS now lives in Cloudflare

## Security notes

- **No secrets in git.** `.env` is git-ignored; `.env.example` documents the variables. Production
  values live in Cloudflare (and the deploy hook URL in GitHub Secrets).
- **The browser key is public by design** (anyone can see it in the page). Its safety comes from the
  restrictions in [Google setup](#one-time-google-setup): Calendar API only, and only from our
  domains. Never give it more APIs. If it's ever abused, delete it in Google Cloud and make a new one.
- **The build key** has no referrer restriction, so keep it secret (Cloudflare _Secret_ type).
- **Content from Google is treated as untrusted:** event text is rendered as text, never as HTML.
- **CSP** in `public/_headers` blocks inline and third-party scripts. Astro is configured never to
  inline scripts or styles (`astro.config.mjs`) so the policy can stay strict.
- **No analytics, trackers, cookies, or third-party embeds** in Phase 1. The only third-party
  request is the browser's call to `www.googleapis.com` for the live calendar (no cookies sent).
  Adding any of these requires sign-off first.
- **Payments** go to the external Stripe page only. This site never handles card data.

## Costs

| Item                         | Cost                                   |
| ---------------------------- | -------------------------------------- |
| Cloudflare Workers + DNS     | $0 (free plan)                         |
| GitHub repo + Actions        | $0 (well within free minutes)          |
| Google Calendar / Drive APIs | $0 (free quota is far above our usage) |
| Domain (GoDaddy)             | Annual renewal, already being paid     |
| Google Workspace email       | Existing; unchanged by this project    |

## Phase 2 (not built yet)

Bulletins from Google Drive · Locations data file with maps (map provider TBD, as embeds can set
cookies) and a print-directions view · Chapel Build photo gallery · real page copy.
