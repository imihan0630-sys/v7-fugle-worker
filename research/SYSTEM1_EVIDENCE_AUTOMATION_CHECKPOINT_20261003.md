# System 1 evidence automation checkpoint — 2026-10-03

Status: CLASS-A ISOLATED RESEARCH / PR #323 DRAFT / CI PASS / FORMAL CORE LOCKED
Production remains V8.15.2 C3 research capture. This checkpoint does not authorize runtime, scheduler, D1, signal, push, order or System2 changes.

## Completed in this branch

### C3 live-input audit
`research/system1_evidence_automation_v0_1.mjs` now audits live C3 inputs before the entry simulator can consume them.

It requires:
- exact C2 generation/session linkage;
- all 17 completed bars in the current capture contract (09:00 through 13:00);
- no duplicate slots;
- authenticated selection-time geometry;
- verified prior close;
- verified Formal baseline receipt;
- volumeRatio coverage;
- explicit depth/limit/late-stage evidence.

Missing evidence becomes INPUT_BLOCKED / UNKNOWN. Nothing is imputed.

The C3 simulator itself is hardened: missing limitUp or lateStage booleans now throws C3_BAR_STATE_REQUIRED instead of silently coercing missing values to false.

### C5 daily overfilter report
The full matched C1/C2 denominator is summarized by SHORT and SWING:
- hard/primary failures;
- optional/supportive/context-only failures;
- UNKNOWN hard evidence;
- setup-not-ready;
- safety-UNKNOWN conditional upper bound;
- top failed/unknown gates and first-failure distributions.

FirstFailure remains descriptive ordering, not causal attribution.

### C4 daily capital comparison
The identical candidate set is compared under:
- current Formal score-weighted allocation;
- equal-capital allocation;
- equal-planned-stop-risk allocation.

No allocator is preferred and no order is generated.

### Formal-switch maturity gate
The documented Class-C evidence thresholds are now machine-checkable:
- >=60 mature D5 rows;
- >=30 complete prospective snapshots;
- >=15 independent scan dates;
- >=2 calendar years;
- >=2 market regimes;
- >=70% date-cluster direction agreement;
- source coverage, purged holdout, multiple testing, redundancy and cost stress PASS;
- after-cost return, drawdown/tail, MFE/MAE, trigger/fill funnel, turnover/concentration and deployment/reserve evidence available;
- broker fills/cash complete.

Even when all checks pass, autoSwitchAuthorized=false. The result only becomes EVIDENCE_GATE_PASSED_REVIEW_REQUIRED.

## Exact-head verification

PR #323 head `a486d9d03f55fa8eefce62d849f42df58fdbe159`:
- System1 isolated offline repair review run 37079552420: PASS.
- V8 Repair CI run 37079552368: PASS.
- V8 Regression run 37079552285: PASS.

No production deploy occurred.

## Newly exposed C3 evidence debt

Repository/source audit found the strict C3 V0.1 inputs are not yet fully obtainable from deployed evidence:

1. C1 population rows already preserve selection-time feature.depthScore and feature.close.
2. C1 population rows do NOT currently preserve Formal daily lateStage, ret20/MA-distance context.
3. C1 derived entryGeometry currently preserves entry/stop/target only; A-support and B-breakout anchors are not exported.
4. C3 Shadow-only live capture preserves completed 15m OHLCV/volumeRatio but not quote/order-book or limit-state.
5. Existing V8.8.1 execution recorder proves Fugle Quote can provide top-five bids/asks, bidDepth5, askDepth5, depthImbalance and market/limit flags, but its event cadence and monitored population do not cover C3 Shadow-only names.
6. There is no canonical repository formula that maps raw top-five depth into a 0–100 intraday depthScore. Do not invent one after seeing outcomes.
7. Formal lateStage is a daily overheat state (ret20>35 OR MA20-distance>25), not a clock-time/late-session flag. It must not be synthesized per 15m bar.
8. Current 17-slot contract deliberately stops at the 13:00-start bar. Existing Price-Volume research records that the 13:15-13:30/13:30 closing-auction aggregation must be fixture-tested before being included.

Therefore a genuine C3 strict result must remain INPUT_BLOCKED until the missing provenance is prospectively captured. Candidate-count lift cannot bypass this.

## Safest next engineering candidate

Prepare a separate Class-B candidate, not part of PR #323:

A. Extend C1 research receipt only with already-known selection-time C3 context:
- lateStage and its inputs/provenance;
- setup channel;
- A support anchor / B breakout anchor inside derived geometry.
No Formal decision uses these new fields.

B. Change Shadow-only live capture from at most 6 candle-only names to at most 3 names with:
- one 15m candle request;
- one Fugle Quote request;
per completed slot.

This keeps the existing extra-call ceiling at 6 requests/slot and 102/session:
3 symbols × 2 calls × 17 slots = 102.
With the audited existing worst minute of 43 calls, total remains 49/60 under the currently verified Fugle Basic limit and the existing 50/min aggregate guard.

C. Store raw quote research context, not an invented score:
- top-five bid/ask;
- bidDepth5 / askDepth5 / depthImbalance;
- spread;
- executionMarketState;
- verified limit flags;
- source/fetchedAt/coverage.

The current C3 depthScore threshold must remain blocked until a preregistered, outcome-blind mapping is defined or the experiment contract is formally versioned to use raw normalized depth.

## Governance

PR #323 is Class A code, but merging research/test files into main currently can trigger the shared Cloudflare workflow. Therefore keep it draft until a separate merge/deployment-path decision is made.

The proposed quote/C1 receipt extension is Class B because it changes production research capture/API usage. It requires explicit owner approval before merge/deploy.

Any change to Formal admission, A/B, ranking, 3+3+3, capital, signal, push or order authority remains Class C.
