import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Loading, Notice, Screen } from '@/components/ui';
import { api } from '@/services/api';
import { formatDateTime } from '../lib/format';
import {
  CompletionState,
  completionStyles as s,
} from '../components/completion-state';

export function VideoCompletedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['video', id],
    queryFn: () => api<any>(`/videos/${id}`),
  });

  if (query.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (query.error)
    return (
      <Screen>
        <Notice
          action={<Button onPress={() => query.refetch()}>Coba lagi</Button>}
        >
          {query.error.message}
        </Notice>
      </Screen>
    );

  const available = query.data?.progress?.available_at;
  return (
    <CompletionState
      eyebrow="VIDEO SELESAI"
      icon="♡"
      title="Hebat, Ibu sudah menonton!"
      description="Materi telah ditonton sampai selesai. Beri waktu untuk memahami informasi yang baru dipelajari."
      detail={
        <View style={s.detailHeading}>
          <Text style={s.detailLabel}>POSTTEST TERSEDIA</Text>
          <Text style={s.detailValue}>
            {available ? formatDateTime(available) : 'Sedang dijadwalkan'}
          </Text>
          <Text style={s.detailHint}>
            Kami akan mengingatkan Ibu saat waktunya tiba.
          </Text>
        </View>
      }
      note="Materi berikutnya akan terbuka setelah Ibu menyelesaikan posttest video ini."
      actionLabel="Kembali ke Beranda"
      onAction={() => router.replace('/respondent/dashboard' as never)}
    />
  );
}
