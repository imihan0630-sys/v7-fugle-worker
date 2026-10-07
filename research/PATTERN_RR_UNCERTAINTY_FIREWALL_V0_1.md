# D01 DL-074 — Zone Width / Stop / Target / RR Uncertainty Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / RR_UNCERTAINTY_DEDUP / FORMAL_CORE_LOCKED

## Purpose

Prevent one underlying structural uncertainty from being counted repeatedly in:
- zone width;
- breakout confirmation distance;
- stop placement;
- target resistance distance;
- risk/reward ratio;
- confidence scoring.

D01-11 owns target/resistance/RR geometry. Execution cost/slippage remains outside D01 ownership.

## Uncertainty decomposition

Keep distinct:

U1 STRUCTURAL_GEOMETRY_UNCERTAINTY
- uncertainty in structural zone center/bounds.

U2 EXECUTION_UNCERTAINTY
- spread/slippage/fill/queue uncertainty.

U3 VOLATILITY_RISK
- stochastic price movement around the thesis.

U4 EVENT_GAP_RISK
- overnight/event discontinuity.

U5 MODEL_SELECTION_UNCERTAINTY
- uncertainty from choosing among zone/target/stop definitions.

Do not collapse them into one arbitrary safety buffer.

## Entry/stop/target objects

For each trade geometry preserve:
- structuralRootId
- entryReference
- zoneLowerBound
- zoneUpperBound
- breakoutConfirmationRule
- stopRuleFamily
- stopReference
- targetRuleFamily
- targetReference
- riskDistance
- rewardDistance
- grossRR
- geometryUncertaintyReceipt
- executionCostReceipt
- volatilityRiskReceipt
- eventGapReceipt
- predictorFreezeAt
- source/version/hash

## Double-count firewall

If zone width already represents structural uncertainty, the same uncertainty cannot be added again as:
- extra stop padding;
- extra target haircut;
- extra confirmation distance;
- extra confidence penalty
unless each transformation has an explicit, non-duplicative owner and rationale.

Freeze:
UNCERTAINTY_COMPONENT_LINEAGE.

## Gross vs executable RR

Gross geometric RR:
rewardDistance / riskDistance

Executable RR must separately account for owner-certified execution costs.

D01 does not fabricate slippage.

If execution-cost receipt unavailable:
EXECUTABLE_RR_DATA_BLOCKED.

Gross RR remains geometric research context only.

## Stop families

Candidate families:
- ZONE_INVALIDATION_STOP
- VOLATILITY_SCALED_STOP
- SWING_INVALIDATION_STOP
- FIXED_RISK_STOP
- HYBRID_PREREGISTERED_STOP

No stop family is selected after observing whether the trade survived.

## Target families

Candidate families:
- NEXT_STRUCTURAL_RESISTANCE
- MEASURED_MOVE
- PRIOR_SWING_EXTREME
- VOLATILITY_SCALED_TARGET
- HYBRID_PREREGISTERED_TARGET

Target choice must be known by predictor freeze.

## Asymmetry

Wider structural uncertainty can affect stop and target asymmetrically.

Do not automatically widen both sides equally.

The effect depends on:
- direction;
- neighboring resistance/support;
- local volatility;
- execution conditions;
- gap risk.

## Comparator

Future D16 comparison must hold the same structural root and entry state while varying preregistered geometry families.

Primary questions:
- Does a wider valid zone improve calibration or merely reduce trade frequency?
- Does stop padding add value after structural width is already accounted for?
- Does target haircut improve realized executable RR after costs, or only cosmetically alter gross RR?
- Does any geometry survive multiple-testing control and OOS/prospective validation?

## D16 ladder

R0 RAW_GROSS_RR
R1 STRUCTURAL_ZONE_UNCERTAINTY_CONTROLLED
R2 STOP_FAMILY_PREREGISTERED
R3 TARGET_FAMILY_PREREGISTERED
R4 UNCERTAINTY_COMPONENT_LINEAGE_DEDUPED
R5 VOLATILITY_RISK_SEPARATED
R6 EVENT_GAP_RISK_SEPARATED
R7 EXECUTION_COST_RECEIPT_JOINED
R8 SAME_ROOT_COMMON_SUPPORT
R9 MULTIPLE_GEOMETRY_TESTING_CONTROLLED
R10 OOS_EXECUTABLE_RR_EVALUATED
R11 ROBUSTNESS_ACROSS_LIQUIDITY_REGIMES
R12 GEOMETRY_INCREMENTAL_CANDIDATE

## Interpretation

Q0 STRUCTURAL_UNCERTAINTY_DOUBLE_COUNT
Q1 STOP_PADDING_EXPLANATION
Q2 TARGET_HAIRCUT_EXPLANATION
Q3 EXECUTION_COST_EXPLANATION
Q4 VOLATILITY_RISK_EXPLANATION
Q5 EVENT_GAP_RISK_EXPLANATION
Q6 MODEL_SELECTION_EXPLANATION
Q7 RR_GEOMETRY_RESIDUAL
Q8 NOT_EVALUABLE

## Current decision

GROSS_RR_EQUALS_EXECUTABLE_RR = FALSE.
ZONE_WIDTH_MAY_BE_COUNTED_TWICE = FALSE.
STOP_PADDING_ALWAYS_IMPROVES_RISK_CONTROL = FALSE.
TARGET_HAIRCUT_ALWAYS_IMPROVES_REALISM = FALSE.
BEST_EX_POST_STOP_TARGET_ALLOWED = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement uncertainty-component lineage and gross/executable RR classifier.
2. Add adversarial tests for double-counted zone width, missing execution cost, ex-post stop/target selection and asymmetric uncertainty.
3. Hand R0-R12/Q0-Q8 to D16.
4. Next D01 science: joint path-dependence of breakout confirmation, retest entry and stop placement; separate one structural episode from multiple apparent signals.
