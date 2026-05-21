import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function InteractiveCard({
  children,
  className,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `
        glass-card
        w-full
        rounded-[32px]
        p-6
        text-left
        transition-all
        duration-300
        hover:scale-[1.01]
        hover:bg-white/15
        hover:shadow-2xl
        `,
        className
      )}
    >
      {children}
    </button>
  );
}