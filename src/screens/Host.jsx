import React, { useEffect, useRef, useState } from 'react';
import { socket, ask, syncClock, loadSession, saveSession } from '../net.js';
import JoinPanel from '../components/JoinPanel.jsx';
import Timer from '../components/Timer.jsx';
import Reveal from '../components/Reveal.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import { navigate } from '../router.js';
import { CATEGORY_GROUPS, DEFAULT_CATEGORY_KEYS } from '../../shared/decks/index.js';

export default function Host() {
  const [state, setState] = useState(null);
  const [round, setRound] = useState(null);
  const [reveal, setReveal] = useState(null);
  const [over, setOver] = useState(null);
  const [error, setError] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set(DEFAULT_CATEGORY_KEYS));
  const claimed = useRef(false);

  const toggleCategory = (fqKey) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(fqKey)) next.delete(fqKey);
      else next.add(fqKey);
      return next;
    });
  };

  const toggleGroup = (group, allSelected) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      for (const c of group.categories) {
        if (allSelected) next.delete(c.fqKey);
        else next.add(c.fqKey);
      }
      return next;
    });
  };

  // Claim or reclaim a room. A host reload should land back in the same game rather than
  // stranding a room full of phones.
  useEffect(() => {
    const claim = async () => {
      const existing = loadSession().hostCode;
      if (existing) {
        const resumed = await ask('host:resume', { code: existing });
        if (resumed.ok) {
          setState(resumed.state);
          if (resumed.round) {
            syncClock(resumed.round.serverNow);
            setRound(resumed.round);
          }
          if (resumed.reveal) setReveal(resumed.reveal);
          return;
        }
      }
      const created = await ask('host:create');
      if (created.error) return setError(created.error);
      setState(created.state);
      saveSession({ hostCode: created.state.code });
    };

    const onConnect = () => {
      // Reconnects re-run the claim so the room is re-bound to the new socket.
      claimed.current = true;
      claim();
    };

    if (socket.connected) onConnect();
    socket.on('connect', onConnect);
    return () => socket.off('connect', onConnect);
  }, []);

  useEffect(() => {
    const onState = (s) => setState(s);
    const onRoundStart = (payload) => {
      syncClock(payload.serverNow);
      setReveal(null);
      setOver(null);
      setRound(payload);
    };
    const onHurry = ({ endsAt, serverNow }) => {
      syncClock(serverNow);
      setRound((r) => (r ? { ...r, endsAt } : r));
    };
    const onReveal = (payload) => setReveal(payload);
    const onOver = (payload) => {
      setReveal(null);
      setOver(payload);
    };

    socket.on('room:state', onState);
    socket.on('round:start', onRoundStart);
    socket.on('round:hurry', onHurry);
    socket.on('round:reveal', onReveal);
    socket.on('game:over', onOver);
    return () => {
      socket.off('room:state', onState);
      socket.off('round:start', onRoundStart);
      socket.off('round:hurry', onHurry);
      socket.off('round:reveal', onReveal);
      socket.off('game:over', onOver);
    };
  }, []);

  const start = async () => {
    const res = await ask('host:start', { categoryKeys: [...selectedKeys] });
    if (res.error) setError(res.error);
  };

  // Space / Enter / → advance the reveal, so the host can run the game from a clicker or a
  // keyboard without hunting for the button.
  useEffect(() => {
    if (state?.phase !== 'reveal') return;
    const onKey = (e) => {
      if (['Space', 'Enter', 'ArrowRight', 'PageDown'].includes(e.code)) {
        e.preventDefault();
        socket.emit('host:advance');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state?.phase]);

  if (error) {
    return (
      <main className="shell shell--center">
        <div className="panel">
          <h1>Something went sideways</h1>
          <p className="muted">{error}</p>
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            Start over
          </button>
        </div>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="shell shell--center">
        <p className="muted">Opening the garage…</p>
      </main>
    );
  }

  // ------------------------------------------------------------------ lobby
  if (state.phase === 'lobby') {
    return (
      <main className="shell host-lobby">
        <header className="host-lobby__head">
          <button
            type="button"
            className="btn btn--ghost btn--sm btn--back"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
          <p className="eyebrow">PangoRankr</p>
          <h1>Scan to join</h1>
        </header>

        <div className="host-lobby__body">
          <JoinPanel code={state.code} />

          <section className="host-lobby__players">
            <h2>
              Players <span className="muted">{state.players.length}/{state.maxPlayers}</span>
            </h2>
            {state.players.length === 0 ? (
              <p className="muted">Waiting for the first phone…</p>
            ) : (
              <ul className="chips">
                {state.players.map((p) => (
                  <li key={p.id} className={p.connected ? 'chip' : 'chip is-away'}>
                    {p.name}
                  </li>
                ))}
              </ul>
            )}

            <h2>Categories</h2>
            <div className="category-picker">
              {CATEGORY_GROUPS.map((group) => {
                const allSelected = group.categories.every((c) => selectedKeys.has(c.fqKey));
                return (
                  <div key={group.key} className="category-picker__group">
                    <label className="category-picker__group-head">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleGroup(group, allSelected)}
                      />
                      <strong>{group.name}</strong>
                    </label>
                    <ul className="category-picker__list">
                      {group.categories.map((c) => (
                        <li key={c.fqKey}>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedKeys.has(c.fqKey)}
                              onChange={() => toggleCategory(c.fqKey)}
                            />
                            {c.title}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <button
              className="btn btn--primary btn--lg"
              onClick={start}
              disabled={state.players.length === 0 || selectedKeys.size === 0}
            >
              Start · {state.totalRounds} rounds
            </button>
          </section>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------ game over
  if (state.phase === 'over' && over) {
    const [winner] = over.leaderboard;
    return (
      <main className="shell shell--center">
        <div className="finale">
          <p className="eyebrow">Final standings</p>
          {winner && (
            <h1 className="finale__winner">
              {winner.name} <span className="muted">wins</span>
            </h1>
          )}
          <Leaderboard rows={over.leaderboard} limit={10} />
          <div className="row">
            <button className="btn btn--primary" onClick={() => socket.emit('host:restart')}>
              Play again
            </button>
            <button className="btn btn--ghost" onClick={() => navigate('/')}>
              Done
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------ reveal
  if (state.phase === 'reveal' && reveal) {
    return (
      <main className="shell host-round">
        <header className="host-round__head">
          <p className="eyebrow">
            Round {reveal.reveal.index + 1} of {state.totalRounds}
          </p>
          <button className="btn btn--primary" onClick={() => socket.emit('host:advance')}>
            {reveal.isFinalRound ? 'Final scores' : 'Next round'} →
          </button>
        </header>
        <div className="host-round__body host-round__body--reveal">
          <Reveal reveal={reveal.reveal} results={reveal.results} maxPairs={reveal.maxPairs} />
          <aside className="host-round__aside">
            <h2>Standings</h2>
            <Leaderboard rows={reveal.leaderboard} limit={10} />
            <button
              className="btn btn--primary btn--lg"
              onClick={() => socket.emit('host:advance')}
            >
              {reveal.isFinalRound ? 'Final scores' : `Round ${reveal.reveal.index + 2} →`}
            </button>
            <p className="muted small">Or press space. Nothing moves until you do.</p>
          </aside>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------ round in play
  if (state.phase === 'round' && round) {
    const submitted = state.submittedIds.length;
    return (
      <main className="shell host-round">
        <header className="host-round__head">
          <p className="eyebrow">
            Round {round.index + 1} of {round.totalRounds}
          </p>
          <h1 className="host-round__question">{round.category.prompt}</h1>
          <button className="btn btn--ghost btn--sm" onClick={() => socket.emit('host:advance')}>
            Skip →
          </button>
        </header>

        <div className="host-round__body">
          <ul className="lineup">
            {round.items.map((item) => (
              <li key={item.id} className="lineup__card">
                {item.subtitle != null && <span className="lineup__subtitle">{item.subtitle}</span>}
                <span className="lineup__title">
                  {item.title}
                  {item.meta != null && (
                    <span className="lineup__meta"> · {item.meta}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <aside className="host-round__aside">
            <Timer endsAt={round.endsAt} durationMs={round.durationMs} label="Locking in" />
            <p className="tally">
              <strong>{submitted}</strong> of {state.players.length} locked in
            </p>
            <ul className="chips">
              {state.players.map((p) => (
                <li
                  key={p.id}
                  className={`chip${state.submittedIds.includes(p.id) ? ' is-done' : ''}`}
                >
                  {p.name}
                </li>
              ))}
            </ul>
            {round.category.note && <p className="muted small">{round.category.note}</p>}
            <JoinPanel code={state.code} compact />
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="shell shell--center">
      <p className="muted">Getting the next round ready…</p>
    </main>
  );
}
