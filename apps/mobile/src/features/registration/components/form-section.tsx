import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

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

const styles = StyleSheet.create({
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
