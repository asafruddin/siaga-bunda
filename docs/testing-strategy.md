# Testing strategy

Automated checks cover TypeScript contracts and deterministic shared calculations. Before release, run the PRD QA scenarios on both iOS and Android against a disposable Supabase project. For the seven-day flow, set `POSTTEST_DELAY_DAYS=0` only in that isolated environment.

High-risk manual cases are forward-seek attempts, app background/resume, duplicate test submission, early posttest access, role escalation, expired JWT, pagination, and identifiable export access control.
