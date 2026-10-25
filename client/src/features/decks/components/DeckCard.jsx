import { BookOpen, CheckCircle2, Pencil, Play, Trash2 } from 'lucide-react';
import { getDeckTheme } from '../utils/deckThemes';

function DeckCard({ deck, onStudy, onEdit, onDelete, onViewCards }) {
  const theme = getDeckTheme(deck);

  const cardsCount = deck.cardsCount ?? 0;
  const progress = Math.min(100, Math.max(0, deck.progress ?? 0));
  const dueCount = deck.dueCount ?? 0;

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1020] p-6 shadow-xl shadow-black/20 transition-colors duration-300 hover:border-slate-700 sm:p-8">
      {/* Top gradient bar */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${theme.bar}`}
      />

      <div className="flex flex-col gap-5 pt-1">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.icon} text-white shadow-lg`}
          >
            <BookOpen className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="min-w-0 break-words text-xl font-bold leading-snug tracking-tight text-white transition-colors duration-200 group-hover:text-indigo-400">
                {deck.title}
              </h3>

              <div className="flex shrink-0 items-center gap-1 transition-opacity duration-200 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                <button
                  onClick={() => onEdit?.(deck)}
                  aria-label={`Edit deck "${deck.title}"`}
                  title="Edit"
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Pencil className="h-[18px] w-[18px]" />
                </button>
                <button
                  onClick={() => onDelete?.(deck)}
                  aria-label={`Delete deck "${deck.title}"`}
                  title="Delete"
                  className="rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                >
                  <Trash2 className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>

            <span className="mt-1 block text-xs font-semibold text-slate-400">
              {cardsCount} {cardsCount === 1 ? 'card' : 'cards'}
            </span>
          </div>
        </div>

        <p className="line-clamp-2 text-base leading-relaxed text-slate-400">
          {deck.description || 'No deck description'}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Mastery progress</span>
            <span className="tabular-nums text-indigo-400">{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Mastery progress"
            className="h-2 w-full overflow-hidden rounded-full bg-slate-800"
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.fill} transition-[width] duration-500 motion-reduce:transition-none`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {dueCount > 0 ? (
            <div className="whitespace-nowrap rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-400">
              {dueCount} {dueCount === 1 ? 'card due' : 'cards due'}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              All reviewed
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onViewCards?.(deck)}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Cards
            </button>
            <button
              onClick={() => onStudy?.(deck.id)}
              disabled={cardsCount === 0}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              <Play className="h-4 w-4 fill-current" />
              Study
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default DeckCard;
