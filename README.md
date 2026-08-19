# Pango Garage — Ranking Lineup

A five-minute party game that tests car knowledge. Every round puts four cars on the big
screen and asks one of thirteen questions, then players drag the cars into order on their
phones. No multiple choice, no typing, no question authoring.

Eight rounds drawn from **217 cars** and **13 categories**. Up to 20 players. Join by QR
code.

| Category | Ranks by |
| --- | --- |
| Quickest / Highest top speed | 0–100 km/h · top speed |
| Most powerful / Best power-to-weight | horsepower · hp per tonne |
| Biggest engine / Most power per litre | displacement · hp per litre |
| Most expensive / Cheapest (as new) | launch-day sticker price, NOT inflation-adjusted |
| Most expensive (adjusted) | launch price compounded to today's dollars — see below |
| Heaviest / Lightest | curb weight |
| Oldest / Newest | when the nameplate first launched (not this exact car's spec year) |

Three categories touch price, and their titles say outright whether they're adjusted —
"Most expensive first — NOT inflation-adjusted" vs "— ADJUSTED to `<year>` dollars" — so it's
never ambiguous which dollars are on screen.

Two categories sharing an underlying quantity never land back to back, so a game can't ask
"heaviest" and then immediately "lightest".

## Why ranking works

Ordering four items gives you six orderable pairs, and scoring by **Kendall tau** means
partial credit falls out for free: get three of the four cars right and you still bank most
of the round. Crucially, points come only from *positive* tau, so a random shuffle averages
**zero points**. You cannot guess your way up the leaderboard, but you are never locked out
either.

```
tau        = (concordant - discordant) / 6
base       = 1000 × max(0, tau)
perfect    = +250 if all six pairs are right
speed      = +200 × (fraction of clock left) × max(0, tau)
max/round  = 1450
```

`npm run verify` checks this empirically: averaged over all 24 possible orderings of four
cars, random play scores 224 out of a possible 1450 — and 0 with no clock left.

## Running it

```bash
npm install
npm run dev      # server on :3000, client on :5173 with a websocket proxy
```

Open <http://localhost:5173/host> on the big screen. Phones scan the QR code. To test with
real phones on your LAN, the dev server already binds to `0.0.0.0` — hit
`http://<your-lan-ip>:5173/host` so the QR encodes an address phones can reach.

Production is one process serving the built client and the websockets:

```bash
npm run build
npm start        # http://localhost:3000
```

### Fast playtesting

The round and reveal clocks are env-overridable so you don't sit through real timing:

```bash
ROUND_MS=4000 npm start
node scripts/simulate-game.js            # drives a host + 20 real player sockets
SILENT=0 PLAYERS=20 node scripts/simulate-game.js
```

The simulator asserts the 20-player cap, checks that round payloads leak no stat values,
plays the host pressing "next" (`HOST_PACE_MS`), and prints the final spread.

There are two verification suites, both run by `npm run verify`:

- `verify:data` — pool integrity, 500 generated games, scoring edge cases, pacing.
- `verify:engine` — drives the real room engine in-process with a fake socket.io so it can
  submit the *exact* correct order for every round and assert it scores 6/6. A client can
  never do this, because it doesn't learn the answer until the round is over.

## Deploying to Render

`render.yaml` is a Blueprint — point Render at the repo and it picks it up, or create a Web
Service manually with:

- Build: `npm install && npm run build`
- Start: `npm start`
- Health check: `/healthz`

Websockets work on Render web services out of the box. Two things to know about the free
plan:

- **It sleeps after ~15 minutes idle**, and the cold start takes up to a minute. Open the
  host screen a minute before the party starts.
- **Game state is in memory**, so a restart or redeploy drops live rooms. That is a
  deliberate trade — a five-minute game has nothing worth persisting, and it keeps the
  deploy to one service with no database. If you later want rooms to survive restarts, the
  only thing to move out is the `rooms` Map in [server/rooms.js](server/rooms.js).

A single instance handles this comfortably — one room is a few KB and 20 sockets. Note that
rooms live in the process, so **do not scale past one instance** without moving state to a
shared store, or players will land on a different instance than their host.

## Layout

```
shared/cars.js         the car pool — 217 cars, 66 makes, 1948-2024
shared/categories.js   the twelve ranking questions, their axis and eligibility
shared/rounds.js       round generation, difficulty ramp, client-safe payloads
shared/scoring.js      Kendall tau scoring and leaderboard ranking
server/rooms.js        the game engine: rooms, phases, timers, scoring
server/index.js        express + socket.io wiring, static hosting
src/screens/Host.jsx   the big screen
src/screens/Player.jsx the phone controller
src/components/AnswerComparison.jsx  end-of-round "your order vs the answer"
scripts/verify-data.js    data + generator + scoring checks
scripts/verify-engine.js  drives the real engine, asserts a perfect answer scores 6/6
scripts/simulate-game.js  end-to-end 20-player smoke test
```

## How rounds get generated

`buildRounds()` picks a varied category schedule (never the same axis twice in a row), then
for each round samples four cars that are **well separated** on that measure — at least
7-20% apart depending on the category, or four years for the age questions. This matters:
without it you get lineups where two cars are 3 hp apart and the "right" answer is really a
coin flip. Difficulty ramps by loosening the fame floor, so round 1 uses cars everyone knows
and round 8 reaches deeper into the pool. No car repeats within a game.

Categories can also declare which cars they're *able* to rank, via `eligible`. That keeps
EVs out of displacement rounds, and keeps hybrids and rotaries out of power-per-litre, where
a battery or a Wankel's disputed displacement would make the number an argument rather than
a question.

Derived categories cost no extra data: power-to-weight and power-per-litre are computed from
fields already present, which is the cheapest way to add real variety.

Stat values are never sent to clients during a round — only `id`, `make`, `model`, and (for
every category except oldest/newest) `year`. The year matters here for more than trivia:
some nameplates span multiple real-world generations with very different specs — "Bentley
Continental GT" alone could mean any of three cars built between 2003 and 2025. Showing the
year pins down exactly which car is meant, everywhere the round isn't literally asking
"which year" itself.

**Oldest/newest ask about the nameplate, not the exact car.** "First released longest ago"
means "which of these has existed longest as a model", the way people actually reason about
car history — you don't need to know the 2007 Escalade's specific spec sheet to know the
Escalade nameplate goes back to 1999. Cars where that first-release year differs from the
year their other stats describe carry a `firstYear` (see [shared/cars.js](shared/cars.js));
the age categories sort by that, falling back to `year` for the (large majority of) cars
where the two are the same. One car — the Camaro ZL1 — is excluded from age categories
entirely rather than forced to pick a side: its own origin is genuinely disputed (the 1969
COPO drag-racing option vs. the 2012 first regular-production ZL1 trim), flagged
`disputedOrigin`.

## About the car data

[shared/cars.js](shared/cars.js) is a hand-built pool of 217 well-known cars across 66
makes and 1948-2024. The numbers are rounded, single-variant approximations chosen for
gameplay, not a spec database — real cars vary by trim, market, and model year. Prices are
**nominal launch MSRP in US dollars of the day**, not inflation-adjusted, which is why a 1965
Mustang looks cheap next to a 2015 hatchback; the price rounds say "launch price" on screen
for that reason. Top speeds are manufacturer claims, so a lot of modern cars sit on a 155 mph
limiter, and a few hypercar figures are contested. The minimum-gap rule above is what keeps
this imprecision from making a correct answer wrong.

**Acceleration is 0–100 km/h, not 0–60 mph.** Most sources for these cars quote the metric
sprint, and mixing the two would silently flatter European and Japanese cars by ~0.3s, so
the whole column is on that basis and the screen says so.

**The inflation-adjusted price category uses a flat 3%/year rate, not real CPI data.**
[shared/categories.js](shared/categories.js) compounds each car's nominal launch price from
its launch year to the current year at that fixed rate — the commonly cited long-run
rule-of-thumb average for US inflation. It is deliberately not a real year-by-year CPI
series: building one accurately back to 1948 is a much bigger data project than this game's
other numbers ask for, and a flat rate is honest about exactly what it's assuming rather
than quietly importing 80 years of economic history that hasn't been checked. It'll be wrong
for any specific year — real inflation spiked well above 3% in the late 1970s/early 1980s
and sat near zero at other times — but it's the same order of estimate most people already
do in their head, and it's clearly labeled as an estimate on screen (title, prompt, and a
note all say so) rather than presented as precise.

