import { useState } from 'react';
import { X, Trophy, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  sport?: string;
  scoringFormat?: string;
  onSubmit: (
    matchId: string,
    scoreA: number,
    scoreB: number,
    scoreDetails?: string,
    winnerId?: string
  ) => Promise<void>;
  isSubmitting?: boolean;
}

export default function RecordScoreModal({
  isOpen,
  onClose,
  match,
  sport,
  scoringFormat,
  onSubmit,
  isSubmitting = false,
}: Props) {
  // Determine sport mode
  const resolvedSport = (sport || match?.tournamentName || '').toUpperCase();
  const isCricket = resolvedSport.includes('CRICKET') || scoringFormat === 'LIMITED_OVERS';
  const isCarrom = resolvedSport.includes('CARROM') || scoringFormat === 'POINTS_TO_25';
  const isChess = resolvedSport.includes('CHESS') || scoringFormat === 'GAME_POINTS';
  const isSetsSport =
    resolvedSport.includes('TENNIS') ||
    resolvedSport.includes('BADMINTON') ||
    scoringFormat === 'SETS_TO_11' ||
    scoringFormat === 'SETS_TO_21' ||
    (!isCricket && !isCarrom && !isChess);

  // TT / Badminton Sets state (Best of 3)
  const [set1A, setSet1A] = useState(11);
  const [set1B, setSet1B] = useState(8);
  const [set2A, setSet2A] = useState(11);
  const [set2B, setSet2B] = useState(9);
  const [set3A, setSet3A] = useState(0);
  const [set3B, setSet3B] = useState(0);

  // Cricket state
  const [cricketRunsA, setCricketRunsA] = useState(125);
  const [cricketWicketsA, setCricketWicketsA] = useState(4);
  const [cricketOversA, setCricketOversA] = useState('10.0');
  const [cricketRunsB, setCricketRunsB] = useState(128);
  const [cricketWicketsB, setCricketWicketsB] = useState(3);
  const [cricketOversB, setCricketOversB] = useState('9.2');

  // Carrom state
  const [carromPointsA, setCarromPointsA] = useState(25);
  const [carromPointsB, setCarromPointsB] = useState(18);

  // Chess state ('A_WIN' | 'B_WIN' | 'DRAW_TIEBREAK_A' | 'DRAW_TIEBREAK_B')
  const [chessResult, setChessResult] = useState<'A_WIN' | 'B_WIN'>('A_WIN');

  // Fallback simple score
  const [genericScoreA, setGenericScoreA] = useState(3);
  const [genericScoreB, setGenericScoreB] = useState(1);

  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !match) return null;

  const opponentAName = match.teamAName || match.playerAName || 'Opponent A';
  const opponentBName = match.teamBName || match.playerBName || 'Opponent B';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let finalScoreA = 0;
    let finalScoreB = 0;
    let details: Record<string, any> = {};
    let winnerId: string | undefined = undefined;

    if (isCricket) {
      finalScoreA = Number(cricketRunsA) || 0;
      finalScoreB = Number(cricketRunsB) || 0;
      if (finalScoreA === finalScoreB) {
        setError('Cricket knockout match cannot end in a tie. Please resolve Super Over/Boundary count.');
        return;
      }
      winnerId = finalScoreA > finalScoreB ? match.teamAId || match.playerAId : match.teamBId || match.playerBId;
      details = {
        sport: 'CRICKET',
        teamA: { runs: finalScoreA, wickets: cricketWicketsA, overs: cricketOversA },
        teamB: { runs: finalScoreB, wickets: cricketWicketsB, overs: cricketOversB },
        summary:
          finalScoreA > finalScoreB
            ? `${opponentAName} won by ${finalScoreA - finalScoreB} runs`
            : `${opponentBName} won by ${10 - cricketWicketsB} wickets`,
      };
    } else if (isCarrom) {
      finalScoreA = Number(carromPointsA) || 0;
      finalScoreB = Number(carromPointsB) || 0;
      if (finalScoreA === finalScoreB) {
        setError('Carrom match points cannot end in a tie.');
        return;
      }
      winnerId = finalScoreA > finalScoreB ? match.playerAId : match.playerBId;
      details = {
        sport: 'CARROM',
        target: 25,
        pointsA: finalScoreA,
        pointsB: finalScoreB,
      };
    } else if (isChess) {
      if (chessResult === 'A_WIN') {
        finalScoreA = 1;
        finalScoreB = 0;
        winnerId = match.playerAId;
      } else {
        finalScoreA = 0;
        finalScoreB = 1;
        winnerId = match.playerBId;
      }
      details = {
        sport: 'CHESS',
        result: `${finalScoreA} - ${finalScoreB}`,
        winner: chessResult === 'A_WIN' ? opponentAName : opponentBName,
      };
    } else if (isSetsSport) {
      // Sets calculation
      let aWins = 0;
      let bWins = 0;
      const setsData = [];

      if (set1A !== set1B) {
        set1A > set1B ? aWins++ : bWins++;
        setsData.push({ set: 1, a: set1A, b: set1B });
      }
      if (set2A !== set2B) {
        set2A > set2B ? aWins++ : bWins++;
        setsData.push({ set: 2, a: set2A, b: set2B });
      }
      if (set3A !== 0 || set3B !== 0) {
        if (set3A !== set3B) {
          set3A > set3B ? aWins++ : bWins++;
          setsData.push({ set: 3, a: set3A, b: set3B });
        }
      }

      if (aWins === bWins) {
        setError('Match cannot be a tie in sets. One opponent must win the majority of sets.');
        return;
      }

      finalScoreA = aWins;
      finalScoreB = bWins;
      winnerId = aWins > bWins ? match.playerAId : match.playerBId;
      details = {
        sport: 'SETS',
        sets: setsData,
        scoreLine: `${aWins}-${bWins}`,
      };
    } else {
      finalScoreA = Number(genericScoreA) || 0;
      finalScoreB = Number(genericScoreB) || 0;
      if (finalScoreA === finalScoreB) {
        setError('Score cannot be tied in elimination rounds.');
        return;
      }
      winnerId = finalScoreA > finalScoreB ? match.playerAId : match.playerBId;
    }

    try {
      await onSubmit(
        match.id,
        finalScoreA,
        finalScoreB,
        JSON.stringify(details),
        winnerId
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit match score');
    }
  };

  return (
    <div
      data-testid="record-score-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-card border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
              <Trophy className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Record Match Result</h2>
              <p className="text-xs text-slate-400">
                {match.roundName} &bull; Match #{match.matchNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="close-score-modal-btn"
            onClick={onClose}
            className="rounded-button p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div data-testid="score-modal-error" className="mb-4 flex items-center gap-2.5 rounded-panel border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Opponents Banner */}
        <div className="mb-5 flex items-center justify-between rounded-button border border-white/5 bg-slate-800/40 p-3 text-sm font-bold">
          <div className="text-white text-center flex-1">{opponentAName}</div>
          <div className="px-3 text-xs font-bold text-primary uppercase">VS</div>
          <div className="text-white text-center flex-1">{opponentBName}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Sets Sport Form (Table Tennis / Badminton) */}
          {isSetsSport && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sets Scoring (Best of 3)
              </div>

              {/* Set 1 */}
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-slate-400">Set 1:</span>
                <Input
                  data-testid="set-1-score-a"
                  type="number"
                  value={set1A}
                  onChange={(e) => setSet1A(Number(e.target.value))}
                  className="text-center"
                />
                <span className="text-slate-500">-</span>
                <Input
                  data-testid="set-1-score-b"
                  type="number"
                  value={set1B}
                  onChange={(e) => setSet1B(Number(e.target.value))}
                  className="text-center"
                />
              </div>

              {/* Set 2 */}
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-slate-400">Set 2:</span>
                <Input
                  data-testid="set-2-score-a"
                  type="number"
                  value={set2A}
                  onChange={(e) => setSet2A(Number(e.target.value))}
                  className="text-center"
                />
                <span className="text-slate-500">-</span>
                <Input
                  data-testid="set-2-score-b"
                  type="number"
                  value={set2B}
                  onChange={(e) => setSet2B(Number(e.target.value))}
                  className="text-center"
                />
              </div>

              {/* Set 3 (Optional Decider) */}
              <div className="flex items-center gap-3">
                <span className="w-16 text-xs text-slate-400">Set 3 (Decider):</span>
                <Input
                  data-testid="set-3-score-a"
                  type="number"
                  value={set3A}
                  onChange={(e) => setSet3A(Number(e.target.value))}
                  className="text-center"
                />
                <span className="text-slate-500">-</span>
                <Input
                  data-testid="set-3-score-b"
                  type="number"
                  value={set3B}
                  onChange={(e) => setSet3B(Number(e.target.value))}
                  className="text-center"
                />
              </div>
            </div>
          )}

          {/* 2. Cricket Scoring Form */}
          {isCricket && (
            <div className="space-y-4">
              <div className="rounded-button border border-white/5 bg-slate-800/30 p-3 space-y-2">
                <div className="text-xs font-bold text-white">{opponentAName} (1st Innings)</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Runs</label>
                    <Input
                      data-testid="cricket-runs-a"
                      type="number"
                      value={cricketRunsA}
                      onChange={(e) => setCricketRunsA(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Wickets</label>
                    <Input
                      data-testid="cricket-wickets-a"
                      type="number"
                      value={cricketWicketsA}
                      onChange={(e) => setCricketWicketsA(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Overs</label>
                    <Input
                      data-testid="cricket-overs-a"
                      value={cricketOversA}
                      onChange={(e) => setCricketOversA(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-button border border-white/5 bg-slate-800/30 p-3 space-y-2">
                <div className="text-xs font-bold text-white">{opponentBName} (2nd Innings)</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Runs</label>
                    <Input
                      data-testid="cricket-runs-b"
                      type="number"
                      value={cricketRunsB}
                      onChange={(e) => setCricketRunsB(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Wickets</label>
                    <Input
                      data-testid="cricket-wickets-b"
                      type="number"
                      value={cricketWicketsB}
                      onChange={(e) => setCricketWicketsB(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400">Overs</label>
                    <Input
                      data-testid="cricket-overs-b"
                      value={cricketOversB}
                      onChange={(e) => setCricketOversB(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Carrom Scoring Form */}
          {isCarrom && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{opponentAName} Points</label>
                <Input
                  data-testid="carrom-points-a"
                  type="number"
                  value={carromPointsA}
                  onChange={(e) => setCarromPointsA(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{opponentBName} Points</label>
                <Input
                  data-testid="carrom-points-b"
                  type="number"
                  value={carromPointsB}
                  onChange={(e) => setCarromPointsB(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* 4. Chess Scoring Form */}
          {isChess && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Match Result</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  data-testid="chess-win-a-btn"
                  onClick={() => setChessResult('A_WIN')}
                  className={`rounded-button border p-3 text-xs font-bold transition-all ${
                    chessResult === 'A_WIN'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-white/10 bg-slate-800/40 text-slate-300'
                  }`}
                >
                  {opponentAName} Wins (1.0 - 0.0)
                </button>
                <button
                  type="button"
                  data-testid="chess-win-b-btn"
                  onClick={() => setChessResult('B_WIN')}
                  className={`rounded-button border p-3 text-xs font-bold transition-all ${
                    chessResult === 'B_WIN'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-white/10 bg-slate-800/40 text-slate-300'
                  }`}
                >
                  {opponentBName} Wins (0.0 - 1.0)
                </button>
              </div>
            </div>
          )}

          {/* 5. Fallback Generic Scoring Form */}
          {!isSetsSport && !isCricket && !isCarrom && !isChess && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{opponentAName} Score</label>
                <Input
                  data-testid="generic-score-a"
                  type="number"
                  value={genericScoreA}
                  onChange={(e) => setGenericScoreA(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">{opponentBName} Score</label>
                <Input
                  data-testid="generic-score-b"
                  type="number"
                  value={genericScoreB}
                  onChange={(e) => setGenericScoreB(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              data-testid="cancel-score-btn"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              data-testid="submit-score-btn"
              loading={isSubmitting}
            >
              <CheckCircle2 className="size-4" />
              <span>Submit & Finalize Result</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
