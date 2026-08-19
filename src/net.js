import { io } from 'socket.io-client';

// Same-origin in production; Vite proxies /socket.io to the server in dev.
export const socket = io({ autoConnect: true, transports: ['websocket', 'polling'] });

/**
 * Clock offset between this device and the server.
 *
 * Round timers are server-authoritative, but a phone with a badly set clock would show
 * nonsense. Every timed payload carries `serverNow`, so we correct against it.
 */
let offset = 0;
export const syncClock = (serverNow) => {
  if (typeof serverNow === 'number') offset = serverNow - Date.now();
};
export const serverTime = () => Date.now() + offset;
export const msUntil = (endsAt) => Math.max(0, endsAt - serverTime());

/** Promise wrapper over socket.io acks. */
export function ask(event, payload = {}) {
  return new Promise((resolve) => {
    socket.timeout(8000).emit(event, payload, (err, response) => {
      if (err) return resolve({ error: 'Lost the connection. Try again.' });
      resolve(response ?? {});
    });
  });
}

const KEY = 'pango.session';

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? 'null') ?? {};
  } catch {
    return {};
  }
}

export function saveSession(patch) {
  const next = { ...loadSession(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private browsing — the game still works, it just won't survive a reload */
  }
  return next;
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
