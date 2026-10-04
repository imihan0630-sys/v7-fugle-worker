# System 1 LIQUIDITY_REJECTED_CONTROL consumer V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_PENDING / FORMAL_CORE_LOCKED

## Purpose

Turn the already-deployed V8.17 immutable Shadow membership substrate into the first concrete reason-stratified liquidity rejected-control evidence object.

This closes the gap frozen by:

`research/liquidity_gate_rejected_control_spec_v0_1.json`

without changing any Formal liquidity rule.

## Existing V8.17 memberships reused

Rejected:
- `LIQ_LOW_AVG_VOLUME_REJECTED`
  - exact reason: `20日流動性不足`
- `LIQ_SMALLCAP_SPECIAL_REASON_REJECTED`
  - exact reason: `10至30億市值缺少強力特殊理由`
- `LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED`
  - exact reason: `30至100億市值流動性要求未達`

Positive descriptive control:
- `LIQ_LOW_VOLUME_EXCEPTION_PASS`

Comparison controls:
- `INDEPENDENT_BROAD_MARKET_CONTROL`
- `RESIDUAL_CONTROL`

No new persistence or membership family is added by this tranche.

## Implementation

Pure Class-A consumer:

`research/system1_liquidity_rejected_control_v0_1.mjs`

Input:
the already verified `shadowCohort` object produced by:
`research/system1_shadow_cohort_collection_v0_1.mjs`.

If Shadow parent verification fails, the consumer returns:
`PARENT_NOT_VERIFIED`

instead of throwing and invalidating otherwise-valid C1/C2 evidence.

## Denominator integrity

For each rejected membership and price pool:

- full rejected population comes from immutable parent `firstFailureCounts`;
- pre-sample semantic frame count must match that exact rejected denominator;
- persisted sampled count must equal parent `expectedCounts`;
- every sampled row must preserve the exact corresponding Formal firstFailure reason;
- `fullFormalCounterfactual` must remain false.

This prevents bounded samples from being mistaken for whole-universe prevalence.

## Liquidity semantic guards

### Primary low average volume rejection

Every sampled `LIQ_LOW_AVG_VOLUME_REJECTED` row must have:
- known pool minLots;
- known avgVolume20Lots;
- avgVolume20Lots < minLots;
- liquidityExceptionPass != true.

### Low-volume exception positive control

Every sampled `LIQ_LOW_VOLUME_EXCEPTION_PASS` row must have:
- avgVolume20Lots < minLots;
- liquidityExceptionPass = true.

Missing exception inputs are never interpreted as a successful exception.

## Broad-control contamination guard

The primary low-average-volume rejected population is structurally incompatible with the current independent broad-control frame because broad control requires:

`avgVolume20Lots >= pool minLots`.

Therefore sampled overlap between:
- `LIQ_LOW_AVG_VOLUME_REJECTED`
and
- `INDEPENDENT_BROAD_MARKET_CONTROL`

must be exactly zero.

Any non-zero overlap is:
`DATA_QUALITY_BLOCKED`.

This machine-checks the previously documented systematic broad-control hole instead of leaving it as prose.

Small-cap and mid-cap liquidity rejects may overlap bounded broad-control membership. Those overlaps are reported but remain sample-membership overlaps only; they are not causal controls.

## Quality semantics

Latest append-only quality overlay per:
`symbol | membershipType`

is summarized as:
- VALID;
- COHORT_SEMANTIC_CONTAMINATION;
- SOURCE_QUALITY_BLOCKED;
- PROVENANCE_CONFLICT;
- UNKNOWN.

No quality overlay defaults to:
`UNKNOWN`, never VALID.

Current consumer states:
- `VERIFIED_SELECTION_TIME` when structural membership/denominator checks pass;
- `qualityEligibility=ALL_FOCAL_MEMBERSHIPS_VALID` only when all observed focal memberships are explicitly VALID;
- otherwise `QUALITY_PENDING_OR_BLOCKED`.

This V0.1 consumer never authorizes outcome inference by itself:
`eligibleForOutcomeJoin=false`
`outcomeState=NOT_JOINED`.

## Outputs

For each rejected/control membership:
- full pre-sample population count;
- sampled count;
- per-pool population/sample count;
- sampling fraction;
- sampled symbols;
- latest quality-state summary.

Also report:
- low-volume rejected vs broad overlap;
- small-cap rejected vs broad overlap;
- mid-cap rejected vs broad overlap;
- exception-pass vs broad overlap;
- focal quality state;
- selection-time completeness.

## Daily collection

The existing verified C1 evidence artifact now appends:

`liquidityRejectedControl`.

No:
- new endpoint;
- new provider call;
- new scheduler;
- new D1 table;
- Worker runtime hook;
- Production deployment

is introduced.

## Interpretation guardrails

This consumer does not prove:
- current 1000 / 300 lots thresholds are too strict;
- 1.2x or 1.5x requirements are too strict;
- rejected names would otherwise be Formal-qualified;
- exception-pass names are ideal controls;
- broad-control overlap is representative;
- more candidates are economically better.

It only creates the clean prospective selection-time denominator/control evidence required before those questions may be answered.

Future outcome work must still control for:
- price tier;
- market cap;
- sector;
- regime;
- ATR/volatility;
- ret20/ret60;
- residual RS;
- setup closeness;
- institutional state;
- fundamental/valuation availability;
- event/corporate-action context;
- executable liquidity, costs/slippage/depth.

## Formal boundary

No Formal liquidity threshold, exception rule, market-cap condition, A/B, ATR, RR, grade, score, comparator, 3+3/Top6, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1/Shadow workflow emit the first genuine V8.17+ liquidity rejected-control receipt.
3. Require clean selection-time denominator reconciliation and explicit quality state before any outcome join.
4. Accumulate independent dates.
5. Join D1/D3/D5/MFE/MAE and executable-liquidity evidence only under the frozen controls.
6. Any change to 1000/300/1.2x/1.5x or exception semantics is Class-C and requires explicit owner approval.
