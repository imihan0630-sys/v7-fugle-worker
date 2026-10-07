# D01 DL-071 — Structural-Level Freshness Tournament V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FRESHNESS_PREREGISTRATION / FORMAL_CORE_LOCKED

## Purpose

Replace vague statements such as "old support becomes weak" or "more tests make a level stronger" with preregistered competing freshness clocks.

No outcome is opened in this tranche. This file defines the candidates, denominators, exclusions and falsification logic before any Taiwan outcome join.

## Evidence boundary

Prior support/resistance research reports both memory and decay. That evidence justifies testing freshness; it does not identify the correct Taiwan decay clock.

Calendar-time half-life is not assumed.

## Root population

Every structural root created by the canonical D01 formation rule enters one append-only root population.

Preserve:
- structuralRootId
- formedAt
- firstObservableAt
- firstEligibleSession
- price/tick/volatility/liquidity state
- formation mechanism
- source/version/hash

A root remains in the denominator even when:
- never revisited
- expired
- crossed
- corporate-action rebased
- suspension-overlapped
- disposition-overlapped
- data blocked

No survivor-only dataset.

## Five competing freshness clocks

F1 ELIGIBLE_SESSION_COUNT
Count only eligible trading sessions under canonical session rules.

F2 INDEPENDENT_EXECUTION_COUNT
Count independent executable trade/match opportunities after formation.
Duplicate vendor prints and pseudo-bars do not increment.

F3 INFORMATION_EVENT_COUNT
Count owner-certified material information events after formation.
Unknown event coverage remains UNKNOWN rather than zero.

F4 VOLATILITY_DISTANCE_TRAVELED
Accumulate absolute/realized movement in a preregistered volatility-normalized metric.
The exact estimator must be frozen before outcomes.

F5 LIQUIDITY_OPPORTUNITY_COUNT
Count owner-certified tradable liquidity opportunities under applicable matching regime.
Periodic matching and suspension semantics apply.

Calendar elapsed time is retained as context but is not a sixth automatically valid freshness model.

## Touch history is not freshness by itself

Keep separate:
- age clock
- revisit count
- bounce count
- cross count
- time since last interaction
- interaction outcome sequence

"Three prior bounces" and "recent level" are different variables.

## Monotonicity is not assumed

Each clock may have:
- MONOTONE_DECAY
- HUMP_SHAPED
- THRESHOLD_DECAY
- NO_DECAY
- NONMONOTONIC
- NOT_IDENTIFIED

Do not force exponential decay.

## Multiple-testing firewall

Before outcomes:
- freeze candidate clocks;
- freeze transformation families;
- freeze candidate bins or spline degrees;
- freeze primary comparison metric;
- freeze tie-breaking rule;
- freeze minimum common-support and sample-size requirements.

No post-hoc winner creation.

## Primary falsification tournament

For each root at each eligible evaluation point:
1. compute all five clocks using predictor-available data only;
2. assign common-support strata;
3. estimate the same preregistered endpoint separately for each clock;
4. compare incremental fit/predictive value over the same baseline;
5. apply multiple-testing correction / nested validation through D16;
6. allow NO_WINNER.

Winning one period/regime does not authorize Formal use.

## Baseline controls

At minimum:
- price level/tick regime
- liquidity/spread
- volatility/regime
- root formation mechanism
- root age in ordinary calendar context
- prior touch history
- corporate-action/suspension/disposition state
- market/sector context

## Outcome leakage firewall

Future bounce/cross information does not enter any clock at predictor freeze.

If a clock definition requires knowing whether a later interaction was successful:
INVALID_FRESHNESS_CLOCK_LOOKAHEAD.

## Cross-clock dependence

Five clocks can be highly correlated.

They are challenger definitions of one latent freshness concept, not five independent confirmations.

Default:
informationRoot = STRUCTURAL_FRESHNESS_LATENT
effectiveIndependentEvidenceCount = 1

## Promotion rule

A clock can become a research-preferred freshness representation only if:
- PIT replay safe
- same root population
- common support valid
- OOS/prospective superiority vs simpler alternatives
- stable across multiple regimes
- robustness to liquidity/tick/trading-mechanism controls
- no material dependence on a small number of extreme roots

Even then Formal Core promotion requires separate governance.

## D16 ladder

F0 ROOT_POPULATION_FROZEN
F1 CLOCK_DEFINITIONS_PREREGISTERED
F2 PIT_CLOCK_REPLAY_VALIDATED
F3 DENOMINATOR_INCLUDES_NO_REVISIT_ROOTS
F4 COMMON_SUPPORT_MATCHED
F5 CLOCK_DEPENDENCE_MEASURED
F6 SIMPLE_BASELINE_COMPARED
F7 MULTIPLE_TESTING_CONTROLLED
F8 OOS_OR_PROSPECTIVE_TOURNAMENT
F9 MULTI_REGIME_STABILITY
F10 LIQUIDITY_TICK_MECHANISM_ROBUSTNESS
F11 FRESHNESS_REPRESENTATION_WINNER_OR_NO_WINNER
F12 STRUCTURAL_RESPONSE_INCREMENTAL_CANDIDATE

## Interpretation states

Q0 CALENDAR_DECAY_NOT_IDENTIFIED
Q1 SESSION_AGE_EXPLANATION
Q2 EXECUTION_OPPORTUNITY_EXPLANATION
Q3 INFORMATION_ARRIVAL_EXPLANATION
Q4 VOLATILITY_DISTANCE_EXPLANATION
Q5 LIQUIDITY_OPPORTUNITY_EXPLANATION
Q6 TOUCH_HISTORY_EXPLANATION
Q7 NO_SINGLE_CLOCK_WINNER
Q8 FRESHNESS_RESIDUAL_CANDIDATE
Q9 DATA_COVERAGE_UNKNOWN
Q10 NOT_EVALUABLE

## SDA

SDA-001 remains open: freshness is not an extra independent vote on top of price structure.
SDA-002 remains open: every clock uses only information available by predictorFreezeAt.

## Current decision

CALENDAR_AGE_EQUALS_FRESHNESS = FALSE.
MORE_TOUCHES_ALWAYS_STRONGER = FALSE.
FRESHNESS_MUST_DECAY_MONOTONICALLY = FALSE.
FIVE_CLOCKS_EQUAL_FIVE_VOTES = FALSE.
NO_WINNER_IS_ALLOWED = TRUE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement deterministic five-clock receipt validator and denominator guard.
2. Add adversarial tests for suspended sessions, duplicate prints, unknown event coverage, periodic matching and future-outcome leakage.
3. Hand F0-F12/Q0-Q10 to D16.
4. Next D01 science: decompose repeated-touch "strength" into familiarity/self-fulfilling memory versus depletion/consumption of resting liquidity; do not assume more touches are always stronger.
