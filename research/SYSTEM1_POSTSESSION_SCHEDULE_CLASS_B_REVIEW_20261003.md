# System 1 post-session automatic schedule Class-B review — 2026-10-03

Status: CLASS-B CANDIDATE / NOT MERGED / SCHEDULE NOT ACTIVE / FORMAL CORE LOCKED

## Purpose

Convert the existing manual-only post-session evidence workflow into a bounded
trading-day automation without changing Worker runtime, trading decisions,
signals, push, orders, capital, C3 capture, C4 allocation logic, C5 semantics or System2.

## Proposed schedule

GitHub Actions cron:
45 6 * * 1-5

Taipei wall clock:
14:45 Asia/Taipei

Taiwan has no daylight-saving-time shift, so 06:45 UTC maps to 14:45 Taipei.

The time is intentionally after the current C3 17-slot intraday capture window
to avoid racing the final completed 15m evidence.

## Trading-day resolver

New:
- research/system1_postsession_schedule_v0_1.mjs
- tests/resolve_system1_postsession_target_date.mjs

The scheduled event:
1. resolves the current Taipei calendar date;
2. loads the existing official trading calendar from Worker helpers;
3. runs evidence collection only when isTradingDate(date) is true.

Official non-trading day:
- SKIP_NON_TRADING_DAY
- workflow remains successful;
- no evidence packet is fabricated;
- mayCountAsZeroPick=false;
- eligibleForResearch=false.

Manual workflow_dispatch remains available and requires an explicit valid
historical/current trading date. Future dates and non-trading dates are rejected.

## Valid trading day failure semantics

If the date is an official trading day, the collector runs.

Missing cohort, missing C1/C2 generation, missing bars/quotes, invalid provenance
or incomplete evidence remains an explicit blocker and fails the collection step.

The existing blocker artifact is preserved:
SYSTEM1_POSTSESSION_BLOCKER_V0_1

A failed valid trading-day run:
- mayCountAsZeroPick=false;
- eligibleForResearch=false;
- does not mutate plans;
- does not trade;
- does not push.

## Permissions / actions

Workflow repository permission remains:
contents: read

No:
- contents write;
- actions write;
- deployments write;
- wrangler;
- Cloudflare deploy;
- POST/PUT/PATCH/DELETE command is added by this workflow candidate.

The evidence collector remains read-only against research endpoints and writes
only GitHub Actions artifacts.

## Production deployment boundary

The previously merged deploy-trigger decoupling removes research/**, tests/**,
RESEARCH_WORKLIST.md and unrelated workflow changes from Cloudflare auto-deploy.

Therefore merging this candidate does not upload a new Worker version.

Its Class-B effect is activation of the scheduled GitHub Actions evidence job.

## Validation guard

Regression must preserve:
- exact cron 45 6 * * 1-5;
- official trading-day resolver;
- no push trigger;
- contents read-only;
- collection only when should_run=true;
- artifact upload only when collection is eligible to run;
- explicit blocker preservation;
- no Production write/deploy commands.

## Approval boundary

Passing CI is not schedule activation authorization.

Explicit owner Class-B approval is required before merge because merge activates
the recurring 14:45 Taipei trading-day workflow.
