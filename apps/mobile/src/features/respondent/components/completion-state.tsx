import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Screen } from '@/components/ui';
import { colors } from '@/theme';

export function CompletionState({
  eyebrow,
  icon,
  title,
  description,
  detail,
  note,
  actionLabel,
  onAction,
  success = false,
}: {
  eyebrow: string;
  icon: ReactNode;
  title: string;
  description: string;
  detail?: ReactNode;
  note: string;
  actionLabel: string;
  onAction: () => void;
  success?: boolean;
}) {
  return (
    <Screen>
      <View style={styles.heading}>
        <View
          style={[
            styles.eyebrowPill,
            success && { backgroundColor: '#E2F2E9' },
          ]}
        >
          <Text
            style={[styles.eyebrowText, success && { color: colors.success }]}
          >
            {eyebrow}
          </Text>
        </View>
      </View>
      <View style={[styles.hero, success && { backgroundColor: '#245E49' }]}>
        <View style={styles.ringLarge} />
        <View style={styles.ringSmall} />
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {detail ? <View style={styles.detailCard}>{detail}</View> : null}
      <View style={styles.note}>
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="information-outline"
          size={18}
        />
        <Text style={styles.noteText}>{note}</Text>
      </View>
      <Button onPress={onAction}>{actionLabel}</Button>
    </Screen>
  );
}

export const completionStyles = StyleSheet.create({
  detailHeading: { alignItems: 'center', gap: 3 },
  detailLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  detailValue: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  detailHint: { color: colors.muted, fontSize: 10, textAlign: 'center' },
  unlockRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  unlockIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDF4E8',
  },
  unlockCopy: { flex: 1, gap: 2 },
  unlockTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  unlockText: { color: colors.muted, fontSize: 10, lineHeight: 15 },
});

const styles = StyleSheet.create({
  heading: { alignItems: 'center' },
  eyebrowPill: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: colors.pink,
  },
  eyebrowText: {
    color: colors.primaryDark,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  hero: {
    minHeight: 335,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
  },
  ringLarge: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  ringSmall: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  iconBox: {
    width: 78,
    height: 78,
    marginBottom: 18,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  title: {
    color: 'white',
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    maxWidth: 290,
    marginTop: 9,
    color: '#EAD9E1',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
  detailCard: {
    padding: 15,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
    borderRadius: 15,
    backgroundColor: colors.blue,
  },
  noteText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15 },
});
