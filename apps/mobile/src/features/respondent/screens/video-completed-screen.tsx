import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Loading, Notice, Screen } from '@/components/ui';
import { api } from '@/services/api';
import { formatDateTime } from '../lib/format';
import {
  CompletionState,
  completionStyles as s,
} from '../components/completion-state';

export function VideoCompletedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useQuery({
    queryKey: ['video', id],
    queryFn: () => api<any>(`/videos/${id}`),
  });

  if (query.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (query.error)
    return (
      <Screen>
        <Notice
          action={<Button onPress={() => query.refetch()}>Coba lagi</Button>}
        >
          {query.error.message}
        </Notice>
      </Screen>
    );

  const progress = query.data?.progress;
  const isLastVideo = query.data?.is_last_video ?? false;
  const waitingPosttest = progress?.status === 'waiting_posttest';
  const available = progress?.available_at;

  return (
    <CompletionState
      eyebrow="VIDEO SELESAI"
      icon={
        <MaterialCommunityIcons
          accessible={false}
          color="white"
          name="heart-circle-outline"
          size={48}
        />
      }
      title="Hebat, Ibu sudah menonton!"
      description={
        isLastVideo && waitingPosttest
          ? 'Materi telah ditonton sampai selesai. Beri waktu untuk memahami informasi yang baru dipelajari.'
          : 'Materi ini sudah selesai. Ibu dapat melanjutkan ke pertemuan berikutnya dari beranda.'
      }
      detail={
        isLastVideo && waitingPosttest ? (
          <View style={s.detailHeading}>
            <Text style={s.detailLabel}>POSTTEST TERSEDIA</Text>
            <Text style={s.detailValue}>
              {available ? formatDateTime(available) : 'Sedang dijadwalkan'}
            </Text>
            <Text style={s.detailHint}>
              Kami akan mengingatkan Ibu saat waktunya tiba.
            </Text>
          </View>
        ) : (
          <View style={s.detailHeading}>
            <Text style={s.detailLabel}>MATERI BERIKUTNYA</Text>
            <Text style={s.detailValue}>Sudah terbuka di beranda</Text>
            <Text style={s.detailHint}>
              Lanjutkan dengan pretest pada pertemuan berikutnya.
            </Text>
          </View>
        )
      }
      note={
        isLastVideo && waitingPosttest
          ? 'Posttest akan tersedia setelah waktu tunggu singkat.'
          : 'Setiap pertemuan membantu Ibu mengenali tanda bahaya lebih dini.'
      }
      actionLabel="Kembali ke Beranda"
      onAction={() => router.replace('/respondent/dashboard' as never)}
    />
  );
}
