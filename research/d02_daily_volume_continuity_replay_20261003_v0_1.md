# D02 Daily Volume Continuity Replay V0.1

Updated: 2026-10-03 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / HISTORICAL_MECHANICS_REPLAY_ONLY
Parent contract: research/d02_daily_volume_continuity_contract_20261003_v0_1.md
Formal Core: LOCKED
PVE cursor: remains PVE-239

## Goal

Falsify the newly frozen D02 daily-volume continuity contract against pre-existing mechanics witnesses without using forward returns or relabeling historical cases as Prospective Shadow evidence.

## Replay A — 8454 SUPPLY_CHANGE

Existing frozen witness:
- family: STOCK_DIVIDEND_SUPPLY_CHANGE
- target session: 2025-10-09
- raw ratio: 0.8253790006
- registered-issued-share-turnover analogue: 0.7860752394
- no frozen low-volume/breakout Boolean flip in this witness.

Contract result:
- RAW_SHARE_VOLUME remains factual.
- `supplyBreakPresent=true`.
- universal UNIT_SCALE-style reset is NOT required merely because supply changed.
- RAW_ACTIVITY interpretation may remain available.
- COMPARABLE_PARTICIPATION requires a PIT denominator or a fully post-break baseline.

Replay verdict:
PASS.

Falsified rule:
`ANY_CORPORATE_ACTION => RESET_ALL_VOLUME_HISTORY`.

## Replay B — 2465 SUPPLY_CHANGE denominator ambiguity

Existing frozen witness:
- registered-issued-share lane shows no denominator step on 2025-11-17;
- separate public-tradable-supply sensitivity lane produces one low-volume threshold disagreement;
- exact exchange-listed/tradable denominator remains PARTIAL_CONFLICT.

Contract result:
- preserve factual raw share volume;
- preserve registered and public-tradable denominator spaces separately;
- do not collapse PARTIAL denominator evidence into a production truth;
- COMPARABLE_PARTICIPATION = UNKNOWN/BLOCKED until denominator semantics are resolved or a fully post-break raw baseline is used.

Replay verdict:
PASS / UNKNOWN_PRESERVED.

This case directly falsifies a single universal supply denominator.

## Replay C — 3593 UNIT_SCALE positive mechanics witness

Existing frozen witness:
- family: LOSS_REDUCTION_UNIT_SCALE
- shareUnitFactor: 0.6
- raw ratio: 0.9452
- technical-continuity ratio: 1.5753
- both frozen low-volume and breakout-volume Boolean interpretations flip.

Contract result:
- cross-event raw magnitude path is not clean without a verified bridge;
- bridge-verified continuity may be studied;
- reset-only fallback requires 20 post-reset comparable sessions before clean pvDailyRvol20.

Replay verdict:
PASS / HARD_BREAK_REQUIRED.

## Replay D — 8422 UNIT_SCALE counterexample

Existing frozen witness:
- family: PAR_VALUE_CHANGE_UNIT_SCALE
- shareUnitFactor: 10
- raw ratio: 21.116
- technical-continuity ratio: 2.1116
- large numeric distortion;
- frozen Boolean breakout state does NOT flip.

Contract result:
- UNIT_SCALE still triggers the same semantic gate.
- data validity cannot depend on whether a downstream threshold happened to flip.

Replay verdict:
PASS / ANTI-OUTCOME-GATE_CONFIRMED.

This is an important negative control:
`NO_BOOLEAN_FLIP != UNIT_CONTINUITY_VALID`.

## Replay E — TPEx 5314 verified suspension pseudo-bars

Cross-lane witness:
- provider history contains flat zero-amount/zero-volume pseudo-bars on verified suspension dates;
- verified suspension dates are excluded from expected symbol sessions;
- provider bar presence is not symbol-session proof.

Contract result:
- such rows are `VERIFIED_SUSPENSION_OR_NON_SYMBOL_SESSION`;
- they cannot enter the 20 comparable-session baseline;
- they cannot create divergence or persistence episodes.

Replay verdict:
PASS.

## Replay F — 5314 zero-lot / positive-amount low-liquidity witness

Cross-lane witness:
- FCNT000002 can show volume=0 lots while amount>0;
- odd-lot trading can exist below one regular lot.

Contract result:
- intraday regular-lot zero cannot be treated as zero total trading;
- `daily SHARES` and `intraday LOTS` absolute magnitudes cannot be silently reconciled;
- this witness does NOT prove the exact daily aggregate odd-lot inclusion rule.

Replay verdict:
PASS / DAILY_ODDLOT_COVERAGE_REMAINS_UNKNOWN.

## Synthetic code-semantic replay — zero dropped from expected sessions

This is not market evidence and consumes no empirical sample.

Construct 21 prior expected sessions where the most recent 20 include one factual zero-volume eligible session.
Let the latest-20 expected volumes be:
`[0, 100, 101, ..., 118]`
and the 21st-oldest volume be `10000`.

Correct expected-session denominator:
- exactly the latest 20 expected sessions;
- median = 108.5.

Current builder behavior:
- strictly-positive filter drops the zero;
- the 21st-oldest 10000 row is pulled into the surviving last-20 set;
- median = 109.5;
- `dailyHistoryCount` can still equal 20.

Therefore:
a numeric count of 20 can hide denominator identity drift.

Replay verdict:
CODE_SEMANTIC_COUNTEREXAMPLE_PASS.

This proves why zero/missing/non-session states must be separated before slicing the rolling window.

## Contract falsification summary

The contract survives all currently available mechanics tests.

Supported:
- UNIT_SCALE and SUPPLY_CHANGE must remain separate;
- UNIT_SCALE gate is semantic, not outcome/threshold-dependent;
- pure SUPPLY_CHANGE does not invalidate raw executed-share counts;
- participation-intensity interpretation can still be confounded across supply breaks;
- exact expected symbol sessions are required;
- provider row presence is not session proof;
- zero and missing cannot be collapsed;
- daily SHARES and intraday LOTS need explicit cross-lane semantics.

Still UNKNOWN / not closed:
1. exact daily odd-lot aggregate inclusion;
2. production-grade D02 binding to a complete symbol-session receipt;
3. production-grade D02 binding to a complete corporate-action continuity receipt;
4. an observed valid daily-share zero-volume market witness is not required to prove the code bug, but the empirical frequency remains UNKNOWN;
5. current runtime compliance with this contract.

## Maturity

No maturity promotion.

D02-07: L2 / 40%.
D02-09: L2 / 40%.
D02 aggregate: 48.3%.

No forward outcomes inspected.
No threshold tuned.
No Formal optimization candidate.
Formal Core remains LOCKED.

## Exact continuation

Formal next evidence remains PVE-240 on the first genuine completed market session after the approved cross-midnight recovery repair.

Pre-PVE-240 research, if continued before that market session, should next map which continuity fields can be inherited from existing Corporate Actions / Pattern receipts versus which require a D02-specific recorder field. This is schema/readiness work only; no production wiring without governance approval.
