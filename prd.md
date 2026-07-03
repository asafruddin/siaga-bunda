# Product Requirements Document

# SiAGA Bunda Mobile Application

## 1. Document Information

**Product Name:** SiAGA Bunda
**Product Type:** Mobile application with backend API
**Platform:** Android and iOS
**Frontend:** React Native with Expo
**Backend:** Node.js API deployed to Vercel
**Database:** Supabase PostgreSQL
**Project Structure:** Monorepo
**Primary Users:** Pregnant mothers and researchers
**Document Type:** PRD for MVP development
**Development Method:** BMAD-ready project specification

---

# 2. Product Summary

SiAGA Bunda is a mobile education and research application for pregnant mothers. The app helps users understand pregnancy danger signs through a structured video education flow.

The application is not only an educational app, but also a controlled research tool. Each respondent must follow the required sequence:

1. Register personal and pregnancy data.
2. Open dashboard.
3. Complete pretest before each video.
4. Watch the video fully without skipping.
5. Wait 7 days for posttest availability.
6. Receive reminder notification.
7. Complete posttest.
8. Unlock the next video.

Researchers can access a mobile researcher view to monitor respondents, video progress, pretest results, posttest results, and export study data.

---



# 3. Goals



## 3.1 Product Goals

- Provide simple pregnancy danger-sign education for pregnant mothers.
- Ensure every respondent follows the same research flow.
- Prevent users from skipping required pretest, video, or posttest steps.
- Track respondent progress accurately.
- Provide researchers with mobile access to monitoring and result data.
- Support exportable research data.



## 3.2 Business / Research Goals

- Improve education delivery consistency.
- Improve respondent compliance.
- Collect measurable pretest and posttest data.
- Help researchers analyze knowledge improvement after video education.
- Create a mobile-first research monitoring system.

---



# 4. Non-Goals

The MVP will not include:

- Doctor consultation.
- Chat feature.
- Telemedicine.
- Payment.
- Community forum.
- AI medical diagnosis.
- Desktop web dashboard.
- Offline video download.
- Complex CMS for video/question management.
- Multi-language support.
- Public landing page.

---



# 5. User Roles



## 5.1 Respondent / Pregnant Mother

The respondent is the main app user.

Respondent can:

- Register identity and pregnancy data.
- View dashboard.
- Complete pretest.
- Watch education video.
- Receive posttest reminder.
- Complete posttest.
- View learning progress.
- Access unlocked videos.

Respondent cannot:

- Skip videos.
- Open posttest before scheduled date.
- Open next video before completing previous posttest.
- Access researcher monitoring screens.

---



## 5.2 Researcher

The researcher monitors study progress.

Researcher can:

- Login to researcher mode.
- View mobile researcher home.
- View total respondents.
- View respondent list.
- View respondent detail.
- Monitor progress per video.
- View average pretest results.
- View average posttest results.
- View pretest vs posttest comparison.
- Export data.

Researcher cannot:

- Change respondent answers.
- Manually manipulate scores.
- Bypass respondent flow.
- Access respondent account as the respondent.

---



# 6. Target Platform



## 6.1 Mobile App

The mobile app will be built with:

- React Native
- Expo SDK 56 or latest stable Expo SDK at development time
- TypeScript
- Expo Router or React Navigation
- Android and iOS support



## 6.2 Backend

The backend will be built as a deployable API service for Vercel.

Recommended backend characteristics:

- Node.js
- TypeScript
- Serverless-friendly structure
- REST API
- Supabase client integration
- JWT-based authentication or Supabase Auth integration
- Background scheduling strategy for posttest reminders



## 6.3 Database

The database will use Supabase PostgreSQL.

Supabase will store:

- Users
- Respondent profiles
- Videos
- Questions
- Test attempts
- Test answers
- Video progress
- Posttest schedules
- Notifications
- Export logs

---



# 7. Product Flow



## 7.1 Respondent Main Flow

1. User opens app.
2. User sees splash screen.
3. User sees onboarding/front page.
4. User taps “Mulai Sekarang”.
5. User completes registration.
6. User enters dashboard.
7. User opens Video 1.
8. User completes pretest.
9. User watches video until 100%.
10. System schedules posttest for 7 days later.
11. User receives posttest reminder.
12. User completes posttest.
13. System unlocks Video 2.
14. Flow repeats until Video 7 is completed.

---



## 7.2 Researcher Main Flow

1. Researcher opens app.
2. Researcher chooses “Masuk sebagai Peneliti”.
3. Researcher logs in.
4. Researcher sees mobile monitoring home.
5. Researcher views respondent list.
6. Researcher views respondent detail.
7. Researcher monitors video progress.
8. Researcher views pretest result.
9. Researcher views posttest result.
10. Researcher exports data.

---



# 8. MVP Feature Scope



## 8.1 Respondent Features



### F-001: Splash Screen

The app must show a splash screen with:

