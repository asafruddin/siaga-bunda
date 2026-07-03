import { z } from 'zod';

export const VIDEO_STATUSES = ['locked', 'pretest_required', 'video_available', 'video_in_progress', 'waiting_posttest', 'posttest_available', 'completed'] as const;
export type VideoStatus = (typeof VIDEO_STATUSES)[number];
export type Role = 'respondent' | 'researcher';
export type TestType = 'pretest' | 'posttest';

export interface ApiSuccess<T> { success: true; data: T }
export interface ApiFailure { success: false; error: { code: string; message: string } }
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface VideoProgress {
  videoId: string; sequenceNumber: number; title: string; description: string;
  videoUrl?: string; durationSeconds: number; status: VideoStatus;
  completionPercentage: number; maxWatchedSeconds: number; availableAt?: string;
}

export interface RespondentProfile {
  id: string; userId: string; name: string; age: number; phoneNumber: string;
  address: string; education: string; occupation: string; hpht: string; hpl: string;
  pregnancyAgeWeeks: number; numberOfChildren: number; medicalHistory: string;
  birthHistory: string; husbandSupport: boolean; pregnancyComplicationHistory: string;
  consentAccepted: boolean; progressPercentage?: number;
}

export interface Question { id: string; questionText: string; options: Record<'a'|'b'|'c'|'d', string> }

export const registrationSchema = z.object({
  name: z.string().trim().min(2), age: z.coerce.number().int().min(15).max(55),
  phoneNumber: z.string().regex(/^\+?[0-9]{9,15}$/), address: z.string().trim().min(5),
  education: z.string().min(1), occupation: z.string().min(1),
  hpht: z.string().date(), hpl: z.string().date(), pregnancyAgeWeeks: z.coerce.number().int().min(0).max(45),
  numberOfChildren: z.coerce.number().int().min(0).max(20), medicalHistory: z.string(), birthHistory: z.string(),
  husbandSupport: z.boolean(), pregnancyComplicationHistory: z.string(), consentAccepted: z.literal(true),
  expoPushToken: z.string().optional()
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export const testSubmissionSchema = z.object({ answers: z.array(z.object({ questionId: z.string().uuid(), selectedAnswer: z.enum(['a','b','c','d']) })).min(1) });
export const progressSchema = z.object({ currentSecond: z.number().nonnegative(), maxWatchedSecond: z.number().nonnegative(), durationWatchedSeconds: z.number().nonnegative() });

export function calculateHpl(hpht: string) { const d = new Date(`${hpht}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 280); return d.toISOString().slice(0, 10); }
export function calculatePregnancyWeeks(hpht: string, now = new Date()) { return Math.max(0, Math.floor((now.getTime() - new Date(`${hpht}T00:00:00Z`).getTime()) / 604800000)); }
export function score(correct: number, total: number) { return total ? Math.round(correct / total * 100) : 0; }
