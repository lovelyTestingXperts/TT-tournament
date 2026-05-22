export default function UpcomingMatches() {
  const matches = [
    {
      teamA: 'Team Alpha',
      teamB: 'Team Omega',
      time: '7:30 PM',
    },
    {
      teamA: 'Knights',
      teamB: 'Titans',
      time: '9:00 PM',
    },
  ];

  return (
    <div className="glass-card rounded-[32px] p-6">
      <h2 className="mb-5 text-xl font-semibold">
        Upcoming Matches
      </h2>

      <div className="space-y-4">
        {matches.map(
          (match, index) => (
            <div
              key={index}
              className="
              rounded-3xl
              bg-white/10
              p-4
            "
            >
              <p className="font-medium">
                {match.teamA}
              </p>

              <p className="text-sm text-white/50">
                VS
              </p>

              <p className="font-medium">
                {match.teamB}
              </p>

              <p className="mt-2 text-sm text-violet-300">
                {match.time}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}