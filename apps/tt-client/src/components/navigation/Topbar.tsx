import { useState } from 'react';
import { Bell, Sparkles, LogOut, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUnreadNotificationCount } from '@/features/tournament/graphql/hooks';
import NotificationDropdown from './NotificationDropdown';

export default function Topbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data: countData } = useUnreadNotificationCount();
  const unreadCount = countData?.unreadNotificationCount ?? 0;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header
      data-testid="topbar"
      className="relative flex h-20 items-center justify-between border-b border-white/[0.06] bg-surface-900/40 px-6 md:px-8 backdrop-blur-md z-30"
    >
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-white">
              {isAuthenticated
                ? `Welcome Back${user?.firstName ? `, ${user.firstName}` : ''}`
                : 'TX Sports Arena'}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary uppercase">
              <Sparkles className="size-3" /> {isAuthenticated ? user?.role || 'PRO' : 'LIVE'}
            </span>
          </div>

          <p className="text-xs font-normal text-slate-400">
            {isAuthenticated
              ? 'Real-time tournament and member management'
              : 'Official Multi-Sport Tournament & Matches Platform'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Notification Bell Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            data-testid="notifications-btn"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
            className={`
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-panel
              border
              transition-all
              duration-200
              ${
                isNotificationsOpen
                  ? 'border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(230,0,38,0.4)]'
                  : 'border-white/[0.08] bg-surface-850/80 text-slate-300 hover:border-primary/40 hover:bg-primary/10 hover:text-white'
              }
            `}
          >
            <Bell size={18} />
            <span
              data-testid="notifications-unread-badge"
              className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white shadow-[0_0_8px_rgba(230,0,38,0.9)]"
            >
              3
            </span>
          </button>

          {/* Interactive Notifications Center */}
          <NotificationDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Authenticated User Profile Pill & Logout OR Guest Auth Buttons */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 border-l border-white/[0.08] pl-3 md:pl-4">
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
        ) : (
          <div className="flex items-center gap-2 border-l border-white/[0.08] pl-3 md:pl-4">
            <Link
              to="/login"
              data-testid="topbar-login-btn"
              className="inline-flex items-center gap-1.5 rounded-button border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <LogIn className="size-3.5" />
              <span>Sign In</span>
            </Link>

            <Link
              to="/register"
              data-testid="topbar-register-btn"
              className="inline-flex items-center gap-1.5 rounded-button bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-glow transition-all hover:bg-brand-vibrant"
            >
              <UserPlus className="size-3.5" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}