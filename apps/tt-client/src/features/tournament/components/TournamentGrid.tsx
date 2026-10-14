import { Trophy } from 'lucide-react';
import TournamentCard from './TournamentCard';

type TournamentItem = {
  id: string;
  name: string;
  category?: string;
  maxPlayers?: number;
  participants?: string[];
  startDate: string | Date;
  status: string;
  hasBothDivisions?: boolean;
};

type Props = {
  tournaments: TournamentItem[];
  loading?: boolean;
};

export default function TournamentGrid({ tournaments, loading }: Props) {
  if (loading) {
    return (
      <div data-testid="tournament-loading-spinner" className="glass-card flex flex-col items-center justify-center p-14 text-slate-400">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm">Loading tournaments...</p>
      </div>
    );
  }

  if (!tournaments.length) {
    return (
      <div data-testid="empty-state" className="glass-card flex flex-col items-center justify-center p-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-panel border border-white/[0.08] bg-white/[0.03] text-slate-500">
          <Trophy className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">No tournaments found</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-sm">
          Get started by creating your first tournament competition.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="tournament-grid" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          id={tournament.id}
          name={tournament.name}
          category={tournament.category}
          maxPlayers={tournament.maxPlayers}
          participantsCount={tournament.participants?.length || 0}
          startDate={tournament.startDate}
          status={tournament.status}
          hasBothDivisions={tournament.hasBothDivisions}
        />
      ))}
    </div>
  );
}