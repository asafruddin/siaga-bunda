create extension if not exists pgcrypto;

create type public.user_role as enum ('respondent','researcher');
create type public.test_kind as enum ('pretest','posttest');
create type public.video_status as enum ('locked','pretest_required','video_available','video_in_progress','waiting_posttest','posttest_available','completed');
create type public.schedule_status as enum ('scheduled','available','completed');

create table public.users (
  id uuid primary key default gen_random_uuid(), auth_user_id uuid unique references auth.users(id) on delete set null,
  role user_role not null, email text unique, phone text unique, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.respondents (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.users(id) on delete cascade,
  name text not null, age int not null check (age between 15 and 55), phone_number text not null, address text not null,
  education text not null, occupation text not null, hpht date not null, hpl date not null, pregnancy_age_weeks int not null check (pregnancy_age_weeks between 0 and 45),
  number_of_children int not null default 0 check (number_of_children >= 0), medical_history text not null default '', birth_history text not null default '',
  husband_support boolean not null, pregnancy_complication_history text not null default '', consent_accepted boolean not null check (consent_accepted),
  consent_accepted_at timestamptz not null, expo_push_token text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.videos (
  id uuid primary key default gen_random_uuid(), sequence_number int not null unique check (sequence_number between 1 and 7), title text not null,
  description text not null, video_url text not null, duration_seconds int not null check (duration_seconds > 0), is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.questions (
  id uuid primary key default gen_random_uuid(), video_id uuid not null references public.videos(id) on delete cascade, test_type test_kind not null,
  display_order int not null check (display_order between 1 and 10), question_text text not null, option_a text not null, option_b text not null,
  option_c text not null, option_d text not null, correct_answer text not null check (correct_answer in ('a','b','c','d')), is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(video_id,test_type,display_order)
);
create table public.video_progress (
  id uuid primary key default gen_random_uuid(), respondent_id uuid not null references public.respondents(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade, status video_status not null default 'locked', max_watched_seconds numeric not null default 0,
  duration_watched_seconds numeric not null default 0, completion_percentage numeric(5,2) not null default 0 check (completion_percentage between 0 and 100),
  watch_started_at timestamptz, watch_completed_at timestamptz, last_checkpoint_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(respondent_id,video_id)
);
create table public.test_attempts (
  id uuid primary key default gen_random_uuid(), respondent_id uuid not null references public.respondents(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade, test_type test_kind not null, score int not null check (score between 0 and 100),
  total_questions int not null check (total_questions > 0), correct_count int not null check (correct_count between 0 and total_questions),
  submitted_at timestamptz not null, created_at timestamptz not null default now(), unique(respondent_id,video_id,test_type)
);
create table public.test_answers (
  id uuid primary key default gen_random_uuid(), test_attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id), selected_answer text not null check (selected_answer in ('a','b','c','d')),
  is_correct boolean not null, created_at timestamptz not null default now(), unique(test_attempt_id,question_id)
);
create table public.posttest_schedules (
  id uuid primary key default gen_random_uuid(), respondent_id uuid not null references public.respondents(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade, available_at timestamptz not null, reminder_sent_at timestamptz,
  status schedule_status not null default 'scheduled', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(respondent_id,video_id)
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, title text not null, message text not null,
  type text not null, scheduled_at timestamptz not null, sent_at timestamptz, read_at timestamptz, status text not null,
  created_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.users(id) on delete set null, respondent_id uuid references public.respondents(id) on delete set null,
  action text not null, entity_type text, entity_id uuid, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table public.export_logs (
  id uuid primary key default gen_random_uuid(), researcher_user_id uuid not null references public.users(id), export_type text not null,
  filters jsonb not null default '{}', file_url text, created_at timestamptz not null default now()
);

create index respondents_name_idx on public.respondents using gin (to_tsvector('simple', name));
create index progress_respondent_idx on public.video_progress(respondent_id,status);
create index attempts_video_type_idx on public.test_attempts(video_id,test_type);
create index schedules_due_idx on public.posttest_schedules(available_at) where reminder_sent_at is null;
create index audit_respondent_idx on public.audit_logs(respondent_id,created_at);

create function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger users_touch before update on public.users for each row execute function public.touch_updated_at();
create trigger respondents_touch before update on public.respondents for each row execute function public.touch_updated_at();
create trigger videos_touch before update on public.videos for each row execute function public.touch_updated_at();
create trigger questions_touch before update on public.questions for each row execute function public.touch_updated_at();
create trigger progress_touch before update on public.video_progress for each row execute function public.touch_updated_at();
create trigger schedules_touch before update on public.posttest_schedules for each row execute function public.touch_updated_at();

create view public.respondent_summary as
select r.id, r.name, r.age, r.hpl, r.pregnancy_age_weeks,
  round(count(*) filter (where vp.status = 'completed') / 7.0 * 100) as progress_percentage,
  coalesce((array_agg(vp.status order by v.sequence_number desc) filter (where vp.status <> 'locked'))[1]::text,'pretest_required') as current_status,
  count(*) filter (where vp.status = 'completed') as completed_videos, r.created_at
from public.respondents r left join public.video_progress vp on vp.respondent_id=r.id left join public.videos v on v.id=vp.video_id group by r.id;

create view public.video_monitoring as
select v.id as video_id, v.sequence_number, v.title,
 count(distinct ta.respondent_id) filter(where ta.test_type='pretest') as pretest_completed,
 count(distinct vp.respondent_id) filter(where vp.status in ('waiting_posttest','posttest_available','completed')) as video_completed,
 count(distinct vp.respondent_id) filter(where vp.status in ('waiting_posttest','posttest_available')) as waiting_posttest,
 count(distinct ta.respondent_id) filter(where ta.test_type='posttest') as posttest_completed
from public.videos v left join public.video_progress vp on vp.video_id=v.id left join public.test_attempts ta on ta.video_id=v.id
where v.is_active group by v.id order by v.sequence_number;

create view public.test_result_summary as
select v.id as video_id,v.sequence_number,v.title,ta.test_type,round(avg(ta.score),2) average_score,max(ta.score) highest_score,min(ta.score) lowest_score,count(*) respondent_count
from public.videos v join public.test_attempts ta on ta.video_id=v.id group by v.id,ta.test_type;

create view public.test_comparison as
select v.id video_id,v.sequence_number,v.title,round(avg(pre.score),2) average_pretest,round(avg(post.score),2) average_posttest,
 round(avg(post.score)-avg(pre.score),2) difference,
 case when avg(pre.score)>0 then round((avg(post.score)-avg(pre.score))/avg(pre.score)*100,2) else null end improvement_percentage,
 count(post.id) paired_respondents
from public.videos v left join public.test_attempts pre on pre.video_id=v.id and pre.test_type='pretest'
left join public.test_attempts post on post.video_id=v.id and post.test_type='posttest' and post.respondent_id=pre.respondent_id group by v.id;

create view public.research_export as
select encode(digest(r.id::text,'sha256'),'hex')::text as respondent_code, v.id video_id,v.sequence_number video_number,
 vp.status::text, vp.completion_percentage, pre.score pretest_score, post.score posttest_score, r.created_at registered_at,
 vp.watch_completed_at, ps.available_at posttest_available_at, post.submitted_at posttest_submitted_at
from public.respondents r cross join public.videos v left join public.video_progress vp on vp.respondent_id=r.id and vp.video_id=v.id
left join public.test_attempts pre on pre.respondent_id=r.id and pre.video_id=v.id and pre.test_type='pretest'
left join public.test_attempts post on post.respondent_id=r.id and post.video_id=v.id and post.test_type='posttest'
left join public.posttest_schedules ps on ps.respondent_id=r.id and ps.video_id=v.id;

create function public.researcher_overview() returns jsonb language sql stable as $$
 select jsonb_build_object(
  'totalRespondents',count(*),
  'activeRespondents',count(*) filter(where completed_videos < 7),
  'completedAllVideos',count(*) filter(where completed_videos = 7),
  'averageProgress',coalesce(round(avg(progress_percentage),1),0)
 ) from public.respondent_summary
$$;

alter table public.users enable row level security; alter table public.respondents enable row level security;
alter table public.videos enable row level security; alter table public.questions enable row level security;
alter table public.video_progress enable row level security; alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security; alter table public.posttest_schedules enable row level security;
alter table public.notifications enable row level security; alter table public.audit_logs enable row level security; alter table public.export_logs enable row level security;
-- The API service role bypasses RLS. Direct anon access is limited to public education metadata only.
create policy "active videos are public" on public.videos for select to anon,authenticated using (is_active);
revoke all on public.questions from anon,authenticated;
revoke all on public.respondents,public.video_progress,public.test_attempts,public.test_answers,public.posttest_schedules,public.audit_logs,public.export_logs from anon,authenticated;
