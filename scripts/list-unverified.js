/**
 * Prints the cars that don't yet carry `verified: true`, so a future spot-check pass
 * samples from what's actually unchecked instead of re-covering old ground.
 *
 *   node scripts/list-unverified.js           list everything unverified
 *   node scripts/list-unverified.js 20        list a random 20 of them (for one session)
 */
import { CARS } from '../shared/decks/cars.js';

const count = Number(process.argv[2]);
const unverified = CARS.filter((c) => !c.verified);

const sample = Number.isFinite(count) && count > 0
  ? [...unverified].sort(() => Math.random() - 0.5).slice(0, count)
  : unverified;

console.log(`${unverified.length}/${CARS.length} cars not yet verified.\n`);
sample.forEach((c) => console.log(`${c.id.padEnd(32)} ${c.year} ${c.make} ${c.model}`));
