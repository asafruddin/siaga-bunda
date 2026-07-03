import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/services/session';
import { colors } from '@/theme';
export default function Splash() {
  const { hydrated, token, role } = useSession();
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(
      () =>
        router.replace(
          (token
            ? role === 'researcher'
              ? '/researcher/home'
              : '/respondent/dashboard'
            : '/onboarding') as never,
        ),
      900,
    );
    return () => clearTimeout(timer);
  }, [hydrated, token, role]);
  return (
    <View style={s.root}>
      <View style={s.logo}>
        <Text style={s.heart}>♡</Text>
      </View>
      <Text style={s.name}>SiAGA Bunda</Text>
      <Text style={s.tag}>Kenali Tanda Bahaya, Lindungi Ibu dan Bayi</Text>
    </View>
  );
}
const s = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.background,
    gap: 12,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: { fontSize: 62, color: colors.primary },
  name: { fontSize: 32, fontWeight: '900', color: colors.primaryDark },
  tag: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: colors.muted,
  },
});
