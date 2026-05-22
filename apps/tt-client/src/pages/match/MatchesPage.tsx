import PageContainer from '@/components/layout/PageContainer';

import MatchFilters from '@/features/match/components/MatchFilters';
import MatchGrid from '@/features/match/components/MatchGrid';
import MatchHeader from '@/features/match/components/MatchHeader';

export default function MatchesPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <MatchHeader />

        <MatchFilters />

        <MatchGrid />
      </div>
    </PageContainer>
  );
}