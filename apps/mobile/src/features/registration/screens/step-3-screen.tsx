import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { registrationSchema } from '@siaga/shared';
import { Button, Field, Screen } from '@/components/ui';
import { useRegistration } from '@/features/registration/store';
import { post } from '@/services/api';
import { useSession } from '@/services/session';
import { colors } from '@/theme';
import { FormSection } from '../components/form-section';
import { RegistrationHeader } from '../components/registration-header';
import { registrationStyles as s } from '../lib/styles';

export function RegistrationStep3() {
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
            <MaterialCommunityIcons
              accessible={false}
              color={colors.primaryDark}
              name="account-check-outline"
              size={22}
            />
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
            <MaterialCommunityIcons
              accessible={false}
              color={colors.primaryDark}
              name="account-minus-outline"
              size={22}
            />
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
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="shield-lock-outline"
          size={18}
        />
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
          {consent ? (
            <Ionicons
              accessible={false}
              color="white"
              name="checkmark"
              size={16}
            />
          ) : null}
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
