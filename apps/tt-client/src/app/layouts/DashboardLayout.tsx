import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/navigation/Sidebar';
import Topbar from '@/components/navigation/Topbar';
import ServerDownBanner from '@/components/ui/banner/ServerDownBanner';

export default function DashboardLayout() {
  return (
    <div className="gradient-page flex h-screen overflow-hidden">
      {/* Sleek, full-height docked sidebar without floating capsule gaps */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          <div className="mx-auto max-w-[1600px] pb-12">
            <ServerDownBanner />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}