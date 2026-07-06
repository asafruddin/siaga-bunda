import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/services/session';
import { colors } from '@/theme';

const splashIllustration = require('../../../../assets/app/ilustrations/pregnant-1.png');

export function SplashScreen() {
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
    <View style={styles.root}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />
      <View style={styles.brandMark}>
        <Image
          accessibilityLabel="Ilustrasi ibu hamil"
          resizeMode="contain"
          source={splashIllustration}
          style={styles.heroImage}
        />
      </View>
      <Text style={styles.name}>SiAGA Bunda</Text>
      <Text style={styles.tag}>
        Kenali Tanda Bahaya,{`\n`}Lindungi Ibu dan Bayi
      </Text>
      <View style={styles.loadingRow}>
        <View style={[styles.loadingDot, styles.loadingDotActive]} />
        <View style={styles.loadingDot} />
        <View style={styles.loadingDot} />
      </View>
      <Text style={styles.footer}>EDUKASI KESEHATAN IBU HAMIL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 30,
    backgroundColor: colors.background,
  },
  decorTop: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: colors.purple,
    opacity: 0.72,
  },
  decorBottom: {
    position: 'absolute',
    bottom: -155,
    left: -125,
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: colors.pink,
    opacity: 0.64,
  },
  brandMark: { marginBottom: 22, alignItems: 'center' },
  heroImage: { width: 200, height: 220 },
  name: { color: colors.primaryDark, fontSize: 34, fontWeight: '900' },
  tag: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  loadingRow: { flexDirection: 'row', gap: 6, marginTop: 34 },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  loadingDotActive: { width: 20, backgroundColor: colors.primary },
  footer: {
    position: 'absolute',
    bottom: 42,
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
});
