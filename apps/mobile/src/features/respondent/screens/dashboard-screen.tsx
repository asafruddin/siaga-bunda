import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  Loading,
  Notice,
  Progress,
  Screen,
  Title,
  ui,
} from '@/components/ui';
import { api } from '@/services/api';
import { colors } from '@/theme';
import { formatDate, formatDateTime } from '../lib/format';
import { type Video, videoStatusLabels, videoStatusTone } from '../lib/types';
import { respondentStyles as shared } from '../lib/styles';

export function DashboardScreen() {
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => api<any>('/respondents/me'),
  });
  const videos = useQuery({
    queryKey: ['videos'],
    queryFn: () => api<Video[]>('/videos'),
  });
  if (profile.isLoading || videos.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (profile.error || videos.error)
    return (
      <Screen>
        <Notice
          action={
            <Button
              onPress={() => {
                profile.refetch();
                videos.refetch();
              }}
            >
              Coba lagi
            </Button>
          }
        >
          {(profile.error ?? videos.error)?.message}
        </Notice>
      </Screen>
    );
  const list = videos.data ?? [];
  const pct = list.length
    ? (list.filter((v) => v.status === 'completed').length / list.length) * 100
    : 0;
  const next = list.find(
    (v) => v.status !== 'completed' && v.status !== 'locked',
  );
  return (
    <Screen showBack={false}>
      <View style={styles.headerRow}>
        <Title
          subtitle={`Usia kehamilan ${profile.data.pregnancy_age_weeks} minggu • HPL ${formatDate(profile.data.hpl)}`}
        >
          Halo, Ibu {profile.data.name.split(' ')[0]}
        </Title>
        <Pressable onPress={() => router.push('/respondent/profile' as never)}>
          <Text style={styles.profileLink}>Profil</Text>
        </Pressable>
      </View>
      <Card>
        <Text style={shared.cardTitle}>Progres edukasi</Text>
        <Progress value={pct} />
        <Text style={ui.muted}>
          {Math.round(pct)}% •{' '}
          {list.filter((v) => v.status === 'completed').length} dari{' '}
          {list.length} video selesai
        </Text>
        {next && (
          <Text style={styles.nextHint}>
            Berikutnya: {videoStatusLabels[next.status]} Video{' '}
            {next.sequence_number}
          </Text>
        )}
      </Card>
      <Title>Materi Edukasi</Title>
      {list.map((v) => (
        <Card
          key={v.id}
          onPress={() => {
            if (v.status === 'locked')
              Alert.alert(
                'Video terkunci',
                'Selesaikan posttest video sebelumnya terlebih dahulu.',
              );
            else router.push(`/respondent/videos/${v.id}` as never);
          }}
        >
          <View style={styles.videoRow}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{v.sequence_number}</Text>
            </View>
            <View style={styles.videoContent}>
              <Text style={shared.cardTitle}>{v.title}</Text>
              <Badge tone={videoStatusTone(v.status)}>
                {videoStatusLabels[v.status]}
              </Badge>
              {v.status === 'waiting_posttest' && v.available_at && (
                <Text style={ui.muted}>
                  Tersedia {formatDateTime(v.available_at)}
                </Text>
              )}
              <Progress value={v.completion_percentage} />
            </View>
          </View>
        </Card>
      ))}
      <Button variant="secondary" onPress={() => qc.invalidateQueries()}>
        Perbarui status
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLink: { fontWeight: '800', color: colors.primary },
  nextHint: { fontWeight: '700', color: colors.primaryDark },
  videoRow: { flexDirection: 'row', gap: 12 },
  numberBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontWeight: '900', fontSize: 18, color: colors.primaryDark },
  videoContent: { flex: 1, gap: 7 },
});
