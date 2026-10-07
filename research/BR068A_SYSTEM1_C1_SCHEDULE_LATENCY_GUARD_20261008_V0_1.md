# BR-068A — System1 C1 Scheduled-Run Latency Guard V0.1

Status: RESEARCH_ONLY / SCHEDULER_LATENCY_CALIBRATED / DO_NOT_PREMATURELY_CLASSIFY_MISSED_RUN / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Consumer: D09-05 Above-MA廣度
Date: 2026-10-08 Asia/Taipei
Observed main before write: 7c1d6eabc735f8f6df92d384a1fc2df967d6422a

## Nominal schedule

Workflow: System 1 C1 Prospective Evidence
cron: 10 16 * * 1-5
nominal Taipei time: 00:10.

## Observed prior scheduled creation times

2026-10-06 Taipei opportunity:
- run id 37340733476;
- created 2026-10-05T16:25:33Z = 2026-10-06 00:25:33 Asia/Taipei;
- nominal-to-created delay = 15m33s.

2026-10-07 Taipei opportunity:
- run id 37495670280;
- created 2026-10-06T16:26:06Z = 2026-10-07 00:26:06 Asia/Taipei;
- nominal-to-created delay = 16m06s.

Therefore the two immediately prior observed schedule runs both arrived roughly 15-16 minutes after the nominal cron minute.

## Guard

At 2026-10-08 00:21 Asia/Taipei the current run had not yet appeared.

Correct state:
`SCHEDULE_NOT_YET_OBSERVED_WITHIN_RECENT_EMPIRICAL_GITHUB_DELAY_BAND`.

Do not classify MISSED or FAILURE merely because 00:10 has passed.

Only the eventual scheduled artifact determines parent readiness.

## Exact next

Recheck after the recent empirical 00:25-00:27 creation window. If the run appears, inspect the C1 readiness/population artifact. If it still does not appear beyond a bounded later check, classify SCHEDULE_RUN_NOT_OBSERVED_THROUGH_CUTOFF rather than guessing a workflow failure.

Formal Core unchanged.
