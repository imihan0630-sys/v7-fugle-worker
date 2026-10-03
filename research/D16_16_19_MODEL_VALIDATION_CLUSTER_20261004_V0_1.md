# D16-16 ~ D16-19 Statistical Model Validation Cluster 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / L2_MECHANISM_FALSIFICATION_DEFINED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Production/runtime impact: NONE

## Purpose

Close the mechanism + falsification layer for four previously L0 modules without inventing Taiwan PIT evidence:
- D16-16 Time-series Models
- D16-17 Panel / Cross-sectional Models
- D16-18 Regularization / Feature Selection
- D16-19 Machine Learning / Calibration

This package does not claim L3. It freezes what must later be executed on Taiwan PIT data.

## Common validation firewall

1. Model complexity is not Alpha.
2. Every transform, scaler, imputer, feature selector, calibrator and hyperparameter search is fitted inside the training boundary.
3. Chronological outer OOS remains untouched; inner tuning cannot reuse the outer outcome.
4. Overlapping D+N labels require purge / overlap control.
5. Same-date stock rows are not independent market replications.
6. Failed model/calibration/feature variants remain in the experiment family.
7. UNKNOWN is not 0, BAD or loss.
8. Ranking quality, probability calibration and trading utility are separate estimands.
9. PIT/replay lineage and version identity are mandatory.
10. No research result changes Formal selection, ranking, capital, monitoring or push.

---

## D16-16 Time-series Models

### Mechanism

Research owner for temporal models used to estimate or validate conditional dynamics:
- naive / random-walk / rolling baselines;
- AR / ARIMA-style conditional mean models;
- volatility models such as ARCH/GARCH;
- state-space / Kalman-style latent-state models;
- VAR / multivariate lag models where justified;
- Markov-switching / HMM challengers.

First comparison is always against a simple PIT-safe baseline. A more complex model must demonstrate incremental OOS forecasting information; fit quality is not sufficient.

### PIT / replay contract

For decision time T:
- all lags, rolling windows and transformations use data available no later than T;
- model fit / refit data stop at the matured training cutoff;
- full-sample normalization, decomposition, PCA, regime smoothing or future transition knowledge is forbidden;
- HMM / Markov decisions may use filtered/current state only; smoothed state is ex-post diagnostic;
- multi-horizon models keep D1/D5/D20 labels distinct;
- refit cadence is a research parameter and part of the experiment family.

### Falsification

A time-series model is not supported when:
- it only beats baseline in-sample;
- effect disappears after structural breaks / regime splits;
- parameter estimates or forecast sign flip under small window changes;
- performance is one-episode dominated;
- gains disappear after costs or execution timing;
- smoothed latent states are required to make the result work;
- forecast accuracy improves but trading decision value does not;
- one model family is selected after searching many alternatives without family accounting.

Diebold-Mariano-style predictive accuracy comparison is a possible diagnostic for competing frozen forecasts, not a replacement for chronological OOS or economic-value validation.

### L3 blocker

No L3 until an executable Taiwan PIT time-series builder / replay demonstrates source/version/availableAt lineage, training-only transforms, fail-closed gaps and frozen baseline/challenger forecasts.

---

## D16-17 Panel / Cross-sectional Models

### Mechanism

Separate two objects:
1. cross-sectional estimation on one PIT date;
2. panel estimation across issuer × date observations.

Candidate families include:
- cross-sectional OLS / rank models;
- Fama-MacBeth-style repeated cross-sectional slopes;
- pooled panel regressions;
- issuer fixed effects;
- date fixed effects;
- two-way / clustered uncertainty where supported.

The model estimates conditional associations unless a separate causal design exists. Statistical significance is not causal attribution.

### Dependence and identity contract

- Same-date stocks share market, liquidity, source-health and regime shocks.
- Same issuer across dates creates serial dependence.
- Universe membership, delisting, corporate action, issuer identity and sector membership must be PIT-safe.
- Cross-sectional z-score / rank / winsorization uses only the same frozen decision-date universe.
- Current constituents may not be backfilled into historical panels.
- Row N, independent date N and issuer N are all reported.
- Cluster-robust inference with few effective date/episode clusters is treated as fragile, not magically corrected.

Petersen (2009) is a core warning: residual dependence across firms and time can invalidate ordinary OLS standard errors.

