# System 2 Decision Clock（決策時間點）Dependency Readiness Integrity（相依資料準備度完整性）V0.2

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Purpose

The first prospective trading-date evidence has not yet been collected. Before that first sample, the A1/A5/B2 readiness path is audited specifically for false READY（誤判已準備）and false precision（誤判時間精度）failure modes.

This V0.2 hardening does not change any stock-selection factor, score, strategy, Worker schedule or System 1/V8 behavior.

## B2 close-finality rule

B2_INDUSTRY_THESIS_PROSPECTIVE（前瞻產業狀態）is a same-session after-close dependency.

A B2 snapshot cannot be promotion-grade READY before the official Taiwan market close boundary of 13:30 Asia/Taipei, even if an official endpoint happens to expose same-date rows earlier.

The receipt now records:

- `sameTaipeiDate`;
- `marketCloseTimestamp`;
- `marketCloseFinalityReached`;
- `availabilityState`.

Before close, B2 is explicitly `NOT_READY`, never READY.

## Daily-row date rule

B2 daily rows must carry a parseable date equal to the target `marketDate`.

An ordinary-symbol row with a missing/unparseable date is not assigned to the target date. Undated rows are counted separately and cannot make the B2 daily gate pass.

The daily parser distinguishes:

- `TARGET_DATE_OBSERVED`;
- `TARGET_DATE_NOT_OBSERVED`;
- `INVALID_PAYLOAD`.

This prevents a current endpoint payload with missing date fields from being silently treated as same-day evidence.

## Classification coverage rule

B2 is an industry snapshot, so merely having one classified stock per market is insufficient.

For each market, both must pass:

1. same-date daily ordinary-symbol coverage >= the existing market minimum;
2. classified joined rows >= the same existing market minimum.

Current minimums remain:

- TWSE: 600;
- TPEx: 450.

No new optimization threshold is introduced; the existing market-wide minimum is reused as the fail-closed classification floor.

## Explicit dependency observation states

A5 and B2 dependency polling now records one of:

- `READY`;
- `NOT_READY`;
- `SOURCE_ERROR`;
- `INVALID_PAYLOAD`;
- `NOT_APPLICABLE`.

Transport health is evaluated per dependency family. A B2 transport error therefore does not falsely erase a valid A5 observation, while the combined prospective bundle still requires both dependencies READY.

## Precision-bracket rule

A valid source-arrival precision bracket requires an explicit:

`NOT_READY -> READY`

transition.

`SOURCE_ERROR`, `INVALID_PAYLOAD`, and `NOT_APPLICABLE` are never substitutes for NOT_READY.

Therefore a sequence such as:

`SOURCE_ERROR -> READY`

proves only that the dependency was READY at the latter observation. It does not prove a <=5-minute arrival interval and cannot make that dependency precision-eligible.

This mirrors the existing A1 rule that SOURCE_ERROR is not NOT_READY.

## Evidence boundary

These changes occur before the first eligible prospective trading-date sample (2026-09-29).

Because the Decision Clock Collector Provenance（擷取器來源證明）V0.3 fingerprint includes the B2/dependency observer and polling files, this change necessarily produces a new collector fingerprint before evidence begins.

After the first promotion-grade trading date exists, any later material collector change must follow the separately preregistered evidence-epoch/version rule and cannot be silently pooled.

## Safety

- System 2 Worker capture remains false.
- System 2 Worker Cron remains 0 / unauthorized.
- No D1 write is performed.
- No Cloudflare secret is needed by this change.
- No System 1/V8 runtime or Formal Core changes are made.
- No historical observation is substituted for prospective first-known evidence.
- No outcome/return data is used to choose these rules.
