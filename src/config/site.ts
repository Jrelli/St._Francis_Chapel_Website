/**
 * Site-wide facts: the ONE place to change the chapel's name, address, links, etc.
 *
 * Every fact has:
 *   value      what the site shows. Leave it '' (empty) to hide that item everywhere.
 *   confirmed  set to true once someone responsible has checked it.
 *   todo       optional note on what still needs checking.
 *
 * In `npm run dev`, unconfirmed values get a dotted outline so they're easy to spot.
 * Production builds never show that marker. The build log lists unconfirmed facts.
 * Keep CONTENT_TO_CONFIRM.md in sync when you change a `confirmed` flag.
 */

export interface Fact<T = string> {
  value: T;
  confirmed: boolean;
  todo?: string | undefined;
}

const fact = <T>(value: T, confirmed: boolean, todo?: string): Fact<T> => ({
  value,
  confirmed,
  todo,
});

export const site = {
  name: fact('Saint Francis Mission Chapel', true, 'Matches the chapel seal'),
  shortName: fact('Saint Francis Mission Chapel', true, 'Owner is also open to "SFMC"'),

  /** Production address; used for canonical URLs and the sitemap. Apex is canonical. */
  url: fact('https://saintfrancischapel.com', true),

  taglineLatin: fact('Ave Domina, sancta Regina, sancta Dei genetrix Maria!', true),
  tagline: fact('The fullness of traditional Catholic life in Tennessee', true),
  description: fact(
    'A traditional Latin Mass mission chapel in Dandridge, Tennessee, affiliated with the Society of Saint Pius X.',
    false,
    'Reworded 2026-10-27 to match the mission statement ("affiliated with" the SSPX)',
  ),

  /** Each line is shown on its own line. Use [] to hide the address. */
  mailingAddress: fact(['P.O. Box 27', 'New Market, TN 37820'], true),
  /** Google Workspace mailbox (confirmed 2026-10-26). */
  email: fact('office@saintfrancischapel.com', true),
  phone: fact('', true, 'Email only for now (owner, 2026-10-27)'),

  social: {
    facebook: fact('https://www.facebook.com/saintfrancissspx', true),
    youtube: fact('https://www.youtube.com/@saintfrancischapel', true),
  },

  /** Short pitch used on the home page and Chapel Build page. */
  chapelBuildBlurb: fact(
    'On five acres of Tennessee land, we are building a chapel worthy of the Holy Sacrifice of the Mass, to bring the Traditional Latin Mass to East Tennessee permanently.',
    false,
    'Reworded from the Wix draft; confirm acreage and wording',
  ),

  /** Mission secretary: the contact for Mass intentions and donations to the friars. */
  secretary: {
    name: fact('Jennifer Strand', true),
    email: fact('saintfrancismission26@gmail.com', true),
  },
  /** Customary offering for one Mass intention. Leave '' to hide it. */
  massIntentionOffering: fact('$20', true),

  /**
   * The GiveSendGo campaign page, shown on the Donate page. Leave '' to offer checks only.
   * (The owner chose GiveSendGo plus mailed checks over the Stripe link, 2026-10-27.)
   */
  donateUrl: fact('https://www.givesendgo.com/saint-francis-mission-chapel', true),
  checksPayableTo: fact('St. Francis Mission Chapel', true, 'As printed in the newsletter'),

  /**
   * Chapel-build fundraising, shown as a progress bar (home, Chapel Build, Donate).
   * Once sheetCsvUrl is set, each build reads the total from that Google Sheet instead, and
   * `raised`/`asOf` here are ignored. See README → "Fundraising total".
   */
  fundraising: {
    goal: fact(300000, true, 'Owner: reference $300,000 everywhere (2026-10-27)'),
    raised: fact(32300, true, 'From the Nov 1, 2026 newsletter ("$32.3k")'),
    asOf: fact('2026-10-27', true, 'Date the Nov 1 newsletter was sent'),
    sheetCsvUrl: fact('', false, 'Publish the fundraising Google Sheet to the web as CSV'),
  },

  /** The legal nonprofit that operates the chapel (DBA "Saint Francis Mission Chapel"). */
  nonprofit: {
    name: fact('Una Voce Tennessee', true),
    ein: fact('42-3384159', true),
    physicalAddress: fact(['4719 Old Knoxville Hwy', 'Rockford, TN 37853'], true),
  },

  calendar: {
    /** Public Google Calendar that holds Masses, events and exceptions. */
    id: fact(
      'c_ce9ab84bbff904cd6d26b96e8b6fc1c48fa98fd514c43d4c90b5f1001c726c6d@group.calendar.google.com',
      false,
      'Confirm this is the calendar editors will maintain, and that it is public',
    ),
    timeZone: fact('America/New_York', true, 'Eastern Time: Jefferson County, TN'),
  },

  bulletins: {
    /** Google Drive folder ID (the long code at the end of the folder's share link). */
    driveFolderId: fact('', false, 'Folder not created/shared yet'),
  },

  organizations: {
    capuchins: fact('https://www.porziuncolaproject.com/', true),
    sspx: fact('https://sspx.org/', true),
  },
};

export type Site = typeof site;
