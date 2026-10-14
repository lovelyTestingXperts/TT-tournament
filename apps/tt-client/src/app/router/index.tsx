import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '@/app/layouts/DashboardLayout';
import AuthLayout from '@/app/layouts/AuthLayout';
import ProtectedRoute from '@/app/layouts/ProtectedRoute';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import HomePage from '@/pages/home/HomePage';
import DashboardPage from '@/pages/dashboard/DashboardPage';

import TournamentPage from '@/pages/tournament/TournamentPage';
import CreateTournamentPage from '@/pages/tournament/CreateTournamentPage';
import TournamentDetailsPage from '@/pages/tournament/TournamentDetailsPage';

import MatchesPage from '@/pages/match/MatchesPage';
import MatchArenaPage from '@/pages/match/MatchArenaPage';
import MemberPage from '@/pages/member/MemberPage';
import MemberDetailsPage from '@/pages/member/MemberdetailsPage';
import EditMemberPage from '@/pages/member/EditMemberPage';
import CreateMemberPage from '@/pages/member/CreateMemberPage';

export const router = createBrowserRouter([
  // Public Auth Routes
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

  // Public Information Routes (Accessible to all users - guests and authenticated)
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/tournaments',
        element: <TournamentPage />,
      },
      {
        path: '/tournaments/:id',
        element: <TournamentDetailsPage />,
      },
      {
        path: '/matches',
        element: <MatchesPage />,
      },
      {
        path: '/matches/:id',
        element: <MatchArenaPage />,
      },

      // Protected Actions / Administration (Requires Authentication)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/tournaments/create',
            element: <CreateTournamentPage />,
          },
          {
            path: '/members',
            element: <MemberPage />,
          },
          {
            path: '/members/create',
            element: <CreateMemberPage />,
          },
          {
            path: '/members/:id',
            element: <MemberDetailsPage />,
          },
          {
            path: '/members/:id/edit',
            element: <EditMemberPage />,
          },
        ],
      },
    ],
  },
]);