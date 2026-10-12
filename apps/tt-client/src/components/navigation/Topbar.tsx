import { Bell, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header data-testid="topbar" className="flex h-20 items-center justify-between border-b border-white/[0.06] bg-surface-900/40 px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-white">
              Welcome Back{user?.firstName ? `, ${user.firstName}` : ''}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary uppercase">
              <Sparkles className="size-3" /> {user?.role || 'PRO'}
            </span>
          </div>

          <p className="text-xs font-normal text-slate-400">
            Real-time tournament and member management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          data-testid="notifications-btn"
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

        {/* User Profile Pill & Logout */}
        <div className="flex items-center gap-3 border-l border-white/[0.08] pl-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold text-xs">
              {user?.firstName ? user.firstName[0].toUpperCase() : <UserIcon className="size-4" />}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-white">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email || ''}</p>
            </div>
          </div>

          <button
            type="button"
            data-testid="logout-btn"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="
            flex
            size-9
            items-center
            justify-center
            rounded-panel
            border
            border-white/[0.08]
            bg-surface-850/80
            text-slate-400
            transition-all
            duration-200
            hover:border-red-500/40
            hover:bg-red-500/10
            hover:text-red-400
            "
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}