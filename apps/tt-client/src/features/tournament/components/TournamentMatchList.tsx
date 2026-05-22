const matches = [
  {
    teamA: 'India',
    teamB: 'Australia',
  },
  {
    teamA: 'England',
    teamB: 'Pakistan',
  },
];

export default function TournamentMatchList() {
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
              bg-white/5
              p-4
            "
            >
              <p className="font-medium">
                {match.teamA}
              </p>

              <p className="text-white/50">
                VS
              </p>

              <p className="font-medium">
                {match.teamB}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}