# Content to confirm

Everything on the site that hasn't been confirmed by someone responsible yet. Most of it
came from an unpublished Wix draft. When you confirm an item:

1. Fix the value where it lives (the **Source** column), and set `confirmed: true` if the item has that flag.
2. Tick it here, and note who confirmed it and when.

`npm run build` prints any config facts that are still unconfirmed. In `npm run dev`,
unconfirmed config values have a dotted orange outline (hover to see the TODO).

## Site-wide facts: `src/config/site.ts`

| ✓   | Fact                              | Current value                                                                                                 | Used on                                   | Notes                                                                                         |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| ☑   | `name`                            | Saint Francis Mission Chapel                                                                                  | Everywhere (header, titles, footer)       | Matches the chapel seal                                                                       |
| ☑   | `shortName`                       | Saint Francis Mission Chapel                                                                                  | Mobile header                             | "SFMC" is also acceptable (owner, 2026-10-27)                                                 |
| ☑   | `url`                             | https://saintfrancischapel.com                                                                                | Canonical links, sitemap                  | Apex chosen as the canonical address                                                          |
| ☑   | `taglineLatin`                    | Ave Domina, sancta Regina, sancta Dei genetrix Maria!                                                         | Home hero, footer                         | Provided by the owner 2026-10-27                                                              |
| ☑   | `tagline`                         | The fullness of traditional Catholic life in Tennessee                                                        | Home hero, page meta description fallback | Chosen by the stakeholder 2026-10-27 ("keeping the wording careful")                          |
| ☐   | `description`                     | A traditional Latin Mass mission chapel in Dandridge, Tennessee, affiliated with the Society of Saint Pius X. | Search/social description, About          | Reworded to match the mission statement ("affiliated with"); please review                    |
| ☑   | `mailingAddress`                  | P.O. Box 27, New Market, TN 37820                                                                             | Footer, Contact, Donate, Una Voce         | In the nonprofit information (owner, 2026-10-27)                                              |
| ☑   | `email`                           | office@saintfrancischapel.com                                                                                 | Footer, Contact                           | Google Workspace mailbox, confirmed 2026-10-26                                                |
| ☑   | `phone`                           | _(blank, hidden)_                                                                                             | Footer, Contact                           | Email only for now (owner, 2026-10-27)                                                        |
| ☑   | `social.facebook`                 | https://www.facebook.com/saintfrancissspx                                                                     | Footer, Contact, Home quick links         | (owner, 2026-10-27)                                                                           |
| ☑   | `social.youtube`                  | https://www.youtube.com/@saintfrancischapel                                                                   | Footer, Contact, Home quick links         | (owner, 2026-10-27)                                                                           |
| ☐   | `chapelBuildBlurb`                | On five acres of Tennessee land, we are building a chapel worthy of the Holy Sacrifice of the Mass…           | Home chapel-build box, Chapel Build       | Reworded from the Wix draft; confirm acreage and wording                                      |
| ☑   | `donateUrl`                       | https://www.givesendgo.com/saint-francis-mission-chapel                                                       | Donate page                               | GiveSendGo campaign (owner, 2026-10-27)                                                       |
| ☐   | `calendar.id`                     | `c_ce9ab…726c6d@group.calendar.google.com`                                                                    | Home (This week, Upcoming), Calendar page | Is this the calendar editors will use? Is it public?                                          |
| ☑   | `calendar.timeZone`               | America/New_York (Eastern)                                                                                    | All dates and times                       | Was America/Chicago in the original brief; corrected 2026-10-27 (Jefferson County is Eastern) |
| ☐   | `bulletins.driveFolderId`         | _(blank)_                                                                                                     | Bulletins page                            | Create the Drive folder and share it as "Anyone with the link"                                |
| ☑   | `organizations.capuchins`         | https://www.porziuncolaproject.com/                                                                           | Associated Organizations                  | (owner, 2026-10-27)                                                                           |
| ☑   | `organizations.sspx`              | https://sspx.org/                                                                                             | Associated Organizations                  | (owner, 2026-10-27)                                                                           |
| ☐   | `organizations.homeschoolContact` | _(blank, hidden)_                                                                                             | Associated Organizations                  | Contact person's name and how to reach them                                                   |

## Regular schedule: `src/data/schedule.yaml`

