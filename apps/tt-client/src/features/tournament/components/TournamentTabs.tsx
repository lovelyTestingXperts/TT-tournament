const tabs = [
  'Overview',
  'Participants',
  'Matches',
  'Settings',
];

export default function TournamentTabs() {
  return (
    <div
      className="
      glass-card
      flex
      gap-3
      rounded-[28px]
      p-2
      overflow-x-auto
    "
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          className="
          rounded-2xl
          px-5
          py-3
          text-sm
          font-medium
          text-white/70
          transition
          hover:bg-white/10
          hover:text-white
        "
        >
          {tab}
        </button>
      ))}
    </div>
  );
}