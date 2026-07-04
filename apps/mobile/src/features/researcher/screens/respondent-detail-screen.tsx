import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Loading,
  Notice,
  Progress,
  Screen,
} from '@/components/ui';
import { colors } from '@/theme';
import { api } from '@/services/api';
import { formatDate, formatDateTime } from '../lib/format';
import { statusLabel } from '../lib/status-label';
import { researcherStyles as s } from '../lib/styles';

const actionLabels: Record<string, string> = {
  respondent_registered: 'Responden terdaftar',
  pretest_started: 'Pretest dimulai',
  pretest_submitted: 'Pretest dikirim',
  video_started: 'Video mulai ditonton',
  video_progress_updated: 'Progres video diperbarui',
  video_completed: 'Video selesai ditonton',
  posttest_scheduled: 'Posttest dijadwalkan',
  posttest_available: 'Posttest tersedia',
  posttest_submitted: 'Posttest dikirim',
  next_video_unlocked: 'Video berikutnya terbuka',
};

export function RespondentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({
    queryKey: ['respondent-detail', id],
    queryFn: () => api<any>(`/researcher/respondents/${id}`),
    enabled: Boolean(id),
  });

  if (q.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (q.error || !q.data)
    return (
      <Screen>
        <View style={s.pageHeading}>
          <Text style={s.pageTitle}>Detail Responden</Text>
        </View>
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error?.message ?? 'Data responden tidak ditemukan.'}
        </Notice>
      </Screen>
    );

  const { profile } = q.data;
  const progress: any[] = q.data.progress ?? [];
  const tests: any[] = q.data.tests ?? [];
  const timeline: any[] = q.data.timeline ?? [];
  const completedVideos = progress.filter(
    (item: any) => item.status === 'completed',
  ).length;
  const studyProgress = (completedVideos / 7) * 100;
  const trimester =
    profile.pregnancy_age_weeks <= 13
      ? 'Trimester 1'
      : profile.pregnancy_age_weeks <= 27
        ? 'Trimester 2'
        : 'Trimester 3';
  const initials = String(profile.name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const groupedTests = tests.reduce<Map<number, any[]>>((groups, test) => {
    const sequence = Number(test.videos.sequence_number);
    groups.set(sequence, [...(groups.get(sequence) ?? []), test]);
    return groups;
  }, new Map());
  const testGroups = Array.from(groupedTests.entries()).sort(
    ([first], [second]) => first - second,
  );

  return (
    <Screen>
      <View style={s.detailIdentity}>
        <View style={s.detailAvatar}>
          <Text style={s.detailAvatarText}>{initials || 'IB'}</Text>
        </View>
        <View style={s.detailIdentityCopy}>
          <View style={s.detailNameRow}>
            <Text style={s.detailName} numberOfLines={2}>
              {profile.name}
            </Text>
            <View style={s.readOnlyPill}>
              <Text style={s.readOnlyPillText}>READ ONLY</Text>
            </View>
          </View>
          <Text style={s.detailMeta}>
            {profile.age} tahun •{' '}
            {profile.occupation || 'Pekerjaan tidak diisi'}
          </Text>
          <Text style={s.registeredText}>
            Terdaftar {formatDateTime(profile.created_at)}
          </Text>
        </View>
      </View>

      <View style={s.detailHero}>
        <View style={s.detailHeroTop}>
          <View>
            <Text style={s.detailHeroEyebrow}>KEHAMILAN SAAT INI</Text>
            <Text style={s.detailHeroValue}>
              {profile.pregnancy_age_weeks} minggu
            </Text>
            <Text style={s.detailHeroHint}>{trimester}</Text>
          </View>
          <View style={s.detailHplBox}>
            <Text style={s.detailHplLabel}>HPL</Text>
            <Text style={s.detailHplValue}>{formatDate(profile.hpl)}</Text>
          </View>
        </View>
        <View style={s.detailHeroDivider} />
        <View style={s.detailProgressHeading}>
          <Text style={s.detailProgressLabel}>Progres program</Text>
          <Text style={s.detailProgressValue}>
            {Math.round(studyProgress)}%
          </Text>
        </View>
        <View style={s.detailProgressTrack}>
          <View
            style={[s.detailProgressFill, { width: `${studyProgress}%` }]}
          />
        </View>
        <Text style={s.detailProgressHint}>
          {completedVideos} dari 7 materi selesai
        </Text>
      </View>

      <View style={s.detailMetrics}>
        <DetailMetric value={progress.length} label="Video dibuka" />
        <View style={s.detailMetricDivider} />
        <DetailMetric value={tests.length} label="Tes dikirim" />
        <View style={s.detailMetricDivider} />
        <DetailMetric value={timeline.length} label="Aktivitas" />
      </View>

      <SectionHeading
        title="Informasi responden"
        hint="Identitas dan data pendampingan"
      />
      <View style={s.detailInfoCard}>
        <DetailRow
          icon="☎"
          label="Nomor telepon"
          value={profile.phone_number}
        />
        <DetailRow icon="⌂" label="Alamat" value={profile.address} />
        <DetailRow
          icon="⌑"
          label="Pendidikan"
          value={profile.education || 'Tidak diisi'}
        />
        <DetailRow
          icon="♧"
          label="Dukungan keluarga"
          value={profile.husband_support ? 'Ada' : 'Tidak ada'}
          last
        />
      </View>

      <SectionHeading
        title="Riwayat kesehatan"
        hint="Informasi sensitif—hanya untuk peneliti berwenang"
      />
      <View style={s.healthGrid}>
        <HealthCard
          icon="✚"
          label="Riwayat medis"
          value={profile.medical_history || 'Tidak ada'}
        />
        <HealthCard
          icon="!"
          label="Riwayat komplikasi"
          value={profile.pregnancy_complication_history || 'Tidak ada'}
        />
        <HealthCard
          icon="♡"
          label="Riwayat persalinan"
          value={profile.birth_history || 'Tidak ada'}
        />
        <HealthCard
          icon="♙"
          label="Jumlah anak"
          value={`${profile.number_of_children ?? 0} anak`}
        />
      </View>

      <SectionHeading
        title="Progres video"
        hint={`${progress.length} materi memiliki aktivitas`}
      />
      {progress.length ? (
        <View style={s.detailVideoList}>
          {progress.map((item: any, index: number) => {
            const percentage = Number(item.completion_percentage ?? 0);
            const tone =
              item.status === 'completed'
                ? 'success'
                : item.status === 'waiting_posttest'
                  ? 'warning'
                  : 'neutral';
            return (
              <View
                key={item.id}
                style={[
                  s.detailVideoRow,
                  index < progress.length - 1 && s.listRowBorder,
                ]}
              >
                <View style={s.detailVideoNumber}>
                  <Text style={s.detailVideoNumberText}>
                    {item.videos.sequence_number}
                  </Text>
                </View>
                <View style={s.detailVideoContent}>
                  <View style={s.detailVideoTitleRow}>
                    <Text style={s.detailVideoTitle} numberOfLines={2}>
                      {item.videos.title}
                    </Text>
                    <Text style={s.detailVideoPercentage}>
                      {Math.round(percentage)}%
                    </Text>
                  </View>
                  <Badge tone={tone}>{statusLabel(item.status)}</Badge>
                  <Progress value={percentage} />
                  <Text style={s.detailVideoMeta}>
                    Maksimum ditonton{' '}
                    {Math.floor(item.max_watched_seconds ?? 0)} detik
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <CompactEmpty
          icon="▶"
          title="Belum ada progres video"
          text="Aktivitas akan muncul setelah responden memulai pretest."
        />
      )}

      <SectionHeading
        title="Nilai tes"
        hint={`${tests.length} hasil tes telah dikumpulkan`}
      />
      {testGroups.length ? (
        testGroups.map(([sequence, group]) => {
          const pretest = group.find((test) => test.test_type === 'pretest');
          const posttest = group.find((test) => test.test_type === 'posttest');
          const title = group[0]?.videos.title;
          const difference =
            pretest && posttest
              ? Number(posttest.score) - Number(pretest.score)
              : null;
          return (
            <View key={sequence} style={s.testGroupCard}>
              <View style={s.testGroupHeader}>
                <View style={s.resultVideoNumber}>
                  <Text style={s.resultVideoNumberText}>{sequence}</Text>
                </View>
                <View style={s.resultTitleWrap}>
                  <Text style={s.resultTitle} numberOfLines={2}>
                    {title}
                  </Text>
                  <Text style={s.resultSubtitle}>Video {sequence}</Text>
                </View>
                {difference != null ? (
                  <View
                    style={[
                      s.changePill,
                      difference < 0 && { backgroundColor: '#FDE3E1' },
                    ]}
                  >
                    <Text
                      style={[
                        s.changePillText,
                        difference < 0 && { color: colors.danger },
                      ]}
                    >
                      {difference > 0 ? '+' : ''}
                      {difference}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={s.testScoresRow}>
                <TestScore label="Pretest" test={pretest} tone="pre" />
                <View style={s.comparisonArrow}>
                  <Text style={s.comparisonArrowText}>→</Text>
                </View>
                <TestScore label="Posttest" test={posttest} tone="post" />
              </View>
            </View>
          );
        })
      ) : (
        <CompactEmpty
          icon="A"
          title="Belum ada nilai tes"
          text="Nilai muncul setelah responden mengirim pretest atau posttest."
        />
      )}

      <SectionHeading
        title="Jejak aktivitas"
        hint="Riwayat tindakan tercatat otomatis"
      />
      {timeline.length ? (
        <View style={s.auditCard}>
          {timeline.map((item: any, index: number) => (
            <View key={`${item.created_at}-${index}`} style={s.auditRow}>
              <View style={s.auditRail}>
                <View
                  style={[
                    s.auditDot,
                    item.action.includes('completed') && {
                      backgroundColor: colors.success,
                    },
                  ]}
                />
                {index < timeline.length - 1 ? (
                  <View style={s.auditLine} />
                ) : null}
              </View>
              <View style={s.auditContent}>
                <Text style={s.auditTitle}>
                  {actionLabels[item.action] ??
                    String(item.action).replaceAll('_', ' ')}
                </Text>
                <Text style={s.auditTime}>
                  {formatDateTime(item.created_at)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <CompactEmpty
          icon="◷"
          title="Belum ada jejak aktivitas"
          text="Tindakan penting responden akan tercatat di bagian ini."
        />
      )}

      <View style={s.detailPrivacyNote}>
        <Text style={s.detailPrivacyIcon}>⌾</Text>
        <Text style={s.detailPrivacyText}>
          Data ini bersifat rahasia. Jangan membagikan identitas atau riwayat
          kesehatan responden di luar kebutuhan penelitian.
        </Text>
      </View>
    </Screen>
  );
}

function SectionHeading({ title, hint }: { title: string; hint: string }) {
  return (
    <View style={s.detailSectionHeading}>
      <Text style={s.sectionTitle}>{title}</Text>
      <Text style={s.sectionHint}>{hint}</Text>
    </View>
  );
}

function DetailMetric({ value, label }: { value: number; label: string }) {
  return (
    <View style={s.detailMetric}>
      <Text style={s.detailMetricValue}>{value}</Text>
      <Text style={s.detailMetricLabel}>{label}</Text>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[s.detailInfoRow, !last && s.listRowBorder]}>
      <View style={s.detailInfoIcon}>
        <Text style={s.detailInfoIconText}>{icon}</Text>
      </View>
      <View style={s.detailInfoCopy}>
        <Text style={s.detailInfoLabel}>{label}</Text>
        <Text style={s.detailInfoValue}>{value}</Text>
      </View>
    </View>
  );
}

function HealthCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={s.healthCard}>
      <View style={s.healthIcon}>
        <Text style={s.healthIconText}>{icon}</Text>
      </View>
      <Text style={s.healthLabel}>{label}</Text>
      <Text style={s.healthValue}>{value}</Text>
    </View>
  );
}

function TestScore({
  label,
  test,
  tone,
}: {
  label: string;
  test?: any;
  tone: 'pre' | 'post';
}) {
  return (
    <View
      style={[
        s.detailTestScore,
        tone === 'post' && { backgroundColor: '#E8F4ED' },
      ]}
    >
      <Text style={s.detailTestLabel}>{label}</Text>
      <Text
        style={[
          s.detailTestValue,
          tone === 'post' && { color: colors.success },
        ]}
      >
        {test?.score ?? '—'}
      </Text>
      <Text style={s.detailTestMeta}>
        {test
          ? `${test.correct_count}/${test.total_questions} benar`
          : 'Belum tersedia'}
      </Text>
    </View>
  );
}

function CompactEmpty({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <View style={s.compactEmpty}>
      <View style={s.compactEmptyIcon}>
        <Text style={s.compactEmptyIconText}>{icon}</Text>
      </View>
      <View style={s.compactEmptyCopy}>
        <Text style={s.compactEmptyTitle}>{title}</Text>
        <Text style={s.compactEmptyText}>{text}</Text>
      </View>
    </View>
  );
}
