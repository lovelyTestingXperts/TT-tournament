import {
  Calendar,
  Shield,
  Trophy,
} from 'lucide-react';

import MatchStatusBadge from './MatchStatusBadge';

type Props = {
  teamA: string;
  teamB: string;
  tournament: string;
  referee: string;
  time: string;
  status:
    | 'scheduled'
    | 'live'
    | 'completed';
};

export default function MatchCard({
  teamA,
  teamB,
  tournament,
  referee,
  time,
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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">
            {tournament}
          </p>

          <h3 className="mt-3 text-xl font-bold">
            {teamA}
          </h3>

          <p className="text-white/50">
            VS
          </p>

          <h3 className="text-xl font-bold">
            {teamB}
          </h3>
        </div>

        <MatchStatusBadge
          status={status}
        />
      </div>

      <div className="mt-8 space-y-3 text-sm text-white/60">
        <div className="flex items-center gap-3">
          <Calendar size={16} />
          {time}
        </div>

        <div className="flex items-center gap-3">
          <Shield size={16} />
          Referee: {referee}
        </div>

        <div className="flex items-center gap-3">
          <Trophy size={16} />
          Match Ready
        </div>
      </div>
    </div>
  );
}