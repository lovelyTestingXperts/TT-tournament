import { cn } from '@/lib/cn';

import { inputVariants } from './input.styles';
import { InputProps } from './input.types';

export default function Input({
  label,
  error,
  className,
  size,
  id,
  ...props
}: InputProps) {
  const inputId = id || (props.name ? `input-${props.name}` : undefined);
  const testId = (props as any)['data-testid'] || (props.name ? `${props.name}-input` : undefined);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
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
        id={inputId}
        data-testid={testId}
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
        <p data-testid={testId ? `${testId}-error` : 'input-error'} className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}