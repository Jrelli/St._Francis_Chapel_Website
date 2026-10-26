# Content to confirm

Everything on the site that hasn't been confirmed by someone responsible yet. Most of it
came from an unpublished Wix draft. When you confirm an item:

1. Fix the value where it lives (the **Source** column), and set `confirmed: true` if the item has that flag.
2. Tick it here, and note who confirmed it and when.

`npm run build` prints any config facts that are still unconfirmed. In `npm run dev`,
unconfirmed config values have a dotted orange outline (hover to see the TODO).

## Site-wide facts: `src/config/site.ts`

| ✓   | Fact                              | Current value                                                                                       | Used on                                                                | Notes                                                          |
| --- | --------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| ☑   | `name`                            | Saint Francis Mission Chapel                                                                        | Everywhere (header, titles, footer)                                    | Matches the chapel seal                                        |
| ☐   | `shortName`                       | St. Francis Chapel                                                                                  | Mobile header                                                          | Preferred short form?                                          |
| ☑   | `url`                             | https://saintfrancischapel.com                                                                      | Canonical links, sitemap                                               | Apex chosen as the canonical address                           |
| ☐   | `taglineLatin`                    | Ave Maria gratia plena Dominus tecum!                                                               | Home hero, footer                                                      | Wix draft                                                      |
| ☐   | `tagline`                         | The fullness of traditional Catholic life in Tennessee                                              | Home hero, page meta description fallback                              | Wix draft                                                      |
| ☐   | `description`                     | A traditional Latin Mass mission chapel of the Society of Saint Pius X in New Market, Tennessee.    | Search/social description, About                                       | How should the SSPX relationship be worded?                    |
| ☐   | `mailingAddress`                  | P.O. Box 27, New Market, TN 37820                                                                   | Footer, Contact                                                        | Wix draft                                                      |
| ☑   | `email`                           | office@saintfrancischapel.com                                                                       | Footer, Contact                                                        | Google Workspace mailbox, confirmed 2026-10-26                 |
| ☐   | `phone`                           | _(blank, hidden)_                                                                                   | Footer, Contact                                                        | Is there a public number?                                      |
| ☐   | `social.facebook`                 | https://www.facebook.com/saintfrancissspx                                                           | Footer, Contact, Home quick links                                      | Wix draft                                                      |
| ☐   | `social.youtube`                  | https://www.youtube.com/@saintfrancischapel                                                         | Footer, Contact, Home quick links                                      | Wix draft                                                      |
| ☐   | `chapelBuildBlurb`                | On five acres of Tennessee land, we are building a chapel worthy of the Holy Sacrifice of the Mass… | Home chapel-build box, Chapel Build                                    | Reworded from the Wix draft; confirm acreage and wording       |
| ☐   | `donateUrl`                       | https://donate.stripe.com/5kQdRa1jLebudSg2gy8Vi01                                                   | Header Donate button, Home chapel-build box, Donate page, Chapel Build | Confirm the Stripe page is the chapel's and is live            |
| ☐   | `calendar.id`                     | `c_ce9ab…726c6d@group.calendar.google.com`                                                          | Home (This week, Upcoming), Calendar page                              | Is this the calendar editors will use? Is it public?           |
| ☑   | `calendar.timeZone`               | America/Chicago                                                                                     | All dates and times                                                    |                                                                |
| ☐   | `bulletins.driveFolderId`         | _(blank)_                                                                                           | Bulletins page (Phase 2)                                               | Create the Drive folder and share it as "Anyone with the link" |
| ☐   | `organizations.capuchins`         | https://www.porziuncolaproject.com/                                                                 | Associated Organizations                                               | Link and description                                           |
| ☐   | `organizations.sspx`              | https://sspx.org/                                                                                   | Associated Organizations                                               | Which SSPX site? US District?                                  |
| ☐   | `organizations.homeschoolContact` | _(blank, hidden)_                                                                                   | Associated Organizations                                               | Contact person's name and how to reach them                    |

## Regular schedule: `src/data/schedule.yaml`

