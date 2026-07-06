import { Pressable, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Button, Loading, Notice, Screen } from '@/components/ui';
import { api } from '@/services/api';
import { colors } from '@/theme';
import { researcherStyles as s } from '../lib/styles';

const stages = [
  { key: 'pretest_completed', short: 'Pretest', color: colors.primary },
  { key: 'video_completed', short: 'Video', color: '#7760A8' },
  { key: 'waiting_posttest', short: 'Menunggu', color: colors.warning },
  { key: 'posttest_completed', short: 'Posttest', color: colors.success },
] as const;

export function MonitoringScreen() {
  const q = useQuery({
    queryKey: ['video-monitoring'],
    queryFn: () => api<any[]>('/researcher/videos/monitoring'),
  });
  const videos = q.data ?? [];
  const pretests = videos.reduce(
    (total, video) => total + Number(video.pretest_completed ?? 0),
    0,
  );
  const posttests = videos.reduce(
    (total, video) => total + Number(video.posttest_completed ?? 0),
    0,
  );
  const conversion = pretests ? Math.round((posttests / pretests) * 100) : 0;

  return (
    <Screen>
      <View style={s.pageHeading}>
        <View style={s.pageEyebrowRow}>
          <View style={[s.pageIconBox, { backgroundColor: colors.blue }]}>
            <MaterialCommunityIcons
              accessible={false}
              color={colors.primaryDark}
              name="video-outline"
              size={18}
            />
          </View>
          <Text style={s.pageEyebrow}>PROGRES MATERI</Text>
        </View>
        <Text style={s.pageTitle}>Monitoring Video</Text>
        <Text style={s.pageSubtitle}>
          Lihat pergerakan responden pada setiap tahap edukasi.
        </Text>
      </View>

      {!q.isLoading && !q.error ? (
        <View style={s.monitoringHero}>
          <View style={s.monitoringHeroCopy}>
            <Text style={s.monitoringHeroEyebrow}>TINGKAT PENYELESAIAN</Text>
            <Text style={s.monitoringHeroValue}>{conversion}%</Text>
            <Text style={s.monitoringHeroHint}>
              Perbandingan posttest selesai terhadap pretest
            </Text>
          </View>
          <View style={s.monitoringHeroBadge}>
            <Text style={s.monitoringHeroBadgeValue}>{videos.length}</Text>
            <Text style={s.monitoringHeroBadgeLabel}>video</Text>
          </View>
        </View>
      ) : null}

      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error.message}
        </Notice>
      ) : videos.length ? (
        <>
          <View style={s.listHeading}>
            <View>
              <Text style={s.sectionTitle}>Progres per video</Text>
              <Text style={s.sectionHint}>
                Ketuk kartu untuk melihat responden
              </Text>
            </View>
            <View style={s.countPill}>
              <Text style={s.countPillText}>{videos.length}</Text>
            </View>
          </View>
          {videos.map((video) => {
            const cohort = Math.max(
              1,
              ...stages.map((stage) => Number(video[stage.key] ?? 0)),
            );
            return (
              <Pressable
                accessibilityRole="button"
                key={video.video_id}
                onPress={() => router.push('/researcher/respondents' as never)}
                style={({ pressed }) => [
                  s.monitoringCard,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <View style={s.monitoringCardHeader}>
                  <View style={s.videoNumberBox}>
                    <Text style={s.videoNumberEyebrow}>VIDEO</Text>
                    <Text style={s.videoNumberValue}>
                      {video.sequence_number}
                    </Text>
                  </View>
                  <View style={s.monitoringTitleWrap}>
                    <Text style={s.monitoringTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={s.monitoringCohort}>
                      {cohort} responden tercatat
                    </Text>
                  </View>
                  <Ionicons
                    accessible={false}
                    color={colors.primary}
                    name="chevron-forward"
                    size={21}
                  />
                </View>
                <View style={s.stageGrid}>
                  {stages.map((stage) => {
                    const value = Number(video[stage.key] ?? 0);
                    return (
                      <View key={stage.key} style={s.stageItem}>
                        <View
                          style={[s.stageDot, { backgroundColor: stage.color }]}
                        />
                        <Text style={s.stageValue}>{value}</Text>
                        <Text style={s.stageLabel}>{stage.short}</Text>
                      </View>
                    );
                  })}
                </View>
                <View style={s.stageProgressTrack}>
                  <View
                    style={[
                      s.stageProgressFill,
                      {
                        width: `${Math.min(100, (Number(video.posttest_completed ?? 0) / cohort) * 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={s.stageProgressText}>
                  {Math.round(
                    (Number(video.posttest_completed ?? 0) / cohort) * 100,
                  )}
                  % menyelesaikan posttest
                </Text>
              </Pressable>
            );
          })}
        </>
      ) : (
        <View style={s.emptyState}>
          <View style={[s.emptyStateIcon, { backgroundColor: colors.blue }]}>
            <MaterialCommunityIcons
              accessible={false}
              color={colors.primaryDark}
              name="video-off-outline"
              size={28}
            />
          </View>
          <Text style={s.emptyStateTitle}>Belum ada aktivitas video</Text>
          <Text style={s.emptyStateText}>
            Progres akan muncul setelah responden memulai materi edukasi.
          </Text>
        </View>
      )}
    </Screen>
  );
}
