# System 2 Daily Shadow Hot-History Bootstrap V0.1

Updated: 2026-10-03 Asia/Taipei  
Status: REPOSITORY IMPLEMENTATION / PHYSICAL ACCEPTANCE PENDING  
Scope: S2-07 PIT-safe recent-history readiness  
System 1 / V8 impact: NONE

## Purpose

Populate only a very small number of the most recent missing completed trading sessions into isolated `system2-research` D1 so the Daily Shadow preflight can move from `historyCoverage=0` toward a truthful 60-prior-session history base.

This lane does **not** solve or relabel corporate-action continuity. Historical rows written here remain `continuityState=UNVERIFIED`, so `continuityCoverage` stays blocked until a separate validated continuity mechanism exists.

## Why this is separate from cold backfill

The long-horizon 2017+ research archive remains the R2 cold-storage path.

This hot-history bootstrap serves only prospective System 2 daily Shadow readiness:
- bounded recent sessions;
- isolated D1 hot rows;
- actual observation time as the upper bound for availability;
- no claim that the endpoint publication time was known at the original historical session;
- no historical outcome backfill into prior decision clocks.

## PIT semantics

Rows fetched today for older sessions are stored with:
- `observedAt = current bootstrap observation time`;
- `availableAt = observedAt`;
- `availabilityBasis = PROSPECTIVE_OBSERVATION`;
- `pitAvailabilityClass = OBSERVED_AVAILABLE_UPPER_BOUND`.

Therefore they may support **future** decisions after the bootstrap clock. They must not be used to pretend that System 2 knew them at an earlier historical decision timestamp.

## Resource and mutation bounds

V0.1 hard limits:
- at most **3 missing completed trading sessions per run**;
- at most **1,500 ordinary symbols per market per date** before any write;
- workflow acceptance rejects more than **9,000 inserted bars** in one run;
- no recurring schedule;
- isolated D1 only;
- existing canonical keys are reused only when economic fields match and the stored row is PIT-eligible;
- existing duplicate canonical keys fail closed;
- economic disagreement with an existing canonical key fails closed;
- completion receipts are written only through the existing immutable historical persistence engine.

The first physical run is intended to measure real D1 usage before any larger batch is considered.

## Data-source contract

Trading dates come from the existing official TWSE historical trading-calendar resolver.

Each selected date uses the already-validated exact-date official A1 sources:
- TWSE `MI_INDEX?date=YYYYMMDD&type=ALLBUT0999`;
- TPEx `afterTrading/dailyQuotes?date=YYYY/MM/DD`.

Source-date evidence must exactly match the requested trading date.

## Authority boundary

This lane cannot:
- freeze or alter SHORT_MOMENTUM / SWING_GROWTH assessor policy;
- emit SUPPORTIVE / ADVERSE / BUY_ELIGIBLE;
- claim a zero-pick day;
- create `s2_capacity_runs`;
- enable final selection;
- send push;
- allocate capital;
- route orders;
- use or modify System 1 runtime.

## Files

- `runtime/daily_shadow_hot_history_bootstrap_v0_1.mjs`
- `scripts/run_daily_shadow_hot_history_bootstrap.mjs`
- `.github/workflows/system2-hot-history-bootstrap.yml`
- `tests/daily_shadow_hot_history_bootstrap_v0_1.test.mjs`
- `tests/daily_shadow_hot_history_bootstrap_workflow_guard.test.mjs`

## Acceptance sequence

1. System2 Research CI PASS.
2. V8 Regression PASS.
3. Merge to current main only if no conflicting System 2 source/history change intervened.
4. Main push performs one bounded physical bootstrap of up to 3 missing sessions.
5. Record exact D1 requests / rows read / rows written / database size and inserted/reused bar counts.
6. Re-run/read Daily Shadow preflight evidence after enough history has accumulated.
7. Keep continuity and assessor gates closed independently.

No larger hot-history expansion is authorized by this V0.1 receipt alone.
