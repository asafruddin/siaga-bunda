import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  CompletionState,
  completionStyles as s,
} from '../components/completion-state';

export function PosttestCompletedScreen() {
  return (
    <CompletionState
      eyebrow="MATERI SELESAI"
      icon="✓"
      title="Posttest berhasil dikirim"
      description="Terima kasih sudah menyelesaikan seluruh rangkaian materi ini, Bu. Progres Ibu telah tersimpan."
      detail={
        <View style={s.unlockRow}>
          <View style={s.unlockIcon}>
            <Text style={s.unlockIconText}>⌑</Text>
          </View>
          <View style={s.unlockCopy}>
            <Text style={s.unlockTitle}>Materi berikutnya terbuka</Text>
            <Text style={s.unlockText}>
              Ibu dapat melanjutkan belajar dari halaman beranda.
            </Text>
          </View>
        </View>
      }
      note="Lanjutkan sesuai waktu dan kenyamanan Ibu. Setiap langkah kecil membantu menjaga ibu dan bayi."
      actionLabel="Lihat Materi Berikutnya"
      onAction={() => router.replace('/respondent/dashboard' as never)}
      success
    />
  );
}
