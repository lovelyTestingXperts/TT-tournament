import { Bell, Sparkles } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/[0.06] bg-surface-900/40 px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-white">
              Welcome Back
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3" /> PRO
            </span>
          </div>

          <p className="text-xs font-normal text-slate-400">
            Real-time tournament and player management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-panel
          border
          border-white/[0.08]
          bg-surface-850/80
          text-slate-300
          transition-all
          duration-200
          hover:border-primary/40
          hover:bg-primary/10
          hover:text-white
          "
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(230,0,38,0.9)]" />
        </button>
      </div>
    </header>
  );
}