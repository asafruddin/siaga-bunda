import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/theme';

const copy = [
  {
    eyebrow: 'LANGKAH 1 DARI 3',
    title: 'Kenali Ibu lebih dekat',
    hint: 'Isi data identitas yang akan digunakan selama program edukasi.',
    icon: 'account-circle-outline',
  },
  {
    eyebrow: 'LANGKAH 2 DARI 3',
    title: 'Tentang kehamilan Ibu',
    hint: 'Data ini membantu menampilkan usia kehamilan dan HPL secara tepat.',
    icon: 'human-pregnant',
  },
  {
    eyebrow: 'LANGKAH 3 DARI 3',
    title: 'Dukungan & persetujuan',
    hint: 'Satu langkah terakhir sebelum memulai materi edukasi.',
    icon: 'shield-check-outline',
  },
] as const;

export function RegistrationHeader({ step }: { step: 1 | 2 | 3 }) {
  const content = copy[step - 1];
  return (
    <View style={styles.header}>
      <View style={styles.progressRow}>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.progressSegment,
              item <= step && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>
      <View style={styles.eyebrowRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            accessible={false}
            color={colors.primaryDark}
            name={content.icon}
            size={17}
          />
        </View>
        <Text style={styles.eyebrow}>{content.eyebrow}</Text>
      </View>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.hint}>{content.hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 8 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 7 },
  progressSegment: {
    flex: 1,
    height: 5,
    borderRadius: 99,
    backgroundColor: colors.border,
  },
  progressSegmentActive: { backgroundColor: colors.primary },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBox: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  title: { color: colors.text, fontSize: 27, fontWeight: '900' },
  hint: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
