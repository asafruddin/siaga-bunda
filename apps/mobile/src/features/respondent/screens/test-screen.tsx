import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Question } from '@siaga/shared';
import { Button, Loading, Notice, Progress, Screen } from '@/components/ui';
import { colors } from '@/theme';
import { api, post } from '@/services/api';
import { respondentStyles as s } from '../lib/styles';

export function TestScreen({ type }: { type: 'pretest' | 'posttest' }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['questions', id, type],
    queryFn: () => api<Question[]>(`/videos/${id}/${type}`),
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  if (query.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (query.error)
    return (
      <Screen>
        <Notice
          action={<Button onPress={() => query.refetch()}>Coba lagi</Button>}
        >
          {query.error.message}
        </Notice>
      </Screen>
    );

  const questions = query.data ?? [];
  const answered = Object.keys(answers).length;
  const completion = questions.length ? (answered / questions.length) * 100 : 0;
  const isPretest = type === 'pretest';

  async function submit() {
    if (answered !== questions.length)
      return Alert.alert(
        'Jawaban belum lengkap',
        `Masih ada ${questions.length - answered} pertanyaan yang perlu dijawab.`,
      );
    try {
      setBusy(true);
      const result = await post<{
        score: number;
        correctCount: number;
        totalQuestions: number;
      }>(`/videos/${id}/${type}/submit`, {
        answers: questions.map((question) => ({
          questionId: question.id,
          selectedAnswer: answers[question.id],
        })),
      });
      await queryClient.invalidateQueries();
      Alert.alert(
        `${isPretest ? 'Pretest' : 'Posttest'} selesai`,
        `Nilai Ibu: ${result.score}`,
        [
          {
            text: 'Lanjutkan',
            onPress: () =>
              router.replace(
                isPretest
                  ? (`/respondent/videos/${id}/video-player` as never)
                  : (`/respondent/videos/${id}/posttest-completed` as never),
              ),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Tidak dapat mengirim',
        error instanceof Error ? error.message : 'Coba kembali.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={s.testHeader}>
        <View style={s.testHeaderTop}>
          <View>
            <Text style={s.testHeaderEyebrow}>
              {isPretest ? 'PRETEST' : 'POSTTEST'}
            </Text>
            <Text style={s.testHeaderTitle}>Jawab dengan tenang, Bu</Text>
          </View>
          <View
            style={[
              s.answeredPill,
              answered === questions.length && { backgroundColor: '#DDF4E8' },
            ]}
          >
            <Text
              style={[
                s.answeredPillText,
                answered === questions.length && { color: colors.success },
              ]}
            >
              {answered}/{questions.length}
            </Text>
          </View>
        </View>
        <Progress value={completion} />
        <Text style={s.testHeaderHint}>
          {answered === questions.length
            ? 'Semua pertanyaan telah dijawab.'
            : `${questions.length - answered} pertanyaan belum dijawab.`}
        </Text>
      </View>

      {questions.map((question, index) => (
        <View key={question.id} style={s.questionCard}>
          <View style={s.questionHeading}>
            <View style={s.questionNumber}>
              <Text style={s.questionNumberText}>{index + 1}</Text>
            </View>
            <Text style={s.questionText}>{question.questionText}</Text>
          </View>
          <View style={s.optionList}>
            {Object.entries(question.options).map(([key, value]) => {
              const selected = answers[question.id] === key;
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={key}
                  style={({ pressed }) => [
                    s.option,
                    selected && s.optionSelected,
                    pressed && { opacity: 0.65 },
                  ]}
                  onPress={() =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: key,
                    }))
                  }
                >
                  <View
                    style={[
                      s.optionLetterBox,
                      selected && s.optionLetterBoxSelected,
                    ]}
                  >
                    <Text
                      style={[s.optionLetter, selected && { color: 'white' }]}
                    >
                      {key.toUpperCase()}
                    </Text>
                  </View>
                  <Text
                    style={[s.optionText, selected && s.optionTextSelected]}
                  >
                    {value}
                  </Text>
                  <View
                    style={[s.optionRadio, selected && s.optionRadioSelected]}
                  >
                    {selected ? <View style={s.optionRadioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <View style={s.submitCard}>
        <View style={s.submitCopy}>
          <Text style={s.submitTitle}>
            {answered === questions.length
              ? 'Siap dikirim'
              : 'Lengkapi jawaban'}
          </Text>
          <Text style={s.submitHint}>
            Jawaban tidak dapat diubah setelah dikirim.
          </Text>
        </View>
        <Button
          disabled={busy || answered !== questions.length}
          onPress={submit}
        >
          {busy ? 'Mengirim jawaban…' : 'Kirim Semua Jawaban'}
        </Button>
      </View>
    </Screen>
  );
}
