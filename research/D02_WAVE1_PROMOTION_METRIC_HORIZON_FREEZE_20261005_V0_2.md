# D02 Wave-1 Promotion Metric / Horizon Freeze V0.2

Updated: 2026-10-05 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PRIMARY_METRIC_AND_HORIZON_FROZEN / NUMERICAL_TARGET_PENDING
Evidence cursor: PVE-239
Formal Core impact: NONE

## Scope

This version resolves the two remaining Wave-1 preregistration degrees of freedom before numerical target freeze:
- one singular promotion-grade statistical metric;
- one primary/joint horizon decision rule.

Evidence keys:
- D02-02:H001;
- D02-03:H20;
- D02-06:H003.

No numerical MDE / precision value is frozen here.

## 1. Singular promotion-grade statistical metric

Primary metric for all three Wave-1 lanes:

`DATE_BALANCED_BRIER_LOSS_IMPROVEMENT`

Definition:
1. outcome is binary failure=1 / non-failure=0 under the lane-specific frozen outcome contract;
2. D16-19 owns the probability model / calibration producer;
3. baseline and challenger must use identical folds, dates, events, label availability and estimator/calibration family;
4. compute event-level Brier loss `(p-y)^2`;
5. average Brier loss within each independent scanDate for baseline and challenger separately;
6. form same-date improvement:
   `dateImprovement = meanBrier_baseline - meanBrier_challenger`;
7. primary reported estimand is the equal-date-weight mean of `dateImprovement`.

Positive values mean the challenger has lower Brier loss.

Unit:
`brier_score_points`.

Direction:
`GREATER_THAN_OR_EQUAL`.

Why Brier is primary:
- it is a proper scoring rule already owned by D16-19;
- it compares nested feature sets without inventing a post-outcome classification threshold;
- equal-date weighting prevents one large cross-section from manufacturing independent evidence;
- it allows H001/H20/H003 to use the same statistical comparison framework while keeping different outcome semantics.

D16 must preregister model / calibration implementation before promotion-grade use.
D02 does not choose the estimator after outcomes.

## 2. Mandatory supporting reports

PV-084 remains authoritative.

Every promotion review must also report:
- absolute failure-rate difference where a frozen decision/semantic classification makes it defined;
- risk ratio where denominator is valid;
- median MFE;
- median MAE;
- median return;
- subgroup/date stability.

If failure-rate difference / risk ratio are not defined because the comparison is purely probabilistic and no action threshold is preregistered:
- report `NOT_DEFINED_WITHOUT_FROZEN_DECISION_THRESHOLD`;
- do not create a 0.5 or sample-optimized threshold after outcomes.

Log loss is a mandatory secondary proper-score diagnostic.
If Brier improves but log loss materially deteriorates under the same D16 uncertainty contract:
- classify `SCORING_RULE_CONFLICT`;
- do not promote until resolved.

PV-086 utility reporting remains mandatory:
- adverse confirmations avoided;
- valid follow-through opportunities lost;
- BUY-frequency / idle-capital impact;
- D14 cost/liquidity stratification where economic.

## 3. H001 primary outcome / horizon

Outcome:
`STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2`.

Primary horizon:
`B2` = two future completed 15m bars after the frozen anchor.

Binary label:
- failure=1 when the frozen channel-specific structural-failure/no-follow-through composite is true at B2;
- failure=0 when B2 is complete and the composite is false;
- incomplete/continuity-invalid = CENSORED / UNKNOWN, never 0.

Comparator:
`MODEL_C_VS_MODEL_B`.

Rationale for B2:
- B1 is only one completed post-anchor 15m bar and is more exposed to immediate bar noise;
- B4 is a longer 60-minute path and has materially more late-session censoring / unrelated-path opportunity;
- B2 is the shortest horizon that requires more than one post-anchor completed bar while preserving more same-session coverage than B4;
- under current zero-extra-call coverage through the 13:00 completed bar, B2 allows anchors through 12:30, whereas B4 requires anchors no later than 12:00.

