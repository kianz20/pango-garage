import React, { useEffect, useState } from 'react';
import { msUntil } from '../net.js';

/** Countdown bar driven by the server's `endsAt`, repainted on animation frames. */
export default function Timer({ endsAt, durationMs, label }) {
  const [remaining, setRemaining] = useState(() => msUntil(endsAt));

  useEffect(() => {
    let frame;
    const tick = () => {
      setRemaining(msUntil(endsAt));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [endsAt]);

  const seconds = Math.ceil(remaining / 1000);
  const fraction = Math.min(1, Math.max(0, remaining / Math.max(1, durationMs)));
  const urgent = remaining <= 5000;

  return (
    <div className={`timer${urgent ? ' timer--urgent' : ''}`}>
      <div className="timer__meta">
        <span>{label}</span>
        <span className="timer__count">{seconds}s</span>
      </div>
      <div className="timer__track">
        <div className="timer__fill" style={{ transform: `scaleX(${fraction})` }} />
      </div>
    </div>
  );
}