- SiAGA Bunda logo.
- Tagline.
- Soft visual identity.

Acceptance criteria:

- Splash appears when app opens.
- Splash redirects to onboarding or dashboard depending on auth state.
- Splash does not block app for too long.

---



### F-002: Onboarding / Front Page

The app must show a front page explaining the app.

Content:

- Logo.
- Tagline: “Kenali Tanda Bahaya, Lindungi Ibu dan Bayi”.
- Short description.
- Button: “Mulai Sekarang”.
- Link: “Masuk sebagai Peneliti”.

Acceptance criteria:

- Respondent can start registration.
- Researcher can access login.
- UI is simple and mobile-friendly.

---



### F-003: Respondent Registration

The app must allow pregnant mothers to register.

Registration is divided into 3 steps.

#### Step 1: Identity Data

Fields:

- Name
- Age
- Phone number
- Address
- Education
- Occupation



#### Step 2: Pregnancy Data

Fields:

- HPHT
- HPL
- Pregnancy age
- Number of children
- Medical history
- Birth history



#### Step 3: Supporting Data

Fields:

- Husband support
- Medical history
- Pregnancy complication history
- Consent checkbox

Acceptance criteria:

- Required fields are validated.
- HPHT is selected using date picker.
- HPL is calculated automatically.
- Pregnancy age is calculated automatically.
- User cannot submit if required fields are empty.
- User cannot submit if consent is required but unchecked.
- After successful registration, user goes to dashboard.

---



### F-004: Respondent Dashboard

The dashboard must show respondent progress.

Content:

- Greeting.
- Pregnancy age.
- HPL.
- Education completion percentage.
- Video 1 to Video 7 list.
- Status per video.
- Next required action.

Video statuses:

- Locked
- Pretest required
- Video available
- Video in progress
- Waiting posttest
- Posttest available
- Completed

Acceptance criteria:

- Dashboard loads correct respondent data.
- Dashboard shows correct video status.
- User can open available video.
- User cannot open locked video.
- Locked video shows explanation.

---



### F-005: Pretest Flow

Each video requires pretest before video opens.

Content:

- Pretest intro screen.
- 10 multiple-choice questions.
- One answer per question.
- Submit confirmation.
- Score calculation.

Acceptance criteria:

- User cannot open video before pretest.
- User can answer 10 questions.
- User cannot submit incomplete pretest.
- System calculates score automatically.
- System stores answers and score.
- Video becomes available after pretest submission.

---



### F-006: Video Watching Flow

User must watch the video fully.

Requirements:

- Video cannot be skipped forward.
- User can pause and resume.
- Watch progress is tracked.
- Watch duration is stored.
- Video is completed only after 100%.

Acceptance criteria:

- User cannot seek forward beyond watched duration.
- User can replay already watched portion.
- App sends progress updates to backend.
- Backend stores progress checkpoints.
- Finish button is disabled until video reaches 100%.
- After video completion, system creates posttest schedule.

---



### F-007: Posttest Scheduling

After video is completed, the system schedules posttest 7 days later.

Acceptance criteria:

- Posttest is not available immediately.
- System stores posttest availability date.
- Dashboard shows waiting state.
- Dashboard shows posttest available date.
- Next video remains locked.

---



### F-008: Reminder Notification

The system must remind user when posttest is available.

Notification message example:

“Ibu, saatnya mengisi posttest Video 1.”

Acceptance criteria:

- Notification is scheduled after video completion.
- Notification is sent when posttest becomes available.
- Dashboard also shows posttest availability.
- User can open posttest from dashboard even if notification is missed.

---



### F-009: Posttest Flow

Posttest becomes available after 7 days.

Content:

- Posttest intro.
- 10 multiple-choice questions.
- Submit button.
- Score result.
- Next video unlock information.

Acceptance criteria:

- User cannot open posttest before available date.
- User can answer all questions.
- User cannot submit incomplete posttest.
- System calculates score automatically.
- System stores answers and score.
- Video status becomes completed.
- Next video becomes unlocked.

---



### F-010: Profile

Respondent can view profile data.

Content:

- Identity data.
- Pregnancy data.
- Supporting data.
- Education progress.

Acceptance criteria:

- User can view profile.
- User can see registered data.
- Editing profile can be disabled for MVP or limited to safe fields.

---



# 9. Researcher Features



## F-011: Researcher Login

Researcher can login from mobile app.

Acceptance criteria:

- Researcher can enter username/email and password.
- Invalid login shows error.
- Successful login opens researcher home.
- Researcher role is validated by backend.

---



## F-012: Researcher Mobile Home

Researcher home shows summary cards.

Content:

- Total respondents.
- Active respondents.
- Completed all videos.
- Average progress.
- Quick menu:
  - Respondents
  - Video Monitoring
  - Pretest Results
  - Posttest Results
  - Comparison
  - Export Data

Acceptance criteria:

- Researcher sees latest summary.
- Summary numbers are fetched from backend.
- UI uses mobile card layout, not desktop dashboard layout.

---



## F-013: Respondent List

Researcher can view list of respondents.

Content per card:

- Respondent name.
- Age.
- Pregnancy age.
- HPL.
- Current video status.
- Progress percentage.

Filters:

- Search by name.
- Filter by video status.
- Filter by completion status.

Acceptance criteria:

- Researcher can scroll respondent list.
- Researcher can search respondent.
- Researcher can open respondent detail.
- List supports pagination.

---



## F-014: Respondent Detail

Researcher can view respondent detail.

Content:

- Identity data.
- Pregnancy data.
- Supporting data.
- Current progress.
- Video progress timeline.
- Pretest and posttest scores.

Acceptance criteria:

- Researcher can see complete respondent detail.
- Researcher can see timeline.
- Researcher cannot modify score.
- Sensitive data is only visible to authorized researcher.

---



## F-015: Video Monitoring

Researcher can monitor progress per video.

Content per video:

- Number of respondents who completed pretest.
- Number of respondents who completed video.
- Number of respondents waiting for posttest.
- Number of respondents who completed posttest.

Acceptance criteria:

- Researcher can view Video 1 to Video 7 monitoring.
- Counts are correct.
- Researcher can tap a video to filter respondent list.

---



## F-016: Pretest Results

Researcher can view pretest summary.

Content:

- Average score per video.
- Highest score.
- Lowest score.
- Number of respondents.

Acceptance criteria:

- Scores are grouped by video.
- Data is accurate.
- Empty state is shown when no data exists.

---



## F-017: Posttest Results

Researcher can view posttest summary.

Content:

- Average score per video.
- Highest score.
- Lowest score.
- Number of respondents.

Acceptance criteria:

- Scores are grouped by video.
- Data is accurate.
- Empty state is shown when no data exists.

---



## F-018: Pretest vs Posttest Comparison

Researcher can compare learning improvement.

Content:

- Average pretest score.
- Average posttest score.
- Difference.
- Percentage improvement.

Acceptance criteria:

- Comparison is available per video.
- System handles missing posttest data.
- Data is shown in simple mobile-friendly cards.

---



## F-019: Export Data

Researcher can export study data.

Export filters:

- Date range.
- Video number.
- Respondent status.
- Test type.

Export types:

- Respondent data.
- Video progress data.
- Pretest results.
- Posttest results.
- Full research dataset.

Acceptance criteria:

- Researcher can request export.
- Backend generates CSV or Excel-compatible file.
- Export excludes unnecessary sensitive fields when possible.
- Export action is logged.

---



# 10. Core Business Rules



## BR-001: First Video Availability

After registration, Video 1 status is `pretest_required`.

## BR-002: Pretest Required

Video cannot be watched before pretest is submitted.

## BR-003: Video Completion

Video is only completed when watch progress reaches 100%.

## BR-004: No Forward Skip

User cannot move the video forward beyond the maximum watched timestamp.

## BR-005: Posttest Delay

Posttest becomes available exactly 7 days after video completion.

## BR-006: Next Video Locking

Next video is locked until previous video posttest is completed.

## BR-007: Final Completion

The education program is completed when Posttest Video 7 is completed.

## BR-008: Researcher Access

Only users with researcher role can access researcher screens and researcher APIs.

## BR-009: Score Calculation

Score is calculated as:

Correct answers / total questions × 100

For 10 questions:

- 10 correct = 100
- 8 correct = 80
- 5 correct = 50



## BR-010: Audit Trail

Important actions must be timestamped.

Tracked actions:

- Registration submitted.
- Pretest started.
- Pretest submitted.
- Video started.
- Video progress updated.
- Video completed.
- Posttest scheduled.
- Notification sent.
- Posttest submitted.
- Next video unlocked.

---



# 11. Non-Functional Requirements



## NFR-001: Usability

The app must be easy to use by pregnant mothers.

Requirements:

- Large readable text.
- Clear buttons.
- Minimal form complexity.
- Friendly Indonesian language.
- Clear status messages.
- Clear next action.

---



## NFR-002: Reliability

The app must preserve research flow accuracy.

Requirements:

- Backend controls lock/unlock status.
- Backend validates posttest availability date.
- Backend validates video completion.
- User cannot bypass app flow from frontend only.

---



## NFR-003: Security

The app handles sensitive personal and pregnancy data.

Requirements:

- Authentication required.
- Role-based access control.
- Secure API authorization.
- Sensitive environment variables stored securely.
- Supabase service role key must never be exposed to mobile app.
- Mobile app only uses public-safe keys.
- Researcher APIs must be protected.

---



## NFR-004: Privacy

Requirements:

- Consent must be collected before storing respondent data.
- Export should avoid unnecessary sensitive data.
- Researcher access should be limited.
- Data deletion policy should be defined before production release.

