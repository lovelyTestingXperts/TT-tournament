import PageContainer from '@/components/layout/PageContainer';

import ActivityTimeline from '@/features/dashboard/components/ActivityTimeline';
import DashboardHero from '@/features/dashboard/components/DashboardHero';
import DashboardStats from '@/features/dashboard/components/DashboardStats';
import QuickActions from '@/features/dashboard/components/QuickActions';
import RecentTournaments from '@/features/dashboard/components/RecentTournaments';
import UpcomingMatches from '@/features/dashboard/components/UpcomingMatches';

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <DashboardHero />

        <DashboardStats />

        <div
          className="
          grid
          gap-6
          xl:grid-cols-[2fr_1fr]
        "
        >
          <RecentTournaments />

          <UpcomingMatches />
        </div>

        <div
          className="
          grid
          gap-6
          xl:grid-cols-[1fr_2fr]
        "
        >
          <QuickActions />

          <ActivityTimeline />
        </div>
      </div>
    </PageContainer>
  );
}