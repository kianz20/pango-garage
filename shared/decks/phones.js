/**
 * The phones deck: well-known smartphones.
 *
 * Fields
 *   id              stable slug, prefixed `phone-` so it can never collide with another
 *                   deck's ids in the "no repeat this game" tracking
 *   brand           manufacturer
 *   model           model name as people say it out loud
 *   releaseYear     year first announced
 *   launchPriceUsd  US launch price, NOMINAL (not inflation adjusted), base storage config
 *   screenWidthPx / screenHeightPx
 *                   display resolution in pixels — total pixel count is width*height
 *   fame            1-5, how likely a non-enthusiast is to recognise it
 *
 * Figures are widely-published launch specs for well-known phones; not independently
 * spot-checked against manufacturer press kits the way the car pool is (see the
 * `verified` convention in shared/decks/cars.js) — treat as good-enough for gameplay, not
 * a spec database.
 */

export const PHONES = [
  { id: 'phone-iphone-og-2007', brand: 'Apple', model: 'iPhone (1st gen)', releaseYear: 2007, launchPriceUsd: 499, screenWidthPx: 320, screenHeightPx: 480, fame: 5 },
  { id: 'phone-iphone-4-2010', brand: 'Apple', model: 'iPhone 4', releaseYear: 2010, launchPriceUsd: 199, screenWidthPx: 640, screenHeightPx: 960, fame: 5 },
  { id: 'phone-iphone-5-2012', brand: 'Apple', model: 'iPhone 5', releaseYear: 2012, launchPriceUsd: 199, screenWidthPx: 640, screenHeightPx: 1136, fame: 4 },
  { id: 'phone-iphone-6-2014', brand: 'Apple', model: 'iPhone 6', releaseYear: 2014, launchPriceUsd: 199, screenWidthPx: 750, screenHeightPx: 1334, fame: 5 },
  { id: 'phone-iphone-x-2017', brand: 'Apple', model: 'iPhone X', releaseYear: 2017, launchPriceUsd: 999, screenWidthPx: 1125, screenHeightPx: 2436, fame: 5 },
  { id: 'phone-iphone-11-2019', brand: 'Apple', model: 'iPhone 11', releaseYear: 2019, launchPriceUsd: 699, screenWidthPx: 828, screenHeightPx: 1792, fame: 5 },
  { id: 'phone-iphone-12-2020', brand: 'Apple', model: 'iPhone 12', releaseYear: 2020, launchPriceUsd: 799, screenWidthPx: 1170, screenHeightPx: 2532, fame: 5 },
  { id: 'phone-iphone-13pro-2021', brand: 'Apple', model: 'iPhone 13 Pro', releaseYear: 2021, launchPriceUsd: 999, screenWidthPx: 1170, screenHeightPx: 2532, fame: 4 },
  { id: 'phone-iphone-14pro-2022', brand: 'Apple', model: 'iPhone 14 Pro', releaseYear: 2022, launchPriceUsd: 999, screenWidthPx: 1179, screenHeightPx: 2556, fame: 4 },
  { id: 'phone-iphone-15promax-2023', brand: 'Apple', model: 'iPhone 15 Pro Max', releaseYear: 2023, launchPriceUsd: 1199, screenWidthPx: 1290, screenHeightPx: 2796, fame: 4 },
  { id: 'phone-iphone-16pro-2024', brand: 'Apple', model: 'iPhone 16 Pro', releaseYear: 2024, launchPriceUsd: 999, screenWidthPx: 1206, screenHeightPx: 2622, fame: 4 },
  { id: 'phone-galaxy-s2-2011', brand: 'Samsung', model: 'Galaxy S II', releaseYear: 2011, launchPriceUsd: 199, screenWidthPx: 480, screenHeightPx: 800, fame: 3 },
  { id: 'phone-galaxy-note-2011', brand: 'Samsung', model: 'Galaxy Note', releaseYear: 2011, launchPriceUsd: 299, screenWidthPx: 800, screenHeightPx: 1280, fame: 3 },
  { id: 'phone-galaxy-s5-2014', brand: 'Samsung', model: 'Galaxy S5', releaseYear: 2014, launchPriceUsd: 649, screenWidthPx: 1080, screenHeightPx: 1920, fame: 3 },
  { id: 'phone-galaxy-s7-2016', brand: 'Samsung', model: 'Galaxy S7', releaseYear: 2016, launchPriceUsd: 669, screenWidthPx: 1440, screenHeightPx: 2560, fame: 4 },
  { id: 'phone-galaxy-note8-2017', brand: 'Samsung', model: 'Galaxy Note 8', releaseYear: 2017, launchPriceUsd: 929, screenWidthPx: 1440, screenHeightPx: 2960, fame: 3 },
  { id: 'phone-galaxy-s10-2019', brand: 'Samsung', model: 'Galaxy S10', releaseYear: 2019, launchPriceUsd: 899, screenWidthPx: 1440, screenHeightPx: 3040, fame: 4 },
  { id: 'phone-galaxy-s20ultra-2020', brand: 'Samsung', model: 'Galaxy S20 Ultra', releaseYear: 2020, launchPriceUsd: 1399, screenWidthPx: 1440, screenHeightPx: 3200, fame: 3 },
  { id: 'phone-galaxy-s23ultra-2023', brand: 'Samsung', model: 'Galaxy S23 Ultra', releaseYear: 2023, launchPriceUsd: 1199, screenWidthPx: 1440, screenHeightPx: 3088, fame: 4 },
  { id: 'phone-galaxy-fold-2019', brand: 'Samsung', model: 'Galaxy Fold', releaseYear: 2019, launchPriceUsd: 1980, screenWidthPx: 1536, screenHeightPx: 2152, fame: 3 },
  { id: 'phone-nokia-3310-2000', brand: 'Nokia', model: '3310', releaseYear: 2000, launchPriceUsd: 130, screenWidthPx: 84, screenHeightPx: 48, fame: 5 },
  { id: 'phone-nokia-n95-2007', brand: 'Nokia', model: 'N95', releaseYear: 2007, launchPriceUsd: 749, screenWidthPx: 240, screenHeightPx: 320, fame: 3 },
  { id: 'phone-blackberry-bold-2008', brand: 'BlackBerry', model: 'Bold 9000', releaseYear: 2008, launchPriceUsd: 299, screenWidthPx: 480, screenHeightPx: 320, fame: 3 },
  { id: 'phone-motorola-razr-2004', brand: 'Motorola', model: 'RAZR V3', releaseYear: 2004, launchPriceUsd: 499, screenWidthPx: 176, screenHeightPx: 220, fame: 5 },
  { id: 'phone-htc-one-m8-2014', brand: 'HTC', model: 'One (M8)', releaseYear: 2014, launchPriceUsd: 599, screenWidthPx: 1080, screenHeightPx: 1920, fame: 2 },
  { id: 'phone-google-pixel-2016', brand: 'Google', model: 'Pixel', releaseYear: 2016, launchPriceUsd: 649, screenWidthPx: 1080, screenHeightPx: 1920, fame: 3 },
  { id: 'phone-google-pixel6pro-2021', brand: 'Google', model: 'Pixel 6 Pro', releaseYear: 2021, launchPriceUsd: 899, screenWidthPx: 1440, screenHeightPx: 3120, fame: 3 },
  { id: 'phone-google-pixel8pro-2023', brand: 'Google', model: 'Pixel 8 Pro', releaseYear: 2023, launchPriceUsd: 999, screenWidthPx: 1344, screenHeightPx: 2992, fame: 3 },
  { id: 'phone-huawei-p30pro-2019', brand: 'Huawei', model: 'P30 Pro', releaseYear: 2019, launchPriceUsd: 999, screenWidthPx: 1080, screenHeightPx: 2340, fame: 2 },
  { id: 'phone-oneplus-6-2018', brand: 'OnePlus', model: '6', releaseYear: 2018, launchPriceUsd: 529, screenWidthPx: 1080, screenHeightPx: 2280, fame: 3 },
  { id: 'phone-xiaomi-mi11-2021', brand: 'Xiaomi', model: 'Mi 11', releaseYear: 2021, launchPriceUsd: 749, screenWidthPx: 1440, screenHeightPx: 3200, fame: 2 },
  { id: 'phone-sony-xperia1-2019', brand: 'Sony', model: 'Xperia 1', releaseYear: 2019, launchPriceUsd: 949, screenWidthPx: 1644, screenHeightPx: 3840, fame: 2 },
];

