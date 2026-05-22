import { cn } from '@/lib/cn';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        px-4
        py-3
        text-sm
        transition-all
        duration-300
        `,
        active
          ? `
          bg-white/15
          text-white
          shadow-lg
          `
          : `
          text-white/60
          hover:bg-white/10
          hover:text-white
          `,
      )}
    >
      <span>{icon}</span>

      <span>{label}</span>
    </button>
  );
}
