import PageLayout from '../layout/PageLayout';
import StatsOverview from '../../features/analytics/components/StatsOverview';
import DeckList from '../../features/decks/components/DeckList';

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
  return (
    <PageLayout>
      <div className="flex flex-col gap-10">
        <StatsOverview />
        <DeckList decks={sampleDecks} />
      </div>
    </PageLayout>
  );
}

export default DashboardPage;
