/**
 * End-to-end smoke test: drives a real host socket and 20 real player sockets through a
 * whole game against a running server.
 *
 *   npm start                    (in one terminal)
 *   node scripts/simulate-game.js
 *
 * Players answer with varying skill so the leaderboard has to spread out, and two of them
 * deliberately never answer so the "didn't lock in" path gets exercised. Uses a shortened
 * clock via env so the run takes seconds, not five minutes:
 *
 *   ROUND_MS=1200 npm start
 *
 * Reveals are host-paced, so this script also plays the host pressing "next" (HOST_PACE_MS).
 */
import { io } from 'socket.io-client';
import { CATEGORY_BY_FQKEY } from '../shared/decks/index.js';

const URL = process.env.URL || 'http://localhost:3000';
const PLAYER_COUNT = Number(process.env.PLAYERS || 20);
/** How many players never answer. Set SILENT=0 to exercise the all-in clock shortcut. */
const SILENT_COUNT = process.env.SILENT === undefined ? 2 : Number(process.env.SILENT);

const connect = () =>
  new Promise((resolve, reject) => {
    const socket = io(URL, { transports: ['websocket'] });
    socket.once('connect', () => resolve(socket));
    socket.once('connect_error', reject);
  });

const emit = (socket, event, payload = {}) =>
  new Promise((resolve) => socket.timeout(8000).emit(event, payload, (err, res) => resolve(err ? { error: String(err) } : res)));

/** Shuffle, then partially sort toward the truth to fake a given skill level. */
function guessOrder(items, skill) {
  const order = items.map((it) => it.id);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  // A "skilled" player just answers faster and gets more pairs right by luck here; the
  // server is the only thing that knows the truth, which is exactly the point.
  return order;
}

const log = (...args) => console.log(...args);

async function main() {
  log(`Connecting host to ${URL}…`);
  const host = await connect();
  const created = await emit(host, 'host:create');
  if (!created?.ok) throw new Error(`host:create failed: ${JSON.stringify(created)}`);
  const { code } = created.state;
  log(`Room ${code} open. Config: ${JSON.stringify(created.config)}`);

  const players = [];
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const socket = await connect();
    const res = await emit(socket, 'player:join', { code, name: `P${String(i + 1).padStart(2, '0')}` });
    if (res?.error) throw new Error(`player ${i + 1} could not join: ${res.error}`);
    const skill = Math.random();
    const silent = i >= PLAYER_COUNT - SILENT_COUNT;

    socket.on('round:start', async (round) => {
      if (silent) return;
      // Faster players answer sooner, so the speed bonus actually differentiates.
      const delay = Math.round((1 - skill) * round.durationMs * 0.7);
      setTimeout(() => {
        emit(socket, 'player:submit', {
          order: guessOrder(round.items, skill),
          roundIndex: round.index,
        });
      }, delay);
    });

    players.push({ socket, name: res.name, id: res.playerId });
  }
  log(`${players.length} players joined.`);

  // Verify the cap holds — only meaningful when we actually filled the room, otherwise the
  // probe would just become a 21st player who never answers and skews the results.
  if (PLAYER_COUNT >= created.config.maxPlayers) {
    const extra = await connect();
    const rejected = await emit(extra, 'player:join', { code, name: 'GateCrasher' });
    log(rejected?.error ? `Cap enforced at ${PLAYER_COUNT}: "${rejected.error}"` : '!! cap NOT enforced');
    extra.close();
  }

  // Verify no stat values leak to clients. `meta` is expected except on a hidesMeta round,
  // where the whole point of the category is that it's hidden.
  await new Promise((resolve) => {
    host.once('round:start', (round) => {
      const category = CATEGORY_BY_FQKEY.get(round.category.key);
      const allowed = category.hidesMeta
        ? ['id', 'title', 'subtitle']
        : ['id', 'title', 'subtitle', 'meta'];
      const leaked = Object.keys(round.items[0]).filter((k) => !allowed.includes(k));
      log(
        leaked.length
          ? `!! round payload leaks: ${leaked.join(', ')}`
          : `Round payload OK (${round.category.key}${category.hidesMeta ? ', meta hidden' : ', meta shown'}).`
      );
      resolve();
    });
    emit(host, 'host:start');
  });

  let hurries = 0;
  host.on('round:hurry', () => hurries++);

  let rounds = 0;
  host.on('round:reveal', ({ reveal, results, leaderboard }) => {
    rounds++;
    // Reveals no longer auto-advance — the host drives them. Stand in for a host who reads
    // the answer out and moves on.
    setTimeout(() => host.emit('host:advance'), Number(process.env.HOST_PACE_MS || 300));
    const answered = results.filter((r) => r.answered).length;
    const perfect = results.filter((r) => r.perfect).length;
    log(
      `R${reveal.index + 1} ${reveal.statLabel.padEnd(14)} ` +
        `answered ${String(answered).padStart(2)}/${results.length}  perfect ${perfect}  ` +
        `top ${leaderboard[0].name} ${leaderboard[0].score}`
    );
  });

  await new Promise((resolve) => {
    host.on('game:over', ({ leaderboard }) => {
      log(`\nGame over after ${rounds} rounds.`);
      log('Final top 5:');
      leaderboard.slice(0, 5).forEach((r) => log(`  #${r.rank} ${r.name} — ${r.score}`));
      const zeroes = leaderboard.filter((r) => r.score === 0);
      log(`\nPlayers on zero: ${zeroes.length} (expect at least the ${SILENT_COUNT} silent ones)`);
      log(`Rounds cut short once everyone locked in: ${hurries}`);
      log(`Distinct scores: ${new Set(leaderboard.map((r) => r.score)).size}/${leaderboard.length}`);
      resolve();
    });
  });

  players.forEach((p) => p.socket.close());
  host.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
