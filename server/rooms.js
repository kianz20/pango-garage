import { randomUUID } from 'node:crypto';
import { buildRounds, publicRound, revealRound, LINEUP_SIZE } from '../shared/rounds.js';
import { scoreSubmission, rankPlayers, pairCount } from '../shared/scoring.js';

const num = (value, fallback) => (Number(value) > 0 ? Number(value) : fallback);

export const CONFIG = {
  // Env overrides exist so scripts/simulate-game.js can run a whole game in seconds.
  totalRounds: num(process.env.TOTAL_ROUNDS, 8),
  roundMs: num(process.env.ROUND_MS, 25_000),
  maxPlayers: num(process.env.MAX_PLAYERS, 20),
  /** Once everyone has locked in, cut the clock to this so nobody waits on an empty timer. */
  allInGraceMs: num(process.env.ALL_IN_MS, 2_500),
  /** Rooms with no host connection for this long get swept. */
  abandonedMs: 10 * 60_000,
};

// Ambiguous glyphs removed — these codes get read aloud and typed on phones.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

const rooms = new Map();

function makeCode() {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    if (!rooms.has(code)) return code;
  }
  // Astronomically unlikely with 331k codes; fall back to something guaranteed unique.
  return `R${Date.now().toString(36).slice(-3).toUpperCase()}`;
}

export function createRoom(io, hostSocketId) {
  const code = makeCode();
  const room = {
    code,
    io,
    hostSocketId,
    hostSeenAt: Date.now(),
    players: new Map(), // playerId -> { id, name, score, socketId, connected }
    phase: 'lobby', // lobby | round | reveal | over
    rounds: [],
    roundIndex: -1,
    endsAt: 0,
    submissions: new Map(), // playerId -> { order, msRemaining }
    lastResults: [],
    timer: null,
  };
  rooms.set(code, room);
  return room;
}

export const getRoom = (code) => (code ? rooms.get(String(code).toUpperCase()) : undefined);

export function destroyRoom(room) {
  if (!room) return;
  clearTimeout(room.timer);
  rooms.delete(room.code);
}

/** Drop rooms whose host vanished, so a long-running server does not leak them. */
export function sweepRooms(now = Date.now()) {
  for (const room of rooms.values()) {
    const hostGone = !room.hostSocketId && now - room.hostSeenAt > CONFIG.abandonedMs;
    if (hostGone) destroyRoom(room);
  }
}

export const roomCount = () => rooms.size;

// ---------------------------------------------------------------- state broadcasting

const playerList = (room) =>
  [...room.players.values()].map((p) => ({
    id: p.id,
    name: p.name,
    score: p.score,
    connected: p.connected,
  }));

/**
 * round:start / round:reveal are one-time broadcasts, so a socket that (re)joins the room
 * mid-round or mid-reveal — a phone reload, a host tab losing wifi — never receives one and
 * gets stuck with no round to render. Resume/join acks call this to hand the same payload
 * to a late socket.
 */
export function currentRoundPayload(room) {
  const round = room.rounds[room.roundIndex];
  if (!round) return {};

  if (room.phase === 'round') {
    return {
      round: {
        ...publicRound(round, {
          totalRounds: room.rounds.length,
          endsAt: room.endsAt,
          durationMs: CONFIG.roundMs,
        }),
        serverNow: Date.now(),
      },
    };
  }

  if (room.phase === 'reveal') {
    return {
      reveal: {
        reveal: revealRound(round),
        results: room.lastResults,
        leaderboard: rankPlayers(playerList(room)),
        maxPairs: pairCount(LINEUP_SIZE),
        isFinalRound: room.roundIndex >= room.rounds.length - 1,
      },
    };
  }

  return {};
}

export function stateFor(room) {
  return {
    code: room.code,
    phase: room.phase,
    players: playerList(room),
    roundIndex: room.roundIndex,
    totalRounds: CONFIG.totalRounds,
    maxPlayers: CONFIG.maxPlayers,
    submittedIds: [...room.submissions.keys()],
  };
}

const broadcast = (room, event, payload) => room.io.to(room.code).emit(event, payload);

export function pushState(room) {
  broadcast(room, 'room:state', stateFor(room));
}

// ---------------------------------------------------------------- players

export function joinRoom(room, socket, { name, playerId }) {
  const clean = String(name ?? '').trim().slice(0, 14);
  if (!clean) return { error: 'Pick a name first.' };

  const existing = playerId && room.players.get(playerId);
  if (existing) {
    // Reconnect: same player, new socket.
    existing.socketId = socket.id;
    existing.connected = true;
    existing.name = clean;
    socket.join(room.code);
    pushState(room);
    return { player: existing, rejoined: true };
  }

  if (room.players.size >= CONFIG.maxPlayers) {
    return { error: `This game is full (${CONFIG.maxPlayers} players).` };
  }
  const taken = [...room.players.values()].some(
    (p) => p.name.toLowerCase() === clean.toLowerCase()
  );
  if (taken) return { error: 'Someone already took that name.' };

  const player = {
    id: randomUUID(),
    name: clean,
    score: 0,
    socketId: socket.id,
    connected: true,
  };
  room.players.set(player.id, player);
  socket.join(room.code);
  pushState(room);
  return { player };
}

