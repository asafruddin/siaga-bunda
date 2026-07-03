import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
export async function getPushToken() {
  if (Platform.OS === 'web' || !Constants.isDevice) return undefined;
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('posttest', { name: 'Pengingat posttest', importance: Notifications.AndroidImportance.HIGH });
  let permission = await Notifications.getPermissionsAsync(); if (permission.status !== 'granted') permission = await Notifications.requestPermissionsAsync(); if (permission.status !== 'granted') return undefined;
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || Constants.expoConfig?.extra?.eas?.projectId; if (!projectId) return undefined;
  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}
