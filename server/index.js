import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Server } from 'socket.io';

import {
  CONFIG,
  createRoom,
  getRoom,
  destroyRoom,
  sweepRooms,
  roomCount,
  joinRoom,
  markDisconnected,
  startGame,
  submitOrder,
  advance,
  resetToLobby,
  stateFor,
  pushState,
} from './rooms.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, '..', 'dist');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // In dev the client is served by Vite on another port, so allow any origin. In
  // production the client is same-origin, so this is never exercised.
  cors: { origin: true },
});

app.get('/healthz', (_req, res) => res.json({ ok: true, rooms: roomCount() }));

// In production, serve the built client and let it own client-side routing.
app.use(express.static(DIST));
app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));

io.on('connection', (socket) => {
  // What this socket is: a host of one room, or a player in one room.
  let hostedCode = null;
  let joined = null; // { code, playerId }

  socket.on('host:create', (_payload, ack) => {
    const room = createRoom(io, socket.id);
    hostedCode = room.code;
    socket.join(room.code);
    ack?.({ ok: true, state: stateFor(room), config: CONFIG });
  });

  socket.on('host:resume', ({ code } = {}, ack) => {
    const room = getRoom(code);
    if (!room) return ack?.({ error: 'That game has ended.' });
    room.hostSocketId = socket.id;
    room.hostSeenAt = Date.now();
    hostedCode = room.code;
    socket.join(room.code);
    ack?.({ ok: true, state: stateFor(room), config: CONFIG });
  });

  socket.on('host:start', (_payload, ack) => {
    const room = getRoom(hostedCode);
    if (!room) return ack?.({ error: 'No game to start.' });
    if (room.players.size === 0) return ack?.({ error: 'Nobody has joined yet.' });
    startGame(room);
    ack?.({ ok: true });
  });

  socket.on('host:advance', () => {
    const room = getRoom(hostedCode);
    if (room) advance(room);
  });

  socket.on('host:restart', () => {
    const room = getRoom(hostedCode);
    if (room) resetToLobby(room);
  });

  socket.on('host:kick', ({ playerId } = {}) => {
    const room = getRoom(hostedCode);
    if (!room) return;
    const player = room.players.get(playerId);
    if (!player) return;
    room.players.delete(playerId);
    room.submissions.delete(playerId);
    io.to(player.socketId).emit('player:kicked');
    pushState(room);
  });

  socket.on('player:join', ({ code, name, playerId } = {}, ack) => {
    const room = getRoom(code);
    if (!room) return ack?.({ error: 'No game with that code.' });

    const result = joinRoom(room, socket, { name, playerId });
    if (result.error) return ack?.({ error: result.error });

    joined = { code: room.code, playerId: result.player.id };
    ack?.({
      ok: true,
      playerId: result.player.id,
      name: result.player.name,
      score: result.player.score,
      rejoined: !!result.rejoined,
      state: stateFor(room),
      config: CONFIG,
    });
  });

  socket.on('player:submit', ({ order, roundIndex } = {}, ack) => {
    if (!joined) return ack?.({ error: 'Not in a game.' });
    const room = getRoom(joined.code);
    if (!room) return ack?.({ error: 'That game has ended.' });
    ack?.(submitOrder(room, joined.playerId, { order, roundIndex }));
  });

  socket.on('disconnect', () => {
    if (hostedCode) {
      const room = getRoom(hostedCode);
      if (room && room.hostSocketId === socket.id) {
        // Keep the room alive briefly — hosts reload their screen, and 20 phones
        // should not lose a game because of it. sweepRooms() cleans up for real.
        room.hostSocketId = null;
        room.hostSeenAt = Date.now();
      }
    }
    if (joined) {
      const room = getRoom(joined.code);
      if (room) markDisconnected(room, socket.id);
    }
  });
});

setInterval(() => sweepRooms(), 60_000).unref();

server.listen(PORT, () => {
  console.log(`Pango Garage listening on http://localhost:${PORT}`);
});

// Exported for tests / scripts that want to drive the engine without a socket.
export { io, server, destroyRoom };
