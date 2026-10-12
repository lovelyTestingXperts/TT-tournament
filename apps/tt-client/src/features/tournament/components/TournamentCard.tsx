import { Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import StatusBadge from '@/components/ui/badge/StatusBadge';

type Props = {
  id: string;
  name: string;
  category?: string;
  maxPlayers?: number;
  participantsCount?: number;
  startDate: string | Date;
  status: string;
};

export default function TournamentCard({
  id,
  name,
  category,
  maxPlayers,
  participantsCount = 0,
  startDate,
  status,
}: Props) {
  const navigate = useNavigate();

  // Normalize status for badge
  const normalizedStatus = status.toLowerCase() as
    | 'active'
    | 'upcoming'
    | 'completed';

  const badgeStatus =
    normalizedStatus === 'active' ||
    normalizedStatus === 'upcoming' ||
    normalizedStatus === 'completed'
      ? normalizedStatus
      : 'upcoming';

  return (
    <div
      data-testid="tournament-card"
      data-tournament-id={id}
      onClick={() => navigate(`/tournaments/${id}`)}
      className="
        glass-card
        group
        relative
        cursor-pointer
        overflow-hidden
        p-6
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-panel
      "
    >
      {/* Top row: Name & Status badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 data-testid="tournament-name" className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            {name}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {category ? `${category} Event` : 'Tournament Event'}
          </p>
        </div>

        <StatusBadge status={badgeStatus} />
      </div>

      {/* Stats indicators matching reference screenshot */}
      <div className="mt-8 space-y-3.5 text-sm font-medium text-slate-300">
        <div className="flex items-center gap-3">
          <Users className="size-4 text-primary" />
          <span>
            {participantsCount || maxPlayers || 0} Players
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="size-4 text-primary" />
          <span>
            {moment(startDate).isValid()
              ? moment(startDate).format('DD MMM YYYY')
              : 'TBD'}
          </span>
        </div>
      </div>
    </div>
  );
}