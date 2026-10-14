import { AlertTriangle, RefreshCw, X, WifiOff } from 'lucide-react';
import { useServerStatusStore } from '@/store/serverStatusStore';

export default function ServerDownBanner() {
  const { isServerDown, message, isChecking, dismissed, checkServerHealth, dismiss } =
    useServerStatusStore();

  if (!isServerDown || dismissed) return null;

  return (
    <div
      data-testid="server-down-banner"
      role="alert"
      className="relative z-50 mb-4 overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/90 via-surface-900/95 to-rose-950/90 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <WifiOff className="size-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm tracking-wide">
                Server is down
              </span>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.2 text-[10px] font-extrabold uppercase text-rose-300">
                Offline
              </span>
            </div>
            <p className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">
              {message ||
                'Our sports gateway is currently unreachable. Live match scores and tournament updates may not sync until reconnected.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="retry-server-btn"
            onClick={() => checkServerHealth()}
            disabled={isChecking}
            className="inline-flex items-center gap-1.5 rounded-button bg-rose-600/80 hover:bg-rose-600 border border-rose-400/30 px-3.5 py-1.5 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Retry Connection'}</span>
          </button>

          <button
            type="button"
            data-testid="dismiss-server-down-btn"
            onClick={dismiss}
            aria-label="Dismiss server offline alert"
            className="rounded-button p-1.5 text-rose-300/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
