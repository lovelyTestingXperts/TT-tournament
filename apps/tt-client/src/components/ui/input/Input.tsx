import { cn } from '@/lib/cn';

import { inputVariants } from './input.styles';
import { InputProps } from './input.types';

export default function Input({
  label,
  error,
  className,
  size,
  id,
  type,
  onClick,
  ...props
}: InputProps) {
  const inputId = id || (props.name ? `input-${props.name}` : undefined);
  const testId = (props as any)['data-testid'] || (props.name ? `${props.name}-input` : undefined);

  const isDateType = type === 'date' || type === 'datetime-local' || type === 'time';

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (isDateType) {
      try {
        (e.currentTarget as any).showPicker?.();
      } catch (err) {
        // Fallback for browsers that do not support showPicker
      }
    }
    onClick?.(e);
  };

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
        type={type}
        data-testid={testId}
        onClick={handleClick}
        className={cn(
          inputVariants({
            state: error
              ? 'error'
              : 'default',
            size,
          }),
          isDateType &&
            '[color-scheme:dark] cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80 [&::-webkit-calendar-picker-indicator]:hover:opacity-100',
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