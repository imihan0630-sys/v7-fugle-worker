# D01 DL-038 — D16 Detector-vs-Economic Generalization Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes a strict separation:

DETECTOR_ROBUSTNESS:
same local geometry across frozen parameter variants.

ECONOMIC_ROBUSTNESS:
incremental evidence across symbols, independent dates/episodes, ex-ante regimes, OOS/prospective periods and costs.

Detector stability is not an economic result.

## 2. Generalization ladder

D16 future evidence should progress explicitly:

G0 LOCAL_DETECTOR_ONLY
G1 CROSS_SYMBOL
G2 CROSS_DATE
G3 CROSS_REGIME
G4 PROSPECTIVE_OOS
G5 COST_AWARE

Do not skip levels by citing parameter robustness.

## 3. Replication accounting

Always report separately:
- observations;
- raw representations;
- unique parents;
- unique structural roots;
- unique episodes;
- unique symbols;
- independent date/episode clusters;
- regime strata;
- deduped PRICE_OHLC effective evidence count.

Repeated dates of one root are not independent replication.

## 4. Coverage

For every symbol/date/regime cohort report:
- eligible;
- evaluable;
- data blocked;
- no opportunity;
- missing.

Coverage failures cannot disappear from the denominator.

## 5. Holdout discipline

Record:
- holdoutId;
- holdoutFirstOpenedAt;
- holdoutUseCount;
- prospectiveFlag.

Repeated OOS use converts holdout information into development information.

Follow canonical D16 holdout governance.

## 6. Regime discipline

Consume only ex-ante canonical regime receipts.

Pattern performance may not define the favorable regime.

## 7. Residual incrementality

Even successful G4/G5 Pattern evidence must still be tested against:
- direct PRICE_OHLC baselines;
- overlapping D02/D03 families;
- common-parent residual controls.

This remains required under SDA-001.

## 8. No-lookahead

All roots/episodes entering economic replication must be replay-safe under SDA-002.

A large hindsight-labeled sample is not valid generalization evidence.

## 9. Promotion boundary

D01 does not open outcomes or assign economic robustness levels.

D16 owns outcome inference.
00 owns audit closure.
Formal Core remains LOCKED.
