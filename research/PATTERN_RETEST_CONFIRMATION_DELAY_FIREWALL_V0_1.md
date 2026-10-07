# D01 DL-076 — Retest Path Quality / Confirmation-Delay Tradeoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / RETEST_TIMING_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

Separate whether retest entry is better because of structural information or simply because it buys later, closer to invalidation, with different execution and opportunity cost.

## Retest object

Preserve:
- structuralEpisodeId
- breakoutAt
- firstRetestEligibleAt
- retestObservedAt
- retestDepthTicks
- retestDepthVolatilityUnits
- retestDurationEligibleSessions
- reclaimAt
- entryEligibleAt
- confirmationLatency
- missedMoveBeforeEntry
- stopDistanceAtEntry
- targetDistanceAtEntry
- predictorFreezeAt
- replaySafe

## Competing explanations

R1 STRUCTURAL_RECONFIRMATION
The broken zone may become accepted from the opposite side.

R2 DELAY_SELECTION
Waiting for retest filters out fast failures, creating survivorship unless all non-retesting episodes remain in denominator.

R3 BETTER_RISK_GEOMETRY
Later entry may reduce stop distance or improve gross RR without adding structural information.

R4 EXECUTION_DIFFERENCE
Liquidity/spread/slippage may differ at retest.

R5 OPPORTUNITY_COST
Strong breakouts may never retest; requiring retest can systematically miss winners.

R6 REGIME_CONFOUNDING
Retests may occur more in lower-momentum or higher-noise regimes.

## Retest denominator

Keep all breakout episodes:
- no_retest
- retest_then_continue
- retest_then_fail
- immediate_fail
- immediate_continue_without_retest
- data_blocked

No analysis may condition only on observed retests.

## Confirmation latency

Every extra confirmation rule delays entry.

Preserve:
- confirmationBars
- confirmationEligibleSessions
- confirmationPriceDistance
- missedMoveBeforeEntry
- remainingRewardDistance
- stopDistanceAtEntry

Signal accuracy and economic value are separate.

## Comparator families

A breakout entry vs retest-required entry on the same episode population.
B retest observed vs no-retest with inverse-probability/common-support diagnostics.
C shallow vs deep retest only after preregistered bins.

## D16 ladder

R0 RAW_RETEST_ENTRY_PERFORMANCE
R1 FULL_BREAKOUT_DENOMINATOR_RESTORED
R2 SAME_EPISODE_IDENTITY_CONTROLLED
R3 RETEST_SELECTION_CONTROLLED
R4 CONFIRMATION_LATENCY_MEASURED
R5 MISSED_MOVE_MEASURED
R6 RISK_GEOMETRY_SEPARATED
R7 EXECUTION_COST_SEPARATED
R8 REGIME_AND_MOMENTUM_CONTROLLED
R9 NO_RETEST_WINNERS_RETAINED
R10 OOS_RETEST_POLICY_COMPARISON
R11 ECONOMIC_VALUE_AFTER_DELAY_COST
R12 RETEST_INCREMENTAL_CANDIDATE

## Interpretation states

Q0 SURVIVORSHIP_BY_RETEST_SELECTION
Q1 STRUCTURAL_RECONFIRMATION_EXPLANATION
Q2 BETTER_RISK_GEOMETRY_EXPLANATION
Q3 EXECUTION_EXPLANATION
Q4 OPPORTUNITY_COST_EXPLANATION
Q5 REGIME_CONFOUNDING
Q6 RETEST_INCREMENTAL_RESIDUAL
Q7 NOT_EVALUABLE

## Current decision

RETEST_REQUIRED_IS_ALWAYS_SAFER = FALSE.
RETEST_ENTRY_SUPERIORITY_EQUALS_NEW_ALPHA = FALSE.
NO_RETEST_EPISODES_MAY_BE_DROPPED = FALSE.
MORE_CONFIRMATION_ALWAYS_IMPROVES_ECONOMIC_VALUE = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement denominator and confirmation-latency classifier.
2. Add adversarial tests for no-retest winners, delayed-entry survivor bias, improved RR without new information and retest failure.
3. Hand R0-R12/Q0-Q7 to D16.
4. Next D01 science: multi-timeframe aliasing where daily breakout, 60m breakout and 15m continuation may all descend from the same price path.
