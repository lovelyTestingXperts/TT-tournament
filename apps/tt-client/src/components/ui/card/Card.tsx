import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        `
        glass-card
        rounded-[32px]
        p-6
        transition-all
        duration-300
        `,
        className
      )}
    >
      {children}
    </div>
  );
}