Each entry has its own `confirmed:` flag. All confirmed (owner, 2026-10-27).

| ✓   | Entry                                                                                                                                 | Used on         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| ☑   | Sunday Holy High Mass, 10:00 AM; potluck ~11:30 AM (owner, 2026-10-27)                                                                | Home            |
| ☑   | Weekday Low Mass, 8:00 AM, Monday – Saturday, Holy Crucifixion Hermitage ("confirm before you go")                                    | Home, Locations |
| ☑   | Sunday Confession, 9:30 AM (outside; Rosary in Latin inside)                                                                          | Home            |
| ☑   | Daily Confession at the Hermitage (ring the bell, ask for Father)                                                                     | Home            |
| ☑   | First Friday Confession, 5:00 – 5:30 PM                                                                                               | Home            |
| ☑   | First Saturday Confession, 7:30 – 8:45 AM                                                                                             | Home            |
| ☑   | Holy Day Confession, 5:00 – 5:30 PM                                                                                                   | Home            |
| ☑   | Thursday Adoration, 5:00 – 8:00 PM                                                                                                    | Home            |
| ☑   | Sunday Mass at the chapel, 1921 Sockless Rd, Dandridge, TN 37725. The site launches once Mass is held there (owner email, 2026-10-27) | Home, Locations |
| ☑   | The note under the schedule ("Times sometimes change…")                                                                               | Home            |

## Images and logos

| ✓   | Item                                                                                  | Used on                                                    | Notes                                                                                                          |
| --- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| ☑   | Saint Francis Mission Chapel seal                                                     | Favicon, social-share image                                | The chapel's own mark, confirmed 2026-10-26. The brown header crop is kept in `src/assets/brand/seal-mark.png` |
| ☑   | Saint Francis engraving (black and white)                                             | Header (circle crop), About overview (wide screens)        | Owner prefers it in the header (owner email, 2026-10-27)                                                       |
| ☑   | Saint Francis linocut blessing (red)                                                  | Not currently used                                         | Approved for use 2026-10-26                                                                                    |
| ☑   | Aerial photo of the property                                                          | Chapel Build → The Property                                | Original (not upscaled); removed from the home page at the owner's request                                     |
| ☑   | Church illustration (watercolor)                                                      | Home chapel-build box                                      | Provided 2026-10-26                                                                                            |
| ☑   | SSPX emblem (two hearts, from sspx.org)                                               | Associated Organizations                                   | Approved (owner, 2026-10-27)                                                                                   |
| ☑   | Capuchin Friars emblem                                                                | Associated Organizations                                   | Provided (owner, 2026-10-27)                                                                                   |
| ☑   | Una Voce International emblem                                                         | Associated Organizations                                   | Provided (owner, 2026-10-27)                                                                                   |
| ☑   | Elevation of the Host (Philipp Schumacher, 1920), public domain via Wikimedia Commons | Home and Contact → Have a Mass Offered                     | Chosen by Claude; swap it if you prefer another image                                                          |
| ☑   | 15 construction photos                                                                | Chapel Build gallery                                       | Provided 2026-10-26; resized and metadata stripped                                                             |
| ☑   | People shown in the construction photos are OK with being on the website              | Chapel Build gallery                                       | Already public on Facebook (owner, 2026-10-27)                                                                 |
| ☑   | Interior rendering ("Chapel Rendering 7A")                                            | Chapel Build, captioned "Concept rendering"                | Provided 2026-10-27                                                                                            |
| ☑   | Site plan ("Layout render 2")                                                         | Chapel Build → The Property, captioned "Concept site plan" | Provided 2026-10-27; labels: chapel, parking, driveway, Marian grotto                                          |

## Page copy

Pages show a dashed "Coming soon" box where copy is still needed.

