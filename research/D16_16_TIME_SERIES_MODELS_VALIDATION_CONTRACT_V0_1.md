# D16-16 Time-series Models Validation Contract V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_ONLY_DRAFT
Owner: Room 11 / D16
Formal Core impact: NONE

## Purpose

Define the validation contract for D16-16 Time-series Models before any Taiwan-stock predictive outcome study. Statistical/model sophistication is not Alpha evidence.

## Core estimand firewall

Every experiment must freeze before outcome review:
- strategyId / targetId / horizon / decisionStage;
- prediction timestamp and information cutoff;
- training window rule: expanding or rolling;
- refit cadence;
- feature-generation version;
- costModelVersion and outcomeRuleVersion;
- forecast target and evaluation metric.

Changing any item creates a new experiment family.

## PIT and temporal ordering

For forecast origin t:
- training rows and all fitted transforms must use only information available by t;
- target y(t+h) is outcome-only;
- feature scaling, imputation, hyperparameter tuning, break detection and feature selection must be fit inside the training side of each origin/fold;
- revised/vintage data require first-known/vintage semantics, not current-page backfill.

A random split is not the default validation design for nonstationary market forecasting.

## Rolling-origin primary design

Primary validation uses chronological rolling forecast origin:
1. choose minimum training history;
2. fit only on data available through origin t;
3. predict fixed horizon h;
4. advance origin;
5. refit according to the preregistered cadence;
6. preserve every prediction receipt before outcome maturity.

Expanding-window and rolling-window models are separate challengers, not interchangeable implementations.

## Gap / purge semantics

A generic row-count gap is insufficient when:
- labels overlap across h-day horizons;
- observations are irregular by trading day;
- one date contributes many cross-sectional symbols;
- feature construction uses lookbacks whose state can cross the fold boundary.

Purge/embargo must be expressed in event/trading-time semantics tied to label overlap and information availability.

## Dependence and sample-size firewall

Stock rows on one scan date are not independent dates.
Required reporting:
- row-weighted error;
- date-balanced error;
- independent forecast-origin count;
- Regime-episode count;
- overlapping-horizon structure;
- per-Regime N and coverage.

Do not convert a large same-date cross-section into false replication.

## Nonstationarity and Regime interaction

Model quality may vary because:
- coefficients drift;
- volatility changes;
- market breadth/leadership changes;
- source/coverage changes;
- transaction costs/liquidity change.

Regime labels used for conditioning must themselves be PIT-observable at origin t.

Post-hoc breakpoints or hindsight Regime labels may be used only for diagnostics, never as if they were live routing information.

## Hyperparameter and model-selection firewall

Nested chronology is required when hyperparameters or model classes are selected:
- inner chronological training/validation chooses hyperparameters;
- outer chronological OOS evaluates the frozen choice;
- final Prospective Shadow starts only after model and preprocessing versions are frozen.

Repeatedly trying window lengths, lags, transforms or model families against the same outer OOS period consumes the holdout and becomes data snooping.

All attempted experiment families must remain in the registry.

## Baselines and incremental value

Every complex time-series model must beat simple preregistered baselines on identical parents and dates:
- persistence / no-change where meaningful;
- historical/base-rate baseline;
- simple moving or autoregressive baseline where target semantics permit;
- existing System 1 / System 2 score or rule baseline when the research claim is incremental system value.

A lower in-sample residual is not evidence of OOS value.

## Metrics

Metric identity follows target identity.
Possible forecast metrics include absolute/squared error or proper probabilistic scores.
Directional hit rate alone is insufficient.
For trading relevance, any later decision-value study must separately include:
- coverage;
- zero-pick / abstention;
- turnover;
- costs/slippage;
- capacity/liquidity;
- after-cost utility.

Forecast accuracy and trading utility are separate estimands.

## Counterevidence / falsification matrix

