import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

const copy = [
  {
    eyebrow: 'LANGKAH 1 DARI 3',
    title: 'Kenali Ibu lebih dekat',
    hint: 'Isi data identitas yang akan digunakan selama program edukasi.',
    icon: '●',
  },
  {
    eyebrow: 'LANGKAH 2 DARI 3',
    title: 'Tentang kehamilan Ibu',
    hint: 'Data ini membantu menampilkan usia kehamilan dan HPL secara tepat.',
    icon: '♡',
  },
  {
    eyebrow: 'LANGKAH 3 DARI 3',
    title: 'Dukungan & persetujuan',
    hint: 'Satu langkah terakhir sebelum memulai materi edukasi.',
    icon: '✓',
  },
];

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
          <Text style={styles.iconText}>{content.icon}</Text>
        </View>
        <Text style={styles.eyebrow}>{content.eyebrow}</Text>
      </View>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.hint}>{content.hint}</Text>
    </View>
  );
}

export function FormSection({
  title,
  hint,
  children,
}: PropsWithChildren<{ title: string; hint?: string }>) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export const registrationStyles = StyleSheet.create({
  twoColumns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1 },
  dateButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dateText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  datePlaceholder: { color: colors.muted, fontWeight: '400' },
  dateIcon: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  calculationCard: {
    flexDirection: 'row',
    gap: 9,
    padding: 13,
    borderRadius: 15,
    backgroundColor: colors.purple,
  },
  calculationItem: { flex: 1 },
  calculationLabel: { color: colors.muted, fontSize: 9, fontWeight: '700' },
  calculationValue: {
    marginTop: 3,
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },
  calculationDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  choiceRow: { flexDirection: 'row', gap: 10 },
  choice: {
    flex: 1,
    minHeight: 67,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  choiceActive: { borderColor: colors.primary, backgroundColor: colors.pink },
  choiceIcon: { color: colors.primaryDark, fontSize: 18, fontWeight: '900' },
  choiceLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  choiceLabelActive: { color: colors.primaryDark },
  consentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  consentCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8FB',
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: { color: 'white', fontSize: 13, fontWeight: '900' },
  consentCopy: { flex: 1, gap: 4 },
  consentTitle: { color: colors.text, fontSize: 12, fontWeight: '800' },
  consentText: { color: colors.muted, fontSize: 10, lineHeight: 16 },
  helperNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.blue,
  },
  helperIcon: { color: colors.primaryDark, fontSize: 16, fontWeight: '900' },
  helperText: { flex: 1, color: colors.muted, fontSize: 9, lineHeight: 14 },
});

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
  iconText: { color: colors.primaryDark, fontSize: 14, fontWeight: '900' },
  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  title: { color: colors.text, fontSize: 27, fontWeight: '900' },
  hint: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  section: {
    gap: 13,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeading: { gap: 2 },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  sectionHint: { color: colors.muted, fontSize: 9 },
});
