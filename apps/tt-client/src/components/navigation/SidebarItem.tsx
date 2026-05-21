import {
  Calendar,
  LayoutDashboard,
  Trophy,
  Users,
} from 'lucide-react';

import AppLogo from './AppLogo';
import SidebarItem from './SidebarItem';

export default function Sidebar() {
  return (
    <aside
      className="
      glass-card
      flex
      h-[calc(100vh-32px)]
      w-[280px]
      flex-col
      rounded-[36px]
      p-5
      "
    >
      <AppLogo />

      <div className="mt-10 space-y-2">
        <SidebarItem
          icon={
            <LayoutDashboard
              size={18}
            />
          }
          label="Dashboard"
          active
        />

        <SidebarItem
          icon={
            <Trophy size={18} />
          }
          label="Tournaments"
        />

        <SidebarItem
          icon={
            <Calendar size={18} />
          }
          label="Matches"
        />

        <SidebarItem
          icon={
            <Users size={18} />
          }
          label="Members"
        />
      </div>
    </aside>
  );
}