- ☑ About → How Our Mission Is Organized (SSPX, Una Voce Tennessee, Capuchins), provided 2026-10-26
- ☑ About → Staff (chapel team and Una Voce board), provided 2026-10-26, in `src/data/staff.yaml`
- ☑ About → FAQ (four questions), provided 2026-10-26, in `src/data/faq.yaml`
- ☑ Our Story → letter to Bishop Beckman (Sept 28, 2026), reproduced verbatim
- ☑ About → **Mission Statement**: full text on its own page (`src/data/mission-statement.md`), short "Our Mission" on the overview (owner email, 2026-10-27)
- ☑ About → Una Voce Tennessee: relationship wording, "Our Mission" and nonprofit information from "Una Voce blurb and footer" (owner email, 2026-10-27)
- ☑ About → Una Voce Tennessee page: who they are, the property, board of directors (from `staff.yaml`)
- ☑ Our Story → Diocese of Knoxville notice (Oct 2, 2026), linked as the original PDF
- ☑ Associated Organizations → Capuchins, SSPX and Una Voce Tennessee descriptions
- ☑ Our Story → "How the Mission Began": drafted from the Substack posts, reviewed and approved (owner, 2026-10-27)
- ☐ About → Visiting for the First Time (dress, etiquette, what to expect at a TLM)
- ☑ Chapel Build → "The Project": drafted from the same posts, reviewed and approved (owner, 2026-10-27)
- ☐ Home: the "Help Us Build a Permanent Home" heading and "Follow the progress" wording
- ☑ Locations: addresses, times and chapel directions (2026-10-27). The Hermitage needs no written directions (owner)
- ☐ Associated Organizations → homeschool groups description

## Questions raised by the new content

These are worded as provided. Visitors may notice the differences, so they're worth settling.

| ✓   | Question                                                                                                                                                                                       | Where                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| ☑   | SSPX relationship: now worded as in the mission statement ("affiliated with the SSPX, but the SSPX does not govern its operations…") on About, Organizations and FAQ (owner email, 2026-10-27) | About, Organizations, FAQ  |
| ☑   | 501(c)(3): Una Voce Tennessee; Saint Francis Mission Chapel is its registered DBA. EIN 42-3384159 (owner email, 2026-10-27)                                                                    | FAQ, About, Donate, footer |
| ☑   | Location: the chapel is in Dandridge (1921 Sockless Rd); the mailing address is the New Market P.O. box                                                                                        | Our Story, footer, Contact |
| ☑   | "Society of Pope Saint Pius X" wording replaced by the mission statement's "Society of Saint Pius X"                                                                                           | About, Organizations       |
| ☑   | Spelling: "Ashney Patoka" is correct (owner email, 2026-10-27)                                                                                                                                 | Staff                      |
| ☐   | FAQ: "Please contact the parish office." Link it to the Contact page?                                                                                                                          | FAQ                        |
| ☑   | Una Voce Tennessee has no website of its own; the Una Voce International site (fiuv.org) is linked instead (owner email, 2026-10-27)                                                           | Una Voce, Organizations    |
| ☑   | FAQ typo fixed: "Saint Francis Mission Chapel chapel" → "Saint Francis Mission Chapel"                                                                                                         | FAQ                        |
| ☐   | Barn size: the Oct 1 post says ~5,000 sq ft, the Oct 14 post ~4,500 sq ft. The site says "a large barn" until confirmed.                                                                       | Our Story, Chapel Build    |
| ☑   | Fundraising goal: $300,000 everywhere on the site (owner, 2026-10-27)                                                                                                                          | Chapel Build               |
| ☑   | Target: sanctuary ready for Mass during Advent 2026 (owner email, 2026-10-27)                                                                                                                  | Chapel Build               |
| ☑   | Donations: GiveSendGo and mailed checks; Stripe dropped (owner email, 2026-10-27)                                                                                                              | Donate, Chapel Build       |
| ☐   | The Oct 1 post says "Diocese of East Tennessee"; the site uses the official name, Diocese of Knoxville.                                                                                        | Our Story                  |
| ☑   | Mission statement: chapel name made consistent ("Saint Francis Mission Chapel") in both places (owner, 2026-10-27)                                                                             | About → Mission Statement  |
| ☐   | Una Voce page shows the nonprofit physical address (4719 Old Knoxville Hwy, Rockford) as listed in the provided document. OK to publish?                                                       | About → Una Voce Tennessee |
| ☑   | Mass intentions: Jennifer Strand's name and email and the $20 customary offering may be published (owner, 2026-10-27)                                                                          | Home, Contact              |
| ☑   | Weekday Mass: every day except Sunday; confirm before going as Father sometimes travels (owner email, 2026-10-27)                                                                              | Home, Locations            |

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
| ☐   | Bulletins Drive folder name                           | The guide calls it "Bulletins"                            |
