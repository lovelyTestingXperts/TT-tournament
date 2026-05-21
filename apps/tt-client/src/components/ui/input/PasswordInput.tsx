import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/cn';

import { inputVariants } from './input.styles';
import { InputProps } from './input.types';

export default function PasswordInput({
  label,
  error,
  className,
  size,
  ...props
}: InputProps) {
  const [show, setShow] =
    useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm text-white/80">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={
            show
              ? 'text'
              : 'password'
          }
          className={cn(
            inputVariants({
              state: error
                ? 'error'
                : 'default',
              size,
            }),
            'pr-12',
            className
          )}
          {...props}
        />

        <button
          type="button"
          onClick={() =>
            setShow(!show)
          }
          className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-white/50
        "
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}