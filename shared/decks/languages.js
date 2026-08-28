/**
 * The programming languages deck: well-known languages, ranked by when they first appeared.
 *
 * Fields
 *   id           stable slug, prefixed `lang-` so it can never collide with another deck's
 *                ids in the "no repeat this game" tracking
 *   name         the name people say out loud
 *   releaseYear  year the language first appeared / was first publicly released
 *   fame         1-5, how likely a non-enthusiast is to recognise it
 *
 * Release years are widely-published historical record, not the kind of figure that needs
 * a `verified` spot-check convention (see shared/decks/cars.js) — these don't change.
 */

export const LANGUAGES = [
  { id: 'lang-fortran', name: 'Fortran', releaseYear: 1957, fame: 3 },
  { id: 'lang-cobol', name: 'COBOL', releaseYear: 1959, fame: 3 },
  { id: 'lang-basic', name: 'BASIC', releaseYear: 1964, fame: 4 },
  { id: 'lang-pascal', name: 'Pascal', releaseYear: 1970, fame: 3 },
  { id: 'lang-c', name: 'C', releaseYear: 1972, fame: 5 },
  { id: 'lang-sql', name: 'SQL', releaseYear: 1974, fame: 5 },
  { id: 'lang-cpp', name: 'C++', releaseYear: 1985, fame: 5 },
  { id: 'lang-perl', name: 'Perl', releaseYear: 1987, fame: 3 },
  { id: 'lang-haskell', name: 'Haskell', releaseYear: 1990, fame: 2 },
  { id: 'lang-python', name: 'Python', releaseYear: 1991, fame: 5 },
  { id: 'lang-visualbasic', name: 'Visual Basic', releaseYear: 1991, fame: 3 },
  { id: 'lang-java', name: 'Java', releaseYear: 1995, fame: 5 },
  { id: 'lang-javascript', name: 'JavaScript', releaseYear: 1995, fame: 5 },
  { id: 'lang-php', name: 'PHP', releaseYear: 1995, fame: 4 },
  { id: 'lang-ruby', name: 'Ruby', releaseYear: 1995, fame: 4 },
  { id: 'lang-csharp', name: 'C#', releaseYear: 2000, fame: 5 },
  { id: 'lang-scala', name: 'Scala', releaseYear: 2004, fame: 2 },
  { id: 'lang-go', name: 'Go', releaseYear: 2009, fame: 4 },
  { id: 'lang-rust', name: 'Rust', releaseYear: 2012, fame: 4 },
  { id: 'lang-kotlin', name: 'Kotlin', releaseYear: 2011, fame: 4 },
  { id: 'lang-typescript', name: 'TypeScript', releaseYear: 2012, fame: 5 },
  { id: 'lang-swift', name: 'Swift', releaseYear: 2014, fame: 4 },
];

const display = (l) => ({ title: l.name, subtitle: null, meta: l.releaseYear });

const CATEGORIES = [
  {
    key: 'year',
    axis: 'languageYear',
    dir: 'asc',
    value: (l) => l.releaseYear,
    title: 'Oldest programming language first',
    prompt: 'Whichever language was released first goes at the top',
    statLabel: 'Released',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
    note: 'Year the language first publicly appeared.',
  },
];

export const languages = {
  key: 'languages',
  name: 'Programming Languages',
  items: LANGUAGES,
  display,
  categories: CATEGORIES.map((c) => ({
    ...c,
    fqKey: `languages:${c.key}`,
    deckKey: 'languages',
    deckName: 'Programming Languages',
    pool: LANGUAGES,
    display,
  })),
};

export default languages;