---



## NFR-005: Performance

Requirements:

- Dashboard loads within acceptable time on normal mobile connection.
- Respondent list uses pagination.
- Video progress update should be throttled.
- Heavy aggregation should be handled by backend queries or database views.
- Mobile app should avoid unnecessary re-renders.

---



## NFR-006: Maintainability

Requirements:

- Monorepo structure.
- Shared TypeScript types.
- Clear feature-based folder structure.
- API contract documented.
- Reusable UI components.
- Separation between app, API, database, and shared packages.

---



# 12. Recommended Technical Stack



## 12.1 Monorepo

Recommended tools:

- pnpm workspace or Turborepo.
- TypeScript across all apps.
- Shared package for types, constants, validators, and API schemas.

---



## 12.2 Mobile App

Recommended stack:

- Expo SDK 56 or latest stable.
- React Native.
- TypeScript.
- Expo Router.
- React Hook Form.
- Zod validation.
- TanStack Query for server state.
- Zustand for local app state when needed.
- Expo AV or Expo video package for video playback.
- Expo Notifications for push notifications.
- AsyncStorage or SecureStore for local token/session handling.
- NativeWind or StyleSheet-based design system.

---



## 12.3 Backend

Recommended stack:

- Node.js.
- TypeScript.
- Vercel Functions.
- Hono, Express-compatible handler, or lightweight API routing.
- Supabase JS client.
- Zod for request validation.
- JWT/session validation.
- CSV export generator.
- Scheduled job endpoint for reminders.

---



## 12.4 Database

Recommended:

- Supabase PostgreSQL.
- Row Level Security where applicable.
- Database functions or views for researcher aggregation.
- Storage bucket if video assets are managed in Supabase.
- Separate table for audit logs.

---



# 13. Monorepo Structure

```txt
siaga-bunda/
  apps/
    mobile/
      app/
        _layout.tsx
        index.tsx
        onboarding.tsx
        auth/
          researcher-login.tsx
        respondent/
          register/
            step-1.tsx
            step-2.tsx
            step-3.tsx
          dashboard.tsx
          videos/
            [videoId]/
              index.tsx
              pretest-intro.tsx
              pretest.tsx
              video-player.tsx
              video-completed.tsx
              posttest-intro.tsx
              posttest.tsx
              posttest-completed.tsx
          profile.tsx
        researcher/
          home.tsx
          respondents.tsx
          respondent-detail.tsx
          video-monitoring.tsx
          pretest-results.tsx
          posttest-results.tsx
          comparison.tsx
          export.tsx
      src/
        components/
          ui/
          forms/
          cards/
          feedback/
        features/
          auth/
          registration/
          dashboard/
          videos/
          tests/
          researcher/
          notifications/
        services/
          api-client.ts
          auth-service.ts
          notification-service.ts
        hooks/
        stores/
        utils/
        constants/
        types/
      app.json
      package.json

    api/
      api/
        auth/
          login.ts
          me.ts
          logout.ts
        respondents/
          register.ts
          me.ts
          index.ts
          [id].ts
        videos/
          index.ts
          [id].ts
          start.ts
          progress.ts
          complete.ts
        tests/
          pretest.ts
          submit-pretest.ts
          posttest.ts
          submit-posttest.ts
        researcher/
          overview.ts
          respondents.ts
          respondent-detail.ts
          video-monitoring.ts
          pretest-results.ts
          posttest-results.ts
          comparison.ts
          export.ts
        jobs/
          send-posttest-reminders.ts
      src/
        lib/
          supabase.ts
          auth.ts
          response.ts
        modules/
          auth/
          respondents/
          videos/
          tests/
          researcher/
          notifications/
          exports/
        validators/
        types/
      vercel.json
      package.json

  packages/
    shared/
      src/
        types/
        constants/
        schemas/
        utils/
      package.json

    config/
      eslint/
      tsconfig/
      prettier/

  supabase/
    migrations/
    seed/
    policies/
    functions/

  docs/
    prd.md
    architecture.md
    api-contract.md
    database-schema.md
    ux-flow.md
    testing-strategy.md

  package.json
  pnpm-workspace.yaml
  turbo.json
  README.md
```

---



# 14. Mobile App Structure Principles



## 14.1 Route Layer

Use the `app/` folder only for navigation entry points.

Each route file should be thin.

Example:

```txt
app/respondent/dashboard.tsx
```

Should only connect screen container:

```txt
DashboardScreen
```

---



## 14.2 Feature Layer

Business logic should live inside `src/features`.

Example:

```txt
src/features/videos/
  components/
  hooks/
  services/
  utils/
  types/
```

---



## 14.3 Shared UI Layer

Reusable UI should live inside:

```txt
src/components/ui/
```

Examples:

- Button
- TextInput
- Card
- ProgressBar
- Badge
- EmptyState
- LoadingView
- ErrorView
- ScreenHeader

