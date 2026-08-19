import React from 'react';
import { discordantPairs } from '../../shared/scoring.js';

const POSITION_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

/**
 * The end-of-round comparison: the true order, with where the player actually put each car
 * and the stat that decided it.
 *
 * One list rather than two side by side — on a phone, two columns forces you to read
 * across, and the thing you want to see is "which cars did I misplace", which reads best as
 * annotations on the correct answer.
 */
export default function AnswerComparison({ reveal, myOrder = [], statLabel }) {
  const answered = myOrder.length > 0;
  const myRank = new Map(myOrder.map((id, i) => [id, i]));
  const nameOf = new Map(reveal.correctOrder.map((c) => [c.id, `${c.make} ${c.model}`]));

  const correctIds = reveal.correctOrder.map((c) => c.id);
  const wrongPairs = answered ? discordantPairs(myOrder, correctIds) : [];

  return (
    <div className="compare">
      <div className="compare__head">
        <span className="compare__col-answer">The right order · {statLabel}</span>
        {answered && <span className="compare__col-you">You</span>}
      </div>

      <ol className="compare__list">
        {reveal.correctOrder.map((car, i) => {
          const yours = myRank.get(car.id);
          const exact = yours === i;
          return (
            <li
              key={car.id}
              className={`compare__row${answered ? (exact ? ' is-right' : ' is-wrong') : ''}`}
              style={{ animationDelay: `${i * 160}ms` }}
            >
              <span className="compare__pos">{POSITION_LABELS[i]}</span>
              <span className="compare__car">
                <span className="compare__make">{car.make}</span>
                <span className="compare__model">
                  {car.model}
                  {car.year != null && (
                    <span className="compare__year"> ’{String(car.year).slice(2)}</span>
                  )}
                </span>
              </span>
              <span className="compare__value">{car.value}</span>
              {answered && (
                <span className={`compare__yours${exact ? ' is-right' : ''}`}>
                  {exact ? '✓' : `you: ${POSITION_LABELS[yours] ?? '—'}`}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {answered && wrongPairs.length > 0 && (
        <ul className="compare__notes">
          {wrongPairs.slice(0, 3).map(([above, below]) => (
            <li key={`${above}-${below}`}>
              <strong>{nameOf.get(above)}</strong> belongs above{' '}
              <strong>{nameOf.get(below)}</strong>
            </li>
          ))}
          {wrongPairs.length > 3 && <li className="muted">…and {wrongPairs.length - 3} more</li>}
        </ul>
      )}

      {!answered && <p className="compare__none">You didn’t lock an answer in for this round.</p>}
    </div>
  );
}
