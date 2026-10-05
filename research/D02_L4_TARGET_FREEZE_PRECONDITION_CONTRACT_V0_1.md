# D02 L4 Target Freeze Precondition Contract V0.1

Updated: 2026-10-05 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / NUMERICAL_TARGET_FREEZE_GUARD
Evidence cursor: PVE-239
Formal Core impact: NONE

## Purpose

Define when a pending D02 numerical EffectTargetReceipt may legally become FROZEN.

A numerical target is not valid merely because:
- it is positive;
- it has a version;
- it was typed into a registry before the final report.

The derivation itself must be outcome-independent and decision-relevant.

## Allowed rationale bases

1. COST_BENEFIT
   - target derived from decision-relevant benefit versus evidenced cost/friction;
   - UNKNOWN commission/slippage may not be treated as zero;
   - D14-owned cost-quality receipt is required when the claim depends on execution economics.

2. THEORETICAL_BOUND
   - target follows from a quantifiable mechanism/decision boundary frozen independently of D02 outcomes.

3. PRIOR_INDEPENDENT_EVIDENCE
   - planning dataset is immutable;
   - disjoint from the future promotion evidence set;
   - provenance/version/hash frozen;
   - used for planning only and never silently counted again as L4 evidence.

4. PRECISION_REQUIREMENT
   - maximum acceptable uncertainty is justified by a decision consequence;
   - resource availability alone may be reported but cannot masquerade as economic materiality.

5. SEMANTIC_POLICY
   - D02-01 only;
   - acceptable semantic error/material-prevention tolerance is explicitly justified as governance policy;
   - never translated into alpha.

## Forbidden bases

- CURRENT_D02_PROSPECTIVE_OUTCOME;
- POST_OUTCOME_WINNER_SELECTION;
- BEST_HORIZON_AFTER_RESULTS;
- BEST_METRIC_AFTER_RESULTS;
- TEST_FIXTURE_VALUE;
- GENERIC_BENCHMARK_WITHOUT_JUSTIFICATION;
- UNKNOWN_COST_AS_ZERO;
- ANOTHER_EVIDENCE_KEY_TARGET.

## Planning baseline rules

If baseline event rates, variances or effect distributions are used:
- planningDataReceiptId required;
- planningDataHash required;
- planningDataFrozenAt required;
- disjointFromPromotionEvidence=true;
- outcomeAccessStateAtPlanningFreeze=OUTCOME_CLOSED for the future promotion experiment;
- historical/retrospective planning evidence must be labeled PLANNING_ONLY;
- it cannot later be counted as prospective/OOS L4 evidence.

## Wave-1 additional rule

For H001/H20/H003:
- frozen comparator must match the primary shell;
- frozen outcome family must match the primary shell;
- a horizon rule must be frozen before numerical target freeze;
- a statistical metric/effect-size rule must be frozen before numerical target freeze.

The repository currently freezes effect-size reporting priorities:
- absolute failure-rate difference;
- risk ratio;
- median MFE/MAE/return;
- subgroup/date stability.

However no target may claim a singular metric unless the exact contrast is frozen.

## Current state

No D02 numerical target passes this precondition yet.

Known blockers:
- no formal numerical target values;
- Wave-1 lacks a singular promotion-grade metric/horizon rule;
- D02-11 depends on incomplete D14 execution-cost evidence;
- D02-01 lacks a formal semantic-tolerance policy;
- no independent planning baseline has been frozen as target-setting evidence.

This guard is intended to make "pending" explicit and safe, not to force arbitrary target completion.

D02 remains 60.0%.
PVE-239.
Gate 7 CLOSED.