The hypothesis "time-series modeling adds robust incremental value" is weakened or rejected if:
1. gains disappear under rolling-origin OOS;
2. gains depend on one window/lag choice;
3. gains disappear after date balancing;
4. gains are confined to one Regime or one short calendar episode;
5. simple baselines match the model;
6. costs/slippage erase decision utility;
7. feature/revision timestamps cannot be reconstructed PIT-safely;
8. performance depends on post-hoc break/Regime labels;
9. refit/recalibration frequency chosen after seeing OOS outcomes drives the result;
10. Prospective Shadow diverges materially from replay/OOS.

## Structural-break handling

Break detection has two distinct roles:
- retrospective diagnostic: may explain why a historical model failed;
- prospective routing/adaptation: may affect decisions only if the break detector itself is computable at t with a frozen rule.

A breakpoint estimated using future observations cannot be moved backward and treated as a live-known state.

## Walk-forward contract

Each outer fold freezes:
- trainingThroughDate;
- modelVersion;
- featureVersion;
- preprocessingVersion;
- hyperparameterVersion;
- RegimeDefinitionVersion;
- costModelVersion;
- label/outcome version.

Model re-selection after each outer outcome is observed is prohibited unless the adaptation rule itself was preregistered and is part of the tested strategy.

## Prospective Shadow gate

Historical replay cannot manufacture Prospective Shadow.
Shadow begins only after:
- model + preprocessing + target + horizon + cost semantics are frozen;
- prediction receipts are immutable before outcomes;
- source generation is complete;
- missing evidence remains UNKNOWN;
- label maturity is causally joined later.

## D18 handoff

D18 may consume D16-16 model performance by PIT-observable Regime for attribution/robustness.
D18 must not:
- choose the best Regime threshold after seeing model outcomes;
- turn context into a universal hard gate;
- count capacity scarcity/source failure as market Regime;
- reuse the same outcome evidence as an independent Alpha vote.

## External methodology support

- Rolling forecast-origin validation preserves temporal order and uses only earlier observations to forecast later ones.
- Standard K-fold can be valid in restricted autoregressive settings with appropriate error conditions; that exception is not a blanket authorization for financial nonstationary data.
- Time-series split implementations expose chronological folds and optional gaps, but implementation convenience does not replace project-specific label-overlap/PIT semantics.
- Structural breaks in financial series can materially affect inference; prospective use requires a detector available at decision time.

## Current maturity recommendation

Proposed D16-16 maturity: L2 / 40% only.

Supports L2:
- mechanism;
- temporal validation design;
- positive mechanism;
- explicit falsification;
- PIT/leakage firewall;
- nested model-selection guard;
- dependence/date-clustering guard;
- Regime interaction;
- cost/baseline requirements;
- Prospective Shadow gate.

Does NOT support L3:
- no Taiwan PIT executable parent/replay receipt;
- no tested model pipeline on immutable Taiwan parents;
- no genuine OOS/Prospective Shadow evidence.

Formal optimization candidate: NONE.

## Exact next continuation

1. Freeze one bounded Taiwan target/horizon for D16-16 without opening outcomes.
2. Select one simple baseline and one simple time-series challenger.
3. Build research-only chronological split receipt with trading-date and label-overlap purge semantics.
4. Add adversarial tests for future leakage in scaling/imputation/hyperparameter selection.
5. Produce immutable prediction receipts before outcome maturity.
6. Evaluate row-weighted and date-balanced OOS metrics plus Regime occupancy.
7. Only after executable PIT replay feasibility may L3 be considered; only after genuine OOS/Prospective Shadow may L4 be considered.


## Bounded first executable study — outcome-blind freeze

The first executable D16-16 study is intentionally narrow and reuses an already-frozen research outcome rather than inventing a new target after seeing results.

