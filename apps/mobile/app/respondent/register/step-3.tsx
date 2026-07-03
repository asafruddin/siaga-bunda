import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { registrationSchema } from '@siaga/shared';
import { Button, Field, Screen, Title, ui } from '@/components/ui';
import { useRegistration } from '@/features/registration/store';
import { post } from '@/services/api';
import { useSession } from '@/services/session';
import { getPushToken } from '@/services/notifications';
export default function Step3() {
  const d = useRegistration();
  const [support, setSupport] = useState(d.husbandSupport ?? true);
  const [complication, setComplication] = useState(
    d.pregnancyComplicationHistory ?? '',
  );
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit() {
    try {
      setBusy(true);
      const expoPushToken = await getPushToken().catch(() => undefined);
      const payload = {
        ...d,
        husbandSupport: support,
        pregnancyComplicationHistory: complication,
        consentAccepted: consent,
        expoPushToken,
      };
      const parsed = registrationSchema.safeParse(payload);
      if (!parsed.success)
        throw new Error('Periksa kembali semua data pendaftaran.');
      const result = await post<{ token: string; role: 'respondent' }>(
        '/respondents/register',
        parsed.data,
      );
      await useSession.getState().signIn(result.token, result.role);
      d.reset();
      router.replace('/respondent/dashboard' as never);
    } catch (e) {
      Alert.alert(
        'Pendaftaran gagal',
        e instanceof Error ? e.message : 'Silakan coba lagi.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <Title subtitle="Langkah 3 dari 3">Data Pendukung & Persetujuan</Title>
      <Text style={ui.label}>Dukungan suami/keluarga</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button
          variant={support ? 'primary' : 'secondary'}
          onPress={() => setSupport(true)}
        >
          Ada
        </Button>
        <Button
          variant={!support ? 'primary' : 'secondary'}
          onPress={() => setSupport(false)}
        >
          Tidak ada
        </Button>
      </View>
      <Field
        label="Riwayat komplikasi kehamilan"
        value={complication}
        onChangeText={setComplication}
        multiline
        placeholder="Tidak ada"
      />
      <Pressable
        onPress={() => setConsent((v) => !v)}
        style={[ui.card, { flexDirection: 'row', alignItems: 'flex-start' }]}
      >
        <Text style={{ fontSize: 24 }}>{consent ? '☑' : '☐'}</Text>
        <Text style={[ui.muted, { flex: 1 }]}>
          Saya menyetujui proses pengumpulan dan pemrosesan data pribadi untuk
          keperluan edukasi dan penelitian sesuai ketentuan yang berlaku.
        </Text>
      </Pressable>
      <Button disabled={busy || !consent} onPress={submit}>
        {busy ? 'Mendaftarkan…' : 'Setuju dan Daftar'}
      </Button>
    </Screen>
  );
}