export function markDisconnected(room, socketId) {
  for (const player of room.players.values()) {
    if (player.socketId === socketId) {
      player.connected = false;
      pushState(room);
      return player;
    }
  }
  return null;
}

// ---------------------------------------------------------------- game flow

export function startGame(room, { categoryKeys } = {}) {
  if (room.phase === 'round' || room.phase === 'reveal') return;
  room.rounds = buildRounds({ count: CONFIG.totalRounds, categoryKeys });
  room.roundIndex = -1;
  for (const p of room.players.values()) p.score = 0;
  nextRound(room);
}

function nextRound(room) {
  clearTimeout(room.timer);
  room.roundIndex += 1;

  if (room.roundIndex >= room.rounds.length) {
    room.phase = 'over';
    pushState(room);
    broadcast(room, 'game:over', {
      leaderboard: rankPlayers(playerList(room)),
      maxPerRound: 1000 + 250 + 200,
    });
    return;
  }

  const round = room.rounds[room.roundIndex];
  room.phase = 'round';
  room.submissions = new Map();
  room.endsAt = Date.now() + CONFIG.roundMs;

  pushState(room);
  broadcast(room, 'round:start', {
    ...publicRound(round, {
      totalRounds: room.rounds.length,
      endsAt: room.endsAt,
      durationMs: CONFIG.roundMs,
    }),
    // Clients derive their clock offset from this rather than trusting the device clock.
    serverNow: Date.now(),
  });

  room.timer = setTimeout(() => endRound(room), CONFIG.roundMs);
}

function endRound(room) {
  clearTimeout(room.timer);
  const round = room.rounds[room.roundIndex];
  if (!round) return;

  room.phase = 'reveal';
  const results = [];

  for (const player of room.players.values()) {
    const sub = room.submissions.get(player.id);
    const result = scoreSubmission({
      guessOrder: sub?.order ?? [],
      correctOrder: round.correctOrder,
      msRemaining: sub?.msRemaining ?? 0,
      msTotal: CONFIG.roundMs,
    });
    player.score += result.points;
    results.push({
      playerId: player.id,
      name: player.name,
      order: sub?.order ?? [],
      ...result,
      total: player.score,
    });
  }

  results.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  room.lastResults = results;

  pushState(room);
  broadcast(room, 'round:reveal', {
    reveal: revealRound(round),
    results,
    leaderboard: rankPlayers(playerList(room)),
    maxPairs: pairCount(LINEUP_SIZE),
    isFinalRound: room.roundIndex >= room.rounds.length - 1,
  });

  // Deliberately no timer here. The reveal is where the arguing happens, so the host
  // decides when to move on — see advance().
}

export function submitOrder(room, playerId, { order, roundIndex }) {
  if (room.phase !== 'round') return { error: 'Too late.' };
  if (roundIndex !== room.roundIndex) return { error: 'That round has moved on.' };
  const player = room.players.get(playerId);
  if (!player) return { error: 'You are not in this game.' };

  const msRemaining = Math.max(0, room.endsAt - Date.now());
  room.submissions.set(playerId, { order, msRemaining });
  pushState(room);

  // Everyone in? Don't make the room stare at a running clock.
  const active = [...room.players.values()].filter((p) => p.connected);
  const allIn = active.length > 0 && active.every((p) => room.submissions.has(p.id));
  if (allIn && msRemaining > CONFIG.allInGraceMs) {
    clearTimeout(room.timer);
    room.endsAt = Date.now() + CONFIG.allInGraceMs;
    broadcast(room, 'round:hurry', { endsAt: room.endsAt, serverNow: Date.now() });
    room.timer = setTimeout(() => endRound(room), CONFIG.allInGraceMs);
  }

  return { ok: true, msRemaining };
}

/** Host skipping ahead: end the round now, or cut a reveal short. */
export function advance(room) {
  if (room.phase === 'round') endRound(room);
  else if (room.phase === 'reveal') nextRound(room);
}

export function resetToLobby(room) {
  clearTimeout(room.timer);
  room.phase = 'lobby';
  room.roundIndex = -1;
  room.rounds = [];
  room.submissions = new Map();
  room.lastResults = [];
  for (const p of room.players.values()) p.score = 0;
  pushState(room);
}
