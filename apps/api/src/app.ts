import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { createClient } from '@supabase/supabase-js';
import { calculateHpl, calculatePregnancyWeeks, registrationSchema, progressSchema, testSubmissionSchema, score, type Role } from '@siaga/shared';
import { audit, auth, db, fail, issueToken, ok, researcher, row } from './lib.js';

type Variables = { user: { id: string; role: Role } };
export const app = new Hono<{ Variables: Variables }>().basePath('/api');
app.use('*', secureHeaders());
app.use('*', cors({ origin: (origin) => (process.env.ALLOWED_ORIGINS ?? '').split(',').includes(origin) ? origin : '', allowHeaders: ['Authorization', 'Content-Type', 'X-Job-Secret'] }));
app.onError((error, c) => { console.error(error); return fail(c, 'INTERNAL_ERROR', process.env.NODE_ENV === 'production' ? 'Terjadi kesalahan pada server.' : error.message, 500); });
app.get('/health', (c) => ok(c, { service: 'siaga-bunda-api', status: 'healthy', timestamp: new Date().toISOString() }));

app.post('/auth/login', async (c) => {
  const { identifier, password } = await c.req.json();
  if (!identifier || !password) return fail(c, 'VALIDATION_ERROR', 'Email dan kata sandi wajib diisi.');
  const anon = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const signed = await anon.auth.signInWithPassword({ email: identifier, password });
  if (signed.error || !signed.data.user) return fail(c, 'INVALID_CREDENTIALS', 'Email atau kata sandi salah.', 401);
  const user = row(await db().from('users').select('id,role').eq('auth_user_id', signed.data.user.id).single()) as any;
  if (!user || user.role !== 'researcher') return fail(c, 'FORBIDDEN', 'Akun bukan akun peneliti.', 403);
  return ok(c, { token: await issueToken(user), role: user.role });
});
app.get('/auth/me', auth, async (c) => {
  const user = row(await db().from('users').select('id,role,email,phone,created_at').eq('id', c.get('user').id).single());
  return ok(c, user);
});
app.post('/auth/logout', auth, (c) => ok(c, { loggedOut: true }));

app.post('/respondents/register', async (c) => {
  const parsed = registrationSchema.safeParse(await c.req.json());
  if (!parsed.success) return fail(c, 'VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Data tidak valid.');
  const input = parsed.data; const client = db();
  if (new Date(`${input.hpht}T00:00:00Z`) > new Date()) return fail(c, 'INVALID_HPHT', 'HPHT tidak boleh berada di masa depan.');
  const hpl = calculateHpl(input.hpht); const pregnancyAgeWeeks = calculatePregnancyWeeks(input.hpht);
  if (pregnancyAgeWeeks > 45) return fail(c, 'INVALID_HPHT', 'Usia kehamilan berdasarkan HPHT tidak valid.');
  const existing = await client.from('users').select('id').eq('phone', input.phoneNumber).maybeSingle();
  if (existing.data) return fail(c, 'PHONE_EXISTS', 'Nomor telepon sudah terdaftar.', 409);
  const user = row(await client.from('users').insert({ role: 'respondent', phone: input.phoneNumber }).select('id,role').single()) as any;
  const respondent = row(await client.from('respondents').insert({
    user_id: user.id, name: input.name, age: input.age, phone_number: input.phoneNumber, address: input.address,
    education: input.education, occupation: input.occupation, hpht: input.hpht, hpl,
    pregnancy_age_weeks: pregnancyAgeWeeks, number_of_children: input.numberOfChildren,
    medical_history: input.medicalHistory, birth_history: input.birthHistory, husband_support: input.husbandSupport,
    pregnancy_complication_history: input.pregnancyComplicationHistory, consent_accepted: true,
    consent_accepted_at: new Date().toISOString(), expo_push_token: input.expoPushToken
  }).select('*').single()) as any;
  const first = row(await client.from('videos').select('id').eq('is_active', true).order('sequence_number').limit(1).single()) as any;
  if (first) await client.from('video_progress').insert({ respondent_id: respondent.id, video_id: first.id, status: 'pretest_required' });
  await audit('respondent_registered', user.id, respondent.id, respondent.id);
  return ok(c, { token: await issueToken(user), role: user.role, respondentId: respondent.id }, 201);
});