**All 217 cars carry `verified: true`** — every one has been spot-checked against published
sources (see the "Verification" section in [shared/cars.js](shared/cars.js)), with 100+
individual field corrections made along the way — mostly weight, top speed, and price;
see git history for the full trail. `npm run verify:data` prints current coverage.

One recurring, genuinely logical error is worth knowing about: several cars originally had
an `accelSec` (0-100 km/h) *faster* than their own cited 0-60 mph time, which is impossible
since 100 km/h (62 mph) is a higher speed to reach — a car can't get to the farther target
sooner. That bug showed up independently across half a dozen unrelated cars during
verification, so treat it as a class of error worth checking for specifically if you add
more cars by hand, not a one-off typo.

A `// TODO verify` comment on a field marks a specific unresolved source conflict on an
otherwise-verified car (currently: the Ferrari F40's price, and the Bugatti EB110's price —
both have two credible but conflicting figures and neither was overwritten on a guess).
`node scripts/list-unverified.js [n]` still works and will simply report `0/217 not yet
verified` — keep it around for whenever new cars get added to the pool.

`npm run verify:data` cross-checks the pool for the kind of mistake hand-entered data
attracts: implausible hp-per-litre or hp-per-tonne (which catches a misplaced decimal), a
sub-5-second car with a low top speed, an engineless car not flagged `electrified`, two cars
that would display identically, and duplicate ids.

