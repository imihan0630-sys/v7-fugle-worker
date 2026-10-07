# D16 Forecast -> Calibration -> Uncertainty -> Decision Separation 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / RESPONSIBILITY_CHAIN_FROZEN
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Production/runtime impact: NONE

## Purpose

Freeze a strict separation between:
1. predictive discrimination / forecast quality;
2. probability calibration;
3. uncertainty characterization;
4. decision utility / abstention;
5. downstream allocation;
6. causal interpretation;
7. stress / simulation robustness.

The same evidence must not be counted repeatedly as independent support at multiple layers.

## 1. Forecast layer

Question:
Does the model produce information about the future target beyond a simple frozen baseline?

Admissible outputs:
- point forecast;
- rank / score;
- predictive probability;
- predictive distribution.

Primary validation:
- untouched chronological OOS / prospective evidence;
- target-specific forecast loss;
- date-balanced / dependence-aware comparison;
- simple baseline.

A good forecast does not prove calibration, decision value or causality.

## 2. Calibration layer — D16-19 producer

Question:
When the model says probability p, does the outcome frequency behave consistently with that probability under the intended population and time regime?

Primary tools:
- Brier score;
- log loss;
- calibration-in-the-large;
- calibration slope/intercept;
- reliability diagnostics;
- proper-scoring-rule decomposition where sample permits.

Proper scoring rules may be decomposed into:
- miscalibration / reliability;
- discrimination / resolution;
- irreducible or marginal uncertainty.

Important:
an improvement in a proper score can come from better discrimination, better calibration, or both. Therefore score improvement alone is not a second independent Alpha vote.

D16-19 is the sole calibrator producer.
It emits one immutable CalibrationReceipt per model/target/horizon/population/version.

## 3. Uncertainty layer

Uncertainty is multi-channel and must not be reduced to distance from 0.5.

Preserve separately:
- aleatoric / outcome uncertainty;
- epistemic / parameter uncertainty;
- source/provenance uncertainty;
- support / distribution-shift uncertainty;
- execution/payoff uncertainty.

Prediction intervals or uncertainty sets require their own validity conditions.

### Conformal-prediction firewall

Classical conformal guarantees rely on exchangeability or related assumptions.
Financial time series violate naive exchangeability through:
- serial dependence;
- volatility clustering;
- regime change;
- overlapping labels;
- adaptive selection.

Therefore:
- no generic "distribution-free 95% guarantee" claim for Taiwan market time series without a time-series-valid contract;
- time-series/adaptive conformal challengers remain research methods, not automatic guarantees;
- realized coverage must be evaluated chronologically by independent decision dates / episodes;
- interval width / abstention cost / undercoverage during shifts must be reported;
- conformal set coverage is not trading profitability.

## 4. Decision layer — D16-25 consumer

Question:
Given the calibrated predictive object and uncertainty, should the system ACCEPT, ABSTAIN or DATA_BLOCK the opportunity under a frozen after-cost utility rule?

Inputs:
- CalibrationReceipt;
- target/horizon;
- conditional payoff magnitude;
- fees/slippage;
- uncertainty channels;
- execution support;
- decision thresholds frozen before outer outcomes.

Primary decision metrics:
- after-cost net utility;
- accepted coverage;
- abstention rate;
- opportunity capture;
- false acceptance;
- missed-positive opportunity;
- tail/drawdown where path data permit.

A probability-quality improvement is not a decision-value improvement.
A decision-value improvement is not proof that calibration improved.

## 5. Threshold-value firewall

A decision threshold is not discovered by scanning the test sample for the point with highest realized value.

Required order:
1. economic loss/benefit structure defines a plausible threshold family;
2. threshold family is preregistered or tuned on inner-training evidence only;
3. threshold is frozen;
4. outer/prospective evidence evaluates it.

A threshold selected after seeing realized returns joins the search family and consumes the outer evidence.

## 6. Allocation layer

D15 owns capital allocation / sizing after a validated D16 decision object.

D16-25 may emit sizingEligible metadata.
It does not authorize:
- Kelly fraction;
- portfolio concentration;
- risk budget;
- lifecycle;
- aggregate portfolio heat.

A calibrated p is not a position size.

## 7. Causal layer — D16-20

Question:
Would an intervention/exposure change the outcome under an identified causal design?

Prediction does not imply causality.
Calibration does not imply causality.
A causal effect does not imply tradable Alpha.

