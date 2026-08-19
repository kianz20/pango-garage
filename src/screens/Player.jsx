import React, { useEffect, useRef, useState } from 'react';
import {
  socket,
  ask,
  syncClock,
  msUntil,
  loadSession,
  saveSession,
  clearSession,
} from '../net.js';
import RankList from '../components/RankList.jsx';
import Timer from '../components/Timer.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import AnswerComparison from '../components/AnswerComparison.jsx';

const POSITION_LABELS = ['1st', '2nd', '3rd', '4th'];

export default function Player({ initialCode = '' }) {
  const session = loadSession();
  const [code, setCode] = useState(initialCode || session.code || '');
  const [name, setName] = useState(session.name || '');
  const [me, setMe] = useState(null); // { playerId, name }
  const [state, setState] = useState(null);
  const [round, setRound] = useState(null);
  const [order, setOrder] = useState([]);
  const [locked, setLocked] = useState(false);
  // The exact order that went to the server. The list renders this once locked, so a drag
  // that lands after the auto-submit can never leave the screen disagreeing with the score.
  const [sentOrder, setSentOrder] = useState(null);
  const [reveal, setReveal] = useState(null);
  const [over, setOver] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Refs so the auto-submit timer always sees the live values without re-arming.
  const orderRef = useRef(order);
  const roundRef = useRef(round);
  orderRef.current = order;
  roundRef.current = round;
  // lockedRef is deliberately NOT synced from render — it is the submit guard, and it has
  // to flip synchronously inside submit() to stop a double send.
  const lockedRef = useRef(false);

  const join = async (payload) => {
    setBusy(true);
    const res = await ask('player:join', payload);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return false;
    }
    setError(null);
    setMe({ playerId: res.playerId, name: res.name });
    setState(res.state);
    saveSession({ code: payload.code, name: res.name, playerId: res.playerId });
    return true;
  };

  const submit = async (finalOrder, auto = false) => {
    const current = roundRef.current;
    if (!current || lockedRef.current) return;
    // Snapshot first: lockedRef must be true before any await, or a second call (the
    // auto-submit firing while the manual one is in flight) could slip through.
    const snapshot = [...finalOrder];
    lockedRef.current = true;
    setLocked(true);
    setSentOrder(snapshot);

    const res = await ask('player:submit', {
      order: snapshot,
      roundIndex: current.index,
    });
    if (res?.error && !auto) {
      lockedRef.current = false;
      setLocked(false);
      setSentOrder(null);
      setError(res.error);
    }
  };

  // Rejoin automatically on load / reconnect if we have a session.
  useEffect(() => {
    const onConnect = () => {
      const s = loadSession();
      if (s.code && s.playerId && s.name) {
        join({ code: s.code, name: s.name, playerId: s.playerId });
      }
    };
    if (socket.connected) onConnect();
    socket.on('connect', onConnect);
    return () => socket.off('connect', onConnect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onState = (s) => setState(s);
    const onRoundStart = (payload) => {
      syncClock(payload.serverNow);
      setReveal(null);
      setOver(null);
      setRound(payload);
      setOrder(payload.cars.map((c) => c.id));
      lockedRef.current = false;
      setLocked(false);
      setSentOrder(null);
    };
    const onHurry = ({ endsAt, serverNow }) => {
      syncClock(serverNow);
      setRound((r) => (r ? { ...r, endsAt } : r));
    };
    const onReveal = (payload) => {
      setRound(null);
      setReveal(payload);
    };
    const onOver = (payload) => {
      setReveal(null);
      setOver(payload);
    };
    const onKicked = () => {
      clearSession();
      setMe(null);
      setError('The host removed you from the game.');
    };

    socket.on('room:state', onState);
    socket.on('round:start', onRoundStart);
    socket.on('round:hurry', onHurry);
    socket.on('round:reveal', onReveal);
    socket.on('game:over', onOver);
    socket.on('player:kicked', onKicked);
    return () => {
      socket.off('room:state', onState);
      socket.off('round:start', onRoundStart);
      socket.off('round:hurry', onHurry);
      socket.off('round:reveal', onReveal);
      socket.off('game:over', onOver);
      socket.off('player:kicked', onKicked);
    };
  }, []);

  // Auto-lock whatever is on screen as the clock expires. Forgetting to press the button
  // should cost you the speed bonus, not the entire round.
  useEffect(() => {
    if (!round) return;
    const fire = Math.max(0, msUntil(round.endsAt) - 400);
    const t = setTimeout(() => {
      if (!lockedRef.current) submit(orderRef.current, true);
    }, fire);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.index, round?.endsAt]);

  // ------------------------------------------------------------------ join form
  if (!me) {
    return (
      <main className="shell shell--center">
        <form
          className="panel join-form"
          onSubmit={(e) => {
            e.preventDefault();
            join({ code: code.trim().toUpperCase(), name: name.trim() });
          }}
        >
          <p className="eyebrow">Pango Garage</p>
          <h1>Join the game</h1>

          <label className="field">
            <span>Room code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="ABCD"
              className="input input--code"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              required
            />
          </label>

          <label className="field">
            <span>Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 14))}
              placeholder="Username"
              className="input"
              autoComplete="off"
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="btn btn--primary btn--lg" type="submit" disabled={busy}>
            {busy ? 'Joining…' : "I'm in"}
          </button>
        </form>
      </main>
    );
  }

  // ------------------------------------------------------------------ playing
  if (round) {
    return (
      <main className="shell player">
        <header className="player__head">
          <span className="eyebrow">
            Round {round.index + 1}/{round.totalRounds}
          </span>
          <h1 className="player__question">{round.category.prompt}</h1>
        </header>

        <Timer endsAt={round.endsAt} durationMs={round.durationMs} label={locked ? 'Locked in' : 'Drag to order'} />

        <RankList
          cars={round.cars}
          order={locked && sentOrder ? sentOrder : order}
          onChange={setOrder}
          disabled={locked}
        />

        <footer className="player__foot">
          {locked ? (
            <p className="locked-note">Locked in. Sit tight…</p>
          ) : (
            <button className="btn btn--primary btn--lg" onClick={() => submit(order)}>
              Lock it in
            </button>
          )}
        </footer>
      </main>
    );
  }

  // ------------------------------------------------------------------ my result
  if (reveal) {
    const mine = reveal.results.find((r) => r.playerId === me.playerId);
    const myRow = reveal.leaderboard.find((r) => r.id === me.playerId);
    return (
      <main className="shell shell--center player">
        <div className="result">
          {mine ? (
            <>
              <p className="eyebrow">
                {mine.perfect
                  ? 'Perfect order'
                  : mine.answered
                    ? `${mine.concordant} of ${reveal.maxPairs} pairs right`
                    : 'No answer locked in'}
              </p>
              <p className="result__points">+{mine.points}</p>
              {mine.perfectBonus > 0 && <p className="result__bonus">Perfect bonus +{mine.perfectBonus}</p>}
              {mine.speedBonus > 0 && <p className="result__bonus">Speed bonus +{mine.speedBonus}</p>}
            </>
          ) : (
            <p className="eyebrow">Round over</p>
          )}

          <AnswerComparison
            reveal={reveal.reveal}
            myOrder={mine?.order ?? []}
            statLabel={reveal.reveal.statLabel}
          />

          {myRow && (
            <p className="result__standing">
              You’re <strong>#{myRow.rank}</strong> of {reveal.leaderboard.length} on{' '}
              {myRow.score.toLocaleString()}
            </p>
          )}
          <p className="muted small">Waiting for the host to start the next round…</p>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------ final
  if (over) {
    const myRow = over.leaderboard.find((r) => r.id === me.playerId);
    return (
      <main className="shell shell--center player">
        <div className="result">
          <p className="eyebrow">That’s the game</p>
          {myRow && (
            <h1 className="result__final">
              #{myRow.rank} · {myRow.score.toLocaleString()}
            </h1>
          )}
          <Leaderboard rows={over.leaderboard} highlightId={me.playerId} limit={10} />
          <p className="muted small">Look up at the big screen.</p>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------ lobby
  return (
    <main className="shell shell--center player">
      <div className="result">
        <p className="eyebrow">You’re in</p>
        <h1 className="result__final">{me.name}</h1>
        <p className="muted">
          {state ? `${state.players.length} in the garage` : 'Connecting…'} · waiting for the
          host to start
        </p>
        {state?.players?.length > 0 && (
          <ul className="chips chips--center">
            {state.players.map((p) => (
              <li key={p.id} className={p.id === me.playerId ? 'chip is-you' : 'chip'}>
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
