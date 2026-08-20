/**
 * The Olympics deck, 1996 onward: one pool, three categories.
 *
 * Each item is one country's medal count at one specific Summer Games, and every category
 * groups by `year` (see `groupKey` in shared/rounds.js) — a round only ever compares
 * countries from the SAME Olympics, never "USA's golds at Atlanta 1996" against "China's
 * at Paris 2024". That mirrors shared/decks/fifa.js's Final Four grouping, for the same
 * reason: a fair ranking question has to hold the event constant and only vary the entrant.
 *
 * Figures are widely-published official medal-table counts, not independently
 * spot-checked against a single authoritative source the way the car pool is (see the
 * `verified` convention in shared/decks/cars.js) — good enough for gameplay.
 */

export const OLYMPIC_RESULTS = [
  // 1996 Atlanta
  { id: 'olympics-1996-usa', year: 1996, host: 'Atlanta', country: 'United States', gold: 44, silver: 32, bronze: 25, fame: 5 },
  { id: 'olympics-1996-rus', year: 1996, host: 'Atlanta', country: 'Russia', gold: 26, silver: 21, bronze: 16, fame: 3 },
  { id: 'olympics-1996-ger', year: 1996, host: 'Atlanta', country: 'Germany', gold: 20, silver: 18, bronze: 27, fame: 4 },
  { id: 'olympics-1996-chn', year: 1996, host: 'Atlanta', country: 'China', gold: 16, silver: 22, bronze: 12, fame: 4 },
  { id: 'olympics-1996-fra', year: 1996, host: 'Atlanta', country: 'France', gold: 15, silver: 7, bronze: 15, fame: 3 },
  { id: 'olympics-1996-ita', year: 1996, host: 'Atlanta', country: 'Italy', gold: 13, silver: 10, bronze: 12, fame: 3 },
  { id: 'olympics-1996-aus', year: 1996, host: 'Atlanta', country: 'Australia', gold: 9, silver: 9, bronze: 23, fame: 4 },
  { id: 'olympics-1996-cub', year: 1996, host: 'Atlanta', country: 'Cuba', gold: 9, silver: 8, bronze: 8, fame: 2 },
  { id: 'olympics-1996-nzl', year: 1996, host: 'Atlanta', country: 'New Zealand', gold: 3, silver: 2, bronze: 1, fame: 3 },

  // 2000 Sydney
  { id: 'olympics-2000-usa', year: 2000, host: 'Sydney', country: 'United States', gold: 37, silver: 24, bronze: 32, fame: 5 },
  { id: 'olympics-2000-rus', year: 2000, host: 'Sydney', country: 'Russia', gold: 32, silver: 28, bronze: 29, fame: 3 },
  { id: 'olympics-2000-chn', year: 2000, host: 'Sydney', country: 'China', gold: 28, silver: 16, bronze: 14, fame: 4 },
  { id: 'olympics-2000-aus', year: 2000, host: 'Sydney', country: 'Australia', gold: 16, silver: 25, bronze: 17, fame: 4 },
  { id: 'olympics-2000-ger', year: 2000, host: 'Sydney', country: 'Germany', gold: 13, silver: 17, bronze: 26, fame: 3 },
  { id: 'olympics-2000-fra', year: 2000, host: 'Sydney', country: 'France', gold: 13, silver: 14, bronze: 11, fame: 3 },
  { id: 'olympics-2000-ita', year: 2000, host: 'Sydney', country: 'Italy', gold: 13, silver: 8, bronze: 13, fame: 3 },
  { id: 'olympics-2000-ned', year: 2000, host: 'Sydney', country: 'Netherlands', gold: 12, silver: 9, bronze: 4, fame: 3 },
  { id: 'olympics-2000-nzl', year: 2000, host: 'Sydney', country: 'New Zealand', gold: 1, silver: 0, bronze: 3, fame: 3 },

  // 2004 Athens
  { id: 'olympics-2004-usa', year: 2004, host: 'Athens', country: 'United States', gold: 36, silver: 39, bronze: 26, fame: 5 },
  { id: 'olympics-2004-chn', year: 2004, host: 'Athens', country: 'China', gold: 32, silver: 17, bronze: 14, fame: 4 },
  { id: 'olympics-2004-rus', year: 2004, host: 'Athens', country: 'Russia', gold: 28, silver: 26, bronze: 36, fame: 3 },
  { id: 'olympics-2004-aus', year: 2004, host: 'Athens', country: 'Australia', gold: 17, silver: 16, bronze: 17, fame: 4 },
  { id: 'olympics-2004-jpn', year: 2004, host: 'Athens', country: 'Japan', gold: 16, silver: 9, bronze: 12, fame: 4 },
  { id: 'olympics-2004-ger', year: 2004, host: 'Athens', country: 'Germany', gold: 13, silver: 16, bronze: 20, fame: 3 },
  { id: 'olympics-2004-fra', year: 2004, host: 'Athens', country: 'France', gold: 11, silver: 9, bronze: 13, fame: 3 },
  { id: 'olympics-2004-ita', year: 2004, host: 'Athens', country: 'Italy', gold: 10, silver: 11, bronze: 11, fame: 3 },
  { id: 'olympics-2004-nzl', year: 2004, host: 'Athens', country: 'New Zealand', gold: 3, silver: 2, bronze: 0, fame: 3 },

  // 2008 Beijing
  { id: 'olympics-2008-chn', year: 2008, host: 'Beijing', country: 'China', gold: 48, silver: 22, bronze: 30, fame: 5 },
  { id: 'olympics-2008-usa', year: 2008, host: 'Beijing', country: 'United States', gold: 36, silver: 39, bronze: 37, fame: 5 },
  { id: 'olympics-2008-rus', year: 2008, host: 'Beijing', country: 'Russia', gold: 24, silver: 13, bronze: 23, fame: 3 },
  { id: 'olympics-2008-gbr', year: 2008, host: 'Beijing', country: 'Great Britain', gold: 19, silver: 13, bronze: 19, fame: 4 },
  { id: 'olympics-2008-ger', year: 2008, host: 'Beijing', country: 'Germany', gold: 16, silver: 11, bronze: 14, fame: 3 },
  { id: 'olympics-2008-aus', year: 2008, host: 'Beijing', country: 'Australia', gold: 14, silver: 15, bronze: 17, fame: 4 },
  { id: 'olympics-2008-kor', year: 2008, host: 'Beijing', country: 'South Korea', gold: 13, silver: 11, bronze: 8, fame: 3 },
  { id: 'olympics-2008-jpn', year: 2008, host: 'Beijing', country: 'Japan', gold: 9, silver: 8, bronze: 8, fame: 4 },
  { id: 'olympics-2008-nzl', year: 2008, host: 'Beijing', country: 'New Zealand', gold: 3, silver: 2, bronze: 4, fame: 3 },

  // 2012 London
  { id: 'olympics-2012-usa', year: 2012, host: 'London', country: 'United States', gold: 48, silver: 26, bronze: 32, fame: 5 },
  { id: 'olympics-2012-chn', year: 2012, host: 'London', country: 'China', gold: 39, silver: 31, bronze: 22, fame: 4 },
  { id: 'olympics-2012-gbr', year: 2012, host: 'London', country: 'Great Britain', gold: 29, silver: 18, bronze: 18, fame: 5 },
  { id: 'olympics-2012-rus', year: 2012, host: 'London', country: 'Russia', gold: 18, silver: 20, bronze: 26, fame: 3 },
  { id: 'olympics-2012-ger', year: 2012, host: 'London', country: 'Germany', gold: 11, silver: 20, bronze: 13, fame: 3 },
  { id: 'olympics-2012-fra', year: 2012, host: 'London', country: 'France', gold: 11, silver: 11, bronze: 13, fame: 3 },
  { id: 'olympics-2012-kor', year: 2012, host: 'London', country: 'South Korea', gold: 13, silver: 9, bronze: 9, fame: 3 },
  { id: 'olympics-2012-aus', year: 2012, host: 'London', country: 'Australia', gold: 8, silver: 15, bronze: 12, fame: 4 },
  { id: 'olympics-2012-nzl', year: 2012, host: 'London', country: 'New Zealand', gold: 6, silver: 2, bronze: 5, fame: 3 },

  // 2016 Rio
  { id: 'olympics-2016-usa', year: 2016, host: 'Rio de Janeiro', country: 'United States', gold: 46, silver: 37, bronze: 38, fame: 5 },
  { id: 'olympics-2016-gbr', year: 2016, host: 'Rio de Janeiro', country: 'Great Britain', gold: 27, silver: 23, bronze: 17, fame: 5 },
  { id: 'olympics-2016-chn', year: 2016, host: 'Rio de Janeiro', country: 'China', gold: 26, silver: 18, bronze: 26, fame: 4 },
  { id: 'olympics-2016-rus', year: 2016, host: 'Rio de Janeiro', country: 'Russia', gold: 19, silver: 17, bronze: 20, fame: 3 },
  { id: 'olympics-2016-ger', year: 2016, host: 'Rio de Janeiro', country: 'Germany', gold: 17, silver: 10, bronze: 15, fame: 3 },
  { id: 'olympics-2016-jpn', year: 2016, host: 'Rio de Janeiro', country: 'Japan', gold: 12, silver: 8, bronze: 21, fame: 4 },
  { id: 'olympics-2016-fra', year: 2016, host: 'Rio de Janeiro', country: 'France', gold: 10, silver: 18, bronze: 14, fame: 3 },
  { id: 'olympics-2016-kor', year: 2016, host: 'Rio de Janeiro', country: 'South Korea', gold: 9, silver: 3, bronze: 9, fame: 3 },
  { id: 'olympics-2016-nzl', year: 2016, host: 'Rio de Janeiro', country: 'New Zealand', gold: 4, silver: 9, bronze: 5, fame: 3 },

  // 2020 Tokyo (held 2021)
  { id: 'olympics-2020-usa', year: 2020, host: 'Tokyo', country: 'United States', gold: 39, silver: 41, bronze: 33, fame: 5 },
  { id: 'olympics-2020-chn', year: 2020, host: 'Tokyo', country: 'China', gold: 38, silver: 32, bronze: 18, fame: 4 },
  { id: 'olympics-2020-jpn', year: 2020, host: 'Tokyo', country: 'Japan', gold: 27, silver: 14, bronze: 17, fame: 5 },
  { id: 'olympics-2020-gbr', year: 2020, host: 'Tokyo', country: 'Great Britain', gold: 22, silver: 20, bronze: 22, fame: 4 },
  { id: 'olympics-2020-roc', year: 2020, host: 'Tokyo', country: 'ROC (Russia)', gold: 20, silver: 28, bronze: 23, fame: 3 },
  { id: 'olympics-2020-aus', year: 2020, host: 'Tokyo', country: 'Australia', gold: 17, silver: 7, bronze: 22, fame: 4 },
  { id: 'olympics-2020-ned', year: 2020, host: 'Tokyo', country: 'Netherlands', gold: 10, silver: 12, bronze: 14, fame: 3 },
  { id: 'olympics-2020-fra', year: 2020, host: 'Tokyo', country: 'France', gold: 10, silver: 12, bronze: 11, fame: 3 },
  { id: 'olympics-2020-nzl', year: 2020, host: 'Tokyo', country: 'New Zealand', gold: 7, silver: 6, bronze: 7, fame: 3 },

  // 2024 Paris
  { id: 'olympics-2024-usa', year: 2024, host: 'Paris', country: 'United States', gold: 40, silver: 44, bronze: 42, fame: 5 },
  { id: 'olympics-2024-chn', year: 2024, host: 'Paris', country: 'China', gold: 40, silver: 27, bronze: 24, fame: 4 },
  { id: 'olympics-2024-jpn', year: 2024, host: 'Paris', country: 'Japan', gold: 20, silver: 12, bronze: 13, fame: 4 },
  { id: 'olympics-2024-aus', year: 2024, host: 'Paris', country: 'Australia', gold: 18, silver: 19, bronze: 16, fame: 4 },
  { id: 'olympics-2024-fra', year: 2024, host: 'Paris', country: 'France', gold: 16, silver: 26, bronze: 22, fame: 5 },
  { id: 'olympics-2024-gbr', year: 2024, host: 'Paris', country: 'Great Britain', gold: 14, silver: 22, bronze: 29, fame: 4 },
  { id: 'olympics-2024-ned', year: 2024, host: 'Paris', country: 'Netherlands', gold: 15, silver: 7, bronze: 12, fame: 3 },
  { id: 'olympics-2024-kor', year: 2024, host: 'Paris', country: 'South Korea', gold: 13, silver: 9, bronze: 10, fame: 3 },
  { id: 'olympics-2024-nzl', year: 2024, host: 'Paris', country: 'New Zealand', gold: 10, silver: 7, bronze: 3, fame: 3 },
];

