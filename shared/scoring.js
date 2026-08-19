/**
 * Kendall tau scoring.
 *
 * With 4 cars there are 6 orderable pairs. We count how many of them the player put in
 * the right relative order and normalise to tau = (concordant - discordant) / 6, which
 * runs from +1 (perfect) through 0 (no better than a coin flip on every pair) to -1
 * (exactly backwards).
 *
 * Points come only from POSITIVE tau. That is the whole point of using tau here: a random
 * shuffle averages tau = 0, so guessing averages zero points, while a player who knows
 * three of the four cars still banks most of the round. Partial credit without rewarding
 * noise.
 */

export const BASE_POINTS = 1000;
export const PERFECT_BONUS = 250;
export const SPEED_BONUS_MAX = 200;

/** Total orderable pairs in a lineup of n. */
export const pairCount = (n) => (n * (n - 1)) / 2;

/**
 * Count concordant pairs between a guessed order and the true order.
 * Both are arrays of car ids over the same set.
 */
export function concordantPairs(guessOrder, correctOrder) {
  const rank = new Map(guessOrder.map((id, i) => [id, i]));
  let concordant = 0;
  for (let i = 0; i < correctOrder.length; i++) {
    for (let j = i + 1; j < correctOrder.length; j++) {
      const a = rank.get(correctOrder[i]);
      const b = rank.get(correctOrder[j]);
      if (a === undefined || b === undefined) continue;
      if (a < b) concordant++;
    }
  }
  return concordant;
}

/**
 * The pairs a player got backwards, as [shouldBeAboveId, shouldBeBelowId].
 *
 * This is what makes a wrong answer teachable: "you had the Countach above the F40" is
 * useful, "5 of 6" on its own is not.
 */
export function discordantPairs(guessOrder, correctOrder) {
  const rank = new Map(guessOrder.map((id, i) => [id, i]));
  const wrong = [];
  for (let i = 0; i < correctOrder.length; i++) {
    for (let j = i + 1; j < correctOrder.length; j++) {
      const a = rank.get(correctOrder[i]);
      const b = rank.get(correctOrder[j]);
      if (a === undefined || b === undefined) continue;
      if (a > b) wrong.push([correctOrder[i], correctOrder[j]]);
    }
  }
  return wrong;
}

/**
 * Score one submission.
 *
 * @param {string[]} guessOrder    car ids, position 0 = "most" per the category
 * @param {string[]} correctOrder  car ids in true order
 * @param {number} msRemaining     time left on the clock when they locked in
 * @param {number} msTotal         the round's full duration
 */
export function scoreSubmission({ guessOrder, correctOrder, msRemaining = 0, msTotal = 1 }) {
  const total = pairCount(correctOrder.length);
  const valid =
    Array.isArray(guessOrder) &&
    guessOrder.length === correctOrder.length &&
    new Set(guessOrder).size === correctOrder.length &&
    guessOrder.every((id) => correctOrder.includes(id));

  if (!valid || total === 0) {
    return { concordant: 0, totalPairs: total, tau: -1, base: 0, perfectBonus: 0, speedBonus: 0, points: 0, perfect: false, answered: false };
  }

  const concordant = concordantPairs(guessOrder, correctOrder);
  const tau = (2 * concordant) / total - 1;
  const positive = Math.max(0, tau);
  const perfect = concordant === total;

  const base = Math.round(BASE_POINTS * positive);
  const perfectBonus = perfect ? PERFECT_BONUS : 0;
  const fractionLeft = Math.min(1, Math.max(0, msRemaining / Math.max(1, msTotal)));
  const speedBonus = Math.round(SPEED_BONUS_MAX * fractionLeft * positive);

  return {
    concordant,
    totalPairs: total,
    tau,
    base,
    perfectBonus,
    speedBonus,
    points: base + perfectBonus + speedBonus,
    perfect,
    answered: true,
  };
}

/** Sort players into a display leaderboard, highest score first, ties broken by name. */
export function rankPlayers(players) {
  const sorted = [...players].sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name)
  );
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    // Equal scores share a rank: 1, 2, 2, 4 rather than 1, 2, 3, 4.
    const rank = i > 0 && sorted[i].score === sorted[i - 1].score ? out[i - 1].rank : i + 1;
    out.push({ ...sorted[i], rank });
  }
  return out;
}
