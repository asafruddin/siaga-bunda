import { describe, expect, it } from 'vitest';
import { simplifyActivity, type TimelineActivity } from './simplify-activity';

const activity = (
  action: string,
  videoId: string,
  minute: number,
): TimelineActivity => ({
  action,
  entity_id: videoId,
  created_at: `2026-07-06T07:${String(minute).padStart(2, '0')}:00.000Z`,
});

describe('simplifyActivity', () => {
  it('keeps only the latest progress checkpoint for an active video', () => {
    const items = [
      activity('video_started', 'video-1', 40),
      activity('video_progress_updated', 'video-1', 41),
      activity('video_progress_updated', 'video-1', 42),
      activity('video_progress_updated', 'video-1', 43),
    ];

    expect(simplifyActivity(items)).toEqual([items[0], items[3]]);
  });

  it('hides checkpoints when the video has a completion milestone', () => {
    const items = [
      activity('video_started', 'video-1', 40),
      activity('video_progress_updated', 'video-1', 41),
      activity('video_completed', 'video-1', 42),
    ];

    expect(simplifyActivity(items)).toEqual([items[0], items[2]]);
  });

  it('deduplicates starts per video without merging different videos', () => {
    const items = [
      activity('video_started', 'video-1', 40),
      activity('video_started', 'video-1', 41),
      activity('video_started', 'video-2', 42),
    ];

    expect(simplifyActivity(items)).toEqual([items[0], items[2]]);
  });
});
