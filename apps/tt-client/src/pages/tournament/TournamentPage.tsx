import { useState, useMemo } from 'react';

import TournamentHeader from '@/features/tournament/components/TournamentHeader';
import TournamentFilters from '@/features/tournament/components/TournamentFilters';
import TournamentGrid from '@/features/tournament/components/TournamentGrid';
import { useTournaments } from '@/features/tournament/graphql/hooks';

export default function TournamentPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>();

  const queryInput = useMemo(() => {
    const input: Record<string, any> = {
      page: 1,
      limit: 30,
    };

    if (search.trim()) {
      input.search = search.trim();
    }

    if (status) {
      input.status = status;
    }

    return input;
  }, [search, status]);

  const { data, loading } = useTournaments(queryInput);

  const tournaments = data?.tournaments?.items ?? [];

  return (
    <div data-testid="tournaments-page" className="space-y-6">
      <TournamentHeader />

      <TournamentFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <TournamentGrid tournaments={tournaments} loading={loading} />
    </div>
  );
}
