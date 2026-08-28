/**
 * The film & music deck: two pools sharing one file. Most categories read only one of them
 * (movies for box office/budget/runtime, albums for sales), but the three "release year"
 * categories also include a third, `MOVIES_AND_ALBUMS`, that mixes both pools together so a
 * round can ask "which of these came out first" across movies and albums at once — ids are
 * prefixed `movie-`/`album-` so they never collide when combined.
 *
 * Movies and albums are limited to well-known titles only, per the game's design intent —
 * an obscure box-office figure would be an unguessable trivia question, not a ranking
 * round anyone can reason about.
 *
 * Figures are widely-published, not independently spot-checked against a single
 * authoritative source the way the car pool is (see the `verified` convention in
 * shared/decks/cars.js) — good enough for gameplay, not a box-office database. Box office
 * totals are lifetime worldwide gross, nominal (not inflation-adjusted).
 */

export const MOVIES = [
  { id: 'movie-titanic-1997', title: 'Titanic', studio: 'Paramount', releaseYear: 1997, boxOfficeUsdM: 2264, budgetUsdM: 200, runtimeMin: 195, fame: 5 },
  { id: 'movie-avatar-2009', title: 'Avatar', studio: '20th Century Fox', releaseYear: 2009, boxOfficeUsdM: 2923, budgetUsdM: 237, runtimeMin: 162, fame: 5 },
  { id: 'movie-avengers-endgame-2019', title: 'Avengers: Endgame', studio: 'Marvel Studios', releaseYear: 2019, boxOfficeUsdM: 2799, budgetUsdM: 356, runtimeMin: 181, fame: 5 },
  { id: 'movie-star-wars-force-awakens-2015', title: 'Star Wars: The Force Awakens', studio: 'Lucasfilm', releaseYear: 2015, boxOfficeUsdM: 2071, budgetUsdM: 245, runtimeMin: 138, fame: 5 },
  { id: 'movie-avengers-infinity-war-2018', title: 'Avengers: Infinity War', studio: 'Marvel Studios', releaseYear: 2018, boxOfficeUsdM: 2048, budgetUsdM: 316, runtimeMin: 149, fame: 5 },
  { id: 'movie-jurassic-world-2015', title: 'Jurassic World', studio: 'Universal', releaseYear: 2015, boxOfficeUsdM: 1671, budgetUsdM: 150, runtimeMin: 124, fame: 4 },
  { id: 'movie-lion-king-2019', title: 'The Lion King', studio: 'Walt Disney', releaseYear: 2019, boxOfficeUsdM: 1663, budgetUsdM: 260, runtimeMin: 118, fame: 4 },
  { id: 'movie-frozen-2-2019', title: 'Frozen II', studio: 'Walt Disney', releaseYear: 2019, boxOfficeUsdM: 1453, budgetUsdM: 150, runtimeMin: 103, fame: 4 },
  { id: 'movie-fast-furious-7-2015', title: 'Furious 7', studio: 'Universal', releaseYear: 2015, boxOfficeUsdM: 1516, budgetUsdM: 190, runtimeMin: 137, fame: 4 },
  { id: 'movie-avengers-age-of-ultron-2015', title: 'Avengers: Age of Ultron', studio: 'Marvel Studios', releaseYear: 2015, boxOfficeUsdM: 1405, budgetUsdM: 365, runtimeMin: 141, fame: 4 },
  { id: 'movie-dark-knight-2008', title: 'The Dark Knight', studio: 'Warner Bros.', releaseYear: 2008, boxOfficeUsdM: 1006, budgetUsdM: 185, runtimeMin: 152, fame: 5 },
  { id: 'movie-dark-knight-rises-2012', title: 'The Dark Knight Rises', studio: 'Warner Bros.', releaseYear: 2012, boxOfficeUsdM: 1085, budgetUsdM: 250, runtimeMin: 165, fame: 4 },
  { id: 'movie-inception-2010', title: 'Inception', studio: 'Warner Bros.', releaseYear: 2010, boxOfficeUsdM: 839, budgetUsdM: 160, runtimeMin: 148, fame: 5 },
  { id: 'movie-interstellar-2014', title: 'Interstellar', studio: 'Paramount', releaseYear: 2014, boxOfficeUsdM: 758, budgetUsdM: 165, runtimeMin: 169, fame: 5 },
  { id: 'movie-lotr-return-king-2003', title: 'The Lord of the Rings: The Return of the King', studio: 'New Line Cinema', releaseYear: 2003, boxOfficeUsdM: 1146, budgetUsdM: 94, runtimeMin: 201, fame: 5 },
  { id: 'movie-lotr-fellowship-2001', title: 'The Lord of the Rings: The Fellowship of the Ring', studio: 'New Line Cinema', releaseYear: 2001, boxOfficeUsdM: 898, budgetUsdM: 93, runtimeMin: 178, fame: 5 },
  { id: 'movie-pirates-dead-mans-chest-2006', title: "Pirates of the Caribbean: Dead Man's Chest", studio: 'Walt Disney', releaseYear: 2006, boxOfficeUsdM: 1066, budgetUsdM: 225, runtimeMin: 151, fame: 4 },
  { id: 'movie-jurassic-park-1993', title: 'Jurassic Park', studio: 'Universal', releaseYear: 1993, boxOfficeUsdM: 1109, budgetUsdM: 63, runtimeMin: 127, fame: 5 },
  { id: 'movie-star-wars-1977', title: 'Star Wars', studio: 'Lucasfilm', releaseYear: 1977, boxOfficeUsdM: 775, budgetUsdM: 11, runtimeMin: 121, fame: 5 },
  { id: 'movie-et-1982', title: 'E.T. the Extra-Terrestrial', studio: 'Universal', releaseYear: 1982, boxOfficeUsdM: 793, budgetUsdM: 10.5, runtimeMin: 115, fame: 5 },
  { id: 'movie-frozen-2013', title: 'Frozen', studio: 'Walt Disney', releaseYear: 2013, boxOfficeUsdM: 1290, budgetUsdM: 150, runtimeMin: 102, fame: 5 },
  { id: 'movie-incredibles-2-2018', title: 'Incredibles 2', studio: 'Pixar', releaseYear: 2018, boxOfficeUsdM: 1243, budgetUsdM: 200, runtimeMin: 118, fame: 4 },
  { id: 'movie-minions-2015', title: 'Minions', studio: 'Universal', releaseYear: 2015, boxOfficeUsdM: 1160, budgetUsdM: 74, runtimeMin: 91, fame: 4 },
  { id: 'movie-toy-story-4-2019', title: 'Toy Story 4', studio: 'Pixar', releaseYear: 2019, boxOfficeUsdM: 1073, budgetUsdM: 200, runtimeMin: 100, fame: 4 },
  { id: 'movie-joker-2019', title: 'Joker', studio: 'Warner Bros.', releaseYear: 2019, boxOfficeUsdM: 1074, budgetUsdM: 55, runtimeMin: 122, fame: 4 },
  { id: 'movie-gladiator-2000', title: 'Gladiator', studio: 'Universal', releaseYear: 2000, boxOfficeUsdM: 465, budgetUsdM: 103, runtimeMin: 155, fame: 4 },
  { id: 'movie-godfather-1972', title: 'The Godfather', studio: 'Paramount', releaseYear: 1972, boxOfficeUsdM: 250, budgetUsdM: 6, runtimeMin: 175, fame: 5 },
  { id: 'movie-pulp-fiction-1994', title: 'Pulp Fiction', studio: 'Miramax', releaseYear: 1994, boxOfficeUsdM: 214, budgetUsdM: 8, runtimeMin: 154, fame: 4 },
  { id: 'movie-forrest-gump-1994', title: 'Forrest Gump', studio: 'Paramount', releaseYear: 1994, boxOfficeUsdM: 678, budgetUsdM: 55, runtimeMin: 142, fame: 5 },
  { id: 'movie-barbie-2023', title: 'Barbie', studio: 'Warner Bros.', releaseYear: 2023, boxOfficeUsdM: 1447, budgetUsdM: 145, runtimeMin: 114, fame: 5 },
  { id: 'movie-oppenheimer-2023', title: 'Oppenheimer', studio: 'Universal', releaseYear: 2023, boxOfficeUsdM: 976, budgetUsdM: 100, runtimeMin: 180, fame: 5 },
];

