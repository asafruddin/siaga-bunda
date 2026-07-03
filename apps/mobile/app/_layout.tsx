import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useSession } from '@/services/session';
import { colors } from '@/theme';
const client = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, retry: 1 } },
});
export default function Layout() {
  const hydrate = useSession((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return (
    <QueryClientProvider client={client}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </QueryClientProvider>
  );
}
