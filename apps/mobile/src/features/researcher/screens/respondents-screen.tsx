import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  Field,
  Loading,
  Notice,
  Progress,
  Screen,
  Title,
  ui,
} from '@/components/ui';
import { api } from '@/services/api';
import { formatDate } from '../lib/format';
import { statusLabel } from '../lib/status-label';
import { researcherStyles as s } from '../lib/styles';

export function RespondentsScreen() {
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const q = useQuery({
    queryKey: ['respondents', submitted, status, page],
    queryFn: () =>
      api<any>(
        `/researcher/respondents?page=${page}&limit=20&search=${encodeURIComponent(submitted)}&status=${status}`,
      ),
  });
  return (
    <Screen>
      <Title subtitle="Cari dan saring progres individu.">Responden</Title>
      <Field
        label="Cari nama"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={() => {
          setPage(1);
          setSubmitted(search);
        }}
      />
      <Text style={ui.label}>Status</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {[
          ['', 'Semua'],
          ['pretest_required', 'Pretest'],
          ['waiting_posttest', 'Menunggu'],
          ['posttest_available', 'Posttest'],
          ['completed', 'Selesai'],
        ].map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => {
              setPage(1);
              setStatus(value);
            }}
            style={[s.filter, status === value && s.choiceActive]}
          >
            <Text style={ui.label}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Button
        variant="secondary"
        onPress={() => {
          setPage(1);
          setSubmitted(search);
        }}
      >
        Cari
      </Button>
      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice>{q.error.message}</Notice>
      ) : q.data?.items?.length ? (
        q.data.items.map((r: any) => (
          <Card
            key={r.id}
            onPress={() =>
              router.push(`/researcher/respondents/${r.id}` as never)
            }
          >
            <Text style={s.cardTitle}>{r.name}</Text>
            <Text style={ui.muted}>
              {r.age} tahun • HPL {formatDate(r.hpl)}
            </Text>
            <Badge>{statusLabel(r.current_status)}</Badge>
            <Progress value={Number(r.progress_percentage)} />
            <Text style={ui.muted}>
              {r.progress_percentage}% • {r.completed_videos}/7 video
            </Text>
          </Card>
        ))
      ) : (
        <Notice>Belum ada responden yang sesuai.</Notice>
      )}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Button
            variant="secondary"
            disabled={page <= 1}
            onPress={() => setPage((p) => p - 1)}
          >
            Sebelumnya
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            variant="secondary"
            disabled={page >= (q.data?.totalPages ?? 1)}
            onPress={() => setPage((p) => p + 1)}
          >
            Berikutnya
          </Button>
        </View>
      </View>
      <Text style={[ui.muted, { textAlign: 'center' }]}>
        Halaman {page} dari {q.data?.totalPages ?? 1}
      </Text>
    </Screen>
  );
}
