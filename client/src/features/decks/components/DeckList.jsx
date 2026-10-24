import { Inbox, Plus, RefreshCw } from 'lucide-react';
import DeckCard from './DeckCard';

function DeckList({
  decks = [],
  onCreate,
  onReset,
  onStudy,
  onEdit,
  onDelete,
  onViewCards,
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Your Decks
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Choose a deck to review or create a new one.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Data
          </button>
          <button
            onClick={onCreate}
            className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            <Plus className="h-4 w-4" />
            Create Deck
          </button>
        </div>
      </div>

      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-800 bg-[#0b1020] px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-400">
            <Inbox className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-white">No decks yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Create your first deck and add cards to review.
            </p>
          </div>
          <button
            onClick={onCreate}
            className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            <Plus className="h-4 w-4" />
            Create Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {decks.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onStudy={onStudy}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewCards={onViewCards}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default DeckList;