const display = (r) => ({ title: r.country, subtitle: `${r.host} ${r.year}`, meta: null });

const CATEGORIES = [
  {
    key: 'gold',
    axis: 'gold',
    dir: 'desc',
    value: (r) => r.gold,
    groupKey: (r) => r.year,
    title: 'Most gold medals first',
    prompt: 'From that Olympics: most gold medals at the top',
    statLabel: 'Gold medals',
    format: (v) => `${v} gold`,
    minRelGap: 0.15,
    pool: OLYMPIC_RESULTS,
    display,
    note: "One Olympic Games' medal table — countries are never compared across different Games.",
  },
  {
    key: 'silver',
    axis: 'silver',
    dir: 'desc',
    value: (r) => r.silver,
    groupKey: (r) => r.year,
    title: 'Most silver medals first',
    prompt: 'From that Olympics: most silver medals at the top',
    statLabel: 'Silver medals',
    format: (v) => `${v} silver`,
    minRelGap: 0.15,
    pool: OLYMPIC_RESULTS,
    display,
    note: "One Olympic Games' medal table — countries are never compared across different Games.",
  },
  {
    key: 'bronze',
    axis: 'bronze',
    dir: 'desc',
    value: (r) => r.bronze,
    groupKey: (r) => r.year,
    title: 'Most bronze medals first',
    prompt: 'From that Olympics: most bronze medals at the top',
    statLabel: 'Bronze medals',
    format: (v) => `${v} bronze`,
    minRelGap: 0.15,
    pool: OLYMPIC_RESULTS,
    display,
    note: "One Olympic Games' medal table — countries are never compared across different Games.",
  },
];

export const olympics = {
  key: 'olympics',
  name: 'Olympics',
  items: OLYMPIC_RESULTS,
  display,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `olympics:${c.key}`, deckKey: 'olympics', deckName: 'Olympics' })),
};

export default olympics;
