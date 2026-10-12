import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        data-testid="loading-spinner"
        className="gradient-page flex min-h-screen items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-3 border-primary border-t-transparent shadow-[0_0_15px_rgba(230,0,38,0.5)]" />
          <p className="text-sm font-medium text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Account Inactive Guard scenario
  if (user && !user.isActive) {
    return <Navigate to="/login" state={{ accountInactive: true }} replace />;
  }

  return <Outlet />;
}
