type TabKey = 'overview' | 'participants' | 'matches' | 'settings';

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  participantCount?: number;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'participants', label: 'Participants' },
  { key: 'matches', label: 'Matches' },
  { key: 'settings', label: 'Settings' },
];

export default function TournamentTabs({
  activeTab,
  onChange,
  participantCount,
}: Props) {
  return (
    <div
      role="tablist"
      aria-label="Tournament navigation tabs"
      data-testid="tournament-tabs"
      className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-testid={`tab-${tab.key}`}
            onClick={() => onChange(tab.key)}
            className={`
              relative flex items-center gap-2 rounded-button px-4 py-2 text-sm font-semibold transition-all
              ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }
            `}
          >
            <span data-testid={`${tab.key}-tab-btn`}>{tab.label}</span>
            {tab.key === 'participants' && typeof participantCount === 'number' && (
              <span
                data-testid="tab-participants-badge"
                className={`rounded-badge px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {participantCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}