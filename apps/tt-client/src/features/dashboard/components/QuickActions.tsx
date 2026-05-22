import {
  CalendarPlus,
  Trophy,
  UserPlus,
} from 'lucide-react';

type ActionProps = {
  title: string;
  icon: React.ReactNode;
};

function ActionCard({
  title,
  icon,
}: ActionProps) {
  return (
    <button
      className="
      flex
      items-center
      gap-4
      rounded-3xl
      bg-white/10
      p-5
      text-left
      transition-all
      duration-300
      hover:bg-white/15
      hover:-translate-y-1
    "
    >
      <div
        className="
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        bg-white/10
      "
      >
        {icon}
      </div>

      <span className="font-medium">
        {title}
      </span>
    </button>
  );
}

export default function QuickActions() {
  return (
    <div className="glass-card rounded-[32px] p-6">
      <h2 className="mb-5 text-xl font-semibold">
        Quick Actions
      </h2>

      <div className="space-y-4">
        <ActionCard
          title="Create Tournament"
          icon={<Trophy />}
        />

        <ActionCard
          title="Schedule Match"
          icon={<CalendarPlus />}
        />

        <ActionCard
          title="Add Member"
          icon={<UserPlus />}
        />
      </div>
    </div>
  );
}