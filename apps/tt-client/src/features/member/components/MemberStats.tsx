import {
  Shield,
  Trophy,
  Users,
  UserCheck,
} from 'lucide-react';

type Member = {
  id: string;
  role: string[];
  isActive: boolean;
};

type MemberStatsProps = {
  members: Member[];
};

export default function MemberStats({ members }: MemberStatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: members.length,
      icon: Users,
      color: 'from-primary/20 to-primary/5 text-primary border-primary/30',
    },
    {
      title: 'Active Players',
      value: members.filter((member) => {
        const r = String(member.role || '').toLowerCase();
        return r.includes('player') && member.isActive;
      }).length,
      icon: Trophy,
      color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Referees',
      value: members.filter((member) => {
        const r = String(member.role || '').toLowerCase();
        return r.includes('referee');
      }).length,
      icon: Shield,
      color: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Active Accounts',
      value: members.filter((member) => member.isActive).length,
      icon: UserCheck,
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              glass-card
              group
              relative
              overflow-hidden
              p-5
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-white/[0.16]
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {item.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  {item.value}
                </h3>
              </div>

              <div
                className={`
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-panel
                  border
                  bg-gradient-to-br
                  shadow-sm
                  transition-transform
                  duration-200
                  group-hover:scale-110
                  ${item.color}
                `}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}