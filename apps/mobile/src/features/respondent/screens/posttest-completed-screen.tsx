import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { colors } from '@/theme';
import {
  CompletionState,
  completionStyles as s,
} from '../components/completion-state';

export function PosttestCompletedScreen() {
  return (
    <CompletionState
      eyebrow="MATERI SELESAI"
      icon={
        <Ionicons
          accessible={false}
          color="white"
          name="checkmark-circle"
          size={48}
        />
      }
      title="Posttest berhasil dikirim"
      description="Terima kasih, Bu. Seluruh rangkaian edukasi SiAGA Bunda telah selesai dan progres Ibu telah tersimpan."
      detail={
        <View style={s.unlockRow}>
          <View style={s.unlockIcon}>
            <MaterialCommunityIcons
              accessible={false}
              color={colors.success}
              name="check-decagram"
              size={21}
            />
          </View>
          <View style={s.unlockCopy}>
            <Text style={s.unlockTitle}>Program edukasi selesai</Text>
            <Text style={s.unlockText}>
              Ibu telah menyelesaikan ketujuh materi dan evaluasi akhir.
            </Text>
          </View>
        </View>
      }
      note="Terus jaga kesehatan kehamilan dan segera cari pertolongan bila muncul tanda bahaya."
      actionLabel="Kembali ke Beranda"
      onAction={() => router.replace('/respondent/dashboard' as never)}
      success
    />
  );
}
