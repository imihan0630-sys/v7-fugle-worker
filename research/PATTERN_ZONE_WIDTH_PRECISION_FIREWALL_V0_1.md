# D01 DL-073 — Structural-Zone Width / Precision-Illusion Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ZONE_UNCERTAINTY / FORMAL_CORE_LOCKED

## Purpose

Reject the false precision that support/resistance is one exact price.

Observed response may spread across ticks because of:
- tick size;
- bid-ask spread;
- queue placement;
- volatility;
- auction clearing;
- multiple historical executions;
- price clustering;
- data/vendor timestamp granularity.

A structural object is generally a zone with uncertainty, not a magical line.

## Zone representation

Preserve:
- structuralRootId
- centerPrice
- lowerBound
- upperBound
- widthTicks
- widthBps
- widthVolatilityUnits
- formationMethod
- uncertaintyMethod
- firstObservableAt
- version
- predictorFreezeAt

No outcome-based resizing.

## Candidate width families

W1 TICK_FIXED
W2 SPREAD_SCALED
W3 VOLATILITY_SCALED
W4 EXECUTION_DISTRIBUTION
W5 HYBRID_PREREGISTERED

These are challenger definitions, not independent votes.

## Precision illusion

A one-tick crossing of a wide uncertainty zone is not equivalent to a confirmed breakout.

Separate:
- ENTER_ZONE
- TOUCH_ZONE
- PARTIAL_PENETRATION
- FULL_ZONE_CROSS
- CLOSE_BEYOND_ZONE
- RECLAIM_ZONE
- DATA_BLOCKED

Confirmation rule must be preregistered.

## Width-selection bias

Choosing zone width after seeing whether price bounced creates direct hindsight leakage.

Freeze width family and parameters before evaluation.

## Tick / volatility interaction

A fixed 1% band has very different meaning across high-price/low-price and low/high-volatility stocks.

Future comparison must report width in:
- ticks
- basis points
- volatility units

## D16 ladder

Z0 RAW_LINE_BASED_RESPONSE
Z1 ZONE_FAMILY_PREREGISTERED
Z2 TICK_REGIME_CONTROLLED
Z3 SPREAD_CONTROLLED
Z4 VOLATILITY_CONTROLLED
Z5 EXECUTION_DISTRIBUTION_CONTROLLED
Z6 NO_OUTCOME_BASED_RESIZING_VERIFIED
Z7 WIDTH_FAMILY_COMMON_SUPPORT
Z8 CROSSING_STATE_SEPARATED
Z9 OOS_WIDTH_TOURNAMENT
Z10 NO_WINNER_ALLOWED
Z11 STRUCTURAL_ZONE_RESIDUAL_CANDIDATE

## Interpretation

Q0 ONE_PRICE_PRECISION_ARTIFACT
Q1 TICK_GRID_EXPLANATION
Q2 SPREAD_EXPLANATION
Q3 VOLATILITY_EXPLANATION
Q4 EXECUTION_DISTRIBUTION_EXPLANATION
Q5 WIDTH_SELECTION_LOOKAHEAD
Q6 STRUCTURAL_ZONE_RESIDUAL
Q7 NOT_EVALUABLE

## Current decision

SUPPORT_RESISTANCE_EQUALS_ONE_EXACT_PRICE = FALSE.
ONE_TICK_CROSS_EQUALS_BREAKOUT = FALSE.
OUTCOME_BASED_ZONE_RESIZING_ALLOWED = FALSE.
MULTIPLE_WIDTHS_EQUAL_MULTIPLE_VOTES = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement deterministic zone-width and crossing-state classifier.
2. Add tests for tick/spread/volatility scaling and hindsight resizing.
3. Hand Z0-Z11/Q0-Q7 to D16.
4. Next science: interaction between zone width, target-price/RR geometry and stop placement without double-counting the same uncertainty.
