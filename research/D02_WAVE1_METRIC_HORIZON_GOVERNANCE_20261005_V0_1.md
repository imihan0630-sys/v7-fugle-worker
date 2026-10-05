# D02 Wave-1 Metric / Horizon Governance V0.1

Updated: 2026-10-05 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / EFFECT_SIZE_FAMILY_FROZEN / HORIZON_DECISION_RULE_PENDING
Evidence cursor: PVE-239
Formal Core impact: NONE

## Scope

Wave-1:
- D02-02 H001;
- D02-03 H20;
- D02-06 H003.

## Existing effect-size authority

PV-084 already freezes the reporting order:
- absolute failure-rate difference;
- risk ratio;
- median MFE;
- median MAE;
- median return;
- subgroup/date stability.

P-values or AUC alone cannot justify usefulness.

PV-086 additionally freezes utility as a trade-off:
- adverse confirmations avoided;
- valid follow-through opportunities lost;
- BUY-frequency / idle-capital impact.

A filter that improves apparent win rate by suppressing nearly all entries fails the system objective.

## Wave-1 outcome families

H001:
primary outcome family = frozen structural failure / no-follow-through.

H20:
primary outcome family = breakout structural failure / no-follow-through on the identical D01-owned breakout event.

H003:
primary outcome family = future structural acceptance / failure.

MFE/MAE/return remain secondary/diagnostic unless separately promoted by a new preregistration.

## Horizon audit

Repository audit found:
- B1, B2 and B4 are all explicitly frozen same-session completed-bar horizons;
- late-session incomplete horizons remain censored;
- no canonical document ranks B1 > B2 > B4, B2 > B1/B4, or any other primary-horizon hierarchy.

Therefore:
- no single B horizon may be selected after outcomes;
- a strong result at only one horizon cannot be called the pre-existing primary result;
- B1/B2/B4 observations from the same anchor are correlated repeated outcomes, not three independent events;
- D16 must account for horizon multiplicity/dependence if all are used.

## Current effect-size decision

The effect-size *reporting family* is frozen.

The singular promotion-grade statistical metric is NOT yet frozen.

Reason:
absolute failure-rate difference is clearly required to be reported, but the repository does not yet freeze the exact modeling/stratification rule that turns the challenger-vs-baseline feature comparison into one singular binary-effect estimand for every Wave-1 lane.

Risk ratio is supporting effect-size context, not a substitute for an exact target definition.

## Current horizon decision

Status:
MULTIHORIZON_DECISION_RULE_PENDING.

Allowed next designs before outcome access:
A. choose one primary B horizon with an independent decision rationale; or
B. freeze a joint B1/B2/B4 family-level decision rule with D16 multiplicity/dependence handling.

Forbidden:
- choose the best horizon after seeing outcomes;
- promote on one significant horizon while ignoring the others;
- count B1/B2/B4 as independent samples;
- switch between same-session and D1 because one looks better.

## Consequence

H001/H20/H003 have:
- comparator shell frozen;
- primary outcome family frozen;
- effect-size reporting family frozen;
- horizon semantics frozen.

Still pending:
- one singular promotion-grade metric rule;
- one primary/joint horizon decision rule;
- numerical MDE or precision value;
- cost-benefit rationale where economic.

No target is numerically FROZEN.
D02 remains 60.0%.
Gate 7 CLOSED.
