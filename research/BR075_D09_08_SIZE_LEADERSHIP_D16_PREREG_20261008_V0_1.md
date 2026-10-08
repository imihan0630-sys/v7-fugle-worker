# BR-075 — D09-08 Size Leadership D16 Preregistration V0.1

Status: RESEARCH_ONLY / OUTCOME_BLIND / POWER_INSUFFICIENT / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-08
Date: 2026-10-08 Asia/Taipei
Observed main before write: 4dfa01cb3dd47845ed768e261f6a3d3d9191a9f7

## Frozen support

Accepted complete parent:
- `research/br037_size_leadership_receipt_20261001_v0_1.json`

Partial control:
- `research/BR038_D09_08_SIZE_LEADERSHIP_PARTIAL_OBSERVATION_20261007_V0_1.md`

A valid size-state date requires a common total-return-index basis for all three:
- Taiwan 50 TRI;
- Mid-Cap 100 TRI;
- Small-Cap 300 TRI.

The 2026-10-07 price-index observation is PARTIAL because common-complete TRI was not proven.

Frozen rule:
`PRICE_INDEX_COMPLETE != TOTAL_RETURN_INDEX_COMPLETE`.

## Independent unit

Independent unit:
`COMMON_COMPLETE_SIZE_TRI_MARKET_DATE`.

D1 / D5 / D20 / D60 from one date are repeated measures, not four independent dates.

Current complete-date N = 1.
Current inference state = POWER_INSUFFICIENT.

## Required D16 method

Before outcome access, Room11/D16 must freeze:
- date-level dependence;
- horizon multiplicity;
- sector-composition control;
- effective constituent membership;
- liquidity/turnover;
- price-limit/non-trading effects;
- breadth and trade-value concentration;
- PIT-clean market-regime controls;
- missingness/comparability policy.

If any one size leg is unavailable:
- preserve PARTIAL / NOT_COMPARABLE;
- do not splice price index into TRI;
- do not carry forward;
- do not map missing to zero;
- do not increment complete-date N.

## Maturity

D09-08 remains L3 / 60%.
No L4 promotion.

## Exact next

Accumulate genuinely new common-complete official TRI dates and request D16 method freeze before any predictive interpretation.

Formal Core unchanged.
