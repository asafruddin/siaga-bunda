import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { registrationSchema } from '@siaga/shared';
import { Button, Field, Screen } from '@/components/ui';
import {
  FormSection,
  RegistrationHeader,
  registrationStyles as s,
} from '@/features/registration/ui';
import { useRegistration } from '@/features/registration/store';
import { post } from '@/services/api';
import { useSession } from '@/services/session';

export default function Step3() {
  const draft = useRegistration();
  const [support, setSupport] = useState(draft.husbandSupport ?? true);
  const [complication, setComplication] = useState(
    draft.pregnancyComplicationHistory ?? '',
  );
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    try {
      setBusy(true);
      const payload = {
        ...draft,
        husbandSupport: support,
        pregnancyComplicationHistory: complication.trim() || 'Tidak ada',
        consentAccepted: consent,
      };
      const parsed = registrationSchema.safeParse(payload);
      if (!parsed.success)
        throw new Error('Periksa kembali semua data pendaftaran.');
      const result = await post<{ token: string; role: 'respondent' }>(
        '/respondents/register',
        parsed.data,
      );
      await useSession.getState().signIn(result.token, result.role);
      draft.reset();
      router.replace('/respondent/dashboard' as never);
    } catch (error) {
      Alert.alert(
        'Pendaftaran gagal',
        error instanceof Error ? error.message : 'Silakan coba lagi.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <RegistrationHeader step={3} />
      <FormSection
        title="Dukungan keluarga"
        hint="Apakah Ibu mendapat dukungan suami atau keluarga?"
      >
        <View style={s.choiceRow}>
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: support }}
            onPress={() => setSupport(true)}
            style={[s.choice, support && s.choiceActive]}
          >
            <Text style={s.choiceIcon}>✓</Text>
            <Text style={[s.choiceLabel, support && s.choiceLabelActive]}>
              Ada dukungan
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: !support }}
            onPress={() => setSupport(false)}
            style={[s.choice, !support && s.choiceActive]}
          >
            <Text style={s.choiceIcon}>—</Text>
            <Text style={[s.choiceLabel, !support && s.choiceLabelActive]}>
              Belum ada
            </Text>
          </Pressable>
        </View>
      </FormSection>

      <FormSection
        title="Riwayat komplikasi"
        hint="Tuliskan komplikasi pada kehamilan saat ini atau sebelumnya"
      >
        <Field
          label="Komplikasi kehamilan"
          value={complication}
          onChangeText={setComplication}
          multiline
          placeholder="Contoh: Preeklamsia atau Tidak ada"
        />
      </FormSection>

      <View style={s.helperNote}>
        <Text style={s.helperIcon}>⌾</Text>
        <Text style={s.helperText}>
          Data pribadi dan kesehatan hanya dapat diakses oleh peneliti yang
          berwenang serta digunakan sesuai kebutuhan edukasi dan penelitian.
        </Text>
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consent }}
        onPress={() => setConsent((value) => !value)}
        style={[s.consentCard, consent && s.consentCardActive]}
      >
        <View style={[s.checkbox, consent && s.checkboxActive]}>
          {consent ? <Text style={s.checkmark}>✓</Text> : null}
        </View>
        <View style={s.consentCopy}>
          <Text style={s.consentTitle}>Persetujuan penggunaan data</Text>
          <Text style={s.consentText}>
            Saya menyetujui pengumpulan dan pemrosesan data pribadi untuk
            keperluan edukasi dan penelitian sesuai ketentuan yang berlaku.
          </Text>
        </View>
      </Pressable>

      <Button disabled={busy || !consent} onPress={submit}>
        {busy ? 'Mendaftarkan Ibu…' : 'Setuju dan Mulai Belajar'}
      </Button>
    </Screen>
  );
}
