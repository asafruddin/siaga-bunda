import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

export function ResearchMetricCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string | number;
  detail: string;
  accent: string;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 116,
    padding: 13,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accent: { width: 24, height: 4, borderRadius: 99, marginBottom: 10 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  value: {
    marginTop: 2,
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
  },
  detail: { marginTop: 'auto', color: colors.muted, fontSize: 10 },
});
