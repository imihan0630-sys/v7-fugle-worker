# PATTERN-RG2 → D16 Statistical Validation Handoff V0.1

Updated: 2026-10-03 Asia/Taipei
Owner of Pattern semantics: D01 K-line / Pattern / Price Structure
Owner of inference implementation: D16 Statistical Validation / PIT / Shadow / OOS / Anti-overfit
Status: RESEARCH_ONLY / OUTCOME_CLOSED / HANDOFF_READY / FORMAL_CORE_LOCKED

## 1. D01 has frozen the estimand target; D16 must not redefine the Pattern mechanism

Hypothesis family: PATTERN_RG2_NESTED_RESISTANCE.

D01-owned semantic inputs:
- immutable local Pattern boundary and version;
- immutable MAJOR parent zone and version;
- availableAirToParentLowerPct;
- geometryRelationState;
- compoundLifecycleState;
- parentZoneAgeEligibleSessions;
- relationEpisodeKey;
- Pattern common-support / multiplicity status.

D16 must not replace these with post-outcome thresholds or choose a different Pattern relation after seeing results.

## 2. Primary unit and dependence requirements

Primary parent outcome unit:
one parentDecisionReceiptId = one symbol × scanDate × captureGeneration decision.

Primary inference eligibility:
SINGLE_RELATION_ELIGIBLE only.

Dependence that D16 must handle:
- scanDate common shock;
- symbol serial/entity dependence;
- repeated relationEpisodeKey longitudinal observations;
- overlapping D5 / D10 future windows.

Naive iid row-level inference is prohibited.

relationEpisodeKey is nested within symbol for dependence purposes; it remains essential for de-dup, episode-first and episode-holdout sensitivity.

## 3. Primary estimand supplied by D01

For the same common-support holdout parent:
L0 = B0 predictive loss.
L1 = B1 predictive loss.
d_it = L0 - L1.

Within date:
D_t = mean_i(d_it).

Target:
equal-weight mean_t(D_t).

Positive sign = B1 lower predictive loss.

Co-primary endpoints:
- D5 MFE percent;
- D5 MAE percent.

D5 return and D10 endpoints are secondary.

## 4. Nested-model issue

B1 nests B0 by adding RG2_CORE_V0_1.

Therefore D16 must explicitly decide, preregister and document how it handles nested-model forecast comparison.

Raw in-sample fit improvement is invalid.
Raw pooled holdout MSE difference alone is insufficient for promotion-grade inference.

Clark-West-type adjustment is a candidate family only if its assumptions match the frozen estimator/loss setup.

Any alternative must be preregistered before Pattern outcomes are joined.

## 5. Cluster / small-sample issue

Existing global governance minimum:
- 60 mature D5 rows;
- 15 independent scanDates;
- 10 valid leave-one-date-out checks.

These are eligibility gates, not a theorem that asymptotic cluster inference is reliable at exactly 15 dates.

D16 must explicitly record:
- number of date clusters;
- number of symbol clusters;
- cluster-size distribution;
- whether finite-sample correction / resampling is used;
- whether inference materially changes under leave-one-date-out;
- whether one or a few dates dominate.

Multi-way clustering or finite-sample cluster resampling are methodological candidates, not pre-approved outputs.

References for D16 method review:
- Cameron, Gelbach & Miller — Robust Inference with Multi-way Clustering, NBER T0327.
- Petersen (2011), JFE, DOI 10.1016/j.jfineco.2010.08.016.
- MacKinnon, Nielsen & Webb (2023), JOE, DOI 10.1016/j.jeconom.2022.04.001.

## 6. Strong dependence in forecast-loss series

Adjacent dates can share overlapping D5/D10 realization windows.

D16 must not apply an equal-predictive-accuracy test that assumes weak/irrelevant dependence without checking the actual loss-differential dependence structure.

Reference:
Coroneo & Iacone (2025), International Journal of Forecasting, DOI 10.1016/j.ijforecast.2024.11.003.

Frozen D01 robustness view:
NON_OVERLAPPING_DATE_SENSITIVITY.

## 7. Required split / purge semantics

Chronological scanDate split only.

Prohibited:
- random row split;
- symbol-row shuffling across time;
- future scaling / encoding;
- using holdout to select Pattern features;
- allowing forward outcome windows from training dates to cross the first holdout date.

Required:
- PURGED_FORWARD_HOLDOUT;
- EPISODE_HOLDOUT_SENSITIVITY: remove training relationEpisodeKeys appearing in holdout;
- EPISODE_FIRST_SENSITIVITY: retain first eligible observation per relation episode;
- NON_OVERLAPPING_DATE_SENSITIVITY.

## 8. Baseline/challenger information sets

B0_PRICE_STRUCTURE is diagnostic only.

B0_FULL_CONTEXT is the promotion-grade baseline and adds D02 acceptance/persistence, market/sector regime, liquidity and round-price proximity.

B1 = corresponding B0 + RG2_CORE_V0_1.

RG2_CORE_V0_1:
- availableAirToParentLowerPct;
- geometryRelationState;
- compoundLifecycleState;
- parentZoneAgeEligibleSessions.

If B1 only survives against price-only controls but not B0_FULL_CONTEXT:
classification = CONTEXT_PROXY_RISK.

## 9. D16 outputs required before any outcome interpretation can be called promotion-grade

D16 must return a machine-readable validation receipt containing at least:
- experimentVersion;
- exact B0 / B1 feature contract hashes;
- exact outcome contract/version;
- common-support count;
- independent scanDate count;
- independent symbol count;
- relationEpisode count;
- train/holdout dates;
- purge rule/result;
- estimator / encoding / scaling version;
- loss function;
- nested-model comparison method;
- date/symbol dependence method;
- small-cluster treatment;
- leave-one-date-out summary;
- episode-first summary;
- episode-holdout summary;
- non-overlap-date summary;
- multiple-testing family ID;
- coverage/missingness summary;
- result status.

## 10. Frozen result-status vocabulary

Allowed:
- WAITING_DATA;
- DATA_QUALITY_BLOCKED;
- ACCUMULATING;
- NO_INCREMENTAL_VALUE;
- PRICE_REDUNDANCY;
- CONTEXT_PROXY_RISK;
- FRAGILE_DATE_DEPENDENCE;
- LONGITUDINAL_REPEAT_DEPENDENCE;
- EPISODE_MEMORIZATION_RISK;
- OUTCOME_WINDOW_DEPENDENCE;
- REGIME_OR_INDUSTRY_CONCENTRATED;
- PREDICTIVE_INCREMENTALITY_CANDIDATE.

PREDICTIVE_INCREMENTALITY_CANDIDATE remains research-only and does not authorize Formal promotion.

## 11. Ownership firewall

D01 owns:
Pattern/RG2 semantics, boundaries, lifecycle, relation identity, feature meaning.

D16 owns:
statistical estimator, finite-sample inference, cluster/bootstrap method, OOS validation implementation, calibration of inferential uncertainty.

D02 owns:
price-volume acceptance/persistence.

Corporate Actions / session lanes own:
PIT continuity and symbol-session semantics.

No room may silently redefine another room's canonical object.

## 12. Current handoff state

PATTERN_RG2_SEMANTICS = FROZEN.
PATTERN_RG2_ESTIMAND = PREREGISTERED.
D16_INFERENCE_METHOD = NOT_YET_FROZEN.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.