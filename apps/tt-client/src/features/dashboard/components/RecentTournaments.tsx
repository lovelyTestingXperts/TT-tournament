import { useNavigate } from 'react-router-dom';
import StatusBadge from '@/components/ui/badge/StatusBadge';
import { useTournaments } from '@/features/tournament/graphql/hooks';
import { Trophy } from 'lucide-react';

export default function RecentTournaments() {
  const navigate = useNavigate();
  const { data, loading } = useTournaments({ limit: 5 });

  const tournaments = data?.tournaments?.items ?? [];

  return (
    <div data-testid="recent-tournaments-card" className="glass-card rounded-[32px] p-6">
      <div
        className="
        mb-5
        flex
        items-center
        justify-between
      "
      >
        <h2 className="text-xl font-semibold text-white">
          Recent Tournaments
        </h2>

        <button
          type="button"
          data-testid="view-all-tournaments-btn"
          onClick={() => navigate('/tournaments')}
          className="text-sm font-medium text-primary hover:underline transition-all"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-slate-400">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
          <Trophy className="size-8 text-slate-500 mb-2" />
          <p className="text-sm">No tournaments scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tournaments.map((tournament: any) => {
            const rawStatus = (tournament.status || 'UPCOMING').toLowerCase();
            const badgeStatus =
              rawStatus === 'ongoing' ? 'active' : rawStatus === 'completed' ? 'completed' : 'upcoming';

            return (
              <div
                key={tournament.id}
                data-testid={`tournament-row-${tournament.id}`}
                onClick={() => navigate(`/tournaments/${tournament.id}`)}
                className="
                flex
                cursor-pointer
                items-center
                justify-between
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.03]
                p-4
                transition
                hover:border-white/10
                hover:bg-white/[0.06]
              "
              >
                <div>
                  <h3 className="font-medium text-white hover:text-primary transition-colors">
                    {tournament.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {tournament.participants?.length || 0} / {tournament.maxPlayers || 64} Players • {tournament.format || 'Single Elimination'}
                  </p>
                </div>

                <StatusBadge status={badgeStatus} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}