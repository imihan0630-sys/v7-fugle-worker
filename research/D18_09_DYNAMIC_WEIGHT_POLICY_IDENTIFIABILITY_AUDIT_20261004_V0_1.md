# D18-09 Dynamic Weight Policy Identifiability Audit — 2026-10-04 V0.1

Updated: 2026-10-04 22:16 Asia/Taipei
Status: RESEARCH_ONLY / L2_DEEPENED / L3_NOT_JUSTIFIED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 1 / System 2 live-policy impact: NONE

## Question

Can a future Regime-conditioned dynamic strategy weighting experiment identify allocation skill rather than merely lower gross exposure, different turnover, or extra search degrees of freedom?

## Main finding

D18-09 must remain L2. Existing D18-01 observable regime vectors, D18-08 activation frames, D18-10 common-support panels, D18-13 attribution receipts and D18-14 walk-forward machinery establish reusable evidence infrastructure, but they do not by themselves establish an executable dynamic-weight receipt.

Dynamic weighting is a stronger intervention than binary activation. Evidence from D18-08 cannot be inherited automatically.

## Estimands must be separated

A dynamic-weight study must report at least four distinct effects:

1. Allocation effect: value from reallocating capital across strategy sleeves conditional on a PIT-safe regime.
2. Gross-exposure effect: value from simply carrying less or more total market exposure.
3. Turnover/cost effect: value lost or gained because weights change more often.
4. Opportunity-cost effect: value of strategies that were underweighted during rebounds or regime misclassification.

A lower drawdown with lower average gross exposure is de-risking evidence, not proof of Regime timing skill.

## Required controls

The first admissible challenger requires:

- STATIC_WEIGHT_BASELINE: fixed preregistered weights.
- EXPOSURE_MATCHED_NON_REGIME_CONTROL: same gross-exposure path or closest preregistered feasible analogue without using Regime information.
- TURNOVER_MATCHED_CONTROL when feasible: similar weight-change frequency without Regime information.
- Identical strategy versions, source session, candidate stream, capital convention, execution simulator, fees, tax and slippage.

If the challenger loses its advantage against exposure-matched control, allocation skill is not identified.

## First-generation complexity firewall

Do not start with continuous optimization.

First generation should use:
- one PIT-safe regime dimension;
- a small frozen set of strategy sleeves;
- a tiny discrete weight map;
- next-session effectiveness for after-close regime evidence;
- UNKNOWN -> abstain / preserve baseline according to a preregistered rule, never neutral-impute;
- no simultaneous factor/ranking/entry-rule changes.

Every additional regime dimension, threshold, persistence rule, weight level, strategy subset, horizon, refit rule or cost assumption used for selection belongs to the same multiple-testing family.

## Reuse, do not duplicate, existing D18 infrastructure

A future D18-09 builder should consume rather than reinvent:
- D18-01 immutable observable regime vector and receiptHash;
- D18-08 run fingerprint / shadowAccountingHash / identical-cost guard semantics;
- D18-10 same-date strategy common-support semantics;
- D18-13 matured outcome attribution joins;
- D18-14 chronological fold / purge / maturity-cutoff semantics.

No second regime clock, second outcome maturity clock or second walk-forward split logic should be created.

## Weight-receipt minimum identity

Before any outcome is visible, an immutable research-only receipt should bind:
- marketDate and decisionTimestamp;
- actionEffectiveSession;
- strategy set and strategy versions;
- regimeVectorHash / regimeVectorVersion;
- policyId / policyVersion / parameterHash;
- prior weights;
- static baseline weights;
- challenger weights;
- total gross exposure for each arm;
- expected incremental turnover;
- cost contract hash;
- common-support / UNKNOWN state;
- source run fingerprint(s);
- createdAt and receiptHash.

The receipt must contain no matured outcome.

## PIT and look-ahead guards

- After-close regime evidence may affect no earlier than the next official tradable session.
- Registration and weight-map version must exist no later than the decision timestamp.
- UNKNOWN regime or incomplete strategy common support cannot be converted to zero weight by default.
- Current regime labels cannot be backfilled into historical dates.
- Full-sample weight optimization or full-sample normalization invalidates OOS claims.
- A later matured outcome may join the immutable weight receipt but may not mutate it.

## Whipsaw / transition accounting

Weight policies create a transition surface, not just a state label.

Store:
- regime transition count;
- weight-change count;
- turnover by transition;
- short-lived state count;
- delay from state observation to effective action;
- missed-rebound opportunity cost;
- idle-capital days;
- UNKNOWN / no-action occupancy.

Hysteresis/cooldown may reduce churn but also delays true turns. Any persistence length is a policy parameter and cannot be tuned after outcome inspection.

## Dependence and sample size

Primary inference units are independent official decision dates and independent Regime episodes.

Stock rows and strategy sleeves on the same date do not create independent market samples.

Report:
- independent dates;
- independent episodes by action-driving state;
- transitions;
- policy-action dates;
- UNKNOWN dates;
- turnover events;
- paired after-cost differential.

Single-episode dominance blocks promotion.

## Redundancy / alternative explanations

Apparent dynamic-weight value may be explained by:
- lower beta / gross exposure;
- volatility targeting;
- stock-level trend/volatility factors already inside strategies;
- sector rotation already captured by strategy sleeves;
- liquidity / limit-state differences;
- concentration in one crisis or rebound episode;
- differential turnover and slippage.

The Regime overlay must show incremental value after appropriate controls.

## Falsification conditions

The hypothesis is weakened or rejected if:
- benefit disappears versus exposure-matched control;
- benefit disappears under identical plausible costs/slippage;
- sign reverses across independent Regime episodes;
- one episode dominates contribution;
- UNKNOWN/common-support missingness is outcome- or Regime-selective;
- neighboring preregistered discrete maps reverse the conclusion;
- static/equal weights match or outperform OOS;
- prospective Shadow separates materially from historical replay;
- effect is redundant with existing trend/volatility/breadth/sector/stock factors.

## Promotion decision

D18-09 remains L2 / 40%.

L3 requires an executable/tested Taiwan PIT research-only dynamic-weight builder with immutable receipt, replay equality, UNKNOWN fail-closed behavior, source/version/availableAt provenance, next-session timing, common-support audit and no current-data historical backfill.

L4 requires paired untouched OOS / prospective Shadow outcomes across multiple Regime episodes with static and exposure-matched controls, identical costs and complete opportunity-cost accounting.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next continuation point

1. Re-read latest main.
2. Build only a research-only deterministic discrete-weight receipt validator if current D18-01/D18-08/D18-10 identities can be reused without changing live policy.
3. First tests are replay invariance, post-decision registration rejection, UNKNOWN fail-closed, regime/date mismatch rejection, exposure decomposition, cost parity and no-outcome-at-decision.
4. Do not search returns or weight maps to choose a winner.
5. If engineering is blocked, move to the next executable D16/D18 module rather than manufacturing L3 evidence.
