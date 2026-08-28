/**
 * The inventions deck: well-known inventions, ranked by when they first appeared.
 *
 * Fields
 *   id        stable slug, prefixed `inv-` so it can never collide with another deck's ids
 *             in the "no repeat this game" tracking
 *   name      the invention, as people say it out loud
 *   year      year first invented / publicly demonstrated
 *   inventor  credited inventor(s), shown as the subtitle
 *   fame      1-5, how likely a non-enthusiast is to recognise it
 *
 * Years are widely-published historical record, not the kind of figure that needs a
 * `verified` spot-check convention (see shared/decks/cars.js) — these don't change. A few
 * (steam engine, lightbulb, telephone, television) have real priority disputes between
 * competing inventors; the year used here is the one most commonly cited as "first
 * appeared" for the credited inventor, matching how these are taught, not a claim that no
 * earlier prototype ever existed anywhere.
 */

export const INVENTIONS = [
  { id: 'inv-printingpress', name: 'Printing press', year: 1440, inventor: 'Johannes Gutenberg', fame: 4 },
  { id: 'inv-telescope', name: 'Telescope', year: 1608, inventor: 'Hans Lippershey', fame: 3 },
  { id: 'inv-steamengine', name: 'Steam engine', year: 1712, inventor: 'Thomas Newcomen', fame: 3 },
  { id: 'inv-lightningrod', name: 'Lightning rod', year: 1752, inventor: 'Benjamin Franklin', fame: 3 },
  { id: 'inv-photography', name: 'Photography', year: 1839, inventor: 'Louis Daguerre', fame: 3 },
  { id: 'inv-telephone', name: 'Telephone', year: 1876, inventor: 'Alexander Graham Bell', fame: 5 },
  { id: 'inv-lightbulb', name: 'Lightbulb', year: 1879, inventor: 'Thomas Edison', fame: 5 },
  { id: 'inv-automobile', name: 'Automobile', year: 1886, inventor: 'Karl Benz', fame: 5 },
  { id: 'inv-radio', name: 'Radio', year: 1895, inventor: 'Guglielmo Marconi', fame: 4 },
  { id: 'inv-airplane', name: 'Airplane', year: 1903, inventor: 'Wright brothers', fame: 5 },
  { id: 'inv-television', name: 'Television', year: 1927, inventor: 'Philo Farnsworth', fame: 5 },
  { id: 'inv-penicillin', name: 'Penicillin', year: 1928, inventor: 'Alexander Fleming', fame: 4 },
  { id: 'inv-ballpointpen', name: 'Ballpoint pen', year: 1938, inventor: 'László Bíró', fame: 3 },
  { id: 'inv-microwaveoven', name: 'Microwave oven', year: 1945, inventor: 'Percy Spencer', fame: 4 },
  { id: 'inv-transistor', name: 'Transistor', year: 1947, inventor: 'Bardeen, Brattain & Shockley', fame: 3 },
  { id: 'inv-creditcard', name: 'Credit card', year: 1950, inventor: 'Diners Club', fame: 3 },
  { id: 'inv-barcode', name: 'Barcode', year: 1952, inventor: 'Woodland & Silver', fame: 2 },
  { id: 'inv-videogame', name: 'Video game', year: 1958, inventor: 'William Higinbotham', fame: 3 },
  { id: 'inv-internet', name: 'Internet (ARPANET)', year: 1969, inventor: 'ARPA researchers', fame: 5 },
  { id: 'inv-mobilephone', name: 'Mobile phone', year: 1973, inventor: 'Martin Cooper', fame: 4 },
  { id: 'inv-personalcomputer', name: 'Personal computer', year: 1975, inventor: 'MITS (Altair 8800)', fame: 4 },
  { id: 'inv-compactdisc', name: 'Compact disc', year: 1982, inventor: 'Sony & Philips', fame: 4 },
  { id: 'inv-worldwideweb', name: 'World Wide Web', year: 1989, inventor: 'Tim Berners-Lee', fame: 5 },
  { id: 'inv-gps', name: 'GPS', year: 1995, inventor: 'US Department of Defense', fame: 4 },
];

const display = (i) => ({ title: i.name, subtitle: i.inventor, meta: i.year });

const CATEGORIES = [
  {
    key: 'year',
    axis: 'inventionYear',
    dir: 'asc',
    value: (i) => i.year,
    title: 'Oldest invention first',
    prompt: 'Whichever invention came first goes at the top',
    statLabel: 'Invented',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
    note: 'Year the invention was first created or publicly demonstrated.',
  },
];

export const inventions = {
  key: 'inventions',
  name: 'Inventions',
  items: INVENTIONS,
  display,
  categories: CATEGORIES.map((c) => ({
    ...c,
    fqKey: `inventions:${c.key}`,
    deckKey: 'inventions',
    deckName: 'Inventions',
    pool: INVENTIONS,
    display,
  })),
};

export default inventions;
