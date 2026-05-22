const players = [
  'Rohit Sharma',
  'Virat Kohli',
  'KL Rahul',
  'Hardik Pandya',
];

export default function ParticipantList() {
  return (
    <div className="glass-card rounded-[32px] p-6">
      <h2 className="mb-5 text-xl font-semibold">
        Participants
      </h2>

      <div className="space-y-3">
        {players.map(
          (player) => (
            <div
              key={player}
              className="
              rounded-2xl
              bg-white/5
              p-4
            "
            >
              {player}
            </div>
          )
        )}
      </div>
    </div>
  );
}