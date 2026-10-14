import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords,
  Trophy,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { useMatches } from '@/features/tournament/graphql/hooks';

export default function MatchesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, loading } = useMatches({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    search: search.trim() || undefined,
  });

  const matches = data?.matches ?? [];

  return (
    <PageContainer>
      <div data-testid="matches-page" className="space-y-6">
        {/* Header */}
        <div
          data-testid="match-header"
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Tournament Matches</h1>
            <p className="text-sm text-slate-400 mt-1">
              Live fixtures, bracket pairings, and match results across all tournaments
            </p>
          </div>

          <button
            type="button"
            data-testid="go-to-tournaments-btn"
            onClick={() => navigate('/tournaments')}
            className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-vibrant"
          >
            <Trophy className="size-4" />
            <span>View Tournaments</span>
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-card p-4 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              data-testid="match-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by player name, tournament, or round..."
              className="w-full rounded-button border border-white/10 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="w-full md:w-52">
            <select
              data-testid="match-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-button border border-white/10 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="ALL">All Match Statuses</option>
              <option value="SCHEDULED">Ready to Play (Scheduled)</option>
              <option value="PENDING">Awaiting Winner (Pending)</option>
              <option value="COMPLETED">Completed Matches</option>
            </select>
          </div>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div
            data-testid="loading-spinner"
            className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400"
          >
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div
            data-testid="empty-state"
            className="glass-card rounded-card flex flex-col items-center justify-center p-12 text-center"
          >
            <Swords className="size-10 text-slate-500 mb-3" />
            <h3 className="text-lg font-bold text-white">No Matches Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Matches are automatically generated when players join a tournament. Open any tournament to fill players and draw the bracket!
            </p>
          </div>
        ) : (
          <div
            data-testid="matches-grid"
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {matches.map((match: any) => {
              const isCompleted = match.status === 'COMPLETED';
              const isPending = match.status === 'PENDING';
              const isAWinner = isCompleted && match.winnerId && match.winnerId === match.playerAId;
              const isBWinner = isCompleted && match.winnerId && match.winnerId === match.playerBId;

              return (
                <div
                  key={match.id}
                  data-testid="match-card"
                  data-match-id={match.id}
                  onClick={() => navigate(`/matches/${match.id}`)}
                  className="glass-card group cursor-pointer rounded-card border border-white/10 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
                >
                  {/* Tournament & Status Header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Trophy className="size-3.5" />
                        {match.tournamentName}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {match.roundName} • Match #{match.matchNumber}
                      </p>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 rounded-badge border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        <span>Completed</span>
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1 rounded-badge border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                        <Clock className="size-3" />
                        <span>Pending</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-badge border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400">
                        <Swords className="size-3" />
                        <span>Scheduled</span>
                      </span>
                    )}
                  </div>

                  {/* Players Comparison */}
                  <div className="space-y-2.5">
                    <div
                      className={`flex items-center justify-between rounded-button border px-3.5 py-2.5 ${
                        isAWinner
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-white/5 bg-slate-900/70 text-white'
                      }`}
                    >
                      <span className="text-sm font-bold truncate">{match.playerAName}</span>
                      <span className="text-sm font-extrabold">{isCompleted ? match.scoreA : '-'}</span>
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-button border px-3.5 py-2.5 ${
                        isBWinner
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-white/5 bg-slate-900/70 text-white'
                      }`}
                    >
                      <span className="text-sm font-bold truncate">{match.playerBName}</span>
                      <span className="text-sm font-extrabold">{isCompleted ? match.scoreB : '-'}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
                    {isCompleted && match.winnerName ? (
                      <span className="font-semibold text-emerald-400">
                        Winner: {match.winnerName}
                      </span>
                    ) : (
                      <span>Enter match arena &amp; record rounds</span>
                    )}
                    <ExternalLink className="size-3.5 text-slate-500 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}