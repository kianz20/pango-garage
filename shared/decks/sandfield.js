/**
 * The Sandfield deck: when each person joined the company, per LinkedIn.
 *
 * A small fixed roster (16 people), not a "pick a famous subset" pool like the other decks
 * — everyone is equally eligible every round, so `fame` is uniformly 5 and `minEligible`
 * is set to the pool's actual number of distinct start dates rather than the usual 16-item
 * floor (see shared/decks/fifa.js for the same pattern with a small, fixed real-world set).
 *
 * Fields
 *   id           stable slug, prefixed `sandfield-`
 *   name         first name, as given
 *   startYear    year they started
 *   startMonth   1-12 month they started, or 0 if LinkedIn only shows a year
 *
 * Brent's LinkedIn profile only shows a year, not a month — he sorts as if he joined in
 * January of that year, which is safe here because no one else in the pool shares his year,
 * and the reveal displays just the year for him so nothing inaccurate is shown to players.
 */

export const SANDFIELD_PEOPLE = [
  { id: 'sandfield-jesse', name: 'Jesse', startYear: 2014, startMonth: 4 },
  { id: 'sandfield-andy', name: 'Andy', startYear: 2021, startMonth: 10 },
  { id: 'sandfield-anthony', name: 'Anthony', startYear: 2025, startMonth: 5 },
  { id: 'sandfield-bill', name: 'Bill', startYear: 2023, startMonth: 11 },
  { id: 'sandfield-brent', name: 'Brent', startYear: 1989, startMonth: 0 },
  { id: 'sandfield-cj', name: 'CJ', startYear: 2017, startMonth: 11 },
  { id: 'sandfield-emma', name: 'Emma', startYear: 2023, startMonth: 6 },
  { id: 'sandfield-harpreet', name: 'Harpreet', startYear: 2021, startMonth: 10 },
  { id: 'sandfield-janes', name: 'Janes', startYear: 2025, startMonth: 6 },
  { id: 'sandfield-kian', name: 'Kian', startYear: 2025, startMonth: 6 },
  { id: 'sandfield-luka', name: 'Luka', startYear: 2018, startMonth: 11 },
  { id: 'sandfield-richard', name: 'Richard', startYear: 2015, startMonth: 5 },
  { id: 'sandfield-timothy', name: 'Timothy', startYear: 2026, startMonth: 1 },
  { id: 'sandfield-tony', name: 'Tony', startYear: 2023, startMonth: 11 },
  { id: 'sandfield-wayne', name: 'Wayne', startYear: 2001, startMonth: 4 },
  { id: 'sandfield-ying', name: 'Ying', startYear: 2025, startMonth: 9 },
].map((p) => ({ ...p, fame: 5 }));

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const startValue = (p) => p.startYear * 12 + p.startMonth;

const formatStart = (v) => {
  const year = Math.floor(v / 12);
  const month = v - year * 12;
  return month === 0 ? String(year) : `${MONTH_NAMES[month]} ${year}`;
};

const display = (p) => ({ title: p.name, subtitle: null, meta: null });

const CATEGORIES = [
  {
    key: 'started',
    axis: 'sandfieldStart',
    dir: 'asc',
    value: startValue,
    title: 'Who started at Sandfield first',
    prompt: 'Earliest Sandfield start date at the top',
    statLabel: 'Started',
    format: formatStart,
    minAbsGap: 1,
    minEligible: 13,
    hidesMeta: true,
    note: 'Start dates as shown on LinkedIn.',
  },
];

export const sandfield = {
  key: 'sandfield',
  name: 'Sandfield',
  items: SANDFIELD_PEOPLE,
  display,
  categories: CATEGORIES.map((c) => ({
    ...c,
    fqKey: `sandfield:${c.key}`,
    deckKey: 'sandfield',
    deckName: 'Sandfield',
    pool: SANDFIELD_PEOPLE,
    display,
  })),
};

export default sandfield;
