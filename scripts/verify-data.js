/**
 * Sanity checks for every deck's item pool, the round generator, and the scoring function.
 *
 * Run with `npm run verify`. Exits non-zero on any failure, so it works as a pre-deploy
 * gate — a bad lineup is only visible at a party otherwise.
 */
import { CARS } from '../shared/decks/cars.js';
import { DECKS, ALL_CATEGORIES, CATEGORY_BY_FQKEY } from '../shared/decks/index.js';
import { buildRounds, LINEUP_SIZE } from '../shared/rounds.js';
import { scoreSubmission, pairCount } from '../shared/scoring.js';

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

// ---------------------------------------------------------------- car pool integrity

console.log(`\nCar pool (${CARS.length} cars)`);

const seen = new Set();
const seenNames = new Set();
const RANGES = {
  year: [1945, 2030],
  hp: [10, 2000],
  accelSec: [1.5, 40],
  topSpeedMph: [60, 300],
  priceUsd: [400, 5_000_000],
  kg: [400, 3500],
  fame: [1, 5],
};

for (const car of CARS) {
  const label = `${car.make} ${car.model}`;
  if (!car.id) fail(`${label} has no id`);
  if (seen.has(car.id)) fail(`duplicate id: ${car.id}`);
  seen.add(car.id);
  if (!car.make || !car.model) fail(`${car.id} is missing make or model`);

  // Two cars a player can't tell apart on screen would make a round unanswerable.
  const nameKey = `${car.make}|${car.model}`.toLowerCase();
  if (seenNames.has(nameKey)) fail(`two cars display identically: ${label}`);
  seenNames.add(nameKey);

  for (const [field, [lo, hi]] of Object.entries(RANGES)) {
    const v = car[field];
    if (typeof v !== 'number' || Number.isNaN(v)) fail(`${car.id}.${field} is not a number`);
    else if (v < lo || v > hi) fail(`${car.id}.${field} = ${v} is outside ${lo}..${hi}`);
  }

  // litres is null for EVs and a real displacement for everything else.
  if (car.litres === undefined) fail(`${car.id}.litres is missing (use null for EVs)`);
  else if (car.litres !== null) {
    if (car.litres < 0.5 || car.litres > 8.5) fail(`${car.id}.litres = ${car.litres} looks wrong`);
    if (!car.electrified) {
      const perLitre = car.hp / car.litres;
      if (perLitre < 15 || perLitre > 300) {
        fail(`${car.id}: ${Math.round(perLitre)} hp/L is implausible — check hp or litres`);
      }
    }
  } else if (!car.electrified) {
    fail(`${car.id} has no engine but is not flagged electrified`);
  }

  // Power-to-weight sanity, which catches a misplaced decimal in hp or kg.
  const ptw = (car.hp / car.kg) * 1000;
  if (ptw < 25 || ptw > 1100) fail(`${car.id}: ${Math.round(ptw)} hp/tonne is implausible`);

  // A car that hits 100 km/h in under 5s but claims a low top speed is almost certainly a
  // typo. EVs are exempt: they really do pair savage launches with modest top speeds.
  if (car.accelSec < 5 && car.topSpeedMph < 100 && !car.electrified) {
    fail(`${car.id}: ${car.accelSec}s to 100 km/h but only ${car.topSpeedMph} mph top speed`);
  }

  // firstYear only means something on a car whose nameplate ambiguity is why it exists,
  // and it should actually differ from `year` — otherwise it's a no-op left behind by a
  // copy-paste.
  if (car.firstYear !== undefined) {
    if (!car.ambiguousNameplate) fail(`${car.id}.firstYear set without ambiguousNameplate`);
    if (typeof car.firstYear !== 'number' || car.firstYear > car.year) {
      fail(`${car.id}.firstYear (${car.firstYear}) should be a number no later than year (${car.year})`);
    }
    if (car.firstYear === car.year) fail(`${car.id}.firstYear equals year — redundant, just omit it`);
  }
  if (car.disputedOrigin && !car.ambiguousNameplate) {
    fail(`${car.id}.disputedOrigin set without ambiguousNameplate`);
  }
}
if (failures === 0) pass(`every car has complete, plausible, mutually consistent specs`);

const evs = CARS.filter((c) => c.litres === null);
const hybrids = CARS.filter((c) => c.electrified && c.litres !== null);
console.log(
  `  ${CARS.length} cars · ${evs.length} electric · ${hybrids.length} hybrid · ` +
    `${new Set(CARS.map((c) => c.make)).size} manufacturers · ` +
    `${Math.min(...CARS.map((c) => c.year))}–${Math.max(...CARS.map((c) => c.year))}`
);

const ambiguous = CARS.filter((c) => c.ambiguousNameplate);
const disputed = CARS.filter((c) => c.disputedOrigin);
console.log(
  `  ${ambiguous.length} multi-era nameplates (year shown outside age rounds), ` +
    `${disputed.length} excluded from age rounds entirely (disputed origin)`
);

