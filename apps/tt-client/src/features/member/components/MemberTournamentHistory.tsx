import {
  Calendar,
  Trophy,
} from 'lucide-react';

const tournaments = [
  {
    id: '1',
    name: 'Summer Championship',
    role: 'Player',
    status: 'Active',
    joinedAt: '20 May 2026',
  },
  {
    id: '2',
    name: 'Punjab Open',
    role: 'Referee',
    status: 'Completed',
    joinedAt: '10 Apr 2026',
  },
  {
    id: '3',
    name: 'Winter League',
    role: 'Player',
    status: 'Upcoming',
    joinedAt: '02 Mar 2026',
  },
];

function TournamentStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles = {
    Active:
      'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',

    Completed:
      'bg-blue-500/10 border-blue-500/20 text-blue-400',

    Upcoming:
      'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full border
        px-3 py-1
        text-xs font-medium
        ${
          styles[
            status as keyof typeof styles
          ]
        }
      `}
    >
      {status}
    </span>
  );
}

export default function MemberTournamentHistory() {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
      "
    >
      {/* header */}
      <div
        className="
          flex items-center
          justify-between
          border-b border-white/10
          px-6 py-5
        "
      >
        <div>
          <h2 className="text-xl font-semibold text-white">
            Tournament History
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Tournaments this user
            participated in or managed.
          </p>
        </div>

        <div
          className="
            rounded-2xl
            bg-red-500/10
            p-3 text-red-400
          "
        >
          <Trophy className="size-5" />
        </div>
      </div>

      {/* table header */}
      <div
        className="
          grid grid-cols-12
          border-b border-white/10
          px-6 py-4
          text-sm font-medium
          text-zinc-500
        "
      >
        <div className="col-span-5">
          Tournament
        </div>

        <div className="col-span-2">
          Role
        </div>

        <div className="col-span-3">
          Status
        </div>

        <div className="col-span-2">
          Joined
        </div>
      </div>

      {/* rows */}
      <div>
        {tournaments.map(
          (tournament) => (
            <div
              key={tournament.id}
              className="
                grid grid-cols-12
                items-center
                border-b border-white/5
                px-6 py-5
                transition-colors
                hover:bg-red-500/5
              "
            >
              {/* tournament */}
              <div className="col-span-5">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex size-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-red-500/15
                      to-red-900/20
                    "
                  >
                    <Trophy className="size-5 text-red-400" />
                  </div>

                  <div>
                    <h4 className="font-medium text-white">
                      {
                        tournament.name
                      }
                    </h4>

                    <p className="text-sm text-zinc-500">
                      Tournament
                    </p>
                  </div>
                </div>
              </div>

              {/* role */}
              <div className="col-span-2">
                <span
                  className="
                    inline-flex items-center
                    rounded-full
                    border border-white/10
                    bg-white/5
                    px-3 py-1
                    text-xs
                    text-zinc-300
                  "
                >
                  {
                    tournament.role
                  }
                </span>
              </div>

              {/* status */}
              <div className="col-span-3">
                <TournamentStatusBadge
                  status={
                    tournament.status
                  }
                />
              </div>

              {/* joined */}
              <div className="col-span-2">
                <div
                  className="
                    flex items-center
                    gap-2 text-sm
                    text-zinc-400
                  "
                >
                  <Calendar className="size-4" />

                  {
                    tournament.joinedAt
                  }
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* footer */}
      <div
        className="
          border-t border-white/10
          px-6 py-4
        "
      >
        <p className="text-sm text-zinc-500">
          Total tournaments:{' '}
          {tournaments.length}
        </p>
      </div>
    </div>
  );
}