app.get('/respondents/me', auth, async (c) => {
  if (c.get('user').role !== 'respondent') return fail(c, 'FORBIDDEN', 'Akses khusus responden.', 403);
  return ok(c, row(await db().from('respondents').select('*').eq('user_id', c.get('user').id).single()));
});
app.put('/respondents/me', auth, async (c) => {
  const allowed = ['address', 'occupation', 'expo_push_token']; const body = await c.req.json();
  const patch = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  return ok(c, row(await db().from('respondents').update(patch).eq('user_id', c.get('user').id).select('*').single()));
});

async function respondentFor(userId: string) { return row(await db().from('respondents').select('*').eq('user_id', userId).single()) as any; }
async function progressFor(respondentId: string, videoId: string) { return row(await db().from('video_progress').select('*').eq('respondent_id', respondentId).eq('video_id', videoId).maybeSingle()) as any; }
async function refreshAvailability(progress: any) {
  if (progress?.status === 'waiting_posttest') {
    const schedule = row(await db().from('posttest_schedules').select('*').eq('respondent_id', progress.respondent_id).eq('video_id', progress.video_id).single()) as any;
    if (schedule && new Date(schedule.available_at) <= new Date()) {
      await db().from('video_progress').update({ status: 'posttest_available' }).eq('id', progress.id);
      await db().from('posttest_schedules').update({ status: 'available' }).eq('id', schedule.id);
      progress.status = 'posttest_available'; await audit('posttest_available', undefined, progress.respondent_id, progress.video_id);
    }
    progress.available_at = schedule?.available_at;
  }
  return progress;
}

app.get('/videos', auth, async (c) => {
  const respondent = await respondentFor(c.get('user').id); const videos = row(await db().from('videos').select('*').eq('is_active', true).order('sequence_number')) as any[];
  const progresses = row(await db().from('video_progress').select('*').eq('respondent_id', respondent.id)) as any[];
  const mapped = await Promise.all(videos.map(async (video) => {
    const p = await refreshAvailability(progresses.find((item) => item.video_id === video.id));
    return { ...video, status: p?.status ?? 'locked', completion_percentage: Number(p?.completion_percentage ?? 0), max_watched_seconds: p?.max_watched_seconds ?? 0, available_at: p?.available_at };
  }));
  return ok(c, mapped);
});
app.get('/videos/:id', auth, async (c) => {
  const respondent = await respondentFor(c.get('user').id); const video = row(await db().from('videos').select('*').eq('id', c.req.param('id')).eq('is_active', true).single()) as any;
  const progress = await refreshAvailability(await progressFor(respondent.id, video.id));
  if (!progress || progress.status === 'locked') return fail(c, 'VIDEO_LOCKED', 'Selesaikan posttest video sebelumnya terlebih dahulu.', 403);
  return ok(c, { ...video, progress });
});

