/**
 * The FIFA World Cup deck: two pools sharing one file, 1998 onward.
 *
 * WORLDCUP_EDITIONS — one entry per tournament, used by the chronological "year won"
 * category (oldest/newest style, like shared/decks/cars.js's age categories). Only 7
 * editions exist in this range, so `minEligible` overrides the usual 16-item floor (see
 * scripts/verify-data.js) — a handful of officially recorded years needs no additional
 * spread, they're already all distinct.
 *
 * WORLDCUP_FINALISTS — four entries per tournament (Champion/Runner-up/3rd/4th, from the
 * actual third-place playoff), used by the "closest to winning" category. That category
 * groups by `year` (see `groupKey` in shared/rounds.js) so a round only ever mixes teams
 * from the SAME tournament — this is what keeps every round's four places distinct
 * (1/2/3/4) with no ties, which a stage like "lost in the quarterfinals" could not
 * guarantee (multiple teams share that stage).
 *
 * Results are well-established historical record, not the kind of figure that needs a
 * `verified` spot-check convention (see shared/decks/cars.js) — these don't change.
 */

export const WORLDCUP_EDITIONS = [
  { id: 'wc-edition-1998', year: 1998, host: 'France', championTeam: 'France', fame: 5 },
  { id: 'wc-edition-2002', year: 2002, host: 'South Korea / Japan', championTeam: 'Brazil', fame: 4 },
  { id: 'wc-edition-2006', year: 2006, host: 'Germany', championTeam: 'Italy', fame: 5 },
  { id: 'wc-edition-2010', year: 2010, host: 'South Africa', championTeam: 'Spain', fame: 5 },
  { id: 'wc-edition-2014', year: 2014, host: 'Brazil', championTeam: 'Germany', fame: 5 },
  { id: 'wc-edition-2018', year: 2018, host: 'Russia', championTeam: 'France', fame: 5 },
  { id: 'wc-edition-2022', year: 2022, host: 'Qatar', championTeam: 'Argentina', fame: 5 },
];

const finalFour = (year, host, fame, [champion, runnerUp, third, fourth]) => [
  { id: `wc-finalist-${year}-1`, team: champion, year, host, place: 1, fame },
  { id: `wc-finalist-${year}-2`, team: runnerUp, year, host, place: 2, fame },
  { id: `wc-finalist-${year}-3`, team: third, year, host, place: 3, fame },
  { id: `wc-finalist-${year}-4`, team: fourth, year, host, place: 4, fame },
];

export const WORLDCUP_FINALISTS = [
  ...finalFour(1998, 'France', 5, ['France', 'Brazil', 'Croatia', 'Netherlands']),
  ...finalFour(2002, 'South Korea / Japan', 4, ['Brazil', 'Germany', 'Turkey', 'South Korea']),
  ...finalFour(2006, 'Germany', 5, ['Italy', 'France', 'Germany', 'Portugal']),
  ...finalFour(2010, 'South Africa', 5, ['Spain', 'Netherlands', 'Germany', 'Uruguay']),
  ...finalFour(2014, 'Brazil', 5, ['Germany', 'Argentina', 'Netherlands', 'Brazil']),
  ...finalFour(2018, 'Russia', 5, ['France', 'Croatia', 'Belgium', 'England']),
  ...finalFour(2022, 'Qatar', 5, ['Argentina', 'France', 'Croatia', 'Morocco']),
];

const editionDisplay = (e) => ({ title: e.championTeam, subtitle: e.host, meta: e.year });
const finalistDisplay = (f) => ({ title: f.team, subtitle: `${f.year} World Cup`, meta: null });

const CATEGORIES = [
  {
    key: 'yearwon',
    axis: 'year',
    dir: 'asc',
    value: (e) => e.year,
    title: 'Earliest World Cup win first',
    prompt: 'Whichever World Cup happened first goes at the top',
    statLabel: 'Year won',
    format: (v) => String(v),
    minAbsGap: 2,
    minEligible: 6,
    hidesMeta: true,
    pool: WORLDCUP_EDITIONS,
    display: editionDisplay,
    note: 'Ranked by the year that World Cup was played.',
  },
  {
    key: 'finalfour',
    axis: 'fifaPlace',
    dir: 'asc',
    value: (f) => f.place,
    groupKey: (f) => f.year,
    title: 'Closest to winning first',
    prompt: 'From that World Cup: champion down to 4th place',
    statLabel: 'Final placing',
    format: (v) => ['Champion', 'Runner-up', '3rd place', '4th place'][v - 1],
    minAbsGap: 1,
    pool: WORLDCUP_FINALISTS,
    display: finalistDisplay,
    note: 'The actual Final Four of one World Cup: champion, runner-up, 3rd and 4th place.',
  },
];

export const fifa = {
  key: 'fifa',
  name: 'FIFA World Cup',
  items: WORLDCUP_EDITIONS,
  display: editionDisplay,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `fifa:${c.key}`, deckKey: 'fifa', deckName: 'FIFA World Cup' })),
};

export default fifa;
