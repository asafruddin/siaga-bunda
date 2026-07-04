import { useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { calculateHpl, calculatePregnancyWeeks } from '@siaga/shared';
import { Button, Field, Screen } from '@/components/ui';
import {
  FormSection,
  RegistrationHeader,
  registrationStyles as s,
} from '@/features/registration/ui';
import { useRegistration } from '@/features/registration/store';

const displayDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
    new Date(`${value}T00:00:00`),
  );

export default function Step2() {
  const draft = useRegistration();
  const [hpht, setHpht] = useState(draft.hpht ?? '');
  const [show, setShow] = useState(false);
  const [children, setChildren] = useState(String(draft.numberOfChildren ?? 0));
  const [medical, setMedical] = useState(draft.medicalHistory ?? '');
  const [birth, setBirth] = useState(draft.birthHistory ?? '');
  const hpl = hpht ? calculateHpl(hpht) : '';
  const weeks = hpht ? calculatePregnancyWeeks(hpht) : 0;

  function next() {
    if (!hpht || weeks > 45)
      return Alert.alert(
        'HPHT tidak valid',
        'Pilih tanggal hari pertama haid terakhir yang sesuai.',
      );
    draft.set({
      hpht,
      hpl,
      pregnancyAgeWeeks: weeks,
      numberOfChildren: Number(children),
      medicalHistory: medical.trim() || 'Tidak ada',
      birthHistory: birth.trim() || 'Tidak ada',
    });
    router.push('/respondent/register/step-3' as never);
  }

  return (
    <Screen>
      <RegistrationHeader step={2} />
      <FormSection
        title="Perkiraan kehamilan"
        hint="HPL dan usia kehamilan dihitung otomatis dari HPHT"
      >
        <Text style={{ fontSize: 13, fontWeight: '700' }}>
          Hari pertama haid terakhir (HPHT)
        </Text>
        <Pressable
          accessibilityRole="button"
          style={s.dateButton}
          onPress={() => setShow(true)}
        >
          <Text style={[s.dateText, !hpht && s.datePlaceholder]}>
            {hpht ? displayDate(hpht) : 'Pilih tanggal HPHT'}
          </Text>
          <Text style={s.dateIcon}>◷</Text>
        </Pressable>
        {show ? (
          <DateTimePicker
            value={hpht ? new Date(`${hpht}T00:00:00`) : new Date()}
            maximumDate={new Date()}
            mode="date"
            onChange={(_, date) => {
              if (Platform.OS !== 'ios') setShow(false);
              if (date) setHpht(date.toISOString().slice(0, 10));
            }}
          />
        ) : null}
        <View style={s.calculationCard}>
          <View style={s.calculationItem}>
            <Text style={s.calculationLabel}>HARI PERKIRAAN LAHIR</Text>
            <Text style={s.calculationValue}>
              {hpl ? displayDate(hpl) : '—'}
            </Text>
          </View>
          <View style={s.calculationDivider} />
          <View style={s.calculationItem}>
            <Text style={s.calculationLabel}>USIA KEHAMILAN</Text>
            <Text style={s.calculationValue}>
              {hpht ? `${weeks} minggu` : '—'}
            </Text>
          </View>
        </View>
      </FormSection>

      <FormSection
        title="Riwayat kehamilan"
        hint="Isi 0 bila belum memiliki anak"
      >
        <Field
          label="Jumlah anak"
          value={children}
          onChangeText={setChildren}
          keyboardType="number-pad"
        />
        <Field
          label="Riwayat kesehatan"
          value={medical}
          onChangeText={setMedical}
          placeholder="Contoh: Hipertensi, diabetes, atau Tidak ada"
          multiline
        />
        <Field
          label="Riwayat persalinan"
          value={birth}
          onChangeText={setBirth}
          placeholder="Ceritakan secara singkat atau tulis Tidak ada"
          multiline
        />
      </FormSection>

      <View style={s.helperNote}>
        <Text style={s.helperIcon}>⌾</Text>
        <Text style={s.helperText}>
          Data kehamilan membantu aplikasi menampilkan informasi yang lebih
          relevan. Perhitungan ini bukan pengganti pemeriksaan tenaga kesehatan.
        </Text>
      </View>
      <Button onPress={next}>Lanjut ke Persetujuan</Button>
    </Screen>
  );
}
