import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Field,
  Loading,
  Notice,
  Progress,
  Screen,
} from '@/components/ui';
import { colors } from '@/theme';
import { api } from '@/services/api';
import { formatDate } from '../lib/format';
import { statusLabel } from '../lib/status-label';
import { researcherStyles as s } from '../lib/styles';

const filters = [
  { value: '', label: 'Semua' },
  { value: 'pretest_required', label: 'Pretest' },
  { value: 'video_in_progress', label: 'Menonton' },
  { value: 'waiting_posttest', label: 'Menunggu' },
  { value: 'posttest_available', label: 'Posttest' },
  { value: 'completed', label: 'Selesai' },
];

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

  const submitSearch = () => {
    setPage(1);
    setSubmitted(search.trim());
  };
  const hasFilters = Boolean(submitted || status);

  return (
    <Screen>
      <View style={s.pageHeading}>
        <View style={s.pageEyebrowRow}>
          <View style={s.pageIconBox}>
            <Text style={s.pageIconText}>●●</Text>
          </View>
          <Text style={s.pageEyebrow}>DATA PENELITIAN</Text>
        </View>
        <Text style={s.pageTitle}>Responden</Text>
        <Text style={s.pageSubtitle}>
          Temukan responden dan pantau perjalanan edukasinya.
        </Text>
      </View>

      <View style={s.searchPanel}>
        <Field
          label="Cari responden"
          value={search}
          onChangeText={setSearch}
          placeholder="Masukkan nama responden"
          returnKeyType="search"
          onSubmitEditing={submitSearch}
        />
        <Button onPress={submitSearch}>Cari responden</Button>
      </View>

      <View style={s.filterHeading}>
        <Text style={s.sectionLabel}>Filter status</Text>
        {hasFilters ? (
          <Pressable
            onPress={() => {
              setSearch('');
              setSubmitted('');
              setStatus('');
              setPage(1);
            }}
          >
            <Text style={s.clearFilterText}>Atur ulang</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={s.filterWrap}>
        {filters.map((filter) => (
          <Pressable
            accessibilityRole="button"
            key={filter.value}
            onPress={() => {
              setPage(1);
              setStatus(filter.value);
            }}
            style={({ pressed }) => [
              s.filterChip,
              status === filter.value && s.filterChipActive,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text
              style={[
                s.filterChipText,
                status === filter.value && s.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error.message}
        </Notice>
      ) : q.data?.items?.length ? (
        <>
          <View style={s.listHeading}>
            <View>
              <Text style={s.sectionTitle}>Daftar responden</Text>
              <Text style={s.sectionHint}>
                Menampilkan {q.data.items.length} dari {q.data.total} responden
              </Text>
            </View>
            <View style={s.countPill}>
              <Text style={s.countPillText}>{q.data.total}</Text>
            </View>
          </View>

          <View style={s.respondentList}>
            {q.data.items.map((respondent: any, index: number) => {
              const progress = Number(respondent.progress_percentage ?? 0);
              const initials = String(respondent.name)
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('');
              const tone =
                respondent.current_status === 'completed'
                  ? 'success'
                  : respondent.current_status === 'waiting_posttest'
                    ? 'warning'
                    : 'neutral';
              return (
                <Pressable
                  accessibilityRole="button"
                  key={respondent.id}
                  onPress={() =>
                    router.push(
                      `/researcher/respondents/${respondent.id}` as never,
                    )
                  }
                  style={({ pressed }) => [
                    s.respondentRow,
                    index < q.data.items.length - 1 && s.listRowBorder,
                    pressed && { opacity: 0.58 },
                  ]}
                >
                  <View style={s.respondentAvatar}>
                    <Text style={s.respondentAvatarText}>
                      {initials || 'IB'}
                    </Text>
                  </View>
                  <View style={s.respondentContent}>
                    <View style={s.respondentNameRow}>
                      <Text style={s.respondentName} numberOfLines={1}>
                        {respondent.name}
                      </Text>
                      <Text style={s.respondentProgressText}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                    <Text style={s.respondentMeta}>
                      {respondent.age} tahun • HPL {formatDate(respondent.hpl)}
                    </Text>
                    <View style={s.respondentStatusRow}>
                      <Badge tone={tone}>
                        {statusLabel(respondent.current_status)}
                      </Badge>
                      <Text style={s.videoCountText}>
                        {respondent.completed_videos}/7 video
                      </Text>
                    </View>
                    <Progress value={progress} />
                  </View>
                  <Text style={s.rowChevron}>›</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={s.paginationCard}>
            <Pressable
              accessibilityRole="button"
              disabled={page <= 1}
              onPress={() => setPage((current) => current - 1)}
              style={({ pressed }) => [
                s.paginationButton,
                page <= 1 && s.paginationDisabled,
                pressed && { opacity: 0.55 },
              ]}
            >
              <Text style={s.paginationButtonText}>‹</Text>
            </Pressable>
            <View style={s.paginationLabel}>
              <Text style={s.paginationCurrent}>Halaman {page}</Text>
              <Text style={s.paginationTotal}>
                dari {q.data.totalPages ?? 1}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={page >= (q.data.totalPages ?? 1)}
              onPress={() => setPage((current) => current + 1)}
              style={({ pressed }) => [
                s.paginationButton,
                page >= (q.data.totalPages ?? 1) && s.paginationDisabled,
                pressed && { opacity: 0.55 },
              ]}
            >
              <Text style={s.paginationButtonText}>›</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={s.emptyState}>
          <View style={[s.emptyStateIcon, { backgroundColor: colors.purple }]}>
            <Text style={s.emptyStateIconText}>⌕</Text>
          </View>
          <Text style={s.emptyStateTitle}>Responden tidak ditemukan</Text>
          <Text style={s.emptyStateText}>
            Coba gunakan nama lain atau ubah filter status yang dipilih.
          </Text>
          {hasFilters ? (
            <Button
              variant="secondary"
              onPress={() => {
                setSearch('');
                setSubmitted('');
                setStatus('');
                setPage(1);
              }}
            >
              Hapus filter
            </Button>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
