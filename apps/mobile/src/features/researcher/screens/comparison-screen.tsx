import { Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Card, Loading, Notice, Screen, Title, ui } from '@/components/ui';
import { colors } from '@/theme';
import { api } from '@/services/api';
import { MetricRow } from '../components/metric-row';
import { researcherStyles as s } from '../lib/styles';

export function ComparisonScreen() {
  const q = useQuery({
    queryKey: ['comparison'],
    queryFn: () => api<any[]>('/researcher/results/comparison'),
  });
  return (
    <Screen>
      <Title subtitle="Perbandingan responden dengan pasangan nilai tersedia.">
        Pretest vs Posttest
      </Title>
      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice>{q.error.message}</Notice>
      ) : (
        q.data?.map((v) => (
          <Card key={v.video_id}>
            <Text style={s.cardTitle}>
              Video {v.sequence_number}: {v.title}
            </Text>
            <MetricRow
              label="Rata-rata pretest"
              value={v.average_pretest ?? 0}
            />
            <MetricRow
              label="Rata-rata posttest"
              value={v.average_posttest ?? 0}
            />
            <MetricRow label="Selisih" value={v.difference ?? 0} />
            <Text
              style={[
                s.improvement,
                {
                  color:
                    Number(v.improvement_percentage) >= 0
                      ? colors.success
                      : colors.danger,
                },
              ]}
            >
              {v.improvement_percentage == null
                ? 'Belum cukup data'
                : `${v.improvement_percentage}% perubahan`}
            </Text>
            <Text style={ui.muted}>{v.paired_respondents} pasangan data</Text>
          </Card>
        ))
      )}
    </Screen>
  );
}
