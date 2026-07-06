import { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import {
  Badge,
  Button,
  Loading,
  Notice,
  Progress,
  Screen,
} from '@/components/ui';
import { api } from '@/services/api';
import { colors } from '@/theme';
import { formatDate, formatDateTime } from '../lib/format';
import { type Video, videoStatusLabels, videoStatusTone } from '../lib/types';

export function DashboardScreen() {
  const queryClient = useQueryClient();
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => api<any>('/respondents/me'),
  });
  const videos = useQuery({
    queryKey: ['videos'],
    queryFn: () => api<Video[]>('/videos'),
  });

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['profile'] }),
      queryClient.refetchQueries({ queryKey: ['videos'] }),
    ]);
  }, [queryClient]);

  const refreshing = profile.isRefetching || videos.isRefetching;

  if (profile.isLoading || videos.isLoading)
    return (
      <Screen showBack={false}>
        <Loading />
      </Screen>
    );
  if (profile.error || videos.error)
    return (
      <Screen showBack={false}>
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

  const mother = profile.data;
  const list = videos.data ?? [];
  const completed = list.filter((video) => video.status === 'completed').length;
  const percentage = list.length ? (completed / list.length) * 100 : 0;
  const next = list.find(
    (video) => video.status !== 'completed' && video.status !== 'locked',
  );
  const trimester =
    mother.pregnancy_age_weeks <= 13
      ? 'Trimester 1'
      : mother.pregnancy_age_weeks <= 27
        ? 'Trimester 2'
        : 'Trimester 3';
  const initials = String(mother.name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const openVideo = (video: Video) => {
    if (video.status === 'locked') {
      Alert.alert(
        'Materi masih terkunci',
        'Selesaikan materi sebelumnya untuk membuka video ini.',
      );
      return;
    }
    router.push(`/respondent/videos/${video.id}` as never);
  };

  return (
    <Screen onRefresh={refresh} refreshing={refreshing} showBack={false}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.greetingEyebrow}>SELAMAT DATANG</Text>
          <Text style={styles.greeting}>
            Halo, Ibu {mother.name.split(' ')[0]}!
          </Text>
          <Text style={styles.greetingHint}>
            Semoga Ibu dan bayi selalu sehat.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/respondent/profile' as never)}
          style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.avatarText}>{initials || 'IB'}</Text>
        </Pressable>
      </View>

      <View style={styles.pregnancyCard}>
        <View style={styles.pregnancyIcon}>
          <MaterialCommunityIcons
            accessible={false}
            color="white"
            name="human-pregnant"
            size={31}
          />
        </View>
        <View style={styles.pregnancyCopy}>
          <Text style={styles.pregnancyLabel}>USIA KEHAMILAN</Text>
          <Text style={styles.pregnancyValue}>
            {mother.pregnancy_age_weeks} minggu
          </Text>
          <Text style={styles.pregnancyTrimester}>{trimester}</Text>
        </View>
        <View style={styles.hplBlock}>
          <Text style={styles.hplLabel}>HPL</Text>
          <Text style={styles.hplValue}>{formatDate(mother.hpl)}</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeading}>
          <View>
            <Text style={styles.progressTitle}>Perjalanan belajar Ibu</Text>
            <Text style={styles.progressHint}>
              {completed} dari {list.length || 7} materi selesai
            </Text>
          </View>
          <Text style={styles.progressValue}>{Math.round(percentage)}%</Text>
        </View>
        <Progress value={percentage} />
        {next ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => openVideo(next)}
            style={({ pressed }) => [
              styles.nextAction,
              pressed && { opacity: 0.65 },
            ]}
          >
            <View style={styles.nextActionIcon}>
              <Ionicons
                accessible={false}
                color="white"
                name="play"
                size={15}
              />
            </View>
            <View style={styles.nextActionCopy}>
              <Text style={styles.nextActionEyebrow}>LANGKAH BERIKUTNYA</Text>
              <Text style={styles.nextActionTitle}>
                {videoStatusLabels[next.status]} • Video {next.sequence_number}
              </Text>
            </View>
            <Ionicons
              accessible={false}
              color={colors.primaryDark}
              name="chevron-forward"
              size={21}
            />
          </Pressable>
        ) : completed === list.length && list.length ? (
          <View style={styles.completeMessage}>
            <Ionicons
              accessible={false}
              color={colors.success}
              name="checkmark-circle"
              size={17}
            />
            <Text style={styles.completeMessageText}>
              Selamat, seluruh program edukasi telah selesai!
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Materi edukasi</Text>
          <Text style={styles.sectionHint}>
            Selesaikan materi secara berurutan
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={refreshing}
          onPress={refresh}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <Text style={styles.refreshText}>
            {refreshing ? 'Memperbarui…' : 'Perbarui'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.videoList}>
        {list.map((video, index) => {
          const locked = video.status === 'locked';
          return (
            <Pressable
              accessibilityRole="button"
              key={video.id}
              onPress={() => openVideo(video)}
              style={({ pressed }) => [
                styles.videoRow,
                index < list.length - 1 && styles.videoBorder,
                pressed && { opacity: 0.58 },
              ]}
            >
              <View
                style={[
                  styles.videoNumber,
                  video.status === 'completed' && styles.videoNumberComplete,
                  locked && styles.videoNumberLocked,
                ]}
              >
                {video.status === 'completed' ? (
                  <Ionicons
                    accessible={false}
                    color="white"
                    name="checkmark"
                    size={19}
                  />
                ) : (
                  <Text style={styles.videoNumberText}>
                    {video.sequence_number}
                  </Text>
                )}
              </View>
              <View style={styles.videoContent}>
                <View style={styles.videoTitleRow}>
                  <Text
                    style={[
                      styles.videoTitle,
                      locked && styles.videoTitleLocked,
                    ]}
                    numberOfLines={2}
                  >
                    {video.title}
                  </Text>
                  <Text style={styles.videoPercentage}>
                    {Math.round(video.completion_percentage)}%
                  </Text>
                </View>
                <View style={styles.videoStatusRow}>
                  <Badge tone={videoStatusTone(video.status)}>
                    {videoStatusLabels[video.status]}
                  </Badge>
                  {video.is_last_video &&
                  video.status === 'waiting_posttest' &&
                  video.available_at ? (
                    <Text style={styles.availableText}>
                      {formatDateTime(video.available_at)}
                    </Text>
                  ) : null}
                </View>
                <Progress value={video.completion_percentage} />
              </View>
              <Ionicons
                accessible={false}
                color={locked ? colors.muted : colors.primary}
                name={locked ? 'lock-closed' : 'play-circle'}
                size={22}
              />
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  greetingEyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  greeting: {
    marginTop: 3,
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
  },
  greetingHint: { marginTop: 2, color: colors.muted, fontSize: 11 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarText: { color: colors.primaryDark, fontSize: 15, fontWeight: '900' },
  pregnancyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 21,
    backgroundColor: colors.primaryDark,
  },
  pregnancyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  pregnancyCopy: { flex: 1 },
  pregnancyLabel: {
    color: '#EFCFDE',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  pregnancyValue: {
    marginTop: 2,
    color: 'white',
    fontSize: 21,
    fontWeight: '900',
  },
  pregnancyTrimester: { color: '#EAD9E1', fontSize: 10 },
  hplBlock: { alignItems: 'flex-end' },
  hplLabel: { color: '#EFCFDE', fontSize: 8, fontWeight: '900' },
  hplValue: { marginTop: 4, color: 'white', fontSize: 12, fontWeight: '800' },
  progressCard: {
    gap: 13,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  progressHint: { marginTop: 2, color: colors.muted, fontSize: 10 },
  progressValue: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  nextAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 11,
    borderRadius: 15,
    backgroundColor: colors.pink,
  },
  nextActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  nextActionCopy: { flex: 1, gap: 2 },
  nextActionEyebrow: {
    color: colors.primary,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  nextActionTitle: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  completeMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 11,
    borderRadius: 14,
    backgroundColor: '#DDF4E8',
  },
  completeMessageText: {
    flex: 1,
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  sectionHint: { marginTop: 2, color: colors.muted, fontSize: 10 },
  refreshText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  videoList: {
    paddingHorizontal: 14,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 14,
  },
  videoBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  videoNumber: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
  },
  videoNumberComplete: { backgroundColor: colors.success },
  videoNumberLocked: { backgroundColor: '#F1EDF0' },
  videoNumberText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '900',
  },
  videoContent: { flex: 1, gap: 7 },
  videoTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  videoTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  videoTitleLocked: { color: colors.muted },
  videoPercentage: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  videoStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
  },
  availableText: {
    flex: 1,
    color: colors.muted,
    fontSize: 8,
    textAlign: 'right',
  },
});
