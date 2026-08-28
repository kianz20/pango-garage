import { cars } from './cars.js';
import { phones } from './phones.js';
import { geography } from './geography.js';
import { filmMusic } from './filmMusic.js';
import { food } from './food.js';
import { fifa } from './fifa.js';
import { rugby } from './rugby.js';
import { olympics } from './olympics.js';
import { languages } from './languages.js';
import { inventions } from './inventions.js';
import { sandfield } from './sandfield.js';
import { buildings } from './buildings.js';
import { videogames } from './videogames.js';

export const DECKS = [cars, phones, geography, filmMusic, food, fifa, rugby, olympics, languages, inventions, sandfield, buildings, videogames];

/** Every category across every deck, each already carrying its own `pool`/`display`. */
export const ALL_CATEGORIES = DECKS.flatMap((deck) => deck.categories);

export const CATEGORY_BY_FQKEY = new Map(ALL_CATEGORIES.map((c) => [c.fqKey, c]));

// FIFA and Rugby are separate decks (separate pools, separate fqKey namespaces) but present
// as one "Sports" pick in the lobby and share one probability slot in the round schedule —
// otherwise two tournaments would crowd out every other topic's single checkbox by simply
// outnumbering it. See shared/rounds.js buildSchedule, which buckets by `topicKey`.
const TOPIC_OVERRIDES = { fifa: { key: 'sports', name: 'Sports' }, rugby: { key: 'sports', name: 'Sports' } };
const topicFor = (deck) => TOPIC_OVERRIDES[deck.key] ?? { key: deck.key, name: deck.name };

/** fqKey -> topic key, for bucketing round odds by topic rather than by deck (see below). */
export const TOPIC_KEY_BY_FQKEY = new Map(
  DECKS.flatMap((deck) => deck.categories.map((c) => [c.fqKey, topicFor(deck).key]))
);

/** For the host's lobby checklist and the schedule's probability buckets: one entry per topic. */
export const CATEGORY_GROUPS = (() => {
  const groups = new Map();
  for (const deck of DECKS) {
    const topic = topicFor(deck);
    if (!groups.has(topic.key)) groups.set(topic.key, { key: topic.key, name: topic.name, categories: [] });
    groups
      .get(topic.key)
      .categories.push(...deck.categories.map((c) => ({ fqKey: c.fqKey, title: c.title, prompt: c.prompt })));
  }
  return [...groups.values()];
})();

/** What a game plays if the host selects nothing — today's cars-only behaviour. */
export const DEFAULT_CATEGORY_KEYS = cars.categories.map((c) => c.fqKey);