const verifiedCount = CARS.filter((c) => c.verified).length;
console.log(
  `  ${verifiedCount}/${CARS.length} spot-checked against sources ` +
    `(run \`node scripts/list-unverified.js\` to sample the rest)`
);

// ---------------------------------------------------------------- every deck: generic checks

console.log(`\nAll decks (${DECKS.length} decks, ${ALL_CATEGORIES.length} categories)`);

for (const deck of DECKS) {
  const pools = new Map(); // pool identity -> {items, display}, since categories may not share one pool
  for (const category of deck.categories) {
    pools.set(category.pool, { items: category.pool, display: category.display });
  }

  for (const { items: pool, display } of pools.values()) {
    const ids = new Set();
    for (const item of pool) {
      if (!item.id) fail(`${deck.key}: an item is missing an id`);
      if (ids.has(item.id)) fail(`${deck.key}: duplicate id ${item.id}`);
      ids.add(item.id);

      if (typeof item.fame !== 'number' || item.fame < 1 || item.fame > 5) {
        fail(`${deck.key}: ${item.id}.fame is missing or out of 1..5`);
      }
    }
  }

  for (const category of deck.categories) {
    const usable = category.eligible ? category.pool.filter(category.eligible) : category.pool;

    // A lineup only ever draws from one group at a time (see shared/rounds.js), so two
    // same-displaying items in DIFFERENT groups (or excluded by `eligible`) can never
    // actually appear together — only duplicates within the same eventual lineup pool
    // matter. For an ungrouped category that pool is everything eligible; for a grouped
    // one it's each group in isolation.
    const buckets = category.groupKey
      ? [...usable.reduce((m, it) => {
          const k = category.groupKey(it);
          (m.get(k) ?? m.set(k, []).get(k)).push(it);
          return m;
        }, new Map()).values()]
      : [usable];
    for (const bucket of buckets) {
      const displays = new Set();
      for (const item of bucket) {
        const d = category.display(item);
        const key = `${d.title}|${d.subtitle ?? ''}`.toLowerCase();
        if (displays.has(key)) fail(`${category.fqKey}: two items display identically (${d.title})`);
        displays.add(key);
      }
    }

    const distinct = new Set(usable.map((it) => category.value(it))).size;
    // `minEligible` overrides the usual floor for categories drawing on an inherently small,
    // fixed set of real-world editions (e.g. FIFA World Cups since 1998) — there's no more
    // spread to ask for, they're already all the officially recorded years there are.
    const floor = category.minEligible ?? LINEUP_SIZE * (category.groupKey ? 1 : 4);
    if (usable.length < floor) {
      fail(`${category.fqKey}: only ${usable.length} eligible items`);
    }
    if (!category.groupKey && distinct < floor) {
      fail(`${category.fqKey}: only ${distinct} distinct values — not enough spread`);
    }
    if (usable.some((it) => !Number.isFinite(category.value(it)))) {
      fail(`${category.fqKey}: produces a non-finite value for at least one eligible item`);
    }
  }
}
pass(`all ${ALL_CATEGORIES.length} categories have well-formed, sufficiently spread item pools`);

// ---------------------------------------------------------------- round generation

const GAMES = 500;
const ROUNDS_PER_GAME = 8;

function checkGames({ label, categoryKeys }) {
  console.log(`\nRound generation — ${label} (${GAMES} games × ${ROUNDS_PER_GAME} rounds)`);

  const categoryUse = new Map();
  let shortGames = 0;
  const itemAppearances = new Map();

  for (let g = 0; g < GAMES; g++) {
    const rounds = buildRounds({ count: ROUNDS_PER_GAME, categoryKeys });
    if (rounds.length !== ROUNDS_PER_GAME) shortGames++;

    const usedInGame = new Set();
    rounds.forEach((round, i) => {
      const category = CATEGORY_BY_FQKEY.get(round.categoryKey);
      if (!category) return fail(`round ${i} has unknown category ${round.categoryKey}`);
      categoryUse.set(category.fqKey, (categoryUse.get(category.fqKey) ?? 0) + 1);

      if (round.items.length !== LINEUP_SIZE) fail(`round ${i} has ${round.items.length} items`);
      if (round.correctOrder.length !== LINEUP_SIZE) fail(`round ${i} answer is malformed`);

      for (const item of round.items) {
        if (usedInGame.has(item.id)) fail(`${item.id} appears twice in one game`);
        usedInGame.add(item.id);
        itemAppearances.set(item.id, (itemAppearances.get(item.id) ?? 0) + 1);
      }

      // Every item in the lineup must be one this category can actually rank.
      if (category.eligible && !round.items.every(category.eligible)) {
        fail(`round ${i} (${category.fqKey}) includes an item the category cannot rank`);
      }

      // A grouped category (FIFA's final-four) must only ever mix items from one group.
      if (category.groupKey) {
        const groups = new Set(round.items.map(category.groupKey));
        if (groups.size !== 1) fail(`round ${i} (${category.fqKey}) mixes more than one group`);
      }

      // The answer must actually be sorted by the category's value.
      const values = round.correctOrder.map((id) =>
        category.value(round.items.find((it) => it.id === id))
      );
      const ordered = values.every((v, j) =>
        j === 0 ? true : category.dir === 'asc' ? v > values[j - 1] : v < values[j - 1]
      );
      if (!ordered) fail(`round ${i} (${category.fqKey}) answer is not correctly sorted`);

      if (category.key === 'oldest' || category.key === 'newest') {
        if (round.items.some((it) => it.disputedOrigin)) {
          fail(`round ${i} (${category.fqKey}) includes a disputedOrigin car`);
        }
      }

      if (i > 0) {
        const prev = CATEGORY_BY_FQKEY.get(rounds[i - 1].categoryKey);
        if (prev.axis === category.axis) fail(`rounds ${i - 1}/${i} both read ${category.axis}`);
      }
    });
  }

  if (shortGames) fail(`${shortGames} games came up short of ${ROUNDS_PER_GAME} rounds`);
  else pass(`all ${GAMES} games produced ${ROUNDS_PER_GAME} full rounds`);
  pass('answers are correctly sorted, no item repeats within a game, no repeated stat back-to-back');

  const usedCategories = [...categoryUse.entries()].sort((a, b) => b[1] - a[1]);
  console.log(
    '  categories used:',
    usedCategories.map(([k, n]) => `${k} ${Math.round((n / (GAMES * ROUNDS_PER_GAME)) * 100)}%`).join(', ')
  );
  console.log(`  pool coverage: ${itemAppearances.size} distinct items appeared across ${GAMES} games`);
}

