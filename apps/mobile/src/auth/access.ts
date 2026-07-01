export type AuthenticatedRole = 'participant' | 'researcher';

export interface SessionSnapshot {
  role: AuthenticatedRole;
}

export function canAccessRole(
  session: SessionSnapshot | null,
  requiredRole: AuthenticatedRole,
): boolean {
  return session?.role === requiredRole;
}

export function getSessionSnapshot(): SessionSnapshot | null {
  return null;
}
