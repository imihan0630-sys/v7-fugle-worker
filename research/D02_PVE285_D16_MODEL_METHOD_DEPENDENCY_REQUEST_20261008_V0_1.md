# D02 PVE-285 — D16 Predictive ModelMethodReceipt dependency request

Date: 2026-10-08 Asia/Taipei
Status: CROSS_ROOM_DEPENDENCY_REQUEST / OUTCOME_BLIND / NO_FORMAL_CHANGE

Requester: 02｜價量研究室
Validation owner: 11｜統計驗證研究室 / D16-19
Parent contract: research/D02_PVE284_D16_PREDICTIVE_MODEL_METHOD_CONTRACT_20261008_V0_2.md
Machine guard: research/d02_pve284_d16_predictive_model_method_guard_v0_2.mjs

## Request

Freeze exactly one pre-outcome ModelMethodReceipt for each of the 12 D02 predictive evidence keys covered by PVE-284.

Current actual D02-specific frozen receipt count at request time: 0 / 12.

The receipt must satisfy the PVE-284 guard and be created while outcomeAccessStateAtFreeze=OUTCOME_CLOSED.

## Ownership boundary

D02 has already frozen:
- evidence key and comparator identity;
- primary outcome identity;
- primary horizon;
- DATE_BALANCED_BRIER_LOSS_IMPROVEMENT;
- equal-date/common-support comparison requirement.

D16-19 must independently choose and freeze:
- estimator family;
- calibration method;
- preprocessing/feature-selection/regularization;
- training, validation and calibration partition policies;
- refit, seed, missing-value and class-imbalance policies;
- model-search family and candidate count.

D02 does not prescribe a model implementation.

## Anti-reuse rule

The existing SDA-022 D5 method receipt proves D16 can freeze a method, but it belongs to a different estimand/feature encoding/outcome problem.

It is not automatically reusable for any D02 evidence key.

If D16 concludes one method family is suitable for multiple D02 keys, each key still needs its own immutable receipt identity and exact frozen comparator/outcome binding.

## Return contract

Return, per evidence key:
- methodReceiptId/path;
- methodVersion/hash;
- exact baseline/challenger feature-set IDs;
- estimator/calibration/preprocessing/search policies;
- exact partition policies;
- candidateMethodCount;
- multiple-testing family;
- frozenAt;
- outcomeAccessStateAtFreeze;
- PASS/BLOCKED state.

If the method cannot be frozen without inspecting labels, return BLOCKED rather than opening outcomes.

No maturity promotion. Formal Core unchanged.
