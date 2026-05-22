type Props = {
  status:
    | 'scheduled'
    | 'live'
    | 'completed';
};

const statusStyles = {
  scheduled:
    'bg-yellow-500/20 text-yellow-300',

  live:
    'bg-emerald-500/20 text-emerald-300',

  completed:
    'bg-violet-500/20 text-violet-300',
};

export default function MatchStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`
      inline-flex
      rounded-full
      px-3
      py-1
      text-xs
      font-medium
      capitalize
      ${statusStyles[status]}
      `}
    >
      {status}
    </span>
  );
}