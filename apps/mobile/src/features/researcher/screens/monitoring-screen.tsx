import { Text } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Card, Loading, Notice, Screen, Title } from '@/components/ui';
import { api } from '@/services/api';
import { MetricRow } from '../components/metric-row';
import { researcherStyles as s } from '../lib/styles';

export function MonitoringScreen() {
  const q = useQuery({
    queryKey: ['video-monitoring'],
    queryFn: () => api<any[]>('/researcher/videos/monitoring'),
  });
  return (
    <Screen>
      <Title subtitle="Jumlah responden pada setiap tahap.">
        Monitoring Video
      </Title>
      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice>{q.error.message}</Notice>
      ) : (
        q.data?.map((v) => (
          <Card
            key={v.video_id}
            onPress={() => router.push('/researcher/respondents' as never)}
          >
            <Text style={s.cardTitle}>
              Video {v.sequence_number}: {v.title}
            </Text>
            <MetricRow label="Pretest selesai" value={v.pretest_completed} />
            <MetricRow label="Video selesai" value={v.video_completed} />
            <MetricRow label="Menunggu posttest" value={v.waiting_posttest} />
            <MetricRow label="Posttest selesai" value={v.posttest_completed} />
          </Card>
        ))
      )}
    </Screen>
  );
}
