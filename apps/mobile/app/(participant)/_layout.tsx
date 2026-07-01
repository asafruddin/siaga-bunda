import { Slot } from 'expo-router';
import { ProtectedRoute } from '@/auth/ProtectedRoute';

export default function ParticipantLayout() {
  return (
    <ProtectedRoute requiredRole="participant">
      <Slot />
    </ProtectedRoute>
  );
}
