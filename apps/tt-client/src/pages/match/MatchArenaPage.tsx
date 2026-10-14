import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Trophy,
  Swords,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';

import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/ui/button/Button';
import { GET_MATCH_BY_ID } from '@/features/tournament/graphql/queries';
import { START_MATCH, RECORD_MATCH_RESULT } from '@/features/tournament/graphql/mutations';

interface RoundResult {
  roundNumber: number;
  scoreA: number;
  scoreB: number;
  winner: string; // 'A' | 'B'
  winnerName: string;
}

export default function MatchArenaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_MATCH_BY_ID, {
    variables: { id: id || '' },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const [startMatchMutation, { loading: isStarting }] = useMutation(START_MATCH);
  const [recordMatchResult, { loading: isRecording }] = useMutation(RECORD_MATCH_RESULT);

  // Match format options
  const [selectedFormat, setSelectedFormat] = useState<'BEST_OF_1' | 'BEST_OF_3' | 'BEST_OF_5' | 'BEST_OF_7'>('BEST_OF_3');
  const [targetPoints, setTargetPoints] = useState<number>(11);

  // Live round tracking state
  const [completedRounds, setCompletedRounds] = useState<RoundResult[]>([]);
  const [currentRoundA, setCurrentRoundA] = useState<number>(11);
  const [currentRoundB, setCurrentRoundB] = useState<number>(8);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const match = data?.match;

  const roundsRequiredToWin = useMemo(() => {
    switch (selectedFormat) {
      case 'BEST_OF_1':
        return 1;
      case 'BEST_OF_3':
        return 2;
      case 'BEST_OF_5':
        return 3;
      case 'BEST_OF_7':
        return 4;
      default:
        return 2;
    }
  }, [selectedFormat]);

  const roundsWonA = useMemo(() => {
    return completedRounds.filter((r) => r.winner === 'A').length;
  }, [completedRounds]);

  const roundsWonB = useMemo(() => {
    return completedRounds.filter((r) => r.winner === 'B').length;
  }, [completedRounds]);

  const isMatchClinched = useMemo(() => {
    return roundsWonA >= roundsRequiredToWin || roundsWonB >= roundsRequiredToWin;
  }, [roundsWonA, roundsWonB, roundsRequiredToWin]);

  const matchWinner = useMemo(() => {
    if (!match) return null;
    if (roundsWonA >= roundsRequiredToWin) {
      return {
        id: match.teamAId || match.playerAId,
        name: match.teamAName || match.playerAName,
        side: 'A',
      };
    }
    if (roundsWonB >= roundsRequiredToWin) {
      return {
        id: match.teamBId || match.playerBId,
        name: match.teamBName || match.playerBName,
        side: 'B',
      };
    }
    return null;
  }, [roundsWonA, roundsWonB, roundsRequiredToWin, match]);

  if (loading) {
    return (
      <PageContainer>
        <div data-testid="match-arena-loading" className="flex min-h-[60vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageContainer>
    );
  }

  if (error || !match) {
    return (
      <PageContainer>
        <div data-testid="match-arena-error" className="glass-card rounded-card border border-rose-500/30 p-8 text-center">
          <AlertCircle className="mx-auto size-10 text-rose-400 mb-3" />
          <h2 className="text-xl font-bold text-white">Match Not Found</h2>
          <p className="text-sm text-slate-400 mt-1">Unable to locate the specified match details.</p>
          <Button
            type="button"
            data-testid="back-to-matches-btn"
            variant="outline"
            className="mt-5"
            onClick={() => navigate('/matches')}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Matches
          </Button>
        </div>
      </PageContainer>
    );
  }

  const playerAName = match.teamAName || match.playerAName || 'Player A';
  const playerBName = match.teamBName || match.playerBName || 'Player B';
  const isPending = match.status === 'PENDING';
  const isScheduled = match.status === 'SCHEDULED';
  const isLive = match.status === 'LIVE';
  const isCompleted = match.status === 'COMPLETED';

  // Handler: Start Match
  const handleStartMatch = async () => {
    setActionError(null);
    try {
      await startMatchMutation({
        variables: {
          matchId: match.id,
          format: selectedFormat,
        },
      });
      // Set initial round scores to standard target
      setCurrentRoundA(targetPoints);
      setCurrentRoundB(Math.max(0, targetPoints - 3));
      setActionSuccess(`Match started! Format: ${selectedFormat.replace(/_/g, ' ')}`);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Failed to start match');
    }
  };

  // Handler: Save Current Round Score
  const handleSaveRound = () => {
    setActionError(null);
    if (currentRoundA === currentRoundB) {
      setActionError('Round cannot end in a tie. One opponent must win the round.');
      return;
    }

    const roundNum = completedRounds.length + 1;
    const winnerSide = currentRoundA > currentRoundB ? 'A' : 'B';
    const winnerName = currentRoundA > currentRoundB ? playerAName : playerBName;

    const newResult: RoundResult = {
      roundNumber: roundNum,
      scoreA: currentRoundA,
      scoreB: currentRoundB,
      winner: winnerSide,
      winnerName,
    };

    setCompletedRounds((prev) => [...prev, newResult]);

    // Prepare next round default scores if match isn't clinched yet
    const nextWonA = winnerSide === 'A' ? roundsWonA + 1 : roundsWonA;
    const nextWonB = winnerSide === 'B' ? roundsWonB + 1 : roundsWonB;
    if (nextWonA < roundsRequiredToWin && nextWonB < roundsRequiredToWin) {
      setCurrentRoundA(targetPoints);
      setCurrentRoundB(Math.max(0, targetPoints - 2));
    }
  };

  // Handler: Finalize & Record Match Result
  const handleFinalizeMatch = async () => {
    if (!matchWinner) return;
    setActionError(null);

    const scoreDetailsJson = JSON.stringify({
      format: selectedFormat,
      targetPoints,
      rounds: completedRounds,
      summary: `${matchWinner.name} won (${roundsWonA} - ${roundsWonB}) in ${selectedFormat.replace(/_/g, ' ')}`,
    });

    try {
      await recordMatchResult({
        variables: {
          input: {
            matchId: match.id,
            scoreA: roundsWonA,
            scoreB: roundsWonB,
            winnerId: matchWinner.id || undefined,
            scoreDetails: scoreDetailsJson,
          },
        },
      });
      setActionSuccess(`Match finalized! Winner: ${matchWinner.name}`);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || 'Failed to submit match result');
    }
  };

  return (
    <PageContainer>
      <div data-testid="match-arena-page" className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            data-testid="back-nav-btn"
            onClick={() => navigate(`/tournaments/${match.tournamentId}`)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Tournament Bracket</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              to={`/tournaments/${match.tournamentId}`}
              data-testid="match-tournament-link"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Trophy className="size-3.5" />
              <span>{match.tournamentName}</span>
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {match.roundName} • Match #{match.matchNumber}
            </span>
          </div>
        </div>

        {/* Global Feedback Banners */}
        {actionError && (
          <div data-testid="arena-action-error" className="flex items-center gap-2 rounded-panel border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {actionSuccess && (
          <div data-testid="arena-action-success" className="flex items-center gap-2 rounded-panel border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Top Arena Card: Opponents & Live Status */}
        <div className="glass-card rounded-card border border-white/10 p-6 shadow-glow">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Official Match Arena</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {playerAName} vs {playerBName}
              </h1>
            </div>

            {/* Status Pill */}
            <div>
              {isCompleted ? (
                <span data-testid="match-status-badge" data-status="COMPLETED" className="inline-flex items-center gap-1.5 rounded-badge border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="size-3.5" />
                  <span>Match Completed</span>
                </span>
              ) : isLive ? (
                <span data-testid="match-status-badge" data-status="LIVE" className="inline-flex items-center gap-1.5 rounded-badge border border-rose-500/40 bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-400 animate-pulse">
                  <span className="size-2 rounded-full bg-rose-500" />
                  <span>Match Live</span>
                </span>
              ) : isPending ? (
                <span data-testid="match-status-badge" data-status="PENDING" className="inline-flex items-center gap-1.5 rounded-badge border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                  <Clock className="size-3.5" />
                  <span>Awaiting Opponents</span>
                </span>
              ) : (
                <span data-testid="match-status-badge" data-status="SCHEDULED" className="inline-flex items-center gap-1.5 rounded-badge border border-sky-500/40 bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-400">
                  <Swords className="size-3.5" />
                  <span>Scheduled (Ready to Start)</span>
                </span>
              )}
            </div>
          </div>

          {/* Opponents Matchup Arena */}
          <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 py-6">
            {/* Player A */}
            <div className={`md:col-span-3 rounded-card border p-5 text-center transition-all ${
              match.winnerId && match.winnerId === match.playerAId
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-glow'
                : 'border-white/10 bg-slate-950/60'
            }`}>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/20 text-xl font-extrabold text-primary mb-3">
                {playerAName.charAt(0).toUpperCase()}
              </div>
              <h3 data-testid="player-a-title" className="text-lg font-bold text-white truncate">{playerAName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Player / Team A</p>
              <div className="mt-4">
                <span data-testid="player-a-overall-score" className="text-3xl font-extrabold text-white">
                  {isCompleted ? match.scoreA : roundsWonA}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">Rounds Won</span>
              </div>
            </div>

            {/* Center VS & Scoreboard Indicator */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
              <span className="rounded-badge border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                VS
              </span>
              <span className="text-[11px] text-slate-500 mt-2">
                {selectedFormat.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Player B */}
            <div className={`md:col-span-3 rounded-card border p-5 text-center transition-all ${
              match.winnerId && match.winnerId === match.playerBId
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-glow'
                : 'border-white/10 bg-slate-950/60'
            }`}>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-cyan-500/20 text-xl font-extrabold text-cyan-400 mb-3">
                {playerBName.charAt(0).toUpperCase()}
              </div>
              <h3 data-testid="player-b-title" className="text-lg font-bold text-white truncate">{playerBName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Player / Team B</p>
              <div className="mt-4">
                <span data-testid="player-b-overall-score" className="text-3xl font-extrabold text-white">
                  {isCompleted ? match.scoreB : roundsWonB}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">Rounds Won</span>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 1: Match Start Configuration (Shown when SCHEDULED) */}
        {isScheduled && (
          <div data-testid="match-start-config-card" className="glass-card rounded-card border border-white/10 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <span>Configure Match Format &amp; Number of Rounds</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Decide the number of rounds for this match before initiating live scoring.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { key: 'BEST_OF_3', label: 'Best of 3', desc: 'First to win 2 rounds (Standard TT / Badminton)', rounds: 2 },
                { key: 'BEST_OF_5', label: 'Best of 5', desc: 'First to win 3 rounds (Championship / Finals)', rounds: 3 },
                { key: 'BEST_OF_1', label: 'Single Game (1 Round)', desc: 'Single decisive match to out (Cricket, Carrom, Chess)', rounds: 1 },
                { key: 'BEST_OF_7', label: 'Best of 7', desc: 'First to win 4 rounds (Grand Final Super Showdown)', rounds: 4 },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  data-testid={`select-format-${opt.key}`}
                  onClick={() => setSelectedFormat(opt.key as any)}
                  className={`flex flex-col text-left rounded-card border p-4 transition-all ${
                    selectedFormat === opt.key
                      ? 'border-primary bg-primary/15 shadow-sm'
                      : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-bold text-white">{opt.label}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{opt.desc}</span>
                  <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Target: {opt.rounds} Round Wins
                  </span>
                </button>
              ))}
            </div>

            {/* Target Points Selection */}
            <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
              <label htmlFor="target-points-input" className="text-xs font-semibold text-slate-300">
                Target Points Per Round:
              </label>
              <div className="flex items-center gap-2">
                {[11, 21, 25, 1].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setTargetPoints(pts)}
                    className={`rounded-button px-3 py-1 text-xs font-bold transition-all ${
                      targetPoints === pts
                        ? 'bg-primary text-white'
                        : 'border border-white/10 bg-slate-950 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {pts} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Action button to Start Match */}
            <div className="flex justify-end border-t border-white/10 pt-4">
              <Button
                type="button"
                data-testid="start-match-btn"
                onClick={handleStartMatch}
                disabled={isStarting}
                className="inline-flex items-center gap-2 bg-primary px-6 py-2.5 text-sm font-bold shadow-glow hover:bg-brand-vibrant"
              >
                <Play className="size-4" />
                <span>{isStarting ? 'Starting Match...' : 'Start Match & Open Scoring Arena'}</span>
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 2: Live Scoring Arena (Shown when LIVE) */}
        {isLive && (
          <div data-testid="live-scoring-arena" className="space-y-6">
            {/* Active Round Card */}
            {!isMatchClinched ? (
              <div data-testid="active-round-card" className="glass-card rounded-card border border-primary/30 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Swords className="size-4 text-primary" />
                    <span>Round #{completedRounds.length + 1} in Progress</span>
                  </h3>
                  <span className="rounded-badge border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    Target to Clinch: {roundsRequiredToWin} Wins
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Player A Score Controls */}
                  <div className="rounded-card border border-white/10 bg-slate-950/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{playerAName}</span>
                      <span className="text-[11px] text-slate-500">Points</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        data-testid="score-a-decrement-btn"
                        onClick={() => setCurrentRoundA((p) => Math.max(0, p - 1))}
                        className="rounded-button border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                      >
                        <Minus className="size-4" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        data-testid="round-score-a-input"
                        value={currentRoundA}
                        onChange={(e) => setCurrentRoundA(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-20 rounded-button border border-white/20 bg-slate-900 px-3 py-2 text-center text-2xl font-extrabold text-white focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        data-testid="score-a-increment-btn"
                        onClick={() => setCurrentRoundA((p) => p + 1)}
                        className="rounded-button border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Player B Score Controls */}
                  <div className="rounded-card border border-white/10 bg-slate-950/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{playerBName}</span>
                      <span className="text-[11px] text-slate-500">Points</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        data-testid="score-b-decrement-btn"
                        onClick={() => setCurrentRoundB((p) => Math.max(0, p - 1))}
                        className="rounded-button border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                      >
                        <Minus className="size-4" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        data-testid="round-score-b-input"
                        value={currentRoundB}
                        onChange={(e) => setCurrentRoundB(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-20 rounded-button border border-white/20 bg-slate-900 px-3 py-2 text-center text-2xl font-extrabold text-white focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        data-testid="score-b-increment-btn"
                        onClick={() => setCurrentRoundB((p) => p + 1)}
                        className="rounded-button border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    data-testid="save-round-btn"
                    onClick={handleSaveRound}
                    className="bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500"
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    <span>Save Round #{completedRounds.length + 1} Result</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Match Clinched Banner */
              <div data-testid="match-clinch-banner" className="glass-card rounded-card border border-amber-500/40 bg-amber-500/10 p-6 text-center space-y-4 shadow-glow">
                <Trophy className="mx-auto size-12 text-amber-400 animate-bounce" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Match Decided!</span>
                  <h3 className="text-2xl font-extrabold text-white mt-1">
                    {matchWinner?.name} has clinched the match ({roundsWonA} - {roundsWonB})!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Required {roundsRequiredToWin} round wins completed under {selectedFormat.replace(/_/g, ' ')}.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    type="button"
                    data-testid="finalize-match-btn"
                    onClick={handleFinalizeMatch}
                    disabled={isRecording}
                    className="bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-500"
                  >
                    <Award className="size-4 mr-2" />
                    <span>{isRecording ? 'Submitting Result...' : 'Finalize & Advance Winner to Next Round'}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Completed Rounds History */}
            {completedRounds.length > 0 && (
              <div data-testid="completed-rounds-history" className="glass-card rounded-card border border-white/10 p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">Round Breakdown</h4>
                <div className="divide-y divide-white/5">
                  {completedRounds.map((r) => (
                    <div key={r.roundNumber} data-testid={`round-result-row-${r.roundNumber}`} className="flex items-center justify-between py-3 text-xs">
                      <span className="font-bold text-primary">Round #{r.roundNumber}</span>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${r.winner === 'A' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                          {playerAName}: {r.scoreA}
                        </span>
                        <span className="text-slate-600">-</span>
                        <span className={`font-semibold ${r.winner === 'B' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                          {playerBName}: {r.scoreB}
                        </span>
                      </div>
                      <span className="rounded-badge border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        Winner: {r.winnerName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: Completed Match Summary (Shown when COMPLETED) */}
        {isCompleted && (
          <div data-testid="completed-match-summary" className="glass-card rounded-card border border-emerald-500/30 bg-slate-900/50 p-6 text-center space-y-5">
            <Award className="mx-auto size-12 text-amber-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Official Result</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Winner: {match.winnerName}
              </h2>
              <p className="text-sm font-semibold text-slate-300 mt-1">
                Final Score: {match.scoreA} - {match.scoreB}
              </p>
            </div>

            {match.scoreDetails && (
              <div className="mx-auto max-w-md rounded-panel border border-white/10 bg-slate-950/80 p-4 text-left text-xs space-y-2">
                <span className="font-bold text-primary uppercase text-[10px]">Match Record Details</span>
                <p className="text-slate-300 font-mono text-[11px] break-all">{match.scoreDetails}</p>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-3">
              <Button
                type="button"
                data-testid="return-bracket-btn"
                onClick={() => navigate(`/tournaments/${match.tournamentId}`)}
                className="bg-primary px-6 py-2 text-xs font-bold shadow-glow hover:bg-brand-vibrant"
              >
                <Trophy className="size-4 mr-2" />
                <span>Return to Tournament Bracket</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
