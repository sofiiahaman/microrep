import { useState } from 'react';
import { Check } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import {
  DECK_THEMES,
  THEME_KEYS,
  DEFAULT_THEME,
  getDeckTheme,
} from '../utils/deckThemes';

const labelClass =
  'mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300';
const fieldClass =
  'w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30';

// 'deck' if passed, the modal works in edit mode.
function DeckFormModal({ deck = null, onSubmit, onClose }) {
  const isEdit = Boolean(deck);

  const [title, setTitle] = useState(deck?.title ?? '');
  const [description, setDescription] = useState(deck?.description ?? '');
  const [color, setColor] = useState(
    deck
      ? (THEME_KEYS.find((key) => DECK_THEMES[key] === getDeckTheme(deck)) ??
          DEFAULT_THEME)
      : DEFAULT_THEME
  );
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a deck title');
      return;
    }
    onSubmit({ title: trimmed, description: description.trim(), color });
  };

  return (
    <Modal title={isEdit ? 'Edit Deck' : 'New Deck'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-5 py-6">
          <div>
            <label htmlFor="deck-title" className={labelClass}>
              Deck Title
            </label>
            <input
              id="deck-title"
              type="text"
              autoFocus
              maxLength={80}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. English: B2 Vocabulary"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'deck-title-error' : undefined}
              className={`${fieldClass} ${error ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30' : ''}`}
            />
            {error && (
              <p
                id="deck-title-error"
                role="alert"
                className="mt-2 text-xs text-rose-400"
              >
                {error}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="deck-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="deck-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the topic and goals of this deck…"
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div>
            <span id="deck-color-label" className={labelClass}>
              Color Theme
            </span>
            <div
              role="radiogroup"
              aria-labelledby="deck-color-label"
              className="flex items-center gap-4 px-1 py-1"
            >
              {THEME_KEYS.map((key) => {
                const selected = color === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={DECK_THEMES[key].label}
                    title={DECK_THEMES[key].label}
                    onClick={() => setColor(key)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${DECK_THEMES[key].icon} text-white transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1629] ${
                      selected
                        ? 'scale-110 ring-2 ring-indigo-300 ring-offset-2 ring-offset-[#0f1629]'
                        : 'hover:scale-105'
                    }`}
                  >
                    {selected && (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default DeckFormModal;