---



## 14.4 API Layer

All API calls should be centralized.

Example:

```txt
src/services/api-client.ts
```

Feature services should call the shared API client.

Example:

```txt
src/features/tests/services/test-api.ts
```

---



## 14.5 State Management

Use:

- TanStack Query for server data.
- Zustand only for local UI/app state.
- React Hook Form for form state.
- SecureStore for secure local session if needed.

Avoid:

- Storing backend truth in local state.
- Managing server data manually with useEffect everywhere.

---



# 15. Backend Structure Principles



## 15.1 Serverless API

The backend must be deployable to Vercel.

Each API endpoint should be simple and serverless-friendly.

Responsibilities:

- Validate request.
- Authenticate user.
- Authorize role.
- Call service function.
- Return consistent response.

---



## 15.2 Backend Modules

Business logic should be grouped by module:

```txt
src/modules/respondents/
src/modules/videos/
src/modules/tests/
src/modules/researcher/
src/modules/notifications/
```

Each module can include:

- service.ts
- repository.ts
- mapper.ts
- types.ts

---



## 15.3 Supabase Access

The backend should use Supabase service role key only on the server side.

Mobile app must not use service role key.

Backend responsibilities:

- Secure database access.
- Apply role-based logic.
- Validate respondent ownership.
- Validate researcher permissions.
- Generate exports.

---



# 16. Database Schema



## 16.1 users

Stores app users.

Fields:

- id UUID primary key
- role text: respondent / researcher
- email text nullable
- phone text nullable
- password_hash text nullable if not using Supabase Auth directly
- created_at timestamp
- updated_at timestamp

---



## 16.2 respondents

Stores respondent profile.

Fields:

- id UUID primary key
- user_id UUID foreign key
- name text
- age integer
- phone_number text
- address text
- education text
- occupation text
- hpht date
- hpl date
- pregnancy_age_weeks integer
- number_of_children integer
- medical_history text
- birth_history text
- husband_support boolean
- pregnancy_complication_history text
- consent_accepted boolean
- created_at timestamp
- updated_at timestamp

---



## 16.3 videos

Stores education videos.

Fields:

- id UUID primary key
- sequence_number integer
- title text
- description text
- video_url text
- duration_seconds integer
- is_active boolean
- created_at timestamp
- updated_at timestamp

---



## 16.4 questions

Stores test questions.

Fields:

- id UUID primary key
- video_id UUID foreign key
- test_type text: pretest / posttest
- question_text text
- option_a text
- option_b text
- option_c text
- option_d text
- correct_answer text
- is_active boolean
- created_at timestamp
- updated_at timestamp

---



## 16.5 test_attempts

Stores test submissions.

Fields:

- id UUID primary key
- respondent_id UUID foreign key
- video_id UUID foreign key
- test_type text: pretest / posttest
- score integer
- total_questions integer
- correct_count integer
- submitted_at timestamp
- created_at timestamp

---



## 16.6 test_answers

Stores selected answers.

Fields:

- id UUID primary key
- test_attempt_id UUID foreign key
- question_id UUID foreign key
- selected_answer text
- is_correct boolean
- created_at timestamp

---



## 16.7 video_progress

Stores respondent video progress.

Fields:

- id UUID primary key
- respondent_id UUID foreign key
- video_id UUID foreign key
- status text
- max_watched_seconds integer
- duration_watched_seconds integer
- completion_percentage numeric
- watch_started_at timestamp
- watch_completed_at timestamp
- created_at timestamp
- updated_at timestamp

Status values:

- locked
- pretest_required
- video_available
- video_in_progress
- waiting_posttest
- posttest_available
- completed

---



## 16.8 posttest_schedules

Stores posttest availability.

Fields:

- id UUID primary key
- respondent_id UUID foreign key
- video_id UUID foreign key
- available_at timestamp
- reminder_sent_at timestamp nullable
- status text: scheduled / available / completed
- created_at timestamp
- updated_at timestamp

---



## 16.9 notifications

Stores notification history.

Fields:

- id UUID primary key
- user_id UUID foreign key
- title text
- message text
- type text
- scheduled_at timestamp
- sent_at timestamp nullable
- read_at timestamp nullable
- status text
- created_at timestamp

---



## 16.10 audit_logs

Stores important system actions.

Fields:

- id UUID primary key
- user_id UUID nullable
- respondent_id UUID nullable
- action text
- entity_type text
- entity_id UUID nullable
- metadata jsonb
- created_at timestamp

---



## 16.11 export_logs

Stores export actions.

Fields:

- id UUID primary key
- researcher_user_id UUID
- export_type text
- filters jsonb
- file_url text nullable
- created_at timestamp

---



# 17. API Requirements



## 17.1 API Response Format

