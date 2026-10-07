# D01 DL-107 — Outcome-Locked D16 First-Wave Handoff V0.1

Updated: 2026-10-08 Asia/Taipei
Status: D16_HANDOFF_READY / OUTCOME_JOIN_CLOSED / AWAITING_PHYSICAL_R1_R7 / FORMAL_CORE_LOCKED

## Purpose

Freeze the complete D01-to-D16 statistical handoff before any first-wave outcome rows are opened.

D16 should not need to invent:
- universe;
- fold boundaries;
- horizons;
- parent comparators;
- denominator policy;
- redundancy handling;
- detector-version search handling;
after seeing returns.

## First-wave modules

- D01-02 single-candle morphology
- D01-03 multi-candle sequence
- D01-07 cup/base/handle
- D01-09 gap / price-limit patterns

## Dataset chronology

Bounded TWSE research manifest:
- 2018 = warmup only;
- train 2019-2021, test 2022;
- train 2019-2022, test 2023;
- 2024 = untouched final holdout;
- minimum purge/embargo = 20 eligible sessions;
- no year substitution after outcome access.

Full-Taiwan inference remains separately blocked until TPEx completeness gates pass.

## Outcome families

Frozen horizons:
- 1 eligible session;
- 5 eligible sessions;
- 20 eligible sessions.

Frozen outcome families:
- forward return;
- MFE;
- MAE;
- structural reaction where preregistered;
- executable economic result only when owner-certified cost/slippage treatment exists.

## Common-parent comparators

D01-02:
CONTINUOUS_SINGLE_BAR_OHLC_GEOMETRY.

D01-03:
ORDERED_N_BAR_OHLC_GEOMETRY.

D01-07:
PRIOR_TREND_COMPRESSION_GENERIC_BREAKOUT.

D01-09:
RAW_GAP_PLUS_LEGAL_LIMIT_CONTEXT.

No named-pattern claim is evaluated without its parent on the same support.

## Pairing/common-support rule

Named child and common parent must share:
- universeVersion;
- foldId;
- symbol/date opportunity;
- exactSessionHash;
- sourceHistoryHash;
- predictorFreezeAt;
- blocked-row policy;
- censoring policy;
- outcome horizon;
- transaction-cost treatment;
- detector-version search family.

If support differs:
PAIRING_BLOCKED.

## Denominator states

Every preregistered opportunity remains in one of:
- UPSTREAM_DATA_BLOCKED;
- R7_DATA_BLOCKED;
- NO_STRUCTURE;
- STRUCTURE_EMITTED.

Do not silently complete-case away blocked/no-structure rows.

Lifecycle failures/expired/unresolved states remain in their module denominators.

## Redundancy/dependence input

D16 receives:
- informationRoot;
- redundancyGroup;
- dependency cluster;
- sourceBarIds;
- baseEpisodeId/gapRootId where applicable;
- cross-module redundancy edges.

No raw representation count may be interpreted as independent evidence count.

## Detector-version search accounting

Every detector version/parameter family that was inspected after outcomes:
- belongs to the same search family;
- is counted in multiplicity/search accounting;
- cannot reuse untouched final holdout status.

Implementation-equivalent versions may share identity only if payload, clocks, source identity and denominator state are all equivalent.

## Primary statistical discipline

Inherited from DL-087:
- expanding-window chronological validation;
- hierarchical Benjamini-Yekutieli FDR for correlated D01 hypothesis families;
- SPA / Reality-Check-style robustness only when D16 implementation is owner-certified;
- final 2024 holdout untouched until final evaluation.

## Allowed conclusions

SUPPORTED
REFUTED
INCONCLUSIVE
NOT_EVALUABLE

NO_WINNER is explicitly valid.

Non-significance is not automatically REFUTED.
Positive in-sample return is not automatically SUPPORTED.

## Promotion gate

No D01 module may be proposed for L4 unless:
1. PIT replay passes;
2. deterministic adversarial tests pass;
3. physical R1-R7 evidence exists;
4. at least one preregistered OOS/prospective endpoint completes;
5. common-parent comparison is available;
6. multiplicity/search is handled;
7. full denominator is preserved;
8. no post-holdout tuning occurred.

## Current state

D16_HANDOFF_SPEC = READY.
PHYSICAL_R1_R7 = PENDING.
OUTCOME_JOIN = CLOSED.
D16_EXECUTION = NOT_STARTED.
L4_PROMOTION = NONE.
Formal Core remains LOCKED.
