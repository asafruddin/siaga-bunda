import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
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
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const videoId = r.notification.request.content.data?.videoId;
      if (videoId)
        router.push(`/respondent/videos/${videoId}/posttest-intro` as never);
    });
    return () => sub.remove();
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
