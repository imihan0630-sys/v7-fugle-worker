# System 2 Daily Shadow Capacity Orchestration V0.1

Updated: 2026-10-02 Asia/Taipei  
Status: REPOSITORY IMPLEMENTED / RESEARCH-SHADOW ONLY / NOT SCHEDULED  
System 1 / V8 impact: NONE

## Purpose

Close the deterministic middle section of S2-07 without inventing a cross-strategy score or enabling final selection:

completed strategy-local daily Shadow runs
-> immutable strategy-local RANK-01 receipts
-> prior-pool revalidation
-> conservative new-admission eligibility
-> owner-approved capacity invariants
-> immutable `s2_capacity_runs` receipt
-> later 19:00 bounded Daily Resonance pool refresh.

This module does **not** fetch market data, schedule capture, send push, allocate real capital or route orders.

## Runtime module

`system2/runtime/daily_shadow_capacity_orchestrator_v0_1.mjs`

Input:
- one or more completed `runDailyLimitedShadowOrchestratorV0_1` results for the same market date / decision clock;
- optional prior capacity receipt from an earlier market date;
- deterministic run/batch IDs and capture timestamp.

Output:
- strategy-local ordering receipts;
- revalidated prior candidate/watch pool;
- new-admission diagnostics;
- capacity receipt when safely resolvable;
- immutable System 2 persistence batch containing ordering rows and, when allowed, `s2_capacity_runs`.

## Frozen policy boundary

The module uses only already-authorized / preregistered mechanics:

- global candidate/watch maximum = 12 unique symbols;
- active intraday monitor maximum = 3 per strategy;
- no forced filling;
- overlap consumes one global slot while preserving strategy memberships;
- RANK-01 Pareto baseline is strategy-local and contains no numeric weighted score;
- no cross-strategy global priority formula is invented;
- still-valid incumbents are retained before new admissions.

### New admission V0.1

A new symbol/strategy membership is admitted to capacity consideration only when the current Limited Shadow decision is:

- `strategyValidity = VALID`;
- `entryReadiness = BUY_ELIGIBLE`;
- rankable under the existing RANK-01 baseline.

This is the narrowest current source-honest mapping because Limited Shadow V0.1 already maps VALID + BUY_ELIGIBLE to `QUALIFIED_NOT_SELECTED` specifically pending ranking/capacity.

WATCH / WAIT / TOO_EXTENDED / CONFLICT / BLOCKED are not promoted merely to fill capacity.

This does not assert that BUY_ELIGIBLE-only is the final long-run admission policy. Expanding new admission to NEAR_ENTRY / ACTIVE_ENTRY_MONITOR requires a separately versioned policy/evidence decision.

### Existing-candidate revalidation

For a prior membership:

- `INVALIDATED` -> membership no longer survives;
- `VALID` -> membership survives;
- `WEAKENING` -> membership survives for observation but is not active-monitor eligible;
- `INCOMPLETE` -> membership is conservatively retained but is not active-monitor eligible because UNKNOWN/source incompleteness must not be inferred bearish;
- explicit current-universe exclusion -> membership becomes globally ineligible with the exclusion reasons;
- missing revalidation without an explicit exclusion -> capacity run fails closed.

This preserves the owner-approved rule that UNKNOWN is not bearish and that historical candidate state cannot be silently rewritten.

## Ranking and scarcity

For each strategy the module creates RANK-01 receipts for:
- `GLOBAL_ADMISSION`;
- `ACTIVE_INTRADAY_MONITOR`.

The actual capacity baseline does not use RANK-02, confluence, Regime bonuses, strategy-count bonuses, age penalties or displacement challengers.

If every eligible new symbol fits in current vacancies:
- all may be admitted;
- no cross-strategy comparison is required.

If eligible new unique symbols exceed available vacancies:
- `GLOBAL_PRIORITY_UNRESOLVED`;
- no `s2_capacity_runs` row is emitted;
- ordering evidence is still preservable;
- no arbitrary strategy iteration, symbol order or neutral hash may decide a global winner.

## Zero-pick semantics

A complete same-clock strategy set with no qualified new candidates and no surviving prior candidates creates a legitimate zero-pick capacity receipt.

This is different from:
- missing source data;
- incomplete strategy revalidation;
- unresolved scarcity.

The later 19:00 resonance lane may therefore distinguish a truthful zero-pick day from a missing upstream run.

## Persistence boundary

The returned batch uses only isolated `SYSTEM2_DB` whitelisted tables:
- `s2_strategy_ordering_receipts`;
- `s2_capacity_runs` when capacity is safely resolved.

The module itself does not execute the batch. Physical D1 writes remain a later source/orchestration integration step.

## Verification targets

Tests must cover:
- multi-strategy overlap dedupe;
- max-12 / max-3 invariants;
- no forced fill;
- zero-pick capacity receipt;
- prior INCOMPLETE retention without active-monitor eligibility;
- invalidated prior membership removal;
- missing prior revalidation fail-closed;
- >12 new eligible symbols without global priority -> no capacity receipt;
- no final-selection / push / order authority;
- immutable strategy-local ranking handoff from daily Shadow runs.

## Next integration dependency

Repository wiring still required for physical S2-07:
1. same-day official/PIT-qualified source adapters;
2. real daily per-strategy assessments under frozen Limited Shadow contracts;
3. isolated D1 historical loader for prior bars;
4. persistence execution of strategy decision batches;
5. capacity orchestration and persistence execution;
6. exact after-close schedule only after the Decision Clock owner gate is satisfied.

Until those are connected and physically verified, System 2 must continue to report missing upstream capacity rather than fabricate a populated pool.
