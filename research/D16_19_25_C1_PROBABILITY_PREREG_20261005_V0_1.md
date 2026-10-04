# D16-19 / D16-25 C1 Prospective Probability Preregistration V0.1

Updated: 2026-10-05 Asia/Taipei  
Status: PREREGISTERED_BEFORE_FIRST_GENUINE_C1_OUTCOME / RESEARCH_ONLY  
Owner room: 11｜統計驗證與策略市場狀態研究室  
Formal Core impact: NONE  
Production/runtime impact: NONE  
Maturity impact: NONE

## 1. Purpose

Freeze the first minimal genuine Taiwan PIT probability experiment before the first post-V8.17 genuine C1 generation and before any D+5 outcome can be inspected.

This experiment is intentionally narrow. It asks only:

> Does the frozen runtime `priorityScore` contain prospective probability information about a clean D+5 positive price-return event beyond a constant historical base-rate forecast?

It does not test whether the Formal ranking is economically optimal, whether a trade should be entered, whether Kelly sizing is ready, or whether regime switching adds value.

## 2. Canonical parent population

Parent evidence must be a genuine prospective immutable C1 generation created by the deployed V8.17 lineage or later semantically equivalent approved lineage.

Required parent identity:
- C1 generation id;
- scan/session date;
- decision timestamp;
- C1 content digest and universe digest;
- source main SHA;
- effective runtime version;
- selection-rule version;
- complete parent population count.

Historical reconstruction is not prospective evidence.

### Prediction-eligible population

The first prediction population is **not** the selected Top6 and not a bounded Shadow sample.

A row is prediction-eligible only when:
- it belongs to the complete immutable C1 parent population;
- `formalResult.ok === true`;
- `actualRankingTuple` exists;
- `actualRankingTuple.priorityScore` is finite;
- required decision-time identity / provenance is intact.

This includes both selected and qualified-not-selected rows before the independent 3+3 selection cap.

Rows in the C1 parent that are not prediction-eligible remain in the operational population denominator as `DATA_BLOCKED` / no-prediction rows. They may not silently disappear.

## 3. Frozen target

Target id:

`D16_C1_D5_REFERENCE_CLOSE_POSITIVE_V0_1`

Binary target:
- `Y=1` when the exact fifth subsequent official Taiwan trading-session close is strictly above the decision-session reference close;
- `Y=0` when it is equal to or below the reference close;
- `Y=UNKNOWN` when the exact D+5 session cannot be proven, symbol/session continuity is not proven, the price path is unavailable, or a corporate-action / continuity condition makes the raw close-to-close comparison semantically unsafe.

The D+5 horizon is defined in official trading sessions, never calendar days.

The primary target is deliberately **price-return direction**, not after-cost trading profitability. This separation prevents execution/cost assumptions from contaminating probability calibration.

After-cost realized utility remains a separate D16-25 decision-quality estimand and cannot be substituted for this binary probability label.

No MFE/MAE, target-first, stop-first, intraday execution, or later D10/D20 outcome enters V0.1.

## 4. Frozen predictor family

### 4.1 Base-rate baseline

Baseline id:

`C1_D5_BASE_RATE_BETA11_V0_1`

At each prediction decision:
- use only prior observations whose D+5 labels are already mature and known before the current decision timestamp;
- start from Beta(1,1);
- update successes/failures only from the same frozen target and prediction-eligible population;
- point forecast = posterior mean.

Before any mature prior observation exists, the prospective baseline is therefore 0.5.

The Beta-Binomial posterior is used only to define a transparent constant probability baseline. It is not interpreted as proving stock rows are independent Bernoulli trials.

The following are always reported separately:
- matured row count;
- independent matured scan-date count;
- positive / non-positive label counts;
- unknown / immature label counts;
- date-balanced positive-rate sensitivity.

### 4.2 One-dimensional simple-score challenger

Challenger id:

`C1_D5_PRIORITY_LOGISTIC_MONOTONE_V0_1`

The **only** predictor in the first challenger is:

`actualRankingTuple.priorityScore`

