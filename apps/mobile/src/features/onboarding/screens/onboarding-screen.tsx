import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Button, Screen } from '@/components/ui';
import { colors } from '@/theme';

const benefits = [
  {
    icon: 'video-outline',
    title: 'Video edukasi terarah',
    description: 'Pelajari tujuh tanda bahaya secara bertahap.',
  },
  {
    icon: 'clipboard-check-outline',
    title: 'Evaluasi pengetahuan',
    description: 'Ukur pemahaman sebelum dan setelah materi.',
  },
  {
    icon: 'calendar-clock-outline',
    title: 'Pengingat posttest',
    description: 'Dapatkan arahan saat evaluasi berikutnya tersedia.',
  },
] as const;

const heroIllustration = require('../../../../assets/app/ilustrations/pregnant-2.png');
const launcherIcon = require('../../../../assets/app/launcher_icon.png');

export function OnboardingScreen() {
  return (
    <Screen showBack={false}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            accessibilityLabel="Logo SiAGA Bunda"
            resizeMode="cover"
            source={launcherIcon}
            style={styles.miniLogo}
          />
          <View>
            <Text style={styles.brandName}>SiAGA Bunda</Text>
            <Text style={styles.brandCaption}>Sahabat edukasi kehamilan</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tim Pengembang"
          onPress={() => router.push('/developers' as never)}
          style={({ pressed }) => [
            styles.menuButton,
            pressed && { opacity: 0.55 },
          ]}
        >
          <Ionicons
            accessible={false}
            color={colors.primaryDark}
            name="person-circle-sharp"
            size={32}
          />
        </Pressable>
      </View>

      <View style={styles.heroVisual}>
        <View style={styles.heroCircleLarge} />
        <View style={styles.heroCircleSmall} />
        <Image
          accessibilityLabel="Ilustrasi ibu hamil"
          resizeMode="contain"
          source={heroIllustration}
          style={styles.heroImage}
        />
        <View style={[styles.floatingPill, styles.floatingPillTop]}>
          <MaterialCommunityIcons
            accessible={false}
            color={colors.primary}
            name="medical-bag"
            size={14}
          />
          <Text style={styles.floatingPillText}>Kenali lebih dini</Text>
        </View>
        <View style={[styles.floatingPill, styles.floatingPillBottom]}>
          <MaterialCommunityIcons
            accessible={false}
            color={colors.primary}
            name="heart-pulse"
            size={14}
          />
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
        {benefits.map((benefit, index) => (
          <View
            key={benefit.title}
            style={[
              styles.benefitRow,
              index < benefits.length - 1 && styles.benefitBorder,
            ]}
          >
            <View style={styles.benefitIcon}>
              <MaterialCommunityIcons
                accessible={false}
                color={colors.primaryDark}
                name={benefit.icon}
                size={18}
              />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDescription}>
                {benefit.description}
              </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
  },
  miniLogo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    overflow: 'hidden',
  },
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
  heroImage: {
    width: 210,
    height: 230,
    zIndex: 1,
  },
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
