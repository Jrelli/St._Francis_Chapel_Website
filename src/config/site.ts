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
  shortName: fact('St. Francis Chapel', false, 'Confirm preferred short name'),

  /** Production address; used for canonical URLs and the sitemap. Apex is canonical. */
  url: fact('https://saintfrancischapel.com', true),

  taglineLatin: fact('Ave Maria gratia plena Dominus tecum!', false, 'From Wix draft'),
  tagline: fact('The fullness of traditional Catholic life in Tennessee', true),
  description: fact(
    'A traditional Latin Mass mission chapel of the Society of Saint Pius X in New Market, Tennessee.',
    false,
    'Confirm wording, especially how the SSPX relationship should be described',
  ),

  /** Each line is shown on its own line. Use [] to hide the address. */
  mailingAddress: fact(
    ['P.O. Box 27', 'New Market, TN 37820'],
    false,
    'From Wix draft; confirm the P.O. box is current',
  ),
  /** Google Workspace mailbox (confirmed 2026-10-26). */
  email: fact('office@saintfrancischapel.com', true),
  phone: fact('', false, 'No phone number provided yet'),

  social: {
    facebook: fact('https://www.facebook.com/saintfrancissspx', false, 'From Wix draft'),
    youtube: fact('https://www.youtube.com/@saintfrancischapel', false, 'From Wix draft'),
  },

  /** Short pitch used on the home page and Chapel Build page. */
  chapelBuildBlurb: fact(
    'On five acres of Tennessee land, we are building a chapel worthy of the Holy Sacrifice of the Mass, to bring the Traditional Latin Mass to East Tennessee permanently.',
    false,
    'Reworded from the Wix draft; confirm acreage and wording',
  ),

  /** External Stripe donation page. The site never handles payments itself. */
  donateUrl: fact(
    'https://donate.stripe.com/5kQdRa1jLebudSg2gy8Vi01',
    false,
    'From Wix draft; confirm the Stripe page belongs to the chapel and is live',
  ),

  calendar: {
    /** Public Google Calendar that holds Masses, events and exceptions. */
    id: fact(
      'c_ce9ab84bbff904cd6d26b96e8b6fc1c48fa98fd514c43d4c90b5f1001c726c6d@group.calendar.google.com',
      false,
      'Confirm this is the calendar editors will maintain, and that it is public',
    ),
    timeZone: fact('America/Chicago', true),
  },

  bulletins: {
    /** Google Drive folder ID (the long code at the end of the folder's share link). */
    driveFolderId: fact('', false, 'Folder not created/shared yet (Phase 2)'),
  },

  organizations: {
    capuchins: fact('https://www.porziuncolaproject.com/', false, 'Confirm link and description'),
    sspx: fact('https://sspx.org/', false, 'Confirm which SSPX site to link (US District?)'),
    homeschoolContact: fact('', false, 'Name and email/phone of the homeschool contact person'),
  },
};

export type Site = typeof site;
