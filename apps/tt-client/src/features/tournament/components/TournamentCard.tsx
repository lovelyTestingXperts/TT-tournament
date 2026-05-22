import {
  Calendar,
  Users,
} from 'lucide-react';

import StatusBadge from '@/components/ui/badge/StatusBadge';

type Props = {
  name: string;
  players: number;
  date: string;
  status:
    | 'active'
    | 'upcoming'
    | 'completed';
};

export default function TournamentCard({
  name,
  players,
  date,
  status,
}: Props) {
  return (
    <div
      className="
      glass-card
      rounded-[32px]
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-white/15
    "
    >
      <div
        className="
        flex
        items-start
        justify-between
      "
      >
        <div>
          <h3 className="text-xl font-semibold">
            {name}
          </h3>

          <p className="mt-1 text-white/50">
            Tournament Event
          </p>
        </div>

        <StatusBadge
          status={status}
        />
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 text-white/70">
          <Users size={18} />
          {players} Players
        </div>

        <div className="flex items-center gap-3 text-white/70">
          <Calendar size={18} />
          {date}
        </div>
      </div>
    </div>
  );
}