### Swapping in an API

Nothing outside `shared/cars.js` reads car data directly, so an adapter only needs to export
the same shape:

```js
{ id, make, model, year, hp, sixty, topSpeedMph, priceUsd, kg, litres, fame }
// plus optional: electrified, rotary   (litres: null for EVs)
```

Worth knowing before you pick a source: **NHTSA vPIC is free and needs no key, but has no
performance or price data at all** — no horsepower, no 0-60, no MSRP. It cannot fill these
categories on its own. Paid options like Auto.dev or a licensed spec feed can. If you
generate the pool with an LLM instead, spot-check the numbers — a hallucinated 0-60 makes a
round unfair in a way players notice immediately.

Either way, generate the pool **offline into a file**, not per-round at play time. Live
generation adds latency to a 25-second round and risks a bad lineup in front of everyone.

## Player experience notes

- Drag to reorder, or use the ▲▼ buttons — phone drag support varies, and the buttons are
  also the keyboard and screen-reader path.
- Forgetting to press **Lock it in** costs you the speed bonus, not the round: the phone
  auto-submits whatever is on screen as the clock expires.
- Once locked, the list renders the exact order that was sent, not live local state. This
  matters: `disabled` stops new drags but an in-flight drag still completes, so without the
  freeze the screen could show four correct rows while the server held a pre-adjustment
  order — which looked exactly like a scoring bug.
- Once every connected player has locked in, the round cuts to 2.5 seconds so nobody
  watches an empty timer.
- **Reveals never auto-advance.** The host presses "next" (or space / → / PageDown, so a
  presentation clicker works). The reveal is where the arguing happens, and a timer cutting
  that off is the wrong call.
- The end-of-round screen shows the correct order annotated with where *you* put each car,
  plus the pairs you got backwards spelled out in words — "Countach belongs above F40".
- Players can reload or reconnect mid-game and keep their score; the host can reload
  without killing the room.