Each entry has its own `confirmed:` flag. All are from the Wix draft.

| ✓   | Entry                                                                         | Used on                   |
| --- | ----------------------------------------------------------------------------- | ------------------------- |
| ☐   | Sunday Holy High Mass, 10:00 AM; potluck ~11:30 AM (location on the calendar) | Home                      |
| ☐   | Daily Mass, 8:00 AM, Holy Crucifixion Hermitage, Newport                      | Home                      |
| ☐   | Sunday Confession, 9:00 – 10:00 AM                                            | Home                      |
| ☐   | Daily Confession at the Hermitage (ring the bell, ask for Father)             | Home                      |
| ☐   | First Friday Confession, 5:00 – 5:30 PM                                       | Home                      |
| ☐   | First Saturday Confession, 7:30 – 8:45 AM                                     | Home                      |
| ☐   | Holy Day Confession, 5:00 – 5:30 PM                                           | Home                      |
| ☐   | Thursday Adoration, 5:00 – 8:00 PM                                            | Home                      |
| ☐   | Where is Sunday Mass held? The draft doesn't say.                             | Home, Locations (Phase 2) |
| ☐   | Which days count as "Daily" (Mon–Sat? every day?)                             | Home                      |
| ☐   | The note under the schedule ("Times sometimes change…")                       | Home                      |

## Images and logos

| ✓   | Item                                        | Used on                                     | Notes                                       |
| --- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| ☑   | Saint Francis Mission Chapel seal           | Header, favicon source                      | The chapel's own mark, confirmed 2026-10-26 |
| ☑   | Saint Francis engraving (black and white)   | Home hero                                   | Approved for use 2026-10-26                 |
| ☑   | Saint Francis linocut blessing (red)        | Home chapel-build box                       | Approved for use 2026-10-26                 |
| ☐   | SSPX logo                                   | Associated Organizations (placeholder only) | **Not used until permission is confirmed**  |
| ☐   | Capuchin Friars logo                        | Associated Organizations (placeholder only) | **Not used until permission is confirmed**  |
| ☐   | Construction, property and rendering photos | Chapel Build gallery (Phase 2)              | Drop into `src/assets/photos/`              |

## Page copy (placeholder text in Phase 1)

Every stub page shows a dashed "placeholder" box until real copy is written. Still needed:

- ☐ About → Our Story, including the letter to and from Bishop Beckman
- ☐ About → Visiting for the First Time (dress, etiquette, what to expect at a TLM)
- ☐ About → Staff
- ☐ About → FAQ
- ☐ Chapel Build: the full project story (the short blurb is in `site.ts` above)
- ☐ Home: the "Help Us Build a Permanent Home" heading and "Follow the progress" wording
- ☐ Home hero engraving alt text: "Engraving of Saint Francis of Assisi with arms raised, bearing the stigmata"
- ☐ Locations: each Mass/Confession location's address and written directions
- ☐ Associated Organizations descriptions

## Domain and accounts

| ✓   | Item                                                      | Notes                                                           |
| --- | --------------------------------------------------------- | --------------------------------------------------------------- |
| ☑   | Registrar                                                 | GoDaddy (confirmed 2026-10-26)                                  |
| ☐   | Where DNS is hosted today                                 | Check the domain's nameservers in GoDaddy (see README)          |
| ☑   | Email on the domain                                       | Google Workspace, live: preserve its DNS records during cutover |
| ☐   | Who owns the Cloudflare, GitHub and Google Cloud accounts | Use a shared chapel account, not a personal one                 |

## Editor guide: `CONTENT_GUIDE.md`

| ✓   | Item                                                  | Notes                                                     |
| --- | ----------------------------------------------------- | --------------------------------------------------------- |
| ☐   | Website volunteer contact (name, email)               | Fill in the _[name, email]_ blank at the top of the guide |
| ☐   | The chapel calendar's display name in Google Calendar | The guide assumes "Saint Francis Mission Chapel"          |
| ☐   | Bulletins Drive folder name                           | The guide calls it "Bulletins" (Phase 2)                  |
