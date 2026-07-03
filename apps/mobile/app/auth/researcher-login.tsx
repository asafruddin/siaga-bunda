import { useState } from 'react';
import { Alert, Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Field, Screen, Title } from '@/components/ui';
import { post } from '@/services/api';
import { useSession } from '@/services/session';
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
    } catch (e) {
      Alert.alert(
        'Tidak dapat masuk',
        e instanceof Error ? e.message : 'Periksa data Anda.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <Title subtitle="Gunakan akun yang diberikan oleh pengelola penelitian.">
        Masuk Peneliti
      </Title>
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Field
        label="Kata sandi"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button disabled={busy || !email || !password} onPress={submit}>
        {busy ? 'Memproses…' : 'Masuk'}
      </Button>
      <Text style={{ textAlign: 'center' }}>
        Data responden hanya dapat diakses oleh peneliti berwenang.
      </Text>
    </Screen>
  );
}