export const ALBUMS = [
  { id: 'album-thriller-1982', title: 'Thriller', artist: 'Michael Jackson', releaseYear: 1982, salesMillions: 70, fame: 5 },
  { id: 'album-back-in-black-1980', title: 'Back in Black', artist: 'AC/DC', releaseYear: 1980, salesMillions: 58, fame: 4 },
  { id: 'album-dark-side-of-the-moon-1973', title: 'The Dark Side of the Moon', artist: 'Pink Floyd', releaseYear: 1973, salesMillions: 50, fame: 4 },
  { id: 'album-bodyguard-1992', title: 'The Bodyguard (Soundtrack)', artist: 'Whitney Houston', releaseYear: 1992, salesMillions: 46, fame: 3 },
  { id: 'album-bat-out-of-hell-1977', title: 'Bat Out of Hell', artist: 'Meat Loaf', releaseYear: 1977, salesMillions: 43, fame: 3 },
  { id: 'album-their-greatest-hits-1976', title: 'Their Greatest Hits (1971–1975)', artist: 'Eagles', releaseYear: 1976, salesMillions: 40, fame: 4 },
  { id: 'album-saturday-night-fever-1977', title: 'Saturday Night Fever (Soundtrack)', artist: 'Bee Gees', releaseYear: 1977, salesMillions: 37, fame: 3 },
  { id: 'album-rumours-1977', title: 'Rumours', artist: 'Fleetwood Mac', releaseYear: 1977, salesMillions: 34, fame: 4 },
  { id: 'album-come-on-over-1997', title: 'Come On Over', artist: 'Shania Twain', releaseYear: 1997, salesMillions: 31, fame: 3 },
  { id: 'album-appetite-for-destruction-1987', title: 'Appetite for Destruction', artist: "Guns N' Roses", releaseYear: 1987, salesMillions: 28, fame: 4 },
  { id: 'album-jagged-little-pill-1995', title: 'Jagged Little Pill', artist: 'Alanis Morissette', releaseYear: 1995, salesMillions: 26, fame: 3 },
  { id: 'album-21-2011', title: '21', artist: 'Adele', releaseYear: 2011, salesMillions: 24, fame: 4 },
  { id: 'album-hybrid-theory-2000', title: 'Hybrid Theory', artist: 'Linkin Park', releaseYear: 2000, salesMillions: 22, fame: 4 },
  { id: 'album-abbey-road-1969', title: 'Abbey Road', artist: 'The Beatles', releaseYear: 1969, salesMillions: 20, fame: 4 },
  { id: 'album-purple-rain-1984', title: 'Purple Rain', artist: 'Prince', releaseYear: 1984, salesMillions: 18, fame: 3 },
  { id: 'album-1-2000', title: '1', artist: 'The Beatles', releaseYear: 2000, salesMillions: 16, fame: 4 },
  { id: 'album-spice-1996', title: 'Spice', artist: 'Spice Girls', releaseYear: 1996, salesMillions: 14, fame: 4 },
  { id: 'album-25-2015', title: '25', artist: 'Adele', releaseYear: 2015, salesMillions: 12, fame: 4 },
  { id: 'album-metallica-black-1991', title: 'Metallica (The Black Album)', artist: 'Metallica', releaseYear: 1991, salesMillions: 10, fame: 4 },
  { id: 'album-legend-1984', title: 'Legend', artist: 'Bob Marley & The Wailers', releaseYear: 1984, salesMillions: 8, fame: 3 },
];

