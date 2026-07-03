import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Button, Loading, Notice, Screen } from '@/components/ui';
import { colors } from '@/theme';
import { api } from '@/services/api';
import { researcherStyles as s } from '../lib/styles';

export function ResultsScreen({ type }: { type: 'pretest' | 'posttest' }) {
  const q = useQuery({
    queryKey: ['results', type],
    queryFn: () => api<any[]>(`/researcher/results/${type}`),
  });
  const results = q.data ?? [];
  const submissions = results.reduce(
    (total, result) => total + Number(result.respondent_count ?? 0),
    0,
  );
  const overallAverage = submissions
    ? results.reduce(
        (total, result) =>
          total +
          Number(result.average_score ?? 0) *
            Number(result.respondent_count ?? 0),
        0,
      ) / submissions
    : 0;
  const isPretest = type === 'pretest';

  return (
    <Screen>
      <View style={s.pageHeading}>
        <View style={s.pageEyebrowRow}>
          <View
            style={[
              s.pageIconBox,
              { backgroundColor: isPretest ? colors.purple : '#E2F2E9' },
            ]}
          >
            <Text style={s.pageIconText}>{isPretest ? 'A' : '✓'}</Text>
          </View>
          <Text style={s.pageEyebrow}>HASIL EVALUASI</Text>
        </View>
        <Text style={s.pageTitle}>
          Hasil {isPretest ? 'Pretest' : 'Posttest'}
        </Text>
        <Text style={s.pageSubtitle}>
          {isPretest
            ? 'Ringkasan pengetahuan awal responden sebelum edukasi.'
            : 'Ringkasan pemahaman responden setelah menyelesaikan edukasi.'}
        </Text>
      </View>

      {!q.isLoading && !q.error && results.length ? (
        <View
          style={[s.resultHero, !isPretest && { backgroundColor: '#245E49' }]}
        >
          <View>
            <Text style={s.resultHeroEyebrow}>RATA-RATA KESELURUHAN</Text>
            <View style={s.resultHeroScoreRow}>
              <Text style={s.resultHeroScore}>
                {Math.round(overallAverage)}
              </Text>
              <Text style={s.resultHeroScale}>/100</Text>
            </View>
            <Text style={s.resultHeroHint}>
              Berdasarkan {submissions} pengumpulan jawaban
            </Text>
          </View>
          <View style={s.resultHeroBadge}>
            <Text style={s.resultHeroBadgeValue}>{results.length}</Text>
            <Text style={s.resultHeroBadgeLabel}>materi</Text>
          </View>
        </View>
      ) : null}

      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error.message}
        </Notice>
      ) : results.length ? (
        <>
          <View style={s.listHeading}>
            <View>
              <Text style={s.sectionTitle}>Nilai per video</Text>
              <Text style={s.sectionHint}>Skala nilai 0 sampai 100</Text>
            </View>
          </View>
          {results.map((result) => {
            const average = Number(result.average_score ?? 0);
            return (
              <View key={result.video_id} style={s.resultCard}>
                <View style={s.resultCardHeader}>
                  <View style={s.resultVideoNumber}>
                    <Text style={s.resultVideoNumberText}>
                      {result.sequence_number}
                    </Text>
                  </View>
                  <View style={s.resultTitleWrap}>
                    <Text style={s.resultTitle} numberOfLines={2}>
                      {result.title}
                    </Text>
                    <Text style={s.resultSubtitle}>
                      Video {result.sequence_number}
                    </Text>
                  </View>
                  <View
                    style={[
                      s.scoreBadge,
                      {
                        backgroundColor: isPretest ? colors.purple : '#E2F2E9',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.scoreBadgeValue,
                        !isPretest && { color: colors.success },
                      ]}
                    >
                      {average.toFixed(average % 1 ? 1 : 0)}
                    </Text>
                    <Text style={s.scoreBadgeLabel}>rata-rata</Text>
                  </View>
                </View>
                <View style={s.scoreProgressTrack}>
                  <View
                    style={[
                      s.scoreProgressFill,
                      {
                        width: `${Math.min(100, Math.max(0, average))}%`,
                        backgroundColor: isPretest
                          ? colors.primary
                          : colors.success,
                      },
                    ]}
                  />
                </View>
                <View style={s.scoreStatsRow}>
                  <ScoreStat
                    label="Terendah"
                    value={result.lowest_score ?? 0}
                  />
                  <View style={s.scoreStatDivider} />
                  <ScoreStat
                    label="Tertinggi"
                    value={result.highest_score ?? 0}
                  />
                  <View style={s.scoreStatDivider} />
                  <ScoreStat
                    label="Responden"
                    value={result.respondent_count ?? 0}
                  />
                </View>
              </View>
            );
          })}
        </>
      ) : (
        <View style={s.emptyState}>
          <View
            style={[
              s.emptyStateIcon,
              { backgroundColor: isPretest ? colors.purple : '#E2F2E9' },
            ]}
          >
            <Text style={s.emptyStateIconText}>{isPretest ? 'A' : '✓'}</Text>
          </View>
          <Text style={s.emptyStateTitle}>Belum ada hasil {type}</Text>
          <Text style={s.emptyStateText}>
            Nilai akan ditampilkan setelah responden mengirim jawaban.
          </Text>
        </View>
      )}
    </Screen>
  );
}

function ScoreStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={s.scoreStat}>
      <Text style={s.scoreStatValue}>{value}</Text>
      <Text style={s.scoreStatLabel}>{label}</Text>
    </View>
  );
}
