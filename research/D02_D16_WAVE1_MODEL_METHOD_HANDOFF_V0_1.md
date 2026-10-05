# D02 → D16 Wave-1 Model / Calibration Method Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / METHOD_RECEIPT_REQUIRED
Evidence cursor: PVE-239
D02 owner: feature / outcome / comparator / horizon semantics
D16-19 owner: estimator / calibration implementation and immutable method receipt
Formal Core impact: NONE

## Why this handoff is required

Wave-1 primary metric is now:
DATE_BALANCED_BRIER_LOSS_IMPROVEMENT.

A proper scoring rule does not remove model-selection bias by itself.

If estimator family, calibration method, preprocessing, folds or model-search family are chosen after seeing outcomes, the Brier comparison is no longer preregistered.

Therefore every promotion-grade Wave-1 D16 validation receipt must reference one immutable pre-outcome ModelMethodReceipt.

## Covered evidence keys

- D02-02:H001
- D02-03:H20
- D02-06:H003

## D02 freezes

D02 freezes:
- exact evidence key;
- baseline feature-set identity;
- challenger feature-set identity;
- binary outcome identity;
- primary horizon;
- primary metric;
- equal-date weighting;
- mandatory common support.

D02 does NOT choose the statistical model implementation.

## D16-19 must freeze before outcome access

ModelMethodReceipt must include:
- methodReceiptId;
- methodVersion;
- evidenceKey;
- experimentVersion;
- targetId / targetVersion / targetHash when target is later frozen;
- primaryMetric = DATE_BALANCED_BRIER_LOSS_IMPROVEMENT;
- outcomeId;
- outcomeHorizon;
- baselineFeatureSetId;
- challengerFeatureSetId;
- estimatorFamily;
- calibrationMethod;
- preprocessingVersion;
- featureSelectionPolicy;
- regularizationPolicy;
- trainingWindowPolicy;
- validationPartitionPolicy;
- calibrationPartitionPolicy;
- refitPolicy;
- randomSeedPolicy;
- missingValuePolicy;
- classImbalancePolicy;
- modelSearchFamilyId;
- candidateMethodCount;
- multipleTestingFamilyId;
- frozenAt;
- outcomeAccessStateAtFreeze=OUTCOME_CLOSED;
- methodHash;
- status=FROZEN.

## Identical-comparison requirements

Baseline and challenger must:
- use identical eligible rows;
- use identical train / validation / calibration / holdout dates;
- use the same estimator/calibration family unless the experiment explicitly preregisters a model-family comparison;
- differ only by the frozen incremental feature set for the primary nested comparison;
- produce immutable predictions before labels are opened.

If method families differ, that is a different experiment and cannot be interpreted as pure feature incrementality.

## No model shopping

Forbidden after outcome access:
- switching logistic / tree / neural / isotonic / Beta / Platt because one scores better;
- adding/removing regularization after seeing outcomes;
- changing feature standardization;
- changing calibration partitions;
- changing random-seed selection policy;
- changing missing-value handling;
- selecting the best model from an unregistered family.

Any such change:
- creates a new methodVersion / experimentVersion;
- enters the multiple-testing family;
- starts a fresh forward evidence clock for promotion-grade use.

## D16 ownership remains intact

D02 does not prescribe:
- logistic;
- Platt;
- Beta;
- isotonic;
- tree model;
- any specific regularizer.

D16-19 chooses and justifies the method before outcome access and owns model/calibration quality.

## Current state

No Wave-1 D16 ModelMethodReceipt is yet frozen for the new Brier primary metric.

Therefore Wave-1 status becomes:
WAITING_D16_METHOD_FREEZE.

This does not block PIT/admission capture.
It blocks promotion-grade Brier interpretation.

Numerical target values remain pending.
D02 maturity remains 60.0%.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
