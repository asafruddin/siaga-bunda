import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Screen } from '@/components/ui';
import { colors } from '@/theme';

const benefits = [
  [
    '▶',
    'Video edukasi terarah',
    'Pelajari tujuh tanda bahaya secara bertahap.',
  ],
  ['✓', 'Evaluasi pengetahuan', 'Ukur pemahaman sebelum dan setelah materi.'],
  [
    '◷',
    'Pengingat posttest',
    'Dapatkan arahan saat evaluasi berikutnya tersedia.',
  ],
];

export default function Onboarding() {
  return (
    <Screen showBack={false}>
      <View style={styles.brandRow}>
        <View style={styles.miniLogo}>
          <Text style={styles.miniLogoText}>♡</Text>
        </View>
        <View>
          <Text style={styles.brandName}>SiAGA Bunda</Text>
          <Text style={styles.brandCaption}>Sahabat edukasi kehamilan</Text>
        </View>
      </View>

      <View style={styles.heroVisual}>
        <View style={styles.heroCircleLarge} />
        <View style={styles.heroCircleSmall} />
        <View style={styles.heroCard}>
          <Text style={styles.heroHeart}>♡</Text>
          <View style={styles.heroShield}>
            <Text style={styles.heroShieldText}>✓</Text>
          </View>
        </View>
        <View style={[styles.floatingPill, styles.floatingPillTop]}>
          <Text style={styles.floatingPillIcon}>✚</Text>
          <Text style={styles.floatingPillText}>Kenali lebih dini</Text>
        </View>
        <View style={[styles.floatingPill, styles.floatingPillBottom]}>
          <Text style={styles.floatingPillIcon}>♡</Text>
          <Text style={styles.floatingPillText}>Jaga ibu & bayi</Text>
        </View>
      </View>

      <View style={styles.heading}>
        <View style={styles.eyebrowPill}>
          <Text style={styles.eyebrowText}>EDUKASI KEHAMILAN TERPERCAYA</Text>
        </View>
        <Text style={styles.title}>
          Kenali tanda bahaya,{`\n`}
          <Text style={styles.titleAccent}>lindungi dua nyawa.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Belajar melalui video singkat dengan alur yang sederhana, aman, dan
          mudah diikuti selama kehamilan.
        </Text>
      </View>

      <View style={styles.benefitList}>
        {benefits.map(([icon, title, description], index) => (
          <View
            key={title}
            style={[
              styles.benefitRow,
              index < benefits.length - 1 && styles.benefitBorder,
            ]}
          >
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitIconText}>{icon}</Text>
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>{title}</Text>
              <Text style={styles.benefitDescription}>{description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          onPress={() => router.push('/respondent/register/step-1' as never)}
        >
          Mulai Sekarang
        </Button>
        <Button
          variant="secondary"
          onPress={() => router.push('/auth/researcher-login' as never)}
        >
          Masuk sebagai Peneliti
        </Button>
        <Text style={styles.consentHint}>
          Dengan melanjutkan, Ibu akan diminta membaca dan menyetujui penggunaan
          data untuk edukasi serta penelitian.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniLogo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
  },
  miniLogoText: { color: 'white', fontSize: 27 },
  brandName: { color: colors.text, fontSize: 15, fontWeight: '900' },
  brandCaption: { color: colors.muted, fontSize: 9 },
  heroVisual: { height: 250, alignItems: 'center', justifyContent: 'center' },
  heroCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.purple,
  },
  heroCircleSmall: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: colors.pink,
  },
  heroCard: {
    width: 112,
    height: 132,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  heroHeart: { color: 'white', fontSize: 68 },
  heroShield: {
    position: 'absolute',
    right: -9,
    bottom: 13,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.pink,
  },
  heroShieldText: { color: 'white', fontWeight: '900' },
  floatingPill: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  floatingPillTop: { top: 38, right: 1 },
  floatingPillBottom: { bottom: 35, left: 0 },
  floatingPillIcon: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  floatingPillText: { color: colors.text, fontSize: 9, fontWeight: '800' },
  heading: { alignItems: 'flex-start', gap: 10 },
  eyebrowPill: {
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
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '900',
  },
  titleAccent: { color: colors.primary },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  benefitList: {
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 12,
  },
  benefitBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
  },
  benefitIconText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },
  benefitCopy: { flex: 1, gap: 2 },
  benefitTitle: { color: colors.text, fontSize: 12, fontWeight: '800' },
  benefitDescription: { color: colors.muted, fontSize: 9, lineHeight: 14 },
  actions: { gap: 10, marginTop: 4 },
  consentHint: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
  },
});
