type Role =
  | 'admin'
  | 'referee'
  | 'player'
  | 'member';

interface Props {
  role: Role;
}

const roleStyles: Record<Role, string> = {
  admin:
    'bg-primary/15 text-primary border-primary/30',

  referee:
    'bg-amber-500/15 text-amber-300 border-amber-500/30',

  player:
    'bg-sky-500/15 text-sky-300 border-sky-500/30',

  member:
    'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export default function RoleBadge({ role }: Props) {
  const normalizedRole = (role?.toLowerCase() as Role) || 'member';
  const styles = roleStyles[normalizedRole] || roleStyles.member;

  return (
    <span
      className={`
        inline-flex items-center
        rounded-badge border
        px-2.5 py-0.5 text-xs
        font-medium uppercase tracking-wider
        ${styles}
      `}
    >
      {role}
    </span>
  );
}