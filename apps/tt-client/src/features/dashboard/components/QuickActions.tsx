import { useNavigate } from 'react-router-dom';
import { Trophy, Swords, UserPlus, Compass, ArrowUpRight, Zap } from 'lucide-react';

type ActionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  tagColor?: string;
  iconBg: string;
  testId: string;
  onClick: () => void;
};

function ActionCard({
  title,
  description,
  icon,
  tag,
  tagColor = 'bg-white/10 text-white/80',
  iconBg,
  testId,
  onClick,
}: ActionProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className="
        group
        relative
        flex
        w-full
        items-center
        justify-between
        gap-4
        rounded-2xl
        border
        border-white/[0.06]
        bg-white/[0.03]
        p-4
        text-left
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-primary/40
        hover:bg-white/[0.08]
        hover:shadow-lg
        hover:shadow-primary/5
      "
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`
            flex
            size-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            shadow-inner
            transition-transform
            duration-300
            group-hover:scale-110
            ${iconBg}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm truncate">
              {title}
            </h3>
            <span
              className={`
                rounded-full
                px-2
                py-0.5
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                ${tagColor}
              `}
            >
              {tag}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400 truncate">
            {description}
          </p>
        </div>
      </div>

      <div
        className="
          flex
          size-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-white/[0.06]
          bg-white/[0.02]
          text-slate-400
          transition-all
          duration-300
          group-hover:border-primary/40
          group-hover:bg-primary/10
          group-hover:text-primary
          group-hover:translate-x-0.5
          group-hover:-translate-y-0.5
        "
      >
        <ArrowUpRight className="size-4" />
      </div>
    </button>
  );
}

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div
      data-testid="quick-actions-card"
      className="glass-card flex flex-col justify-between rounded-[32px] p-6"
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Zap className="size-4" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">
                Quick Actions
              </h2>
              <p className="text-xs text-slate-400">
                Shortcuts for tournament & match ops
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
            4 Shortcuts
          </span>
        </div>

        <div className="space-y-3">
          <ActionCard
            testId="quick-action-create-tournament"
            title="Create Tournament"
            description="Launch single & multi-sport brackets & rules"
            icon={<Trophy className="size-5 text-amber-300" />}
            tag="Brackets"
            tagColor="bg-amber-500/20 text-amber-300 border border-amber-500/30"
            iconBg="bg-gradient-to-br from-amber-500/30 to-amber-700/20 text-amber-300 border border-amber-500/20"
            onClick={() => navigate('/tournaments/create')}
          />

          <ActionCard
            testId="quick-action-schedule-match"
            title="Match Arena"
            description="Configure best-of-rounds & live results"
            icon={<Swords className="size-5 text-sky-300" />}
            tag="Live Scoring"
            tagColor="bg-sky-500/20 text-sky-300 border border-sky-500/30"
            iconBg="bg-gradient-to-br from-sky-500/30 to-indigo-700/20 text-sky-300 border border-sky-500/20"
            onClick={() => navigate('/matches')}
          />

          <ActionCard
            testId="quick-action-add-member"
            title="Add Member & Roster"
            description="Enroll athletes, captain roles & manage rosters"
            icon={<UserPlus className="size-5 text-emerald-300" />}
            tag="Rosters"
            tagColor="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            iconBg="bg-gradient-to-br from-emerald-500/30 to-teal-700/20 text-emerald-300 border border-emerald-500/20"
            onClick={() => navigate('/members/create')}
          />

          <ActionCard
            testId="quick-action-explore-tournaments"
            title="Tournament Hub"
            description="Inspect active waves, draws & standings"
            icon={<Compass className="size-5 text-violet-300" />}
            tag="Explore"
            tagColor="bg-violet-500/20 text-violet-300 border border-violet-500/30"
            iconBg="bg-gradient-to-br from-violet-500/30 to-fuchsia-700/20 text-violet-300 border border-violet-500/20"
            onClick={() => navigate('/tournaments')}
          />
        </div>
      </div>
    </div>
  );
}
