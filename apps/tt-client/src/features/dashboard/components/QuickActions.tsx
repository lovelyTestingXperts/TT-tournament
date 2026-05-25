import { CalendarPlus, Trophy, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
type ActionProps = {
  title: string;
  icon: React.ReactNode;
  onClick?: any;
};

function ActionCard({ title, icon, onClick }: ActionProps) {
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
      onClick={onClick ? onClick : () => {}}
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

      <span className="font-medium">{title}</span>
    </button>
  );
}

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="glass-card rounded-[32px] p-6">
      <h2 className="mb-5 text-xl font-semibold">Quick Actions</h2>

      <div className="space-y-4">
        <ActionCard
          title="Create Tournament"
          icon={<Trophy />}
          onClick={() => navigate('/tournaments/create')}
        />

        <ActionCard
          title="Schedule Match"
          icon={<CalendarPlus />}
          onClick={() => navigate('/matches/create')}
        />

        <ActionCard
          title="Add Member"
          icon={<UserPlus />}
          onClick={() => navigate('/members/create')}
        />
      </div>
    </div>
  );
}
