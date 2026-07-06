import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/theme';
import { formatVideoTime } from '../lib/format-time';
import { VideoSeekBar } from './video-seek-bar';

type VideoPlayerControlsProps = {
  currentTime: number;
  duration: number;
  maxWatched: number;
  playing: boolean;
  muted: boolean;
  loading: boolean;
  onTogglePlay: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onSeek: (time: number) => void;
  onToggleMute: () => void;
  onFullscreen: () => void;
  fullscreen?: boolean;
};

export function VideoPlayerControls({
  currentTime,
  duration,
  maxWatched,
  playing,
  muted,
  loading,
  onTogglePlay,
  onSkipBackward,
  onSkipForward,
  onSeek,
  onToggleMute,
  onFullscreen,
  fullscreen = false,
}: VideoPlayerControlsProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="white" size="small" />
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Jeda video' : 'Putar video'}
        onPress={onTogglePlay}
        style={styles.centerTap}
      />

      <View
        style={[
          styles.bar,
          fullscreen && { paddingBottom: Math.max(insets.bottom, 6) },
        ]}
      >
        <VideoSeekBar
          currentTime={currentTime}
          duration={duration}
          maxWatched={maxWatched}
          onSeek={onSeek}
        />

        <View style={styles.toolbar}>
          <Text style={styles.time}>
            {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mundur 10 detik"
              onPress={onSkipBackward}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                accessible={false}
                color="white"
                name="rewind-10"
                size={18}
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={playing ? 'Jeda' : 'Putar'}
              onPress={onTogglePlay}
              style={({ pressed }) => [
                styles.playBtn,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                accessible={false}
                color="white"
                name={playing ? 'pause' : 'play'}
                size={17}
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Maju 10 detik"
              onPress={onSkipForward}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                accessible={false}
                color="white"
                name="fast-forward-10"
                size={18}
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={muted ? 'Nyalakan suara' : 'Bisukan'}
              onPress={onToggleMute}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                accessible={false}
                color="white"
                name={muted ? 'volume-mute' : 'volume-high'}
                size={17}
              />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                fullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'
              }
              onPress={onFullscreen}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                accessible={false}
                color="white"
                name={fullscreen ? 'fullscreen-exit' : 'fullscreen'}
                size={19}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  loading: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  centerTap: {
    flex: 1,
  },
  bar: {
    gap: 4,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  time: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    minWidth: 88,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  iconBtn: {
    minWidth: 30,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  playBtn: {
    width: 34,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  pressed: { opacity: 0.65 },
});
