import type { VideoStatus } from '@siaga/shared';

export type Video = {
  id: string;
  sequence_number: number;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  status: VideoStatus;
  completion_percentage: number;
  max_watched_seconds: number;
  available_at?: string;
};

export const videoStatusLabels: Record<VideoStatus, string> = {
  locked: 'Terkunci',
  pretest_required: 'Isi pretest',
  video_available: 'Video tersedia',
  video_in_progress: 'Lanjutkan video',
  waiting_posttest: 'Menunggu posttest',
  posttest_available: 'Isi posttest',
  completed: 'Selesai',
};

export function videoStatusTone(status: VideoStatus) {
  if (status === 'completed') return 'success';
  if (status === 'locked') return 'neutral';
  if (status === 'waiting_posttest') return 'warning';
  return 'neutral';
}