### Falsification

Panel / cross-sectional evidence fails or weakens when:
- coefficient sign is unstable across dates / sectors / regimes;
- result vanishes with date effects or date-cluster handling;
- one issuer / sector / market episode dominates;
- factor effect is a liquidity / size / price / information-quality proxy;
- fixed-effects specification removes the relevant estimand or random-effects assumptions are implausible;
- cross-sectional standardization used future / revised membership;
- apparent significance comes mainly from stock-row multiplicity.

### L3 blocker

No L3 until a Taiwan PIT panel builder proves membership, issuer/date keys, source availability, corporate-action continuity and deterministic replay on actual Taiwan observations.

---

## D16-18 Regularization / Feature Selection

### Mechanism

Regularization is a variance / complexity-control tool, not an Alpha generator.

Frozen baseline family:
- unregularized/simple sparse baseline where feasible;
- Ridge: shrink correlated coefficients without automatic sparsity;
- Lasso: shrink + variable selection;
- Elastic Net: combined L1/L2, useful when correlated feature groups exist;
- group/family-aware selection only when evidence-family ownership is preregistered.

### Training-boundary contract

Inside every outer fold:
- imputation;
- standardization;
- winsorization;
- feature screening;
- feature selection;
- PCA / dimensionality reduction;
- regularization strength;
- hyperparameter selection.

All must be refit from training data only.

Feature families derived from the same primitive source are not independent evidence. Momentum transforms, moving-average transforms or duplicate breadth transforms cannot gain multiple votes merely because regularization retains them.

### Falsification

- Lasso selection instability under correlated predictors is not interpreted as scientific feature importance.
- Ridge nonzero coefficients are not independent Alpha evidence.
- Elastic Net grouping behaviour is useful but not proof that the selected group is causal.
- Feature importance from tree/boosting models is diagnostic, not a selection truth.
- Feature-selection frequency / stability is secondary unless OOS incremental value survives.
- A feature chosen after many windows/transforms joins the same multiple-testing family.
- If a simpler source-family basis matches OOS performance, the larger feature set is redundant.

Tibshirani (1996) motivates Lasso shrinkage/selection; Zou & Hastie (2005) motivate Elastic Net when correlated predictors challenge pure Lasso. Cawley & Talbot (2010) supplies the key meta-falsification: the model-selection criterion itself can be overfit.

### L3 blocker

No L3 until an executable Taiwan PIT nested-selection pipeline proves fold-local preprocessing/selection, replayable feature provenance and common-support OOS comparison.

---

## D16-19 Machine Learning / Calibration

### Ownership

D16-19 owns:
- model estimation / validation;
- model-family comparison;
- calibration method implementation;
- Brier / log loss / reliability / calibration slope-intercept diagnostics;
- model / calibration drift;
- simple-baseline comparison.

D16-25 owns:
- calibrated-belief consumption;
- uncertainty response;
- expected utility;
- ACCEPT / ABSTAIN / DATA_BLOCKED;
- decision drift.

Terminal H09 research classification:
SCOPE_DEDUP_ONLY.

No second probability authority is allowed in D16-25.

### Calibration method family

Always preserve IDENTITY / no-recalibration baseline.
Candidate methods may include Platt / sigmoid, Beta calibration and Isotonic, but no method is assumed superior.

Kull et al. (2017):
- Isotonic may overfit smaller calibration samples;
- logistic/Platt-style calibration can worsen skewed-score cases;
- identity must remain a legitimate comparator.

Manokhin & Grønhaug (2026) provide modern counterevidence:
post-hoc Platt and Isotonic do not consistently improve log loss across modern tabular classifiers, while AUC may barely change. Therefore discrimination cannot validate probability quality.

### ML validation firewall

Model-family selection, preprocessing, feature selection, hyperparameters and calibrator selection are all part of fitting. Cawley & Talbot (2010) show that a finite-sample model-selection criterion itself can be overfit and can bias reported generalization.

Required hierarchy:
TRAIN
-> INNER MODEL / HYPERPARAMETER SELECTION
-> CALIBRATION FIT / METHOD SELECTION
-> FREEZE
-> CHRONOLOGICAL OUTER OOS

Any reuse of outer OOS to choose model, calibrator, threshold or refit cadence invalidates that outer evidence.

### Calibration sample sufficiency

No universal row-count threshold.

