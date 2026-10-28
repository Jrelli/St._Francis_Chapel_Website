# Updating the website: a guide for volunteers

You don't need to know anything about websites to keep this one up to date. Almost everything
is done in **Google Calendar** (events and changes) and, soon, **Google Drive** (bulletins).
The website reads from those automatically.

**Questions or something looks wrong?** Contact the website volunteer: _[name, email]_.

---

## How quickly do changes appear?

| Where on the website                        | When your change shows up                      |
| ------------------------------------------- | ---------------------------------------------- |
| **"This Week"** box on the home page        | **Right away.** Visitors just reload the page. |
| Everything else (Upcoming Events, Calendar) | Within about **3 hours**                       |

Need the whole site updated sooner (say, a cancellation tonight)? The "This Week" box already
shows it. For the rest, ask the website volunteer to trigger an update.

---

## Before you start: use the right calendar

The website only reads the chapel's calendar, **Saint Francis Mission Chapel**. When you create an
event, check the calendar name shown in the event window (next to a colored dot). If it shows your
personal calendar, click it and switch to the chapel calendar. **Events on your personal calendar
won't appear on the website.**

---

## Add a one-time event

Examples: a feast-day Mass, a potluck, a work day, a talk.

1. Open Google Calendar and click **Create** (or click the day).
2. **Title:** what it is, e.g. `Rosary and Benediction`.
3. **Date and time.** For a whole-day event, tick **All day**.
4. Make sure the calendar is **Saint Francis Mission Chapel** (see above).
5. **Location** (optional): the place or address. It's shown on the website.
6. **Description** (optional): a short note, e.g. "Bring a dish to share." It's shown as plain
   text; formatting like bold won't carry over.
7. Click **Save**.

One-time events appear in **This Week** (if they're this week), in **Upcoming Events**
on the home page, and on the **Calendar** page.

---

## Cancel a Mass (or anything else)

**Don't delete it.** If you delete it, it just vanishes from the website, and people won't know it
was cancelled. Instead, mark it:

1. Click the event on the day it's cancelled, then click the **pencil** (Edit).
2. Change the title so it **starts with `CANCELLED:`**. For example,
   `Daily Mass` becomes `CANCELLED: Daily Mass`.
3. Optional: in the **Description**, say why or what to do instead, e.g.
   "Father is traveling. Confessions as usual on Sunday."
4. Click **Save**. If Google asks **"Edit recurring event"**, choose
   **This event** (not "All events"!) and click **OK**.

The website shows it with a red **CANCELLED** label at the top of **This Week**.

## Change a time or place

1. Open the event on that day and click the **pencil** (Edit).
2. Change the time or location.
3. Change the title so it **starts with `CHANGED:`**, e.g. `CHANGED: Holy High Mass`.
   You might add the reason in the description.
4. **Save**. If asked, choose **This event**.

## Post a general notice

For something that isn't a single event ("Chapel road closed; use the back entrance"), create an
**All day** event on the relevant day with a title that **starts with `NOTICE:`**, e.g.
`NOTICE: Use the back entrance this week`.

### The three special words

| Start the title with… | The website shows…        | Use it for                |
| --------------------- | ------------------------- | ------------------------- |
| `CANCELLED:`          | a red **CANCELLED** label | Something isn't happening |
| `CHANGED:`            | a gold **CHANGED** label  | Different time or place   |
| `NOTICE:`             | a navy **NOTICE** label   | General announcements     |

Capital letters don't matter (`Cancelled:` works too), but **the colon is needed**.

---

## Weekly (repeating) events

The regular weekly Masses can be set up in Google Calendar as **repeating** events
(Event options → _Does not repeat_ → _Weekly on Sunday_, etc.).

- On the **Calendar** page, every occurrence is listed.
- On the **home page**, repeating events are **not** listed in "This Week" or "Upcoming Events",
  because the regular schedule is already shown above them. They only appear there when marked
  `CANCELLED:`, `CHANGED:` or `NOTICE:`.

## Changing the regular weekly schedule

The **Mass & Confession Times** box on the home page is the _normal_ week, and it doesn't come from
the calendar. Changing it is rare (e.g. Adoration moves to Fridays permanently). Ask the website
volunteer, or, if you're comfortable:

1. On GitHub, open the file `src/data/schedule.yaml` and click the **pencil** icon.
2. Change the text, keeping the spacing at the start of each line exactly as it is.
3. Click **Commit changes**. The site updates in a few minutes.

If something is typed wrong, the update simply doesn't go through and the old version stays online.
Nothing breaks. The website volunteer gets an email and can fix it.

---

## Fundraising total _(coming soon: not connected yet)_

Once the website volunteer connects the fundraising sheet, updating the total on the website
will work like this:

1. Open the **Fundraising** sheet in Google Drive.
2. Type the new total under **Raised** (like `$33,500`) and today's date under **As of**.

That's it. The website shows the new amount and moves the progress bar within about 3 hours.
Please don't rename the **Raised** column or add rows above it; the website looks for that
header.

---

## Bulletins _(coming soon: not connected yet)_

Once this is set up, posting the weekly bulletin will work like this:

1. Save the bulletin as a **PDF**.
2. Name it with the **Sunday date first**, like `2026-11-01 Bulletin.pdf`
   (year-month-day, so they sort correctly).
3. Upload it to the shared **Bulletins** folder in Google Drive.

The website lists every PDF in that folder, newest first, within about 3 hours.

**Please don't change the folder's sharing settings.** It must stay "Anyone with the link can
view", or the website can't see the bulletins.

---

## Something isn't showing up?

- **Is it on the chapel calendar?** Open the event and check the calendar name.
- **Has it been 3 hours?** Only "This Week" updates instantly.
- **"This Week" says "As of" a past time:** the live check couldn't reach Google just then (maybe
  a weak phone signal). It still shows the most recent copy. Reload to try again.
- **A cancelled event disappeared entirely?** It was probably deleted. Re-create it with
  `CANCELLED:` at the start of the title.
- Still stuck? Contact the website volunteer.

## Please don't

- Make the chapel calendar **private**. The website would stop showing events.
- Put private information (phone numbers of families, children's names) in event titles or
  descriptions. Everything on the chapel calendar is **public**.
