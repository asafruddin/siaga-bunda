import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Notice, Screen, Title, ui } from '@/components/ui';
import { api } from '@/services/api';
import { formatDateTime } from '../lib/format';
import { respondentStyles as s } from '../lib/styles';

export function VideoCompletedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({
    queryKey: ['video', id],
    queryFn: () => api<any>(`/videos/${id}`),
  });
  const available = q.data?.progress?.available_at;
  return (
    <Screen>
      <Title>Video Selesai</Title>
      <Card>
        <Text style={s.icon}>♡</Text>
        <Text style={[s.cardTitle, { textAlign: 'center' }]}>
          Terima kasih sudah menonton sampai selesai.
        </Text>
        <Text style={[ui.muted, { textAlign: 'center' }]}>
          {available
            ? `Posttest tersedia pada ${formatDateTime(available)}.`
            : 'Jadwal posttest sedang disiapkan.'}
        </Text>
      </Card>
      <Notice>
        Video berikutnya terbuka setelah posttest materi ini selesai.
      </Notice>
      <Button onPress={() => router.replace('/respondent/dashboard' as never)}>
        Kembali ke Beranda
      </Button>
    </Screen>
  );
}
