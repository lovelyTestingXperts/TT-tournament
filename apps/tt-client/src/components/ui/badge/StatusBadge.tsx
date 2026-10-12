type StatusType = 'active' | 'upcoming' | 'completed' | 'draft' | 'cancelled' | string;

type Props = {
  status: StatusType;
};

const statusStyles: Record<string, string> = {
  active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  upcoming: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  completed: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  draft: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  cancelled: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
};

const dotColors: Record<string, string> = {
  active: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]',
  upcoming: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]',
  completed: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
  draft: 'bg-slate-400 shadow-[0_0_6px_rgba(148,163,184,0.8)]',
  cancelled: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
};

export default function StatusBadge({ status }: Props) {
  const normalized = (status || 'upcoming').toLowerCase();
  const style = statusStyles[normalized] || statusStyles.upcoming;
  const dot = dotColors[normalized] || dotColors.upcoming;

  return (
    <span
      data-testid="status-badge"
      data-status={normalized}
      className={`
        inline-flex items-center gap-1.5
        rounded-badge border
        px-2.5 py-0.5
        text-xs font-medium capitalize
        ${style}
      `}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {normalized}
    </span>
  );
}