checkGames({ label: 'default (cars only)', categoryKeys: undefined });
checkGames({ label: 'mixed (every category)', categoryKeys: ALL_CATEGORIES.map((c) => c.fqKey) });

// ---------------------------------------------------------------- scoring

console.log('\nScoring');
const order = ['a', 'b', 'c', 'd'];
const totalPairs = pairCount(4);

const perfect = scoreSubmission({ guessOrder: order, correctOrder: order, msRemaining: 25000, msTotal: 25000 });
if (perfect.points !== 1450) fail(`perfect + instant should be 1450, got ${perfect.points}`);
else pass(`perfect answer with full clock = ${perfect.points}`);

const backwards = scoreSubmission({ guessOrder: [...order].reverse(), correctOrder: order, msRemaining: 25000, msTotal: 25000 });
if (backwards.points !== 0) fail(`exactly backwards should be 0, got ${backwards.points}`);
else pass('exactly backwards = 0');

const oneSwap = scoreSubmission({ guessOrder: ['a', 'c', 'b', 'd'], correctOrder: order, msRemaining: 0, msTotal: 25000 });
if (oneSwap.concordant !== totalPairs - 1) fail(`one swap should cost one pair, got ${oneSwap.concordant}`);
else pass(`one adjacent swap = ${oneSwap.concordant}/${totalPairs} pairs, ${oneSwap.points} points`);

const noAnswer = scoreSubmission({ guessOrder: [], correctOrder: order });
if (noAnswer.points !== 0 || noAnswer.answered) fail('a missing answer should score 0 and be flagged unanswered');
else pass('missing answer = 0 and flagged unanswered');

const cheat = scoreSubmission({ guessOrder: ['a', 'a', 'b', 'c'], correctOrder: order });
if (cheat.points !== 0 || cheat.answered) fail('a malformed answer should score 0');
else pass('malformed answer (duplicates) rejected');

// Random play must average near zero, otherwise guessing pays.
const permutations = [];
const permute = (rest, acc = []) => {
  if (!rest.length) return permutations.push(acc);
  rest.forEach((x, i) => permute([...rest.slice(0, i), ...rest.slice(i + 1)], [...acc, x]));
};
permute(order);
const avgRandom =
  permutations.reduce(
    (sum, p) => sum + scoreSubmission({ guessOrder: p, correctOrder: order, msRemaining: 12500, msTotal: 25000 }).points,
    0
  ) / permutations.length;
console.log(`  average over all ${permutations.length} random orderings: ${avgRandom.toFixed(0)} points`);
if (avgRandom > 400) fail(`guessing pays too well (${avgRandom.toFixed(0)})`);
else pass('guessing does not pay');

// ---------------------------------------------------------------- pacing

const { CONFIG } = await import('../server/rooms.js');
// Reveals are host-paced now, so only the answering clock is fixed. Budget ~8s per reveal
// for a host who keeps things moving.
const ASSUMED_REVEAL_MS = 8_000;
const playMs = CONFIG.totalRounds * (CONFIG.roundMs + ASSUMED_REVEAL_MS);
console.log(`\nPacing`);
console.log(
  `  ${CONFIG.totalRounds} rounds × (${CONFIG.roundMs / 1000}s answering + ~${ASSUMED_REVEAL_MS / 1000}s host-paced reveal) = ${(playMs / 60000).toFixed(1)} min`
);
if (playMs > 5.5 * 60000) fail('worst-case play time exceeds the five minute target');
else pass('inside the five minute target at a brisk host pace');

console.log(failures === 0 ? '\nAll checks passed.\n' : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