app.post('/videos/:id/start', auth, async (c) => {
  const respondent = await respondentFor(c.get('user').id); const p = await progressFor(respondent.id, c.req.param('id')!);
  if (!p || !['video_available', 'video_in_progress'].includes(p.status)) return fail(c, 'PRETEST_REQUIRED', 'Pretest harus diselesaikan lebih dahulu.', 403);
  const updated = row(await db().from('video_progress').update({ status: 'video_in_progress', watch_started_at: p.watch_started_at ?? new Date().toISOString(), last_checkpoint_at: new Date().toISOString() }).eq('id', p.id).select('*').single());
  await audit('video_started', c.get('user').id, respondent.id, c.req.param('id')!); return ok(c, updated);
});
app.post('/videos/:id/progress', auth, async (c) => {
  const parsed = progressSchema.safeParse(await c.req.json()); if (!parsed.success) return fail(c, 'VALIDATION_ERROR', 'Checkpoint video tidak valid.');
  const respondent = await respondentFor(c.get('user').id); const video = row(await db().from('videos').select('*').eq('id', c.req.param('id')).single()) as any;
  const p = await progressFor(respondent.id, video.id); if (!p || p.status !== 'video_in_progress') return fail(c, 'INVALID_STATE', 'Video belum dimulai.', 409);
  const elapsed = Math.max(1, (Date.now() - new Date(p.last_checkpoint_at ?? p.watch_started_at).getTime()) / 1000);
  if (parsed.data.maxWatchedSecond > Number(p.max_watched_seconds) + elapsed + 5) return fail(c, 'FORWARD_SKIP', 'Tidak dapat melewati bagian video yang belum ditonton.', 422);
  if (parsed.data.durationWatchedSeconds > Number(p.duration_watched_seconds) + elapsed + 5) return fail(c, 'INVALID_WATCH_TIME', 'Durasi menonton tidak valid.', 422);
  const max = Math.min(video.duration_seconds, Math.max(Number(p.max_watched_seconds), parsed.data.maxWatchedSecond));
  const watched = Math.min(video.duration_seconds, Math.max(Number(p.duration_watched_seconds), parsed.data.durationWatchedSeconds));
  const updated = row(await db().from('video_progress').update({ max_watched_seconds: max, duration_watched_seconds: watched, completion_percentage: Math.min(100, max / video.duration_seconds * 100), last_checkpoint_at: new Date().toISOString() }).eq('id', p.id).select('*').single());
  await audit('video_progress_updated', c.get('user').id, respondent.id, video.id, { max }); return ok(c, updated);
});
app.post('/videos/:id/complete', auth, async (c) => {
  const respondent = await respondentFor(c.get('user').id); const video = row(await db().from('videos').select('*').eq('id', c.req.param('id')).single()) as any;
  const p = await progressFor(respondent.id, video.id); const pretest = await db().from('test_attempts').select('id').eq('respondent_id', respondent.id).eq('video_id', video.id).eq('test_type', 'pretest').maybeSingle();
  if (!pretest.data || !p || Number(p.max_watched_seconds) < video.duration_seconds - 2 || Number(p.duration_watched_seconds) < video.duration_seconds * .9) return fail(c, 'VIDEO_INCOMPLETE', 'Video harus ditonton sampai selesai.', 422);
  if (['waiting_posttest','posttest_available','completed'].includes(p.status)) return ok(c, p);
  const available = new Date(Date.now() + Number(process.env.POSTTEST_DELAY_DAYS ?? 7) * 86400000).toISOString(); const client = db();
  const updated = row(await client.from('video_progress').update({ status: 'waiting_posttest', completion_percentage: 100, watch_completed_at: new Date().toISOString() }).eq('id', p.id).select('*').single());
  await client.from('posttest_schedules').upsert({ respondent_id: respondent.id, video_id: video.id, available_at: available, status: 'scheduled' }, { onConflict: 'respondent_id,video_id' });
  await audit('video_completed', c.get('user').id, respondent.id, video.id); await audit('posttest_scheduled', c.get('user').id, respondent.id, video.id, { availableAt: available });
  return ok(c, { progress: updated, availableAt: available });
});

