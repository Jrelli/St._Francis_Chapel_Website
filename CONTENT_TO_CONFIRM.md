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
| ☑   | `tagline`                         | East Tennessee's Traditional Latin Mass Catholic Chapel                                             | Home hero, page meta description fallback                              | Provided 2026-10-26                                            |
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

| ✓   | Item                                                                     | Used on                                                    | Notes                                                                      |
| --- | ------------------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| ☑   | Saint Francis Mission Chapel seal                                        | Header, favicon source                                     | The chapel's own mark, confirmed 2026-10-26                                |
| ☑   | Saint Francis engraving (black and white)                                | About overview (wide screens)                              | Approved for use 2026-10-26                                                |
| ☑   | Saint Francis linocut blessing (red)                                     | Not currently used                                         | Approved for use 2026-10-26                                                |
| ☑   | Aerial photo of the property                                             | Chapel Build → The Property                                | Original (not upscaled); removed from the home page at the owner's request |
| ☑   | Church illustration (watercolor)                                         | Home chapel-build box                                      | Provided 2026-10-26                                                        |
| ☐   | SSPX logo                                                                | Associated Organizations (placeholder only)                | **Not used until permission is confirmed**                                 |
| ☐   | Capuchin Friars logo                                                     | Associated Organizations (placeholder only)                | **Not used until permission is confirmed**                                 |
| ☑   | 15 construction photos                                                   | Chapel Build gallery                                       | Provided 2026-10-26; resized and metadata stripped                         |
| ☐   | People shown in the construction photos are OK with being on the website | Chapel Build gallery                                       | Friars and volunteers are recognizable; worth a quick check                |
| ☑   | Interior rendering ("Chapel Rendering 7A")                               | Chapel Build, captioned "Concept rendering"                | Provided 2026-10-27                                                        |
| ☑   | Site plan ("Layout render 2")                                            | Chapel Build → The Property, captioned "Concept site plan" | Provided 2026-10-27; labels: chapel, parking, driveway, Marian grotto      |

## Page copy

Pages show a dashed "Coming soon" box where copy is still needed.

- ☑ About → How Our Mission Is Organized (SSPX, Una Voce Tennessee, Capuchins), provided 2026-10-26
- ☑ About → Staff (chapel team and Una Voce board), provided 2026-10-26, in `src/data/staff.yaml`
- ☑ About → FAQ (four questions), provided 2026-10-26, in `src/data/faq.yaml`
- ☑ Our Story → letter to Bishop Beckman (Sept 28, 2026), reproduced verbatim
- ☑ Our Story → Diocese of Knoxville notice (Oct 2, 2026), linked as the original PDF
- ☑ Associated Organizations → Capuchins, SSPX and Una Voce Tennessee descriptions
- ☐ Our Story → "How the Mission Began": **drafted 2026-10-27** from the TLM Respecter Substack posts (Oct 1 and Oct 14, 2026). Please review; text is in `src/data/our-story.md`
- ☐ About → Visiting for the First Time (dress, etiquette, what to expect at a TLM)
- ☐ Chapel Build → "The Project": **drafted 2026-10-27** from the same posts. Please review; text is in `src/pages/chapel-build.astro`
- ☐ Home: the "Help Us Build a Permanent Home" heading and "Follow the progress" wording
- ☐ Locations: each Mass/Confession location's address and written directions
- ☐ Associated Organizations → homeschool groups description

## Questions raised by the new content

These are worded as provided. Visitors may notice the differences, so they're worth settling.

| ✓   | Question                                                                                                                                                                                                                                    | Where                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ☐   | SSPX relationship: About/Organizations say the mission "operates under the guidance and direction of the SSPX", while the FAQ says it "is independently operated and is not directly administered by the SSPX". Can both be true as worded? | About, Organizations, FAQ  |
| ☐   | Which organization is the 501(c)(3)? The FAQ says "our chapel is recognized as a 501(c)(3)"; About says the property is owned by Una Voce Tennessee, "a tax exempt international organization". This matters for donation receipts.         | FAQ, About, Donate         |
| ☐   | Location: the letter says the mission chapel is "in Dandridge"; the site's mailing address is New Market. Both may be right (property vs. P.O. box).                                                                                        | Our Story, footer, Contact |
| ☐   | "Society of Pope Saint Pius X" (About) vs. "Society of Saint Pius X" (elsewhere)                                                                                                                                                            | About, Organizations       |
| ☐   | Spelling: "Ashney Patoka" (Choir Director). Is it "Ashley"?                                                                                                                                                                                 | Staff                      |
| ☐   | FAQ: "Please contact the parish office." Link it to the Contact page?                                                                                                                                                                       | FAQ                        |
| ☐   | Una Voce Tennessee website, if any, to link                                                                                                                                                                                                 | Organizations              |
| ☑   | FAQ typo fixed: "Saint Francis Mission Chapel chapel" → "Saint Francis Mission Chapel"                                                                                                                                                      | FAQ                        |
| ☐   | Barn size: the Oct 1 post says ~5,000 sq ft, the Oct 14 post ~4,500 sq ft. The site says "a large barn" until confirmed.                                                                                                                    | Our Story, Chapel Build    |
| ☐   | Fundraising goal $300,000 (from the Oct 1 post). Still current?                                                                                                                                                                             | Chapel Build               |
| ☐   | Target: finish the sanctuary for Mass during Advent (2026). Still the plan?                                                                                                                                                                 | Chapel Build               |
| ☐   | Donations: the posts mention a GiveSendGo campaign and mailed checks; the site's Donate button uses the Stripe link. Which should the site offer?                                                                                           | Donate, Chapel Build       |
| ☐   | The Oct 1 post says "Diocese of East Tennessee"; the site uses the official name, Diocese of Knoxville.                                                                                                                                     | Our Story                  |
| ☐   | Location: the posts place the property in Jefferson County (which includes both Dandridge and New Market). Street address for the Locations page?                                                                                           | Locations, Our Story       |

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
