import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
  Button,
  Loading,
  Notice,
  Progress,
  Screen,
  Title,
  ui,
} from '@/components/ui';
import { api, post } from '@/services/api';
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
        <Notice>{q.error?.message ?? 'Video tidak ditemukan.'}</Notice>
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
  return (
    <Screen>
      <Title subtitle="Video tidak dapat dimajukan. Anda dapat menjeda atau mengulang bagian yang sudah ditonton.">
        {video.title}
      </Title>
      <VideoView
        player={player}
        style={s.video}
        nativeControls={false}
        contentFit="contain"
      />
      <Progress value={(max / video.duration_seconds) * 100} />
      <Text style={ui.muted}>
        {Math.floor(max)} / {video.duration_seconds} detik • waktu ditonton{' '}
        {Math.floor(watched)} detik
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Button
            variant="secondary"
            onPress={() => {
              player.currentTime = Math.max(0, player.currentTime - 10);
            }}
          >
            −10 detik
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button onPress={toggle}>{playing ? 'Jeda' : 'Putar'}</Button>
        </View>
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
