type Props = {
  status: 'active' | 'upcoming' | 'completed';
};

const statusStyles = {
  active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  upcoming: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  completed: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
};

const dotColors = {
  active: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]',
  upcoming: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]',
  completed: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-badge border
        px-2.5 py-0.5
        text-xs font-medium capitalize
        ${statusStyles[status]}
      `}
    >
      <span className={`size-1.5 rounded-full ${dotColors[status]}`} />
      {status}
    </span>
  );
}