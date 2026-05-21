import DashboardLayout from '@/app/layouts/DashboardLayout';
import LoginPage from '@/pages/auth/LoginPage';

import DashboardPage from '@/pages/dashboard/DashboardPage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    element: <DashboardLayout />,

    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
    ],
  },
]);
