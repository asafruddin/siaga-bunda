import { useState, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  Loading,
  Notice,
  Progress,
  Screen,
  Title,
} from '@/components/ui';
import { api } from '@/services/api';
import { colors } from '@/theme';
import { ProfileRow } from '../components/profile-row';
import { SectionTitle } from '../components/section-title';
import { formatDate } from '../lib/format';
import { type Video } from '../lib/types';

export function ProfileScreen() {
  const [mountedAt] = useState(() => Date.now());
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => api<any>('/respondents/me'),
  });
  const videos = useQuery({
    queryKey: ['videos'],
    queryFn: () => api<Video[]>('/videos'),
  });
  if (profile.isLoading || videos.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (profile.error || videos.error)
    return (
      <Screen>
        <Title>Profil Ibu</Title>
        <Notice
          action={
            <Button
              onPress={() => {
                profile.refetch();
                videos.refetch();
              }}
            >
              Coba lagi
            </Button>
          }
        >
          {(profile.error ?? videos.error)?.message ??
            'Profil tidak dapat dimuat.'}
        </Notice>
      </Screen>
    );
  if (!profile.data)
    return (
      <Screen>
        <Notice>Profil tidak ditemukan.</Notice>
      </Screen>
    );
  const p = profile.data;
  const learning = videos.data ?? [];
  const completed = learning.filter(
    (video) => video.status === 'completed',
  ).length;
  const progress = learning.length ? (completed / learning.length) * 100 : 0;
  const daysUntilHpl = Math.max(
    0,
    Math.ceil(
      (new Date(`${p.hpl}T00:00:00`).getTime() - mountedAt) / 86_400_000,
    ),
  );
  const trimester =
    p.pregnancy_age_weeks <= 13
      ? 'Trimester 1'
      : p.pregnancy_age_weeks <= 27
        ? 'Trimester 2'
        : 'Trimester 3';
  const initials = String(p.name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || 'IB'}</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.meta}>
            {p.age} tahun • {p.occupation}
          </Text>
          <View style={styles.verifiedPill}>
            <Ionicons
              accessible={false}
              color={colors.success}
              name="checkmark-circle"
              size={14}
            />
            <Text style={styles.verifiedText}>Data terdaftar</Text>
          </View>
        </View>
      </View>

      <View style={styles.pregnancySummary}>
        <View style={styles.pregnancyTopRow}>
          <View style={styles.pregnancyIcon}>
            <MaterialCommunityIcons
              accessible={false}
              color="white"
              name="human-pregnant"
              size={34}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryEyebrow}>KEHAMILAN SAAT INI</Text>
            <Text style={styles.pregnancyWeeks}>
              {p.pregnancy_age_weeks} minggu
            </Text>
            <Text style={styles.pregnancyTrimester}>{trimester}</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.dueDateRow}>
          <View>
            <Text style={styles.summaryLabel}>Hari perkiraan lahir</Text>
            <Text style={styles.summaryValue}>{formatDate(p.hpl)}</Text>
          </View>
          <View style={styles.daysPill}>
            <Text style={styles.daysPillText}>{daysUntilHpl} hari lagi</Text>
          </View>
        </View>
      </View>

      <View style={styles.learningCard}>
        <View style={styles.learningHeading}>
          <View>
            <Text style={styles.sectionCardTitle}>Progres edukasi</Text>
            <Text style={styles.sectionCardHint}>
              {completed} dari {learning.length || 7} materi selesai
            </Text>
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <Progress value={progress} />
      </View>

      <SectionTitle title="Data pribadi" hint="Informasi identitas Ibu" />
      <View style={styles.infoCard}>
        <ProfileRow
          icon={<ProfileIcon name="phone-outline" />}
          label="Nomor telepon"
          value={p.phone_number}
        />
        <ProfileRow
          icon={<ProfileIcon name="map-marker-outline" />}
          label="Alamat"
          value={p.address}
        />
        <ProfileRow
          icon={<ProfileIcon name="school-outline" />}
          label="Pendidikan"
          value={p.education}
        />
        <ProfileRow
          icon={<ProfileIcon name="briefcase-outline" />}
          label="Pekerjaan"
          value={p.occupation}
          last
        />
      </View>

      <SectionTitle
        title="Riwayat kehamilan"
        hint="Data kesehatan dan pendampingan"
      />
      <View style={styles.infoCard}>
        <ProfileRow
          icon={<ProfileIcon name="calendar-month-outline" />}
          label="HPHT"
          value={formatDate(p.hpht)}
        />
        <ProfileRow
          icon={<ProfileIcon name="baby-face-outline" />}
          label="Jumlah anak"
          value={`${p.number_of_children} anak`}
        />
        <ProfileRow
          icon={<ProfileIcon name="medical-bag" />}
          label="Riwayat kesehatan"
          value={p.medical_history || 'Tidak ada'}
        />
        <ProfileRow
          icon={<ProfileIcon name="heart-pulse" />}
          label="Riwayat persalinan"
          value={p.birth_history || 'Tidak ada'}
        />
        <ProfileRow
          icon={<ProfileIcon name="account-heart-outline" />}
          label="Dukungan keluarga"
          value={p.husband_support ? 'Ada' : 'Tidak ada'}
        />
        <ProfileRow
          icon={<ProfileIcon name="alert-circle-outline" />}
          label="Riwayat komplikasi"
          value={p.pregnancy_complication_history || 'Tidak ada'}
          last
        />
      </View>

      <View style={styles.privacyNote}>
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="shield-lock-outline"
          size={21}
        />
        <Text style={styles.privacyText}>
          Data Ibu terlindungi dan hanya digunakan untuk keperluan edukasi serta
          penelitian yang telah disetujui.
        </Text>
      </View>
    </Screen>
  );
}

function ProfileIcon({
  name,
}: {
  name: ComponentProps<typeof MaterialCommunityIcons>['name'];
}) {
  return (
    <MaterialCommunityIcons
      accessible={false}
      color={colors.primaryDark}
      name={name}
      size={19}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.pink,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarText: { fontSize: 25, fontWeight: '900', color: colors.primaryDark },
  identity: { flex: 1, alignItems: 'flex-start', gap: 4 },
  name: { fontSize: 24, fontWeight: '900', color: colors.text },
  meta: { fontSize: 14, color: colors.muted },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: '#DDF4E8',
  },
  verifiedText: { fontSize: 11, fontWeight: '800', color: colors.success },
  pregnancySummary: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  pregnancyTopRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  pregnancyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryEyebrow: {
    color: '#F4CFE0',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  pregnancyWeeks: {
    marginTop: 2,
    color: 'white',
    fontSize: 27,
    fontWeight: '900',
  },
  pregnancyTrimester: { color: '#EEDCE4', fontSize: 13 },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.24)',
    marginVertical: 15,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: { color: '#EEDCE4', fontSize: 12 },
  summaryValue: {
    marginTop: 2,
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
  },
  daysPill: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  daysPillText: { color: 'white', fontSize: 11, fontWeight: '900' },
  learningCard: {
    gap: 13,
    padding: 17,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  learningHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCardTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sectionCardHint: { marginTop: 2, color: colors.muted, fontSize: 12 },
  progressPercent: { color: colors.primary, fontSize: 22, fontWeight: '900' },
  infoCard: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.blue,
  },
  privacyText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
});
