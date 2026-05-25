type Role =
  | 'admin'
  | 'referee'
  | 'player'
  | 'member';

interface Props {
  role: Role;
}

const roleStyles = {
  admin:
    'bg-red-500/10 text-red-400 border-red-500/20',

  referee:
    'bg-amber-500/10 text-amber-400 border-amber-500/20',

  player:
    'bg-blue-500/10 text-blue-400 border-blue-500/20',

  member:
    'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
};

export default function RoleBadge({
  role,
}: Props) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full border
        px-3 py-1 text-xs
        font-medium capitalize
        ${roleStyles[role]}
      `}
    >
      {role}
    </span>
  );
}