Double/debiased machine learning:
- can reduce nuisance-estimation bias through orthogonal scores + cross-fitting;
- does not create identification;
- still requires treatment clock, exchangeability/IV/RD/DiD assumptions as applicable, overlap and PIT-safe controls.

Cross-fitting is therefore a bias-control method inside a causal design, not a license to use arbitrary ML output as causal evidence.

## 8. Stress / simulation layer — D16-23 / D16-24

Stress tests ask:
What happens under specified adverse scenarios?

Monte Carlo asks:
What distribution of outcomes follows under a frozen stochastic model / resampling design?

Neither creates empirical sample size.

Rules:
- simulation path count != independent market N;
- scenario severity != probability;
- model-based tail estimates are conditional on model assumptions;
- dependency structure and regime persistence must be preserved or explicitly stress-tested;
- use simulation to probe robustness of a frozen decision, not to manufacture confirmation.

## 9. Single-evidence anti-double-count rule

Example:
A new model has:
- higher AUC;
- lower Brier;
- better calibration;
- positive after-cost utility.

These may be related consequences of the same underlying signal and same outcome sample.
They are not four independent confirmations.

Report a layered evidence vector:
FORECAST / CALIBRATION / UNCERTAINTY / DECISION / ROBUSTNESS
with lineage to the same parent dataset and outer evidence state.

Do not aggregate them as independent votes.

## 10. Divergent-state matrix

Valid divergent states include:

A. forecast good / calibration poor
- strong ranking;
- misleading probabilities;
- decision may need ABSTAIN or recalibration.

B. calibration good / decision poor
- probabilities truthful;
- payoff asymmetry or cost makes trades unattractive.

C. calibration poor / rank good / utility good
- possible narrow ranking utility;
- probability claims invalid;
- sizing using p forbidden.

D. causal effect true / predictive utility weak
- mechanism may exist but be already priced / too noisy / too late.

E. interval coverage acceptable / utility poor
- uncertainty set statistically valid but too wide to act on.

F. utility positive / stress fragile
- base-case edge exists but tail assumptions / cost shifts destroy it.

These states prove the layers are distinct and must remain separately owned.

## 11. Sequential evidence / repeated monitoring

When probabilities and outcomes arrive sequentially:
- repeated monitoring of score differences cannot use ordinary fixed-sample p-values at every look without adjustment;
- preregistered evidence checkpoints or sequentially valid methods are required for formal inference;
- descriptive dashboards may update continuously but cannot silently become repeated hypothesis tests.

This extends SDA-016 beyond model selection into ongoing forecast evaluation.

## 12. Module impact

Direct:
- D16-16 Time-series Models;
- D16-18 Regularization / Feature Selection;
- D16-19 Machine Learning / Calibration;
- D16-20 Causal Inference;
- D16-23 Stress Test;
- D16-24 Monte Carlo / Distributional Validation;
- D16-25 Probabilistic Decision.

Support:
- D16-05 Multiple Testing;
- D16-06 Independent-Date inference;
- D16-10 Negative Controls;
- D16-12 Experiment Registry;
- D16-15 Maturity Gate.

## 13. Maturity decision

No L-level change.

Reason:
this closes a conceptual/de-duplication gap but creates no new Taiwan PIT replay, calibrated prediction series or prospective decision outcomes.

## 14. External methodology anchors

- Gneiting & Raftery (2007), Strictly Proper Scoring Rules, Prediction, and Estimation.
- Bröcker (2009), Reliability, Sufficiency, and the Decomposition of Proper Scores.
- Waghmare & Ziegel (2025), Proper Scoring Rules for Estimation and Forecast Evaluation.
- Chernozhukov et al. (2018), Double/Debiased Machine Learning for Treatment and Structural Parameters.
- Time-series conformal literature on dependence/non-exchangeability and adaptive coverage.

External work supplies methodology only; no Taiwan Alpha transfer claim.

## Exact next continuation

1. Future CalibrationReceipt must expose discrimination/calibration decomposition without double-voting.
2. PredictiveDecisionReceipt consumes one CalibrationReceipt and records uncertainty + utility separately.
3. Any conformal/time-series uncertainty challenger requires an explicit dependence contract and chronological coverage audit.
4. Stress/simulation receipts must state MODEL_CONDITIONAL and cannot increment empirical independent N.
5. Apply this chain to the first genuine C1 probability/outcome series when it exists.
