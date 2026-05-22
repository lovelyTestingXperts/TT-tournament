type Props = {
  role:
    | 'player'
    | 'member'
    | 'referee';
};

const roleStyles = {
  player:
    'bg-violet-500/20 text-violet-300',

  member:
    'bg-sky-500/20 text-sky-300',

  referee:
    'bg-amber-500/20 text-amber-300',
};

export default function RoleBadge({
  role,
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
      ${roleStyles[role]}
      `}
    >
      {role}
    </span>
  );
}