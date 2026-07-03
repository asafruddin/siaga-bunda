import { Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Card, Loading, Notice, Screen, Title, ui } from '@/components/ui';
import { api } from '@/services/api';
import { researcherStyles as s } from '../lib/styles';

export function ResultsScreen({ type }: { type: 'pretest' | 'posttest' }) {
  const q = useQuery({
    queryKey: ['results', type],
    queryFn: () => api<any[]>(`/researcher/results/${type}`),
  });
  return (
    <Screen>
      <Title subtitle="Ringkasan nilai per materi.">
        Hasil {type === 'pretest' ? 'Pretest' : 'Posttest'}
      </Title>
      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice>{q.error.message}</Notice>
      ) : q.data?.length ? (
        q.data.map((v) => (
          <Card key={v.video_id}>
            <Text style={s.cardTitle}>
              Video {v.sequence_number}: {v.title}
            </Text>
            <Text style={s.score}>{v.average_score}</Text>
            <Text style={ui.muted}>
              Rata-rata • rentang {v.lowest_score}–{v.highest_score} •{' '}
              {v.respondent_count} responden
            </Text>
          </Card>
        ))
      ) : (
        <Notice>Belum ada hasil {type}.</Notice>
      )}
    </Screen>
  );
}
