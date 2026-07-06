import { useState } from 'react';
import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Field, Screen } from '@/components/ui';
import { useRegistration } from '@/features/registration/store';
import { FormSection } from '../components/form-section';
import { RegistrationHeader } from '../components/registration-header';
import { registrationStyles as s } from '../lib/styles';

export function RegistrationStep1() {
  const draft = useRegistration();
  const [name, setName] = useState(draft.name ?? '');
  const [age, setAge] = useState(String(draft.age ?? ''));
  const [phone, setPhone] = useState(draft.phoneNumber ?? '');
  const [address, setAddress] = useState(draft.address ?? '');
  const [education, setEducation] = useState(draft.education ?? '');
  const [occupation, setOccupation] = useState(draft.occupation ?? '');

  function next() {
    if (
      name.trim().length < 2 ||
      !Number(age) ||
      phone.replace(/\D/g, '').length < 9 ||
      address.trim().length < 5 ||
      !education.trim() ||
      !occupation.trim()
    )
      return Alert.alert(
        'Data belum lengkap',
        'Isi seluruh data identitas dengan benar.',
      );
    draft.set({
      name: name.trim(),
      age: Number(age),
      phoneNumber: phone,
      address: address.trim(),
      education: education.trim(),
      occupation: occupation.trim(),
    });
    router.push('/respondent/register/step-2' as never);
  }

  return (
    <Screen>
      <RegistrationHeader step={1} />
      <FormSection
        title="Data diri"
        hint="Pastikan informasi sesuai identitas Ibu"
      >
        <Field
          label="Nama lengkap"
          value={name}
          onChangeText={setName}
          placeholder="Contoh: Mona Lestari"
          autoCapitalize="words"
        />
        <View style={s.twoColumns}>
          <View style={s.column}>
            <Field
              label="Usia"
              value={age}
              onChangeText={setAge}
              placeholder="24"
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1.6 }}>
            <Field
              label="Nomor telepon"
              value={phone}
              onChangeText={setPhone}
              placeholder="08xxxxxxxxxx"
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <Field
          label="Alamat tempat tinggal"
          value={address}
          onChangeText={setAddress}
          placeholder="Kota/kabupaten dan alamat"
          multiline
        />
      </FormSection>
      <FormSection
        title="Latar belakang"
        hint="Informasi pendidikan dan pekerjaan"
      >
        <Field
          label="Pendidikan terakhir"
          value={education}
          onChangeText={setEducation}
          placeholder="Contoh: SMA, D3, S1"
        />
        <Field
          label="Pekerjaan"
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Contoh: Ibu rumah tangga"
        />
      </FormSection>
      <Button onPress={next}>Lanjut ke Data Kehamilan</Button>
    </Screen>
  );
}
