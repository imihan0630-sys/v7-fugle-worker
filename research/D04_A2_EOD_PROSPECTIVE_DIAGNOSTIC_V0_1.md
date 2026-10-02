# D04 A2 EOD Prospective Diagnostic V0.1

Status: CLASS_B_PROPOSAL / NOT ACTIVE UNTIL OWNER APPROVES MERGE  
Date frozen: 2026-10-02 Asia/Taipei

## Why this replaces PR #315

The existing System2 Decision Clock collector V0.3 is already evidence-frozen. PR #315 correctly failed its freeze guard when it tried to piggyback A2 into that collector. That PR was closed unmerged.

This replacement preserves V0.3 byte-for-byte and creates a separate D04 evidence lane.

## Purpose

Establish whether official TAIEX/FMTQIK data can be captured prospectively and reproducibly on the same Taiwan calendar date, without claiming an earlier System2 strategy decision clock.

The fixed diagnostic schedule is 19:15 Asia/Taipei on weekdays. The time is preregistered as an end-of-day research boundary, not selected from returns or later performance. Actual GitHub start/fetch time is recorded and is authoritative if the scheduled run is delayed.

A missing target-date row at that time is a valid NOT_READY result and must not be repaired by a later same-date/manual run for that scheduled artifact.

## Data path

Read only official TWSE FMTQIK JSON via GET.

Fetch current month and prior months, at most 3 months, so early-month windows can still contain 21 official sessions.

For each response preserve:
- official URL;
- request month anchor;
- actual fetchedAt;
- SHA-256 of exact response text;
- parsed trading dates and TAIEX close values in the final 21-session diagnostic window.

The artifact does not mutate D1 or Worker state.

## Semantics

A valid same-day artifact may expose:
- diagnostic RV5;
- diagnostic RV20;
- diagnostic RV5/RV20;
- exact last21 official sessions;
- response hashes and observation timestamp.

But outward `factorObservations` remain UNKNOWN with:
`NOT_STRATEGY_DECISION_CLOCK_OR_PROMOTION_GRADE`.

It never increments the strategy/promotion-grade prospective counter.

Its evidence class is:
`SAME_DAY_EOD_PROSPECTIVE_DIAGNOSTIC_ONLY`.

## Resource guard

One bounded GitHub job per weekday, max 10 minutes, normally 1-3 official GETs.

No long polling loop.
No Cloudflare Cron.
No Fugle quota.
No paid data/service.
No R2 retention.
No System1 access.

Artifact retention uses the existing GitHub Actions artifact mechanism for 90 days.

## Promotion boundary

This lane can prove D04 Taiwan PIT capture feasibility at an end-of-day diagnostic timestamp after enough independent clean dates.

It cannot prove:
- A2 was available at the existing System2 candidate Decision Clock;
- a 14:xx or intraday strategy could have used the data;
- current Market-RV improves returns;
- any Formal volatility throttle, ATR/stop/RR or BUY change.

Moving this factor into the actual System2 decision-clock regime snapshot or D1 persistence remains a separate Class B/C-governed step.

## First eligible date

Do not backfill.

The first eligible scheduled diagnostic date is the first official TWSE trading date AFTER this workflow is actually merged/activated. Historical dates and manual workflow_dispatch runs are diagnostic only.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
