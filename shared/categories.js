/**
 * Ranking categories.
 *
 * Each category is:
 *   value(car)  the number being ranked — a field, or something derived from several
 *   dir         'asc'  -> lowest value takes position 1 (quickest sprint, oldest, lightest)
 *               'desc' -> highest value takes position 1 (most power, priciest, heaviest)
 *   axis        which underlying quantity this reads. Two categories sharing an axis never
 *               land back to back, so a game can't ask "heaviest" then "lightest".
 *   eligible    optional filter — a car with no engine cannot be ranked by displacement
 *   minRelGap / minAbsGap
 *               the separation a generated lineup needs between adjacent cars, so an
 *               answer never turns on a rounding difference. See pickLineup() in rounds.js.
 */

const money = (v) =>
  v >= 1000000
    ? `$${(v / 1000000).toFixed(2)}M`
    : `$${Math.round(v).toLocaleString('en-US')}`;

/**
 * A flat, standard average annual rate (the commonly cited long-run rule of thumb for US
 * inflation), compounded from each car's launch year to now. This is deliberately NOT a
 * real year-by-year CPI series — that would need a verified data point for every year back
 * to 1948, a much bigger lift than this game's other numbers ask for, and a flat rate is
 * transparent about exactly what it's assuming rather than quietly importing 80 years of
 * economic history. It'll be wrong for any single year (real inflation spiked well above
 * 3% in the late 1970s/early 1980s and ran near zero at times since), but it's consistent,
 * and it's the same kind of back-of-envelope math most people already do in their head when
 * they say "a dollar doesn't go as far as it used to."
 */
const AVERAGE_ANNUAL_INFLATION = 0.03;
const REFERENCE_YEAR = new Date().getFullYear();
const adjustedForInflation = (car) =>
  car.priceUsd * (1 + AVERAGE_ANNUAL_INFLATION) ** (REFERENCE_YEAR - car.year);

/**
 * Cars whose power-per-litre figure is a fair comparison: a real engine, no battery
 * padding the number, and not a rotary — a 1.3L twin-rotor is widely reckoned equivalent
 * to roughly double that, so ranking one against piston engines is an argument, not a
 * question.
 */
const comparablePerLitre = (car) => car.litres != null && !car.electrified && !car.rotary;

/**
 * The oldest/newest categories ask "which of these nameplates has been around longest",
 * not "guess this exact car's model year" — so a Bentley Continental GT owner from any of
 * its three generations can answer correctly by knowing when the Continental GT itself
 * first launched. `firstYear` (see shared/cars.js) carries that date when it differs from
 * the specific variant's `year`; most cars don't need it because the two are the same.
 */
const ageValue = (c) => c.firstYear ?? c.year;

/** Excluded from age categories only: see `disputedOrigin` in shared/cars.js. */
const hasUndisputedOrigin = (car) => !car.disputedOrigin;

