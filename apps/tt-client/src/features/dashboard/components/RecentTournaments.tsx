import StatusBadge from '@/components/ui/badge/StatusBadge';

const tournaments = [
  {
    id: 1,
    name: 'Winter Cup',
    players: 120,
    status: 'active',
  },
  {
    id: 2,
    name: 'Championship League',
    players: 84,
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'Knockout Battle',
    players: 64,
    status: 'completed',
  },
];

export default function RecentTournaments() {
  return (
    <div className="glass-card rounded-[32px] p-6">
      <div
        className="
        mb-5
        flex
        items-center
        justify-between
      "
      >
        <h2 className="text-xl font-semibold">
          Recent Tournaments
        </h2>

        <button className="text-sm text-violet-300">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {tournaments.map(
          (tournament) => (
            <div
              key={
                tournament.id
              }
              className="
              flex
              items-center
              justify-between
              rounded-3xl
              bg-white/5
              p-4
              transition
              hover:bg-white/10
            "
            >
              <div>
                <h3 className="font-medium">
                  {
                    tournament.name
                  }
                </h3>

                <p
                  className="
                  text-sm
                  text-white/50
                "
                >
                  {
                    tournament.players
                  }{' '}
                  Players
                </p>
              </div>

              <StatusBadge
                status={
                  tournament.status as
                    | 'active'
                    | 'upcoming'
                    | 'completed'
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}