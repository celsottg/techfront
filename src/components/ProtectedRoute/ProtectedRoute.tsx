import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Forbidden from '../Forbidden/Forbidden';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const from = location.pathname + location.search + location.hash;
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: from !== '/login' ? from : undefined }}
      />
    );
  }

  if (requiredRole && role !== requiredRole) {
    return <Forbidden />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