Adequacy depends on:
- event / non-event balance;
- distribution of predicted probabilities;
- independent decision dates;
- relevant regime episodes;
- desired precision for calibration-in-the-large / slope / decision-relevant probability region;
- temporal and cross-sectional dependence.

Rules-of-thumb such as 100/200 events are descriptive only. Precision-based validation literature shows required sample size can be materially larger and depends on predicted-risk distribution and target precision.

For Taiwan stock data, stock-row N cannot substitute for independent dates/episodes.

### Drift vs refit state machine

Separate detection from action:

VALID:
current OOS calibration and support are decision-grade.

WATCH:
covariate / prevalence / residual diagnostics shift, but matured outcome evidence is insufficient to declare calibration failure.

DEGRADED:
matured OOS probability-quality evidence shows material deterioration.

OUT_OF_SUPPORT:
current feature / score support is outside validated calibration support.

REFIT_ELIGIBLE:
a preregistered refit rule is met using only information available at the refit decision time.

NOT_VALIDATED:
no valid external / OOS calibration evidence.

Key rule:
SHIFT_DETECTED != AUTO_REFIT.

Regol et al. (2025) explicitly frames retraining as a cost/performance decision; distribution-shift detection alone does not solve when retraining is worthwhile.
Huang et al. (2026) shows a time-series predict-then-update calibration framework under temporal dependence / distribution shift; future outcomes update only subsequent forecasts.

Refit frequency, window, method and trigger are experiment parameters. Refit must remain research-only until OOS/prospective evidence exists.

### CalibrationReceipt

Required immutable identity:
- modelVersion;
- calibrationVersion;
- targetId;
- horizon;
- populationVersion;
- modelTrainingThrough;
- calibrationTrainingThrough;
- maturedOutcomeCutoff;
- method;
- rowN;
- independentDateN;
- regimeEpisodeN;
- probabilitySupport;
- Brier / log loss;
- calibration-in-the-large;
- slope / intercept;
- row-weighted and date-balanced diagnostics;
- drift state;
- status.

D16-25 consumes this receipt and may abstain; it may not create a second calibration mapping.

### L3 blocker

Repository search confirms evaluation infrastructure exists in D16-25 for frozen predictedProbability, calibrationVersion, Brier/log-loss, fixed reliability bins, date-balanced diagnostics and per-Regime diagnostics.

However, no executable Platt/Beta/Isotonic calibration builder or genuine complete Taiwan PIT calibrated-prediction -> matured-outcome series is currently proven on main.

Therefore D16-19 may reach L2, not L3.

---

## Maturity conclusion

The four modules now satisfy L2 mechanism + falsification requirements:

- D16-16 -> L2 / 40%
- D16-17 -> L2 / 40%
- D16-18 -> L2 / 40%
- D16-19 -> L2 / 40%

They do not satisfy L3.

With the current 25-module D16 inventory, promoting these four modules from L0 to L2 moves D16 domain maturity from 45.6% to 52.0%.

This is a curriculum maturity change only. It is not evidence of higher trading returns.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## External methodology anchors

- Cawley & Talbot (2010), On Over-fitting in Model Selection and Subsequent Selection Bias in Performance Evaluation, JMLR.
- Kull, Silva Filho & Flach (2017), Beta calibration, AISTATS / PMLR.
- Manokhin & Grønhaug (2026), When Post-Hoc Calibration Hurts, PMLR.
- Huang, Ma & Michailidis (2026), online calibration for time series under distribution shift, UAI / PMLR.
- Regol et al. (2025), When to retrain a machine learning model, ICML / PMLR.
- Petersen (2009), Estimating Standard Errors in Finance Panel Data Sets, RFS.
- Tibshirani (1996), Lasso, JRSS-B.
- Zou & Hastie (2005), Elastic Net, JRSS-B.
- Diebold & Mariano (1995), Comparing Predictive Accuracy, JBES.
- Riley et al. (2024), external-validation sample-size principles, BMJ.

## Exact next continuation

Do not deepen these four into invented L3 evidence.

Next room priority:
1. D16-20 Causal Inference, currently L0;
2. then D16-21 Alternative Data Provenance / Selection Bias;
3. retain D16-16/17/18/19 at L2 until executable Taiwan PIT builders / replays exist.

Formal Core remains LOCKED.
