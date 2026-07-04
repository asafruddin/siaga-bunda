import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Field, Screen } from '@/components/ui';
import { post } from '@/services/api';
import { useSession } from '@/services/session';
import { colors } from '@/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    try {
      setBusy(true);
      const result = await post<{ token: string; role: 'researcher' }>(
        '/auth/login',
        { identifier: email.trim(), password },
      );
      await useSession.getState().signIn(result.token, result.role);
      router.replace('/researcher/home' as never);
    } catch (error) {
      Alert.alert(
        'Tidak dapat masuk',
        error instanceof Error ? error.message : 'Periksa data Anda.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={styles.heading}>
        <View style={styles.modePill}>
          <View style={styles.modeDot} />
          <Text style={styles.modeText}>AKSES PENELITI</Text>
        </View>
        <Text style={styles.title}>Selamat datang kembali</Text>
        <Text style={styles.subtitle}>
          Masuk untuk memantau responden dan perkembangan penelitian SiAGA
          Bunda.
        </Text>
      </View>

      <View style={styles.heroIcon}>
        <View style={styles.lockBody}>
          <Text style={styles.lockMark}>●</Text>
        </View>
        <View style={styles.lockArc} />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Masuk ke dasbor</Text>
        <Text style={styles.formHint}>
          Gunakan akun yang diberikan pengelola penelitian.
        </Text>
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="peneliti@email.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <Field
          label="Kata sandi"
          value={password}
          onChangeText={setPassword}
          placeholder="Masukkan kata sandi"
          secureTextEntry
          onSubmitEditing={submit}
          returnKeyType="done"
        />
        <Button disabled={busy || !email.trim() || !password} onPress={submit}>
          {busy ? 'Memverifikasi…' : 'Masuk sebagai Peneliti'}
        </Button>
      </View>

      <View style={styles.securityNote}>
        <Text style={styles.securityIcon}>⌾</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.securityTitle}>Akses terbatas</Text>
          <Text style={styles.securityText}>
            Data responden bersifat rahasia dan hanya dapat diakses oleh
            peneliti yang berwenang.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 8 },
  modePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: colors.purple,
  },
  modeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  modeText: {
    color: colors.primaryDark,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  title: { color: colors.text, fontSize: 29, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  heroIcon: {
    alignSelf: 'center',
    width: 92,
    height: 92,
    marginVertical: 2,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  lockBody: {
    position: 'absolute',
    bottom: 20,
    width: 43,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  lockMark: { color: colors.primaryDark, fontSize: 11 },
  lockArc: {
    position: 'absolute',
    top: 22,
    width: 29,
    height: 27,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 5,
    borderBottomWidth: 0,
    borderColor: 'white',
  },
  formCard: {
    gap: 13,
    padding: 17,
    borderRadius: 21,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  formHint: { marginTop: -7, color: colors.muted, fontSize: 10 },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 17,
    backgroundColor: colors.blue,
  },
  securityIcon: { color: colors.primaryDark, fontSize: 19, fontWeight: '900' },
  securityTitle: { color: colors.text, fontSize: 11, fontWeight: '800' },
  securityText: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 9,
    lineHeight: 14,
  },
});