const money = (v) => `$${v.toLocaleString('en-US')}M`;

const movieDisplay = (m) => ({ title: m.title, subtitle: m.studio, meta: m.releaseYear });
const albumDisplay = (a) => ({ title: a.title, subtitle: a.artist, meta: a.releaseYear });
// A movie and an album never share an `artist`/`studio` field, so this picks whichever one
// the item actually has to label it correctly in a mixed movies+albums lineup.
const filmMusicDisplay = (item) => ({ title: item.title, subtitle: item.studio ?? item.artist, meta: item.releaseYear });

const MOVIES_AND_ALBUMS = [...MOVIES, ...ALBUMS];

const CATEGORIES = [
  {
    key: 'boxoffice',
    axis: 'boxOffice',
    dir: 'desc',
    value: (m) => m.boxOfficeUsdM,
    title: 'Highest box office first',
    prompt: 'Highest lifetime box office at the top',
    statLabel: 'Box office',
    format: money,
    minRelGap: 0.12,
    pool: MOVIES,
    display: movieDisplay,
    note: 'Lifetime worldwide gross, not inflation-adjusted.',
  },
  {
    key: 'budget',
    axis: 'budget',
    dir: 'desc',
    value: (m) => m.budgetUsdM,
    title: 'Biggest budget first',
    prompt: 'Highest production budget at the top',
    statLabel: 'Budget',
    format: money,
    minRelGap: 0.15,
    pool: MOVIES,
    display: movieDisplay,
    note: 'Reported production budget, not inflation-adjusted.',
  },
  {
    key: 'runtime',
    axis: 'runtime',
    dir: 'desc',
    value: (m) => m.runtimeMin,
    title: 'Longest runtime first',
    prompt: 'Longest runtime at the top',
    statLabel: 'Runtime',
    format: (v) => `${v} min`,
    minRelGap: 0.1,
    pool: MOVIES,
    display: movieDisplay,
  },
  {
    key: 'albumsales',
    axis: 'albumSales',
    dir: 'desc',
    value: (a) => a.salesMillions,
    title: 'Best-selling album first',
    prompt: 'Most copies sold at the top',
    statLabel: 'Album sales',
    format: (v) => `${v}M copies`,
    minRelGap: 0.15,
    pool: ALBUMS,
    display: albumDisplay,
    note: 'Estimated career sales of the album, worldwide.',
  },
  {
    key: 'movieyear',
    axis: 'movieYear',
    dir: 'asc',
    value: (m) => m.releaseYear,
    title: 'Oldest movie first',
    prompt: 'Whichever movie came out first goes at the top',
    statLabel: 'Released',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
    pool: MOVIES,
    display: movieDisplay,
    note: 'Ranked by theatrical release year.',
  },
  {
    key: 'albumyear',
    axis: 'albumYear',
    dir: 'asc',
    value: (a) => a.releaseYear,
    title: 'Oldest album first',
    prompt: 'Whichever album came out first goes at the top',
    statLabel: 'Released',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
    pool: ALBUMS,
    display: albumDisplay,
    note: 'Ranked by original release year.',
  },
  {
    key: 'filmmusicyear',
    axis: 'filmMusicYear',
    dir: 'asc',
    value: (item) => item.releaseYear,
    title: 'Oldest movie or album first',
    prompt: 'Whichever movie or album came out first goes at the top',
    statLabel: 'Released',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
    pool: MOVIES_AND_ALBUMS,
    display: filmMusicDisplay,
    note: 'Movies and albums mixed together, ranked by release year.',
  },
];

export const filmMusic = {
  key: 'filmMusic',
  name: 'Film & Music',
  items: MOVIES, // default pool; each category above overrides with its own
  display: movieDisplay,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `filmMusic:${c.key}`, deckKey: 'filmMusic', deckName: 'Film & Music' })),
};

export default filmMusic;
