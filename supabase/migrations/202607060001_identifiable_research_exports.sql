create or replace view public.research_export_respondents as
select
  encode(digest(r.id::text, 'sha256'), 'hex')::text as respondent_code,
  r.name,
  r.phone_number,
  r.address,
  r.age,
  r.education,
  r.occupation,
  r.hpht,
  r.hpl,
  r.pregnancy_age_weeks,
  r.number_of_children,
  r.medical_history,
  r.birth_history,
  r.husband_support,
  r.pregnancy_complication_history,
  r.consent_accepted_at,
  r.created_at as registered_at,
  r.updated_at,
  coalesce(rs.current_status, 'pretest_required') as current_status,
  coalesce(rs.completed_videos, 0) as completed_videos,
  coalesce(rs.progress_percentage, 0) as progress_percentage
from public.respondents r
left join public.respondent_summary rs on rs.id = r.id;

create or replace view public.research_export_video_progress as
select
  encode(digest(r.id::text, 'sha256'), 'hex')::text as respondent_code,
  r.name,
  r.phone_number,
  v.id as video_id,
  v.sequence_number as video_number,
  v.title as video_title,
  v.duration_seconds,
  coalesce(vp.status::text, 'locked') as status,
  coalesce(vp.completion_percentage, 0) as completion_percentage,
  coalesce(vp.max_watched_seconds, 0) as max_watched_seconds,
  coalesce(vp.duration_watched_seconds, 0) as duration_watched_seconds,
  vp.watch_started_at,
  vp.watch_completed_at,
  vp.last_checkpoint_at,
  ps.available_at as posttest_available_at,
  ps.status::text as posttest_schedule_status,
  ps.reminder_sent_at,
  r.created_at as registered_at
from public.respondents r
cross join public.videos v
left join public.video_progress vp
  on vp.respondent_id = r.id and vp.video_id = v.id
left join public.posttest_schedules ps
  on ps.respondent_id = r.id and ps.video_id = v.id
where v.is_active;

create or replace view public.research_export_test_attempts as
select
  encode(digest(r.id::text, 'sha256'), 'hex')::text as respondent_code,
  r.name,
  r.phone_number,
  v.id as video_id,
  v.sequence_number as video_number,
  v.title as video_title,
  ta.test_type::text,
  ta.score,
  ta.total_questions,
  ta.correct_count,
  ta.submitted_at,
  r.created_at as registered_at
from public.test_attempts ta
join public.respondents r on r.id = ta.respondent_id
join public.videos v on v.id = ta.video_id
where v.is_active;

create or replace view public.research_export_test_answers as
select
  encode(digest(r.id::text, 'sha256'), 'hex')::text as respondent_code,
  r.name,
  r.phone_number,
  v.id as video_id,
  v.sequence_number as video_number,
  v.title as video_title,
  ta.test_type::text,
  q.display_order,
  q.question_text,
  q.option_a,
  q.option_b,
  q.option_c,
  q.option_d,
  ans.selected_answer,
  q.correct_answer,
  ans.is_correct,
  ta.score,
  ta.submitted_at,
  r.created_at as registered_at
from public.test_answers ans
join public.test_attempts ta on ta.id = ans.test_attempt_id
join public.respondents r on r.id = ta.respondent_id
join public.videos v on v.id = ta.video_id
join public.questions q on q.id = ans.question_id
where v.is_active;

revoke all on public.research_export_respondents from anon, authenticated;
revoke all on public.research_export_video_progress from anon, authenticated;
revoke all on public.research_export_test_attempts from anon, authenticated;
revoke all on public.research_export_test_answers from anon, authenticated;
