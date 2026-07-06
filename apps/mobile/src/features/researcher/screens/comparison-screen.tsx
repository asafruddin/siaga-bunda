import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Feather from '@expo/vector-icons/Feather';
import { Button, Loading, Notice, Screen } from '@/components/ui';
import { api } from '@/services/api';
import { colors } from '@/theme';
import { researcherStyles as s } from '../lib/styles';

export function ComparisonScreen() {
  const q = useQuery({
    queryKey: ['comparison'],
    queryFn: () => api<any[]>('/researcher/results/comparison'),
  });
  const comparisons = q.data ?? [];
  const valid = comparisons.filter(
    (item) => item.improvement_percentage != null,
  );
  const overallImprovement = valid.length
    ? valid.reduce(
        (total, item) => total + Number(item.improvement_percentage),
        0,
      ) / valid.length
    : null;

  return (
    <Screen>
      <View style={s.pageHeading}>
        <View style={s.pageEyebrowRow}>
          <View style={[s.pageIconBox, { backgroundColor: '#FFF0D6' }]}>
            <Feather
              accessible={false}
              color={colors.primaryDark}
              name="trending-up"
              size={17}
            />
          </View>
          <Text style={s.pageEyebrow}>DAMPAK EDUKASI</Text>
        </View>
        <Text style={s.pageTitle}>Perbandingan Hasil</Text>
        <Text style={s.pageSubtitle}>
          Bandingkan nilai sebelum dan sesudah materi diberikan.
        </Text>
      </View>

      {!q.isLoading && !q.error && valid.length ? (
        <View style={s.comparisonHero}>
          <View style={s.comparisonHeroIcon}>
            <Feather
              accessible={false}
              color="white"
              name={
                Number(overallImprovement) >= 0
                  ? 'trending-up'
                  : 'trending-down'
              }
              size={29}
            />
          </View>
          <View style={s.comparisonHeroCopy}>
            <Text style={s.comparisonHeroEyebrow}>PERUBAHAN RATA-RATA</Text>
            <Text
              style={[
                s.comparisonHeroValue,
                Number(overallImprovement) < 0 && { color: '#FFD4CF' },
              ]}
            >
              {Number(overallImprovement) > 0 ? '+' : ''}
              {Number(overallImprovement).toFixed(1)}%
            </Text>
            <Text style={s.comparisonHeroHint}>
              Dari {valid.length} materi dengan pasangan data lengkap
            </Text>
          </View>
        </View>
      ) : null}

      {q.isLoading ? (
        <Loading />
      ) : q.error ? (
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error.message}
        </Notice>
      ) : comparisons.length ? (
        <>
          <View style={s.listHeading}>
            <View>
              <Text style={s.sectionTitle}>Perbandingan per video</Text>
              <Text style={s.sectionHint}>
                Hanya pasangan data yang lengkap
              </Text>
            </View>
          </View>
          {comparisons.map((item) => {
            const pretest = Number(item.average_pretest ?? 0);
            const posttest = Number(item.average_posttest ?? 0);
            const difference = Number(item.difference ?? posttest - pretest);
            const hasData = item.improvement_percentage != null;
            const improved = difference >= 0;
            return (
              <View key={item.video_id} style={s.comparisonCard}>
                <View style={s.comparisonCardHeader}>
                  <View style={s.resultVideoNumber}>
                    <Text style={s.resultVideoNumberText}>
                      {item.sequence_number}
                    </Text>
                  </View>
                  <View style={s.resultTitleWrap}>
                    <Text style={s.resultTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={s.resultSubtitle}>
                      {item.paired_respondents ?? 0} pasangan data
                    </Text>
                  </View>
                  <View
                    style={[
                      s.changePill,
                      !improved && { backgroundColor: '#FDE3E1' },
                    ]}
                  >
                    <Text
                      style={[
                        s.changePillText,
                        !improved && { color: colors.danger },
                      ]}
                    >
                      {hasData
                        ? `${difference > 0 ? '+' : ''}${difference}`
                        : '—'}
                    </Text>
                  </View>
                </View>

                <View style={s.beforeAfterRow}>
                  <ScoreComparison label="Pretest" value={pretest} tone="pre" />
                  <View style={s.comparisonArrow}>
                    <Feather
                      accessible={false}
                      color={colors.primary}
                      name="arrow-right"
                      size={18}
                    />
                  </View>
                  <ScoreComparison
                    label="Posttest"
                    value={posttest}
                    tone="post"
                  />
                </View>

                {hasData ? (
                  <View style={s.improvementMessage}>
                    <Feather
                      accessible={false}
                      color={improved ? colors.success : colors.danger}
                      name={improved ? 'trending-up' : 'trending-down'}
                      size={17}
                    />
                    <Text style={s.improvementMessageText}>
                      {improved ? 'Peningkatan' : 'Penurunan'} sebesar{' '}
                      <Text
                        style={{
                          fontWeight: '900',
                          color: improved ? colors.success : colors.danger,
                        }}
                      >
                        {Math.abs(Number(item.improvement_percentage))}%
                      </Text>
                    </Text>
                  </View>
                ) : (
                  <Text style={s.noDataText}>
                    Belum cukup pasangan data untuk menghitung perubahan.
                  </Text>
                )}
              </View>
            );
          })}
        </>
      ) : (
        <View style={s.emptyState}>
          <View style={[s.emptyStateIcon, { backgroundColor: '#FFF0D6' }]}>
            <Feather
              accessible={false}
              color={colors.primaryDark}
              name="trending-up"
              size={27}
            />
          </View>
          <Text style={s.emptyStateTitle}>Belum ada data perbandingan</Text>
          <Text style={s.emptyStateText}>
            Perbandingan tersedia setelah responden menyelesaikan kedua tes.
          </Text>
        </View>
      )}
    </Screen>
  );
}

function ScoreComparison({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'pre' | 'post';
}) {
  return (
    <View
      style={[
        s.scoreComparison,
        tone === 'post' && { backgroundColor: '#E8F4ED' },
      ]}
    >
      <Text style={s.scoreComparisonLabel}>{label}</Text>
      <Text
        style={[
          s.scoreComparisonValue,
          tone === 'post' && { color: colors.success },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}
