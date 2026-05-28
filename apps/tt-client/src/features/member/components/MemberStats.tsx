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

export default function MemberStats({
  members,
}: MemberStatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: members.length,
      icon: Users,
    },

    {
      title: 'Players',
      value: members.filter((member) =>
        member.role.includes('player')
      ).length,
      icon: Trophy,
    },

    {
      title: 'Referees',
      value: members.filter((member) =>
        member.role.includes('referee')
      ).length,
      icon: Shield,
    },

    {
      title: 'Active Users',
      value: members.filter(
        (member) => member.isActive
      ).length,
      icon: UserCheck,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              rounded-3xl
              border border-white/10
              bg-white/5
              p-5
              backdrop-blur-xl
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  {item.value}
                </h3>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-red-500/10
                  p-3
                  text-red-400
                "
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