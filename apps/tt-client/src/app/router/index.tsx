import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '@/app/layouts/DashboardLayout';
import AuthLayout from '@/app/layouts/AuthLayout';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import DashboardPage from '@/pages/dashboard/DashboardPage';

import TournamentPage from '@/pages/tournament/TournamentPage';
import CreateTournamentPage from '@/pages/tournament/CreateTournamentPage';
import TournamentDetailsPage from '@/pages/tournament/TournamentDetailsPage';


import MatchesPage from '@/pages/match/MatchesPage';
import MemberPage from '@/pages/member/MemberPage';
import MemberDetailsPage from '@/pages/member/MemberdetailsPage';
import EditMemberPage from '@/pages/member/EditMemberPage';
import CreateMemberPage from '@/pages/member/CreateMemberPage';

export const router =
  createBrowserRouter([
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

        // tournaments
        {
          path: '/tournaments',
          element: <TournamentPage />,
        },
        {
          path:
            '/tournaments/create',
          element:
            <CreateTournamentPage />,
        },
        {
          path:
            '/tournaments/:id',
          element:
            <TournamentDetailsPage />,
        },

        // users / members
        {
          path: '/members',
          element: <MemberPage />,
        },
        {
          path:
            '/members/create',
          element:
            <CreateMemberPage />,
        },
        {
          path:
            '/members/:id',
          element:
            <MemberDetailsPage />,
        },
        {
          path:
            '/members/:id/edit',
          element:
            <EditMemberPage />,
        },

        // matches
        {
          path: '/matches',
          element: <MatchesPage />,
        },
      ],
    },
  ]);