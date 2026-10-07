# D16 SDA-022 D5 Model Method Freeze 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / MODEL_METHOD_FROZEN / EFFECT_TARGET_PENDING / OUTCOMES_CLOSED
Owner room: 11｜統計驗證與策略市場狀態研究室
Experiment: D16-SDA022-01
Formal Core impact: NONE

## Purpose

Close the model-method degrees of freedom that remained open in:
`SDA022_D16_S1_SHORT_MOMENTUM_D5_INCREMENTALITY_PREREG_20261006_V0_1`.

The primary scientific question remains unchanged:
Does pre-outcome SHORT_MOMENTUM state add D5 probability information beyond frozen System1 policy state on common-support, common-cutoff prospective evidence?

No D5 outcomes were inspected to choose this method.

## 1. Primary state encoding

### System1 baseline state

Derive exactly one categorical state per symbol/date:

1. `FORMAL_SELECTED`
   - formal.selected === true;
   - formal.qualified must not be false.

2. `FORMAL_QUALIFIED_NOT_SELECTED`
   - formal.qualified === true;
   - formal.selected !== true.

3. `FORMAL_REJECTED`
   - formal.qualified === false.

4. `FORMAL_UNKNOWN`
   - qualification state not safely known.

Invalid contradiction:
formal.selected === true AND formal.qualified === false
=> `STATE_INCONSISTENT` / primary row inadmissible, preserved in coverage.

Do not use in the primary model:
- priorityScore;
- selectedRank;
- channel;
- firstFailure identity;
- individual Formal gate vector;
- raw technical/fundamental factors.

Reason:
the first primary experiment tests incremental information over the coarse frozen System1 policy state, not over a post-hoc optimized reconstruction of the entire Formal score.

### SHORT_MOMENTUM challenger state

Use actual System2 Stage-1 execution state, not System1 C2 proxy gate status.

If requiredInputsState != READY:
`SM_INPUT_INCOMPLETE`.

If requiredInputsState == READY and strategy execution is valid:
- `SM_BUY_ELIGIBLE`;
- `SM_ACTIVE_ENTRY_MONITOR`;
- `SM_WATCH`.

Runtime failure, hidden dependency or unresolved execution lineage:
row is not converted to WATCH;
it remains explicit failure/UNKNOWN in coverage and is not silently treated as a valid policy state.

Do not use in the primary model:
- numeric rank;
- Pareto position;
- individual TECHNICAL_STRUCTURE/PRICE_VOLUME/RISK_FRICTION substate;
- Regime;
- confluence;
- capacity result;
- downstream monitor state.

Reason:
these are later policy layers or additional degrees of freedom.

## 2. Baseline and augmented models

Primary baseline:
`P(Y=1) = f(System1PolicyState)`.

Primary augmented:
`P(Y=1) = f(System1PolicyState + ShortMomentumPolicyState)`.

Encoding:
- one-hot categorical main effects;
- one reference category per variable;
- intercept included;
- no interaction terms in the primary family.

Primary comparison therefore asks whether the additional SHORT_MOMENTUM policy-state main effect improves probabilistic prediction.

No interaction search is allowed after outcome opening.

Any future System1×SHORT_MOMENTUM interaction model is a new experiment/version under SDA-016.

## 3. Estimator

Primary estimator:
ridge-regularized logistic regression.

Objective:
mean binary log loss + L2 coefficient penalty.

Primary penalty:
`lambda = 1.0`.

Pre-outcome non-rescuing sensitivity:
- `lambda = 0.1`;
- `lambda = 10.0`.

Rules:
- intercept not penalized where implementation permits;
- categorical dummy columns are not outcome-standardized;
- no outcome-selected lambda;
- sensitivity result cannot replace the primary lambda=1 result.

Reason:
the state space is deliberately small. A fixed ridge penalty prevents complete/quasi separation from turning small cells into extreme probabilities while avoiding an inner hyperparameter search in the first experiment.

The numerical penalty is a stabilization convention, not an MDE or economic threshold.

## 4. Calibration

Primary calibrator:
`IDENTITY_NO_POSTHOC_RECALIBRATION`.

The logistic probability is evaluated as produced.

D16-19 may diagnose:
- Brier score;
- log loss;
- reliability;
- calibration-in-the-large;
- slope/intercept where sample supports it.

But the primary D16-SDA022-01 experiment does not choose Platt/Beta/Isotonic after seeing outer outcomes.

A future recalibrated challenger is a new model version/family.

## 5. Prospective chronological refit

For decision date T:
training may use only rows whose D5 target matured before T and whose lineage is admissible.

