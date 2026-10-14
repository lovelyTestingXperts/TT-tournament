import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Swords,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  DollarSign,
  Radio,
  Flame,
  Award,
  ChevronRight,
  ShieldCheck,
  Target,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import StatusBadge from '@/components/ui/badge/StatusBadge';
import { useTournaments, useMatches } from '@/features/tournament/graphql/hooks';
import { useAuth } from '@/features/auth/context/AuthContext';
import moment from 'moment-timezone';

const SPORTS = [
  { id: 'all', name: 'All Sports', icon: '🏆' },
  { id: 'table_tennis', name: 'Table Tennis', icon: '🏓', desc: 'Singles & Doubles • Best of 3/5 to 11' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', desc: 'Squad Teams • Limited Overs Run Chase' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', desc: 'Fast-paced sets to 21 points' },
  { id: 'chess', name: 'Chess', icon: '♟️', desc: 'Rapid & Classical • 1.0 Game Points' },
  { id: 'carrom', name: 'Carrom', icon: '🎯', desc: 'Board points to 25 • Queen cover bonus' },
];

import { useServerStatusStore } from '@/store/serverStatusStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedSport, setSelectedSport] = useState('all');
  const setServerDown = useServerStatusStore((state) => state.setServerDown);

  const { data: tournamentsData, loading: loadingTournaments, error: tournamentsError } =
    useTournaments({ limit: 6 });
  const { data: matchesData, loading: loadingMatches, error: matchesError } = useMatches();

  useEffect(() => {
    if (tournamentsError || matchesError) {
      setServerDown(
        true,
        'Server is down. Our sports gateway is currently unreachable. Please check your connection or retry shortly.'
      );
    }
  }, [tournamentsError, matchesError, setServerDown]);

  const allTournaments = tournamentsData?.tournaments?.items ?? [];
  const allMatches = matchesData?.matches ?? [];

  // Filter by sport if selected
  const tournaments = selectedSport === 'all'
    ? allTournaments
    : allTournaments.filter((t: any) =>
        (t.category || t.sport || '').toLowerCase().replace(/\s+/g, '_').includes(selectedSport.replace(/\s+/g, '_'))
      );

  const latestTournament = tournaments[0] || allTournaments[0];

  // Matches logic: Find live or earliest scheduled match
  const liveMatches = allMatches.filter((m: any) => m.status === 'LIVE');
  const upcomingMatches = allMatches.filter((m: any) => m.status === 'SCHEDULED' || m.status === 'PENDING');
  const completedMatches = allMatches.filter((m: any) => m.status === 'COMPLETED');

  // Priority current match (Live match > first upcoming match > sample match)
  const currentMatch = liveMatches[0] || upcomingMatches[0] || allMatches[0];

  // Tournaments with winners (Champions)
  const championTournaments = allTournaments.filter((t: any) => t.winnerName);

  return (
    <PageContainer>
      <div data-testid="home-page" className="space-y-8">
        {/* ================= HERO SECTION ================= */}
        <div
          data-testid="home-hero"
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-surface-900/80 to-surface-850/90 p-6 md:p-10 backdrop-blur-xl shadow-2xl"
        >
          {/* Ambient Glowing Blobs */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/20 blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 size-80 rounded-full bg-amber-500/15 blur-[120px]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1 text-xs font-bold text-primary shadow-[0_0_12px_rgba(230,0,38,0.3)]">
                <Radio className="size-3.5 animate-pulse text-primary" />
                <span>TX Live Multi-Sport Arena</span>
                <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] text-white">2026</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:leading-tight">
                Live Tournaments, Brackets & Real-Time Matches
              </h1>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
                Experience official sports championships across Table Tennis, Cricket, Badminton, Chess, and Carrom. Track live fixtures, view bracket progressions, and celebrate tournament winners.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  data-testid="hero-explore-tournaments-btn"
                  onClick={() => navigate('/tournaments')}
                  className="inline-flex items-center gap-2 rounded-button bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-vibrant active:scale-95"
                >
                  <Trophy className="size-4" />
                  <span>Explore Tournaments</span>
                  <ArrowRight className="size-4" />
                </button>

                <button
                  type="button"
                  data-testid="hero-view-matches-btn"
                  onClick={() => navigate('/matches')}
                  className="inline-flex items-center gap-2 rounded-button border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <Swords className="size-4" />
                  <span>View Match Fixtures</span>
                </button>

                {!isAuthenticated && (
                  <button
                    type="button"
                    data-testid="hero-join-arena-btn"
                    onClick={() => navigate('/register')}
                    className="inline-flex items-center gap-2 rounded-button border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                  >
                    <Sparkles className="size-4" />
                    <span>Join as Athlete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Live Stats Pill Box */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:w-72 shrink-0">
              <div className="rounded-2xl border border-white/[0.08] bg-surface-850/80 p-4 text-center backdrop-blur-md">
                <span className="block text-2xl font-black text-white">
                  {allTournaments.length}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Tournaments
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-surface-850/80 p-4 text-center backdrop-blur-md">
                <span className="block text-2xl font-black text-primary">
                  {allMatches.length}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Matches
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-surface-850/80 p-4 text-center backdrop-blur-md">
                <span className="block text-2xl font-black text-emerald-400">
                  {championTournaments.length}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Champions
                </span>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-surface-850/80 p-4 text-center backdrop-blur-md">
                <span className="block text-2xl font-black text-amber-400">
                  5
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Official Sports
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SPORT FILTER PILLS ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SPORTS.map((sport) => (
            <button
              key={sport.id}
              type="button"
              data-testid={`sport-filter-${sport.id}-btn`}
              onClick={() => setSelectedSport(sport.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedSport === sport.id
                  ? 'border-primary bg-primary text-white shadow-glow'
                  : 'border-white/[0.08] bg-surface-850/80 text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{sport.icon}</span>
              <span>{sport.name}</span>
            </button>
          ))}
        </div>

        {/* ================= 2-COLUMN HIGHLIGHT: LATEST TOURNAMENT & CURRENT MATCH ================= */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 1. LATEST TOURNAMENT CARD */}
          <div
            data-testid="latest-tournament-card"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-surface-900/90 p-6 md:p-8 backdrop-blur-xl transition-all hover:border-primary/40 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Trophy className="size-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    Featured Tournament
                  </span>
                </div>

                {latestTournament && <StatusBadge status={latestTournament.status} />}
              </div>

              {latestTournament ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-md bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {latestTournament.category || 'Multi-Sport'}
                    </span>
                    {latestTournament.format && (
                      <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-slate-300">
                        {latestTournament.format.replace(/_/g, ' ')}
                      </span>
                    )}
                    {latestTournament.competitionType === 'TEAM' && (
                      <span className="rounded-md bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-xs font-medium text-sky-300">
                        Squad / Team
                      </span>
                    )}
                  </div>

                  <h3
                    data-testid="latest-tournament-title"
                    className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors"
                  >
                    {latestTournament.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-5">
                    {latestTournament.description ||
                      'Join this tournament to compete against verified athletes. Automated bracket generation and match results recorded in real time.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-y border-white/[0.08] py-4 mb-6 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Participants</span>
                      <span className="font-bold text-white mt-0.5 block flex items-center gap-1">
                        <Users className="size-3.5 text-primary" />
                        {latestTournament.participants?.length || 0} / {latestTournament.maxPlayers || '∞'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Prize Pool</span>
                      <span className="font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
                        <DollarSign className="size-3.5" />
                        {latestTournament.prizePool ? `$${latestTournament.prizePool.toLocaleString()}` : 'Honor Trophy'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Starts On</span>
                      <span className="font-bold text-white mt-0.5 block flex items-center gap-1 truncate">
                        <Calendar className="size-3.5 text-amber-400 shrink-0" />
                        {latestTournament.startDate ? moment(latestTournament.startDate).format('DD MMM YYYY') : 'TBD'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center text-slate-400">
                  <Trophy className="size-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-white">No Tournaments Scheduled</p>
                  <p className="text-xs mt-1">Be the first to create and host a tournament in the arena.</p>
                </div>
              )}
            </div>

            <div>
              {latestTournament ? (
                <button
                  type="button"
                  data-testid="view-latest-tournament-btn"
                  onClick={() => navigate(`/tournaments/${latestTournament.id}`)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-primary/20 border border-primary/40 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary"
                >
                  <span>View Tournament & Bracket</span>
                  <ChevronRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="create-new-tournament-btn"
                  onClick={() => navigate('/tournaments/create')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
                >
                  <span>Create First Tournament</span>
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* 2. CURRENT / LIVE MATCH CARD */}
          <div
            data-testid="current-match-card"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-surface-900/90 p-6 md:p-8 backdrop-blur-xl transition-all hover:border-primary/40 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Radio className="size-4 animate-pulse" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                    {currentMatch?.status === 'LIVE' ? 'Live Match Broadcast' : 'Featured Match Fixture'}
                  </span>
                </div>

                <span
                  data-testid="current-match-status-badge"
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                    currentMatch?.status === 'LIVE'
                      ? 'border-rose-500/50 bg-rose-500/20 text-rose-300'
                      : currentMatch?.status === 'COMPLETED'
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                      : 'border-sky-500/50 bg-sky-500/20 text-sky-300'
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current animate-ping" />
                  <span>{currentMatch?.status || 'SCHEDULED'}</span>
                </span>
              </div>

              {currentMatch ? (
                <>
                  <div className="mb-3">
                    <span className="text-xs text-primary font-bold tracking-wide uppercase">
                      {currentMatch.tournamentName || 'Championship Tournament'}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {currentMatch.roundName || 'Wave Fixture Match'}
                    </h3>
                  </div>

                  {/* Competitor Head-to-Head Arena */}
                  <div className="rounded-2xl border border-white/[0.08] bg-surface-850/90 p-4 md:p-5 mb-5 space-y-3">
                    {/* Competitor A */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 font-bold text-xs">
                          {currentMatch.playerAName ? currentMatch.playerAName[0] : 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {currentMatch.teamAName || currentMatch.playerAName || 'Competitor A'}
                          </p>
                          <span className="text-[11px] text-slate-400">Home Seed</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                          {currentMatch.scoreA ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-xs text-slate-500 font-bold uppercase tracking-widest border-y border-white/[0.04] py-1">
                      <span>VS</span>
                    </div>

                    {/* Competitor B */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs">
                          {currentMatch.playerBName ? currentMatch.playerBName[0] : 'B'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {currentMatch.teamBName || currentMatch.playerBName || 'Competitor B'}
                          </p>
                          <span className="text-[11px] text-slate-400">Away Seed</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                          {currentMatch.scoreB ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentMatch.winnerName && (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300 font-semibold mb-5">
                      <Award className="size-4 text-amber-400 shrink-0" />
                      <span>Winner Crowned: {currentMatch.winnerName}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-10 text-center text-slate-400">
                  <Swords className="size-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-white">No Active Matches</p>
                  <p className="text-xs mt-1">Draw fixtures from any tournament to see real-time head-to-head match cards.</p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                data-testid="view-all-matches-hub-btn"
                onClick={() => navigate('/matches')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-primary/20 border border-primary/40 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary"
              >
                <span>View All Match Fixtures ({allMatches.length})</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= UPCOMING MATCHES SECTION ================= */}
        <div data-testid="upcoming-matches-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <span>Upcoming & Recent Match Fixtures</span>
              </h2>
              <p className="text-xs text-slate-400">Scheduled duels, rounds, and completed results</p>
            </div>

            <button
              type="button"
              data-testid="view-full-schedule-btn"
              onClick={() => navigate('/matches')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Full Schedule</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {allMatches.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
              <Clock className="size-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No Match Fixtures Generated Yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Open a tournament with registered players and click "Draw Wave 1 Fixtures" to schedule matches.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allMatches.slice(0, 6).map((m: any) => {
                const isDone = m.status === 'COMPLETED';
                return (
                  <div
                    key={m.id}
                    data-testid={`match-card-${m.id}`}
                    onClick={() => navigate(`/tournaments/${m.tournamentId}`)}
                    className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-surface-900/80 p-5 transition-all hover:border-primary/40 hover:bg-surface-850 shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                      <span className="font-bold text-primary truncate max-w-[160px]">
                        {m.tournamentName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                      }`}>
                        {m.roundName || 'Wave Match'}
                      </span>
                    </div>

                    <div className="space-y-2 py-1">
                      <div className="flex items-center justify-between font-semibold text-sm text-white">
                        <span className="truncate">{m.teamAName || m.playerAName || 'Competitor A'}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 font-mono">{m.scoreA ?? 0}</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold text-sm text-white">
                        <span className="truncate">{m.teamBName || m.playerBName || 'Competitor B'}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 font-mono">{m.scoreB ?? 0}</span>
                      </div>
                    </div>

                    {isDone && m.winnerName && (
                      <div className="mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] text-amber-300 flex items-center gap-1 font-semibold">
                        <Trophy className="size-3 text-amber-400" />
                        <span className="truncate">Winner: {m.winnerName}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= RECENT CHAMPIONS HALL OF FAME ================= */}
        {championTournaments.length > 0 && (
          <div data-testid="recent-champions-section" className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="size-5 text-amber-400" />
                <span>Recent Champions & Trophy Winners</span>
              </h2>
              <p className="text-xs text-slate-400">Official tournament champions crowned on the platform</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {championTournaments.slice(0, 3).map((t: any) => (
                <div
                  key={t.id}
                  data-testid={`champion-card-${t.id}`}
                  onClick={() => navigate(`/tournaments/${t.id}`)}
                  className="cursor-pointer rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface-900 to-surface-850 p-5 transition-all hover:border-amber-400/60 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 shrink-0">
                      <Trophy className="size-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Official Champion
                      </span>
                      <h4 className="text-base font-extrabold text-white truncate max-w-[200px]">
                        {t.winnerName}
                      </h4>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        {t.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MULTI-SPORT CATEGORIES SHOWCASE ================= */}
        <div data-testid="sports-categories-section" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="size-5 text-primary" />
              <span>Supported Sports & Dynamic Competition Formats</span>
            </h2>
            <p className="text-xs text-slate-400">Specialized rule configurations and scoring engines tailored for each sport</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPORTS.filter((s) => s.id !== 'all').map((sport) => (
              <div
                key={sport.id}
                data-testid={`sport-category-card-${sport.id}`}
                onClick={() => {
                  setSelectedSport(sport.id);
                  navigate(`/tournaments`);
                }}
                className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-surface-900/80 p-5 transition-all hover:border-primary/40 hover:bg-surface-850"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{sport.icon}</span>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                      {sport.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">Official Tournament Engine</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sport.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
