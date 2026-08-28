/**
 * The video games deck: only games a non-gamer would instantly recognise — the kind of
 * title a 40-year-old parent who's never touched a console still knows by name, not a
 * catalogue of well-regarded-but-niche games. Release years verified against IMDb/Wikipedia.
 *
 * Fields
 *   id           stable slug, prefixed `vg-` so it can never collide with another deck's ids
 *                in the "no repeat this game" tracking
 *   name         the title, as people say it out loud
 *   releaseYear  year the game (or, for a long-running franchise, its most iconic/first
 *                widely-known entry) was first released
 *   fame         always 5 here — every entry in this pool is deliberately mainstream-famous,
 *                unlike other decks where fame varies to control difficulty ramp-up
 */

export const VIDEOGAMES = [
  { id: 'vg-pong', name: 'Pong', releaseYear: 1972, fame: 5 },
  { id: 'vg-spaceinvaders', name: 'Space Invaders', releaseYear: 1978, fame: 5 },
  { id: 'vg-pacman', name: 'Pac-Man', releaseYear: 1980, fame: 5 },
  { id: 'vg-donkeykong', name: 'Donkey Kong', releaseYear: 1981, fame: 5 },
  { id: 'vg-solitaire', name: 'Solitaire', releaseYear: 1990, fame: 5 },
  { id: 'vg-tetris', name: 'Tetris', releaseYear: 1984, fame: 5 },
  { id: 'vg-supermariobros', name: 'Super Mario Bros.', releaseYear: 1985, fame: 5 },
  { id: 'vg-zelda', name: 'The Legend of Zelda', releaseYear: 1986, fame: 5 },
  { id: 'vg-sonic', name: 'Sonic the Hedgehog', releaseYear: 1991, fame: 5 },
  { id: 'vg-mariokart', name: 'Mario Kart', releaseYear: 1992, fame: 5 },
  { id: 'vg-thesims', name: 'The Sims', releaseYear: 2000, fame: 5 },
  { id: 'vg-guitarhero', name: 'Guitar Hero', releaseYear: 2005, fame: 5 },
  { id: 'vg-wiisports', name: 'Wii Sports', releaseYear: 2006, fame: 5 },
  { id: 'vg-roblox', name: 'Roblox', releaseYear: 2006, fame: 5 },
  { id: 'vg-angrybirds', name: 'Angry Birds', releaseYear: 2009, fame: 5 },
  { id: 'vg-minecraft', name: 'Minecraft', releaseYear: 2011, fame: 5 },
  { id: 'vg-candycrush', name: 'Candy Crush', releaseYear: 2012, fame: 5 },
  { id: 'vg-amongus', name: 'Among Us', releaseYear: 2018, fame: 5 },
  { id: 'vg-wordle', name: 'Wordle', releaseYear: 2021, fame: 5 },
];

const display = (g) => ({ title: g.name, subtitle: null, meta: g.releaseYear });

const CATEGORIES = [
  {
    key: 'year',
    axis: 'videogameYear',
    dir: 'asc',
    value: (g) => g.releaseYear,
    title: 'Oldest video game first',
    prompt: 'Whichever game came out first goes at the top',
    statLabel: 'Released',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
    note: 'Release year of the original/first widely-known entry.',
  },
];

export const videogames = {
  key: 'videogames',
  name: 'Video Games',
  items: VIDEOGAMES,
  display,
  categories: CATEGORIES.map((c) => ({
    ...c,
    fqKey: `videogames:${c.key}`,
    deckKey: 'videogames',
    deckName: 'Video Games',
    pool: VIDEOGAMES,
    display,
  })),
};

export default videogames;
