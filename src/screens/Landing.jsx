import React from 'react';
import { navigate } from '../router.js';

export default function Landing() {
  return (
    <main className="shell shell--center">
      <div className="landing">
        <p className="landing__blurb">Pango Garage</p>
        <h1 className="landing__title">
          Four cars.
          <br />
          One right order.
        </h1>
        <p className="landing__blurb">
          Every round shows four cars and one question — fastest, priciest, heaviest,
          oldest. Drag them into order before the clock runs out. Eight rounds, about five
          minutes, up to 20 phones.
        </p>
        <div className="landing__actions">
          <button className="btn btn--primary btn--lg" onClick={() => navigate('/host')}>
            Host on this screen
          </button>
          <button className="btn btn--ghost btn--lg" onClick={() => navigate('/join')}>
            Join with a code
          </button>
        </div>
      </div>
    </main>
  );
}
