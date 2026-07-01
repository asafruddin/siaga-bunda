import { Slot } from 'expo-router';
import { ProtectedRoute } from '@/auth/ProtectedRoute';

export default function ResearcherLayout() {
  return (
    <ProtectedRoute requiredRole="researcher">
      <Slot />
    </ProtectedRoute>
  );
}
