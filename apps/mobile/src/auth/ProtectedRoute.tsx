import { Redirect } from 'expo-router';
import { ReactNode } from 'react';
import { AuthenticatedRole, canAccessRole, getSessionSnapshot } from './access';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: AuthenticatedRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  if (!canAccessRole(getSessionSnapshot(), requiredRole)) {
    return <Redirect href="/" />;
  }

  return children;
}
