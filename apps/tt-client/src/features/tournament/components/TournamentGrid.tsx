import TournamentCard from './TournamentCard';

const tournaments = [
  {
    id: 1,
    name: 'Winter Cup',
    players: 120,
    date: '24 Dec 2026',
    status: 'active',
  },
  {
    id: 2,
    name: 'Championship League',
    players: 84,
    date: '15 Jan 2027',
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'Knockout Battle',
    players: 64,
    date: '12 Feb 2027',
    status: 'completed',
  },
];

export default function TournamentGrid() {
  return (
    <div
      className="
      grid
      gap-6
      md:grid-cols-2
      xl:grid-cols-3
      "
    >
      {tournaments.map(
        (tournament) => (
          <TournamentCard
            key={tournament.id}
            {...tournament}
          />
        )
      )}
    </div>
  );
}