import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/cn';

import { buttonVariants } from './button.styles';
import { ButtonProps } from './button.types';

export default function Button({
  children,
  variant,
  size,
  className,
  leftIcon,
  rightIcon,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon
      )}

      {children}

      {!loading && rightIcon}
    </button>
  );
}