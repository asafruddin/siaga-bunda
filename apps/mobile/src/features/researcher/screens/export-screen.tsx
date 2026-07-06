import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Button, Field, Screen } from '@/components/ui';
import { colors } from '@/theme';
import { useSession } from '@/services/session';
import { researcherStyles as s } from '../lib/styles';

const datasetTypes = [
  {
    value: 'full_dataset',
    icon: 'table-large',
    title: 'Dataset lengkap',
    description: 'Profil anonim, progres video, pretest, dan posttest',
  },
  {
    value: 'respondent_data',
    icon: 'account-group-outline',
    title: 'Data responden',
    description: 'Kode responden dan tanggal pendaftaran',
  },
  {
    value: 'video_progress',
    icon: 'video-outline',
    title: 'Progres video',
    description: 'Status, persentase, dan waktu penyelesaian video',
  },
  {
    value: 'pretest',
    icon: 'clipboard-text-outline',
    title: 'Hasil pretest',
    description: 'Nilai awal responden untuk setiap materi',
  },
  {
    value: 'posttest',
    icon: 'clipboard-check-outline',
    title: 'Hasil posttest',
    description: 'Nilai akhir dan jadwal penyelesaian posttest',
  },
] as const;

const statuses = [
  { value: '', label: 'Semua' },
  { value: 'pretest_required', label: 'Pretest' },
  { value: 'video_in_progress', label: 'Menonton' },
  { value: 'waiting_posttest', label: 'Menunggu' },
  { value: 'posttest_available', label: 'Posttest' },
  { value: 'completed', label: 'Selesai' },
];

export function ExportScreen() {
  const [type, setType] = useState('full_dataset');
  const [dateFrom, setFrom] = useState('');
  const [dateTo, setTo] = useState('');
  const [videoNumber, setVideo] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const selectedDataset =
    datasetTypes.find((dataset) => dataset.value === type) ?? datasetTypes[0];
  const selectedStatus =
    statuses.find((item) => item.value === status)?.label ?? 'Semua';

  async function run() {
    try {
      setBusy(true);
      const token = useSession.getState().token;
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/researcher/export`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            exportType: type,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            videoNumber: videoNumber ? Number(videoNumber) : undefined,
            status: status || undefined,
          }),
        },
      );
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error?.message ?? 'Ekspor gagal.');
      }
      const csv = await response.text();
      const uri = `${FileSystem.cacheDirectory}siaga-bunda-${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (await Sharing.isAvailableAsync())
        await Sharing.shareAsync(uri, {
          mimeType: 'text/csv',
          dialogTitle: 'Bagikan data penelitian',
        });
      else Alert.alert('Ekspor selesai', uri);
    } catch (error) {
      Alert.alert(
        'Ekspor gagal',
        error instanceof Error ? error.message : 'Coba kembali.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={s.pageHeading}>
        <View style={s.pageEyebrowRow}>
          <View style={[s.pageIconBox, { backgroundColor: '#ECEFF7' }]}>
            <Feather
              accessible={false}
              color={colors.primaryDark}
              name="download"
              size={17}
            />
          </View>
          <Text style={s.pageEyebrow}>DATA PENELITIAN</Text>
        </View>
        <Text style={s.pageTitle}>Ekspor Data</Text>
        <Text style={s.pageSubtitle}>
          Pilih isi dan filter data sebelum membuat file CSV.
        </Text>
      </View>

      <View style={s.exportStepHeading}>
        <View style={s.stepNumber}>
          <Text style={s.stepNumberText}>1</Text>
        </View>
        <View>
          <Text style={s.sectionTitle}>Pilih jenis dataset</Text>
          <Text style={s.sectionHint}>
            Tentukan informasi yang akan disertakan
          </Text>
        </View>
      </View>

      <View style={s.datasetList}>
        {datasetTypes.map((dataset) => {
          const selected = type === dataset.value;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={dataset.value}
              onPress={() => setType(dataset.value)}
              style={({ pressed }) => [
                s.datasetOption,
                selected && s.datasetOptionActive,
                pressed && { opacity: 0.6 },
              ]}
            >
              <View
                style={[
                  s.datasetIcon,
                  selected && { backgroundColor: colors.primary },
                ]}
              >
                <MaterialCommunityIcons
                  accessible={false}
                  color={selected ? 'white' : colors.primaryDark}
                  name={dataset.icon}
                  size={21}
                />
              </View>
              <View style={s.datasetCopy}>
                <Text style={s.datasetTitle}>{dataset.title}</Text>
                <Text style={s.datasetDescription}>{dataset.description}</Text>
              </View>
              <View style={[s.radioOuter, selected && s.radioOuterActive]}>
                {selected ? <View style={s.radioInner} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={s.exportStepHeading}>
        <View style={s.stepNumber}>
          <Text style={s.stepNumberText}>2</Text>
        </View>
        <View>
          <Text style={s.sectionTitle}>Atur filter</Text>
          <Text style={s.sectionHint}>
            Semua filter berikut bersifat opsional
          </Text>
        </View>
      </View>

      <View style={s.filterPanel}>
        <Text style={s.formLabel}>Nomor video</Text>
        <View style={s.numberChipRow}>
          {['', '1', '2', '3', '4', '5', '6', '7'].map((value) => {
            const selected = videoNumber === value;
            return (
              <Pressable
                key={value || 'all'}
                onPress={() => setVideo(value)}
                style={({ pressed }) => [
                  s.numberChip,
                  selected && s.numberChipActive,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text
                  style={[s.numberChipText, selected && s.numberChipTextActive]}
                >
                  {value || 'Semua'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={s.formLabel}>Status responden</Text>
        <View style={s.filterWrap}>
          {statuses.map((item) => {
            const selected = status === item.value;
            return (
              <Pressable
                key={item.value || 'all'}
                onPress={() => setStatus(item.value)}
                style={({ pressed }) => [
                  s.filterChip,
                  selected && s.filterChipActive,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text
                  style={[s.filterChipText, selected && s.filterChipTextActive]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={s.dateFields}>
          <View style={s.dateField}>
            <Field
              label="Tanggal mulai"
              value={dateFrom}
              onChangeText={setFrom}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />
          </View>
          <View style={s.dateField}>
            <Field
              label="Tanggal akhir"
              value={dateTo}
              onChangeText={setTo}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>

      <View style={s.exportSummary}>
        <View style={s.exportSummaryIcon}>
          <Text style={s.exportSummaryIconText}>CSV</Text>
        </View>
        <View style={s.exportSummaryCopy}>
          <Text style={s.exportSummaryTitle}>{selectedDataset.title}</Text>
          <Text style={s.exportSummaryText}>
            Video {videoNumber || 'semua'} • Status{' '}
            {selectedStatus.toLowerCase()}
            {dateFrom || dateTo ? ' • Rentang tanggal khusus' : ''}
          </Text>
        </View>
      </View>

      <View style={s.securityNote}>
        <MaterialCommunityIcons
          accessible={false}
          color={colors.primaryDark}
          name="shield-lock-outline"
          size={20}
        />
        <View style={{ flex: 1 }}>
          <Text style={s.securityNoteTitle}>Privasi data terjaga</Text>
          <Text style={s.securityNoteText}>
            File menggunakan kode responden anonim. Aktivitas ekspor dicatat
            dalam audit penelitian.
          </Text>
        </View>
      </View>

      <Button disabled={busy} onPress={run}>
        {busy ? 'Membuat file…' : 'Buat dan Bagikan CSV'}
      </Button>
    </Screen>
  );
}
