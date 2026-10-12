import {
  Calendar,
  Trophy,
  Users,
  Shield,
} from 'lucide-react';

import StatCard from '@/components/ui/card/StatCard';
import { useTournaments } from '@/features/tournament/graphql/hooks';
import { useUsers } from '@/features/member/graphql/hooks';

export default function DashboardStats() {
  const { data: tournamentsData, loading: tournamentsLoading } = useTournaments({ limit: 100 });
  const { data: usersData, loading: usersLoading } = useUsers({ limit: 100 });

  const tournaments = tournamentsData?.tournaments?.items ?? [];
  const tournamentCount = tournamentsData?.tournaments?.meta?.total ?? tournaments.length;

  const users = usersData?.users?.items ?? [];
  const totalUsers = usersData?.users?.meta?.total ?? users.length;

  const activePlayers = users.filter((u: any) => {
    const role = String(u.role || '').toLowerCase();
    return role.includes('player') && u.isActive;
  }).length;

  const activeTournaments = tournaments.filter(
    (t: any) => t.status === 'UPCOMING' || t.status === 'ONGOING'
  ).length;

  return (
    <div
      data-testid="dashboard-stats"
      className="
      grid
      gap-5
      md:grid-cols-2
      xl:grid-cols-4
    "
    >
      <StatCard
        title="Tournaments"
        value={tournamentsLoading ? '...' : tournamentCount}
        subtitle={`${activeTournaments} active / upcoming`}
        icon={Trophy}
      />

      <StatCard
        title="Active Players"
        value={usersLoading ? '...' : activePlayers}
        subtitle="Registered players"
        icon={Users}
      />

      <StatCard
        title="Total Members"
        value={usersLoading ? '...' : totalUsers}
        subtitle="Across all roles"
        icon={Shield}
      />

      <StatCard
        title="Matches"
        value={0}
        subtitle="Tournament matches"
        icon={Calendar}
      />
    </div>
  );
}