async function getQuestions(videoId: string, type: 'pretest'|'posttest') { const result = row(await db().from('questions').select('id,question_text,option_a,option_b,option_c,option_d').eq('video_id', videoId).eq('test_type', type).eq('is_active', true).order('display_order')) as any[]; return result.map(q => ({ id: q.id, questionText: q.question_text, options: { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d } })); }
app.get('/videos/:id/pretest', auth, async (c) => {
  const respondent = await respondentFor(c.get('user').id); const p = await progressFor(respondent.id, c.req.param('id')!);
  if (!p || p.status !== 'pretest_required') return fail(c, 'INVALID_STATE', 'Pretest tidak tersedia.', 409);
  await audit('pretest_started', c.get('user').id, respondent.id, c.req.param('id')!); return ok(c, await getQuestions(c.req.param('id')!, 'pretest'));
});
app.get('/videos/:id/posttest', auth, async (c) => {
  const respondent = await respondentFor(c.get('user').id); const p = await refreshAvailability(await progressFor(respondent.id, c.req.param('id')!));
  if (!p || p.status !== 'posttest_available') return fail(c, 'POSTTEST_NOT_AVAILABLE', `Posttest belum tersedia${p?.available_at ? ` sampai ${p.available_at}` : ''}.`, 403);
  return ok(c, await getQuestions(c.req.param('id')!, 'posttest'));
});
async function submitTest(c: any, type: 'pretest'|'posttest') {
  const parsed = testSubmissionSchema.safeParse(await c.req.json()); if (!parsed.success) return fail(c, 'VALIDATION_ERROR', 'Semua pertanyaan wajib dijawab.');
  const respondent = await respondentFor(c.get('user').id); let p = await refreshAvailability(await progressFor(respondent.id, c.req.param('id')));
  const expected = type === 'pretest' ? 'pretest_required' : 'posttest_available'; if (!p || p.status !== expected) return fail(c, 'INVALID_STATE', `${type} tidak tersedia.`, 409);
  const questions = row(await db().from('questions').select('id,correct_answer').eq('video_id', c.req.param('id')).eq('test_type', type).eq('is_active', true)) as any[];
  if (questions.length !== parsed.data.answers.length || new Set(parsed.data.answers.map(a => a.questionId)).size !== questions.length) return fail(c, 'INCOMPLETE_TEST', 'Semua pertanyaan harus dijawab tepat satu kali.', 422);
  const validIds = new Set(questions.map(q => q.id)); if (parsed.data.answers.some(a => !validIds.has(a.questionId))) return fail(c, 'INVALID_QUESTION', 'Pertanyaan tidak valid.', 422);
  const correct = parsed.data.answers.filter(a => questions.find(q => q.id === a.questionId)?.correct_answer === a.selectedAnswer).length; const client = db();
  const attempt = row(await client.from('test_attempts').insert({ respondent_id: respondent.id, video_id: c.req.param('id'), test_type: type, score: score(correct, questions.length), total_questions: questions.length, correct_count: correct, submitted_at: new Date().toISOString() }).select('*').single()) as any;
  await client.from('test_answers').insert(parsed.data.answers.map(a => ({ test_attempt_id: attempt.id, question_id: a.questionId, selected_answer: a.selectedAnswer, is_correct: questions.find(q => q.id === a.questionId)?.correct_answer === a.selectedAnswer })));
  if (type === 'pretest') await client.from('video_progress').update({ status: 'video_available' }).eq('id', p.id);
  else {
    await client.from('video_progress').update({ status: 'completed' }).eq('id', p.id); await client.from('posttest_schedules').update({ status: 'completed' }).eq('respondent_id', respondent.id).eq('video_id', c.req.param('id'));
    const current = row(await client.from('videos').select('sequence_number').eq('id', c.req.param('id')).single()) as any; const next = row(await client.from('videos').select('id').eq('sequence_number', current.sequence_number + 1).eq('is_active', true).maybeSingle()) as any;
    if (next) { await client.from('video_progress').upsert({ respondent_id: respondent.id, video_id: next.id, status: 'pretest_required' }, { onConflict: 'respondent_id,video_id' }); await audit('next_video_unlocked', c.get('user').id, respondent.id, next.id); }
  }
  await audit(`${type}_submitted`, c.get('user').id, respondent.id, c.req.param('id'), { score: attempt.score }); return ok(c, { score: attempt.score, correctCount: correct, totalQuestions: questions.length });
}
app.post('/videos/:id/pretest/submit', auth, (c) => submitTest(c, 'pretest'));
app.post('/videos/:id/posttest/submit', auth, (c) => submitTest(c, 'posttest'));

