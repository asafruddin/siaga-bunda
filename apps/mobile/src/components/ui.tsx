import type { PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../theme';
import {
  isNumericKeyboard,
  normalizeNumericInput,
} from '../lib/normalize-numeric-input';

export function Screen({
  children,
  scroll = true,
  showBack,
}: PropsWithChildren<{ scroll?: boolean; showBack?: boolean }>) {
  const router = useRouter();
  const canBack = showBack ?? router.canGoBack();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={s.content}>{children}</View>
  );
  return (
    <SafeAreaView style={s.safe}>
      {canBack ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [s.back, pressed && { opacity: 0.55 }]}
        >
          <View style={s.backIcon}>
            <Text style={s.backIconText}>‹</Text>
          </View>
          <Text style={s.backText}>Kembali</Text>
        </Pressable>
      ) : null}
      {body}
    </SafeAreaView>
  );
}
export function Title({
  children,
  subtitle,
}: PropsWithChildren<{ subtitle?: string }>) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.title}>{children}</Text>
      {subtitle && <Text style={s.muted}>{subtitle}</Text>}
    </View>
  );
}
export function Button({
  children,
  onPress,
  disabled,
  variant = 'primary',
}: PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}>) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        variant !== 'primary' && s.secondaryButton,
        variant === 'danger' && { borderColor: colors.danger },
        (pressed || disabled) && { opacity: 0.55 },
      ]}
    >
      <Text
        style={[
          s.buttonText,
          variant !== 'primary' && {
            color: variant === 'danger' ? colors.danger : colors.primaryDark,
          },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  error,
  onChangeText,
  keyboardType,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const handleChangeText = (text: string) => {
    if (!onChangeText) return;
    onChangeText(
      isNumericKeyboard(keyboardType) ? normalizeNumericInput(text) : text,
    );
  };

  return (
    <View style={{ gap: 5 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[s.input, error && { borderColor: colors.danger }]}
        {...props}
        keyboardType={keyboardType}
        onChangeText={handleChangeText}
      />
      {error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}
export function Card({
  children,
  onPress,
}: PropsWithChildren<{ onPress?: () => void }>) {
  const content = <View style={s.card}>{children}</View>;
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}
export function Progress({ value }: { value: number }) {
  return (
    <View
      accessibilityLabel={`Progres ${Math.round(value)} persen`}
      style={s.track}
    >
      <View
        style={[s.fill, { width: `${Math.min(100, Math.max(0, value))}%` }]}
      />
    </View>
  );
}
export function Badge({
  children,
  tone = 'neutral',
}: PropsWithChildren<{ tone?: 'neutral' | 'success' | 'warning' | 'danger' }>) {
  const bg =
    tone === 'success'
      ? '#DDF4E8'
      : tone === 'warning'
        ? '#FFF1C7'
        : tone === 'danger'
          ? '#FDE3E1'
          : colors.purple;
  return <Text style={[s.badge, { backgroundColor: bg }]}>{children}</Text>;
}
export function Loading() {
  return (
    <View style={s.center}>
      <ActivityIndicator color={colors.primary} />
      <Text style={s.muted}>Memuat…</Text>
    </View>
  );
}
export function Notice({
  children,
  action,
}: PropsWithChildren<{ action?: ReactNode }>) {
  return (
    <Card>
      <Text style={s.muted}>{children}</Text>
      {action}
    </Card>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 6,
  },
  backIcon: {
    width: 29,
    height: 29,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
  },
  backIconText: {
    marginTop: -2,
    color: colors.primaryDark,
    fontSize: 25,
    lineHeight: 26,
  },
  backText: { fontSize: 14, fontWeight: '800', color: colors.primaryDark },
  content: { padding: 20, paddingBottom: 36, gap: 16, flexGrow: 1 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  muted: { fontSize: 15, lineHeight: 22, color: colors.muted },
  label: { fontSize: 14, fontWeight: '700', color: colors.text },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.text,
  },
  error: { color: colors.danger, fontSize: 12 },
  button: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: { color: 'white', fontWeight: '800', fontSize: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  track: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#EEE8EB',
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 8 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
export const ui = s;
