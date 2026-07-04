import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Button, Loading, Notice, Progress, Screen } from '@/components/ui';
import { api, post } from '@/services/api';
import { colors } from '@/theme';
import { respondentStyles as s } from '../lib/styles';

export function VideoPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['video', id],
    queryFn: () => api<any>(`/videos/${id}`),
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

function VideoPlayer({ video, onDone }: { video: any; onDone: () => void }) {
  const player = useVideoPlayer(video.video_url, (p) => {
    p.timeUpdateEventInterval = 1;
  });
  const [max, setMax] = useState(
    Number(video.progress.max_watched_seconds ?? 0),
  );
  const [watched, setWatched] = useState(
    Number(video.progress.duration_watched_seconds ?? 0),
  );
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const maxRef = useRef(max);
  const watchedRef = useRef(watched);
  const playingRef = useRef(false);
  const last = useRef(0);
  const checkpoint = () =>
    post(`/videos/${video.id}/progress`, {
      currentSecond: player.currentTime,
      maxWatchedSecond: maxRef.current,
      durationWatchedSeconds: watchedRef.current,
    });
  useEffect(() => {
    player.currentTime = max;
    post(`/videos/${video.id}/start`).catch((e) =>
      Alert.alert('Video belum dapat dimulai', e.message),
    );
    const sub = player.addListener('timeUpdate', ({ currentTime }) => {
      if (currentTime > maxRef.current + 2) {
        player.currentTime = maxRef.current;
        return;
      }
      if (
        playingRef.current &&
        currentTime >= last.current &&
        currentTime - last.current <= 2
      ) {
        watchedRef.current = Math.min(
          video.duration_seconds,
          watchedRef.current + (currentTime - last.current),
        );
        setWatched(watchedRef.current);
      }
      if (currentTime > maxRef.current) {
        maxRef.current = currentTime;
        setMax(currentTime);
      }
      last.current = currentTime;
    });
    return () => sub.remove();
  }, [player, video.id]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (playingRef.current) checkpoint().catch(() => {});
    }, 10000);
    const state = AppState.addEventListener('change', (next) => {
      if (next !== 'active' && playingRef.current) {
        player.pause();
        playingRef.current = false;
        setPlaying(false);
        checkpoint().catch(() => {});
      }
    });
    return () => {
      clearInterval(timer);
      state.remove();
      checkpoint().catch(() => {});
    };
  }, [player, video.id]);
  async function toggle() {
    if (playing) {
      player.pause();
      playingRef.current = false;
      setPlaying(false);
      await checkpoint().catch(() => {});
    } else {
      player.play();
      playingRef.current = true;
      setPlaying(true);
    }
  }
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
  const completed =
    max >= video.duration_seconds - 2 &&
    watched >= video.duration_seconds * 0.9;
  const percentage = Math.min(100, (max / video.duration_seconds) * 100);
  const remaining = Math.max(0, video.duration_seconds - max);
  return (
    <Screen>
      <View style={styles.heading}>
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>VIDEO EDUKASI</Text>
        </View>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.subtitle}>
          Tonton sampai selesai untuk membuka jadwal posttest.
        </Text>
      </View>

      <View style={styles.playerFrame}>
        <VideoView
          player={player}
          style={s.video}
          nativeControls={false}
          contentFit="contain"
        />
        <View style={styles.playerStatus}>
          <View style={styles.liveDot} />
          <Text style={styles.playerStatusText}>
            {playing ? 'Sedang diputar' : 'Dijeda'}
          </Text>
        </View>
      </View>

      <View style={styles.watchCard}>
        <View style={styles.watchHeading}>
          <View>
            <Text style={styles.watchLabel}>PROGRES MENONTON</Text>
            <Text style={styles.watchValue}>{Math.round(percentage)}%</Text>
          </View>
          <View style={styles.timePill}>
            <Text style={styles.timePillText}>
              {Math.floor(remaining)} detik tersisa
            </Text>
          </View>
        </View>
        <Progress value={percentage} />
        <View style={styles.watchStats}>
          <Text style={styles.watchStatText}>
            Posisi {Math.floor(max)} detik
          </Text>
          <Text style={styles.watchStatText}>
            Ditonton {Math.floor(watched)} detik
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Button
            variant="secondary"
            onPress={() => {
              player.currentTime = Math.max(0, player.currentTime - 10);
            }}
          >
            ↶ 10 detik
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button onPress={toggle}>{playing ? 'Ⅱ Jeda' : '▶ Putar'}</Button>
        </View>
      </View>

      <View style={styles.noSkipNote}>
        <Text style={styles.noSkipIcon}>⌾</Text>
        <Text style={styles.noSkipText}>
          Bagian yang belum ditonton tidak dapat dilewati. Ibu tetap dapat
          mengulang bagian sebelumnya atau menjeda video kapan saja.
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
    padding: 5,
    borderRadius: 22,
    backgroundColor: '#211820',
    shadowColor: '#211820',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  playerStatus: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F28AAC' },
  playerStatusText: { color: 'white', fontSize: 8, fontWeight: '800' },
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
  noSkipIcon: { color: colors.primaryDark, fontSize: 16, fontWeight: '900' },
  noSkipText: { flex: 1, color: colors.muted, fontSize: 9, lineHeight: 14 },
});
