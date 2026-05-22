import {
  Calendar,
  Trophy,
  Users,
} from 'lucide-react';

import StatCard from '@/components/ui/card/StatCard';

export default function DashboardStats() {
  return (
    <div
      className="
      grid
      gap-5
      md:grid-cols-2
      xl:grid-cols-4
    "
    >
      <StatCard
        title="Tournaments"
        value={12}
        subtitle="+2 this month"
        icon={Trophy}
      />

      <StatCard
        title="Players"
        value={248}
        subtitle="+14 joined"
        icon={Users}
      />

      <StatCard
        title="Matches"
        value={54}
        subtitle="8 live"
        icon={Calendar}
      />

      <StatCard
        title="Members"
        value={1024}
        subtitle="+5% growth"
        icon={Users}
      />
    </div>
  );
}