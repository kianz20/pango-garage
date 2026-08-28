/**
 * The buildings deck: well-known skyscrapers and towers, worldwide.
 *
 * Fields
 *   id             stable slug, prefixed `bld-` so it can never collide with another deck's
 *                  ids in the "no repeat this game" tracking
 *   name           the building's name
 *   city           city it's in, shown as the subtitle
 *   heightM        architectural height in metres — to the structural/architectural top
 *                  (spire included where one exists), NOT the highest occupied floor and
 *                  NOT broadcast antennas bolted on after completion. This is how "tallest
 *                  building" rankings are conventionally measured (CTBUH standard).
 *   yearCompleted  year construction finished (may differ from the year it opened to the
 *                  public, which sometimes lags by months)
 *   fame           1-5, how likely a non-enthusiast is to recognise it
 *
 * The Eiffel Tower and CN Tower aren't "buildings" in the strict sense (no floors of
 * occupied space) but are included as instantly-recognisable tall structures, the same way
 * this game already bends categories for recognisability (see shared/decks/fifa.js's FIFA +
 * Rugby World Cups both counting as "Sports").
 *
 * Figures are widely-published estimates, not independently spot-checked against a single
 * authoritative source the way the car pool is (see the `verified` convention in
 * shared/decks/cars.js) — good enough for gameplay, not a structural database.
 */

export const BUILDINGS = [
  { id: 'bld-burjkhalifa', name: 'Burj Khalifa', city: 'Dubai', heightM: 828, yearCompleted: 2010, fame: 5 },
  { id: 'bld-merdeka118', name: 'Merdeka 118', city: 'Kuala Lumpur', heightM: 678.9, yearCompleted: 2023, fame: 2 },
  { id: 'bld-shanghaitower', name: 'Shanghai Tower', city: 'Shanghai', heightM: 632, yearCompleted: 2015, fame: 3 },
  { id: 'bld-lotteworldtower', name: 'Lotte World Tower', city: 'Seoul', heightM: 555, yearCompleted: 2016, fame: 3 },
  { id: 'bld-cntower', name: 'CN Tower', city: 'Toronto', heightM: 553.3, yearCompleted: 1976, fame: 4 },
  { id: 'bld-owtc', name: 'One World Trade Center', city: 'New York City', heightM: 541.3, yearCompleted: 2014, fame: 5 },
  { id: 'bld-taipei101', name: 'Taipei 101', city: 'Taipei', heightM: 508, yearCompleted: 2004, fame: 4 },
  { id: 'bld-icc', name: 'International Commerce Centre', city: 'Hong Kong', heightM: 484, yearCompleted: 2010, fame: 2 },
  { id: 'bld-landmark81', name: 'Landmark 81', city: 'Ho Chi Minh City', heightM: 461.2, yearCompleted: 2018, fame: 2 },
  { id: 'bld-petronastowers', name: 'Petronas Towers', city: 'Kuala Lumpur', heightM: 451.9, yearCompleted: 1998, fame: 5 },
  { id: 'bld-willistower', name: 'Willis Tower', city: 'Chicago', heightM: 442, yearCompleted: 1973, fame: 5 },
  { id: 'bld-432park', name: '432 Park Avenue', city: 'New York City', heightM: 425.5, yearCompleted: 2015, fame: 2 },
  { id: 'bld-trumpchicago', name: 'Trump International Hotel & Tower', city: 'Chicago', heightM: 423.2, yearCompleted: 2009, fame: 3 },
  { id: 'bld-jinmaotower', name: 'Jin Mao Tower', city: 'Shanghai', heightM: 420.5, yearCompleted: 1999, fame: 3 },
  { id: 'bld-twoifc', name: 'Two International Finance Centre', city: 'Hong Kong', heightM: 415, yearCompleted: 2003, fame: 2 },
  { id: 'bld-bankofchinatower', name: 'Bank of China Tower', city: 'Hong Kong', heightM: 367.4, yearCompleted: 1990, fame: 3 },
  { id: 'bld-eiffeltower', name: 'Eiffel Tower', city: 'Paris', heightM: 330, yearCompleted: 1889, fame: 5 },
  { id: 'bld-theshard', name: 'The Shard', city: 'London', heightM: 309.6, yearCompleted: 2012, fame: 4 },
  { id: 'bld-empirestatebuilding', name: 'Empire State Building', city: 'New York City', heightM: 381, yearCompleted: 1931, fame: 5 },
  { id: 'bld-chryslerbuilding', name: 'Chrysler Building', city: 'New York City', heightM: 318.9, yearCompleted: 1930, fame: 4 },
];

const display = (b) => ({ title: b.name, subtitle: b.city, meta: b.yearCompleted });

const CATEGORIES = [
  {
    key: 'height',
    axis: 'buildingHeight',
    dir: 'desc',
    value: (b) => b.heightM,
    title: 'Tallest building first',
    prompt: 'Tallest structure at the top',
    statLabel: 'Height',
    format: (v) => `${v.toLocaleString('en-US')} m`,
    minAbsGap: 10,
    note: 'Architectural height, to the structural top including any spire.',
  },
  {
    key: 'year',
    axis: 'buildingYear',
    dir: 'asc',
    value: (b) => b.yearCompleted,
    title: 'Oldest building first',
    prompt: 'Whichever building was completed first goes at the top',
    statLabel: 'Completed',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
    note: 'Year construction finished.',
  },
];

export const buildings = {
  key: 'buildings',
  name: 'Buildings',
  items: BUILDINGS,
  display,
  categories: CATEGORIES.map((c) => ({
    ...c,
    fqKey: `buildings:${c.key}`,
    deckKey: 'buildings',
    deckName: 'Buildings',
    pool: BUILDINGS,
    display,
  })),
};

export default buildings;
