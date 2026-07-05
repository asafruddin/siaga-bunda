import type { StyleProp, ViewStyle } from 'react-native';

declare module 'expo-video' {
  // RN 0.85 ViewProps no longer surfaces `style` through interface extends.
  interface VideoViewProps {
    style?: StyleProp<ViewStyle>;
  }
}
