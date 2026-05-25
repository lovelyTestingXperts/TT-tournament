import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/navigation/Sidebar';
import Topbar from '@/components/navigation/Topbar';

export default function DashboardLayout() {
  return (
    <div
      className="
      gradient-page
      h-screen
      overflow-hidden
      p-4
      "
    >
      <div className="flex h-full gap-4">
        <Sidebar />

        <main
          className="
          flex-1
          overflow-y-auto
          rounded-[36px]
        "
        >
          <Topbar />

          <div className="pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}