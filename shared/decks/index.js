import { cars } from './cars.js';
import { phones } from './phones.js';
import { geography } from './geography.js';
import { filmMusic } from './filmMusic.js';
import { food } from './food.js';
import { fifa } from './fifa.js';
import { rugby } from './rugby.js';
import { olympics } from './olympics.js';

export const DECKS = [cars, phones, geography, filmMusic, food, fifa, rugby, olympics];

/** Every category across every deck, each already carrying its own `pool`/`display`. */
export const ALL_CATEGORIES = DECKS.flatMap((deck) => deck.categories);

export const CATEGORY_BY_FQKEY = new Map(ALL_CATEGORIES.map((c) => [c.fqKey, c]));

/** For the host's lobby checklist: titles/prompts only, grouped by deck. */
export const CATEGORY_GROUPS = DECKS.map((deck) => ({
  key: deck.key,
  name: deck.name,
  categories: deck.categories.map((c) => ({ fqKey: c.fqKey, title: c.title, prompt: c.prompt })),
}));

/** What a game plays if the host selects nothing — today's cars-only behaviour. */
export const DEFAULT_CATEGORY_KEYS = cars.categories.map((c) => c.fqKey);
