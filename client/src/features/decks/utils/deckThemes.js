export const DECK_THEMES = {
  violet: {
    label: 'Violet',
    bar: 'from-violet-500 to-purple-600',
    icon: 'from-violet-500 to-purple-600',
    fill: 'from-violet-500 to-purple-600',
  },
  amber: {
    label: 'Amber',
    bar: 'from-amber-500 to-orange-500',
    icon: 'from-amber-500 to-orange-600',
    fill: 'from-amber-500 to-orange-500',
  },
  rose: {
    label: 'Rose',
    bar: 'from-rose-500 to-pink-600',
    icon: 'from-rose-500 to-pink-600',
    fill: 'from-rose-500 to-pink-600',
  },
  blue: {
    label: 'Blue',
    bar: 'from-blue-500 to-cyan-600',
    icon: 'from-blue-500 to-cyan-600',
    fill: 'from-blue-500 to-cyan-600',
  },
  emerald: {
    label: 'Emerald',
    bar: 'from-emerald-500 to-teal-600',
    icon: 'from-emerald-500 to-teal-600',
    fill: 'from-emerald-500 to-teal-600',
  },
};

export const THEME_KEYS = ['violet', 'amber', 'rose', 'blue', 'emerald'];
export const DEFAULT_THEME = 'violet';

// Default color for decks without a 'color' field (by id order)
const FALLBACK_ORDER = ['amber', 'rose', 'blue', 'violet', 'emerald'];

export function getDeckTheme(deck) {
  if (deck?.color && DECK_THEMES[deck.color]) return DECK_THEMES[deck.color];
  const id = Number(deck?.id);
  const index = Number.isFinite(id)
    ? Math.abs(id - 1) % FALLBACK_ORDER.length
    : 0;
  return DECK_THEMES[FALLBACK_ORDER[index]];
}
