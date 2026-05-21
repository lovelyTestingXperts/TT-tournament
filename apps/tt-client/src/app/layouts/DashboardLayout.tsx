import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/navigation/Sidebar';
import Topbar from '@/components/navigation/Topbar';

export default function DashboardLayout() {
  return (
    <div className="gradient-page p-4">
      <div className="flex gap-4">
        <Sidebar />

        <main className="flex-1">
          <Topbar />

          <Outlet />
        </main>
      </div>
    </div>
  );
}