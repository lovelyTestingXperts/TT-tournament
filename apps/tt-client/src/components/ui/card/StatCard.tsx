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
      rounded-[30px]
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-white/15
    "
    >
      {/* glow */}
      <div
        className="
        absolute
        right-[-50px]
        top-[-50px]
        h-[120px]
        w-[120px]
        rounded-full
        bg-white/5
        blur-[60px]
      "
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/60">
              {title}
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              {value}
            </h3>

            {subtitle && (
              <p className="mt-2 text-sm text-emerald-300">
                {subtitle}
              </p>
            )}
          </div>

          {Icon && (
            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white/10
              transition
              group-hover:scale-110
            "
            >
              <Icon size={24} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}