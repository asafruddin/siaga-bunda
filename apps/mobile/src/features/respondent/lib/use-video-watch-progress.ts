import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Alert, AppState } from 'react-native';
import type { VideoPlayer } from 'expo-video';
import { post } from '@/services/api';
import type { VideoDetail } from './types';

type UseVideoWatchProgressOptions = {
  player: VideoPlayer;
  video: VideoDetail;
};

function withPlayer(player: VideoPlayer, fn: () => void) {
  try {
    fn();
  } catch {
    // Native player already released during navigation away.
  }
}

export function useVideoWatchProgress({
  player,
  video,
}: UseVideoWatchProgressOptions) {
  const startAt = Number(video.progress.max_watched_seconds ?? 0);
  const [max, setMax] = useState(startAt);
  const [watched, setWatched] = useState(
    Number(video.progress.duration_watched_seconds ?? 0),
  );
  const [currentTime, setCurrentTime] = useState(startAt);
  const [playing, setPlaying] = useState(false);

  const aliveRef = useRef(true);
  const maxRef = useRef(max);
  const watchedRef = useRef(watched);
  const currentTimeRef = useRef(startAt);
  const playingRef = useRef(false);
  const last = useRef(startAt);

  const saveProgress = useCallback(
    () =>
      post(`/videos/${video.id}/progress`, {
        currentSecond: currentTimeRef.current,
        maxWatchedSecond: maxRef.current,
        durationWatchedSeconds: watchedRef.current,
      }),
    [video.id],
  );

  const clampSeek = useCallback(
    (time: number) => Math.max(0, Math.min(maxRef.current, time)),
    [],
  );

  const seekTo = useCallback(
    (time: number) => {
      const next = clampSeek(time);
      currentTimeRef.current = next;
      withPlayer(player, () => {
        player.currentTime = next;
      });
      setCurrentTime(next);
      last.current = next;
    },
    [clampSeek, player],
  );

  const skipBackward = useCallback(
    (seconds = 10) => {
      seekTo(currentTimeRef.current - seconds);
    },
    [seekTo],
  );

  const skipForward = useCallback(
    (seconds = 10) => {
      seekTo(currentTimeRef.current + seconds);
    },
    [seekTo],
  );

  useLayoutEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      playingRef.current = false;
      withPlayer(player, () => {
        player.pause();
      });
    };
  }, [player]);

  useEffect(() => {
    maxRef.current = max;
  }, [max]);

  useEffect(() => {
    watchedRef.current = watched;
  }, [watched]);

  useEffect(() => {
    withPlayer(player, () => {
      player.currentTime = startAt;
    });
    currentTimeRef.current = startAt;
    last.current = startAt;

    post(`/videos/${video.id}/start`).catch((e) =>
      Alert.alert('Video belum dapat dimulai', e.message),
    );

    const sub = player.addListener('timeUpdate', ({ currentTime: time }) => {
      if (!aliveRef.current) return;

      if (time > maxRef.current + 2) {
        const clamped = maxRef.current;
        currentTimeRef.current = clamped;
        withPlayer(player, () => {
          player.currentTime = clamped;
        });
        setCurrentTime(clamped);
        return;
      }

      currentTimeRef.current = time;
      setCurrentTime(time);

      if (
        playingRef.current &&
        time >= last.current &&
        time - last.current <= 2
      ) {
        watchedRef.current = Math.min(
          video.duration_seconds,
          watchedRef.current + (time - last.current),
        );
        setWatched(watchedRef.current);
      }
      if (time > maxRef.current) {
        maxRef.current = time;
        setMax(time);
      }
      last.current = time;
    });

    return () => {
      try {
        sub.remove();
      } catch {
        // Listener already torn down with the native player.
      }
      saveProgress().catch(() => {});
    };
  }, [player, saveProgress, startAt, video.duration_seconds, video.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (aliveRef.current && playingRef.current) {
        saveProgress().catch(() => {});
      }
    }, 10000);

    const state = AppState.addEventListener('change', (next) => {
      if (!aliveRef.current || next === 'active' || !playingRef.current) return;

      withPlayer(player, () => {
        player.pause();
      });
      playingRef.current = false;
      setPlaying(false);
      saveProgress().catch(() => {});
    });

    return () => {
      clearInterval(timer);
      state.remove();
    };
  }, [player, saveProgress]);

  const toggle = useCallback(async () => {
    if (playing) {
      withPlayer(player, () => {
        player.pause();
      });
      playingRef.current = false;
      setPlaying(false);
      await saveProgress().catch(() => {});
      return;
    }
    withPlayer(player, () => {
      player.play();
    });
    playingRef.current = true;
    setPlaying(true);
  }, [player, playing, saveProgress]);

  const skipToEnd = useCallback(async () => {
    const end = video.duration_seconds;
    maxRef.current = end;
    watchedRef.current = end;
    currentTimeRef.current = end;
    last.current = end;
    setMax(end);
    setWatched(end);
    setCurrentTime(end);
    withPlayer(player, () => {
      player.pause();
      player.currentTime = end;
    });
    playingRef.current = false;
    setPlaying(false);
    await saveProgress();
  }, [player, saveProgress, video.duration_seconds]);

  const completed =
    max >= video.duration_seconds - 2 &&
    watched >= video.duration_seconds * 0.9;
  const percentage = Math.min(100, (max / video.duration_seconds) * 100);

  return {
    max,
    watched,
    currentTime,
    playing,
    completed,
    percentage,
    checkpoint: saveProgress,
    toggle,
    seekTo,
    skipBackward,
    skipForward,
    skipToEnd,
  };
}
