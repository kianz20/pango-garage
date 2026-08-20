/**
 * The car deck: item pool + categories.
 *
 * Fields (per car)
 *   id            stable slug, used as the drag-item key
 *   make          manufacturer
 *   model         model / trim as people would say it out loud
 *   year          model year of the variant these specs describe
 *   hp            peak power in horsepower (bhp, as quoted at launch; total system power
 *                 for hybrids)
 *   accelSec      0-100 km/h (0-62 mph) in seconds. This is the figure most non-US makers
 *                 quote and what most sources for these cars report, so the whole column is
 *                 kept on that basis rather than mixed with US 0-60 mph times, which run
 *                 roughly 0.3s quicker
 *   topSpeedMph   manufacturer top speed; many modern cars are electronically limited
 *   priceUsd      launch MSRP in US dollars, NOMINAL (not inflation adjusted)
 *   kg            curb weight in kilograms
 *   litres        engine displacement, or null for pure electric cars
 *   electrified   true for hybrids and EVs — excluded from the power-per-litre category,
 *                 where a battery's contribution would make the number meaningless
 *   rotary        true for Wankel engines, also excluded from power-per-litre: a 1.3L
 *                 twin-rotor is widely reckoned equivalent to roughly double that, so
 *                 ranking one against piston engines is an argument, not a question
 *   fame          1-5, how likely a non-enthusiast is to recognise it (5 = household name)
 *   verified      true once this car's numbers have been spot-checked against published
 *                 sources (see "Verification" below). Absent means not yet checked — that
 *                 is NOT the same as wrong, just unconfirmed.
 *   ambiguousNameplate
 *                 true when "make + model" alone doesn't identify one real car — e.g.
 *                 "Bentley Continental GT" spans three generations (2003-2025) with very
 *                 different specs. The round view shows the year for every category except
 *                 oldest/newest (categories below), which resolves this for those
 *                 categories: knowing "this is the 2003 one" tells you exactly which car is
 *                 meant.
 *   firstYear     for an ambiguousNameplate car, the year the NAMEPLATE first launched, if
 *                 that differs from `year` (the specific variant these specs describe). The
 *                 oldest/newest categories ask "which of these has existed longest", not
 *                 "guess this exact variant's model year" — see the categories themselves —
 *                 so they sort by firstYear when present, falling back to `year` otherwise.
 *                 Example: cadillac-escalade-2007 describes the 2007 (2nd-gen) Escalade's
 *                 specs, but the Escalade nameplate began in 1999, so firstYear: 1999.
 *   disputedOrigin
 *                 true when even "when did this nameplate first appear" has no single
 *                 agreed answer — e.g. Camaro ZL1 could mean the 1969 COPO drag-racing
 *                 option or the 2012 first regular-production ZL1 trim, and reasonable
 *                 people pick different sides. Rather than assert one as fact, these cars
 *                 are excluded from oldest/newest entirely; they play normally elsewhere.
 *
 * Verification
 *   `npm run verify:data` prints how many cars carry `verified: true`. When spot-checking
 *   more of the pool against sources, sample from the UNVERIFIED cars so repeat passes
 *   don't re-check the same ones — `node scripts/list-unverified.js` prints them. Add
 *   `verified: true` to a car once its figures have been checked and are correct or fixed.
 *   A `// TODO verify: ...` comment marks a specific field that's still an open question
 *   (a source conflict, an ambiguous trim) even on an otherwise-verified car — grep for
 *   `TODO verify` before trusting a disputed number.
 *
 * IMPORTANT — these numbers are rounded, single-variant approximations chosen for
 * gameplay, not a spec database. Real cars vary by trim, market, and model year, and
 * launch prices are nominal so a 1965 car looks "cheap" next to a 2015 one. Rounds are
 * generated with a minimum-gap rule (see shared/rounds.js) so the ordering never hinges on
 * a difference small enough for this imprecision to make an answer wrong.
 *
 * To swap in a live API later, replace this module's CARS export with your adapter's
 * output in the same shape. Nothing else in the game reads car data directly.
 */

