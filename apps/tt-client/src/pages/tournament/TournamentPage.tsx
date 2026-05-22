import PageContainer from '@/components/layout/PageContainer';

import TournamentFilters from '@/features/tournament/components/TournamentFilters';
import TournamentGrid from '@/features/tournament/components/TournamentGrid';
import TournamentHeader from '@/features/tournament/components/TournamentHeader';

export default function TournamentPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <TournamentHeader />
        <TournamentFilters />

        <TournamentGrid />
      </div>
    </PageContainer>
  );
}