All API responses should use consistent format.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  }
}
```

---



# 18. API Endpoint List



## Auth



### POST /api/auth/login

Login respondent or researcher.

Request:

```json
{
  "identifier": "user@email.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "role": "researcher"
  }
}
```

---



### GET /api/auth/me

Get current authenticated user.

---



### POST /api/auth/logout

Logout current user.

---



## Respondent



### POST /api/respondents/register

Create respondent profile.

---



### GET /api/respondents/me

Get current respondent profile.

---



### PUT /api/respondents/me

Update limited respondent profile fields.

---



## Videos



### GET /api/videos

Get all videos with respondent-specific status.

---



### GET /api/videos/:id

Get video detail.

---



### POST /api/videos/:id/start

Record video watch start.

---



### POST /api/videos/:id/progress

Update video progress.

Request:

```json
{
  "currentSecond": 120,
  "maxWatchedSecond": 120,
  "completionPercentage": 40
}
```

---



### POST /api/videos/:id/complete

Complete video when valid.

Backend validation:

- User has submitted pretest.
- Video progress is 100%.
- Duration is valid.
- Video not already completed.

---



## Tests



### GET /api/videos/:id/pretest

Get pretest questions.

---



### POST /api/videos/:id/pretest/submit

Submit pretest answers.

---



### GET /api/videos/:id/posttest

Get posttest questions.

Backend validation:

- Posttest schedule exists.
- Current date is greater than or equal to available date.
- Posttest not already submitted.

---



### POST /api/videos/:id/posttest/submit

Submit posttest answers.

Backend behavior:

- Calculate score.
- Mark posttest schedule completed.
- Mark current video completed.
- Unlock next video.

---



## Researcher



### GET /api/researcher/overview

Get researcher summary.

---



### GET /api/researcher/respondents

Query params:

- search
- status
- page
- limit

---



### GET /api/researcher/respondents/:id

Get respondent detail.

---



### GET /api/researcher/videos/monitoring

Get video monitoring summary.

---



### GET /api/researcher/results/pretest

Get pretest result summary.

---



### GET /api/researcher/results/posttest

Get posttest result summary.

---



### GET /api/researcher/results/comparison

Get pretest vs posttest comparison.

---



### POST /api/researcher/export

Generate export.

Request:

```json
{
  "exportType": "full_dataset",
  "dateFrom": "2026-01-01",
  "dateTo": "2026-12-31",
  "videoId": null,
  "status": null
}
```

---



## Jobs



### POST /api/jobs/send-posttest-reminders

Scheduled endpoint for sending posttest reminders.

Backend behavior:

- Find schedules where available_at <= now.
- Check reminder_sent_at is null.
- Send notification.
- Update reminder_sent_at.
- Update schedule status to available.

Security:

- Endpoint must be protected with secret token.

---



# 19. Notification Requirements



## 19.1 Notification Types

- Posttest available.
- Optional: registration success.
- Optional: education progress reminder.



## 19.2 Posttest Reminder

Trigger:

- 7 days after video completion.

Message:

“Ibu, saatnya mengisi posttest Video [number].”

Fallback:

- Dashboard must show posttest availability even if notification fails.

---



# 20. Video Tracking Requirements



## 20.1 Progress Checkpoint

The mobile app should send progress updates periodically.

Recommended:

- Every 10–15 seconds.
- On pause.
- On app background.
- On video completion.



## 20.2 No-Skip Rule

The mobile app should block forward seeking.

Backend should also validate:

- completion_percentage
- duration_watched_seconds
- max_watched_seconds
- video duration



## 20.3 Resume Behavior

If user leaves before completion:

- Save latest progress.
- Resume from last watched position.
- Do not mark as complete.

---



# 21. UI / UX Requirements



## 21.1 Design Direction

Style:

- Mobile-first.
- Clean wireframe to final soft medical design.
- Friendly and calm.
- Maternal health visual language.

Suggested colors:

- Soft pink.
- Light purple.
- White.
- Soft blue.
- Neutral gray.



## 21.2 Component Requirements

Reusable components:

- AppButton
- AppTextInput
- AppSelect
- AppDatePicker
- AppCard
- ProgressBar
- VideoStatusBadge
- QuestionOption
- EmptyState
- LoadingState
- ErrorState
- ScreenContainer
- ResearcherSummaryCard

---



# 22. Environment Variables



## 22.1 Mobile App

```txt
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Note:

Mobile app must only use public-safe environment values.

---



## 22.2 Backend

```txt
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
JWT_SECRET=
JOB_SECRET=
EXPO_ACCESS_TOKEN=
```

Important:

`SUPABASE_SERVICE_ROLE_KEY` must only be stored in Vercel backend environment variables.

---



# 23. Data Privacy and Consent

The app collects sensitive data related to pregnancy and health history.

Consent should be shown before registration submission.

Example consent:

“Saya menyetujui proses pengumpulan dan pemrosesan data pribadi untuk keperluan edukasi dan penelitian sesuai ketentuan yang berlaku.”

