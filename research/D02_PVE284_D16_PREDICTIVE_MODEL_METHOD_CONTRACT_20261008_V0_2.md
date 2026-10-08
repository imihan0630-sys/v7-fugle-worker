# D02 PVE-284 — D16 predictive ModelMethodReceipt contract V0.2

Date: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / 12_PREDICTIVE_LANES_METHOD_CONTRACT_FROZEN / ACTUAL_RECEIPTS_PENDING / NO_MATURITY_CHANGE

## Why PVE-284 exists

PVE-283 expands singular Brier-score primary metrics/horizons beyond Wave-1.
That creates the same preregistration obligation already recognized for H001/H20/H003:
a proper scoring rule does not protect against post-outcome estimator/calibrator/model-search selection.

Therefore every D02 predictive lane using DATE_BALANCED_BRIER_LOSS_IMPROVEMENT must have one immutable D16-19-owned pre-outcome ModelMethodReceipt.

## Covered keys: 12

Wave-1:
- D02-02:H001
- D02-03:H20
- D02-06:H003

PVE-283 lanes:
- D02-04:DRYUP
- D02-05:EXTREME_PARTICIPATION
- D02-07:SVB20
- D02-08:PROVIDER_PRESSURE
- D02-09:PIVOT_SIGNED_VOLUME
- D02-09:PARTICIPATION_TRAJECTORY
- D02-10:TREND_VOLUME_INTERACTION
- D02-12:TIME_OF_DAY_VOLUME_CURVE
- D02-12:PRICE_BY_VOLUME_PROFILE

D02-01 is semantic governance, not a predictive Brier lane.
D02-11 remains blocked before primary utility metric/horizon freeze.

## Ownership

D02 freezes:
- evidence key;
- comparator feature-set identity;
- outcome identity;
- primary horizon;
- equal-date Brier metric;
- common-support requirement.

D16-19 exclusively freezes:
- estimator family;
- calibration method;
- preprocessing;
- regularization;
- train/validation/calibration partition policy;
- refit policy;
- seed policy;
- missing-value policy;
- class-imbalance policy;
- registered model-search family and candidate count.

D02 does not choose logistic/tree/neural/isotonic/Platt/Beta or any other implementation.

## Anti-shopping rules

Baseline and challenger use identical support, partitions and method family.
Predictions must be immutable before labels are opened.

Forbidden after outcome access:
- estimator-family switch;
- calibration-method switch;
- regularization switch;
- feature-selection change;
- fold/partition change;
- best-seed selection;
- best-calibration selection;
- unregistered method-family search.

A changed method creates a new methodVersion/experimentVersion and new forward clock.

## Current readiness

This contract does not fabricate actual receipts.

Current latest-main actual D02-specific frozen ModelMethodReceipts:
- 0 / 12.

Thus predictive method readiness is structurally specified but physically BLOCKED until D16-19 freezes exactly one receipt per evidence key.

No outcome access.
No numerical target.
No maturity promotion.
Formal Core unchanged.