### Target and horizon
- parent population: only promotion-grade clean parent decision receipts satisfying repository PIT, source-generation, symbol-session and technical-continuity contracts;
- target: raw non-overlapping D5 forward close-to-close return already defined by the D03 momentum-continuation contract;
- horizon: exact future symbol sessions, never next-available-row;
- outcome maturity: D5 remains unavailable to fitting until future sessions mature;
- corporate-action/suspension ambiguity => UNKNOWN/BLOCKED, never zero.

D10/D20 remain later experiment-family members and cannot be opened because D5 performs poorly.

### Baseline and challenger
Primary baseline: expanding-window historical mean D5 return using only mature training parents.
Primary challenger: AR(1) on the parent-level date-balanced D5-return series, fit on identical training parents.
No lag, window, Regime threshold, transformation or horizon search is permitted in epoch one.

### Independence firewall
Primary series uses one date-balanced parent observation per eligible decision date, not stock rows. Stock-row diagnostics remain secondary. Panel/cross-sectional modeling belongs to D16-17.

### Regime role
D18 Regime fields are captured at the parent decision clock but are attribution-only in epoch one. Report OOS error, coverage, UNKNOWN occupancy and episode counts by PIT-observable Regime; do not choose a model per Regime. A Regime-conditioned model requires a new preregistered epoch.

### Chronological split receipt
Each forecast receipt stores experimentId, forecastOriginDate, decisionTimestamp, trainStartDate, trainThroughDate, eligibleTrainingDateCount, purgedTrainingDateCount/reason, targetId/horizon, model/baseline/feature/preprocessing versions, parentGenerationId/hash, prediction, predictionWrittenAt, outcomeEligibleAfter, origin-time Regime snapshot/version, source/continuity status and UNKNOWN/BLOCKED reason. Prediction receipt immutability is required before D5 maturity.

### Purge rule
A training parent is ineligible when its D5 outcome interval is not fully mature before the forecast-origin decision timestamp. Purging follows exact symbol/session outcome intervals, not an arbitrary five-row gap. Incomplete parent-date coverage is reported and may fail the parent under the frozen completeness rule.

### Adversarial leakage tests
The research harness must fail when: (1) scaler/imputer sees an outer-test date; (2) model parameters use a parent whose D5 label matures after origin; (3) prediction is written after D5 is already available; (4) hindsight Regime replaces origin-time Regime; (5) missing/BLOCKED outcome becomes zero; (6) same-date stock rows inflate independent-origin count; (7) D10/D20 or alternative lags are opened after D5 inspection and reported as original-family evidence.

### Falsification and alternatives
Support mechanism: stable short-memory dependence could let frozen AR(1) improve OOS error versus expanding mean.
Counterevidence: no chronological OOS gain; sign reversal across independent Regime episodes; gain vanishes after date balancing; one calendar episode dominates; plausible cost/decision mapping removes value; Prospective Shadow diverges from replay.
Alternative explanations include volatility clustering, changing cross-sectional composition, source/coverage drift, corporate-action/suspension censoring and one crisis/trend episode domination.

If AR(1) fails, D16-16 does not automatically escalate complexity. The conclusion is no incremental evidence for this challenger; a model zoo requires a new registered question.

### Promotion boundary
This freeze adds specificity, not executable Taiwan PIT evidence. Proposed L2 remains unchanged. L3 requires implemented/replay-tested PIT receipts; L4 requires genuine untouched OOS or Prospective Shadow. Formal Core remains locked.

## Updated exact continuation
1. Implement research-only split/prediction receipt validator for frozen D5 date-level target, expanding-mean baseline and AR(1) challenger.
2. Add seven adversarial leakage fixtures before opening real outcomes.
3. Re-read latest main and shared D03 outcome/session contracts before wiring parents.
4. Generate immutable predictions only on future eligible parent generations; historical data may test mechanics but cannot become Prospective Shadow.
5. When D5 matures, compare date-balanced OOS error and coverage first; Regime remains attribution-only until a separately registered conditional-model epoch.
