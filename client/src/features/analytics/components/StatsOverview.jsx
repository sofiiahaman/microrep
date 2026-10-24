import StatCard from './StatCard';
import { Clock, Flame, Award, BarChart2 } from 'lucide-react';

function StatsOverview({ stats }) {
  return (
    <section
      aria-label="Learning statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <StatCard
        title="Due for Review"
        value={stats?.dueToday ?? 6}
        subtitle="Cards for today"
        icon={Clock}
        tone="amber"
      />
      <StatCard
        title="Day Streak"
        value={`${stats?.streak ?? 3} days`}
        subtitle="Learning without breaks"
        icon={Flame}
        tone="orange"
      />
      <StatCard
        title="Mastered"
        value={stats?.mastered ?? 1}
        subtitle={`Out of ${stats?.total ?? 8} total cards`}
        icon={Award}
        tone="emerald"
      />
      <StatCard
        title="Reviewed Today"
        value={stats?.reviewedToday ?? 1}
        subtitle="Cards completed"
        icon={BarChart2}
        tone="indigo"
      />
    </section>
  );
}

export default StatsOverview;
