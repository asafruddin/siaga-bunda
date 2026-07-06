import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { colors } from '../theme';
import {
  isNumericKeyboard,
  normalizeNumericInput,
} from '../lib/normalize-numeric-input';

type FormScrollContextValue = {
  scrollToFocusedInput: (target: View) => void;
};

const FormScrollContext = createContext<FormScrollContextValue | null>(null);

function useKeyboardInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setInset(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return inset;
}

export function Screen({
  children,
  scroll = true,
  showBack,
  refreshing,
  onRefresh,
}: PropsWithChildren<{
  scroll?: boolean;
  showBack?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}>) {
  const router = useRouter();
  const canBack = showBack ?? router.canGoBack();
  const keyboardInset = useKeyboardInset();
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);

  const scrollToFocusedInput = useCallback((target: View) => {
    const scrollView = scrollRef.current;
    const content = contentRef.current;
    if (!scrollView || !content) return;

    target.measureLayout(
      content,
      (_left, top, _width, height) => {
        scrollView.scrollTo({
          y: Math.max(0, top + height - 220),
          animated: true,
        });
      },
      () => {},
    );
  }, []);

  const contentStyle = [
    s.content,
    keyboardInset > 0 && { paddingBottom: 36 + keyboardInset },
  ];

  const body = scroll ? (
    <FormScrollContext.Provider value={{ scrollToFocusedInput }}>
      <ScrollView
        ref={scrollRef}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        contentContainerStyle={contentStyle}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              colors={[colors.primary]}
              onRefresh={onRefresh}
              refreshing={refreshing ?? false}
              tintColor={colors.primary}
            />
          ) : undefined
        }
      >
        <View ref={contentRef} style={s.contentInner}>
          {children}
        </View>
      </ScrollView>
    </FormScrollContext.Provider>
  ) : (
    <View style={contentStyle}>{children}</View>
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
            <Ionicons
              accessible={false}
              color={colors.primaryDark}
              name="chevron-back"
              size={19}
            />
          </View>
          <Text style={s.backText}>Kembali</Text>
        </Pressable>
      ) : null}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.keyboard}
      >
        {body}
      </KeyboardAvoidingView>
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
  onFocus,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const formScroll = useContext(FormScrollContext);
  const fieldRef = useRef<View>(null);

  const handleChangeText = (text: string) => {
    if (!onChangeText) return;
    onChangeText(
      isNumericKeyboard(keyboardType) ? normalizeNumericInput(text) : text,
    );
  };

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    onFocus?.(event);
    const target = fieldRef.current;
    if (!target || !formScroll) return;
    setTimeout(() => formScroll.scrollToFocusedInput(target), 100);
  };

  return (
    <View ref={fieldRef} style={{ gap: 5 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[s.input, error && { borderColor: colors.danger }]}
        {...props}
        keyboardType={keyboardType}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
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
  keyboard: { flex: 1 },
  contentInner: { gap: 16 },
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
  backText: { fontSize: 14, fontWeight: '800', color: colors.primaryDark },
  content: { padding: 20, paddingBottom: 36, flexGrow: 1 },
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
