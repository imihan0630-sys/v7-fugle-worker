# D18-10 Strategy Dependence / Ensemble Data Layer L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 policy impact: NONE

## Scope

This packet evaluates D18-10 多策略相關性／Ensemble only at the data-feasibility layer.

It validates the ability to build a correct strategy × decision-date common-support return panel from frozen D18-13 attribution observations.

It does NOT claim:
- stable strategy correlation;
- diversification benefit;
- ensemble superiority;
- portfolio weights;
- dynamic allocation;
- L4 prospective/OOS evidence.

## Executable builder

Implementation:
`system2/runtime/d18_strategy_dependence_panel_v0_1.mjs`

Test:
`system2/tests/d18_strategy_dependence_panel_v0_1.test.mjs`

Inputs are frozen D18-13 attribution observations with:
- strategyId / strategyVersion;
- marketDate;
- candidateState;
- explicit horizon;
- gross or benchmark-relative return;
- immutable attribution receipt hash.

The builder requires:
- explicit expected strategy list;
- explicit candidate-state cohort;
- one horizon;
- one metric;
- KNOWN attribution observations only.

## Date-level independence firewall

Multiple stock rows for one strategy on one date are first collapsed to one date-level strategy return using an explicit equal-weight decision-return aggregation.

The panel reports:
- independentDateCount;
- per-strategy decisionCount;
- per-strategy symbolCount;
- per-date strategy cells.

Stock rows are NOT treated as independent strategy dates.

## Missingness firewall

When a strategy has no KNOWN attribution row on a date:

state = MISSING
value = null

The builder explicitly records:
missingReturnImputedAsZero = false

It does not silently convert:
- no candidate;
- immature outcome;
- data failure;
- missing strategy-day

into a zero return.

This is critical because zero imputation can materially bias covariance/correlation downward and manufacture apparent diversification.

## Pairwise common-support frame

For each strategy pair, the builder returns:
- commonDateCount;
- commonDates;
- pairedReturns.

It deliberately sets:
- correlationEstimated=false;
- diversificationClaimMade=false.

The L3 object therefore answers:
"Which exact independent dates can legally be compared?"

It does NOT answer:
"Are the strategies reliably uncorrelated?"

## Why correlation is not estimated at L3

The required independent-date sample size depends on:
- true dependence;
- serial dependence;
- Regime composition;
- strategy occupancy;
- desired precision;
- tail dependence.

No universal minimum N is invented here.

Correlation / covariance estimation belongs to later OOS/prospective evidence once enough independent dates and multiple Regime episodes exist.

## Replay / falsification

System2 Research CI run 37175117140: SUCCESS.
Log confirms:
- D18 strategy dependence panel tests: PASS;
- Production isolation guard PASS.

V8 Regression run 37175117237: SUCCESS.

Tests verify:
- same inputs -> same panelHash;
- same-date multi-stock strategy rows aggregate deterministically;
- missing strategy-day stays MISSING/null;
- pairwise common dates exclude missing days;
- duplicate decisionId is rejected;
- mixed horizons are rejected;
- UNKNOWN attribution rows cannot enter;
- no correlation / weights / diversification claim is produced.

## L3 gate

Per D16_D18_PROMOTION_GATE_V0_1:

1. executable/tested data builder — PASS.
2. source/version provenance — PASS via D18-13 immutable attribution receipts.
3. deterministic replay — PASS.
4. UNKNOWN/missing fail-closed — PASS.
5. no historical backfill — PASS; consumes frozen attribution observations only.
6. source coverage semantics audited — PASS at data-feasibility level; missing strategy-days remain visible rather than imputed.

## Maturity decision

Promote:
D18-10 L2/40 -> L3/60.

This is data-feasibility maturity only.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## L4 blockers

Before L4:
- accumulate genuine prospective/OOS strategy-date returns;
- report independent date count;
- preserve strategy-day missingness reasons;
- accumulate multiple Regime episodes;
- estimate correlation with dependence-aware uncertainty;
- inspect tail dependence / crisis co-movement;
- compare diversification against equal/static baseline;
- charge turnover/costs for any ensemble policy;
- prevent policy weights from being selected on outer OOS.

## Exact next

1. Persist strategy-date common-support panels prospectively.
2. Accumulate multiple independent dates and Regime episodes.
3. Only then estimate correlation/covariance and uncertainty.
4. Keep D18-09 dynamic weighting separate and unarmed.
5. D18-14 walk-forward remains blocked until sequential occupancy is sufficient.
