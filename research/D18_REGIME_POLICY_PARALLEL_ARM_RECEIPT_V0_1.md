# D18 Regime Policy Parallel-Arm Receipt V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH-ONLY SCHEMA / NOT WIRED / NOT DEPLOYED
Owner: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Preserve a paired counterfactual between:
- STATIC_BASELINE: the frozen strategy operated without regime intervention;
- REGIME_POLICY_CHALLENGER: the same frozen strategy with exactly one preregistered regime overlay;
- optional EXPOSURE_MATCHED_CONTROL: similar aggregate exposure without using the regime signal.

This receipt is designed for System 2 research and may later be adapted for System 1 Shadow research. It must never alter the live/formal decision path by merely existing.

## Core invariant

For a valid paired date, all non-policy components are identical across baseline and challenger:

- source-session receipt;
- market date and decision clock;
- universe version;
- strategy id/version;
- candidate stream and candidate-set hash;
- ranking output before regime overlay;
- factor-definition versions;
- execution simulator version;
- cost/slippage/tax model;
- capital/sizing model;
- price-space semantics;
- outcome horizon definitions.

Only the regime policy action may differ.

If candidate generation/ranking/factor definitions differ, the comparison is no longer a pure policy experiment and must receive a new experiment class.

### Close-to-next-session causality
For an after-close regime snapshot, policy action becomes effective no earlier than the next tradable session. Same-session return, price path or execution evidence cannot be retroactively filtered by the after-close state. A holiday/suspension gap is handled by the official next-tradable-session calendar; missing session continuity remains UNKNOWN.

## Receipt identity fields

- receiptId
- experimentId
- experimentVersion
- marketDate
- decisionTimestamp
- actionEffectiveSession
- capturedAt
- runFingerprintId
- sourceSessionHash
- universeVersion
- universeHash / accountingHash
- strategyId
- strategyVersion
- regimeSnapshotId
- regimeVersion
- executionModelVersion
- costModelVersion
- capitalModelVersion
- receiptSchemaVersion

## Regime evidence fields

- regimeInputState
- regimeLabel
- regimeProbabilityVector when applicable
- regimeObservationMode = OBSERVABLE_RULE / FILTERED_LATENT / PREDICTED_LATENT
- regimeModelTrainingCutoff
- regimeModelFitVersion
- regimeFeatureTransformVersion
- regimeStateCanonicalizationVersion
- regimeAvailableAt
- regimePointInTimeEligible
- transitionState
- uncertaintyState
- unknownReasons

Forbidden:
- SMOOTHED_LATENT as a trading/action input;
- parameter fit using observations after decision time;
- full-sample scaling/normalization statistics;
- current classification backfilled to historical dates.

## State-label canonicalization

Latent state numeric labels are not stable identities across rolling fits.

If latent models are later tested:
- state IDs remain raw model IDs;
- economic state names are mapped using a frozen training-only rule;
- mapping may use training-window state characteristics such as return/volatility signatures;
- mapping rule/version is stored in the receipt;
- ambiguous mappings become UNKNOWN / TRANSITION, not forced;
- mapping must not use holdout outcomes.

## Baseline arm

Fields:
- baselinePolicy = NONE
- baselineCandidateSetHash
- baselinePrePolicyOrderingHash
- baselineDecisionIds
- baselineDecisionHash
- baselineTargetExposure
- baselinePositionIntent
- baselineSelectedOrTriggeredIds as applicable
- baselineWarnings

The baseline must be persisted even when the challenger disables all exposure.

## Regime-policy challenger arm

Fields:
- challengerPolicyId
- challengerPolicyVersion
- challengerPolicyAction = ENABLE / REDUCE / DISABLE / DISCRETE_WEIGHT_MAP
- challengerPolicyReason
- challengerTargetExposure
- challengerDecisionIds
- challengerDecisionHash
- challengerSkippedBaselineDecisionIds
- challengerIncrementalDecisionIds
- challengerWarnings

V0.1 forbids regime-driven changes to stock-level factor definitions or ranking before the overlay. Those belong to a separate later experiment.

## Exposure-matched control arm

Purpose:
separate regime timing skill from the mechanical effect of simply investing less.

Fields:
- controlPolicyId
- controlPolicyVersion
- controlConstruction
- targetExposureRule
- controlTargetExposure
- controlDecisionIds
- controlDecisionHash
- regimeIndependent = true
- controlWarnings

Allowed research constructions must be preregistered and outcome-independent.

## Pair-integrity checks

A receipt is PAIR_READY only when:

