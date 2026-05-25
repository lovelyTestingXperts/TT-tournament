interface Props {
  active: boolean;
}

export default function StatusBadge({
  active,
}: Props) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full border
        px-3 py-1 text-xs
        font-medium

        ${
          active
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
        }
      `}
    >
      {active
        ? 'Active'
        : 'Inactive'}
    </span>
  );
}