import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <div
      className={cn(
        `
        glass-card
        p-6
        `,
        className
      )}
    >
      {children}
    </div>
  );
}