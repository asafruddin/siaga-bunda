# Database schema

The authoritative schema is [`supabase/migrations/202607030001_initial_schema.sql`](../supabase/migrations/202607030001_initial_schema.sql). It defines users, consented respondent profiles, seven ordered videos, separate pre/post questions, immutable attempts and answers, video progress, posttest schedules, audit logs, and export logs.

The API uses the service role and is the only writer. Anonymous database access is denied except for active video metadata. Researcher reporting uses `respondent_summary`, `video_monitoring`, `test_result_summary`, `test_comparison`, and anonymized `research_export` views.

Posttest availability is promoted when the respondent opens the dashboard and `available_at` has passed. Legacy `notifications` and `expo_push_token` columns remain in the schema but are unused.
