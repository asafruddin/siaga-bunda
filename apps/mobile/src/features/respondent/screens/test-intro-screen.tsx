import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Notice, Screen, Title, ui } from '@/components/ui';
import { respondentStyles as s } from '../lib/styles';

export function TestIntroScreen({ type }: { type: 'pretest' | 'posttest' }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <Title
        subtitle={
          type === 'pretest'
            ? 'Jawab 10 pertanyaan sebelum menonton video.'
            : 'Jawab 10 pertanyaan untuk menyelesaikan materi ini.'
        }
      >
        {type === 'pretest' ? 'Pretest' : 'Posttest'}
      </Title>
      <Card>
        <Text style={s.icon}>✓</Text>
        <Text style={s.cardTitle}>Petunjuk</Text>
        <Text style={ui.muted}>
          Pilih satu jawaban untuk setiap pertanyaan. Nilai dihitung oleh sistem
          setelah semua jawaban dikirim.
        </Text>
      </Card>
      <Notice>
        {type === 'posttest'
          ? 'Posttest hanya dapat dibuka sesuai jadwal tujuh hari setelah video selesai.'
          : 'Video akan terbuka setelah pretest dikirim.'}
      </Notice>
      <Button
        onPress={() => router.push(`/respondent/videos/${id}/${type}` as never)}
      >
        Mulai {type}
      </Button>
    </Screen>
  );
}
