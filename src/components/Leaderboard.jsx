import React from 'react';

export default function Leaderboard({ rows, highlightId, limit, showDelta = false }) {
  const shown = limit ? rows.slice(0, limit) : rows;
  const hidden = rows.length - shown.length;

  return (
    <div className="board">
      <ol className="board__list">
        {shown.map((row) => (
          <li
            key={row.id ?? row.playerId ?? row.name}
            className={`board__row${
              (row.id ?? row.playerId) === highlightId ? ' is-you' : ''
            }${row.rank === 1 ? ' is-leader' : ''}`}
          >
            <span className="board__rank">{row.rank}</span>
            <span className="board__name">
              {row.name}
              {row.connected === false && <span className="board__away"> (away)</span>}
            </span>
            {showDelta && typeof row.points === 'number' && (
              <span className="board__delta">+{row.points}</span>
            )}
            <span className="board__score">{(row.score ?? row.total ?? 0).toLocaleString()}</span>
          </li>
        ))}
      </ol>
      {hidden > 0 && <p className="board__more">+{hidden} more</p>}
    </div>
  );
}