export const CARS = [
  // ---------- Italian exotica ----------
  { id: 'ferrari-dino-246-1969', make: 'Ferrari', model: 'Dino 246 GT', year: 1969, hp: 195, accelSec: 7.1, topSpeedMph: 148, priceUsd: 14500, kg: 1260, litres: 2.4, fame: 3, verified: true },
  { id: 'ferrari-512bb-1976', make: 'Ferrari', model: '512 BB', year: 1976, hp: 360, accelSec: 5.4, topSpeedMph: 176, priceUsd: 55000, kg: 1515, litres: 5.0, fame: 3, verified: true },
  { id: 'ferrari-288gto-1984', make: 'Ferrari', model: '288 GTO', year: 1984, hp: 400, accelSec: 4.9, topSpeedMph: 189, priceUsd: 83400, kg: 1160, litres: 2.9, fame: 3, verified: true },
  { id: 'ferrari-testarossa-1984', make: 'Ferrari', model: 'Testarossa', year: 1984, hp: 385, accelSec: 5.2, topSpeedMph: 180, priceUsd: 181000, kg: 1506, litres: 4.9, fame: 5, verified: true },
  { id: 'ferrari-f40-1987', make: 'Ferrari', model: 'F40', year: 1987, hp: 471, accelSec: 4.2, topSpeedMph: 201, priceUsd: 399000, kg: 1100, litres: 2.9, fame: 5, verified: true }, // TODO verify: price — one source claimed ~$200k, but $399k is the figure most widely and consistently cited for the US launch; kept pending a stronger source either way
  { id: 'ferrari-348tb-1989', make: 'Ferrari', model: '348 tb', year: 1989, hp: 300, accelSec: 5.6, topSpeedMph: 171, priceUsd: 105000, kg: 1393, litres: 3.4, fame: 3, verified: true },
  { id: 'ferrari-enzo-2002', make: 'Ferrari', model: 'Enzo', year: 2002, hp: 651, accelSec: 3.3, topSpeedMph: 218, priceUsd: 659000, kg: 1365, litres: 6.0, fame: 5, verified: true },
  { id: 'ferrari-458-2009', make: 'Ferrari', model: '458 Italia', year: 2009, hp: 562, accelSec: 3.3, topSpeedMph: 202, priceUsd: 233000, kg: 1485, litres: 4.5, fame: 4, verified: true },
  { id: 'ferrari-laferrari-2013', make: 'Ferrari', model: 'LaFerrari', year: 2013, hp: 949, accelSec: 2.6, topSpeedMph: 217, priceUsd: 1416000, kg: 1585, litres: 6.3, electrified: true, fame: 4, verified: true },
  { id: 'ferrari-812-2017', make: 'Ferrari', model: '812 Superfast', year: 2017, hp: 789, accelSec: 2.9, topSpeedMph: 211, priceUsd: 335000, kg: 1630, litres: 6.5, fame: 3, verified: true },
  { id: 'lambo-miura-1966', make: 'Lamborghini', model: 'Miura P400', year: 1966, hp: 350, accelSec: 6.7, topSpeedMph: 171, priceUsd: 20000, kg: 1292, litres: 3.9, fame: 4, verified: true },
  { id: 'lambo-espada-1968', make: 'Lamborghini', model: 'Espada', year: 1968, hp: 325, accelSec: 7.8, topSpeedMph: 155, priceUsd: 21000, kg: 1660, litres: 3.9, fame: 2, verified: true },
  { id: 'lambo-countach-1974', make: 'Lamborghini', model: 'Countach LP400', year: 1974, hp: 375, accelSec: 5.4, topSpeedMph: 179, priceUsd: 52000, kg: 1360, litres: 3.9, fame: 5, verified: true },
  { id: 'lambo-diablo-1990', make: 'Lamborghini', model: 'Diablo', year: 1990, hp: 485, accelSec: 4.5, topSpeedMph: 202, priceUsd: 239000, kg: 1576, litres: 5.7, fame: 4, verified: true },
  { id: 'lambo-murcielago-2001', make: 'Lamborghini', model: 'Murciélago', year: 2001, hp: 572, accelSec: 3.8, topSpeedMph: 205, priceUsd: 273000, kg: 1650, litres: 6.2, fame: 4, verified: true },
  { id: 'lambo-aventador-2011', make: 'Lamborghini', model: 'Aventador LP700-4', year: 2011, hp: 691, accelSec: 2.9, topSpeedMph: 217, priceUsd: 379700, kg: 1625, litres: 6.5, fame: 5, verified: true },
  { id: 'lambo-huracan-2014', make: 'Lamborghini', model: 'Huracán LP610-4', year: 2014, hp: 602, accelSec: 3.2, topSpeedMph: 202, priceUsd: 241000, kg: 1422, litres: 5.2, fame: 4, verified: true },
  { id: 'lambo-urus-2018', make: 'Lamborghini', model: 'Urus', year: 2018, hp: 641, accelSec: 3.6, topSpeedMph: 190, priceUsd: 200000, kg: 2200, litres: 4.0, fame: 4, verified: true },
  { id: 'pagani-zonda-1999', make: 'Pagani', model: 'Zonda C12', year: 1999, hp: 394, accelSec: 4.2, topSpeedMph: 185, priceUsd: 320000, kg: 1250, litres: 6.0, fame: 3, verified: true },
  { id: 'pagani-huayra-2011', make: 'Pagani', model: 'Huayra', year: 2011, hp: 720, accelSec: 3.0, topSpeedMph: 230, priceUsd: 1400000, kg: 1350, litres: 6.0, fame: 3, verified: true },
  { id: 'maserati-ghibli-1967', make: 'Maserati', model: 'Ghibli', year: 1967, hp: 330, accelSec: 6.8, topSpeedMph: 155, priceUsd: 19000, kg: 1590, litres: 4.7, fame: 2, verified: true },
  { id: 'maserati-mc12-2004', make: 'Maserati', model: 'MC12', year: 2004, hp: 621, accelSec: 3.8, topSpeedMph: 205, priceUsd: 670000, kg: 1450, litres: 6.0, fame: 2, verified: true },
  { id: 'maserati-quattroporte-2013', make: 'Maserati', model: 'Quattroporte GTS', year: 2013, hp: 523, accelSec: 4.7, topSpeedMph: 191, priceUsd: 138900, kg: 1900, litres: 3.8, fame: 3, verified: true },
  { id: 'alfa-spider-1966', make: 'Alfa Romeo', model: 'Spider Duetto', year: 1966, hp: 109, accelSec: 11.2, topSpeedMph: 115, priceUsd: 4000, kg: 1040, litres: 1.6, fame: 3, verified: true },
  { id: 'alfa-8c-2007', make: 'Alfa Romeo', model: '8C Competizione', year: 2007, hp: 444, accelSec: 4.2, topSpeedMph: 181, priceUsd: 300000, kg: 1585, litres: 4.7, fame: 2, verified: true },
  { id: 'alfa-giulia-qv-2016', make: 'Alfa Romeo', model: 'Giulia Quadrifoglio', year: 2016, hp: 505, accelSec: 3.8, topSpeedMph: 191, priceUsd: 72000, kg: 1620, litres: 2.9, fame: 3, verified: true },
  { id: 'lancia-stratos-1973', make: 'Lancia', model: 'Stratos HF', year: 1973, hp: 190, accelSec: 6.0, topSpeedMph: 143, priceUsd: 25000, kg: 980, litres: 2.4, fame: 3, verified: true },
  { id: 'lancia-037-1982', make: 'Lancia', model: 'Rally 037', year: 1982, hp: 205, accelSec: 6.0, topSpeedMph: 137, priceUsd: 45000, kg: 1170, litres: 2.0, fame: 2, verified: true },
  { id: 'lancia-integrale-1991', make: 'Lancia', model: 'Delta HF Integrale', year: 1991, hp: 210, accelSec: 5.7, topSpeedMph: 137, priceUsd: 40000, kg: 1300, litres: 2.0, fame: 3, verified: true },
  { id: 'fiat-panda-1980', make: 'Fiat', model: 'Panda 45', year: 1980, hp: 45, accelSec: 20.0, topSpeedMph: 84, priceUsd: 4000, kg: 700, litres: 0.9, fame: 3, verified: true },
  { id: 'fiat-124-spider-1966', make: 'Fiat', model: '124 Spider', year: 1966, hp: 90, accelSec: 11.9, topSpeedMph: 106, priceUsd: 3000, kg: 940, litres: 1.4, fame: 2, verified: true },

  // ---------- Germany ----------
  { id: 'porsche-930-turbo-1975', make: 'Porsche', model: '911 Turbo (930)', year: 1975, hp: 256, accelSec: 5.2, topSpeedMph: 153, priceUsd: 25850, kg: 1195, litres: 3.0, fame: 5, verified: true },
  { id: 'porsche-928-1977', make: 'Porsche', model: '928', year: 1977, hp: 240, accelSec: 7.0, topSpeedMph: 143, priceUsd: 28500, kg: 1450, litres: 4.5, fame: 3, verified: true },
  { id: 'porsche-944-1982', make: 'Porsche', model: '944', year: 1982, hp: 143, accelSec: 8.3, topSpeedMph: 130, priceUsd: 18980, kg: 1180, litres: 2.5, fame: 3, verified: true },
  { id: 'porsche-959-1986', make: 'Porsche', model: '959', year: 1986, hp: 444, accelSec: 3.6, topSpeedMph: 197, priceUsd: 225000, kg: 1450, litres: 2.9, fame: 3, verified: true },
  { id: 'porsche-964-carrera-1989', make: 'Porsche', model: '911 Carrera 4 (964)', year: 1989, hp: 247, accelSec: 5.7, topSpeedMph: 162, priceUsd: 60000, kg: 1450, litres: 3.6, fame: 4, verified: true },
  { id: 'porsche-boxster-1996', make: 'Porsche', model: 'Boxster', year: 1996, hp: 201, accelSec: 6.7, topSpeedMph: 149, priceUsd: 39980, kg: 1250, litres: 2.5, fame: 4, verified: true },
  { id: 'porsche-cayenne-turbo-2003', ambiguousNameplate: true, make: 'Porsche', model: 'Cayenne Turbo', year: 2003, hp: 450, accelSec: 5.4, topSpeedMph: 165, priceUsd: 89665, kg: 2355, litres: 4.5, fame: 4, verified: true },
  { id: 'porsche-carrera-gt-2004', make: 'Porsche', model: 'Carrera GT', year: 2004, hp: 603, accelSec: 4.0, topSpeedMph: 205, priceUsd: 448000, kg: 1380, litres: 5.7, fame: 4, verified: true },
  { id: 'porsche-cayman-s-2005', make: 'Porsche', model: 'Cayman S', year: 2005, hp: 291, accelSec: 5.1, topSpeedMph: 171, priceUsd: 58900, kg: 1350, litres: 3.4, fame: 4, verified: true },
  { id: 'porsche-918-2013', make: 'Porsche', model: '918 Spyder', year: 2013, hp: 887, accelSec: 2.5, topSpeedMph: 214, priceUsd: 845000, kg: 1674, litres: 4.6, electrified: true, fame: 4, verified: true },
  { id: 'porsche-gt3rs-2018', make: 'Porsche', model: '911 GT3 RS (991.2)', year: 2018, hp: 513, accelSec: 3.0, topSpeedMph: 193, priceUsd: 187500, kg: 1430, litres: 4.0, fame: 4, verified: true },
  { id: 'porsche-taycan-ts-2019', make: 'Porsche', model: 'Taycan Turbo S', year: 2019, hp: 750, accelSec: 2.6, topSpeedMph: 161, priceUsd: 185000, kg: 2295, litres: null, electrified: true, fame: 4, verified: true },
  { id: 'bmw-2002-turbo-1973', make: 'BMW', model: '2002 Turbo', year: 1973, hp: 168, accelSec: 7.0, topSpeedMph: 130, priceUsd: 6600, kg: 1080, litres: 2.0, fame: 2, verified: true },
  { id: 'bmw-m1-1978', make: 'BMW', model: 'M1', year: 1978, hp: 273, accelSec: 5.6, topSpeedMph: 162, priceUsd: 50000, kg: 1300, litres: 3.5, fame: 3, verified: true },
  { id: 'bmw-m3-e30-1986', make: 'BMW', model: 'M3 (E30)', year: 1986, hp: 197, accelSec: 6.7, topSpeedMph: 146, priceUsd: 34000, kg: 1165, litres: 2.3, fame: 4, verified: true },
  { id: 'bmw-850i-1989', make: 'BMW', model: '850i', year: 1989, hp: 300, accelSec: 6.8, topSpeedMph: 155, priceUsd: 73000, kg: 1855, litres: 5.0, fame: 3, verified: true },
  { id: 'bmw-z3-1996', make: 'BMW', model: 'Z3 1.9', year: 1996, hp: 138, accelSec: 10.0, topSpeedMph: 121, priceUsd: 28750, kg: 1250, litres: 1.9, fame: 3, verified: true },
  { id: 'bmw-m5-e39-1998', make: 'BMW', model: 'M5 (E39)', year: 1998, hp: 394, accelSec: 5.6, topSpeedMph: 155, priceUsd: 69900, kg: 1795, litres: 4.9, fame: 4, verified: true },
  { id: 'bmw-m3-e46-2000', make: 'BMW', model: 'M3 (E46)', year: 2000, hp: 333, accelSec: 5.1, topSpeedMph: 155, priceUsd: 46000, kg: 1495, litres: 3.2, fame: 4, verified: true },
  { id: 'bmw-m3-f80-2014', make: 'BMW', model: 'M3 (F80)', year: 2014, hp: 425, accelSec: 4.1, topSpeedMph: 155, priceUsd: 62000, kg: 1560, litres: 3.0, fame: 4, verified: true },
  { id: 'bmw-i8-2014', make: 'BMW', model: 'i8', year: 2014, hp: 357, accelSec: 4.2, topSpeedMph: 155, priceUsd: 135700, kg: 1485, litres: 1.5, electrified: true, fame: 3, verified: true },
  { id: 'bmw-m2-comp-2018', make: 'BMW', model: 'M2 Competition', year: 2018, hp: 405, accelSec: 4.4, topSpeedMph: 174, priceUsd: 58900, kg: 1575, litres: 3.0, fame: 3, verified: true },
  { id: 'mercedes-300sl-1954', make: 'Mercedes-Benz', model: '300SL Gullwing', year: 1954, hp: 215, accelSec: 8.8, topSpeedMph: 163, priceUsd: 6820, kg: 1295, litres: 3.0, fame: 4, verified: true },
  { id: 'mercedes-190e-evo2-1990', make: 'Mercedes-Benz', model: '190E 2.5-16 Evo II', year: 1990, hp: 232, accelSec: 7.1, topSpeedMph: 154, priceUsd: 80000, kg: 1340, litres: 2.5, fame: 2, verified: true },
  { id: 'mercedes-500e-1991', make: 'Mercedes-Benz', model: '500E', year: 1991, hp: 322, accelSec: 5.9, topSpeedMph: 155, priceUsd: 93850, kg: 1730, litres: 5.0, fame: 2, verified: true },
  { id: 'mercedes-c63-2008', make: 'Mercedes-Benz', model: 'C63 AMG', year: 2008, hp: 451, accelSec: 5.3, topSpeedMph: 155, priceUsd: 59000, kg: 1730, litres: 6.2, fame: 3, verified: true },
  { id: 'mercedes-sls-2010', make: 'Mercedes-Benz', model: 'SLS AMG', year: 2010, hp: 563, accelSec: 3.7, topSpeedMph: 197, priceUsd: 183000, kg: 1620, litres: 6.2, fame: 3, verified: true },
  { id: 'mercedes-amg-gtr-2017', make: 'Mercedes-AMG', model: 'GT R', year: 2017, hp: 577, accelSec: 3.5, topSpeedMph: 198, priceUsd: 157000, kg: 1630, litres: 4.0, fame: 3, verified: true },
  { id: 'mercedes-g63-2018', make: 'Mercedes-AMG', model: 'G 63', year: 2018, hp: 577, accelSec: 4.4, topSpeedMph: 137, priceUsd: 147500, kg: 2560, litres: 4.0, fame: 4, verified: true },
  { id: 'audi-quattro-1980', make: 'Audi', model: 'Quattro', year: 1980, hp: 197, accelSec: 7.1, topSpeedMph: 137, priceUsd: 35000, kg: 1290, litres: 2.1, fame: 3, verified: true },
  { id: 'audi-tt-1998', make: 'Audi', model: 'TT 1.8T', year: 1998, hp: 178, accelSec: 7.4, topSpeedMph: 141, priceUsd: 30500, kg: 1280, litres: 1.8, fame: 4, verified: true },
  { id: 'audi-rs4-b5-2000', make: 'Audi', model: 'RS4 (B5)', year: 2000, hp: 375, accelSec: 4.9, topSpeedMph: 165, priceUsd: 55000, kg: 1620, litres: 2.7, fame: 3, verified: true },
  { id: 'audi-r8-v10-2009', ambiguousNameplate: true, firstYear: 2006,make: 'Audi', model: 'R8 V10', year: 2009, hp: 518, accelSec: 3.9, topSpeedMph: 196, priceUsd: 146000, kg: 1620, litres: 5.2, fame: 4, verified: true },
  { id: 'audi-rs6-c7-2013', make: 'Audi', model: 'RS6 Avant (C7)', year: 2013, hp: 552, accelSec: 3.7, topSpeedMph: 155, priceUsd: 108900, kg: 2100, litres: 4.0, fame: 3, verified: true },
  { id: 'vw-beetle-1968', make: 'Volkswagen', model: 'Beetle 1500', year: 1968, hp: 53, accelSec: 23.0, topSpeedMph: 78, priceUsd: 1699, kg: 820, litres: 1.5, fame: 5, verified: true },
  { id: 'vw-scirocco-1974', make: 'Volkswagen', model: 'Scirocco', year: 1974, hp: 85, accelSec: 10.5, topSpeedMph: 106, priceUsd: 4500, kg: 830, litres: 1.5, fame: 2, verified: true },
  { id: 'vw-golf-gti-mk1-1976', make: 'Volkswagen', model: 'Golf GTI Mk1', year: 1976, hp: 110, accelSec: 9.0, topSpeedMph: 110, priceUsd: 5000, kg: 810, litres: 1.6, fame: 4, verified: true },
  { id: 'vw-corrado-g60-1988', make: 'Volkswagen', model: 'Corrado G60', year: 1988, hp: 158, accelSec: 8.0, topSpeedMph: 140, priceUsd: 20000, kg: 1200, litres: 1.8, fame: 2, verified: true },
  { id: 'vw-golf-gti-mk5-2004', make: 'Volkswagen', model: 'Golf GTI Mk5', year: 2004, hp: 197, accelSec: 6.9, topSpeedMph: 146, priceUsd: 22000, kg: 1336, litres: 2.0, fame: 4, verified: true },
  { id: 'vw-golf-r-2015', make: 'Volkswagen', model: 'Golf R Mk7', year: 2015, hp: 292, accelSec: 4.9, topSpeedMph: 155, priceUsd: 36470, kg: 1476, litres: 2.0, fame: 3, verified: true },
  { id: 'smart-fortwo-1998', make: 'Smart', model: 'Fortwo', year: 1998, hp: 55, accelSec: 15.5, topSpeedMph: 84, priceUsd: 12000, kg: 730, litres: 0.6, fame: 4, verified: true },
  { id: 'opel-manta-1970', make: 'Opel', model: 'Manta A', year: 1970, hp: 88, accelSec: 11.0, topSpeedMph: 106, priceUsd: 3000, kg: 1000, litres: 1.9, fame: 2, verified: true },
  { id: 'lotus-carlton-1990', make: 'Vauxhall', model: 'Lotus Carlton', year: 1990, hp: 377, accelSec: 5.2, topSpeedMph: 177, priceUsd: 48000, kg: 1660, litres: 3.6, fame: 2, verified: true },

  // ---------- Britain ----------
  { id: 'jaguar-xk120-1948', make: 'Jaguar', model: 'XK120', year: 1948, hp: 160, accelSec: 10.0, topSpeedMph: 120, priceUsd: 3900, kg: 1295, litres: 3.4, fame: 3, verified: true },
  { id: 'jaguar-etype-1961', make: 'Jaguar', model: 'E-Type Series 1', year: 1961, hp: 265, accelSec: 6.9, topSpeedMph: 150, priceUsd: 5595, kg: 1315, litres: 3.8, fame: 5, verified: true },
  { id: 'jaguar-xjs-1975', make: 'Jaguar', model: 'XJS V12', year: 1975, hp: 285, accelSec: 7.6, topSpeedMph: 153, priceUsd: 19000, kg: 1755, litres: 5.3, fame: 3, verified: true },
  { id: 'jaguar-xj220-1992', make: 'Jaguar', model: 'XJ220', year: 1992, hp: 542, accelSec: 3.7, topSpeedMph: 213, priceUsd: 850000, kg: 1470, litres: 3.5, fame: 3, verified: true },
  { id: 'jaguar-ftype-r-2013', make: 'Jaguar', model: 'F-Type R', year: 2013, hp: 550, accelSec: 4.0, topSpeedMph: 186, priceUsd: 99000, kg: 1730, litres: 5.0, fame: 3, verified: true },
  { id: 'aston-db5-1963', make: 'Aston Martin', model: 'DB5', year: 1963, hp: 282, accelSec: 7.1, topSpeedMph: 145, priceUsd: 12000, kg: 1465, litres: 4.0, fame: 5, verified: true },
  { id: 'aston-v8-vantage-1977', make: 'Aston Martin', model: 'V8 Vantage (1977)', year: 1977, hp: 390, accelSec: 5.4, topSpeedMph: 170, priceUsd: 35000, kg: 1800, litres: 5.3, fame: 2, verified: true },
  { id: 'aston-vantage-v8-2005', make: 'Aston Martin', model: 'V8 Vantage (2005)', year: 2005, hp: 380, accelSec: 5.0, topSpeedMph: 175, priceUsd: 110000, kg: 1630, litres: 4.3, fame: 3, verified: true },
  { id: 'aston-one77-2009', make: 'Aston Martin', model: 'One-77', year: 2009, hp: 750, accelSec: 3.5, topSpeedMph: 220, priceUsd: 1650000, kg: 1630, litres: 7.3, fame: 2, verified: true },
  { id: 'aston-db11-2016', make: 'Aston Martin', model: 'DB11 V12', year: 2016, hp: 600, accelSec: 3.9, topSpeedMph: 200, priceUsd: 211995, kg: 1875, litres: 5.2, fame: 3, verified: true },
  { id: 'mclaren-f1-1992', make: 'McLaren', model: 'F1', year: 1992, hp: 618, accelSec: 3.2, topSpeedMph: 240, priceUsd: 815000, kg: 1138, litres: 6.1, fame: 5, verified: true },
  { id: 'mclaren-12c-2011', make: 'McLaren', model: 'MP4-12C', year: 2011, hp: 592, accelSec: 3.1, topSpeedMph: 207, priceUsd: 229500, kg: 1434, litres: 3.8, fame: 3, verified: true },
  { id: 'mclaren-p1-2013', make: 'McLaren', model: 'P1', year: 2013, hp: 903, accelSec: 2.8, topSpeedMph: 217, priceUsd: 1150000, kg: 1490, litres: 3.8, electrified: true, fame: 4, verified: true },
  { id: 'mclaren-720s-2017', make: 'McLaren', model: '720S', year: 2017, hp: 710, accelSec: 2.8, topSpeedMph: 212, priceUsd: 284745, kg: 1419, litres: 4.0, fame: 3, verified: true },
  { id: 'lotus-elise-1996', make: 'Lotus', model: 'Elise S1', year: 1996, hp: 118, accelSec: 5.8, topSpeedMph: 126, priceUsd: 30000, kg: 725, litres: 1.8, fame: 3, verified: true },
  { id: 'lotus-esprit-v8-1996', make: 'Lotus', model: 'Esprit V8', year: 1996, hp: 350, accelSec: 4.9, topSpeedMph: 175, priceUsd: 80000, kg: 1378, litres: 3.5, fame: 3, verified: true },
  { id: 'tvr-sagaris-2005', make: 'TVR', model: 'Sagaris', year: 2005, hp: 400, accelSec: 3.7, topSpeedMph: 185, priceUsd: 80000, kg: 1078, litres: 4.0, fame: 2, verified: true },
  { id: 'noble-m600-2010', make: 'Noble', model: 'M600', year: 2010, hp: 650, accelSec: 3.0, topSpeedMph: 225, priceUsd: 330000, kg: 1198, litres: 4.4, fame: 1, verified: true },
  { id: 'caterham-620r-2013', make: 'Caterham', model: 'Seven 620R', year: 2013, hp: 310, accelSec: 2.8, topSpeedMph: 155, priceUsd: 78000, kg: 572, litres: 2.0, fame: 2, verified: true },
  { id: 'ariel-atom3-2007', make: 'Ariel', model: 'Atom 3', year: 2007, hp: 245, accelSec: 3.3, topSpeedMph: 155, priceUsd: 60000, kg: 520, litres: 2.0, fame: 2, verified: true },
  { id: 'mini-cooper-s-1963', make: 'Mini', model: 'Cooper S', year: 1963, hp: 70, accelSec: 11.2, topSpeedMph: 96, priceUsd: 1500, kg: 640, litres: 1.1, fame: 4, verified: true },
  { id: 'mini-cooper-s-r53-2002', make: 'Mini', model: 'Cooper S (R53)', year: 2002, hp: 163, accelSec: 7.2, topSpeedMph: 135, priceUsd: 19999, kg: 1160, litres: 1.6, fame: 4, verified: true },
  { id: 'mini-jcw-gp-2020', make: 'Mini', model: 'John Cooper Works GP', year: 2020, hp: 302, accelSec: 5.2, topSpeedMph: 165, priceUsd: 45000, kg: 1334, litres: 2.0, fame: 2, verified: true },
  { id: 'landrover-discovery-1989', make: 'Land Rover', model: 'Discovery 200Tdi', year: 1989, hp: 111, accelSec: 15.0, topSpeedMph: 92, priceUsd: 25000, kg: 1900, litres: 2.5, fame: 3, verified: true },
  { id: 'landrover-defender90-1990', make: 'Land Rover', model: 'Defender 90 V8', year: 1990, hp: 134, accelSec: 14.7, topSpeedMph: 82, priceUsd: 25000, kg: 1900, litres: 3.5, fame: 4, verified: true },
  { id: 'rangerover-svr-2015', ambiguousNameplate: true, make: 'Land Rover', model: 'Range Rover Sport SVR', year: 2015, hp: 550, accelSec: 4.5, topSpeedMph: 162, priceUsd: 110475, kg: 2335, litres: 5.0, fame: 3, verified: true },
  { id: 'bentley-continental-gt-2003', ambiguousNameplate: true, make: 'Bentley', model: 'Continental GT', year: 2003, hp: 552, accelSec: 4.7, topSpeedMph: 198, priceUsd: 149990, kg: 2385, litres: 6.0, fame: 4, verified: true },
  { id: 'rolls-silver-shadow-1965', make: 'Rolls-Royce', model: 'Silver Shadow', year: 1965, hp: 172, accelSec: 10.9, topSpeedMph: 118, priceUsd: 20000, kg: 2100, litres: 6.2, fame: 3, verified: true },
  { id: 'rolls-phantom-2003', make: 'Rolls-Royce', model: 'Phantom VII', year: 2003, hp: 453, accelSec: 5.7, topSpeedMph: 149, priceUsd: 320000, kg: 2560, litres: 6.8, fame: 4, verified: true },

  // ---------- Japan ----------
  { id: 'toyota-2000gt-1967', make: 'Toyota', model: '2000GT', year: 1967, hp: 150, accelSec: 8.4, topSpeedMph: 128, priceUsd: 6800, kg: 1120, litres: 2.0, fame: 2, verified: true },
  { id: 'toyota-ae86-1983', make: 'Toyota', model: 'Corolla AE86', year: 1983, hp: 128, accelSec: 8.5, topSpeedMph: 118, priceUsd: 8500, kg: 920, litres: 1.6, fame: 4, verified: true },
  { id: 'toyota-mr2-aw11-1984', make: 'Toyota', model: 'MR2 (AW11)', year: 1984, hp: 112, accelSec: 8.5, topSpeedMph: 115, priceUsd: 10999, kg: 1066, litres: 1.6, fame: 3, verified: true },
  { id: 'toyota-mr2-sw20-1989', make: 'Toyota', model: 'MR2 Turbo (SW20)', year: 1989, hp: 200, accelSec: 6.1, topSpeedMph: 149, priceUsd: 24000, kg: 1270, litres: 2.0, fame: 3, verified: true },
  { id: 'toyota-hilux-1990', make: 'Toyota', model: 'Hilux 2.4', year: 1990, hp: 116, accelSec: 13.0, topSpeedMph: 96, priceUsd: 14000, kg: 1600, litres: 2.4, fame: 4, verified: true },
  { id: 'toyota-landcruiser-80-1990', make: 'Toyota', model: 'Land Cruiser 80', year: 1990, hp: 212, accelSec: 12.0, topSpeedMph: 106, priceUsd: 35000, kg: 2200, litres: 4.5, fame: 4, verified: true },
  { id: 'toyota-supra-a80-1993', make: 'Toyota', model: 'Supra Turbo (A80)', year: 1993, hp: 320, accelSec: 4.6, topSpeedMph: 155, priceUsd: 40000, kg: 1570, litres: 3.0, fame: 5, verified: true },
  { id: 'toyota-celica-st205-1994', make: 'Toyota', model: 'Celica GT-Four (ST205)', year: 1994, hp: 252, accelSec: 5.9, topSpeedMph: 155, priceUsd: 35000, kg: 1420, litres: 2.0, fame: 3, verified: true },
  { id: 'toyota-prius-1997', make: 'Toyota', model: 'Prius (NHW10)', year: 1997, hp: 58, accelSec: 13.4, topSpeedMph: 100, priceUsd: 17000, kg: 1250, litres: 1.5, electrified: true, fame: 5, verified: true },
  { id: 'toyota-gt86-2012', make: 'Toyota', model: 'GT86', year: 2012, hp: 200, accelSec: 7.2, topSpeedMph: 140, priceUsd: 24200, kg: 1250, litres: 2.0, fame: 4, verified: true },
  { id: 'toyota-gr-yaris-2020', make: 'Toyota', model: 'GR Yaris', year: 2020, hp: 268, accelSec: 5.5, topSpeedMph: 143, priceUsd: 40000, kg: 1280, litres: 1.6, fame: 3, verified: true },
  { id: 'lexus-ls400-1989', make: 'Lexus', model: 'LS400', year: 1989, hp: 250, accelSec: 8.5, topSpeedMph: 155, priceUsd: 35000, kg: 1705, litres: 4.0, fame: 3, verified: true },
  { id: 'lexus-isf-2007', make: 'Lexus', model: 'IS-F', year: 2007, hp: 416, accelSec: 5.6, topSpeedMph: 170, priceUsd: 56000, kg: 1715, litres: 5.0, fame: 2, verified: true },
  { id: 'lexus-lfa-2010', make: 'Lexus', model: 'LFA', year: 2010, hp: 553, accelSec: 3.6, topSpeedMph: 202, priceUsd: 375000, kg: 1614, litres: 4.8, fame: 3, verified: true },
  { id: 'nissan-skyline-r32-1989', make: 'Nissan', model: 'Skyline GT-R (R32)', year: 1989, hp: 276, accelSec: 5.6, topSpeedMph: 155, priceUsd: 35000, kg: 1430, litres: 2.6, fame: 4, verified: true },
  { id: 'nissan-240sx-1989', make: 'Nissan', model: '240SX', year: 1989, hp: 140, accelSec: 9.0, topSpeedMph: 122, priceUsd: 13249, kg: 1230, litres: 2.4, fame: 3, verified: true },
  { id: 'nissan-300zx-tt-1990', make: 'Nissan', model: '300ZX Twin Turbo', year: 1990, hp: 300, accelSec: 5.6, topSpeedMph: 155, priceUsd: 33000, kg: 1560, litres: 3.0, fame: 3, verified: true },
  { id: 'nissan-micra-1992', make: 'Nissan', model: 'Micra K11', year: 1992, hp: 55, accelSec: 15.0, topSpeedMph: 90, priceUsd: 9000, kg: 810, litres: 1.0, fame: 3, verified: true },
  { id: 'nissan-skyline-r33-1995', make: 'Nissan', model: 'Skyline GT-R (R33)', year: 1995, hp: 276, accelSec: 5.0, topSpeedMph: 156, priceUsd: 40000, kg: 1530, litres: 2.6, fame: 4, verified: true },
  { id: 'nissan-skyline-r34-1999', make: 'Nissan', model: 'Skyline GT-R (R34)', year: 1999, hp: 276, accelSec: 4.9, topSpeedMph: 165, priceUsd: 45000, kg: 1560, litres: 2.6, fame: 5, verified: true },
  { id: 'nissan-silvia-s15-1999', make: 'Nissan', model: 'Silvia S15 Spec-R', year: 1999, hp: 247, accelSec: 5.5, topSpeedMph: 149, priceUsd: 25000, kg: 1240, litres: 2.0, fame: 3, verified: true },
  { id: 'nissan-gtr-r35-2007', make: 'Nissan', model: 'GT-R (R35)', year: 2007, hp: 480, accelSec: 3.5, topSpeedMph: 193, priceUsd: 69850, kg: 1740, litres: 3.8, fame: 5, verified: true },
  { id: 'nissan-370z-2009', make: 'Nissan', model: '370Z', year: 2009, hp: 332, accelSec: 5.1, topSpeedMph: 155, priceUsd: 29930, kg: 1520, litres: 3.7, fame: 4, verified: true },
  { id: 'nissan-leaf-2010', ambiguousNameplate: true, make: 'Nissan', model: 'Leaf', year: 2010, hp: 107, accelSec: 9.9, topSpeedMph: 93, priceUsd: 32780, kg: 1521, litres: null, electrified: true, fame: 4, verified: true },
  { id: 'mazda-rx7-fc-1986', make: 'Mazda', model: 'RX-7 Turbo II (FC)', year: 1986, hp: 182, accelSec: 6.7, topSpeedMph: 130, priceUsd: 20000, kg: 1260, litres: 1.3, rotary: true, fame: 3, verified: true },
  { id: 'mazda-mx5-na-1989', make: 'Mazda', model: 'MX-5 (NA)', year: 1989, hp: 116, accelSec: 8.6, topSpeedMph: 118, priceUsd: 13800, kg: 955, litres: 1.6, fame: 5, verified: true },
  { id: 'mazda-rx7-fd-1992', make: 'Mazda', model: 'RX-7 (FD)', year: 1992, hp: 255, accelSec: 5.3, topSpeedMph: 156, priceUsd: 32000, kg: 1310, litres: 1.3, rotary: true, fame: 4, verified: true },
  { id: 'mazda-323-gtr-1992', make: 'Mazda', model: '323 GT-R', year: 1992, hp: 207, accelSec: 6.2, topSpeedMph: 130, priceUsd: 22000, kg: 1250, litres: 1.8, fame: 1, verified: true },
  { id: 'mazda-rx8-2003', make: 'Mazda', model: 'RX-8', year: 2003, hp: 238, accelSec: 6.4, topSpeedMph: 146, priceUsd: 26750, kg: 1310, litres: 1.3, rotary: true, fame: 3, verified: true },
  { id: 'mazda-mx5-nd-2015', make: 'Mazda', model: 'MX-5 (ND)', year: 2015, hp: 155, accelSec: 6.5, topSpeedMph: 133, priceUsd: 24915, kg: 1058, litres: 2.0, fame: 4, verified: true },
  { id: 'honda-nsx-1990', make: 'Honda', model: 'NSX', year: 1990, hp: 270, accelSec: 5.7, topSpeedMph: 168, priceUsd: 60000, kg: 1365, litres: 3.0, fame: 4, verified: true },
  { id: 'honda-beat-1991', make: 'Honda', model: 'Beat', year: 1991, hp: 63, accelSec: 11.0, topSpeedMph: 84, priceUsd: 12000, kg: 760, litres: 0.7, fame: 2, verified: true },
  { id: 'honda-prelude-vtec-1992', make: 'Honda', model: 'Prelude VTEC', year: 1992, hp: 187, accelSec: 7.0, topSpeedMph: 140, priceUsd: 24000, kg: 1250, litres: 2.2, fame: 3, verified: true },
  { id: 'honda-integra-dc2-1995', make: 'Honda', model: 'Integra Type R (DC2)', year: 1995, hp: 195, accelSec: 6.2, topSpeedMph: 145, priceUsd: 24000, kg: 1060, litres: 1.8, fame: 3, verified: true },
  { id: 'honda-civic-ek9-1997', make: 'Honda', model: 'Civic Type R (EK9)', year: 1997, hp: 182, accelSec: 6.7, topSpeedMph: 140, priceUsd: 20000, kg: 1040, litres: 1.6, fame: 3, verified: true },
  { id: 'honda-s2000-1999', make: 'Honda', model: 'S2000', year: 1999, hp: 240, accelSec: 5.8, topSpeedMph: 150, priceUsd: 32000, kg: 1250, litres: 2.0, fame: 4, verified: true },
  { id: 'honda-nsx-nc1-2016', make: 'Honda', model: 'NSX (NC1)', year: 2016, hp: 573, accelSec: 3.0, topSpeedMph: 191, priceUsd: 156000, kg: 1725, litres: 3.5, electrified: true, fame: 3, verified: true },
  { id: 'honda-civic-fk8-2017', make: 'Honda', model: 'Civic Type R (FK8)', year: 2017, hp: 306, accelSec: 5.7, topSpeedMph: 169, priceUsd: 34775, kg: 1380, litres: 2.0, fame: 4, verified: true },
  { id: 'mitsubishi-3000gt-1991', make: 'Mitsubishi', model: '3000GT VR-4', year: 1991, hp: 300, accelSec: 5.7, topSpeedMph: 155, priceUsd: 33000, kg: 1730, litres: 3.0, fame: 3, verified: true },
  { id: 'mitsubishi-pajero-1991', make: 'Mitsubishi', model: 'Pajero 3.0 V6', year: 1991, hp: 141, accelSec: 12.5, topSpeedMph: 99, priceUsd: 25000, kg: 1900, litres: 3.0, fame: 3, verified: true },
  { id: 'mitsubishi-evo6-1999', make: 'Mitsubishi', model: 'Lancer Evo VI', year: 1999, hp: 276, accelSec: 4.7, topSpeedMph: 150, priceUsd: 35000, kg: 1360, litres: 2.0, fame: 4, verified: true },
  { id: 'subaru-22b-1998', make: 'Subaru', model: 'Impreza 22B STI', year: 1998, hp: 276, accelSec: 5.0, topSpeedMph: 150, priceUsd: 40000, kg: 1270, litres: 2.2, fame: 3, verified: true },
  { id: 'subaru-wrx-sti-2004', make: 'Subaru', model: 'Impreza WRX STI', year: 2004, hp: 300, accelSec: 4.8, topSpeedMph: 155, priceUsd: 31545, kg: 1470, litres: 2.5, fame: 4, verified: true },
  { id: 'subaru-brz-2012', make: 'Subaru', model: 'BRZ', year: 2012, hp: 200, accelSec: 7.0, topSpeedMph: 140, priceUsd: 25495, kg: 1250, litres: 2.0, fame: 3, verified: true },
  { id: 'suzuki-swift-gti-1989', make: 'Suzuki', model: 'Swift GTi', year: 1989, hp: 101, accelSec: 8.6, topSpeedMph: 115, priceUsd: 9000, kg: 810, litres: 1.3, fame: 2, verified: true },
  { id: 'suzuki-jimny-1998', make: 'Suzuki', model: 'Jimny', year: 1998, hp: 80, accelSec: 17.0, topSpeedMph: 87, priceUsd: 14000, kg: 1000, litres: 1.3, fame: 3, verified: true },
  { id: 'daihatsu-copen-2002', make: 'Daihatsu', model: 'Copen', year: 2002, hp: 63, accelSec: 11.7, topSpeedMph: 90, priceUsd: 16000, kg: 830, litres: 0.7, fame: 2, verified: true },

  // ---------- United States ----------
  { id: 'ford-thunderbird-1955', make: 'Ford', model: 'Thunderbird', year: 1955, hp: 198, accelSec: 11.0, topSpeedMph: 110, priceUsd: 2944, kg: 1350, litres: 4.8, fame: 3, verified: true },
  { id: 'chevy-bel-air-1957', make: 'Chevrolet', model: 'Bel Air', year: 1957, hp: 283, accelSec: 9.0, topSpeedMph: 110, priceUsd: 2400, kg: 1550, litres: 4.6, fame: 4, verified: true },
  { id: 'lincoln-continental-1961', make: 'Lincoln', model: 'Continental', year: 1961, hp: 300, accelSec: 11.0, topSpeedMph: 105, priceUsd: 6000, kg: 2300, litres: 7.0, fame: 2, verified: true },
  { id: 'chevy-corvette-c2-1963', make: 'Chevrolet', model: 'Corvette Sting Ray', year: 1963, hp: 360, accelSec: 5.9, topSpeedMph: 142, priceUsd: 4257, kg: 1370, litres: 5.4, fame: 5, verified: true },
  { id: 'pontiac-gto-1964', make: 'Pontiac', model: 'GTO', year: 1964, hp: 348, accelSec: 6.6, topSpeedMph: 122, priceUsd: 3200, kg: 1600, litres: 6.4, fame: 4, verified: true },
  { id: 'ford-mustang-289-1965', make: 'Ford', model: 'Mustang GT 289', year: 1965, hp: 271, accelSec: 6.5, topSpeedMph: 120, priceUsd: 2734, kg: 1350, litres: 4.7, fame: 5, verified: true },
  { id: 'shelby-cobra-427-1965', make: 'Shelby', model: 'Cobra 427', year: 1965, hp: 425, accelSec: 4.2, topSpeedMph: 165, priceUsd: 7500, kg: 1130, litres: 7.0, fame: 4, verified: true },
  { id: 'dodge-charger-rt-1968', make: 'Dodge', model: 'Charger R/T', year: 1968, hp: 375, accelSec: 6.4, topSpeedMph: 130, priceUsd: 3480, kg: 1746, litres: 7.2, fame: 5, verified: true },
  { id: 'chevy-camaro-z28-1969', make: 'Chevrolet', model: 'Camaro Z/28', year: 1969, hp: 290, accelSec: 6.9, topSpeedMph: 120, priceUsd: 3250, kg: 1520, litres: 5.7, fame: 4, verified: true },
  { id: 'ford-mustang-boss429-1969', make: 'Ford', model: 'Mustang Boss 429', year: 1969, hp: 375, accelSec: 5.5, topSpeedMph: 118, priceUsd: 4798, kg: 1746, litres: 7.0, fame: 3, verified: true },
  { id: 'amc-gremlin-1970', make: 'AMC', model: 'Gremlin', year: 1970, hp: 128, accelSec: 16.0, topSpeedMph: 95, priceUsd: 1879, kg: 1195, litres: 3.8, fame: 2, verified: true },
  { id: 'chevy-chevelle-454-1970', make: 'Chevrolet', model: 'Chevelle SS 454', year: 1970, hp: 450, accelSec: 6.0, topSpeedMph: 125, priceUsd: 3800, kg: 1745, litres: 7.4, fame: 4, verified: true },
  { id: 'plymouth-hemi-cuda-1970', make: 'Plymouth', model: 'Hemi Barracuda', year: 1970, hp: 425, accelSec: 6.1, topSpeedMph: 128, priceUsd: 4200, kg: 1700, litres: 7.0, fame: 3, verified: true },
  { id: 'pontiac-trans-am-1977', make: 'Pontiac', model: 'Firebird Trans Am', year: 1977, hp: 200, accelSec: 9.5, topSpeedMph: 123, priceUsd: 5456, kg: 1700, litres: 6.6, fame: 4, verified: true },
  { id: 'delorean-dmc12-1981', make: 'DeLorean', model: 'DMC-12', year: 1981, hp: 130, accelSec: 10.5, topSpeedMph: 120, priceUsd: 25000, kg: 1230, litres: 2.8, fame: 5, verified: true },
  { id: 'buick-gnx-1987', make: 'Buick', model: 'GNX', year: 1987, hp: 276, accelSec: 4.7, topSpeedMph: 124, priceUsd: 29290, kg: 1650, litres: 3.8, fame: 3, verified: true },
  { id: 'gmc-syclone-1991', make: 'GMC', model: 'Syclone', year: 1991, hp: 280, accelSec: 4.6, topSpeedMph: 126, priceUsd: 25970, kg: 1560, litres: 4.3, fame: 2, verified: true },
  { id: 'dodge-viper-1992', make: 'Dodge', model: 'Viper RT/10', year: 1992, hp: 400, accelSec: 4.6, topSpeedMph: 165, priceUsd: 50000, kg: 1490, litres: 8.0, fame: 4, verified: true },
  { id: 'hummer-h1-1992', make: 'Hummer', model: 'H1', year: 1992, hp: 170, accelSec: 17.0, topSpeedMph: 75, priceUsd: 45000, kg: 3000, litres: 6.5, fame: 4, verified: true },
  { id: 'ford-escort-cosworth-1992', make: 'Ford', model: 'Escort RS Cosworth', year: 1992, hp: 227, accelSec: 5.8, topSpeedMph: 143, priceUsd: 33000, kg: 1275, litres: 2.0, fame: 3, verified: true },
  { id: 'jeep-wrangler-tj-1997', make: 'Jeep', model: 'Wrangler TJ', year: 1997, hp: 181, accelSec: 8.4, topSpeedMph: 100, priceUsd: 20000, kg: 1600, litres: 4.0, fame: 4, verified: true },
  { id: 'chrysler-pt-cruiser-2000', make: 'Chrysler', model: 'PT Cruiser', year: 2000, hp: 150, accelSec: 9.9, topSpeedMph: 116, priceUsd: 16000, kg: 1400, litres: 2.4, fame: 4, verified: true },
  { id: 'ford-gt-2005', make: 'Ford', model: 'GT', year: 2005, hp: 550, accelSec: 3.5, topSpeedMph: 205, priceUsd: 149995, kg: 1580, litres: 5.4, fame: 4, verified: true },
  { id: 'cadillac-escalade-2007', ambiguousNameplate: true, firstYear: 1999,make: 'Cadillac', model: 'Escalade', year: 2007, hp: 403, accelSec: 6.5, topSpeedMph: 112, priceUsd: 57280, kg: 2670, litres: 6.2, fame: 4, verified: true },
  { id: 'ford-fiesta-st-2013', make: 'Ford', model: 'Fiesta ST', year: 2013, hp: 197, accelSec: 6.7, topSpeedMph: 137, priceUsd: 21400, kg: 1257, litres: 1.6, fame: 3, verified: true },
  { id: 'dodge-hellcat-2015', make: 'Dodge', model: 'Challenger SRT Hellcat', year: 2015, hp: 707, accelSec: 3.6, topSpeedMph: 199, priceUsd: 59995, kg: 2018, litres: 6.2, fame: 4, verified: true },
  { id: 'cadillac-ctsv-2016', make: 'Cadillac', model: 'CTS-V', year: 2016, hp: 640, accelSec: 3.6, topSpeedMph: 200, priceUsd: 85000, kg: 1880, litres: 6.2, fame: 3, verified: true },
  { id: 'tesla-model-s-p100d-2016', make: 'Tesla', model: 'Model S P100D', year: 2016, hp: 680, accelSec: 2.5, topSpeedMph: 155, priceUsd: 134500, kg: 2250, litres: null, electrified: true, fame: 5, verified: true },
  { id: 'ford-focus-rs-2016', make: 'Ford', model: 'Focus RS Mk3', year: 2016, hp: 350, accelSec: 4.7, topSpeedMph: 165, priceUsd: 36775, kg: 1575, litres: 2.3, fame: 3, verified: true },
  { id: 'ford-raptor-2017', ambiguousNameplate: true, firstYear: 2010,make: 'Ford', model: 'F-150 Raptor', year: 2017, hp: 450, accelSec: 5.2, topSpeedMph: 107, priceUsd: 49520, kg: 2560, litres: 3.5, fame: 4, verified: true },
  { id: 'chevy-camaro-zl1-2017', ambiguousNameplate: true, disputedOrigin: true,make: 'Chevrolet', model: 'Camaro ZL1', year: 2017, hp: 650, accelSec: 3.5, topSpeedMph: 198, priceUsd: 62135, kg: 1837, litres: 6.2, fame: 3, verified: true },
  { id: 'tesla-model-3-2017', make: 'Tesla', model: 'Model 3 Long Range', year: 2017, hp: 271, accelSec: 5.1, topSpeedMph: 145, priceUsd: 49000, kg: 1700, litres: null, electrified: true, fame: 5, verified: true },
  { id: 'chevy-corvette-zr1-2019', make: 'Chevrolet', model: 'Corvette ZR1 (C7)', year: 2019, hp: 755, accelSec: 2.9, topSpeedMph: 212, priceUsd: 119995, kg: 1615, litres: 6.2, fame: 4, verified: true },
  { id: 'ford-shelby-gt500-2020', make: 'Ford', model: 'Mustang Shelby GT500', year: 2020, hp: 760, accelSec: 3.3, topSpeedMph: 180, priceUsd: 72900, kg: 1904, litres: 5.2, fame: 4, verified: true },
  { id: 'ford-mach-e-gt-2021', make: 'Ford', model: 'Mustang Mach-E GT', year: 2021, hp: 480, accelSec: 4.0, topSpeedMph: 124, priceUsd: 61000, kg: 2100, litres: null, electrified: true, fame: 3, verified: true },
  { id: 'rivian-r1t-2022', make: 'Rivian', model: 'R1T', year: 2022, hp: 835, accelSec: 3.8, topSpeedMph: 110, priceUsd: 85000, kg: 3175, litres: null, electrified: true, fame: 3, verified: true },
  { id: 'chevy-corvette-z06-2023', make: 'Chevrolet', model: 'Corvette Z06 (C8)', year: 2023, hp: 670, accelSec: 2.6, topSpeedMph: 195, priceUsd: 106395, kg: 1560, litres: 5.5, fame: 4, verified: true },
  { id: 'hennessey-venom-gt-2011', make: 'Hennessey', model: 'Venom GT', year: 2011, hp: 1244, accelSec: 2.7, topSpeedMph: 270, priceUsd: 1200000, kg: 1244, litres: 7.0, fame: 2, verified: true },

  // ---------- Rest of Europe ----------
  { id: 'citroen-ds-1955', make: 'Citroën', model: 'DS 19', year: 1955, hp: 75, accelSec: 20.0, topSpeedMph: 90, priceUsd: 3000, kg: 1250, litres: 1.9, fame: 3, verified: true },
  { id: 'volvo-p1800-1961', make: 'Volvo', model: 'P1800', year: 1961, hp: 100, accelSec: 12.0, topSpeedMph: 106, priceUsd: 4000, kg: 1150, litres: 1.8, fame: 3, verified: true },
  { id: 'ford-capri-1969', make: 'Ford', model: 'Capri 3000GT', year: 1969, hp: 126, accelSec: 10.0, topSpeedMph: 113, priceUsd: 3000, kg: 1100, litres: 3.0, fame: 3, verified: true },
  { id: 'citroen-sm-1970', make: 'Citroën', model: 'SM', year: 1970, hp: 170, accelSec: 8.5, topSpeedMph: 137, priceUsd: 12000, kg: 1450, litres: 2.7, fame: 2, verified: true },
  { id: 'ford-escort-mexico-1970', make: 'Ford', model: 'Escort Mexico', year: 1970, hp: 86, accelSec: 10.7, topSpeedMph: 100, priceUsd: 2500, kg: 900, litres: 1.6, fame: 2, verified: true },
  { id: 'volvo-240-1975', make: 'Volvo', model: '240', year: 1975, hp: 97, accelSec: 13.5, topSpeedMph: 100, priceUsd: 6000, kg: 1300, litres: 2.1, fame: 4, verified: true },
  { id: 'saab-99-turbo-1978', make: 'Saab', model: '99 Turbo', year: 1978, hp: 145, accelSec: 9.0, topSpeedMph: 121, priceUsd: 11000, kg: 1250, litres: 2.0, fame: 2, verified: true },
  { id: 'saab-900-turbo-1978', make: 'Saab', model: '900 Turbo', year: 1978, hp: 143, accelSec: 9.2, topSpeedMph: 121, priceUsd: 12000, kg: 1250, litres: 2.0, fame: 3, verified: true },
  { id: 'renault-5-turbo-1980', make: 'Renault', model: '5 Turbo', year: 1980, hp: 158, accelSec: 6.9, topSpeedMph: 124, priceUsd: 30000, kg: 970, litres: 1.4, fame: 3, verified: true },
  { id: 'peugeot-205-gti-1986', make: 'Peugeot', model: '205 GTI 1.9', year: 1986, hp: 128, accelSec: 7.6, topSpeedMph: 124, priceUsd: 15000, kg: 910, litres: 1.9, fame: 3, verified: true },
  { id: 'ford-sierra-rs500-1987', make: 'Ford', model: 'Sierra RS500 Cosworth', year: 1987, hp: 224, accelSec: 6.1, topSpeedMph: 154, priceUsd: 30000, kg: 1240, litres: 2.0, fame: 3, verified: true },
  { id: 'bugatti-eb110-1991', make: 'Bugatti', model: 'EB110 GT', year: 1991, hp: 553, accelSec: 3.4, topSpeedMph: 213, priceUsd: 350000, kg: 1566, litres: 3.5, fame: 2, verified: true }, // TODO verify: price — a £300k UK figure converts closer to $500-570k at 1991 rates than to $350k
  { id: 'renault-clio-williams-1993', make: 'Renault', model: 'Clio Williams', year: 1993, hp: 148, accelSec: 7.6, topSpeedMph: 134, priceUsd: 22000, kg: 981, litres: 2.0, fame: 2, verified: true },
  { id: 'peugeot-106-rallye-1993', make: 'Peugeot', model: '106 Rallye', year: 1993, hp: 100, accelSec: 10.3, topSpeedMph: 121, priceUsd: 12000, kg: 825, litres: 1.3, fame: 2, verified: true },
  { id: 'volvo-850-r-1996', make: 'Volvo', model: '850 R', year: 1996, hp: 240, accelSec: 6.9, topSpeedMph: 145, priceUsd: 42000, kg: 1490, litres: 2.3, fame: 2, verified: true },
  { id: 'peugeot-306-gti6-1996', make: 'Peugeot', model: '306 GTI-6', year: 1996, hp: 167, accelSec: 7.4, topSpeedMph: 132, priceUsd: 20000, kg: 1200, litres: 2.0, fame: 2, verified: true },
  { id: 'citroen-saxo-vts-1996', make: 'Citroën', model: 'Saxo VTS', year: 1996, hp: 118, accelSec: 8.7, topSpeedMph: 127, priceUsd: 14000, kg: 935, litres: 1.6, fame: 2, verified: true },
  { id: 'bugatti-veyron-2005', make: 'Bugatti', model: 'Veyron 16.4', year: 2005, hp: 1001, accelSec: 2.5, topSpeedMph: 253, priceUsd: 1250000, kg: 1888, litres: 8.0, fame: 5, verified: true },
  { id: 'koenigsegg-ccx-2006', make: 'Koenigsegg', model: 'CCX', year: 2006, hp: 806, accelSec: 3.2, topSpeedMph: 245, priceUsd: 545000, kg: 1180, litres: 4.7, fame: 3, verified: true },
  { id: 'renault-megane-rs275-2014', make: 'Renault', model: 'Mégane RS 275 Trophy', year: 2014, hp: 271, accelSec: 5.8, topSpeedMph: 158, priceUsd: 35000, kg: 1387, litres: 2.0, fame: 2, verified: true },
  { id: 'bugatti-chiron-2016', make: 'Bugatti', model: 'Chiron', year: 2016, hp: 1479, accelSec: 2.4, topSpeedMph: 261, priceUsd: 2998000, kg: 1996, litres: 8.0, fame: 5, verified: true },
  { id: 'hyundai-i30n-2017', make: 'Hyundai', model: 'i30 N', year: 2017, hp: 271, accelSec: 6.1, topSpeedMph: 155, priceUsd: 29000, kg: 1429, litres: 2.0, fame: 2, verified: true },
  { id: 'kia-stinger-gt-2017', make: 'Kia', model: 'Stinger GT', year: 2017, hp: 365, accelSec: 4.7, topSpeedMph: 167, priceUsd: 39250, kg: 1870, litres: 3.3, fame: 2, verified: true },
  { id: 'koenigsegg-jesko-2019', make: 'Koenigsegg', model: 'Jesko', year: 2019, hp: 1280, accelSec: 2.5, topSpeedMph: 278, priceUsd: 3000000, kg: 1420, litres: 5.0, fame: 3, verified: true },
  { id: 'hyundai-ioniq5n-2024', make: 'Hyundai', model: 'Ioniq 5 N', year: 2024, hp: 641, accelSec: 3.4, topSpeedMph: 161, priceUsd: 67000, kg: 2200, litres: null, electrified: true, fame: 3, verified: true },

  // ---------- Australia & New Zealand ----------
  { id: 'holden-monaro-gts327-1968', make: 'Holden', model: 'Monaro HK GTS 327', year: 1968, hp: 250, accelSec: 7.6, topSpeedMph: 125, priceUsd: 4000, kg: 1450, litres: 5.4, fame: 2, verified: true },
  { id: 'ford-falcon-gtho-1971', make: 'Ford', model: 'Falcon XY GTHO Phase III', year: 1971, hp: 380, accelSec: 6.4, topSpeedMph: 141, priceUsd: 5300, kg: 1524, litres: 5.8, fame: 3, verified: true },
  { id: 'holden-commodore-groupa-1988', make: 'Holden', model: 'Commodore VL Group A', year: 1988, hp: 241, accelSec: 6.5, topSpeedMph: 149, priceUsd: 45000, kg: 1400, litres: 5.0, fame: 2, verified: true },
];

