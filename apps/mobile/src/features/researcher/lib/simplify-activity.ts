export type TimelineActivity = {
  action: string;
  entity_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

const oncePerVideoActions = new Set(['pretest_started', 'video_started']);

export function simplifyActivity<T extends TimelineActivity>(items: T[]): T[] {
  const completedVideos = new Set(
    items
      .filter((item) => item.action === 'video_completed' && item.entity_id)
      .map((item) => item.entity_id as string),
  );
  const latestProgress = new Map<string, T>();

  for (const item of items) {
    if (item.action === 'video_progress_updated' && item.entity_id) {
      latestProgress.set(item.entity_id, item);
    }
  }

  const seenOncePerVideo = new Set<string>();

  return items.filter((item) => {
    const videoId = item.entity_id;

    if (item.action === 'video_progress_updated' && videoId) {
      if (completedVideos.has(videoId)) return false;
      return latestProgress.get(videoId) === item;
    }

    if (oncePerVideoActions.has(item.action) && videoId) {
      const key = `${item.action}:${videoId}`;
      if (seenOncePerVideo.has(key)) return false;
      seenOncePerVideo.add(key);
    }

    return true;
  });
}
