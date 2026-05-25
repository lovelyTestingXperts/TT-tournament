import {
  Trophy,
  Calendar,
  Swords,
} from 'lucide-react';

const stats = [
  {
    title: 'Tournaments',
    value: '18',
    icon: Trophy,
  },
  {
    title: 'Matches',
    value: '42',
    icon: Swords,
  },
  {
    title: 'Joined',
    value: '2024',
    icon: Calendar,
  },
];

export default function MemberStatsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
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
            <div className="flex items-center justify-between">
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
                  p-3 text-red-400
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