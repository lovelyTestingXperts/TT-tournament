import PageContainer from '@/components/layout/PageContainer';

import TournamentHero from '@/features/tournament/components/TournamentHero';
import TournamentOverview from '@/features/tournament/components/TournamentOverview';
import TournamentTabs from '@/features/tournament/components/TournamentTabs';

export default function TournamentDetailsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <TournamentHero />

        <TournamentTabs />

        <TournamentOverview />
      </div>
    </PageContainer>
  );
}