import { ArrowLeft, Calendar, DollarSign, Trophy, UserPlus, Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import StatusBadge from '@/components/ui/badge/StatusBadge';

type Props = {
  tournament: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    type?: string;
    format?: string;
    status: string;
    startDate: string | Date;
    endDate?: string | Date;
    registrationDeadline?: string | Date;
    maxPlayers?: number;
    participants?: string[];
    prizePool?: number;
  };
  onRegister?: () => void;
  onDelete?: () => void;
  isRegistering?: boolean;
  isDeleting?: boolean;
};

export default function TournamentHero({
  tournament,
  onRegister,
  onDelete,
  isRegistering = false,
  isDeleting = false,
}: Props) {
  const navigate = useNavigate();
  const participantCount = tournament.participants?.length || 0;
  const isFull = tournament.maxPlayers ? participantCount >= tournament.maxPlayers : false;

  return (
    <div data-testid="tournament-hero" className="relative overflow-hidden rounded-card border border-white/10 bg-slate-900/70 p-6 md:p-8 backdrop-blur-xl">
      {/* Ambient glowing accent in corner */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-[90px]" />

      {/* Top action row */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          data-testid="back-to-tournaments-btn"
          onClick={() => navigate('/tournaments')}
          className="inline-flex items-center gap-2 rounded-button border border-white/10 bg-slate-800/60 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-white/20 hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Tournaments</span>
        </button>

        <div className="flex items-center gap-3">
          <StatusBadge status={tournament.status} />

          {onDelete && (
            <button
              type="button"
              data-testid="delete-tournament-btn"
              onClick={onDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-button border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/20 hover:text-rose-300 disabled:opacity-50"
              title="Delete tournament"
            >
              <Trash2 className="size-3.5" />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-button border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Trophy className="size-3" />
              {tournament.category || 'Esports'}
            </span>
            {tournament.format && (
              <span className="rounded-button border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                {tournament.format.replace(/_/g, ' ')}
              </span>
            )}
            {tournament.type && (
              <span className="rounded-button border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                {tournament.type}
              </span>
            )}
          </div>

          <h1 data-testid="tournament-hero-name" className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            {tournament.name}
          </h1>

          {tournament.description && (
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {tournament.description}
            </p>
          )}

          {/* Quick info row */}
          <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-medium text-slate-400">
            <div data-testid="tournament-participant-count" className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>
                {participantCount} / {tournament.maxPlayers || '∞'} Players
                {isFull && <span className="ml-1 text-rose-400 font-bold">(Full)</span>}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <span>
                {moment(tournament.startDate).isValid()
                  ? moment(tournament.startDate).format('DD MMM YYYY')
                  : 'TBD'}
                {tournament.endDate && ` – ${moment(tournament.endDate).format('DD MMM YYYY')}`}
              </span>
            </div>

            {tournament.prizePool ? (
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">
                  ${tournament.prizePool.toLocaleString()} Prize Pool
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Action Button */}
        {onRegister && (
          <div className="shrink-0">
            <button
              type="button"
              data-testid="register-tournament-btn"
              onClick={onRegister}
              disabled={isRegistering || isFull || tournament.status === 'COMPLETED' || tournament.status === 'CANCELLED'}
              className="inline-flex items-center justify-center gap-2 rounded-button bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-vibrant active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <UserPlus className="size-4" />
              <span>
                {isRegistering ? 'Registering...' : isFull ? 'Tournament Full' : 'Register for Tournament'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}