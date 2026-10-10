import { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: Props) {
  return (
    <div
      className="
      glass-card
      group
      relative
      overflow-hidden
      p-5
      transition-all
      duration-200
      hover:-translate-y-0.5
      hover:border-primary/40
    "
    >
      {/* Dynamic ambient highlight */}
      <div
        className="
        pointer-events-none
        absolute
        -right-10
        -top-10
        h-32
        w-32
        rounded-full
        bg-primary/10
        blur-2xl
        transition-all
        duration-300
        group-hover:bg-primary/20
      "
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1.5 text-xs text-emerald-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-panel
            border
            border-primary/20
            bg-primary/10
            text-primary
            transition-all
            duration-200
            group-hover:scale-105
            group-hover:bg-primary
            group-hover:text-white
            group-hover:shadow-[0_0_15px_rgba(230,0,38,0.5)]
          "
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}