1. baseline/challenger share sourceSessionHash;
2. universe/accounting hash matches;
3. strategy version matches;
4. baseline pre-policy candidate/order hash matches challenger pre-policy input;
5. regime is PIT eligible or challenger is BLOCKED;
6. execution/cost/capital versions match;
7. baseline counterfactual is fully preserved;
8. eligible-universe accounting is complete;
9. no outcome data is attached at decision freeze;
10. all unknowns are explicit.

Failure => PAIR_INCOMPLETE / OUTCOME_JOIN_BLOCKED.

## Outcome join

Outcomes are joined only after the frozen horizon matures.

Required:
- outcomeAsOf
- outcomeSourceVersion
- session continuity state
- corporate-action continuity state
- tradability/fill state
- baseline net outcome
- challenger net outcome
- exposure-control net outcome when present
- incremental turnover/cost
- missed-upside amount
- drawdown contribution
- MFE/MAE where meaningful
- outcomeJoinHash

Unknown same-bar path or unavailable fills remain AMBIGUOUS/UNKNOWN.

## Primary paired estimand

The first-line effect is date/path paired:

`challenger net outcome - static baseline net outcome`

Secondary:
- challenger minus exposure-matched control;
- drawdown delta;
- turnover/cost delta;
- capital-utilization delta;
- missed-upside delta;
- tail-loss delta.

Stock rows are diagnostics, not independent replications.

## Overlapping horizon guard

For D+N / holding-horizon outcomes:
- training dates whose label/outcome window overlaps the next outer holdout boundary are purged;
- overlapping daily observations are not treated as independent repetitions;
- embargo/purge length is determined by the frozen maximum information/outcome overlap, not selected after results.

## Experiment-family receipt

Every experiment version records the complete tried family:
- regime taxonomy/version;
- state count;
- model family;
- transform/normalization version;
- thresholds;
- persistence/hysteresis;
- policy map;
- weight/exposure map;
- horizon;
- cost model used for selection;
- refit frequency;
- feature set.

A rejected variant remains in the ledger.

## Negative controls

At analysis time, eligible controls include:
- static baseline;
- exposure-matched regime-independent control;
- block/date permutation preserving temporal dependence;
- transition-date exclusion sensitivity;
- domestic-only/global-only/incremental context;
- factor-redundancy controls;
- cost/slippage stress.

Arbitrary stock-row shuffling is prohibited.

## Complexity ladder

Do not begin with a fully crossed regime cube.

Evidence order:
1. one observable regime dimension × one frozen strategy;
2. repeat across strategies;
3. only then test a second regime dimension as incremental context;
4. pairwise interactions only after both marginal dimensions have enough independent-date evidence;
5. latent-state / multi-dimensional policies last.

This reduces sparse cells, multiplicity and post-hoc storytelling.

The existing 15 usable-date rule in the broad research registry is descriptive readiness only. It is not a promotion sample-size guarantee. Policy promotion sample size should be justified against a preregistered minimum economically meaningful effect and date-level variability, not selected after observing significance.

## Zero-pick / no-exposure semantics

Keep separate:
- NATURAL_ZERO_PICK: frozen strategy produced no eligible action;
- POLICY_DISABLED: baseline had an eligible action but challenger suppressed/reduced it;
- DATA_UNKNOWN: evidence/source/integrity blocked the decision.

Only POLICY_DISABLED carries a regime-policy counterfactual opportunity cost. DATA_UNKNOWN is never coerced to zero.

## Current implementation gap

Repository search on the current main finds the named `UP_TREND_CONTEXT / DOWN_TREND_CONTEXT / RANGE_OR_MIXED` and `VOL_EXPANDING / VOL_CONTRACTING / VOL_NORMAL` labels in the Market Regime V0 specification, but no executable label builder implementing those names. Therefore the first policy experiment cannot yet claim a frozen executable taxonomy. The correct next step is a research-only deterministic regime-label contract or continued raw-feature capture; do not infer the missing rules.

## Promotion boundary

This receipt creates evidence only.

It cannot:
- arm System 2 scheduled capture;
- enable a Worker Cron;
- change strategy weights;
- change rank/selection;
- change System 1/V8 Formal Core;
- authorize live capital.

Any production or Formal use requires separate owner approval after OOS + prospective Shadow + robustness evidence.

## Current status

SCHEMA_DEFINED / NOT_WIRED / FORMAL_UNCHANGED.

## Next

1. Reuse existing System 2 runFingerprint/sourceSession/full-universe accounting IDs rather than invent duplicate lineage.
2. Freeze one simple observable-regime challenger only after enough prospective decision-clock evidence exists.
3. Freeze the exposure-matched control before outcomes.
4. Then accumulate paired prospective dates and run chronological OOS / walk-forward analysis.
