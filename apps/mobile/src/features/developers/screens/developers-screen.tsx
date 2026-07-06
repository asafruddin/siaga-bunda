import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Screen } from '@/components/ui';
import { colors } from '@/theme';
import { DeveloperCard } from '../components/developer-card';
import { developers } from '../lib/developers';

export function DevelopersScreen() {
  return (
    <Screen>
      <View style={styles.heading}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowIcon}>
            <MaterialCommunityIcons
              accessible={false}
              color={colors.primaryDark}
              name="account-group-outline"
              size={18}
            />
          </View>
          <Text style={styles.eyebrow}>TIM PENELITI</Text>
        </View>
        <Text style={styles.title}>Tim Pengembang</Text>
        <Text style={styles.subtitle}>
          Para peneliti yang berkolaborasi menghadirkan edukasi kehamilan SiAGA
          Bunda.
        </Text>
      </View>

      <View style={styles.trustCard}>
        <View style={styles.trustDecorationLarge} />
        <View style={styles.trustDecorationSmall} />
        <View style={styles.trustIcon}>
          <MaterialCommunityIcons
            accessible={false}
            color="white"
            name="shield-account-outline"
            size={26}
          />
        </View>
        <View style={styles.trustCopy}>
          <Text style={styles.trustTitle}>Kolaborasi untuk ibu dan bayi</Text>
          <Text style={styles.trustText}>
            Dikembangkan bersama tenaga pendidik dan peneliti kesehatan.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Anggota tim</Text>
          <Text style={styles.sectionHint}>Profil peneliti SiAGA Bunda</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{developers.length} peneliti</Text>
        </View>
      </View>

      <View style={styles.list}>
        {developers.map((developer) => (
          <DeveloperCard
            key={developer.nomor_induk.nomor}
            developer={developer}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 8 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  eyebrowIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  title: { color: colors.text, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  trustCard: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 17,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
  },
  trustDecorationLarge: {
    position: 'absolute',
    width: 120,
    height: 120,
    right: -45,
    top: -58,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  trustDecorationSmall: {
    position: 'absolute',
    width: 74,
    height: 74,
    right: 10,
    bottom: -48,
    borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  trustIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  trustCopy: { flex: 1, gap: 4 },
  trustTitle: { color: 'white', fontSize: 14, fontWeight: '900' },
  trustText: { color: '#EEDCE4', fontSize: 11, lineHeight: 16 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 3,
  },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  sectionHint: { marginTop: 2, color: colors.muted, fontSize: 11 },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: colors.pink,
  },
  countText: { color: colors.primaryDark, fontSize: 10, fontWeight: '800' },
  list: { gap: 12 },
});
