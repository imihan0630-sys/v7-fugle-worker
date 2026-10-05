# D02 Wave-1 Metric / Horizon / D16 Method Validation V0.1

Updated: 2026-10-05 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / WAVE1_VALIDATION_DESIGN_FIREWALL_PASS
Evidence cursor: PVE-239
Formal Core: LOCKED
D02 maturity impact: NONE

## Scope

Wave-1 evidence keys:
- D02-02:H001
- D02-03:H20
- D02-06:H003

This validation closes two pre-outcome researcher-degrees-of-freedom classes:
1. metric / horizon selection;
2. estimator / calibration / partition selection.

It does NOT freeze a numerical MDE / precision target.
It does NOT inspect any prospective economic outcome.

## A. Metric / horizon firewall

Artifacts:
- research/D02_WAVE1_PROMOTION_METRIC_HORIZON_FREEZE_20261005_V0_2.md
- research/d02_wave1_promotion_metric_horizon_registry_v0_2.json
- research/d02_wave1_metric_horizon_guard_v0_1.mjs
- tests/test_d02_wave1_metric_horizon_guard_v0_1.mjs

Independent executable result:
23/23 PASS.

Primary metric:
DATE_BALANCED_BRIER_LOSS_IMPROVEMENT.

Definition:
same-date mean Brier loss of baseline minus challenger, then equal weight across independent scan dates.

Primary outcome / horizon:
- H001: STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2, primary B2;
- H20: D01-owned breakout structural failure/no-follow-through, primary B2;
- H003: clean active Acceptance lifecycle from entry to first terminal success/failure or 13:00 censor.

Sensitivity governance:
- H001/H20 B1 = early-response sensitivity;
- H001/H20 B4 = persistence sensitivity;
- neither may rescue a failed B2 primary result;
- material opposite-direction sensitivity requires HORIZON_INSTABILITY_REVIEW;
- H003 B horizons remain secondary diagnostics only.

PV-084 remains mandatory supporting effect-size reporting.
PV-086 remains mandatory utility reporting.
Log loss is mandatory secondary proper-score diagnostic.

## B. D16-19 model-method firewall

Artifacts:
- research/D02_D16_WAVE1_MODEL_METHOD_HANDOFF_V0_1.md
- research/d02_d16_wave1_model_method_receipt_guard_v0_1.mjs
- tests/test_d02_d16_wave1_model_method_receipt_guard_v0_1.mjs

Independent executable result:
21/21 PASS.

Before promotion-grade outcome access, D16-19 must freeze:
- estimator family;
- calibration method;
- preprocessing;
- feature-selection and regularization policies;
- training / validation / calibration partitions;
- refit policy;
- random-seed policy;
- missing-value policy;
- class-imbalance policy;
- model-search family;
- candidate-method count;
- multiple-testing family;
- immutable method hash.

Baseline and challenger must share:
- identical common support;
- identical partitions;
- the same estimator / calibration family for the pure feature-increment comparison;
- frozen predictions before label access.

Changing model/calibrator after outcomes creates a new methodVersion / experimentVersion and enters the multiple-testing family.

D02 does not prescribe logistic / Platt / Beta / isotonic / tree / neural or another estimator.
D16-19 retains method ownership.

## C. Remaining blockers

No formal numerical D02 MDE / precision / semantic-materiality value is frozen.

D14 cost evidence remains partial:
- statutory tax semantics are known;
- broker commission/minimum fees are account-specific;
- slippage/implementation shortfall requires actual execution provenance;
- UNKNOWN cost cannot become zero.

Therefore a universal after-cost numerical MDE cannot be honestly inferred now.

Wave-1 also still needs actual D16-19 frozen ModelMethodReceipt objects for the three evidence keys before promotion-grade Brier interpretation.

## D. Maturity consequence

No L4 promotion.
No PVE number consumed.
No clean prospective date created.
No Formal optimization candidate.

D02 remains 60.0%.
PVE-239.
CLEAN_DATE_ZERO.
Gate 7 CLOSED.
Formal Core LOCKED.
