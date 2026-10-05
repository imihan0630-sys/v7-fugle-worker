# D02 L4 Primary Outcome / Estimand Shell Freeze V0.1

Updated: 2026-10-05 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PARTIAL_TARGET_SHELL_FREEZE
Evidence cursor: PVE-239
Formal Core impact: NONE

## Purpose

Reduce post-outcome researcher degrees of freedom without inventing numerical targets.

This pass freezes the primary estimand/outcome family for the four best-specified evidence keys:
- D02-01 semantic governance;
- D02-02 H001;
- D02-03 H20;
- D02-06 H003.

It does NOT complete the promotion-grade EffectTargetReceipt.

## Frozen shells

### D02-01:SEMANTIC_GOVERNANCE
- shell status: PRIMARY_ESTIMAND_SHELL_FROZEN_NUMERICAL_VALUE_PENDING
- estimand ID: D02_01_MATERIAL_PREVENTION_RATE_V0_1
- estimand: Among prospectively eligible semantic receipts, rate at which frozen governance prevents/changes a classification that the ungoverned frozen adapter would admit.
- metric: materialPreventionCandidateCount / eligibleSemanticReceipts
- unit: share_of_eligible_semantic_receipts
- direction: GREATER_THAN_OR_EQUAL
- comparator: GOVERNED_VS_UNGOVERNED_FROZEN_ADAPTER
- primary outcome family: CLASSIFICATION_DELTA / MATERIAL_PREVENTION
- horizon: SAME_DECISION_RECEIPT
- cost treatment: NOT_APPLICABLE_TO_SEMANTIC_PRIMARY_ESTIMAND
- still pending: thresholdValue; semantic materiality rationale
- authority: research/d02_01_l4_semantic_governance_admission_v0_1.mjs; research/D02_L4_EFFECT_TARGET_CONTRACT_V0_1.md

### D02-02:H001
- shell status: PRIMARY_OUTCOME_FAMILY_FROZEN_METRIC_AND_VALUE_PENDING
- estimand ID: D02_02_H001_STRUCTURAL_FAILURE_INCREMENT_V0_1
- estimand: Incremental discrimination of frozen structural failure/no-follow-through when pvSlotRvol20 is added beyond the existing local previous-five-bar volume ratio on identical support.
- metric: PENDING
- unit: PENDING
- direction: IMPROVEMENT_REQUIRED
- comparator: MODEL_C_VS_MODEL_B
- primary outcome family: FROZEN_STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH
- horizon: B1_B2_B4_FAMILY_PRIMARY_HORIZON_NOT_YET_SELECTED
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- still pending: single statistical discrimination metric; single primary horizon; MDE_or_precision_value; cost-benefit rationale
- authority: PRICE_VOLUME_HYPOTHESIS_LEDGER.md:PV-H001; research/d02_l4_wave1_preregistration_20261004_v0_1.md; PRICE_VOLUME_SHADOW_SPEC.md

### D02-03:H20
- shell status: PRIMARY_OUTCOME_FAMILY_FROZEN_METRIC_AND_VALUE_PENDING
- estimand ID: D02_03_H20_BREAKOUT_QUALITY_INCREMENT_V0_1
- estimand: Incremental breakout-quality discrimination from same-slot RVOL beyond local previous-five-bar volume ratio on the identical D01-owned breakout event.
- metric: PENDING
- unit: PENDING
- direction: IMPROVEMENT_REQUIRED
- comparator: MODEL_C_VS_MODEL_B_ON_IDENTICAL_D01_BREAKOUT_EVENT
- primary outcome family: BREAKOUT_STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH
- horizon: B1_B2_B4_FAMILY_PRIMARY_HORIZON_NOT_YET_SELECTED
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- still pending: single statistical discrimination metric; single primary horizon; MDE_or_precision_value; cost-benefit rationale
- authority: PRICE_VOLUME_HYPOTHESIS_LEDGER.md:H20_SHARED_EVENT; research/d02_l4_wave1_preregistration_20261004_v0_1.md; PRICE_VOLUME_SHADOW_SPEC.md

### D02-06:H003
- shell status: PRIMARY_OUTCOME_FAMILY_FROZEN_METRIC_AND_VALUE_PENDING
- estimand ID: D02_06_H003_ACCEPTANCE_FAILURE_INCREMENT_V0_1
- estimand: Incremental future structural acceptance/failure discrimination from PRICE_PLUS_VOLUME_RESPONSE beyond PRICE_ONLY_RESPONSE on identical clean events.
- metric: PENDING
- unit: PENDING
- direction: IMPROVEMENT_REQUIRED
- comparator: PRICE_PLUS_VOLUME_RESPONSE_VS_PRICE_ONLY_RESPONSE
- primary outcome family: STRUCTURAL_ACCEPTANCE_FAILURE
- horizon: FUTURE_ONLY_AFTER_FEATURE_BAR_PRIMARY_HORIZON_NOT_YET_SELECTED
- cost treatment: ECONOMIC_PROMOTION_REQUIRES_D14_COST_STRATIFICATION
- still pending: single statistical discrimination metric; single primary horizon; MDE_or_precision_value; cost-benefit rationale
- authority: PRICE_VOLUME_HYPOTHESIS_LEDGER.md:PV-H003; research/d02_l4_wave1_preregistration_20261004_v0_1.md; PRICE_VOLUME_CHECKPOINT.md:H003_ANTI_CIRCULARITY


## Important non-decisions

No statistical metric is invented for H001/H20/H003 in this pass.

Reason:
the repository freezes outcome labels and comparator ladders, but does not yet freeze a unique promotion-grade score such as:
- AUC;
- Brier improvement;
- log-loss improvement;
- risk difference;
- odds ratio;
- return spread.

Selecting one after outcomes would create a new test-shopping degree of freedom.

No B1/B2/B4 horizon is declared primary yet.
All remain legitimate stored outcomes, but a promotion-grade target must select one or explicitly preregister a multihorizon rule before outcome access.

## D02-01 distinction

D02-01 is sufficiently defined to freeze its primary semantic metric:
materialPreventionCandidateCount / eligibleSemanticReceipts.

The numerical semantic-materiality threshold remains pending because no formal tolerance for false semantic admission is currently documented.

A positive semantic-governance result cannot be converted into an alpha claim.

## Consequence

Four evidence keys now have less outcome-selection freedom than before.

Promotion-grade status remains blocked because:
- 0 numerical targets are frozen;
- H001/H20/H003 still need one primary statistical metric and one primary horizon;
- D02-01 still needs a justified semantic materiality threshold.

D02 maturity remains 60.0%.
PVE-239.
CLEAN_DATE_ZERO.
Gate 7 CLOSED.
