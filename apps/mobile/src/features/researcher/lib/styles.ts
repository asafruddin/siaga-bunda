import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const researcherStyles = StyleSheet.create({
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  score: { fontSize: 34, fontWeight: '900', color: colors.primary },
  timeline: { flexDirection: 'row', gap: 12 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 5,
  },
  improvement: { fontSize: 18, fontWeight: '900' },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  choice: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  choiceActive: { borderColor: colors.primary, backgroundColor: colors.pink },
});
