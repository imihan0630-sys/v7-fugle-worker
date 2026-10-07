# D16 SDA-022 D5 Effect-Target Derivation Firewall 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / NUMERICAL_TARGET_NOT_YET_JUSTIFIED
Owner room: 11｜統計驗證與策略市場狀態研究室
Experiment: D16-SDA022-01
Formal Core impact: NONE
Outcome access: CLOSED

## Purpose

Prevent the last open D16-SDA022-01 preregistration gate from being closed with an arbitrary Brier threshold merely to make the experiment "ready".

The primary metric is already frozen:

`DATE_BALANCED_BRIER_LOSS_IMPROVEMENT`

with favorable direction:

`Brier_augmented - Brier_baseline < 0`.

What remains unfrozen is the numerical MDE or precision criterion.

## Repository readback

No genuine prospective Taiwan D5 Brier effect series currently exists that is independent of the future D16-SDA022-01 evidence set.

Search found:
- D16-CAL-01 is preregistered before its first genuine C1 outcome;
- D02 Brier targets are also explicitly TARGET_VALUE_PENDING_FREEZE;
- no genuine prior System1-vs-SHORT_MOMENTUM D5 Brier delta exists.

Therefore:
`PRIOR_INDEPENDENT_EVIDENCE`
is currently unavailable as a numerical target basis.

## Reused canonical derivation bases

Room11 adopts the existing cross-room target-freeze discipline rather than inventing a second standard.

Allowed numerical target rationale bases:

1. COST_BENEFIT
2. THEORETICAL_BOUND
3. PRIOR_INDEPENDENT_EVIDENCE
4. PRECISION_REQUIREMENT

SEMANTIC_POLICY is not appropriate for this predictive-incrementality experiment.

Forbidden:
- current D16-SDA022-01 outcomes;
- same-stream pilot outcomes later counted again as promotion evidence;
- post-outcome winner/horizon/model selection;
- fixture values;
- generic 1%, 5%, 10% improvement without decision justification;
- "40 dates is enough" as a target rationale;
- unknown costs treated as zero.

## Why the existing 40-date floor is not a precision target

The preregistered 40 effective independent decision dates are a minimum support/admission floor.

They are not a mathematical guarantee of:
- a specific confidence-interval half-width;
- power for a specific Brier effect;
- regime robustness;
- independence after overlapping D5 horizons.

Brier-score sampling variance can be inflated by serial dependence.
Therefore nominal date count cannot substitute for an explicit dependence-aware precision calculation.

If effective independent date count is lower than raw date count, precision is weaker still.

## Bounded-loss sanity check

Per-row binary Brier loss lies in [0,1].

The paired date-level difference:
`Brier_augmented - Brier_baseline`
lies in [-1,1].

A distribution-free bound based only on this range is extremely conservative and would require far more than 40 independent dates for a narrow interval.

Therefore:
- boundedness is useful as a sanity firewall;
- it is not an efficient target-setting method for this experiment.

No tiny numerical target may be justified merely because Brier is bounded.

## Resolution-equivalent interpretation

For calibrated nested information sets, Brier improvement can be interpreted through refinement/resolution logic.

A rough square-root probability scale may be reported as an interpretability aid only when the required calibration/nesting assumptions are satisfied.

It is NOT a universal conversion:
`Brier improvement -> probability-point gain`.

Therefore a target such as:
"0.0025 because that looks like 5 percentage points"
is forbidden unless a separate derivation proves the mapping for the frozen estimand and decision context.

## Allowed future freeze pathways

### Path A — independent planning evidence

Requirements:
- immutable planningDataReceiptId;
- planningDataHash;
- planningDataFrozenAt;
- disjointFromPromotionEvidence=true;
- no overlap in decision dates/outcome information footprint with the future D16-SDA022-01 promotion evidence;
- planning-only label;
- exact same metric/target/horizon/comparator or explicit transportability justification.

Then a variance-based precision/MDE target may be frozen before outcome opening.

### Path B — decision-relevant utility mapping

Requirements:
- explicit downstream decision that consumes the probability increment;
- utility/loss asymmetry frozen independently;
- transaction/execution costs not assumed zero;
- mapping from Brier improvement to decision consequence justified before outcomes.

Current D16-SDA022-01 is predictive-incrementality research, not yet a portfolio decision rule.
Therefore Path B is not currently available.

### Path C — externally fixed precision policy

Requirements:
- maxHalfWidth is justified by a governance/decision consequence;
- not chosen from current data variability;
- dependence-aware confidence procedure frozen;
- resource availability alone cannot masquerade as materiality.

No such policy is currently canonical.

## Current effect-target state

`TARGET_VALUE_PENDING_FREEZE`.

This is the correct state.

The experiment may continue accumulating outcome-blind prospective pair receipts once upstream gates are ready.

But primary outcome inference must remain CLOSED until a complete numerical EffectTargetReceipt exists.

## Required future EffectTargetReceipt

Must contain:
- targetId;
- targetVersion;
- experimentId;
- kind = MDE or PRECISION_TARGET;
- estimandId;
- metric = DATE_BALANCED_BRIER_LOSS_IMPROVEMENT;
- unit = BRIER_LOSS_DELTA_PER_EQUAL_WEIGHT_DECISION_DATE;
- direction;
- thresholdValue OR maxHalfWidth;
- comparator = SYSTEM1_ONLY vs SYSTEM1_PLUS_SHORT_MOMENTUM;
- horizon = D5_OFFICIAL_SESSIONS;
- costTreatment = NOT_A_TRADING_PNL_ESTIMAND;
- rationaleBasis;
- planning evidence identity if used;
- frozenAt;
- frozenBeforeOutcome=true;
- outcomeAccessStateAtFreeze=OUTCOME_CLOSED;
- targetHash.

## Statistical-method interaction

The already frozen model method remains unchanged:
- coarse categorical policy states;
- ridge logistic primary lambda=1;
- identity calibration;
- date-balanced Brier;
- chronological matured-only refit;
- date-level dependence-aware uncertainty.

Effect-target work must not reopen those choices.

## Methodology anchors

- serial correlation inflates sampling variance for Brier-type forecast verification statistics;
- nonsynchronous/stale observations can alter return autocorrelation and variance;
- missing-observation treatment can invalidate time-series inference when handled naively.

These are methodological reasons to avoid treating row count or raw date count as a precision guarantee.

They are not Taiwan Alpha evidence.

## Maturity decision

No maturity change.

Progress is:
- target-setting freedom is now constrained;
- arbitrary numerical target insertion is explicitly forbidden;
- the gate remains truthfully pending.

## Exact next continuation

1. Do not freeze a numerical target until one allowed pathway becomes available.
2. Continue upstream CORR-004 / System2 fingerprint / physical NC-T01 work.
3. When a disjoint planning Brier series or explicit decision-utility mapping exists, derive and hash the numerical EffectTargetReceipt before opening D5 outcomes.