app.use('/researcher/*', auth, researcher);
app.get('/researcher/overview', async (c) => ok(c, row(await db().rpc('researcher_overview'))));
app.get('/researcher/respondents', async (c) => {
  const page = Math.max(1, Number(c.req.query('page') ?? 1)); const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') ?? 20))); const search = c.req.query('search'); const status = c.req.query('status');
  let query = db().from('respondent_summary').select('*', { count: 'exact' }); if (search) query = query.ilike('name', `%${search}%`); if (status) query = query.eq('current_status', status);
  const result = await query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false }); if (result.error) throw result.error;
  return ok(c, { items: result.data, page, limit, total: result.count ?? 0, totalPages: Math.ceil((result.count ?? 0) / limit) });
});
app.get('/researcher/respondents/:id', async (c) => {
  const profile = row(await db().from('respondents').select('*').eq('id', c.req.param('id')).single());
  const progress = row(await db().from('video_progress').select('*,videos(sequence_number,title)').eq('respondent_id', c.req.param('id')).order('created_at'));
  const tests = row(await db().from('test_attempts').select('*,videos(sequence_number,title)').eq('respondent_id', c.req.param('id')).order('submitted_at'));
  const timeline = row(await db().from('audit_logs').select('action,entity_id,metadata,created_at').eq('respondent_id', c.req.param('id')).order('created_at'));
  return ok(c, { profile, progress, tests, timeline });
});
app.get('/researcher/videos/monitoring', async (c) => ok(c, row(await db().from('video_monitoring').select('*').order('sequence_number'))));
app.get('/researcher/results/comparison', async (c) => ok(c, row(await db().from('test_comparison').select('*').order('sequence_number'))));
app.get('/researcher/results/:type', async (c) => { const type = c.req.param('type'); if (!['pretest','posttest'].includes(type)) return fail(c, 'INVALID_TYPE', 'Tipe hasil tidak valid.'); return ok(c, row(await db().from('test_result_summary').select('*').eq('test_type', type).order('sequence_number'))); });
app.post('/researcher/export', async (c) => {
  const filters = await c.req.json(); const type = filters.exportType ?? 'full_dataset'; let query = db().from('research_export').select('*');
  if (filters.videoId) query = query.eq('video_id', filters.videoId); if (filters.videoNumber) query = query.eq('video_number', filters.videoNumber); if (filters.status) query = query.eq('status', filters.status); if (filters.dateFrom) query = query.gte('registered_at', filters.dateFrom); if (filters.dateTo) query = query.lte('registered_at', `${filters.dateTo}T23:59:59Z`);
  const rows = row(await query) as Record<string, unknown>[];
  const columns: Record<string,string[]> = {
    respondent_data: ['respondent_code','registered_at'], video_progress: ['respondent_code','video_number','status','completion_percentage','watch_completed_at'],
    pretest: ['respondent_code','video_number','pretest_score','registered_at'], posttest: ['respondent_code','video_number','posttest_score','posttest_available_at','posttest_submitted_at'],
    full_dataset: ['respondent_code','video_number','status','completion_percentage','pretest_score','posttest_score','registered_at','watch_completed_at','posttest_available_at','posttest_submitted_at']
  };
  const keys = columns[type] ?? columns.full_dataset; const escape = (v: unknown) => `"${String(v ?? '').replaceAll('"','""')}"`; const csv = [keys.join(','), ...rows.map(r => keys.map(k => escape(r[k])).join(','))].join('\n');
  await db().from('export_logs').insert({ researcher_user_id: c.get('user').id, export_type: type, filters }); await audit('researcher_export_requested', c.get('user').id, undefined, undefined, filters);
  c.header('Content-Type', 'text/csv; charset=utf-8'); c.header('Content-Disposition', `attachment; filename="siaga-bunda-${Date.now()}.csv"`); return c.body(`\ufeff${csv}`);
});

app.post('/jobs/send-posttest-reminders', async (c) => {
  const supplied = c.req.header('x-job-secret') ?? c.req.header('authorization')?.replace('Bearer ', ''); if (!process.env.JOB_SECRET || supplied !== process.env.JOB_SECRET) return fail(c, 'UNAUTHORIZED', 'Job secret tidak valid.', 401);
  const schedules = row(await db().from('posttest_schedules').select('*,respondents(user_id,expo_push_token),videos(sequence_number)').lte('available_at', new Date().toISOString()).is('reminder_sent_at', null).neq('status', 'completed')) as any[];
  let sent = 0; for (const schedule of schedules) {
    const message = `Ibu, saatnya mengisi posttest Video ${schedule.videos.sequence_number}.`; const notification = { user_id: schedule.respondents.user_id, title: 'Posttest tersedia', message, type: 'posttest_available', scheduled_at: schedule.available_at, status: schedule.respondents.expo_push_token ? 'pending' : 'dashboard_only' };
    if (schedule.respondents.expo_push_token) { const response = await fetch('https://exp.host/--/api/v2/push/send', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.EXPO_ACCESS_TOKEN ? { Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}` } : {}) }, body: JSON.stringify({ to: schedule.respondents.expo_push_token, title: notification.title, body: message, data: { videoId: schedule.video_id, screen: 'posttest' } }) }); notification.status = response.ok ? 'sent' : 'failed'; if (response.ok) sent++; }
    await db().from('notifications').insert({ ...notification, sent_at: notification.status === 'sent' ? new Date().toISOString() : null }); await db().from('posttest_schedules').update({ reminder_sent_at: new Date().toISOString(), status: 'available' }).eq('id', schedule.id); await db().from('video_progress').update({ status: 'posttest_available' }).eq('respondent_id', schedule.respondent_id).eq('video_id', schedule.video_id);
  }
  return ok(c, { processed: schedules.length, sent });
});
