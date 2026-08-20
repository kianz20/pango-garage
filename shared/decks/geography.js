/**
 * The geography deck: well-known countries.
 *
 * Fields
 *   id                 stable slug, prefixed `geo-`
 *   country            display name
 *   region             continent/region, shown as the subtitle
 *   population         approximate, most recent widely-cited estimate
 *   areaKm2            total land + water area
 *   gdpUsdBillions     nominal GDP, most recent widely-cited estimate, in billions of USD
 *   tallestMountainM   elevation, in metres, of the country's tallest peak
 *   fame               1-5, how likely a non-enthusiast is to recognise it
 *
 * Figures are widely-published estimates, not independently spot-checked against a single
 * authoritative source the way the car pool is (see the `verified` convention in
 * shared/decks/cars.js) — good enough for gameplay, not a statistics database. Population
 * and GDP in particular drift year to year; treat these as "roughly right, order of
 * magnitude correct."
 */

export const COUNTRIES = [
  { id: 'geo-china', country: 'China', region: 'Asia', population: 1_410_000_000, areaKm2: 9_597_000, gdpUsdBillions: 17_790, tallestMountainM: 8849, fame: 5 },
  { id: 'geo-india', country: 'India', region: 'Asia', population: 1_428_000_000, areaKm2: 3_287_000, gdpUsdBillions: 3_730, tallestMountainM: 8586, fame: 5 },
  { id: 'geo-usa', country: 'United States', region: 'North America', population: 335_000_000, areaKm2: 9_834_000, gdpUsdBillions: 27_360, tallestMountainM: 6190, fame: 5 },
  { id: 'geo-indonesia', country: 'Indonesia', region: 'Asia', population: 277_000_000, areaKm2: 1_905_000, gdpUsdBillions: 1_370, tallestMountainM: 4884, fame: 4 },
  { id: 'geo-pakistan', country: 'Pakistan', region: 'Asia', population: 240_000_000, areaKm2: 881_000, gdpUsdBillions: 375, tallestMountainM: 8611, fame: 3 },
  { id: 'geo-nigeria', country: 'Nigeria', region: 'Africa', population: 223_000_000, areaKm2: 924_000, gdpUsdBillions: 390, tallestMountainM: 2419, fame: 3 },
  { id: 'geo-brazil', country: 'Brazil', region: 'South America', population: 216_000_000, areaKm2: 8_516_000, gdpUsdBillions: 2_170, tallestMountainM: 2995, fame: 5 },
  { id: 'geo-bangladesh', country: 'Bangladesh', region: 'Asia', population: 173_000_000, areaKm2: 148_000, gdpUsdBillions: 446, tallestMountainM: 1064, fame: 3 },
  { id: 'geo-russia', country: 'Russia', region: 'Europe/Asia', population: 144_000_000, areaKm2: 17_098_000, gdpUsdBillions: 2_020, tallestMountainM: 5642, fame: 5 },
  { id: 'geo-mexico', country: 'Mexico', region: 'North America', population: 128_000_000, areaKm2: 1_964_000, gdpUsdBillions: 1_790, tallestMountainM: 5636, fame: 4 },
  { id: 'geo-japan', country: 'Japan', region: 'Asia', population: 123_000_000, areaKm2: 378_000, gdpUsdBillions: 4_210, tallestMountainM: 3776, fame: 5 },
  { id: 'geo-egypt', country: 'Egypt', region: 'Africa', population: 112_000_000, areaKm2: 1_002_000, gdpUsdBillions: 380, tallestMountainM: 2629, fame: 4 },
  { id: 'geo-germany', country: 'Germany', region: 'Europe', population: 84_000_000, areaKm2: 357_000, gdpUsdBillions: 4_530, tallestMountainM: 2962, fame: 5 },
  { id: 'geo-turkey', country: 'Turkey', region: 'Europe/Asia', population: 85_000_000, areaKm2: 785_000, gdpUsdBillions: 1_110, tallestMountainM: 5137, fame: 4 },
  { id: 'geo-france', country: 'France', region: 'Europe', population: 68_000_000, areaKm2: 552_000, gdpUsdBillions: 3_030, tallestMountainM: 4809, fame: 5 },
  { id: 'geo-uk', country: 'United Kingdom', region: 'Europe', population: 68_000_000, areaKm2: 244_000, gdpUsdBillions: 3_340, tallestMountainM: 1345, fame: 5 },
  { id: 'geo-italy', country: 'Italy', region: 'Europe', population: 59_000_000, areaKm2: 301_000, gdpUsdBillions: 2_190, tallestMountainM: 4808, fame: 5 },
  { id: 'geo-southafrica', country: 'South Africa', region: 'Africa', population: 60_000_000, areaKm2: 1_221_000, gdpUsdBillions: 405, tallestMountainM: 3450, fame: 4 },
  { id: 'geo-southkorea', country: 'South Korea', region: 'Asia', population: 52_000_000, areaKm2: 100_000, gdpUsdBillions: 1_710, tallestMountainM: 1947, fame: 4 },
  { id: 'geo-spain', country: 'Spain', region: 'Europe', population: 48_000_000, areaKm2: 506_000, gdpUsdBillions: 1_580, tallestMountainM: 3718, fame: 5 },
  { id: 'geo-argentina', country: 'Argentina', region: 'South America', population: 46_000_000, areaKm2: 2_780_000, gdpUsdBillions: 640, tallestMountainM: 6961, fame: 4 },
  { id: 'geo-canada', country: 'Canada', region: 'North America', population: 39_000_000, areaKm2: 9_985_000, gdpUsdBillions: 2_140, tallestMountainM: 5959, fame: 5 },
  { id: 'geo-australia', country: 'Australia', region: 'Oceania', population: 26_000_000, areaKm2: 7_692_000, gdpUsdBillions: 1_720, tallestMountainM: 2228, fame: 5 },
  { id: 'geo-netherlands', country: 'Netherlands', region: 'Europe', population: 18_000_000, areaKm2: 41_500, gdpUsdBillions: 1_090, tallestMountainM: 887, fame: 4 },
  { id: 'geo-chile', country: 'Chile', region: 'South America', population: 19_600_000, areaKm2: 756_000, gdpUsdBillions: 335, tallestMountainM: 6893, fame: 3 },
  { id: 'geo-switzerland', country: 'Switzerland', region: 'Europe', population: 8_800_000, areaKm2: 41_300, gdpUsdBillions: 905, tallestMountainM: 4634, fame: 4 },
  { id: 'geo-sweden', country: 'Sweden', region: 'Europe', population: 10_500_000, areaKm2: 450_000, gdpUsdBillions: 590, tallestMountainM: 2097, fame: 4 },
  { id: 'geo-nz', country: 'New Zealand', region: 'Oceania', population: 5_200_000, areaKm2: 268_000, gdpUsdBillions: 250, tallestMountainM: 3724, fame: 4 },
  { id: 'geo-nepal', country: 'Nepal', region: 'Asia', population: 30_000_000, areaKm2: 147_000, gdpUsdBillions: 41, tallestMountainM: 8849, fame: 3 },
  { id: 'geo-peru', country: 'Peru', region: 'South America', population: 34_000_000, areaKm2: 1_285_000, gdpUsdBillions: 268, tallestMountainM: 6961, fame: 3 },
  { id: 'geo-uae', country: 'United Arab Emirates', region: 'Middle East', population: 9_900_000, areaKm2: 83_600, gdpUsdBillions: 504, tallestMountainM: 1934, fame: 3 },
  { id: 'geo-iceland', country: 'Iceland', region: 'Europe', population: 390_000, areaKm2: 103_000, gdpUsdBillions: 31, tallestMountainM: 2110, fame: 3 },
];

