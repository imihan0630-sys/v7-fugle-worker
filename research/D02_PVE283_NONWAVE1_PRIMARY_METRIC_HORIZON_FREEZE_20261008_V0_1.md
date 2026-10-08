# D02 PVE-283 — Non-Wave-1 primary metric / horizon freeze

Date: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / 9_TARGET_SHELLS_ADVANCED / D02_11_COST_BLOCKED / NO_NUMERICAL_TARGET / NO_MATURITY_CHANGE

## Goal

PVE-282 found 4 PARTIAL and 10 BLOCKED numerical-target shells.
PVE-283 removes only the design degrees of freedom that can be justified without looking at outcomes.

It does not freeze a numerical MDE, precision target or semantic tolerance.

## Shared metric

For the nine newly advanced predictive lanes, primary statistical metric is:

DATE_BALANCED_BRIER_LOSS_IMPROVEMENT

Binary labels are lane-specific. D16 owns probability model/calibration.
Baseline/challenger must use identical support/partitions/method family.
Event-level Brier loss is averaged within scanDate, then improvements are equal-date weighted.
Positive = challenger lowers Brier loss.

No row-weighted primary.
Sensitivity horizons cannot rescue the primary result.

## Frozen lane scales

D02-04 DRYUP:
- primary outcome: DRYUP_TERMINAL_DEMAND_REEXPANSION_FAILURE;
- horizon: active dry-up entry to first reacceleration or structure failure or 13:00 censor;
- reason: dry-up is a two-leg lifecycle hypothesis, so fixed B2 would truncate its defining reacceleration condition.

D02-05 EXTREME_PARTICIPATION:
- primary outcome: B2 positive-return probability;
- primary B2; B1/B4 sensitivity;
- motive labels remain forbidden.

D02-07 SVB20:
- primary outcome: D5 positive-return probability;
- D5 primary; D1/D3/D10 sensitivity;
- reason: signedVolumeBalance20 is a daily 20-session transform; D5 is a one-trading-week short-daily scale, while D10 crosses into the medium-daily family.

D02-08 PROVIDER_PRESSURE:
- primary outcome: B2 positive-return probability;
- B2 primary; B1/B4 sensitivity;
- proxy-only semantics remain; no participant-intent inference.

D02-09 PIVOT_SIGNED_VOLUME:
- primary outcome: D5 positive-return probability after confirmed pivot;
- D5 primary; D1/D3/D10 sensitivity;
- confirmedAt remains the legal clock.

D02-09 PARTICIPATION_TRAJECTORY:
- primary outcome: B2 positive-return probability;
- B2 primary; B1/B4 sensitivity;
- this target is independent from pivot-family D5 target.

D02-10 TREND_VOLUME_INTERACTION:
- primary outcome: B2 return aligned with pre-session trend direction;
- B2 primary; B1/B4 sensitivity;
- only D-vs-C residual interaction counts.

D02-12 TIME_OF_DAY_VOLUME_CURVE:
- primary outcome: B1 positive-return probability;
- B1 primary inside the existing 09:00-13:00 bounded monitor;
- B2 is sensitivity only when complete.
Reason: B2 would systematically lose 12:45 observations because the second future completed 15m bar lies beyond 13:00, creating avoidable slot-dependent coverage selection.

D02-12 PRICE_BY_VOLUME_PROFILE:
- same B1 bounded-window primary;
- prospective-only profile capture remains mandatory;
- no historical backfill or unsupported closing-auction claim.

## Deliberate non-freeze: D02-11

D02-11 remains BLOCKED.

Its primary question is an eligibility/risk utility trade-off between admitted and reason-stratified liquidity-rejected controls.
Without D14 cost-quality provenance, freezing a weighted utility metric or cost threshold would fabricate economic meaning.

Known insufficient state:
- statutory tax semantics may be known;
- owner-specific commission/minimum/rounding/channel provenance is not established;
- broker-confirmed slippage/implementation-shortfall lifecycle is not available as a universal anchor;
- UNKNOWN cannot become zero.

Therefore D02-11 primary utility metric and primary horizon remain unfrozen until D14 supplies a valid cost-quality receipt.

## Readiness effect

Using the same PVE-282 classifier on target registry V0.5:
- READY = 0;
- PARTIAL_NUMERIC_JUSTIFICATION_MISSING = 13;
- BLOCKED_PRIMARY_METRIC_OR_HORIZON_NOT_FROZEN = 1 (D02-11 only).

This is preregistration progress, not L4 evidence.

No outcome access.
No numerical target.
No maturity promotion.
Formal Core unchanged.
