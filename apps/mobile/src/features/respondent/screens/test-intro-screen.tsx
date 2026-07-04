import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Screen } from '@/components/ui';
import { colors } from '@/theme';
import { respondentStyles as s } from '../lib/styles';

const instructions = [
  ['1', 'Jawab semua pertanyaan', 'Terdapat 10 pertanyaan pilihan ganda.'],
  ['2', 'Pilih satu jawaban', 'Pilih jawaban yang menurut Ibu paling tepat.'],
  ['3', 'Kirim setelah lengkap', 'Nilai dihitung otomatis oleh sistem.'],
];

export function TestIntroScreen({ type }: { type: 'pretest' | 'posttest' }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isPretest = type === 'pretest';
  return (
    <Screen>
      <View style={s.testIntroHeading}>
        <View
          style={[s.testTypePill, !isPretest && { backgroundColor: '#E2F2E9' }]}
        >
          <Text
            style={[
              s.testTypePillText,
              !isPretest && { color: colors.success },
            ]}
          >
            {isPretest ? 'SEBELUM VIDEO' : 'SETELAH VIDEO'}
          </Text>
        </View>
        <Text style={s.testIntroTitle}>
          {isPretest ? 'Pretest' : 'Posttest'}
        </Text>
        <Text style={s.testIntroSubtitle}>
          {isPretest
            ? 'Bantu kami memahami pengetahuan awal Ibu sebelum menonton materi.'
            : 'Saatnya melihat kembali pemahaman Ibu setelah mempelajari materi.'}
        </Text>
      </View>

      <View
        style={[s.testIntroHero, !isPretest && { backgroundColor: '#245E49' }]}
      >
        <View style={s.testIntroHeroIcon}>
          <Text style={s.testIntroHeroIconText}>{isPretest ? 'A' : '✓'}</Text>
        </View>
        <Text style={s.testIntroHeroValue}>10</Text>
        <Text style={s.testIntroHeroLabel}>pertanyaan • sekitar 5 menit</Text>
      </View>

      <View style={s.instructionCard}>
        <Text style={s.instructionTitle}>Sebelum mulai</Text>
        {instructions.map(([number, title, description], index) => (
          <View
            key={number}
            style={[
              s.instructionRow,
              index < instructions.length - 1 && s.instructionBorder,
            ]}
          >
            <View style={s.instructionNumber}>
              <Text style={s.instructionNumberText}>{number}</Text>
            </View>
            <View style={s.instructionCopy}>
              <Text style={s.instructionRowTitle}>{title}</Text>
              <Text style={s.instructionDescription}>{description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View
        style={[s.testNotice, !isPretest && { backgroundColor: '#E8F4ED' }]}
      >
        <Text
          style={[s.testNoticeIcon, !isPretest && { color: colors.success }]}
        >
          {isPretest ? '▶' : '◷'}
        </Text>
        <Text style={s.testNoticeText}>
          {isPretest
            ? 'Video akan terbuka segera setelah pretest selesai dikirim.'
            : 'Posttest tersedia tujuh hari setelah video selesai ditonton.'}
        </Text>
      </View>

      <Button
        onPress={() => router.push(`/respondent/videos/${id}/${type}` as never)}
      >
        Mulai {isPretest ? 'Pretest' : 'Posttest'}
      </Button>
    </Screen>
  );
}