Requirements:

- User must accept consent before submitting registration.
- Consent timestamp should be stored.
- Researcher export should be controlled.
- Sensitive data should be minimized where possible.

---



# 24. Analytics and Audit



## 24.1 Required Audit Events

- respondent_registered
- pretest_started
- pretest_submitted
- video_started
- video_progress_updated
- video_completed
- posttest_scheduled
- posttest_available
- posttest_submitted
- next_video_unlocked
- researcher_export_requested



## 24.2 Research Metrics

Track:

- Total respondents.
- Active respondents.
- Completion rate per video.
- Pretest average per video.
- Posttest average per video.
- Score improvement per video.
- Drop-off point.

---



# 25. MVP User Stories



## Epic 1: Project Foundation



### Story 1.1: Setup Monorepo

As a developer, I want a monorepo setup so that mobile app, backend, and shared packages are managed in one project.

Acceptance criteria:

- Monorepo is created.
- Mobile app exists under apps/mobile.
- Backend exists under apps/api.
- Shared package exists under packages/shared.
- TypeScript is configured.
- Linting and formatting are configured.

---



### Story 1.2: Setup Mobile App

As a developer, I want a proper Expo React Native structure so that the app is maintainable.

Acceptance criteria:

- Expo app is created.
- App uses TypeScript.
- Navigation is configured.
- Base UI components are created.
- Environment config is available.

---



### Story 1.3: Setup Backend API

As a developer, I want a Vercel-ready backend so that the API can be deployed easily.

Acceptance criteria:

- Backend can run locally.
- Backend can deploy to Vercel.
- Health check endpoint exists.
- Supabase connection works.
- API response format is standardized.

---



## Epic 2: Authentication and Roles



### Story 2.1: Respondent Session

As a respondent, I want to stay logged in so that I do not need to register repeatedly.

Acceptance criteria:

- Respondent session is stored securely.
- App checks session on launch.
- Expired session redirects to onboarding.

---



### Story 2.2: Researcher Login

As a researcher, I want to login so that I can monitor respondents.

Acceptance criteria:

- Researcher can login.
- Role is validated.
- Researcher is redirected to researcher home.
- Invalid login shows error.

---



## Epic 3: Registration



### Story 3.1: Identity Form

As a respondent, I want to enter my identity data.

Acceptance criteria:

- Required fields are validated.
- User can continue only when valid.

---



### Story 3.2: Pregnancy Form

As a respondent, I want to enter pregnancy data.

Acceptance criteria:

- HPHT can be selected.
- HPL is auto-calculated.
- Pregnancy age is auto-calculated.

---



### Story 3.3: Supporting Data Form

As a respondent, I want to enter supporting data and consent.

Acceptance criteria:

- User can select husband support.
- User can enter complication history.
- User must accept consent.
- Data is saved to backend.

---



## Epic 4: Respondent Dashboard



### Story 4.1: View Dashboard

As a respondent, I want to view my education progress.

Acceptance criteria:

- Dashboard shows pregnancy summary.
- Dashboard shows video list.
- Dashboard shows progress percentage.
- Dashboard shows next required action.

---



### Story 4.2: Locked Video Feedback

As a respondent, I want to know why a video is locked.

Acceptance criteria:

- Locked video cannot be opened.
- App shows reason for lock.
- App shows required action.

---



## Epic 5: Pretest



### Story 5.1: Start Pretest

As a respondent, I want to start pretest before watching video.

Acceptance criteria:

- Pretest intro is shown.
- User can start test.
- Questions are loaded from backend.

---



### Story 5.2: Submit Pretest

As a respondent, I want to submit my answers.

Acceptance criteria:

- User answers all questions.
- App validates incomplete answers.
- Backend calculates score.
- Video becomes available.

---



## Epic 6: Video Education



### Story 6.1: Watch Video

As a respondent, I want to watch educational video.

Acceptance criteria:

- Video player loads.
- User can pause and resume.
- User cannot skip forward.
- Progress is tracked.

---



### Story 6.2: Complete Video

As a respondent, I want video to be marked complete after watching fully.

Acceptance criteria:

- Completion only happens at 100%.
- Backend validates progress.
- Posttest schedule is created.
- Dashboard shows waiting posttest status.

---



## Epic 7: Posttest



### Story 7.1: Receive Posttest Reminder

As a respondent, I want to be reminded when posttest is available.

Acceptance criteria:

- Notification is sent after 7 days.
- Dashboard shows posttest available state.
- User can open posttest.

---



### Story 7.2: Submit Posttest

As a respondent, I want to complete posttest.

Acceptance criteria:

- Posttest is only available after schedule date.
- User answers all questions.
- Backend calculates score.
- Current video is completed.
- Next video is unlocked.

---



## Epic 8: Researcher Monitoring



### Story 8.1: Researcher Home

As a researcher, I want to see study summary.

