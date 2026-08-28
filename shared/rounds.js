import { CATEGORY_BY_FQKEY, DEFAULT_CATEGORY_KEYS, TOPIC_KEY_BY_FQKEY } from './decks/index.js';

export const LINEUP_SIZE = 4;

/** Fisher-Yates, in place. */
function shuffle(arr, rand = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const sortByCategory = (items, category) => {
  const sign = category.dir === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => sign * (category.value(a) - category.value(b)));
};

/** Items a category can actually rank. */
const eligibleItems = (category, items) =>
  category.eligible ? items.filter(category.eligible) : items;

/**
 * Are all adjacent pairs separated enough that the ordering is unambiguous?
 * Guards against lineups where two items are barely apart and the "right" answer is really
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
 * Pick one lineup for a category that draws from its own pool.
 *
 * Tries hard for a lineup that is famous enough and cleanly separated, then relaxes both
 * constraints rather than failing — a slightly tighter round beats no round.
 */
function pickLineup({ category, used, minFame, rand, attempts = 400 }) {
  const relaxations = [
    { fame: minFame, slack: 1 },
    { fame: minFame, slack: 0.6 },
    { fame: Math.max(1, minFame - 1), slack: 0.6 },
    { fame: 1, slack: 0.3 },
  ];

  const rankable = eligibleItems(category, category.pool).filter((it) => !used.has(it.id));

  // A grouped category (FIFA/rugby's final-four, the Olympics medal categories) only ever
  // compares items from the SAME group — e.g. the same World Cup year, or the same Olympic
  // Games — so a round never mixes, say, one country's 2016 medal count against another's
  // 2024 one. See shared/decks/fifa.js for why that also avoids stage ties.
  if (category.groupKey) {
    const groups = new Map();
    for (const item of rankable) {
      const key = category.groupKey(item);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    const candidateGroups = [...groups.values()].filter((g) => g.length >= LINEUP_SIZE);
    for (const { fame, slack } of relaxations) {
      const groupsAtFame = candidateGroups.filter((g) => g.some((it) => it.fame >= fame));
      if (groupsAtFame.length === 0) continue;
      for (let i = 0; i < attempts; i++) {
        const group = shuffle([...groupsAtFame], rand)[0];
        const eligibleInGroup = group.filter((it) => it.fame >= fame);
        if (eligibleInGroup.length < LINEUP_SIZE) continue;
        const picked = shuffle([...eligibleInGroup], rand).slice(0, LINEUP_SIZE);
        const sorted = sortByCategory(picked, category);
        if (wellSeparated(sorted, category, slack)) return sorted;
      }
    }
    return null;
  }

  for (const { fame, slack } of relaxations) {
    const candidates = rankable.filter((it) => it.fame >= fame);
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
 * Build a category schedule.
 *
 * Odds are per SELECTED TOPIC, not per category — a shuffle-bag of topics is drawn from
 * first, refilling only once every topic has had a turn, so Cars' 13 categories don't
 * crowd out Food & Drink's 1 just because there are more of them. A topic can span more
 * than one deck (FIFA and Rugby both count as "Sports", see shared/decks/index.js), so this
 * groups by `topicKey`, not `deckKey`. Within whichever topic comes up, its own categories
 * cycle the same shuffle-bag way. Never the same category twice in a row, and never two
 * categories reading the same axis back to back (heaviest then lightest is a cheap gotcha,
 * not a good round).
 */
function buildSchedule(count, rand, categories) {
  const byTopic = new Map();
  for (const c of categories) {
    const topicKey = TOPIC_KEY_BY_FQKEY.get(c.fqKey);
    if (!byTopic.has(topicKey)) byTopic.set(topicKey, []);
    byTopic.get(topicKey).push(c);
  }
  const topicKeys = [...byTopic.keys()];
  const categoryBags = new Map(topicKeys.map((k) => [k, []]));
  const refill = (topicKey) => shuffle([...byTopic.get(topicKey)], rand);

  const schedule = [];
  let topicBag = [];

  while (schedule.length < count) {
    const prev = schedule[schedule.length - 1];
    if (topicBag.length === 0) topicBag = shuffle([...topicKeys], rand);

    // Try each topic currently in the bag (without consuming the ones we skip) for one
    // whose next category avoids repeating prev's axis.
    let picked = null;
    for (let i = 0; i < topicBag.length && !picked; i++) {
      const topicKey = topicBag[i];
      let bag = categoryBags.get(topicKey);
      if (bag.length === 0) bag = refill(topicKey);
      let idx = bag.findIndex((c) => !prev || c.axis !== prev.axis);
      if (idx === -1) {
        // This topic's current cycle is down to axis-repeating options — give it a fresh
        // cycle before ruling it out for this round entirely.
        bag = shuffle([...bag, ...byTopic.get(topicKey)], rand);
        idx = bag.findIndex((c) => c.axis !== prev.axis);
      }
      if (idx !== -1) {
        const [category] = bag.splice(idx, 1);
        categoryBags.set(topicKey, bag);
        topicBag.splice(i, 1);
        picked = category;
      }
    }

    if (!picked) {
      // Only reachable if every selected category, across every topic, shares one axis.
      const topicKey = topicBag.shift();
      let bag = categoryBags.get(topicKey);
      if (bag.length === 0) bag = refill(topicKey);
      const [category] = bag.splice(0, 1);
      categoryBags.set(topicKey, bag);
      picked = category;
    }

    schedule.push(picked);
  }
  return schedule;
}

/** Resolve the host's chosen fully-qualified category keys, falling back to the default set. */
function resolveCategories(categoryKeys) {
  const resolved = (categoryKeys ?? [])
    .map((k) => CATEGORY_BY_FQKEY.get(k))
    .filter(Boolean);
  if (resolved.length >= 2) return resolved;
  return DEFAULT_CATEGORY_KEYS.map((k) => CATEGORY_BY_FQKEY.get(k));
}

/**
 * Generate a whole game's worth of rounds.
 *
 * Difficulty ramps by loosening the fame floor: early rounds use items everybody knows,
 * later rounds reach into the pool's deeper cuts. No item appears twice in one game.
 *
 * @returns {Array<{index:number, categoryKey:string, items:object[], correctOrder:string[]}>}
 */
export function buildRounds({ count = 8, rand = Math.random, categoryKeys } = {}) {
  const categories = resolveCategories(categoryKeys);
  const schedule = buildSchedule(count, rand, categories);
  const used = new Set();
  const rounds = [];

  schedule.forEach((category, index) => {
    // 5,5,4,4,3,3,2,2... for an 8-round game.
    const minFame = Math.max(2, 5 - Math.floor((index * 4) / Math.max(1, count)));
    const lineup = pickLineup({ category, used, minFame, rand });
    if (!lineup) return;

    lineup.forEach((it) => used.add(it.id));
    rounds.push({
      index,
      categoryKey: category.fqKey,
      // Display order is shuffled so position on screen leaks nothing.
      items: shuffle([...lineup], rand),
      correctOrder: lineup.map((it) => it.id),
    });
  });

  return rounds;
}

/**
 * The client-safe view of a round: no stat values, so nothing to inspect in devtools.
 *
 * `meta` is included UNLESS the category is flagged `hidesMeta` — cars' oldest/newest and
 * FIFA's "year won" ranking are literally asking for that value, so showing it would hand
 * over the answer. Everywhere else, meta (e.g. a car's model year, a phone's release year)
 * exists to disambiguate a title that could otherwise mean more than one real thing.
 */
export function publicRound(round, { totalRounds, endsAt, durationMs }) {
  const category = CATEGORY_BY_FQKEY.get(round.categoryKey);
  const showMeta = !category.hidesMeta;
  return {
    index: round.index,
    totalRounds,
    endsAt,
    durationMs,
    category: {
      key: category.fqKey,
      title: category.title,
      prompt: category.prompt,
      statLabel: category.statLabel,
      note: category.note,
    },
    items: round.items.map((it) => {
      const d = category.display(it);
      return {
        id: it.id,
        title: d.title,
        ...(d.subtitle != null ? { subtitle: d.subtitle } : {}),
        ...(showMeta && d.meta != null ? { meta: d.meta } : {}),
      };
    }),
  };
}

/** The reveal view: now with the answer and the numbers behind it. */
export function revealRound(round) {
  const category = CATEGORY_BY_FQKEY.get(round.categoryKey);
  const byId = new Map(round.items.map((it) => [it.id, it]));
  // On a hidesMeta round the "value" column already shows the meta (e.g. the year), so
  // repeating it next to the title would read as redundant rather than as extra context.
  const showMeta = !category.hidesMeta;
  return {
    index: round.index,
    categoryKey: round.categoryKey,
    statLabel: category.statLabel,
    correctOrder: round.correctOrder.map((id) => {
      const item = byId.get(id);
      const d = category.display(item);
      return {
        id,
        title: d.title,
        subtitle: d.subtitle ?? null,
        meta: showMeta ? d.meta ?? null : null,
        value: category.format(category.value(item)),
      };
    }),
  };
}
