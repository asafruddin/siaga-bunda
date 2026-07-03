# Architecture

The Expo app talks only to the Hono API. It stores the API JWT in SecureStore and never receives the Supabase service key. The Vercel function validates role and workflow state, then accesses PostgreSQL using the server-only service role. Supabase constraints prevent duplicate attempts and invalid enum states; reporting views keep mobile researcher queries small.

Respondent state transitions are:

`pretest_required → video_available → video_in_progress → waiting_posttest → posttest_available → completed`

Only the API performs transitions. Completing a posttest creates the next video's `pretest_required` row. Dashboard requests promote overdue posttest schedules when `available_at` has passed.

Video playback exposes play, pause, and rewind only. The client reports checkpoints, while the API rejects time jumps larger than elapsed wall time and requires both maximum position and accumulated watch time before completion.
