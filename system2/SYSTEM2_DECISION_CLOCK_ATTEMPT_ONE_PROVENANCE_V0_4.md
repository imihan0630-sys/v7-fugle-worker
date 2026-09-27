# System 2 Decision Clock（決策時間點）Attempt-One Provenance（第一次執行來源證明）V0.4

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Problem

GitHub Actions（GitHub 自動化）workflow re-run（重新執行）uses the same workflow run ID but increments `run_attempt`.

The ordinary workflow-runs API presents the latest attempt on that run. If a later rerun is allowed to replace attempt-one metadata, two opposite integrity failures become possible:

1. an attempt-one failure could appear repaired by a successful attempt two;
2. a valid attempt-one artifact could later appear invalid merely because someone reran the workflow.

Neither behavior is acceptable for promotion-grade prospective evidence.

## Immutable anchor

For every scheduled run:

- `run_attempt=1` is the only promotion-grade attempt;
- coverage conclusion comes from attempt-one metadata;
- attempt-one artifact count is computed only from bundles whose embedded provenance says `workflowRunAttempt=1`;
- later attempts are diagnostic only.

If GitHub's current run object reports `run_attempt>1`, the aggregator retrieves the dedicated attempt-one metadata using GitHub's run-attempt endpoint instead of interpreting the latest attempt as the original evidence.

## Artifact provenance

Each V0.3 daily bundle already embeds:

- workflow run ID;
- workflow run attempt;
- workflow SHA;
- collector-contract fingerprint.

For every downloaded artifact, the aggregator resolves the matching GitHub run-attempt metadata and verifies the bundle against that attempt's run ID / attempt number / SHA.

Therefore attempt-one and attempt-two artifacts can coexist without ambiguity.

## Promotion rules

Scheduled artifacts are partitioned into:

- attempt one: eligible for deterministic per-date selection;
- attempt >1: `RERUN_ATTEMPT_DIAGNOSTIC_ONLY`.

Aggregation reports:

- `scheduledArtifactCount` — all scheduled artifacts;
- `promotionEligibleScheduledArtifactCount` — attempt-one scheduled artifacts only;
- `rerunDiagnosticArtifactCount`;
- `rerunDiagnosticArtifacts`.

A later attempt cannot:

- repair an attempt-one failure;
- repair an attempt-one missing artifact;
- replace an attempt-one candidate with a nicer latency result;
- invalidate an already valid attempt-one artifact.

## Coverage examples

Attempt 1 success + valid bundle, then attempt 2 rerun:

- attempt-one coverage remains complete;
- attempt-one bundle remains promotion-grade;
- attempt-two bundle is diagnostic only.

Attempt 1 failure, then attempt 2 success + valid bundle:

- coverage remains `SCHEDULED_RUN_NOT_SUCCESS`;
- attempt-two bundle is diagnostic only;
- date is not promotion-grade.

## Owner review

The owner-review packet records the rerun diagnostic artifact count and freezes:

- `attemptOneAnchorInvariant=true`;
- `laterRerunAttemptsCanRepairAttemptOne=false`;
- `laterRerunAttemptsCanInvalidateValidAttemptOne=false`.

## Safety

This change is read-only evidence handling only.

It does not:

- enable System 2 Worker capture;
- create or alter Worker Cron;
- write D1;
- use Cloudflare secrets;
- modify System 1/V8 Formal Core;
- use return/performance outcomes.

The rule is fixed before the first eligible prospective trading date, 2026-09-29.
