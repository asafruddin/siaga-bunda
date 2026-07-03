import { StyleSheet } from 'react-native';
import { colors } from '@/theme';

export const respondentStyles = StyleSheet.create({
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  icon: { fontSize: 58, color: colors.primary, textAlign: 'center' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: { backgroundColor: colors.pink, borderColor: colors.primary },
  optionLetter: { fontWeight: '900', color: colors.primaryDark },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#171217',
    borderRadius: 18,
  },
});