Forbidden in V0.1:
- rewardPerRisk;
- marketConsensusScore;
- setupQuality;
- sectorFlow;
- relativeStrength;
- Regime inputs;
- selected / not-selected state;
- future outcome-derived features;
- feature/window search.

Fit contract:
- standardize `priorityScore` using training-only mean and standard deviation;
- fit a one-dimensional logistic mapping;
- intercept is free;
- slope is constrained to be non-negative;
- if the unconstrained relationship is negative or the constrained optimum collapses to slope 0, that is evidence against the score challenger, not permission to reverse the score direction after outcomes;
- no hyperparameter search;
- no isotonic, Beta calibration, tree model, ensemble, or multi-feature model in V0.1.

Reason for the monotone non-negative constraint:
`priorityScore` is the first field in the frozen Formal comparator. The first prospective experiment tests whether that intended ordering contains positive probability information. Allowing an outcome-selected sign reversal would answer a different question.

## 5. Fit readiness and cold-start states

No universal stock-row count is treated as sufficient.

State machine:

### `BASE_RATE_ONLY_COLD_START`
- fewer than 20 independent matured scan dates;
- base-rate forecast may be emitted prospectively;
- score challenger is not fit;
- no calibration promotion claim.

### `SCORE_EXPLORATORY_READY`
- at least 20 independent matured scan dates;
- both binary outcome classes are present;
- priority-score variance is non-zero;
- no unresolved provenance / continuity blocker;
- score challenger may be fit and prospectively emitted;
- evidence remains exploratory.

### `PRIMARY_VALIDATION_ELIGIBLE`
Requires all of:
- at least 40 effective independent decision dates under the frozen D16 dependence-aware inference contract;
- adequate event / non-event support;
- multiple market episodes rather than one contiguous episode;
- prediction and label coverage reported;
- no single date / episode domination;
- genuine untouched chronological OOS predictions.

The 20/40 date thresholds are conservative governance floors, not universal mathematical cutoffs.

## 6. Predict-then-update timing

For every session T:

1. Freeze the current genuine C1 parent.
2. Determine prediction eligibility using only T-known information.
3. Build the base-rate state using only labels matured before T decision time.
4. If the score challenger is support-eligible, fit it using only labels matured before T decision time.
5. Freeze immutable prediction receipts for T.
6. Do not alter those receipts when later labels arrive.
7. Later append the D+5 outcome join.
8. Only subsequent sessions may consume newly matured outcomes.

This is strict predict-then-update. A D+5 result can never repair, refit, or relabel its own prediction.

## 7. Immutable PredictionReceipt contract

Every prediction-capable row must freeze at least:

- `predictionReceiptVersion`;
- `predictionId`;
- `parentC1GenerationId`;
- `parentContentDigest`;
- `parentUniverseDigest`;
- `scanDate`;
- `decisionAt`;
- `symbol`;
- `pricePool`;
- `formalStateAtDecision`;
- `targetId`;
- `horizon`;
- `referenceBasis`;
- `scoreField = actualRankingTuple.priorityScore`;
- raw priority score;
- score provenance;
- `modelVersion`;
- `calibrationVersion`;
- `trainingMaturedThrough`;
- training matured row count;
- training independent-date count;
- positive / non-positive counts;
- training score mean / standard deviation;
- fitted intercept / slope when available;
- frozen base-rate probability;
- frozen challenger probability when available;
- state: `BASE_RATE_ONLY_COLD_START`, `SCORE_EXPLORATORY_READY`, `PRIMARY_VALIDATION_ELIGIBLE`, or `DATA_BLOCKED`;
- source main SHA;
- semantic fingerprint / receipt hash.

No outcome, later regime label, later corporate-action knowledge, or later model choice may enter this receipt.

## 8. Operational denominator firewall

For each genuine C1 generation report separately:

- `N_population`: complete C1 parent rows;
- `N_prediction_eligible`;
- `N_prediction_frozen`;
- `N_data_blocked`;
- `N_matured`;
- `N_immature`;
- `N_label_unknown`;
- `N_cost_known`.

Primary operational prediction coverage:

`N_prediction_frozen / N_population`

Matured-label coverage:

`N_matured / N_prediction_frozen`

These denominators may not be substituted for each other.

