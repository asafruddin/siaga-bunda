import { Image, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Screen } from '@/components/ui';
import { colors } from '@/theme';
import { respondentStyles as s } from '../lib/styles';

const pretestIllustration = require('../../../../assets/app/ilustrations/pregnant-3.png');

export function TestIntroScreen({ type }: { type: 'pretest' | 'posttest' }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isPretest = type === 'pretest';
  const questionCount = isPretest ? 5 : 25;
  const duration = isPretest ? 'sekitar 3 menit' : 'sekitar 10–15 menit';
  const instructions = [
    [
      '1',
      'Jawab semua pertanyaan',
      `Terdapat ${questionCount} pertanyaan pilihan ganda.`,
    ],
    ['2', 'Pilih satu jawaban', 'Pilih jawaban yang menurut Ibu paling tepat.'],
    ['3', 'Kirim setelah lengkap', 'Nilai dihitung otomatis oleh sistem.'],
  ];
  return (
    <Screen>
      <View style={s.testIntroHeading}>
        <View
          style={[
            s.testTypePill,
            !isPretest && { backgroundColor: colors.successSoft },
          ]}
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
        style={[
          s.testIntroHero,
          isPretest ? s.testIntroHeroPretest : s.testIntroHeroPosttest,
          !isPretest && { backgroundColor: colors.successDark },
        ]}
      >
        {isPretest ? (
          <>
            <View style={s.testIntroHeroVisual}>
              <Image
                accessibilityIgnoresInvertColors
                accessible={false}
                resizeMode="contain"
                source={pretestIllustration}
                style={s.testIntroHeroImage}
              />
            </View>
            <View style={s.testIntroHeroSummary}>
              <Text style={s.testIntroHeroKicker}>Siap mulai?</Text>
              <Text style={s.testIntroHeroValue}>{questionCount}</Text>
              <Text style={s.testIntroHeroLabel}>pertanyaan</Text>
              <Text style={s.testIntroHeroDuration}>{duration}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={s.testIntroHeroIcon}>
              <MaterialIcons
                accessible={false}
                color="white"
                name="fact-check"
                size={24}
              />
            </View>
            <Text style={s.testIntroHeroValue}>{questionCount}</Text>
            <Text style={s.testIntroHeroLabel}>pertanyaan • {duration}</Text>
          </>
        )}
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
        style={[
          s.testNotice,
          !isPretest && { backgroundColor: colors.successMuted },
        ]}
      >
        <Ionicons
          accessible={false}
          color={isPretest ? colors.primary : colors.success}
          name={isPretest ? 'play-circle-outline' : 'time-outline'}
          size={18}
        />
        <Text style={s.testNoticeText}>
          {isPretest
            ? 'Video akan terbuka segera setelah pretest selesai dikirim.'
            : 'Posttest tersedia setelah menonton video terakhir.'}
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
