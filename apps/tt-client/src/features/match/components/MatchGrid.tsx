import MatchCard from './MatchCard';

const matches = [
  {
    id: 1,
    teamA: 'India',
    teamB: 'Australia',
    tournament:
      'Winter Cup',
    referee:
      'John Doe',
    time:
      'Today • 7:30 PM',
    status:
      'scheduled',
  },
  {
    id: 2,
    teamA: 'England',
    teamB: 'Pakistan',
    tournament:
      'Summer League',
    referee:
      'Alex Smith',
    time:
      'Today • 9:00 PM',
    status: 'live',
  },
];

export default function MatchGrid() {
  return (
    <div
      className="
      grid
      gap-6
      md:grid-cols-2
      xl:grid-cols-3
      "
    >
      {matches.map(
        (match) => (
          <MatchCard
            key={match.id}
            {...match}
          />
        )
      )}
    </div>
  );
}