const money = (v) => `$${Math.round(v).toLocaleString('en-US')}`;

const display = (p) => ({ title: p.model, subtitle: p.brand, meta: p.releaseYear });

const CATEGORIES = [
  {
    key: 'price',
    axis: 'launchPriceUsd',
    dir: 'desc',
    value: (p) => p.launchPriceUsd,
    title: 'Most expensive first at launch',
    prompt: 'Highest launch price at the top',
    statLabel: 'Launch price',
    format: money,
    minRelGap: 0.15,
    note: 'US launch price, base storage, not inflation-adjusted.',
  },
  {
    key: 'cheap',
    axis: 'launchPriceUsd',
    dir: 'asc',
    value: (p) => p.launchPriceUsd,
    title: 'Cheapest first at launch',
    prompt: 'Lowest launch price at the top',
    statLabel: 'Launch price',
    format: money,
    minRelGap: 0.15,
    note: 'US launch price, base storage, not inflation-adjusted.',
  },
  {
    key: 'year',
    axis: 'releaseYear',
    dir: 'asc',
    value: (p) => p.releaseYear,
    title: 'Oldest first',
    prompt: 'Earliest release at the top',
    statLabel: 'Released',
    format: (v) => String(v),
    minAbsGap: 1,
    hidesMeta: true,
  },
  {
    key: 'resolution',
    axis: 'pixels',
    dir: 'desc',
    value: (p) => p.screenWidthPx * p.screenHeightPx,
    title: 'Highest screen resolution first',
    prompt: 'Most total screen pixels at the top',
    statLabel: 'Screen resolution',
    format: (v) => `${v.toLocaleString('en-US')} px total`,
    minRelGap: 0.1,
    note: 'Width × height, in total pixels.',
  },
];

export const phones = {
  key: 'phones',
  name: 'Phones',
  items: PHONES,
  display,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `phones:${c.key}`, deckKey: 'phones', deckName: 'Phones', pool: PHONES, display })),
};

export default phones;
