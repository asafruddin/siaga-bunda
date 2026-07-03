import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Button, Field, Notice, Screen, Title, ui } from '@/components/ui';
import { useSession } from '@/services/session';
import { researcherStyles as s } from '../lib/styles';

export function ExportScreen() {
  const [type, setType] = useState('full_dataset');
  const [dateFrom, setFrom] = useState('');
  const [dateTo, setTo] = useState('');
  const [videoNumber, setVideo] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
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
    } catch (e) {
      Alert.alert(
        'Ekspor gagal',
        e instanceof Error ? e.message : 'Coba kembali.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <Title subtitle="Ekspor menggunakan kode responden anonim dan dicatat dalam audit.">
        Ekspor Data
      </Title>
      <Text style={ui.label}>Jenis data</Text>
      {[
        'full_dataset',
        'respondent_data',
        'video_progress',
        'pretest',
        'posttest',
      ].map((item) => (
        <Pressable
          key={item}
          style={[s.choice, type === item && s.choiceActive]}
          onPress={() => setType(item)}
        >
          <Text style={ui.label}>{item.replaceAll('_', ' ')}</Text>
        </Pressable>
      ))}
      <Field
        label="Nomor video 1–7 (opsional)"
        value={videoNumber}
        onChangeText={setVideo}
        keyboardType="number-pad"
      />
      <Field
        label="Status video (opsional)"
        value={status}
        onChangeText={setStatus}
        placeholder="completed"
      />
      <Field
        label="Tanggal mulai (YYYY-MM-DD, opsional)"
        value={dateFrom}
        onChangeText={setFrom}
      />
      <Field
        label="Tanggal akhir (YYYY-MM-DD, opsional)"
        value={dateTo}
        onChangeText={setTo}
      />
      <Notice>
        File CSV kompatibel dengan Excel. Identitas langsung tidak disertakan
        pada ekspor standar.
      </Notice>
      <Button disabled={busy} onPress={run}>
        {busy ? 'Membuat file…' : 'Buat dan Bagikan CSV'}
      </Button>
    </Screen>
  );
}
