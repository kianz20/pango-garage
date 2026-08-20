/**
 * The Rugby World Cup deck, 1995 onward: two pools sharing one file, mirroring
 * shared/decks/fifa.js exactly — same reasoning applies here (see that file's docstring).
 *
 * WORLDCUP_EDITIONS — one entry per tournament, for the chronological "year won" category.
 * WORLDCUP_FINALISTS — Champion/Runner-up/3rd/4th per tournament (Rugby World Cup has
 * always played a real 3rd-place playoff), for the grouped "closest to winning" category.
 */

export const RUGBY_EDITIONS = [
  { id: 'rugbywc-edition-1995', year: 1995, host: 'South Africa', championTeam: 'South Africa', fame: 4 },
  { id: 'rugbywc-edition-1999', year: 1999, host: 'Wales', championTeam: 'Australia', fame: 3 },
  { id: 'rugbywc-edition-2003', year: 2003, host: 'Australia', championTeam: 'England', fame: 4 },
  { id: 'rugbywc-edition-2007', year: 2007, host: 'France', championTeam: 'South Africa', fame: 3 },
  { id: 'rugbywc-edition-2011', year: 2011, host: 'New Zealand', championTeam: 'New Zealand', fame: 4 },
  { id: 'rugbywc-edition-2015', year: 2015, host: 'England', championTeam: 'New Zealand', fame: 4 },
  { id: 'rugbywc-edition-2019', year: 2019, host: 'Japan', championTeam: 'South Africa', fame: 4 },
  { id: 'rugbywc-edition-2023', year: 2023, host: 'France', championTeam: 'South Africa', fame: 5 },
];

const finalFour = (year, host, fame, [champion, runnerUp, third, fourth]) => [
  { id: `rugbywc-finalist-${year}-1`, team: champion, year, host, place: 1, fame },
  { id: `rugbywc-finalist-${year}-2`, team: runnerUp, year, host, place: 2, fame },
  { id: `rugbywc-finalist-${year}-3`, team: third, year, host, place: 3, fame },
  { id: `rugbywc-finalist-${year}-4`, team: fourth, year, host, place: 4, fame },
];

export const RUGBY_FINALISTS = [
  ...finalFour(1995, 'South Africa', 4, ['South Africa', 'New Zealand', 'France', 'England']),
  ...finalFour(1999, 'Wales', 3, ['Australia', 'France', 'South Africa', 'New Zealand']),
  ...finalFour(2003, 'Australia', 4, ['England', 'Australia', 'New Zealand', 'France']),
  ...finalFour(2007, 'France', 3, ['South Africa', 'England', 'Argentina', 'France']),
  ...finalFour(2011, 'New Zealand', 4, ['New Zealand', 'France', 'Australia', 'Wales']),
  ...finalFour(2015, 'England', 4, ['New Zealand', 'Australia', 'South Africa', 'Argentina']),
  ...finalFour(2019, 'Japan', 4, ['South Africa', 'England', 'New Zealand', 'Wales']),
  ...finalFour(2023, 'France', 5, ['South Africa', 'New Zealand', 'Argentina', 'England']),
];

const editionDisplay = (e) => ({ title: e.championTeam, subtitle: e.host, meta: e.year });
const finalistDisplay = (f) => ({ title: f.team, subtitle: `${f.year} Rugby World Cup`, meta: null });

/**
 * South Africa has won this four times (1995, 2007, 2019, 2023) — including two editions
 * both hosted by France (2007, 2023), whose title+subtitle would then display identically
 * with the year hidden, an unanswerable round (same issue as shared/decks/basketball.js
 * used to have before it was removed). Restricting this category to each team's FIRST win
 * in range sidesteps it: every eligible title is then a distinct champion.
 */
const firstWinIds = new Set();
const seenChampions = new Set();
for (const e of RUGBY_EDITIONS) {
  if (seenChampions.has(e.championTeam)) continue;
  seenChampions.add(e.championTeam);
  firstWinIds.add(e.id);
}

const CATEGORIES = [
  {
    key: 'yearwon',
    axis: 'year',
    dir: 'asc',
    value: (e) => e.year,
    eligible: (e) => firstWinIds.has(e.id),
    title: 'Earliest Rugby World Cup win first',
    prompt: "Whichever team's first Rugby World Cup win in this list happened first goes at the top",
    statLabel: 'Year won',
    format: (v) => String(v),
    minAbsGap: 2,
    minEligible: 4,
    hidesMeta: true,
    pool: RUGBY_EDITIONS,
    display: editionDisplay,
    note: "Each team's first Rugby World Cup win since 1995 — repeat winners only count once.",
  },
  {
    key: 'finalfour',
    axis: 'rugbyPlace',
    dir: 'asc',
    value: (f) => f.place,
    groupKey: (f) => f.year,
    title: 'Closest to winning first',
    prompt: 'From that Rugby World Cup: champion down to 4th place',
    statLabel: 'Final placing',
    format: (v) => ['Champion', 'Runner-up', '3rd place', '4th place'][v - 1],
    minAbsGap: 1,
    pool: RUGBY_FINALISTS,
    display: finalistDisplay,
    note: 'The actual Final Four of one Rugby World Cup: champion, runner-up, 3rd and 4th place.',
  },
];

export const rugby = {
  key: 'rugby',
  name: 'Rugby World Cup',
  items: RUGBY_EDITIONS,
  display: editionDisplay,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `rugby:${c.key}`, deckKey: 'rugby', deckName: 'Rugby World Cup' })),
};

export default rugby;