This is a design/coverage rationale frozen before outcomes, not result selection.

Sensitivity horizons:
- B1 = EARLY_RESPONSE_SENSITIVITY;
- B4 = PERSISTENCE_SENSITIVITY.

Rules:
- B1/B4 cannot rescue failed B2;
- B1/B2/B4 are correlated repeated outcomes, not independent events;
- a materially adverse B1 or B4 result under D16 uncertainty triggers `HORIZON_INSTABILITY_REVIEW`;
- missing/censored B1/B4 is reported as coverage, not favorable evidence.

## 4. H20 primary outcome / horizon

Outcome:
`D01_OWNED_BREAKOUT_STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2`.

Primary horizon:
`B2`.

Comparator:
`MODEL_C_VS_MODEL_B_ON_IDENTICAL_D01_BREAKOUT_EVENT`.

The same B2 design rationale applies.

Additional H20 rules:
- D01-05 remains the only primitive breakout-event owner;
- D02 adds volume-confirmation information only;
- event identity, anchor and outcome horizon must match between baseline/challenger;
- B1/B4 are sensitivity only and cannot mint another breakout vote.

## 5. H003 primary outcome / horizon

H003 does NOT use B2 as its primary horizon.

Primary outcome:
`CLEAN_ACTIVE_ACCEPTANCE_LIFECYCLE_TERMINAL_FAILURE`.

Primary horizon:
`ACTIVE_LIFECYCLE_ENTRY_TO_FIRST_TERMINAL_OR_13_00_CENSOR`.

Maturity-eligible denominator:
`H003_HYPOTHESIS_CLEAN_EVENT_COUNT`.

Resolved success states:
- B_REACCELERATION;
- A_REACCELERATION.

Resolved failure states:
- B_FAILED_REENTRY;
- A_FAILED_REENTRY.

Censored / not a failure:
- B_EXPIRED_AMBIGUOUS;
- A_EXPIRED_AMBIGUOUS;
- PRE_EVENT_ONLY_EXPIRY;
- incomplete/invalid continuity.

Comparator:
`PRICE_PLUS_VOLUME_RESPONSE_VS_PRICE_ONLY_RESPONSE`.

Binary outcome for Brier:
- terminal failure=1;
- terminal success=0;
- censor/UNKNOWN excluded from matured-label score but retained in coverage denominators.

Reason:
H003 is a state lifecycle representation question.
Forcing it into B1/B2/B4 would replace the frozen acceptance-state semantics with an unrelated clock.

B1/B2/B4 market-path outcomes remain secondary diagnostics only and cannot substitute for the lifecycle endpoint.

## 6. D16 ownership firewall

D16-19 owns:
- model fitting;
- calibration;
- Brier/log-loss calculation;
- identical training/validation/calibration partitions;
- model-family comparison;
- immutable prediction receipts.

D16-06 / applicable D16 validation owns:
- same-date dependence;
- effective sample;
- small-cluster handling;
- uncertainty.

D02 owns:
- outcome identity;
- horizon;
- comparator;
- feature semantics.

Neither lane may change the other's object after outcome access.

## 7. Multihorizon decision rule

H001/H20:
- PRIMARY = B2;
- B1/B4 = mandatory sensitivity when complete;
- B1/B4 cannot rescue B2;
- any material opposite-direction sensitivity result => HORIZON_INSTABILITY_REVIEW;
- no averaging B1/B2/B4 into a new score after outcomes.

H003:
- PRIMARY = lifecycle terminal/censor endpoint;
- B horizons = diagnostics only.

No best-horizon selection after outcomes.

## 8. Current blocker after this freeze

Resolved:
- singular promotion-grade metric;
- H001 primary horizon;
- H20 primary horizon;
- H003 lifecycle primary horizon;
- multihorizon rescue rule.

Still pending:
- D16 preregistered model/calibration implementation for each experiment version;
- numerical MDE or precision target;
- target rationale;
- D14 cost evidence where required.

No numerical target is frozen.
D02 maturity remains 60.0%.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
