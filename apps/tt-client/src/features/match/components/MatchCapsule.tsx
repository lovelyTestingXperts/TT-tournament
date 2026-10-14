import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Swords,
  CheckCircle2,
  Clock,
  ExternalLink,
  Crown,
  Play,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface MatchCapsuleProps {
  match: any;
  priorityBadge?: 'next-up' | 'recent' | 'upcoming' | null;
  onEnterArena?: (matchId: string) => void;
}

export default function MatchCapsule({
  match,
  priorityBadge,
  onEnterArena,
}: MatchCapsuleProps) {
  const navigate = useNavigate();

  const isCompleted = match.status === 'COMPLETED';
  const isPending = match.status === 'PENDING';
  const isLive = match.status === 'LIVE';
  const isScheduled = match.status === 'SCHEDULED';

  const isAWinner = isCompleted && match.winnerId && (match.winnerId === match.playerAId || match.winnerId === match.teamAId);
  const isBWinner = isCompleted && match.winnerId && (match.winnerId === match.playerBId || match.winnerId === match.teamBId);

  const playerAName = match.teamAName || match.playerAName || 'TBD (Waiting)';
  const playerBName = match.teamBName || match.playerBName || 'TBD (Waiting)';

  const isTBD = playerAName.includes('TBD') || playerBName.includes('TBD');

  // Sport color indicator helper
  const getSportIcon = (name?: string) => {
    const s = (name || '').toUpperCase();
    if (s.includes('CRICKET')) return '🏏';
    if (s.includes('BADMINTON')) return '🏸';
    if (s.includes('CARROM')) return '🎯';
    if (s.includes('CHESS')) return '♟️';
    return '🏓';
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnterArena) {
      onEnterArena(match.id);
    } else {
      navigate(`/matches/${match.id}`);
    }
  };

  return (
    <div
      data-testid="match-card"
      data-match-id={match.id}
      onClick={() => navigate(`/matches/${match.id}`)}
      className={`group relative flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
        isCompleted
          ? 'border-emerald-500/20 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/80'
          : isLive
            ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900/80 to-slate-900/80 shadow-glow hover:border-rose-500/60'
            : match.isFinal
              ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900/70 to-slate-900/70 hover:border-amber-500/60'
              : 'border-white/10 bg-slate-900/60 hover:border-primary/40 hover:bg-slate-900/80 hover:-translate-y-0.5'
      }`}
    >
      {/* Priority Pill Banner (if specified) */}
      {priorityBadge === 'next-up' && (
        <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md">
          <Flame className="size-3" />
          <span>Next Up · Ready to Play</span>
        </span>
      )}
      {priorityBadge === 'recent' && (
        <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md">
          <CheckCircle2 className="size-3" />
          <span>Recent Result</span>
        </span>
      )}

      {/* 1. Left Context Capsule (Tournament, Round, Sport Tag) */}
      <div className="flex flex-wrap items-center gap-2.5 lg:w-[260px] shrink-0">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-base shadow-inner border border-white/5">
          {getSportIcon(match.tournamentName)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate">
            <Trophy className="size-3.5 text-primary shrink-0" />
            <span className="text-xs font-bold text-white truncate hover:underline" title={match.tournamentName}>
              {match.tournamentName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            <span className="font-medium text-slate-300">
              {match.roundName || `Round ${match.round}`}
            </span>
            <span>•</span>
            <span>Match #{match.matchNumber}</span>
            {match.isFinal && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold uppercase text-amber-300">
                Final
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Middle Capsule: The Arena Dual Matchup (Stadium Pill) */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/60 p-2 sm:px-4">
          {/* Opponent A */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div
              className={`size-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                isAWinner
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border border-white/10'
              }`}
            >
              {playerAName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  data-testid="match-player-a"
                  className={`text-xs sm:text-sm font-bold truncate block ${
                    isAWinner
                      ? 'text-emerald-300 font-extrabold'
                      : isCompleted
                        ? 'text-slate-400'
                        : 'text-white'
                  }`}
                  title={playerAName}
                >
                  {playerAName}
                </span>
                {isAWinner && <Crown className="size-3.5 text-amber-400 shrink-0" />}
              </div>
            </div>
          </div>

          {/* Central Score / VS Capsule */}
          <div className="mx-2 sm:mx-4 shrink-0 flex items-center">
            {isCompleted ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-sm sm:text-base font-black">
                <span className={isAWinner ? 'text-emerald-300 font-extrabold' : 'text-slate-400'}>
                  {match.scoreA}
                </span>
                <span className="text-slate-600">-</span>
                <span className={isBWinner ? 'text-emerald-300 font-extrabold' : 'text-slate-400'}>
                  {match.scoreB}
                </span>
              </div>
            ) : isLive ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-400 animate-pulse">
                <span className="size-1.5 rounded-full bg-rose-400" />
                <span>LIVE</span>
              </div>
            ) : isPending || isTBD ? (
              <div className="rounded-lg border border-white/5 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                PENDING
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
                <Swords className="size-3" />
                <span>VS</span>
              </div>
            )}
          </div>

          {/* Opponent B */}
          <div className="flex items-center justify-end gap-2.5 flex-1 min-w-0 text-right">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-end gap-1.5">
                {isBWinner && <Crown className="size-3.5 text-amber-400 shrink-0" />}
                <span
                  data-testid="match-player-b"
                  className={`text-xs sm:text-sm font-bold truncate block ${
                    isBWinner
                      ? 'text-emerald-300 font-extrabold'
                      : isCompleted
                        ? 'text-slate-400'
                        : 'text-white'
                  }`}
                  title={playerBName}
                >
                  {playerBName}
                </span>
              </div>
            </div>
            <div
              className={`size-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                isBWinner
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border border-white/10'
              }`}
            >
              {playerBName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Right Status & Quick Action Capsule */}
      <div className="flex items-center justify-between lg:justify-end gap-3 lg:w-[220px] shrink-0 border-t border-white/5 pt-2.5 lg:border-t-0 lg:pt-0">
        {/* Status Badge */}
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="size-3" />
            <span>Final</span>
          </span>
        ) : isLive ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-[11px] font-bold text-rose-400">
            <Play className="size-3" />
            <span>Playing</span>
          </span>
        ) : isPending || isTBD ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
            <Clock className="size-3" />
            <span>Awaiting</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-400">
            <Swords className="size-3" />
            <span>Scheduled</span>
          </span>
        )}

        {/* Enter Arena / View Details Button */}
        <button
          type="button"
          data-testid={`enter-match-arena-${match.id}-btn`}
          onClick={handleActionClick}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
            isCompleted
              ? 'border border-white/10 bg-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-slate-700 hover:text-white'
              : isLive || isScheduled
                ? 'bg-primary text-white shadow-glow hover:bg-brand-vibrant active:scale-95'
                : 'border border-white/10 bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isCompleted ? (
            <>
              <span>Summary</span>
              <ExternalLink className="size-3" />
            </>
          ) : isLive ? (
            <>
              <Play className="size-3 fill-white" />
              <span>Enter Arena</span>
            </>
          ) : (
            <>
              <Swords className="size-3" />
              <span>Enter Arena</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
