import DashboardStats from '@/features/dashboard/components/DashboardStats';

import ParticipantList from './ParticipantList';
import TournamentMatchList from './TournamentMatchList';

export default function TournamentOverview() {
  return (
    <div className="space-y-6">
      <DashboardStats />

      <div
        className="
        grid
        gap-6
        xl:grid-cols-2
      "
      >
        <ParticipantList />

        <TournamentMatchList />
      </div>
    </div>
  );
}