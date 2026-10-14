import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Shuffle,
  Award,
  Play,
  GitBranch,
} from 'lucide-react';
import TournamentTreeView from '@/features/match/components/TournamentTreeView';

export type MatchDetail = {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: number;
  roundName: string;
  matchNumber: number;
  playerAId?: string | null;
  playerAName: string;
  playerBId?: string | null;
  playerBName: string;
  scoreA: number;
  scoreB: number;
  teamAId?: string | null;
  teamAName?: string | null;
  teamBId?: string | null;
  teamBName?: string | null;
  scoreDetails?: string | null;
  wave?: number;
  winnerId?: string | null;
  winnerName?: string | null;
  status: 'PENDING' | 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  isFinal: boolean;
  isBye: boolean;
  scheduledAt?: string | Date;
  completedAt?: string | Date | null;
};

type ParticipantDetail = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type Props = {
  matches?: any[];
  matchDetails?: MatchDetail[];
  participantDetails?: ParticipantDetail[];
  participantCount?: number;
  tournamentStatus?: string;
  winnerName?: string | null;
  currentWave?: number;
  isRegistrationClosed?: boolean;
  onGenerateMatches?: () => Promise<void> | void;
  onSeedPlayers?: () => Promise<void> | void;
  onCloseRegistration?: () => Promise<void> | void;
  onDrawWaveFixtures?: () => Promise<void> | void;
  onRecordResult?: (matchId: string, scoreA: number, scoreB: number) => Promise<void> | void;
  onOpenScoreModal?: (match: any) => void;
  onCreateCustomMatch?: (playerAId?: string, playerBId?: string, roundName?: string) => Promise<void> | void;
  isProcessing?: boolean;
};

