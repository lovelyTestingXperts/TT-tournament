import { Calendar, DollarSign, Globe, Shield, Trophy, Users } from 'lucide-react';
import moment from 'moment-timezone';
import ParticipantList from './ParticipantList';
import TournamentMatchList from './TournamentMatchList';

type Props = {
  tournament: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    type?: string;
    format?: string;
    visibility?: string;
    status: string;
    startDate: string | Date;
    endDate?: string | Date;
    registrationDeadline?: string | Date;
    maxPlayers?: number;
    participants?: string[];
    prizePool?: number;
    matches?: any[];
  };
};

export default function TournamentOverview({ tournament }: Props) {
  const statCards = [
    {
      label: 'Format',
      value: tournament.format?.replace(/_/g, ' ') || 'Single Elimination',
      icon: Trophy,
      sub: 'Knockout structure',
    },
    {
      label: 'Platform / Type',
      value: tournament.type || 'Online',
      icon: Globe,
      sub: tournament.visibility || 'Public',
    },
    {
      label: 'Registration Closes',
      value: tournament.registrationDeadline && moment(tournament.registrationDeadline).isValid()
        ? moment(tournament.registrationDeadline).format('DD MMM, HH:mm')
        : 'Open until start',
      icon: Calendar,
      sub: 'Official cutoff',
    },
    {
      label: 'Prize Pool',
      value: tournament.prizePool ? `$${tournament.prizePool.toLocaleString()}` : 'Bragging Rights',
      icon: DollarSign,
      sub: 'Total allocation',
    },
  ];

  return (
    <div data-testid="tournament-overview" className="space-y-6">
      {/* Spec stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              data-testid={`stat-card-${stat.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="glass-card rounded-panel p-5 transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                <div className="flex size-7 items-center justify-center rounded-button bg-primary/10 text-primary">
                  <Icon className="size-3.5" />
                </div>
              </div>
              <p className="text-lg font-bold text-white capitalize">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Grid with Participants and Matches */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ParticipantList
          participants={tournament.participants}
          maxPlayers={tournament.maxPlayers}
        />

        <TournamentMatchList matches={tournament.matches} />
      </div>
    </div>
  );
}