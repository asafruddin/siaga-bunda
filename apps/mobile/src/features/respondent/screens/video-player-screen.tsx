import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { Button, Loading, Notice, Progress, Screen } from '@/components/ui';
import { api, post } from '@/services/api';
import { colors } from '@/theme';
import { VideoPlayerControls } from '../components/video-player-controls';
import { formatVideoTime } from '../lib/format-time';
import { respondentStyles as s } from '../lib/styles';
import type { VideoDetail } from '../lib/types';
import { useVideoWatchProgress } from '../lib/use-video-watch-progress';

export function VideoPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['video', id],
    queryFn: () => api<VideoDetail>(`/videos/${id}`),
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
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error?.message ?? 'Video tidak ditemukan.'}
        </Notice>
      </Screen>
    );
  return (
    <VideoPlayer
      video={q.data}
      onDone={async () => {
        await qc.invalidateQueries();
        router.replace(`/respondent/videos/${id}/video-completed` as never);
      }}
    />
  );
}

function VideoPlayer({
  video,
  onDone,
}: {
  video: VideoDetail;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const player = useVideoPlayer(video.video_url, (p) => {
    p.timeUpdateEventInterval = 1;
  });

  const {
    max,
    watched,
    currentTime,
    playing,
    completed,
    percentage,
    checkpoint,
    toggle,
    seekTo,
    skipBackward,
    skipForward,
  } = useVideoWatchProgress({ player, video });

  async function finish() {
    try {
      setBusy(true);
      await checkpoint();
      await post(`/videos/${video.id}/complete`);
      onDone();
    } catch (e) {
      Alert.alert(
        'Video belum selesai',
        e instanceof Error ? e.message : 'Tonton hingga akhir.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function enterCustomFullscreen() {
    setFullscreen(true);
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    ).catch(() => {});
  }

  async function exitCustomFullscreen() {
    setFullscreen(false);
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    ).catch(() => {});
  }

  useEffect(
    () => () => {
      try {
        player.pause();
      } catch {
        // Native player already released.
      }
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {});
    },
    [player],
  );

  const remaining = Math.max(0, video.duration_seconds - max);

  return (
    <Screen>
      <View style={styles.heading}>
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>VIDEO EDUKASI</Text>
        </View>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.subtitle}>
          {video.is_last_video
            ? 'Tonton sampai selesai untuk membuka jadwal posttest.'
            : 'Tonton sampai selesai untuk melanjutkan ke materi berikutnya.'}
        </Text>
      </View>

      <View style={styles.playerFrame}>
        {!fullscreen ? (
          <VideoView
            player={player}
            style={s.video}
            nativeControls={false}
            contentFit="contain"
            requiresLinearPlayback
            allowsVideoFrameAnalysis={false}
            surfaceType="textureView"
            fullscreenOptions={{ enable: false }}
            onFirstFrameRender={() => setLoading(false)}
          />
        ) : null}
        {!fullscreen ? (
          <VideoPlayerControls
            currentTime={currentTime}
            duration={video.duration_seconds}
            maxWatched={max}
            playing={playing}
            muted={muted}
            loading={loading}
            onTogglePlay={toggle}
            onSkipBackward={() => skipBackward()}
            onSkipForward={() => skipForward()}
            onSeek={seekTo}
            onToggleMute={() => {
              const next = !muted;
              try {
                // Expo Video controls mute through its imperative player API.
                // eslint-disable-next-line react-hooks/immutability
                player.muted = next;
              } catch {
                // Native player already released.
              }
              setMuted(next);
            }}
            onFullscreen={enterCustomFullscreen}
          />
        ) : null}
      </View>

      <Modal
        visible={fullscreen}
        animationType="fade"
        presentationStyle="fullScreen"
        supportedOrientations={[
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        statusBarTranslucent
        onRequestClose={exitCustomFullscreen}
      >
        <View style={styles.fullscreenRoot}>
          <StatusBar hidden />
          <VideoView
            player={player}
            style={styles.fullscreenVideo}
            nativeControls={false}
            contentFit="contain"
            requiresLinearPlayback
            allowsVideoFrameAnalysis={false}
            surfaceType="textureView"
            fullscreenOptions={{ enable: false }}
            onFirstFrameRender={() => setLoading(false)}
          />
          <VideoPlayerControls
            currentTime={currentTime}
            duration={video.duration_seconds}
            maxWatched={max}
            playing={playing}
            muted={muted}
            loading={loading}
            onTogglePlay={toggle}
            onSkipBackward={() => skipBackward()}
            onSkipForward={() => skipForward()}
            onSeek={seekTo}
            onToggleMute={() => {
              const next = !muted;
              try {
                // Expo Video controls mute through its imperative player API.
                // eslint-disable-next-line react-hooks/immutability
                player.muted = next;
              } catch {
                // Native player already released.
              }
              setMuted(next);
            }}
            onFullscreen={exitCustomFullscreen}
            fullscreen
          />
        </View>
      </Modal>

      <View style={styles.watchCard}>
        <View style={styles.watchHeading}>
          <View>
            <Text style={styles.watchLabel}>PROGRES MENONTON</Text>
            <Text style={styles.watchValue}>{Math.round(percentage)}%</Text>
          </View>
          <View style={styles.timePill}>
            <Text style={styles.timePillText}>
              {formatVideoTime(remaining)} tersisa
            </Text>
          </View>
        </View>
        <Progress value={percentage} />
        <View style={styles.watchStats}>
          <Text style={styles.watchStatText}>
            Posisi {formatVideoTime(max)}
          </Text>
          <Text style={styles.watchStatText}>
            Ditonton {formatVideoTime(watched)}
          </Text>
        </View>
      </View>

      <View style={styles.noSkipNote}>
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="information-outline"
          size={18}
        />
        <Text style={styles.noSkipText}>
          Bagian yang belum ditonton tidak dapat dilewati, termasuk saat
          menggeser bilah waktu. Ibu tetap dapat mengulang bagian sebelumnya
          atau menjeda video kapan saja.
        </Text>
      </View>

      <Button disabled={!completed || busy} onPress={finish}>
        {busy
          ? 'Menyimpan…'
          : completed
            ? 'Selesaikan Video'
            : 'Tonton sampai selesai'}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 8 },
  eyebrowPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: colors.pink,
  },
  eyebrowText: {
    color: colors.primaryDark,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
  },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  playerFrame: {
    position: 'relative',
    overflow: 'hidden',
    padding: 5,
    borderRadius: 22,
    backgroundColor: '#211820',
    shadowColor: '#211820',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  fullscreenRoot: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    ...StyleSheet.absoluteFill,
  },
  watchCard: {
    gap: 12,
    padding: 15,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  watchHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  watchLabel: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  watchValue: {
    marginTop: 2,
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: '900',
  },
  timePill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: colors.purple,
  },
  timePillText: { color: colors.primaryDark, fontSize: 9, fontWeight: '800' },
  watchStats: { flexDirection: 'row', justifyContent: 'space-between' },
  watchStatText: { color: colors.muted, fontSize: 9 },
  noSkipNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    borderRadius: 15,
    backgroundColor: colors.blue,
  },
  noSkipText: { flex: 1, color: colors.muted, fontSize: 9, lineHeight: 14 },
});
