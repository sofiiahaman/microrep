import { useState } from 'react';
import PageLayout from '../layout/PageLayout';
import StatsOverview from '../../features/analytics/components/StatsOverview';
import DeckList from '../../features/decks/components/DeckList';
import ConfirmDeleteModal from '../../features/decks/components/ConfirmDeleteModal';
import DeckFormModal from '../../features/decks/components/DeckFormModal';

const sampleDecks = [
  {
    id: 1,
    title: 'JavaScript & React Interview',
    description:
      'Key JS concepts, asynchrony, Hooks, Virtual DOM, and optimization.',
    cardsCount: 3,
    progress: 0,
    dueCount: 2,
  },
  {
    id: 2,
    title: 'Spanish Language: Basic Course',
    description:
      'Essential phrases, verbs, and words for everyday communication.',
    cardsCount: 3,
    progress: 33,
    dueCount: 2,
  },
  {
    id: 3,
    title: 'Computer Networks & Web',
    description: 'Protocols, DNS, HTTP, and browser fundamentals.',
    cardsCount: 2,
    progress: 0,
    dueCount: 2,
  },
];

function DashboardPage() {
  const [deckToDelete, setDeckToDelete] = useState(null);
  const [form, setForm] = useState({ open: false, deck: null });

  const closeForm = () => setForm({ open: false, deck: null });

  const handleSaveDeck = (values) => {
    if (form.deck) {
      setDecks((prev) =>
        prev.map((d) => (d.id === form.deck.id ? { ...d, ...values } : d))
      );
    } else {
      setDecks((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...values,
          cardsCount: 0,
          progress: 0,
          dueCount: 0,
        },
      ]);
    }
    closeForm();
  };

  const handleConfirmDelete = () => {
    setDecks((prev) => prev.filter((d) => d.id !== deckToDelete.id));
    setDeckToDelete(null);
  };
  return (
    <PageLayout>
      <div className="flex flex-col gap-10">
        <StatsOverview />
        <DeckList
          decks={sampleDecks}
          onCreate={() => setForm({ open: true, deck: null })}
          onEdit={(deck) => setForm({ open: true, deck })}
          onDelete={(deck) => setDeckToDelete(deck)}
          onReset={() => setDecks(sampleDecks)}
        />
      </div>

      {form.open && (
        <DeckFormModal
          key={form.deck?.id ?? 'new'}
          deck={form.deck}
          onSubmit={handleSaveDeck}
          onClose={closeForm}
        />
      )}

      {deckToDelete && (
        <ConfirmDeleteModal
          deck={deckToDelete}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeckToDelete(null)}
        />
      )}
    </PageLayout>
  );
}

export default DashboardPage;
