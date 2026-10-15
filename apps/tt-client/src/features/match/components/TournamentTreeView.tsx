import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Crown,
  Swords,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface MatchItem {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: number;
  roundName: string;
  matchNumber: number;
  playerAId?: string | null;
  playerAName?: string | null;
  playerBId?: string | null;
  playerBName?: string | null;
  teamAName?: string | null;
  teamBName?: string | null;
  scoreA?: number | null;
  scoreB?: number | null;
  winnerId?: string | null;
  winnerName?: string | null;
  status: string;
  isFinal?: boolean;
}

interface TournamentTreeViewProps {
  matches: MatchItem[];
  tournaments?: any[];
  selectedTournamentId?: string;
  onSelectTournament?: (id: string) => void;
  tournamentWinnerName?: string | null;
  tournamentName?: string;
}

export default function TournamentTreeView({
  matches,
  tournaments = [],
  selectedTournamentId,
  onSelectTournament,
  tournamentWinnerName,
  tournamentName,
}: TournamentTreeViewProps) {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Group matches by tournament
  const tournamentMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string; matches: MatchItem[] }>();
    matches.forEach((m) => {
      const tId = m.tournamentId || 'default';
      if (!map.has(tId)) {
        map.set(tId, { id: tId, name: m.tournamentName || 'Tournament', matches: [] });
      }
      map.get(tId)!.matches.push(m);
    });
    return map;
  }, [matches]);

  // Determine active tournament
  const activeTournamentId =
    selectedTournamentId ||
    (tournamentMap.size > 0 ? Array.from(tournamentMap.keys())[0] : '');

  const activeMatches = useMemo(() => {
    if (!activeTournamentId) return matches;
    return matches.filter((m) => m.tournamentId === activeTournamentId);
  }, [matches, activeTournamentId]);

  const activeTournament = tournaments.find((t) => t.id === activeTournamentId);
  const activeTitle = tournamentName || activeTournament?.name || activeMatches[0]?.tournamentName || 'Championship Tournament';
  const championWinner = tournamentWinnerName || activeTournament?.winnerName || activeMatches.find((m) => m.isFinal && m.status === 'COMPLETED')?.winnerName;

  // Organize matches by round
  const rounds = useMemo(() => {
    const roundMap: Record<number, MatchItem[]> = {};
    activeMatches.forEach((m) => {
      const r = m.round || 1;
      if (!roundMap[r]) roundMap[r] = [];
      roundMap[r].push(m);
    });
    // Sort matches within rounds by matchNumber
    Object.keys(roundMap).forEach((r) => {
      roundMap[Number(r)].sort((a, b) => a.matchNumber - b.matchNumber);
    });
    return roundMap;
  }, [activeMatches]);

  const maxRound = Math.max(...Object.keys(rounds).map(Number), 1);
  const finalMatch = rounds[maxRound]?.find((m) => m.isFinal) || rounds[maxRound]?.[0];

  // Partition matches into bilateral wings (Left wing vs Right wing)
  // For standard knockout: Round 1 matches 1..N/2 on left, N/2+1..N on right
  const { leftWingRounds, rightWingRounds } = useMemo(() => {
    const left: Record<number, MatchItem[]> = {};
    const right: Record<number, MatchItem[]> = {};

    for (let r = 1; r < maxRound; r++) {
      const roundMatches = rounds[r] || [];
      const half = Math.ceil(roundMatches.length / 2);
      left[r] = roundMatches.slice(0, half);
      right[r] = roundMatches.slice(half);
    }
    return { leftWingRounds: left, rightWingRounds: right };
  }, [rounds, maxRound]);

  const renderParticipantCapsule = (
    name?: string | null,
    score?: number | null,
    isWinner?: boolean,
    isPending?: boolean,
    side: 'left' | 'right' | 'center' = 'left',
  ) => {
    const displayName = name || 'TBD (Waiting)';
    const isTBD = displayName.includes('TBD');

    return (
      <div
        className={`group relative flex items-center justify-between gap-2 rounded-full border px-3 py-1.5 transition-all text-xs select-none shadow-sm ${
          isWinner
            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 font-extrabold shadow-glow'
            : isTBD
              ? 'border-dashed border-white/20 bg-slate-900/60 text-slate-500 font-normal'
              : 'border-white/15 bg-slate-900/90 text-white font-semibold hover:border-white/40'
        } ${side === 'right' ? 'flex-row-reverse' : ''}`}
        style={{ minWidth: '150px', maxWidth: '180px' }}
      >
        <div className="flex items-center gap-1.5 truncate">
          {isWinner && <Crown className="size-3 text-amber-400 shrink-0" />}
          <span className="truncate" title={displayName}>
            {displayName}
          </span>
        </div>

        {score !== undefined && score !== null && !isTBD ? (
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
              isWinner ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {score}
          </span>
        ) : (
          <span className="text-[10px] text-slate-600">-</span>
        )}
      </div>
    );
  };

  const renderMatchCard = (match: MatchItem, side: 'left' | 'right' | 'center' = 'left') => {
    const isCompleted = match.status === 'COMPLETED';
    const isAWinner = isCompleted && match.winnerId && match.winnerId === match.playerAId;
    const isBWinner = isCompleted && match.winnerId && match.winnerId === match.playerBId;

    return (
      <div
        key={match.id}
        data-testid={match.isFinal ? 'tree-match-card-final' : `tree-match-card-r${match.round}-m${match.matchNumber}`}
        data-match-id={match.id}
        onClick={() => navigate(`/matches/${match.id}`)}
        className={`relative flex flex-col gap-1.5 rounded-2xl border p-2.5 transition-all cursor-pointer backdrop-blur-md ${
          match.isFinal
            ? 'border-amber-400/60 bg-gradient-to-b from-amber-950/40 via-slate-950/80 to-slate-950/80 shadow-glow'
            : isCompleted
              ? 'border-emerald-500/30 bg-slate-950/80 hover:border-emerald-500/60 hover:bg-slate-900/90'
              : 'border-white/10 bg-slate-950/80 hover:border-primary/50 hover:bg-slate-900/90'
        }`}
      >
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span className="font-bold text-primary">{match.roundName || `R${match.round}`}</span>
          <span>Match #{match.matchNumber}</span>
        </div>

        <div className="flex flex-col gap-1">
          {renderParticipantCapsule(
            match.teamAName || match.playerAName,
            isCompleted ? match.scoreA : undefined,
            isAWinner,
            !match.playerAName && !match.teamAName,
            side,
          )}
          {renderParticipantCapsule(
            match.teamBName || match.playerBName,
            isCompleted ? match.scoreB : undefined,
            isBWinner,
            !match.playerBName && !match.teamBName,
            side,
          )}
        </div>
      </div>
    );
  };

  if (activeMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-12 text-center">
        <Layers className="size-10 text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-white">No Bracket Matches Available</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Select or start a tournament to view its live visual championship tree.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="tournament-tree-view"
      className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-slate-950/90 p-4 sm:p-6 shadow-2xl overflow-hidden"
    >
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-glow">
            <Trophy className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>{activeTitle}</span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Visual Bracket
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive bilateral knockout championship tree
            </p>
          </div>
        </div>

        {/* Tournament Selector & Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {tournamentMap.size > 1 && onSelectTournament && (
            <select
              value={activeTournamentId}
              onChange={(e) => onSelectTournament(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-primary focus:outline-none"
            >
              {Array.from(tournamentMap.values()).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Reset Zoom"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Bracket Canvas (Bilateral Championship Tree inspired by media attachment) */}
      <div
        className="w-full overflow-x-auto py-6"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
        }}
      >
        <div className="min-w-[840px] flex items-center justify-between gap-6 px-4">
          {/* Left Wing (Semifinals / Quarterfinals) */}
          <div className="flex-1 flex items-center justify-around gap-6">
            {Object.keys(leftWingRounds)
              .map(Number)
              .sort((a, b) => a - b)
              .map((r) => (
                <div key={`left-r-${r}`} className="flex flex-col gap-4 items-center">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    {r === maxRound - 1 ? 'Semifinal' : `Round ${r}`}
                  </div>
                  <div className="flex flex-col gap-6 justify-center">
                    {leftWingRounds[r]?.map((m) => renderMatchCard(m, 'left'))}
                  </div>
                </div>
              ))}
          </div>

          {/* Center Column: Grand Final & World Championship Crown Podium */}
          <div className="flex flex-col items-center justify-center gap-5 px-4 shrink-0">
            {/* Top Champion Podium Capsule */}
            <div className="flex flex-col items-center animate-fade-in">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
                <Sparkles className="size-3.5" />
                <span>World Championship</span>
                <Sparkles className="size-3.5" />
              </div>

              <div
                className={`flex flex-col items-center justify-center rounded-3xl border-2 px-6 py-3 shadow-2xl transition-all ${
                  championWinner
                    ? 'border-amber-400 bg-gradient-to-b from-amber-500/20 via-amber-950/40 to-slate-950 text-amber-200 shadow-glow'
                    : 'border-white/15 bg-slate-950/90 text-slate-500'
                }`}
                style={{ minWidth: '200px' }}
              >
                <Crown
                  className={`size-6 mb-1 ${
                    championWinner ? 'text-amber-400 animate-bounce' : 'text-slate-600'
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wide text-amber-400/80">
                  Tournament Winner
                </span>
                <span className="text-sm font-black text-white mt-0.5 truncate max-w-[180px]">
                  {championWinner || 'Pending Grand Final'}
                </span>
              </div>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="h-6 w-0.5 bg-gradient-to-b from-amber-400/60 to-primary/60" />

            {/* Grand Final Center Card */}
            {finalMatch && (
              <div className="flex flex-col items-center">
                <div className="text-xs font-black uppercase tracking-widest text-amber-300 mb-1.5">
                  FINAL
                </div>
                {renderMatchCard(finalMatch, 'center')}
              </div>
            )}
          </div>

          {/* Right Wing (Semifinals / Quarterfinals) */}
          <div className="flex-1 flex items-center justify-around gap-6 flex-row-reverse">
            {Object.keys(rightWingRounds)
              .map(Number)
              .sort((a, b) => a - b)
              .map((r) => (
                <div key={`right-r-${r}`} className="flex flex-col gap-4 items-center">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    {r === maxRound - 1 ? 'Semifinal' : `Round ${r}`}
                  </div>
                  <div className="flex flex-col gap-6 justify-center">
                    {rightWingRounds[r]?.map((m) => renderMatchCard(m, 'right'))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
