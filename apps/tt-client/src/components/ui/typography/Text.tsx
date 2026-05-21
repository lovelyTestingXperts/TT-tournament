import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Text({
  children,
  className,
}: Props) {
  return (
    <p
      className={cn(
        'text-white/70 text-base',
        className
      )}
    >
      {children}
    </p>
  );
}