export const CARS_BY_ID = new Map(CARS.map((c) => [c.id, c]));

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
 * first launched. `firstYear` carries that date when it differs from the specific
 * variant's `year`; most cars don't need it because the two are the same.
 */
const ageValue = (c) => c.firstYear ?? c.year;

/** Excluded from age categories only: see `disputedOrigin` above. */
const hasUndisputedOrigin = (car) => !car.disputedOrigin;

/** Generic display used by the round engine: title/subtitle/meta replace make/model/year. */
const display = (c) => ({ title: c.model, subtitle: c.make, meta: c.year });

/** Cars this category can actually rank. */
export const eligibleCars = (category, cars) =>
  category.eligible ? cars.filter(category.eligible) : cars;

const CATEGORIES = [
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
    note: 'Sprint to 100 km/h (62 mph).',
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
    note: 'Manufacturer figures.',
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
    note: 'Horsepower per tonne.',
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
    note: 'How hard the engine works for its size.',
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
    note: 'The actual number on the window sticker the day it launched — in that year’s dollars, not adjusted for inflation.',
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
    note: 'The actual number on the window sticker the day it launched — in that year’s dollars, not adjusted for inflation.',
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
    note: `Launch price compounded at a flat ${Math.round(AVERAGE_ANNUAL_INFLATION * 100)}%/year`,
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
    hidesMeta: true,
    note: 'About when the nameplate itself first launched.',
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
    hidesMeta: true,
    note: 'About when the nameplate itself first launched.',
  },
];

export const cars = {
  key: 'cars',
  name: 'Cars',
  items: CARS,
  display,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `cars:${c.key}`, deckKey: 'cars', deckName: 'Cars', pool: CARS, display })),
};

export default cars;