Forbidden:
- random row split;
- future decision dates in training;
- labels that mature after T;
- current T labels;
- outer-date reuse after design change.

Initial dates without sufficient valid training support emit:
`MODEL_NOT_TRAINABLE_YET`
and remain in coverage accounting.

They are not backfilled later as if a forecast had existed.

## 6. Primary loss

Primary per-row loss:
Brier squared probability error.

Primary per-date loss:
mean Brier over identical baseline/augmented common-support rows for that date.

Primary date delta:
`Brier_augmented - Brier_baseline`.

Primary aggregate:
equal-weight mean across eligible decision dates.

Favorable direction:
negative.

Row-weighted aggregate remains descriptive only.

## 7. Dependence-aware uncertainty

Inference unit:
decision date, not stock row.

Primary uncertainty design:
moving-block resampling of the date-level loss-delta series with a five-official-session block as the minimum D5-overlap-preserving block.

Non-rescuing sensitivity:
- 10-session block;
- 20-session block;
- leave-one-replication-cluster-out when multiple clusters exist.

If direction is highly sensitive to block/cluster treatment:
`DEPENDENCE_FRAGILE`.

The five-session block does not claim all market dependence ends after five sessions.
It is the minimum design required to preserve direct D5 horizon overlap.

No IID row bootstrap is allowed.

## 8. Forecast-comparison interpretation

Giacomini-White-style predictive-ability logic is methodologically relevant because forecast methods may be nested and re-estimated through time.

However this experiment does not turn a single asymptotic p-value into the promotion criterion.

Primary reporting remains:
- date-balanced Brier delta;
- dependence-aware interval/sensitivity;
- coverage;
- class support;
- replication concentration;
- frozen effect target once separately established.

Clark-West MSPE adjustment is not the primary method because the preregistered loss is Brier, not squared continuous forecast error.

## 9. Coverage / missingness

Every decision date must report:
- target population N;
- common-support N;
- baseline forecastable N;
- augmented forecastable N;
- matured-label N;
- clock-incompatible N;
- System1 unknown N;
- System2 input-incomplete N;
- runtime/lineage-invalid N.

Primary score uses identical rows for both arms.

No augmented-only complete-case advantage.

If admission/label completion is state-dependent:
apply the existing SDA-016 admission-sensitivity contract.
Do not silently generalize the observed-subpopulation result to the target population.

## 10. Forbidden primary expansions

Without a new experiment/version, do not add:
- priorityScore;
- System2 rank;
- gate-by-gate features;
- sector;
- Regime;
- interaction terms;
- nonlinear splines;
- additional horizons;
- alternative target definition;
- post-hoc calibration;
- selected-only cohort.

## 11. Model-state identity

Each generated forecast must bind:
- experimentId;
- modelMethodReceiptId;
- modelMethodVersion;
- System1 fingerprint hash;
- System2 SHORT_MOMENTUM fingerprint hash;
- NC-T01 receipt reference;
- source generation refs;
- decisionAt;
- trainingThrough;
- targetId;
- regularization lambda;
- encoding version;
- baseline/augmented arm;
- prediction.

If a policy fingerprint changes:
do not pool silently.
Either version-forward the experiment or preserve separate analysis strata.

## 12. Still-open gate: effect target

This file freezes the method but does NOT invent a numerical MDE.

Remaining pre-outcome blocker:
`MDE_OR_PRECISION_TARGET_FROZEN`.

Reason:
a numerical "important enough" Brier improvement must be justified by decision/economic or precision logic, not chosen arbitrarily merely to finish the checklist.

Outer stream remains exploratory unless separately upgraded.

## 13. Methodology anchors

- Brier score is a strictly proper probability scoring rule.
- Giacomini & White forecast-comparison framework allows general forecast methods and nested/non-nested comparisons under its assumptions.
- Nested forecast comparisons can have nonstandard finite-sample behavior; this is another reason not to use naive IID row-level tests.
- Chronological, dependence-aware prospective evidence remains primary.

These are methodology anchors only, not Taiwan Alpha evidence.

## 14. Maturity decision

No D16 maturity change.

This closes one pre-outcome method-selection degree of freedom.
It creates no D5 result and no economic superiority claim.

## Exact next continuation

1. Bind this method receipt to D16-SDA022-01.
2. Freeze a justified MDE or precision target before outcome opening.
3. Wait for canonical System2 fingerprints and physical NC-T01.
4. Build prospective pair receipts only after common cutoff is proven.
5. Keep outcomes CLOSED until all preregistered gates pass.
