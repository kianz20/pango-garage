/**
 * The food deck: sugar content of well-known foods and drinks.
 *
 * Fields
 *   id                       stable slug, prefixed `food-`
 *   name                     display name
 *   type                     soda / cereal / candy / other — shown as the subtitle
 *   servingDescription       what the sugar figure is per (e.g. "355ml can", "40g bowl")
 *   sugarGramsPerServing     grams of sugar in that serving
 *   fame                     1-5, how likely a non-enthusiast is to recognise it
 *
 * Figures are widely-published nutrition-label numbers, not independently spot-checked
 * against a single authoritative source the way the car pool is (see the `verified`
 * convention in shared/decks/cars.js) — good enough for gameplay, not a nutrition
 * database. Recipes change over time and vary by market; treat as "roughly right."
 */

export const FOODS = [
  { id: 'food-coca-cola', name: 'Coca-Cola', type: 'Soda', servingDescription: '355ml can', sugarGramsPerServing: 39, fame: 5 },
  { id: 'food-pepsi', name: 'Pepsi', type: 'Soda', servingDescription: '355ml can', sugarGramsPerServing: 41, fame: 5 },
  { id: 'food-sprite', name: 'Sprite', type: 'Soda', servingDescription: '355ml can', sugarGramsPerServing: 38, fame: 4 },
  { id: 'food-mountain-dew', name: 'Mountain Dew', type: 'Soda', servingDescription: '355ml can', sugarGramsPerServing: 46, fame: 4 },
  { id: 'food-dr-pepper', name: 'Dr Pepper', type: 'Soda', servingDescription: '355ml can', sugarGramsPerServing: 40, fame: 4 },
  { id: 'food-fanta', name: 'Fanta Orange', type: 'Soda', servingDescription: '355ml can', sugarGramsPerServing: 44, fame: 4 },
  { id: 'food-redbull', name: 'Red Bull', type: 'Energy drink', servingDescription: '250ml can', sugarGramsPerServing: 27, fame: 5 },
  { id: 'food-gatorade', name: 'Gatorade', type: 'Sports drink', servingDescription: '591ml bottle', sugarGramsPerServing: 34, fame: 4 },
  { id: 'food-frosted-flakes', name: 'Frosted Flakes', type: 'Cereal', servingDescription: '30g bowl', sugarGramsPerServing: 11, fame: 4 },
  { id: 'food-froot-loops', name: 'Froot Loops', type: 'Cereal', servingDescription: '30g bowl', sugarGramsPerServing: 12, fame: 4 },
  { id: 'food-cocoa-puffs', name: 'Cocoa Puffs', type: 'Cereal', servingDescription: '30g bowl', sugarGramsPerServing: 12, fame: 3 },
  { id: 'food-cheerios', name: 'Cheerios (Original)', type: 'Cereal', servingDescription: '30g bowl', sugarGramsPerServing: 1, fame: 4 },
  { id: 'food-cornflakes', name: 'Corn Flakes', type: 'Cereal', servingDescription: '30g bowl', sugarGramsPerServing: 2, fame: 4 },
  { id: 'food-weetbix', name: 'Weet-Bix', type: 'Cereal', servingDescription: '2 biscuits (30g)', sugarGramsPerServing: 2, fame: 3 },
  { id: 'food-lucky-charms', name: 'Lucky Charms', type: 'Cereal', servingDescription: '30g bowl', sugarGramsPerServing: 10, fame: 4 },
  { id: 'food-snickers', name: 'Snickers (standard bar)', type: 'Candy', servingDescription: '52.7g bar', sugarGramsPerServing: 27, fame: 5 },
  { id: 'food-mars-bar', name: 'Mars Bar', type: 'Candy', servingDescription: '51g bar', sugarGramsPerServing: 33, fame: 4 },
  { id: 'food-kitkat', name: 'KitKat (4-finger)', type: 'Candy', servingDescription: '45g bar', sugarGramsPerServing: 24, fame: 5 },
  { id: 'food-skittles', name: 'Skittles', type: 'Candy', servingDescription: '61.5g bag', sugarGramsPerServing: 47, fame: 5 },
  { id: 'food-mms', name: "M&M's (Milk Chocolate)", type: 'Candy', servingDescription: '45g bag', sugarGramsPerServing: 30, fame: 5 },
  { id: 'food-reeses', name: "Reese's Peanut Butter Cups", type: 'Candy', servingDescription: '2-pack (42g)', sugarGramsPerServing: 21, fame: 4 },
  { id: 'food-twix', name: 'Twix (2-finger)', type: 'Candy', servingDescription: '50g bar', sugarGramsPerServing: 25, fame: 4 },
  { id: 'food-haribo-goldbears', name: 'Haribo Goldbears', type: 'Candy', servingDescription: '40g bag', sugarGramsPerServing: 21, fame: 4 },
  { id: 'food-ben-jerrys', name: "Ben & Jerry's (typical pint)", type: 'Ice cream', servingDescription: '2/3 cup (130g)', sugarGramsPerServing: 26, fame: 4 },
  { id: 'food-nutella', name: 'Nutella', type: 'Spread', servingDescription: '2 tbsp (37g)', sugarGramsPerServing: 21, fame: 5 },
  { id: 'food-orange-juice', name: 'Orange Juice', type: 'Juice', servingDescription: '250ml glass', sugarGramsPerServing: 21, fame: 5 },
  { id: 'food-chocolate-milk', name: 'Chocolate Milk', type: 'Dairy drink', servingDescription: '250ml glass', sugarGramsPerServing: 24, fame: 4 },
  { id: 'food-yoplait-yogurt', name: 'Yoplait Original Yogurt', type: 'Yogurt', servingDescription: '170g cup', sugarGramsPerServing: 26, fame: 3 },
  { id: 'food-glazed-donut', name: 'Glazed Doughnut', type: 'Baked good', servingDescription: '1 doughnut (60g)', sugarGramsPerServing: 12, fame: 4 },
  { id: 'food-oreo', name: 'Oreo (3 cookies)', type: 'Cookie', servingDescription: '34g serving', sugarGramsPerServing: 14, fame: 5 },
];

const display = (f) => ({ title: f.name, subtitle: f.type, meta: null });

const CATEGORIES = [
  {
    key: 'sugar',
    axis: 'sugarGramsPerServing',
    dir: 'desc',
    value: (f) => f.sugarGramsPerServing,
    title: 'Most sugar per serving first',
    prompt: 'Most sugar per serving at the top',
    statLabel: 'Sugar per serving',
    format: (v) => `${v}g`,
    minRelGap: 0.15,
    note: 'Grams of sugar per standard serving/label size.',
  },
];

export const food = {
  key: 'food',
  name: 'Food & Drink',
  items: FOODS,
  display,
  categories: CATEGORIES.map((c) => ({ ...c, fqKey: `food:${c.key}`, deckKey: 'food', deckName: 'Food & Drink', pool: FOODS, display })),
};

export default food;
