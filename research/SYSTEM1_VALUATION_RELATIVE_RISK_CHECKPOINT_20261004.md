# System 1 valuation-relative-risk audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_GREEN_MERGED / SOURCE_VINTAGE_BLOCKED / PROSPECTIVE_STRUCTURAL_EVIDENCE_PENDING / FORMAL_CORE_LOCKED

## Purpose

Implement the remaining R2 structural selection audit for the current Formal gate:

`VALUATION_RELATIVE_RISK`

without pretending that current C1 valuation inputs have promotion-grade first-known source vintage.

Current Formal rule:

- if positive PE and positive sector median PE are observed;
- reject when PE / sectorMedianPE > 2.5;
- unless revenueQuarterYoY > 25 or epsYoY > 25.

This audit measures the exact same-request gate states and exception paths. It does not change 2.5x or 25%.

## Formal-reach denominator

A valuation gate observation is strategy-reached only when every earlier Formal gate is observed PASS:

- PRICE_FLOOR;
- HISTORY_60D;
- RS_CONTEXT;
- MARKET_CAP_FLOOR;
- DAILY_ABNORMALITY;
- LIQUIDITY;
- SMALL_CAP_SPECIAL;
- MID_CAP_LIQUIDITY;
- CHIP_CONCENTRATION_PRESENT;
- FINANCIAL_SOURCE_COMPLETENESS;
- ANNOUNCEMENT_RISK.

Earlier FAIL is `UPSTREAM_FAIL`.
Earlier UNKNOWN/NOT_EVALUABLE is `UPSTREAM_UNKNOWN`.

## Frozen valuation states

The audit mirrors the current observer exactly:

### NO_POSITIVE_TTM_PE

PE missing or <=0.

Observer state:
`NOT_EVALUABLE`

This is not a valuation FAIL.

### MISSING_POSITIVE_SECTOR_MEDIAN_PE

Positive PE exists but sectorMedianPE is missing or <=0.

Observer state:
`UNKNOWN`

### HIGH_RELATIVE_PE_GROWTH_CONTEXT_MISSING

PE / sectorMedianPE >2.5, but either revenueQuarterYoY or epsYoY is missing.

Observer state:
`UNKNOWN`

Missing growth context is never converted into low growth.

### FAIL_HIGH_RELATIVE_PE_NO_GROWTH

PE / sectorMedianPE >2.5 and both growth inputs are known, while neither exceeds 25%.

Observer state:
`FAIL`

### PASS_HIGH_GROWTH_EXCEPTION

PE / sectorMedianPE >2.5 and at least one known growth input exceeds 25%.

Exception source is preserved as:
- REVENUE;
- EPS;
- BOTH.

### PASS_WITHIN_RELATIVE_PE_MULTIPLE

Positive PE / positive sector median PE <=2.5.

Observer state:
`PASS`.

## Implementation

Pure Class-A analyzer:

`research/system1_valuation_relative_risk_audit_v0_1.mjs`

Inputs:
- immutable adapted C1 rows;
- same-generation full gate-overlap diagnosis;
- optional same-date firstFailure masking.

No new market-data request, source fetch or scoring path is introduced.

## Outputs

Overall / by price pool / by market-cap band:

- each frozen valuation state;
- evaluable fail rate;
- growth-exception rate;
- relative-PE-multiple descriptive summary;
- exception source counts.

For Formal FAIL rows:
- exact firstFailure reason cross-check;
- one-gate observed-state replay;
- next blocker distribution.

Controls are descriptive:
- within-multiple PASS;
- high-growth-exception PASS.

They are not yet promotion-grade matched outcome controls.

## Source provenance blocker

Current immutable C1 captures the selection-time values needed to reconstruct the Formal gate:

- priceEarningsRatio;
- sectorMedianPe;
- revenueQuarterYoY;
- epsYoY;
- valuationObserved flag.

But C1 does not freeze per-field:
- sourceAsOf;
- first-known timestamp;
- immutable valuation source vintage.

Therefore V0.1 explicitly reports:

`promotionGradeOutcomeJoin=false`

with blocker:

`VALUATION_SOURCE_ASOF_AND_VINTAGE_NOT_FROZEN_IN_C1`.

This does not invalidate same-request structural/gate-incidence evidence.
It blocks promotion-grade historical/outcome attribution that requires first-known valuation vintage.

No later/current valuation data may be used to repair past decision dates.

## Daily collection

The existing verified C1 evidence artifact now appends:

`valuationRelativeRisk`.

No:
- new endpoint;
- provider call;
- scheduler;
- D1 schema;
- Worker hook;
- Production deployment

is introduced.

## Interpretation guardrails

This audit does not prove:
- 2.5x is too strict;
- 25% growth exception is too strict;
- high-PE stocks should be admitted;
- no-positive-PE rows are cheap or attractive;
- a growth-exception PASS is a matched control;
- all-other-gates-clear means selected;
- a candidate-count increase is economic success.

Threshold sweeping is forbidden.

## Formal boundary

No Formal valuation threshold, growth exception, financial source rule, A/B, ATR, RR, grade, score, comparator, 3+3/Top6, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the daily C1 workflow emit genuine V8.17+ valuation-gate structural observations.
3. Keep NO_POSITIVE_PE and missing-growth/source states separate from economic FAIL.
4. Do not perform promotion-grade outcome join until first-known valuation/source-vintage provenance is frozen prospectively.
5. After that source contract exists, use same-parent matched controls and independent-date/OOS evidence before any Class-C valuation-rule proposal.

## Merge acceptance

- PR #575 merged at `3cce49300fa47a060882c813b3ac993a308ce910`.
- Exact head `39668a9ca37e77306910b9ec9299151d4c942446`:
  - V8 Regression Tests run `37205360630` PASS;
  - V8 Repair CI run `37205360709` PASS;
  - System1 C1 C2 isolated offline repair review run `37205360706` PASS.
- No Worker/runtime/D1/Production/Formal/System2 behavior change or Cloudflare deployment was introduced.
- Gate-state / denominator instrumentation is complete. Promotion-grade outcome inference remains blocked specifically by missing immutable per-field valuation source-as-of / first-known vintage provenance.
