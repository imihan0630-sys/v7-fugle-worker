# Capital Deployment Cap / Reserve Audit

Updated: 2026-09-27
Status: FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY
Formal Core: LOCKED

## Structural finding

The current allocation helper is score-proportional, but the 35% single-name cap is applied with simple clipping:

`ratio = min(35%, deployRatio * score / scoreTotal)`

There is no second pass that redistributes clipped capital to other already-selected names.

The helper then floors each planned allocation to the nearest NT$1,000.

Nominal deployment ratios:
- 1 selected name: 35%
- 2 selected names: 60%
- 3+ selected names: 85%

Therefore actual planned deployment can be below the nominal ratio for two distinct reasons:
1. CAP_CLIPPING_RESERVE — score concentration pushes one or more names above 35%, and the excess remains cash;
2. ROUNDING_RESERVE — each capped allocation is floored to NT$1,000.

This is not automatically a defect. Leaving clipped capital in cash may be an intentional risk response to low breadth of conviction. Redistributing it can force much larger allocations into lower-score names.

## Deterministic counterexamples

Two names with scores 90/10:
- nominal deployment = 60%;
- raw score-proportional ratios = 54% / 6%;
- current formula = 35% / 6% = 41% total before rounding;
- 19% of pool capital remains cash from cap clipping alone.

A diagnostic capped-waterfill counterfactual could reach 35% / 25% = 60%, but it increases the lower-score name from 6% to 25%. That is a major behavior change and is not presumed better.

Three equal scores with NT$200,000:
- nominal deployment = NT$170,000 (85%);
- pre-round each ≈ NT$56,666.67;
- current formula floors to NT$56,000 each = NT$168,000;
- 1% of pool capital remains cash from rounding.

This exactly illustrates why actual deployment can be 84% even without cap clipping.

## Falsification protocol

Before any allocation change:
- measure actual cap-bound frequency prospectively using PIT score/allocation provenance;
- separate cap-clipping reserve from rounding reserve and no-opportunity reserve;
- compare current clip-and-cash against capped-waterfill, equal-capital and equal-planned-stop-risk counterfactuals;
- preserve the same candidate set and same pool capital;
- test D1/D3/D5, MFE/MAE, stop-first, drawdown and opportunity retention;
- aggregate by scanDate, pool, market regime and number of selected names;
- do not interpret higher capital utilization as better unless risk-adjusted outcomes support it.

## Governance

Any redistribution of clipped capital changes actual Formal capital allocation and is Class C.
No change is authorized by this structural audit.
