import {
  Calendar,
  ChevronLeft,
  LayoutDashboard,
  Trophy,
  Users,
} from 'lucide-react';
import {
  useState,
} from 'react';
import { NavLink } from 'react-router-dom';

import AppLogo from './AppLogo';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: (
      <LayoutDashboard
        size={20}
      />
    ),
  },
  {
    label: 'Tournaments',
    path: '/tournaments',
    icon: (
      <Trophy size={20} />
    ),
  },
  {
    label: 'Matches',
    path: '/matches',
    icon: (
      <Calendar size={20} />
    ),
  },
  {
    label: 'Members',
    path: '/members',
    icon: (
      <Users size={20} />
    ),
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <aside
      className={`
      glass-card
      sticky
      top-0
      flex
      h-full
      shrink-0
      flex-col
      rounded-[36px]
      p-5
      transition-all
      duration-300
      ${
        collapsed
          ? 'w-[96px]'
          : 'w-[280px]'
      }
      `}
    >
      {/* Header */}
      <div
        className={`
        flex
        items-center
        ${
          collapsed
            ? 'justify-center'
            : 'justify-between'
        }
        `}
      >
        {!collapsed && (
          <AppLogo />
        )}

        <button
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-white/10
          transition
          hover:bg-white/20
          "
        >
          <ChevronLeft
            size={18}
            className={`
              transition-transform
              duration-300
              ${
                collapsed
                  ? 'rotate-180'
                  : ''
              }
            `}
          />
        </button>
      </div>

      {/* Menu */}
      <div className="mt-10 space-y-2">
        {menuItems.map(
          (item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({
                isActive,
              }) =>
                `
                flex
                items-center
                gap-3
                rounded-2xl
                px-4
                py-4
                transition-all
                ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }
                ${
                  collapsed
                    ? 'justify-center'
                    : ''
                }
                `
              }
            >
              {item.icon}

              {!collapsed && (
                <span>
                  {
                    item.label
                  }
                </span>
              )}
            </NavLink>
          )
        )}
      </div>
    </aside>
  );
}