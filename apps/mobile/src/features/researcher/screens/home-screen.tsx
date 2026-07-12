import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Button, Loading, Notice, Screen } from '@/components/ui';
import { api } from '@/services/api';
import { useSession } from '@/services/session';
import { colors } from '@/theme';
import { ResearchMetricCard } from '../components/research-metric-card';

export function ResearcherHome() {
  const q = useQuery({
    queryKey: ['researcher-overview'],
    queryFn: () => api<any>('/researcher/overview'),
  });
  if (q.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  const d = q.data ?? {};
  const averageProgress = Math.min(
    100,
    Math.max(0, Number(d.averageProgress ?? 0)),
  );
  const lastUpdated = q.dataUpdatedAt
    ? new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(q.dataUpdatedAt))
    : null;
  const menus = [
    {
      icon: (
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="account-group-outline"
          size={21}
        />
      ),
      label: 'Data Responden',
      description: 'Cari, filter, dan lihat progres individu',
      path: '/researcher/respondents',
      tone: colors.pink,
    },
    {
      icon: (
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="video-outline"
          size={21}
        />
      ),
      label: 'Monitoring Video',
      description: 'Pantau penyelesaian setiap materi edukasi',
      path: '/researcher/video-monitoring',
      tone: colors.blue,
    },
    {
      icon: (
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="clipboard-text-outline"
          size={21}
        />
      ),
      label: 'Hasil Pretest',
      description: 'Lihat nilai awal responden per video',
      path: '/researcher/pretest-results',
      tone: colors.purple,
    },
    {
      icon: (
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="clipboard-check-outline"
          size={21}
        />
      ),
      label: 'Hasil Posttest',
      description: 'Tinjau hasil evaluasi setelah edukasi',
      path: '/researcher/posttest-results',
      tone: '#E2F2E9',
    },
    {
      icon: (
        <Feather
          accessible={false}
          color={colors.primaryDark}
          name="trending-up"
          size={20}
        />
      ),
      label: 'Perbandingan Hasil',
      description: 'Analisis perubahan nilai pretest dan posttest',
      path: '/researcher/comparison',
      tone: '#FFF0D6',
    },
    {
      icon: (
        <Feather
          accessible={false}
          color={colors.primaryDark}
          name="download"
          size={20}
        />
      ),
      label: 'Ekspor Data',
      description: 'Simpan data responden dan hasil penelitian ke Excel',
      path: '/researcher/export',
      tone: '#ECEFF7',
    },
  ];
  const signOut = () =>
    Alert.alert(
      'Keluar dari akun peneliti?',
      'Anda perlu masuk kembali untuk mengakses data penelitian.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await useSession.getState().signOut();
            router.replace('/onboarding' as never);
          },
        },
      ],
    );
  return (
    <Screen showBack={false}>
      <View style={styles.topbar}>
        <View style={styles.modePill}>
          <View style={styles.modeDot} />
          <Text style={styles.modeText}>MODE PENELITI</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={signOut}
          style={({ pressed }) => [
            styles.logoutLink,
            pressed && { opacity: 0.55 },
          ]}
        >
          <Text style={styles.logoutLinkText}>Keluar</Text>
        </Pressable>
      </View>

      <View style={styles.heading}>
        <Text style={styles.title}>Dasbor Peneliti</Text>
        <Text style={styles.subtitle}>
          Pantau pelaksanaan studi SiAGA Bunda dalam satu tempat.
        </Text>
      </View>

      {q.error && (
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error.message}
        </Notice>
      )}

      <View style={styles.overviewCard}>
        <View style={styles.overviewTopRow}>
          <View>
            <Text style={styles.overviewEyebrow}>PROGRES PENELITIAN</Text>
            <Text style={styles.overviewValue}>
              {Math.round(averageProgress)}%
            </Text>
            <Text style={styles.overviewCaption}>
              Rata-rata progres responden
            </Text>
          </View>
          <View style={styles.activeRespondentPill}>
            <View style={styles.activeRespondentDot} />
            <Text style={styles.activeRespondentText}>
              {d.activeRespondents ?? 0} aktif
            </Text>
          </View>
        </View>
        <View style={styles.overviewProgressTrack}>
          <View
            style={[
              styles.overviewProgressFill,
              { width: `${averageProgress}%` },
            ]}
          />
        </View>
        <View style={styles.overviewFooter}>
          <Text style={styles.overviewFooterText}>
            {d.completedAllVideos ?? 0} responden menyelesaikan seluruh materi
          </Text>
          <Pressable onPress={() => q.refetch()} disabled={q.isFetching}>
            <Text style={styles.refreshText}>
              {q.isFetching
                ? 'Memperbarui…'
                : lastUpdated
                  ? `Diperbarui ${lastUpdated}`
                  : 'Perbarui'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.metrics}>
        <ResearchMetricCard
          accent={colors.primary}
          label="Total"
          value={d.totalRespondents ?? 0}
          detail="responden"
        />
        <ResearchMetricCard
          accent={colors.success}
          label="Aktif"
          value={d.activeRespondents ?? 0}
          detail="mengikuti"
        />
        <ResearchMetricCard
          accent="#7760A8"
          label="Selesai"
          value={d.completedAllVideos ?? 0}
          detail="7 materi"
        />
      </View>

      <View style={styles.menuHeading}>
        <View>
          <Text style={styles.menuTitle}>Kelola penelitian</Text>
          <Text style={styles.menuSubtitle}>
            Pilih data yang ingin Anda tinjau
          </Text>
        </View>
        <Text style={styles.menuCount}>{menus.length} menu</Text>
      </View>

      <View style={styles.menuList}>
        {menus.map((menu, index) => (
          <Pressable
            key={menu.path}
            accessibilityRole="button"
            onPress={() => router.push(menu.path as never)}
            style={({ pressed }) => [
              styles.menuRow,
              index < menus.length - 1 && styles.menuBorder,
              pressed && styles.menuPressed,
            ]}
          >
            <View style={[styles.menuIcon, { backgroundColor: menu.tone }]}>
              {menu.icon}
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitleRow}>{menu.label}</Text>
              <Text style={styles.menuDescription}>{menu.description}</Text>
            </View>
            <Ionicons
              accessible={false}
              color={colors.primary}
              name="chevron-forward"
              size={22}
            />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: colors.purple,
  },
  modeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  modeText: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  logoutLink: { paddingHorizontal: 4, paddingVertical: 7 },
  logoutLinkText: { color: colors.danger, fontSize: 13, fontWeight: '800' },
  heading: { gap: 5, marginTop: 2 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  overviewCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  overviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  overviewEyebrow: {
    color: '#EFCFDE',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  overviewValue: { color: 'white', fontSize: 40, fontWeight: '900' },
  overviewCaption: { color: '#EAD9E1', fontSize: 12 },
  activeRespondentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  activeRespondentDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#78D6A7',
  },
  activeRespondentText: { color: 'white', fontSize: 11, fontWeight: '800' },
  overviewProgressTrack: {
    height: 8,
    marginTop: 18,
    borderRadius: 99,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  overviewProgressFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: '#F2BFD5',
  },
  overviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  overviewFooterText: {
    flex: 1,
    color: '#EAD9E1',
    fontSize: 11,
    lineHeight: 16,
  },
  refreshText: { color: 'white', fontSize: 10, fontWeight: '800' },
  metrics: { flexDirection: 'row', gap: 9 },
  menuHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  menuTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  menuSubtitle: { marginTop: 2, color: colors.muted, fontSize: 12 },
  menuCount: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  menuList: {
    paddingHorizontal: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  menuBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuPressed: { opacity: 0.58 },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1, gap: 3 },
  menuTitleRow: { color: colors.text, fontSize: 15, fontWeight: '800' },
  menuDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
});
