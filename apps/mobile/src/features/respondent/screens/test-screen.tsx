import { useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Question } from '@siaga/shared';
import {
  Button,
  Card,
  Loading,
  Notice,
  Progress,
  Screen,
  Title,
} from '@/components/ui';
import { api, post } from '@/services/api';
import { respondentStyles as s } from '../lib/styles';

export function TestScreen({ type }: { type: 'pretest' | 'posttest' }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['questions', id, type],
    queryFn: () => api<Question[]>(`/videos/${id}/${type}`),
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  if (q.isLoading)
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  if (q.error)
    return (
      <Screen>
        <Notice action={<Button onPress={() => q.refetch()}>Coba lagi</Button>}>
          {q.error.message}
        </Notice>
      </Screen>
    );
  const questions = q.data ?? [];
  async function submit() {
    if (Object.keys(answers).length !== questions.length)
      return Alert.alert(
        'Belum lengkap',
        'Jawab semua pertanyaan sebelum mengirim.',
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
      await qc.invalidateQueries();
      Alert.alert(
        `${type === 'pretest' ? 'Pretest' : 'Posttest'} selesai`,
        `Nilai Anda: ${result.score}`,
        [
          {
            text: 'Lanjutkan',
            onPress: () =>
              router.replace(
                type === 'pretest'
                  ? (`/respondent/videos/${id}/video-player` as never)
                  : (`/respondent/videos/${id}/posttest-completed` as never),
              ),
          },
        ],
      );
    } catch (e) {
      Alert.alert(
        'Tidak dapat mengirim',
        e instanceof Error ? e.message : 'Coba kembali.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen>
      <Title
        subtitle={`${Object.keys(answers).length} dari ${questions.length} dijawab`}
      >
        {type === 'pretest' ? 'Pretest' : 'Posttest'}
      </Title>
      <Progress
        value={(Object.keys(answers).length / questions.length) * 100}
      />
      {questions.map((question, index) => (
        <Card key={question.id}>
          <Text style={s.cardTitle}>
            {index + 1}. {question.questionText}
          </Text>
          {Object.entries(question.options).map(([key, value]) => (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: answers[question.id] === key }}
              key={key}
              style={[
                s.option,
                answers[question.id] === key && s.optionSelected,
              ]}
              onPress={() => setAnswers((a) => ({ ...a, [question.id]: key }))}
            >
              <Text style={s.optionLetter}>{key.toUpperCase()}</Text>
              <Text style={{ flex: 1 }}>{value}</Text>
            </Pressable>
          ))}
        </Card>
      ))}
      <Button disabled={busy} onPress={submit}>
        {busy ? 'Mengirim…' : 'Kirim Jawaban'}
      </Button>
    </Screen>
  );
}
