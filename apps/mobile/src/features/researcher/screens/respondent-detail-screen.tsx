import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Card,
  Loading,
  Notice,
  Progress,
  Screen,
  Title,
  ui,
} from '@/components/ui';
import { api } from '@/services/api';
import { formatDate, formatDateTime } from '../lib/format';
import { statusLabel } from '../lib/status-label';
import { researcherStyles as s } from '../lib/styles';

export function RespondentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({
    queryKey: ['respondent-detail', id],
    queryFn: () => api<any>(`/researcher/respondents/${id}`),
  });
  if (q.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (q.error || !q.data)
    return (
      <Screen>
        <Notice>{q.error?.message ?? 'Tidak ditemukan.'}</Notice>
      </Screen>
    );
  const { profile, progress, tests, timeline } = q.data;
  return (
    <Screen>
      <Title subtitle={`Terdaftar ${formatDateTime(profile.created_at)}`}>
        {profile.name}
      </Title>
      <Card>
        {[
          ['Usia', `${profile.age} tahun`],
          ['Telepon', profile.phone_number],
          ['Alamat', profile.address],
          ['HPL', formatDate(profile.hpl)],
          ['Usia kehamilan', `${profile.pregnancy_age_weeks} minggu`],
          ['Riwayat medis', profile.medical_history || 'Tidak ada'],
          [
            'Riwayat komplikasi',
            profile.pregnancy_complication_history || 'Tidak ada',
          ],
        ].map(([a, b]) => (
          <View key={a}>
            <Text style={ui.label}>{a}</Text>
            <Text style={ui.muted}>{b}</Text>
          </View>
        ))}
      </Card>
      <Title>Progres video</Title>
      {progress.length ? (
        progress.map((p: any) => (
          <Card key={p.id}>
            <Text style={s.cardTitle}>
              Video {p.videos.sequence_number}: {p.videos.title}
            </Text>
            <Badge>{statusLabel(p.status)}</Badge>
            <Progress value={Number(p.completion_percentage)} />
            <Text style={ui.muted}>
              {p.completion_percentage}% • maksimum{' '}
              {Math.floor(p.max_watched_seconds)} detik
            </Text>
          </Card>
        ))
      ) : (
        <Notice>Belum ada progres.</Notice>
      )}
      <Title>Nilai tes</Title>
      {tests.length ? (
        tests.map((t: any) => (
          <Card key={t.id}>
            <Text style={s.cardTitle}>
              Video {t.videos.sequence_number} • {t.test_type}
            </Text>
            <Text style={s.score}>{t.score}</Text>
            <Text style={ui.muted}>
              {t.correct_count}/{t.total_questions} benar •{' '}
              {formatDateTime(t.submitted_at)}
            </Text>
          </Card>
        ))
      ) : (
        <Notice>Belum ada hasil tes.</Notice>
      )}
      <Title>Jejak aktivitas</Title>
      {timeline.map((item: any, index: number) => (
        <View key={`${item.created_at}-${index}`} style={s.timeline}>
          <View style={s.dot} />
          <View style={{ flex: 1 }}>
            <Text style={ui.label}>{item.action.replaceAll('_', ' ')}</Text>
            <Text style={ui.muted}>{formatDateTime(item.created_at)}</Text>
          </View>
        </View>
      ))}
    </Screen>
  );
}
