import { Text, View } from 'react-native';
import { colors } from '@/theme';
import { StyleSheet } from 'react-native';

export function SectionTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 2, marginTop: 6 },
  title: { color: colors.text, fontSize: 21, fontWeight: '900' },
  hint: { color: colors.muted, fontSize: 13 },
});
