/**
 * Drives the real room engine in-process with a fake socket.io, so we can submit the exact
 * correct order for a round and assert what the scorer does with it.
 *
 * This is the test that answers "is a genuinely perfect answer ever scored as 5/6?" — the
 * simulator can't, because a client never learns the answer before the round ends.
 *
 * Run: npm run verify:engine
 */
import { CATEGORY_BY_KEY } from '../shared/categories.js';

// A long answering clock: this test never waits on a timer, it calls advance() to step the
// game, so the engine's own round timeout must never fire and race us.
process.env.ROUND_MS = '600000';

const { createRoom, joinRoom, startGame, submitOrder, advance, destroyRoom, CONFIG } =
  await import('../server/rooms.js');

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

/** Minimal stand-in for the socket.io server: records what would be broadcast. */
function fakeIo() {
  const events = [];
  return {
    events,
    to: () => ({ emit: (event, payload) => events.push({ event, payload }) }),
    latest: (event) => [...events].reverse().find((e) => e.event === event)?.payload,
  };
}
const fakeSocket = (id) => ({ id, join() {} });

console.log('\nEngine: a perfect answer scores 6/6');

const io = fakeIo();
const room = createRoom(io, 'host-socket');

// Three players: one perfect, one with a single adjacent swap, one who never answers.
const perfectPlayer = joinRoom(room, fakeSocket('s1'), { name: 'Perfect' }).player;
const swapPlayer = joinRoom(room, fakeSocket('s2'), { name: 'OneSwap' }).player;
joinRoom(room, fakeSocket('s3'), { name: 'Silent' });

startGame(room);

let checkedRounds = 0;

for (let i = 0; i < CONFIG.totalRounds; i++) {
  const round = room.rounds[room.roundIndex];
  if (!round) break;

  const sent = io.latest('round:start');
  const category = CATEGORY_BY_KEY.get(round.categoryKey);

  // What the client is told, versus the truth the server holds. `year` is allowed EXCEPT
  // on an age round, where it would hand over the answer outright.
  const allowed = category.axis === 'year' ? ['id', 'make', 'model'] : ['id', 'make', 'model', 'year'];
  const leaks = Object.keys(sent.cars[0]).filter((k) => !allowed.includes(k));
  if (leaks.length) fail(`round ${i} (${category.key}) payload leaks ${leaks.join(', ')}`);
  if (category.axis === 'year' && sent.cars.some((c) => 'year' in c)) {
    fail(`round ${i} is an age round but still sends year`);
  }

  // Submit the exact correct order, verbatim from the server's own answer.
  const truth = [...round.correctOrder];
  submitOrder(room, perfectPlayer.id, { order: truth, roundIndex: round.index });

  // And an order that differs by exactly one adjacent swap.
  const swapped = [...truth];
  [swapped[1], swapped[2]] = [swapped[2], swapped[1]];
  submitOrder(room, swapPlayer.id, { order: swapped, roundIndex: round.index });

  advance(room); // end the round now

  const reveal = io.latest('round:reveal');
  if (!reveal || reveal.reveal.index !== round.index) {
    fail(`round ${i} produced no reveal`);
    break;
  }
  checkedRounds++;

  const p = reveal.results.find((r) => r.playerId === perfectPlayer.id);
  const s = reveal.results.find((r) => r.playerId === swapPlayer.id);

  if (p.concordant !== reveal.maxPairs || !p.perfect) {
    fail(
      `round ${i} (${category.key}): exact correct order scored ${p.concordant}/${reveal.maxPairs}, perfect=${p.perfect}`
    );
  }
  if (s.concordant !== reveal.maxPairs - 1) {
    fail(`round ${i}: one adjacent swap scored ${s.concordant}/${reveal.maxPairs}, expected ${reveal.maxPairs - 1}`);
  }
  // The reveal must echo back what each player actually submitted.
  if (JSON.stringify(p.order) !== JSON.stringify(truth)) {
    fail(`round ${i}: reveal echoed a different order than was submitted`);
  }

  advance(room); // move on to the next round (or the final scores)
}

if (checkedRounds === CONFIG.totalRounds) {
  pass(`all ${checkedRounds} rounds: exact correct order = 6/6 and flagged perfect`);
  pass('one adjacent swap = 5/6, in every category');
  pass('reveal echoes each submitted order verbatim');
} else {
  fail(`only ${checkedRounds}/${CONFIG.totalRounds} rounds were checked`);
}

const over = io.latest('game:over');
if (!over) fail('game never reached game:over');
else {
  const board = over.leaderboard;
  const top = board[0];
  if (top.name !== 'Perfect') fail(`the perfect player should lead, got ${top.name}`);
  else pass(`perfect player finished top on ${top.score}`);
  const silent = board.find((r) => r.name === 'Silent');
  if (silent.score !== 0) fail(`the silent player should be on 0, got ${silent.score}`);
  else pass('silent player scored 0');
}

destroyRoom(room); // clears the engine's pending timers so the process can exit

console.log(failures === 0 ? '\nAll engine checks passed.\n' : `\n${failures} engine check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