Acceptance criteria:

- Home shows total respondents.
- Home shows active respondents.
- Home shows average progress.
- Home shows completed respondents.

---



### Story 8.2: Respondent List

As a researcher, I want to see respondent list.

Acceptance criteria:

- List is paginated.
- Search works.
- Filter works.
- Detail can be opened.

---



### Story 8.3: Respondent Detail

As a researcher, I want to see individual respondent progress.

Acceptance criteria:

- Detail shows profile data.
- Detail shows video progress.
- Detail shows test scores.
- Detail shows timeline.

---



### Story 8.4: Video Monitoring

As a researcher, I want to monitor each video.

Acceptance criteria:

- Video 1–7 cards are shown.
- Each card shows pretest, video, waiting posttest, and posttest counts.

---



### Story 8.5: Result Summary

As a researcher, I want to view pretest and posttest summaries.

Acceptance criteria:

- Average score is shown per video.
- Highest and lowest score are shown.
- Missing data is handled.

---



## Epic 9: Export



### Story 9.1: Export Data

As a researcher, I want to export research data.

Acceptance criteria:

- Researcher can select filters.
- Backend generates export.
- Export is downloadable/shareable.
- Export action is logged.

---



# 26. Release Plan



## Phase 1: Technical Foundation

Deliverables:

- Monorepo.
- Mobile app base.
- Backend base.
- Supabase schema.
- Auth setup.
- Base UI components.



## Phase 2: Respondent Core Flow

Deliverables:

- Registration.
- Dashboard.
- Video list.
- Pretest.
- Video player.
- Video progress tracking.



## Phase 3: Posttest and Locking

Deliverables:

- Posttest scheduling.
- Notification.
- Posttest flow.
- Unlock next video.
- Completion progress.



## Phase 4: Researcher Mobile Monitoring

Deliverables:

- Researcher login.
- Researcher home.
- Respondent list.
- Respondent detail.
- Video monitoring.
- Result summary.



## Phase 5: Export and QA

Deliverables:

- Export data.
- Audit logs.
- QA testing.
- UAT.
- Production deployment.

---



# 27. QA Test Scenarios



## Registration

- Submit empty form.
- Submit invalid phone number.
- Select HPHT and verify HPL.
- Submit complete registration.
- Verify dashboard opens.



## Pretest

- Try opening video before pretest.
- Submit incomplete pretest.
- Submit complete pretest.
- Verify score is stored.
- Verify video opens.



## Video

- Try skipping forward.
- Pause and resume.
- Close app during video.
- Resume video.
- Complete video.
- Verify posttest schedule.



## Posttest

- Try opening before 7 days.
- Open after 7 days.
- Submit incomplete posttest.
- Submit complete posttest.
- Verify next video unlocks.



## Researcher

- Login with invalid credentials.
- Login with researcher account.
- View overview.
- Search respondent.
- View respondent detail.
- View video monitoring.
- View result summaries.
- Export data.

---



# 28. Success Metrics



## Product Metrics

- Registration completion rate.
- Video 1 completion rate.
- Posttest completion rate.
- Full program completion rate.
- Average time to complete video flow.
- Drop-off rate per video.



## Research Metrics

- Average pretest score.
- Average posttest score.
- Score improvement percentage.
- Number of valid respondents.
- Number of incomplete respondents.



## Technical Metrics

- API error rate.
- Notification delivery success.
- App crash rate.
- Average dashboard load time.
- Export success rate.

---



# 29. Open Questions

These need final decision before implementation:

1. Will respondent login use phone number only, email, or generated access code?
2. Will videos be stored in Supabase Storage, external video hosting, or bundled manually?
3. Should researcher be able to create/edit questions in MVP?
4. Should respondent be allowed to edit registration data after submission?
5. Should exported data include full identity data or anonymized respondent ID?
6. Should posttest use exactly the same questions as pretest or equivalent questions?
7. Should app support offline mode?
8. Should the app be published to Play Store/App Store or distributed privately for research?

---



# 30. Recommended BMAD Next Steps



## Step 1: Architect Document

Create technical architecture based on this PRD.

Output:

- Architecture diagram.
- Backend architecture.
- Mobile app architecture.
- Supabase schema.
- API contract.
- Auth strategy.
- Notification strategy.
- Deployment strategy.



## Step 2: UX Specification

Create Figma-ready UX spec.

Output:

- Screen list.
- Component list.
- User flow.
- Empty/loading/error states.
- Mobile researcher flow.



## Step 3: Scrum Story Breakdown

Convert epics into development-ready stories.

Output:

- Story title.
- User story.
- Acceptance criteria.
- Technical notes.
- Dependencies.
- Priority.



## Step 4: Implementation

Start with:

1. Monorepo setup.
2. Supabase schema.
3. Vercel API health check.
4. Expo mobile base navigation.
5. Registration flow.
6. Respondent dashboard.

