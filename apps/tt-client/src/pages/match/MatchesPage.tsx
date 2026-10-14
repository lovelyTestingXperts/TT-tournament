import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords,
  Trophy,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Loader2,
  Flame,
  Layers,
  Sparkles,
  GitBranch,
  ListFilter,
  Play,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { useMatches, useTournaments } from '@/features/tournament/graphql/hooks';
import MatchCapsule from '@/features/match/components/MatchCapsule';
import TournamentTreeView from '@/features/match/components/TournamentTreeView';

export default function MatchesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'capsules' | 'tree'>('capsules');
  const [groupByTournament, setGroupByTournament] = useState(false);
  const [selectedTreeTournamentId, setSelectedTreeTournamentId] = useState<string>('');

  const { data, loading } = useMatches({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    search: search.trim() || undefined,
  });

  const { data: tournamentsData } = useTournaments({ limit: 50 });
  const tournaments = tournamentsData?.tournaments?.items ?? [];

  const matches = data?.matches ?? [];

  // Categorize matches by "Smart Relevance"
  const { liveAndReady, recentCompleted, upcomingPending, olderCompleted } = useMemo(() => {
    const liveReady: any[] = [];
    const upcoming: any[] = [];
    const completed: any[] = [];

    matches.forEach((m: any) => {
      const pA = m.teamAName || m.playerAName || '';
      const pB = m.teamBName || m.playerBName || '';
      const hasBothOpponents = pA && pB && !pA.includes('TBD') && !pB.includes('TBD');

      if (m.status === 'COMPLETED') {
        completed.push(m);
      } else if (m.status === 'LIVE' || (m.status === 'SCHEDULED' && hasBothOpponents)) {
        liveReady.push(m);
      } else {
        upcoming.push(m);
      }
    });

    // Recent top 2 completed matches
    const top2Completed = completed.slice(0, 2);
    const archiveCompleted = completed.slice(2);

    return {
      liveAndReady: liveReady,
      recentCompleted: top2Completed,
      upcomingPending: upcoming,
      olderCompleted: archiveCompleted,
    };
  }, [matches]);

  // Group matches by tournament
  const groupedTournaments = useMemo(() => {
    const map = new Map<string, { id: string; name: string; matches: any[] }>();
    matches.forEach((m: any) => {
      const tId = m.tournamentId || 'general';
      if (!map.has(tId)) {
        map.set(tId, {
          id: tId,
          name: m.tournamentName || 'Tournament',
          matches: [],
        });
      }
      map.get(tId)!.matches.push(m);
    });
    return Array.from(map.values());
  }, [matches]);

  return (
    <PageContainer>
      <div data-testid="matches-page" className="space-y-6">
        {/* Header */}
        <div
          data-testid="match-header"
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-white">Tournament Matches</h1>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                {matches.length} Total
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Live fixtures, horizontal match capsules, and interactive championship brackets
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex rounded-button border border-white/10 bg-slate-900/90 p-1">
              <button
                type="button"
                data-testid="view-mode-capsules-btn"
                onClick={() => setViewMode('capsules')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  viewMode === 'capsules'
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListFilter className="size-3.5" />
                <span>Capsule Feed</span>
              </button>

              <button
                type="button"
                data-testid="view-mode-tree-btn"
                onClick={() => setViewMode('tree')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  viewMode === 'tree'
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="size-3.5" />
                <span>Championship Tree</span>
              </button>
            </div>

            <button
              type="button"
              data-testid="go-to-tournaments-btn"
              onClick={() => navigate('/tournaments')}
              className="inline-flex items-center gap-2 rounded-button bg-slate-800 border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-700 hover:border-white/20"
            >
              <Trophy className="size-3.5 text-primary" />
              <span>Tournaments</span>
            </button>
          </div>
        </div>

        {/* Filters & Organization Toolbar */}
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

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-48">
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

            {viewMode === 'capsules' && (
              <button
                type="button"
                data-testid="group-by-tournament-toggle"
                onClick={() => setGroupByTournament(!groupByTournament)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-button border px-3.5 py-2.5 text-xs font-bold transition-all ${
                  groupByTournament
                    ? 'border-primary/50 bg-primary/20 text-primary shadow-glow'
                    : 'border-white/10 bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="size-3.5" />
                <span>{groupByTournament ? 'Grouped by Tournament' : 'Group by Tournament'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body: Loading / Empty / Tree View / Capsule Feed */}
        {loading ? (
          <div
            data-testid="loading-spinner"
            className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400"
          >
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Loading tournament matches...</p>
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
        ) : viewMode === 'tree' ? (
          /* 1. TOURNAMENT TREE VIEW (World Championship Bracket Tree) */
          <div data-testid="matches-grid">
            <TournamentTreeView
              matches={matches}
              tournaments={tournaments}
              selectedTournamentId={selectedTreeTournamentId}
              onSelectTournament={setSelectedTreeTournamentId}
            />
          </div>
        ) : groupByTournament ? (
          /* 2. GROUPED BY TOURNAMENT VIEW */
          <div data-testid="matches-grid" className="space-y-6">
            {groupedTournaments.map((group) => {
              const completedCount = group.matches.filter((m) => m.status === 'COMPLETED').length;
              const totalCount = group.matches.length;
              const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div
                  key={group.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 space-y-4 shadow-lg backdrop-blur-sm"
                >
                  {/* Tournament Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary">
                        <Trophy className="size-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                          <span>{group.name}</span>
                          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                            {completedCount} / {totalCount} Finished
                          </span>
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Progress Bar */}
                      <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden hidden sm:block">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTreeTournamentId(group.id);
                          setViewMode('tree');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-primary/40 transition-all"
                      >
                        <GitBranch className="size-3.5 text-primary" />
                        <span>View Tree</span>
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Match Capsules */}
                  <div className="space-y-3">
                    {group.matches.map((match) => (
                      <MatchCapsule key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 3. SMART RELEVANCE STREAM VIEW */
          <div data-testid="matches-grid" className="space-y-8">
            {/* Category 1: Next Up / Ready to Play */}
            {liveAndReady.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                      <Flame className="size-3.5" />
                    </span>
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                      Next Up · Ready to Play ({liveAndReady.length})
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Both opponents determined &amp; ready
                  </span>
                </div>

                <div className="space-y-3">
                  {liveAndReady.map((match) => (
                    <MatchCapsule
                      key={match.id}
                      match={match}
                      priorityBadge="next-up"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Category 2: Recent Highlights (Top 2 Just Done) */}
            {recentCompleted.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-300">
                      Recent Results ({recentCompleted.length})
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Latest completed match scores
                  </span>
                </div>

                <div className="space-y-3">
                  {recentCompleted.map((match) => (
                    <MatchCapsule
                      key={match.id}
                      match={match}
                      priorityBadge="recent"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Category 3: Upcoming & Pending Bracket Matches */}
            {upcomingPending.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                      <Clock className="size-3.5" />
                    </span>
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-sky-300">
                      Upcoming &amp; Pending Matches ({upcomingPending.length})
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    Awaiting previous round winners
                  </span>
                </div>

                <div className="space-y-3">
                  {upcomingPending.map((match) => (
                    <MatchCapsule key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {/* Category 4: Match History / Older Archive */}
            {olderCompleted.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="size-4" />
                    <h2 className="text-xs font-bold uppercase tracking-wider">
                      Earlier Completed Matches ({olderCompleted.length})
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {olderCompleted.map((match) => (
                    <MatchCapsule key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}