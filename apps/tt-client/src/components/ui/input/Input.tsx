import { cn } from '@/lib/cn';

import { inputVariants } from './input.styles';
import { InputProps } from './input.types';

export default function Input({
  label,
  error,
  className,
  size,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className="
          text-sm
          text-white/80
          font-medium
        "
        >
          {label}
        </label>
      )}

      <input
        className={cn(
          inputVariants({
            state: error
              ? 'error'
              : 'default',
            size,
          }),
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}