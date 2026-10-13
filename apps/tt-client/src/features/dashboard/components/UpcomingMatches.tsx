import { useNavigate } from 'react-router-dom';
import { Swords, CheckCircle2, Clock } from 'lucide-react';
import { useMatches } from '@/features/tournament/graphql/hooks';

export default function UpcomingMatches() {
  const navigate = useNavigate();
  const { data, loading } = useMatches();

  const matches = (data?.matches ?? []).slice(0, 5);

  return (
    <div data-testid="upcoming-matches-card" className="glass-card rounded-[32px] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Tournament Matches
        </h2>

        <button
          type="button"
          data-testid="view-all-matches-btn"
          onClick={() => navigate('/matches')}
          className="text-sm font-medium text-primary hover:underline transition-all"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-slate-400">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
          <Swords className="size-8 text-slate-500 mb-2" />
          <p className="text-sm">No matches scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match: any) => {
            const isCompleted = match.status === 'COMPLETED';
            return (
              <div
                key={match.id}
                data-testid={`dashboard-match-row-${match.id}`}
                onClick={() => navigate(`/tournaments/${match.tournamentId}`)}
                className="cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-semibold text-primary truncate">
                    {match.tournamentName} • {match.roundName}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="size-3" />
                      {match.scoreA} - {match.scoreB}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sky-400 font-semibold">
                      <Clock className="size-3" />
                      {match.status}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm font-bold text-white">
                  <span className="truncate">{match.playerAName}</span>
                  <span className="mx-2 text-xs text-slate-400">VS</span>
                  <span className="truncate text-right">{match.playerBName}</span>
                </div>

                {isCompleted && match.winnerName && (
                  <p className="mt-1.5 text-[11px] font-medium text-emerald-400">
                    Winner: {match.winnerName}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}