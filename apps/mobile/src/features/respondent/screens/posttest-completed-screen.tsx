import { Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Screen, Title, ui } from '@/components/ui';
import { respondentStyles as s } from '../lib/styles';

export function PosttestCompletedScreen() {
  return (
    <Screen>
      <Title>Materi Selesai</Title>
      <Card>
        <Text style={s.icon}>✓</Text>
        <Text style={[s.cardTitle, { textAlign: 'center' }]}>
          Posttest berhasil dikirim.
        </Text>
        <Text style={[ui.muted, { textAlign: 'center' }]}>
          Materi berikutnya kini sudah terbuka. Hebat, lanjutkan sesuai waktu
          Ibu.
        </Text>
      </Card>
      <Button onPress={() => router.replace('/respondent/dashboard' as never)}>
        Lihat Materi Berikutnya
      </Button>
    </Screen>
  );
}
