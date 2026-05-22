import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '@/app/layouts/DashboardLayout';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import AuthLayout from '../layouts/AuthLayout';
import RegisterPage from '@/pages/auth/RegisterPage';
import TournamentPage from '@/pages/tournament/TournamentPage';
import CreateTournamentPage from '@/pages/tournament/CreateTournamentPage';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,

    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },

      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <DashboardLayout />,

    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/tournaments',
        element: <TournamentPage />,
      },
      {
        path: '/tournaments/create',
        element: <CreateTournamentPage/>,
      },
    ],
  },
  {
    path: '/',
    element: <h1>Hello world </h1>,
  },
]);
