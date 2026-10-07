# D01 DL-087 — L3-to-L4 Prospective/OOS Validation Portfolio Preregistration V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / L4_PREREGISTRATION / FORMAL_CORE_LOCKED

## Purpose

Define one common Taiwan point-in-time empirical validation protocol for all 11 D01 modules before any new historical outcome join.

Tracker meaning:
L4 = PROSPECTIVE_SHADOW_OR_OOS_EVIDENCE.

This tranche does not promote any module to L4. It freezes the protocol required before such promotion can be considered.

## Universe

Primary research universe:
- Taiwan listed ordinary common equities with point-in-time listing status;
- include delisted/failed histories where data are available;
- exclude ETF, warrant, preferred/special share and non-common-equity instruments from the primary D01 equity-pattern inference;
- preserve suspension, disposition and changed-trading-method states rather than silently deleting them.

Formal System-1 selection filters such as price and liquidity thresholds are evaluated only as a secondary deployment-sensitivity layer, not baked into the primary scientific universe.

## Point-in-time data contract

Required at every predictor freeze:
- symbol/listing identity;
- raw OHLC and trade/session status;
- corporate-action receipt;
- suspension/resumption receipt;
- price-limit/reference-price state;
- disposition/matching-regime state where applicable;
- source/version/hash;
- firstObservableAt;
- predictorFreezeAt;
- replaySafe.

Unknown mandatory state => DATA_BLOCKED, not imputed normality.

## Module families

F01 session/bar semantics
F02 single-candle morphology
F03 multi-candle sequence
F04 support/resistance topology
F05 breakout/failure lifecycle
F06 W/M double-top/bottom
F07 cup/base/handle
F08 VCP/contraction
F09 gaps/price-limit patterns
F10 multi-timeframe consistency
F11 target/resistance/RR geometry

All representations preserve informationRoot and redundancyGroup.

## Primary outcome families

A. Structural reaction endpoint
- next eligible interaction with preregistered zone/root;
- bounce/cross/invalidation state;
- no-revisit retained.

B. Forward return endpoint
- next 1 eligible session;
- next 5 eligible sessions;
- next 20 eligible sessions.

C. Path-risk endpoint
- MFE and MAE over the same frozen horizons.

D. Economic endpoint
- executable return only when owner-certified cost/slippage receipt exists;
- otherwise gross economic endpoint remains descriptive and executable endpoint = DATA_BLOCKED.

The 1/5/20-session horizons are frozen jointly and are not optimized per pattern.

## Benchmarks / controls

Every pattern-specific claim must beat a simpler common-parent control.

Examples:
- F02: normalized raw single-bar OHLC geometry;
- F03: raw normalized N-bar sequence geometry;
- F04: matched non-structural price zones;
- F05: raw breakout distance/path state;
- F06: matched swing/neckline geometry;
- F07: prior trend + range compression + generic breakout;
- F08: generic realized-volatility/range contraction;
- F09: raw gap + market/sector/event/limit controls;
- F10: deduped single-root price state;
- F11: gross geometry before stop/target-family enrichment.

No named-pattern alpha claim without common-parent incrementality.

## Chronological validation

Freeze:
- expanding-window walk-forward only for primary validation;
- minimum initial train span: 3 complete years when available;
- test span: 1 complete year per fold;
- purge/embargo: at least the maximum 20-session outcome horizon across train/test boundaries;
- final untouched holdout: most recent complete 1-year block available after all specification work;
- no tuning on final holdout.

If history is insufficient:
NOT_EVALUABLE rather than shortened hindsight-friendly windows.

## Multiplicity

Primary multiplicity control:
- hierarchical Benjamini-Yekutieli FDR across correlated hypotheses within D01 families.

Secondary robustness:
- Superior Predictive Ability / Reality-Check-style family comparison where the implementation is owner-certified by D16.

Every attempted parameter/template variant must be counted in the search registry.

## Cost handling

Gross statistical edge and executable economic edge are separate gates.

Execution-cost assumptions must be:
- timestamp/versioned;
- owner-certified by D10/execution domain;
- sensitivity-tested;
- never reverse-engineered to preserve profitability.

## Promotion gate to L4

A module can be proposed for L4 only if:
1. PIT replay passes;
2. deterministic adversarial tests pass;
3. at least one preregistered OOS or prospective Shadow endpoint is complete;
4. common-parent incremental comparator is available;
5. multiplicity control passes or result is explicitly INCONCLUSIVE/REFUTED;
6. failures/no-revisit/data-blocked cases remain in denominator;
7. effect does not depend on a tiny extreme subset;
8. no post-holdout tuning occurred.

Positive return alone is insufficient.

## Allowed conclusions

SUPPORTED
REFUTED
INCONCLUSIVE
NOT_EVALUABLE

NO_WINNER is valid and preferred over forced ranking.

## Priority order

First empirical wave:
- D01-02
- D01-03
- D01-07
- D01-09

Reason:
these are the four modules most recently promoted from L2 to L3 and therefore have fresh PIT contracts with no historical/OOS promotion evidence yet.

Second wave:
- D01-04
- D01-05
- D01-06
- D01-08
- D01-10
- D01-11

D01-01 supplies common session/data semantics to all waves.

## Current decision

L3_EQUALS_L4 = FALSE.
HISTORICAL_IN_SAMPLE_EDGE_EQUALS_OOS_EVIDENCE = FALSE.
NAMED_PATTERN_BEATS_RAW_PARENT_BY_DEFAULT = FALSE.
FINAL_HOLDOUT_MAY_BE_TUNED = FALSE.
NO_WINNER_ALLOWED = TRUE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. DL-088: Taiwan PIT empirical-data readiness audit for first-wave modules D01-02/03/07/09.
2. Resolve exact historical coverage, delisting/listing membership, session-status, corporate-action, suspension, price-limit and disposition receipt availability.
3. Freeze executable dataset manifest before outcome join.
4. If coverage gates pass, hand the first wave to D16 for OOS execution under this protocol.
5. No L4 promotion until evidence exists.
