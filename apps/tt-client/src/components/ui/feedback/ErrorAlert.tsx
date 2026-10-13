
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ErrorAlertProps {
  message?: string | null;
  title?: string;
  variant?: 'error' | 'warning';
  className?: string;
  onClose?: () => void;
  'data-testid'?: string;
}

export default function ErrorAlert({
  message,
  title,
  variant = 'error',
  className,
  onClose,
  'data-testid': testId,
}: ErrorAlertProps) {
  if (!message) return null;

  const isWarning = variant === 'warning';
  const defaultTestId = isWarning ? 'alert-warning' : 'alert-error';

  return (
    <div
      role="alert"
      data-testid={testId || defaultTestId}
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4 text-sm transition-all animate-in fade-in-50',
        isWarning
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
          : 'border-red-500/30 bg-red-500/10 text-red-400',
        className
      )}
    >
      {isWarning ? (
        <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
      ) : (
        <AlertCircle className="size-5 shrink-0 text-red-400 mt-0.5" />
      )}

      <div className="flex-1 space-y-0.5">
        {title && (
          <h5 className={cn('font-semibold', isWarning ? 'text-amber-200' : 'text-red-300')}>
            {title}
          </h5>
        )}
        <p className="text-xs leading-relaxed opacity-95">{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          data-testid="close-alert-btn"
          aria-label="Close notification"
          onClick={onClose}
          className="ml-auto -mr-1 -mt-1 rounded-button p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
