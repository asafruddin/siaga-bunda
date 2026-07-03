const STATUS_LABELS: Record<string, string> = {
  pretest_required: 'Pretest diperlukan',
  video_available: 'Video tersedia',
  video_in_progress: 'Video berlangsung',
  waiting_posttest: 'Menunggu posttest',
  posttest_available: 'Posttest tersedia',
  completed: 'Selesai',
  locked: 'Terkunci',
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}
