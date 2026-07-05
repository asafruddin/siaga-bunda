import { useRef } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '@/theme';

type VideoSeekBarProps = {
  currentTime: number;
  duration: number;
  maxWatched: number;
  onSeek: (time: number) => void;
};

export function VideoSeekBar({
  currentTime,
  duration,
  maxWatched,
  onSeek,
}: VideoSeekBarProps) {
  const trackWidth = useRef(0);

  const positionFromX = (x: number) => {
    if (trackWidth.current <= 0 || duration <= 0) return 0;
    const ratio = Math.max(0, Math.min(1, x / trackWidth.current));
    const time = ratio * duration;
    return Math.max(0, Math.min(maxWatched, time));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        onSeek(positionFromX(event.nativeEvent.locationX));
      },
      onPanResponderMove: (event) => {
        onSeek(positionFromX(event.nativeEvent.locationX));
      },
    }),
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.current = event.nativeEvent.layout.width;
  };

  const watchedRatio = duration > 0 ? Math.min(1, maxWatched / duration) : 0;
  const currentRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel="Geser posisi video"
      onLayout={onLayout}
      style={styles.track}
      {...pan.panHandlers}
    >
      <View style={styles.trackBase} />
      <View
        style={[styles.trackWatched, { width: `${watchedRatio * 100}%` }]}
      />
      <View
        style={[styles.trackProgress, { width: `${currentRatio * 100}%` }]}
      />
      <View style={[styles.thumb, { left: `${currentRatio * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    justifyContent: 'center',
  },
  trackBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(0,0,0,0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  trackWatched: {
    position: 'absolute',
    left: 0,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  trackProgress: {
    position: 'absolute',
    left: 0,
    height: 3,
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  thumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    marginLeft: -6,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: 'white',
  },
});