export const CATEGORIES = [
  {
    key: 'fastest',
    axis: 'accelSec',
    dir: 'asc',
    value: (c) => c.accelSec,
    title: 'Quickest first',
    prompt: 'Quickest 0–100 km/h at the top',
    statLabel: '0–100 km/h',
    format: (v) => `${v.toFixed(1)}s`,
    minRelGap: 0.1,
    note: 'Sprint to 100 km/h (62 mph) — the figure most makers outside the US quote.',
  },
  {
    key: 'topspeed',
    axis: 'topSpeedMph',
    dir: 'desc',
    value: (c) => c.topSpeedMph,
    title: 'Highest top speed first',
    prompt: 'Highest top speed at the top',
    statLabel: 'Top speed',
    format: (v) => `${v} mph`,
    minRelGap: 0.07,
    note: 'Manufacturer figures. Plenty of these are electronically limited.',
  },
  {
    key: 'power',
    axis: 'hp',
    dir: 'desc',
    value: (c) => c.hp,
    title: 'Most powerful first',
    prompt: 'Most horsepower at the top',
    statLabel: 'Power',
    format: (v) => `${v} hp`,
    minRelGap: 0.12,
  },
  {
    key: 'powertoweight',
    axis: 'ptw',
    dir: 'desc',
    value: (c) => (c.hp / c.kg) * 1000,
    title: 'Best power-to-weight first',
    prompt: 'Best power-to-weight at the top',
    statLabel: 'Power per tonne',
    format: (v) => `${Math.round(v)} hp/t`,
    minRelGap: 0.12,
    note: 'Horsepower per tonne — the number that decides how fast a car actually feels.',
  },
  {
    key: 'bigengine',
    axis: 'litres',
    dir: 'desc',
    value: (c) => c.litres,
    eligible: (c) => c.litres != null,
    title: 'Biggest engine first',
    prompt: 'Biggest engine at the top',
    statLabel: 'Displacement',
    format: (v) => `${v.toFixed(1)}L`,
    minRelGap: 0.12,
  },
  {
    key: 'powerperlitre',
    axis: 'perlitre',
    dir: 'desc',
    value: (c) => c.hp / c.litres,
    eligible: comparablePerLitre,
    title: 'Most highly strung first',
    prompt: 'Most power per litre at the top',
    statLabel: 'Power per litre',
    format: (v) => `${Math.round(v)} hp/L`,
    minRelGap: 0.14,
    note: 'How hard the engine works for its size. Turbos flatter themselves here.',
  },
  {
    key: 'expensive',
    axis: 'priceUsd',
    dir: 'desc',
    value: (c) => c.priceUsd,
    title: 'Most expensive first — NOT inflation-adjusted',
    prompt: 'Highest launch-day sticker price at the top',
    statLabel: 'Price when new',
    format: money,
    minRelGap: 0.2,
    note: 'The actual number on the window sticker the day it launched — in that year’s dollars, not adjusted for inflation. A 1965 Mustang will look absurdly cheap next to a 2020 hatchback here; that’s expected, not a bug.',
  },
  {
    key: 'cheapest',
    axis: 'priceUsd',
    dir: 'asc',
    value: (c) => c.priceUsd,
    title: 'Cheapest first — NOT inflation-adjusted',
    prompt: 'Lowest launch-day sticker price at the top',
    statLabel: 'Price when new',
    format: money,
    minRelGap: 0.2,
    note: 'The actual number on the window sticker the day it launched — in that year’s dollars, not adjusted for inflation. A 1965 Mustang will look absurdly cheap next to a 2020 hatchback here; that’s expected, not a bug.',
  },
  {
    key: 'expensiveAdjusted',
    axis: 'priceUsd',
    dir: 'desc',
    value: adjustedForInflation,
    title: `Most expensive first — ADJUSTED to ${REFERENCE_YEAR} dollars`,
    prompt: `Adjusted to what it'd cost in ${REFERENCE_YEAR}, priciest at the top`,
    statLabel: `Price in ${REFERENCE_YEAR} dollars`,
    format: money,
    minRelGap: 0.2,
    note: `Launch price compounded at a flat ${Math.round(AVERAGE_ANNUAL_INFLATION * 100)}%/year — the standard rule-of-thumb average, not actual year-by-year inflation data. Good for "which was really the bigger splurge", not a precise historical estimate.`,
  },
  {
    key: 'heaviest',
    axis: 'kg',
    dir: 'desc',
    value: (c) => c.kg,
    title: 'Heaviest first',
    prompt: 'Heaviest at the top',
    statLabel: 'Curb weight',
    format: (v) => `${v.toLocaleString('en-US')} kg`,
    minRelGap: 0.08,
  },
  {
    key: 'lightest',
    axis: 'kg',
    dir: 'asc',
    value: (c) => c.kg,
    title: 'Lightest first',
    prompt: 'Lightest at the top',
    statLabel: 'Curb weight',
    format: (v) => `${v.toLocaleString('en-US')} kg`,
    minRelGap: 0.08,
  },
  {
    key: 'oldest',
    axis: 'year',
    dir: 'asc',
    value: ageValue,
    eligible: hasUndisputedOrigin,
    title: 'First released longest ago',
    prompt: 'Whichever nameplate launched first goes at the top',
    statLabel: 'First released',
    format: (v) => String(v),
    minAbsGap: 4,
    note: 'About when the nameplate itself first launched, not this exact car’s spec year.',
  },
  {
    key: 'newest',
    axis: 'year',
    dir: 'desc',
    value: ageValue,
    eligible: hasUndisputedOrigin,
    title: 'Most recently released',
    prompt: 'Whichever nameplate launched most recently goes at the top',
    statLabel: 'First released',
    format: (v) => String(v),
    minAbsGap: 4,
    note: 'About when the nameplate itself first launched, not this exact car’s spec year.',
  },
];

export const CATEGORY_BY_KEY = new Map(CATEGORIES.map((c) => [c.key, c]));

/** Cars this category can actually rank. */
export const eligibleCars = (category, cars) =>
  category.eligible ? cars.filter(category.eligible) : cars;
