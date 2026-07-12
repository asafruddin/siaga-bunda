import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Button, Field, Screen } from '@/components/ui';
import { colors } from '@/theme';
import { useSession } from '@/services/session';
import { researcherStyles as s } from '../lib/styles';

const datasetTypes = [
  {
    value: 'full_dataset',
    icon: 'table-large',
    title: 'Dataset lengkap',
    description: 'Identitas responden, profil, progres, tes, dan jawaban',
  },
  {
    value: 'respondent_data',
    icon: 'account-group-outline',
    title: 'Data responden',
    description: 'Nama, kontak, alamat, dan profil kehamilan',
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

const EXCEL_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const ANDROID_FLAG_GRANT_READ_URI_PERMISSION = 1;

function startsWithText(bytes: Uint8Array, value: string) {
  return value
    .split('')
    .every((char, index) => bytes[index] === char.charCodeAt(0));
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function isExcelWorkbook(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  return (
    bytes.length > 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    [0x03, 0x05, 0x07].includes(bytes[2]) &&
    [0x04, 0x06, 0x08].includes(bytes[3])
  );
}

function invalidWorkbookMessage(
  buffer: ArrayBuffer,
  contentType: string | null,
) {
  const bytes = new Uint8Array(buffer);
  const normalizedType = contentType?.split(';')[0]?.trim().toLowerCase();
  let format = normalizedType || 'format tidak dikenal';

  if (normalizedType === 'text/csv' || startsWithText(bytes, 'respondent_')) {
    format = 'CSV';
  } else if (
    normalizedType === 'application/json' ||
    startsWithText(bytes, '{"')
  ) {
    format = 'JSON';
  } else if (
    normalizedType === 'text/html' ||
    startsWithText(bytes, '<!DOCTYPE') ||
    startsWithText(bytes, '<html')
  ) {
    format = 'HTML';
  }

  return `Server mengirim ${format}, bukan file Excel. Pastikan API yang dipakai aplikasi sudah diperbarui ke endpoint ekspor XLSX.`;
}

async function previewExcelFile(uri: string) {
  try {
    const previewUri = await FileSystem.getContentUriAsync(uri);
    if (Platform.OS === 'android') {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: previewUri,
        type: EXCEL_MIME_TYPE,
        flags: ANDROID_FLAG_GRANT_READ_URI_PERMISSION,
      });
      return;
    }

    await Linking.openURL(previewUri);
  } catch {
    Alert.alert(
      'Pratinjau tidak tersedia',
      'Tidak ada aplikasi yang dapat membuka file Excel ini di perangkat.',
    );
  }
}

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
            Accept: EXCEL_MIME_TYPE,
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
      const contentType = response.headers.get('content-type');
      const workbook = await response.arrayBuffer();
      if (!isExcelWorkbook(workbook)) {
        throw new Error(invalidWorkbookMessage(workbook, contentType));
      }
      const uri = `${FileSystem.documentDirectory}siaga-bunda-${Date.now()}.xlsx`;
      await FileSystem.writeAsStringAsync(uri, arrayBufferToBase64(workbook), {
        encoding: FileSystem.EncodingType.Base64,
      });
      Alert.alert('Ekspor selesai', `File Excel tersimpan di:\n${uri}`, [
        { text: 'Tutup', style: 'cancel' },
        {
          text: 'Pratinjau',
          onPress: () => {
            void previewExcelFile(uri);
          },
        },
      ]);
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
          Pilih isi dan filter data sebelum membuat file Excel berisi data
          responden penelitian.
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
          <Text style={s.exportSummaryIconText}>XLSX</Text>
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
          <Text style={s.securityNoteTitle}>Data sensitif peneliti</Text>
          <Text style={s.securityNoteText}>
            File dapat berisi nama, kontak, dan alamat responden. Simpan hanya
            untuk kebutuhan peneliti; aktivitas ekspor dicatat dalam audit.
          </Text>
        </View>
      </View>

      <Button disabled={busy} onPress={run}>
        {busy ? 'Membuat file…' : 'Buat dan Simpan Excel'}
      </Button>
    </Screen>
  );
}
