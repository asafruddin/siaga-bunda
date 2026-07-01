import { Text, View } from 'react-native';
import { AppShell } from '@/components/AppShell';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export default function PublicIndexScreen() {
  return (
    <AppShell>
      <View accessible accessibilityLabel="SiAGA Bunda">
        <Text accessibilityRole="header" style={typography.headline}>
          SiAGA Bunda
        </Text>
        <Text style={[typography.body, { color: colors.inkSecondary, marginTop: spacing[2] }]}>
          Aplikasi sedang disiapkan.
        </Text>
      </View>
      <View
        accessibilityRole="summary"
        style={{
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.outlineSubtle,
          borderRadius: radii.lg,
          borderWidth: 1,
          marginTop: spacing[5],
          padding: spacing[4],
        }}
      >
        <Text style={typography.bodyStrong}>Status pengembangan</Text>
        <Text style={[typography.body, { color: colors.inkSecondary, marginTop: spacing[2] }]}>
          Fitur peserta dan peneliti belum tersedia.
        </Text>
      </View>
    </AppShell>
  );
}
