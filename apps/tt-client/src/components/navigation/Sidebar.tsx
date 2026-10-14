import {
  Calendar,
  ChevronLeft,
  Home,
  LayoutDashboard,
  Trophy,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import AppLogo from './AppLogo';
import { useServerStatusStore } from '@/store/serverStatusStore';

const menuItems = [
  {
    label: 'Home',
    path: '/',
    icon: <Home size={19} />,
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={19} />,
  },
  {
    label: 'Tournaments',
    path: '/tournaments',
    icon: <Trophy size={19} />,
  },
  {
    label: 'Matches',
    path: '/matches',
    icon: <Calendar size={19} />,
  },
  {
    label: 'Members',
    path: '/members',
    icon: <Users size={19} />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isServerDown = useServerStatusStore((state) => state.isServerDown);

  return (
    <aside
      data-testid="sidebar"
      className={`
      glass-sidebar
      relative
      flex
      h-full
      shrink-0
      flex-col
      transition-all
      duration-300
      ease-in-out
      ${collapsed ? 'w-[78px]' : 'w-[260px]'}
      `}
    >
      {/* Header with Logo */}
      <div
        className={`
        flex
        h-20
        items-center
        border-b
        border-white/[0.06]
        px-4
        ${collapsed ? 'justify-center' : 'justify-between'}
        `}
      >
        {!collapsed && <AppLogo />}

        <button
          type="button"
          data-testid="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          border
          border-white/[0.08]
          bg-white/[0.04]
          text-slate-400
          transition-all
          hover:border-primary/40
          hover:bg-primary/10
          hover:text-white
          "
        >
          <ChevronLeft
            size={16}
            className={`
              transition-transform
              duration-300
              ${collapsed ? 'rotate-180' : ''}
            `}
          />
        </button>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 space-y-1.5 p-3" aria-label="Main Navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            data-testid={`nav-${item.label.toLowerCase()}`}
            className={({ isActive }) =>
              `
              group
              relative
              flex
              items-center
              gap-3.5
              rounded-panel
              px-3.5
              py-3
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                isActive
                  ? 'bg-gradient-to-r from-primary/25 via-primary/15 to-transparent text-white border-l-2 border-primary shadow-[0_0_20px_rgba(230,0,38,0.25)]'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
              }
              ${collapsed ? 'justify-center px-0' : ''}
              `
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`
                  transition-colors
                  duration-200
                  ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200'}
                `}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="tracking-wide">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer subtle brand indicator */}
      {!collapsed && (
        <div className="border-t border-white/[0.06] p-4 text-xs text-slate-500">
          <div data-testid="server-status-indicator" className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full transition-all ${
                isServerDown
                  ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse'
                  : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
              }`}
            />
            <span className={isServerDown ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
              {isServerDown ? 'Server Offline' : 'Server Online'}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}