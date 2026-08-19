import React from 'react';

const POSITION_LABELS = ['1st', '2nd', '3rd', '4th'];

export default function Reveal({ reveal, results, maxPairs }) {
  const answered = results.filter((r) => r.answered);
  const perfect = results.filter((r) => r.perfect);
  const best = results[0];

  return (
    <div className="reveal">
      <p className="eyebrow">The answer · {reveal.statLabel}</p>
      <ol className="reveal__list">
        {reveal.correctOrder.map((car, i) => (
          <li key={car.id} className="reveal__row" style={{ animationDelay: `${i * 220}ms` }}>
            <span className="reveal__pos">{POSITION_LABELS[i]}</span>
            <span className="reveal__car">
              <span className="reveal__make">{car.make}</span>
              <span className="reveal__model">
                {car.model}
                {car.year != null && (
                  <span className="reveal__year"> ’{String(car.year).slice(2)}</span>
                )}
              </span>
            </span>
            <span className="reveal__value">{car.value}</span>
          </li>
        ))}
      </ol>

      <div className="reveal__stats">
        <span>
          <strong>{perfect.length}</strong> of {results.length} got it exactly right
        </span>
        {best && best.points > 0 && (
          <span>
            Best this round: <strong>{best.name}</strong> +{best.points}
          </span>
        )}
        {answered.length < results.length && (
          <span className="reveal__missing">
            {results.length - answered.length} didn’t lock in
          </span>
        )}
      </div>

      <ul className="pairs">
        {results.slice(0, 12).map((r) => (
          <li key={r.playerId} className={r.perfect ? 'pairs__row is-perfect' : 'pairs__row'}>
            <span className="pairs__name">{r.name}</span>
            <span className="pairs__bar" aria-hidden="true">
              {Array.from({ length: maxPairs }, (_, i) => (
                <i key={i} className={i < r.concordant ? 'is-hit' : ''} />
              ))}
            </span>
            <span className="pairs__count">
              {r.concordant}/{maxPairs}
            </span>
            <span className="pairs__points">+{r.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
