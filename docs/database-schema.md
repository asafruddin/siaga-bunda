# Database schema

The authoritative schema is the ordered migration set in [`supabase/migrations/`](../supabase/migrations/). It defines users, consented respondent profiles, seven ordered videos, separate pre/post questions, immutable attempts and answers, video progress, posttest schedules, audit logs, and export logs.

Each video has 5 active, meeting-specific pretest questions and the same 25 active posttest questions. Question order is unique only within the active set. Replaced questions are deactivated instead of deleted so historical test answers keep their original question references.

The API uses the service role and is the only writer. Anonymous database access is denied except for active video metadata. Researcher reporting uses `respondent_summary`, `video_monitoring`, `test_result_summary`, `test_comparison`, and anonymized `research_export` views.

Posttest availability is promoted when the respondent opens the dashboard and `available_at` has passed. Legacy `notifications` and `expo_push_token` columns remain in the schema but are unused.