export default function TournamentMatchList({
  matchDetails = [],
  participantDetails = [],
  participantCount = 0,
  tournamentStatus = 'DRAFT',
  winnerName,
  currentWave = 1,
  isRegistrationClosed = false,
  onGenerateMatches,
  onSeedPlayers,
  onCloseRegistration,
  onDrawWaveFixtures,
  onRecordResult,
  onOpenScoreModal,
  onCreateCustomMatch,
  isProcessing = false,
}: Props) {
  const [scores, setScores] = useState<Record<string, { scoreA: string; scoreB: string }>>({});
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [customPlayerA, setCustomPlayerA] = useState('');
  const [customPlayerB, setCustomPlayerB] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [matchViewMode, setMatchViewMode] = useState<'bracket' | 'tree'>('bracket');
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<'ALL' | number>('ALL');

  const handleScoreChange = (matchId: string, side: 'scoreA' | 'scoreB', value: string) => {
    setLocalError(null);
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        scoreA: prev[matchId]?.scoreA ?? '11',
        scoreB: prev[matchId]?.scoreB ?? '7',
        [side]: value,
      },
    }));
  };

  const handleSubmitScore = async (match: MatchDetail) => {
    if (!onRecordResult) return;
    setLocalError(null);

    const rawA = scores[match.id]?.scoreA ?? '11';
    const rawB = scores[match.id]?.scoreB ?? '7';
    const numA = parseInt(rawA, 10);
    const numB = parseInt(rawB, 10);

    if (isNaN(numA) || isNaN(numB) || numA < 0 || numB < 0) {
      setLocalError('Scores must be valid non-negative integers.');
      return;
    }

    if (numA === numB) {
      setLocalError('Match cannot end in a tie in knockout play. Please enter a decisive score.');
      return;
    }

    await onRecordResult(match.id, numA, numB);
  };

  const handleAddMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateCustomMatch) return;
    setLocalError(null);

    if (customPlayerA && customPlayerB && customPlayerA === customPlayerB) {
      setLocalError('A player cannot play against themselves. Please choose two different players.');
      return;
    }

    await onCreateCustomMatch(
      customPlayerA || undefined,
      customPlayerB || undefined,
    );
    setShowAddMatch(false);
    setCustomPlayerA('');
    setCustomPlayerB('');
  };

  // Group matches by round
  const roundsMap = new Map<number, MatchDetail[]>();
  matchDetails.forEach((m) => {
    const r = m.round || 1;
    if (!roundsMap.has(r)) {
      roundsMap.set(r, []);
    }
    roundsMap.get(r)!.push(m);
  });

  const sortedRounds = Array.from(roundsMap.entries()).sort((a, b) => a[0] - b[0]);
  const isCompleted = tournamentStatus === 'COMPLETED';

  return (
    <div data-testid="matches-list" className="glass-card rounded-card p-6 space-y-6">
      {/* Champion Celebration Banner when Final Winner is Crowned */}
      {winnerName && (
        <div
          data-testid="tournament-champion-banner"
          className="relative overflow-hidden rounded-panel border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-slate-900 p-5 shadow-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400">
                <Trophy className="size-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  Official Tournament Champion
                </span>
                <h3 data-testid="tournament-winner-name" className="text-2xl font-extrabold text-white mt-0.5">
                  {winnerName}
                </h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-badge border border-amber-400/40 bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <Award className="size-4" />
              <span>Championship Finalized</span>
            </span>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Tournament Bracket & Matches</h2>
          <p className="text-xs text-slate-400">
            {matchDetails.length > 0
              ? `${matchDetails.filter((m) => m.status === 'COMPLETED').length} of ${matchDetails.length} matches completed • Winners advance automatically`
              : 'Generate random bracket pairings once players have joined'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Registration Lock Status & Action */}
          {!isCompleted && matchDetails.length === 0 && (
            <div className="flex items-center gap-2">
              <span
                data-testid="registration-window-status-pill"
                className={`rounded-badge border px-2.5 py-1 text-xs font-semibold ${
                  isRegistrationClosed
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                    : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                }`}
              >
                {isRegistrationClosed ? 'Registration Closed' : 'Registration Open'}
              </span>

              {!isRegistrationClosed && onCloseRegistration && (
                <button
                  type="button"
                  data-testid="close-registration-btn"
                  onClick={onCloseRegistration}
                  disabled={isProcessing}
                  className="rounded-button border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50"
                >
                  Close Window
                </button>
              )}
            </div>
          )}

          {/* Draw Wave 1 / Initial fixtures */}
          {matchDetails.length === 0 && !isCompleted && (
            <>
              {onSeedPlayers && (
                <button
                  type="button"
                  data-testid="matches-seed-players-btn"
                  onClick={onSeedPlayers}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 rounded-button border border-primary/40 bg-primary/15 px-3.5 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-50"
                >
                  <Sparkles className="size-3.5" />
                  <span>{isProcessing ? 'Processing...' : 'Fill Dummy Players & Draw Matches'}</span>
                </button>
              )}

              {participantCount >= 2 && (
                <button
                  type="button"
                  data-testid="draw-wave-1-btn"
                  onClick={onDrawWaveFixtures || onGenerateMatches}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 rounded-button bg-primary px-4 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:bg-brand-vibrant disabled:opacity-50"
                >
                  <Shuffle className="size-3.5" />
                  <span>{isProcessing ? 'Drawing...' : 'Draw Wave 1 Fixtures'}</span>
                </button>
              )}
            </>
          )}

          {/* Draw Next Wave fixtures (when previous wave all finished and champion not yet crowned) */}
          {matchDetails.length > 0 && !isCompleted && onDrawWaveFixtures && (
            (() => {
              const maxWave = Math.max(...matchDetails.map((m) => m.wave || m.round || 1));
              const latestWaveMatches = matchDetails.filter((m) => (m.wave || m.round || 1) === maxWave);
              const isWaveComplete = latestWaveMatches.length > 0 && latestWaveMatches.every((m) => m.status === 'COMPLETED');
              if (!isWaveComplete) return null;

              return (
                <button
                  type="button"
                  data-testid="draw-next-wave-btn"
                  onClick={onDrawWaveFixtures}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 rounded-button bg-primary px-4 py-2 text-xs font-bold text-white shadow-glow transition-all hover:bg-brand-vibrant active:scale-95 disabled:opacity-50"
                >
                  <Shuffle className="size-3.5" />
                  <span>{isProcessing ? 'Drawing Next Wave...' : `Draw Wave ${maxWave + 1} Fixtures`}</span>
                </button>
              );
            })()
          )}

          {!isCompleted && participantCount >= 2 && onCreateCustomMatch && (
            <button
              type="button"
              data-testid="toggle-add-match-btn"
              onClick={() => setShowAddMatch(!showAddMatch)}
              className="inline-flex items-center gap-1.5 rounded-button border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-white/30 hover:bg-white/10"
            >
              <Plus className="size-3.5" />
              <span>{showAddMatch ? 'Cancel' : 'Add Match'}</span>
            </button>
          )}

          {matchDetails.length > 0 && (
            <div className="flex rounded-button border border-white/10 bg-slate-900/90 p-0.5">
              <button
                type="button"
                data-testid="toggle-bracket-list-btn"
                onClick={() => setMatchViewMode('bracket')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  matchViewMode === 'bracket'
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                List
              </button>
              <button
                type="button"
                data-testid="toggle-bracket-tree-btn"
                onClick={() => setMatchViewMode('tree')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  matchViewMode === 'tree'
                    ? 'bg-primary text-white shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GitBranch className="size-3" />
                <span>Tree</span>
              </button>
            </div>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-badge border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Swords className="size-3.5" />
            <span>{matchDetails.length} Matches</span>
          </span>
        </div>
      </div>

      {/* Local Validation Error */}
      {localError && (
        <div
          data-testid="match-validation-error"
          className="rounded-panel border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400"
        >
          {localError}
        </div>
      )}

      {/* Add Custom Match Drawer */}
      {showAddMatch && (
        <form
          data-testid="add-custom-match-form"
          onSubmit={handleAddMatchSubmit}
          className="rounded-panel border border-white/10 bg-slate-900/80 p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              Add New Tournament Match (Leave blank for Random Draw)
            </h4>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="custom-player-a-select" className="block text-[11px] font-semibold text-slate-400 mb-1">
                Player A (Optional - Random if empty)
              </label>
              <select
                id="custom-player-a-select"
                data-testid="custom-player-a-select"
                value={customPlayerA}
                onChange={(e) => setCustomPlayerA(e.target.value)}
                className="w-full rounded-button border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
              >
                <option value="">-- Random Registered Player --</option>
                {participantDetails.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="custom-player-b-select" className="block text-[11px] font-semibold text-slate-400 mb-1">
                Player B (Optional - Random if empty)
              </label>
              <select
                id="custom-player-b-select"
                data-testid="custom-player-b-select"
                value={customPlayerB}
                onChange={(e) => setCustomPlayerB(e.target.value)}
                className="w-full rounded-button border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
              >
                <option value="">-- Random Registered Player --</option>
                {participantDetails.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              data-testid="submit-custom-match-btn"
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-button bg-primary px-4 py-2 text-xs font-semibold text-white shadow-glow hover:bg-brand-vibrant disabled:opacity-50"
            >
              <Shuffle className="size-3.5" />
              <span>{customPlayerA && customPlayerB ? 'Create Selected Match' : 'Create Random Match'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Matches List, Tree View, or Empty State */}
      {matchViewMode === 'tree' && matchDetails.length > 0 ? (
        <TournamentTreeView
          matches={matchDetails}
          tournamentWinnerName={winnerName}
        />
      ) : matchDetails.length === 0 ? (
        <div
          data-testid="empty-matches-state"
          className="flex flex-col items-center justify-center rounded-panel border border-dashed border-white/10 p-10 text-center"
        >
          <Swords className="size-9 text-slate-500 mb-2.5" />
          <p className="text-sm font-semibold text-slate-300">No matches generated yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Once all players have joined the tournament, matches are randomly drawn. You can also click below to auto-fill dummy players and start the bracket immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Round Filter Chips (When multiple rounds exist) */}
          {sortedRounds.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/5 pt-1">
              <button
                type="button"
                data-testid="round-filter-all-btn"
                onClick={() => setSelectedRoundFilter('ALL')}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  selectedRoundFilter === 'ALL'
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                All Rounds ({matchDetails.length})
              </button>
              {sortedRounds.map(([rNum, rMatches]) => (
                <button
                  key={rNum}
                  type="button"
                  data-testid={`round-filter-r${rNum}-btn`}
                  onClick={() => setSelectedRoundFilter(Number(rNum))}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    selectedRoundFilter === Number(rNum)
                      ? 'bg-primary text-white shadow-glow'
                      : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Round {rNum} ({rMatches.length})
                </button>
              ))}
            </div>
          )}

          {/* Dedicated Scrollable Bracket Container */}
          <div
            data-testid="bracket-scroll-container"
            className="space-y-6 max-h-[640px] overflow-y-auto pr-2 scroll-smooth"
          >
            {(selectedRoundFilter === 'ALL'
              ? sortedRounds
              : sortedRounds.filter(([rNum]) => Number(rNum) === selectedRoundFilter)
            ).map(([roundNum, roundMatches]) => {
              const roundTitle = roundMatches[0]?.roundName || `Round ${roundNum}`;
              return (
                <div key={roundNum} data-testid={`bracket-round-${roundNum}`} className="space-y-3">
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/95 py-2.5 backdrop-blur-md">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Trophy className="size-3.5" />
                      <span>
                        Round {roundNum}: {roundTitle}
                      </span>
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {roundMatches.filter((m) => m.status === 'COMPLETED').length} / {roundMatches.length} Completed
                    </span>
                  </div>

                <div className="grid gap-3">
                  {roundMatches.map((match) => {
                    const isMatchCompleted = match.status === 'COMPLETED';
                    const isMatchPending = match.status === 'PENDING';
                    const isMatchScheduled = match.status === 'SCHEDULED' || match.status === 'LIVE';
                    const isAWinner = isMatchCompleted && match.winnerId && match.winnerId === match.playerAId;
                    const isBWinner = isMatchCompleted && match.winnerId && match.winnerId === match.playerBId;

                    const currentScoreA = scores[match.id]?.scoreA ?? '11';
                    const currentScoreB = scores[match.id]?.scoreB ?? '7';

                    return (
                      <div
                        key={match.id}
                        data-testid="match-item"
                        data-match-id={match.id}
                        data-match-status={match.status}
                        className={`rounded-panel border p-4 transition-all ${
                          match.isFinal
                            ? 'border-amber-500/30 bg-amber-500/[0.04]'
                            : isMatchCompleted
                              ? 'border-emerald-500/20 bg-slate-900/50'
                              : 'border-white/10 bg-slate-900/70 hover:border-white/20'
                        }`}
                      >
                        {/* Top metadata bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              Match #{match.matchNumber}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="font-semibold text-primary">
                              {match.roundName}
                            </span>
                            {match.isFinal && (
                              <span className="rounded-badge border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                                Championship Match
                              </span>
                            )}
                          </div>

                          <div>
                            {isMatchCompleted ? (
                              <span
                                data-testid="match-status-badge"
                                data-status="COMPLETED"
                                className="inline-flex items-center gap-1 rounded-badge border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400"
                              >
                                <CheckCircle2 className="size-3" />
                                <span>Completed</span>
                              </span>
                            ) : isMatchPending ? (
                              <span
                                data-testid="match-status-badge"
                                data-status="PENDING"
                                className="inline-flex items-center gap-1 rounded-badge border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300"
                              >
                                <Clock className="size-3" />
                                <span>Awaiting Previous Match Winner</span>
                              </span>
                            ) : (
                              <span
                                data-testid="match-status-badge"
                                data-status="SCHEDULED"
                                className="inline-flex items-center gap-1 rounded-badge border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400"
                              >
                                <Swords className="size-3" />
                                <span>Ready to Play</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Players & Score Row */}
                        <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-3">
                          {/* Player A */}
                          <div
                            className={`md:col-span-3 flex items-center justify-between rounded-button border px-3.5 py-2.5 ${
                              isAWinner
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                                : 'border-white/5 bg-slate-950/60 text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isAWinner && <Trophy className="size-4 text-amber-400 shrink-0" />}
                              <span data-testid="match-player-a" className="text-sm font-bold truncate">
                                {match.teamAName || match.playerAName}
                              </span>
                            </div>
                            {isMatchCompleted && (
                              <span className="text-base font-extrabold ml-2">
                                {match.scoreA}
                              </span>
                            )}
                          </div>

                          {/* Center VS or Final Score */}
                          <div className="md:col-span-1 flex flex-col items-center justify-center">
                            {isMatchCompleted ? (
                              <span
                                data-testid="match-final-score"
                                className="rounded-badge border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-extrabold text-emerald-300"
                              >
                                {match.scoreA} - {match.scoreB}
                              </span>
                            ) : (
                              <span className="rounded-badge border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                                VS
                              </span>
                            )}
                          </div>

                          {/* Player B */}
                          <div
                            className={`md:col-span-3 flex items-center justify-between rounded-button border px-3.5 py-2.5 ${
                              isBWinner
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                                : 'border-white/5 bg-slate-950/60 text-white'
                            }`}
                          >
                            {isMatchCompleted && (
                              <span className="text-base font-extrabold mr-2">
                                {match.scoreB}
                              </span>
                            )}
                            <div className="flex items-center gap-2 truncate ml-auto">
                              <span data-testid="match-player-b" className="text-sm font-bold truncate">
                                {match.teamBName || match.playerBName}
                              </span>
                              {isBWinner && <Trophy className="size-4 text-amber-400 shrink-0" />}
                            </div>
                          </div>
                        </div>

                        {/* Winner Callout or Score Entry Controls */}
                        {isMatchCompleted && match.winnerName && (
                          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-xs text-slate-400">
                            <span data-testid="match-winner-label" className="font-medium text-emerald-400">
                              Winner: <strong>{match.winnerName}</strong>
                              {match.isBye ? ' (Advanced via BYE)' : match.isFinal ? ' — Tournament Champion!' : ' (Advanced to next round)'}
                            </span>
                          </div>
                        )}

                        {isMatchScheduled && onRecordResult && (
                          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-slate-400 font-medium">Enter Score:</span>
                              <div className="flex items-center gap-1.5">
                                <label htmlFor={`score-a-${match.id}`} className="sr-only">
                                  {match.teamAName || match.playerAName} Score
                                </label>
                                <input
                                  id={`score-a-${match.id}`}
                                  type="number"
                                  min={0}
                                  data-testid="match-score-a-input"
                                  value={currentScoreA}
                                  onChange={(e) => handleScoreChange(match.id, 'scoreA', e.target.value)}
                                  className="w-16 rounded-button border border-white/15 bg-slate-950 px-2.5 py-1 text-center text-xs font-bold text-white focus:border-primary focus:outline-none"
                                  placeholder="Score A"
                                />
                                <span className="text-slate-500 font-bold">:</span>
                                <label htmlFor={`score-b-${match.id}`} className="sr-only">
                                  {match.teamBName || match.playerBName} Score
                                </label>
                                <input
                                  id={`score-b-${match.id}`}
                                  type="number"
                                  min={0}
                                  data-testid="match-score-b-input"
                                  value={currentScoreB}
                                  onChange={(e) => handleScoreChange(match.id, 'scoreB', e.target.value)}
                                  className="w-16 rounded-button border border-white/15 bg-slate-950 px-2.5 py-1 text-center text-xs font-bold text-white focus:border-primary focus:outline-none"
                                  placeholder="Score B"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/matches/${match.id}`}
                                data-testid={`enter-match-arena-${match.id}-btn`}
                                className="inline-flex items-center gap-1.5 rounded-button bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-glow transition-all hover:bg-brand-vibrant"
                              >
                                <Play className="size-3.5" />
                                <span>Match Arena &amp; Rounds</span>
                              </Link>

                              {onOpenScoreModal && (
                                <button
                                  type="button"
                                  data-testid={`open-sport-score-modal-${match.id}-btn`}
                                  onClick={() => onOpenScoreModal(match)}
                                  className="inline-flex items-center gap-1.5 rounded-button border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                                >
                                  <Trophy className="size-3.5" />
                                  <span>Sport Result Entry</span>
                                </button>
                              )}

                              <button
                                type="button"
                                data-testid="record-match-result-btn"
                                onClick={() => handleSubmitScore(match)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 rounded-button bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow transition-all hover:bg-emerald-500 disabled:opacity-50"
                              >
                                <CheckCircle2 className="size-3.5" />
                                <span>{isProcessing ? 'Saving...' : 'Submit Result & Advance Winner'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}