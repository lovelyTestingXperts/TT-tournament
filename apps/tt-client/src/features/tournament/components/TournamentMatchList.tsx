import { Swords, Calendar, Trophy } from 'lucide-react';

type MatchItem = {
  teamA?: string;
  teamB?: string;
  round?: string;
  date?: string;
  score?: string;
};

type Props = {
  matches?: MatchItem[];
};

export default function TournamentMatchList({ matches }: Props) {
  const matchItems = matches && matches.length > 0 ? matches : [
    { teamA: 'Alpha Squad', teamB: 'Shadow Titans', round: 'Quarterfinal 1', score: '2 - 1' },
    { teamA: 'Viper Esports', teamB: 'Phoenix Gaming', round: 'Quarterfinal 2', score: '0 - 2' },
  ];

  return (
    <div data-testid="matches-list" className="glass-card rounded-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Upcoming Matches</h2>
          <p className="text-xs text-slate-400">Scheduled tournament fixtures</p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-badge border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <Swords className="size-3.5" />
          <span>Stage 1</span>
        </span>
      </div>

      <div className="space-y-3">
        {matchItems.map((match, index) => (
          <div
            key={index}
            data-testid="match-item"
            className="rounded-panel border border-white/5 bg-slate-900/60 p-4 transition-colors hover:border-white/15"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-primary flex items-center gap-1.5">
                <Trophy className="size-3" />
                {match.round || `Match ${index + 1}`}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="size-3" />
                Live Bracket
              </span>
            </div>

            <div className="grid grid-cols-5 items-center text-center">
              <div className="col-span-2 text-left">
                <p className="text-sm font-bold text-white truncate">{match.teamA}</p>
                <p className="text-[11px] text-slate-500">Seed #{index * 2 + 1}</p>
              </div>

              <div className="col-span-1 flex flex-col items-center justify-center">
                <span className="rounded-badge border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-bold text-primary">
                  {match.score || 'VS'}
                </span>
              </div>

              <div className="col-span-2 text-right">
                <p className="text-sm font-bold text-white truncate">{match.teamB}</p>
                <p className="text-[11px] text-slate-500">Seed #{index * 2 + 2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}