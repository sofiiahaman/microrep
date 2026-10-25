import { AlertTriangle } from 'lucide-react';
import Modal from '../../../components/common/Modal';

function ConfirmDeleteModal({ deck, onConfirm, onClose }) {
  const cardsCount = deck.cardsCount ?? 0;

  return (
    <Modal title="Delete Deck?" onClose={onClose} maxWidth="max-w-[480px]">
      <div className="flex items-start gap-4 py-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <p className="text-sm leading-relaxed text-slate-300">
          The deck{' '}
          <span className="font-semibold text-white">"{deck.title}"</span>
          {cardsCount > 0 && (
            <>
              {' '}
              along with all its {cardsCount}{' '}
              {cardsCount === 1 ? 'card' : 'cards'}
            </>
          )}{' '}
          will be permanently deleted. This action cannot be undone.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5">
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition-colors hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
