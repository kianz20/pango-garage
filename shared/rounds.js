import { CARS } from './cars.js';
import { CATEGORIES, CATEGORY_BY_KEY, eligibleCars } from './categories.js';

export const LINEUP_SIZE = 4;

/** Fisher-Yates, in place. */
function shuffle(arr, rand = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const sortByCategory = (cars, category) => {
  const sign = category.dir === 'asc' ? 1 : -1;
  return [...cars].sort((a, b) => sign * (category.value(a) - category.value(b)));
};

/**
 * Are all adjacent pairs separated enough that the ordering is unambiguous?
 * Guards against lineups where two cars are 3 hp apart and the "right" answer is really
 * a coin flip given how approximate the pool's numbers are.
 */
function wellSeparated(sorted, category, slack = 1) {
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = category.value(sorted[i]);
    const b = category.value(sorted[i + 1]);
    if (a === b) return false;
    if (category.minAbsGap != null) {
      if (Math.abs(b - a) < category.minAbsGap * slack) return false;
    } else {
      const rel = Math.abs(b - a) / Math.max(Math.abs(a), Math.abs(b));
      if (rel < (category.minRelGap ?? 0.1) * slack) return false;
    }
  }
  return true;
}

/**
 * Pick one lineup for a category.
 *
 * Tries hard for a lineup that is famous enough and cleanly separated, then relaxes both
 * constraints rather than failing — a slightly tighter round beats no round.
 */
function pickLineup({ category, pool, minFame, rand, attempts = 400 }) {
  const relaxations = [
    { fame: minFame, slack: 1 },
    { fame: minFame, slack: 0.6 },
    { fame: Math.max(1, minFame - 1), slack: 0.6 },
    { fame: 1, slack: 0.3 },
  ];

  // A category can only draw from cars it can rank — no displacement round for EVs.
  const rankable = eligibleCars(category, pool);

  for (const { fame, slack } of relaxations) {
    const candidates = rankable.filter((c) => c.fame >= fame);
    if (candidates.length < LINEUP_SIZE) continue;
    for (let i = 0; i < attempts; i++) {
      const picked = shuffle([...candidates], rand).slice(0, LINEUP_SIZE);
      const sorted = sortByCategory(picked, category);
      if (wellSeparated(sorted, category, slack)) return sorted;
    }
  }
  return null;
}

/**
 * Build a category schedule: varied, never the same category twice in a row, and never
 * two categories reading the same axis back to back (heaviest then lightest is a cheap
 * gotcha, not a good round).
 */
function buildSchedule(count, rand) {
  const schedule = [];
  let bag = [];
  while (schedule.length < count) {
    if (bag.length === 0) bag = shuffle([...CATEGORIES], rand);
    const prev = schedule[schedule.length - 1];
    let idx = bag.findIndex((c) => !prev || c.axis !== prev.axis);
    if (idx === -1) {
      // The bag is down to categories that would repeat the previous axis. Top it up from
      // a fresh shuffle rather than accepting the repeat; the leftovers stay in play.
      bag = shuffle([...bag, ...CATEGORIES], rand);
      idx = bag.findIndex((c) => c.axis !== prev.axis);
      if (idx === -1) idx = 0; // only reachable if every category shares one axis
    }
    schedule.push(...bag.splice(idx, 1));
  }
  return schedule;
}

/**
 * Generate a whole game's worth of rounds.
 *
 * Difficulty ramps by loosening the fame floor: early rounds use cars everybody knows,
 * later rounds reach into the pool's deeper cuts. No car appears twice in one game.
 *
 * @returns {Array<{index:number, categoryKey:string, cars:object[], correctOrder:string[]}>}
 */
export function buildRounds({ count = 8, rand = Math.random, cars = CARS } = {}) {
  const schedule = buildSchedule(count, rand);
  const used = new Set();
  const rounds = [];

  schedule.forEach((category, index) => {
    // 5,5,4,4,3,3,2,2... for an 8-round game.
    const minFame = Math.max(2, 5 - Math.floor((index * 4) / Math.max(1, count)));
    const pool = cars.filter((c) => !used.has(c.id));
    const lineup = pickLineup({ category, pool, minFame, rand });
    if (!lineup) return;

    lineup.forEach((c) => used.add(c.id));
    rounds.push({
      index,
      categoryKey: category.key,
      // Display order is shuffled so position on screen leaks nothing.
      cars: shuffle([...lineup], rand),
      correctOrder: lineup.map((c) => c.id),
    });
  });

  return rounds;
}

/**
 * The client-safe view of a round: no stat values, so nothing to inspect in devtools.
 *
 * The year is included UNLESS the round is actually about age (oldest/newest) — hiding it
 * there is the whole point of that category, but hiding it everywhere else only makes a
 * nameplate that spans multiple eras (e.g. "Continental GT" spans three generations across
 * 2003-2025 with very different specs) impossible to answer: the player has no way to know
 * which real car is meant. Showing the year outside age rounds fixes that for free, since
 * year isn't the thing being tested there.
 */
export function publicRound(round, { totalRounds, endsAt, durationMs }) {
  const category = CATEGORY_BY_KEY.get(round.categoryKey);
  const showYear = category.axis !== 'year';
  return {
    index: round.index,
    totalRounds,
    endsAt,
    durationMs,
    category: {
      key: category.key,
      title: category.title,
      prompt: category.prompt,
      statLabel: category.statLabel,
      note: category.note,
    },
    cars: round.cars.map((c) => ({
      id: c.id,
      make: c.make,
      model: c.model,
      ...(showYear ? { year: c.year } : {}),
    })),
  };
}

/** The reveal view: now with the answer and the numbers behind it. */
export function revealRound(round) {
  const category = CATEGORY_BY_KEY.get(round.categoryKey);
  const byId = new Map(round.cars.map((c) => [c.id, c]));
  // On an age round the "value" column already shows the release year, so repeating a
  // (possibly different) variant year next to the model name would read as a contradiction
  // — e.g. "Escalade '07 ... 1999" — rather than as extra context.
  const showVariantYear = category.axis !== 'year';
  return {
    index: round.index,
    categoryKey: round.categoryKey,
    statLabel: category.statLabel,
    correctOrder: round.correctOrder.map((id) => {
      const car = byId.get(id);
      return {
        id,
        make: car.make,
        model: car.model,
        year: showVariantYear ? car.year : null,
        value: category.format(category.value(car)),
      };
    }),
  };
}
