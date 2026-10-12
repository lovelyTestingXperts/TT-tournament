interface Props {
  active: boolean;
}

export default function StatusBadge({ active }: Props) {
  return (
    <span
      data-testid="status-badge"
      data-status={active ? 'active' : 'inactive'}
      className={`
        inline-flex items-center gap-1.5
        rounded-badge border
        px-2.5 py-0.5 text-xs
        font-medium
        ${
          active
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-slate-500/30 bg-slate-500/10 text-slate-400'
        }
      `}
    >
      <span
        className={`size-1.5 rounded-full ${
          active ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-400'
        }`}
      />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}