const display = (c) => ({ title: c.country, subtitle: c.region, meta: null });

const compact = (v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v.toLocaleString('en-US'));

const CATEGORIES = [
  {
    key: 'population',
    axis: 'population',
    dir: 'desc',
    value: (c) => c.population,
    title: 'Most populous first',
    prompt: 'Largest population at the top',
    statLabel: 'Population',
    format: compact,
    minRelGap: 0.15,
  },
  {
    key: 'area',
    axis: 'areaKm2',
    dir: 'desc',
    value: (c) => c.areaKm2,
    title: 'Largest land area first',
    prompt: 'Biggest country by area at the top',
    statLabel: 'Area',
    format: (v) => `${compact(v)} km²`,
    minRelGap: 0.15,
  },
  {
    key: 'gdp',
    axis: 'gdpUsdBillions',
    dir: 'desc',
    value: (c) => c.gdpUsdBillions,
    title: 'Biggest economy first',
    prompt: 'Highest GDP at the top',
    statLabel: 'GDP',
    format: (v) => `$${v.toLocaleString('en-US')}B`,
    minRelGap: 0.15,
    note: 'Nominal GDP, US dollars.',
  },
  {
    key: 'mountain',
    axis: 'tallestMountainM',
    dir: 'desc',
    value: (c) => c.tallestMountainM,
    title: "Tallest peak first",
    prompt: "Highest point at the top",
    statLabel: 'Tallest mountain',
    format: (v) => `${v.toLocaleString('en-US')} m`,
    minRelGap: 0.1,
    note: "The country's highest point above sea level.",
  },
];

export const geography = {
  key: 'geography',
  name: 'Geography',
  items: COUNTRIES,
  display,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `geography:${c.key}`, deckKey: 'geography', deckName: 'Geography', pool: COUNTRIES, display })),
};

export default geography;
