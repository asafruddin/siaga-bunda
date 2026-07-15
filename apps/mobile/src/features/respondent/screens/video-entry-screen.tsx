import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Loading, Notice, Screen } from '@/components/ui';
import { api } from '@/services/api';
import type { VideoStatus } from '@siaga/shared';

export function VideoEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({
    queryKey: ['video', id],
    queryFn: () => api<any>(`/videos/${id}`),
    enabled: Boolean(id),
  });
  useEffect(() => {
    const status = q.data?.progress?.status as VideoStatus | undefined;
    const isLastVideo = q.data?.is_last_video ?? false;
    if (!status) return;
    if (
      status === 'waiting_posttest' ||
      (status === 'completed' && !isLastVideo)
    ) {
      router.replace('/respondent/dashboard' as never);
      return;
    }
    const path =
      status === 'pretest_required'
        ? 'pretest-intro'
        : status === 'video_available' || status === 'video_in_progress'
          ? 'video-player'
          : status === 'posttest_available'
            ? 'posttest-intro'
            : 'posttest-completed';
    router.replace(`/respondent/videos/${id}/${path}` as never);
  }, [id, q.data]);
  if (q.error)
    return (
      <Screen>
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error.message}
        </Notice>
      </Screen>
    );
  return (
    <Screen>
      <Loading />
    </Screen>
  );
}