Label arrival must never change a frozen prediction, model identity, or decision-time state.

## 9. Evaluation contract

The first valid comparison is always:

`BASE_RATE` vs `PRIORITY_SCORE_CHALLENGER`

Primary OOS comparison:
- within each independent scan date, compute mean Brier loss for each frozen arm;
- form the same-date loss difference;
- aggregate scan-date differences with equal date weight;
- do the same for log loss.

Row-weighted Brier / log loss remain descriptive.

Also report:
- calibration-in-the-large;
- frozen 0.1 reliability bins as secondary diagnostics;
- probability-support distribution;
- outcome prevalence;
- date-balanced diagnostics;
- per-Regime diagnostics only as descriptive stratification;
- leave-one-date / leave-one-episode sensitivity when support permits;
- D16-06 dependence-aware uncertainty once support is sufficient.

A lower Brier score alone is not called better calibration because Brier mixes reliability, resolution and uncertainty.

## 10. Falsification

The simple-score hypothesis is weakened or falsified when any of the following holds:

1. the challenger does not beat the frozen base-rate arm in untouched chronological OOS proper scores;
2. the constrained slope repeatedly collapses to zero;
3. the apparent gain is row-weighted but disappears under equal-date comparison;
4. one date or one market episode dominates the gain;
5. performance gain appears only after changing horizon, target, score field or fit window;
6. outcome arrival changes prior immutable predictions;
7. missing / UNKNOWN labels are silently deleted and coverage improves mechanically;
8. the challenger wins Brier only through resolution while reliability worsens materially;
9. a distribution shift produces unsupported probability ranges and the model continues forecasting instead of entering a WATCH / OUT_OF_SUPPORT state;
10. the result requires selected-only rows rather than the complete qualified prediction population.

Negative evidence is retained. V0.1 is not replaced after seeing outcomes.

## 11. Calibration-family firewall

The first V0.1 challenger intentionally excludes post-hoc method search.

Current external evidence supports that:
- Brier / log loss are proper scoring rules but are not pure calibration measures;
- isotonic methods can overfit smaller calibration sets;
- modern evidence shows Platt and isotonic recalibration can worsen log loss in many tabular settings;
- calibration under temporal distribution shift requires predict-then-update discipline rather than future-aware refitting;
- validation sample adequacy depends on event prevalence, probability distribution and target precision rather than a universal row-count rule.

Therefore later sigmoid / Beta / isotonic / online-calibration variants, if studied, must receive new experiment/version identities and stay inside the same multiple-testing family.

## 12. Ownership

D16-19:
- owns the score-to-probability model/calibrator;
- owns probability-quality diagnostics and drift state;
- produces the immutable calibration/prediction receipt.

D16-25:
- consumes one canonical calibrated probability;
- owns uncertainty, expected utility, ACCEPT / ABSTAIN / DATA_BLOCKED and decision-quality analysis;
- may not fit a second calibrator.

D15 sizing is not authorized by this experiment.

## 13. Promotion / system impact

`FORMAL_OPTIMIZATION_CANDIDATE: NONE`

No selection, ranking, 3+3 quota, signal, capital, monitoring, push, execution, System 1 Formal Core, or System 2 policy changes.

D16-19 remains L2/40.
D16-25 remains L2/40.
D16 domain maturity remains unchanged.

The preregistration is valuable precisely because it is frozen before the first genuine prospective C1 outcome sequence exists; preregistration itself is not L3 evidence.

## 14. Exact next continuation point

1. Wait for the first genuine post-V8.17 trading-session C1 generation; do not synthesize one.
2. Verify immutable C1 parent readback and complete qualified `actualRankingTuple.priorityScore` coverage.
3. Produce the first prospective base-rate PredictionReceipt before any D+5 outcome.
4. Continue accumulating immutable daily prediction receipts.
5. Do not fit the score challenger until the frozen support state reaches `SCORE_EXPLORATORY_READY`.
6. When D+5 labels mature, append outcomes only; verify label-arrival invariance and the dual-denominator coverage contract.
7. No L3 claim until executable genuine Taiwan PIT prediction -> matured-outcome replay and the stated support gates are satisfied.
