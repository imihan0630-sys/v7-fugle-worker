# D01 DL-077 — Multi-Timeframe Structural Aliasing Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MULTISCALE_ALIAS_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

Prevent the same underlying price path from receiving multiple independent votes merely because it appears on daily, hourly, 15-minute or other aggregated timeframes.

A daily breakout, 60-minute breakout, 15-minute continuation and 5-minute higher-low can be nested representations of one price episode.

## Canonical lineage

Preserve:
- structuralRootId
- structuralEpisodeId
- sourceTradeInterval
- aggregationInterval
- parentAggregationId
- childAggregationIds
- firstObservableAt
- confirmationAt
- predictorFreezeAt
- source/version/hash
- replaySafe

Every multi-timeframe representation must trace back to the underlying eligible trade/session stream.

## Nested alias rule

If two timeframe signals:
- share the same structuralEpisodeId;
- derive from overlapping source trades;
- and contain no independently owned non-price information,

then default:
informationRoot = PRICE_OHLC
effectiveIndependentEvidenceCount = 1.

Different bars do not imply different information.

## Temporal asymmetry

Lower timeframe signals may become observable earlier than higher timeframe confirmations.

Therefore preserve:
- EARLY_CHILD_SIGNAL
- PARENT_NOT_YET_CLOSED
- PARENT_CONFIRMATION_AVAILABLE
- CHILD_CONTINUATION_AFTER_PARENT
- CROSS_TIMEFRAME_CONFLICT

A daily bar cannot be treated as confirmed before its canonical close unless the rule explicitly uses an intraday provisional state.

## Aggregation leakage

Future completed higher-timeframe bars must not backfill an earlier lower-timeframe decision.

Example:
a 15-minute signal at 10:15 cannot use the final daily close at 13:30.

Freeze:
AGGREGATION_CUTOFF_AT_PREDICTOR_FREEZE.

## Conflict is information, not extra vote

If daily structure is bullish and 15-minute structure is bearish, do not sum +1 and -1 mechanically.

First determine whether:
- they describe nested phases of one episode;
- they refer to distinct roots;
- one timeframe is stale;
- one timeframe is incomplete;
- the conflict reflects regime transition.

## Timeframe-selection bias

Choosing the timeframe after seeing which one predicted best is data snooping.

Candidate timeframe sets and aggregation rules must be preregistered.

No BEST_TIMEFRAME_AFTER_OUTCOME.

## D16 ladder

M0 RAW_MULTI_TIMEFRAME_SIGNAL_COUNT
M1 SOURCE_TRADE_LINEAGE_RECONSTRUCTED
M2 EPISODE_IDENTITY_MATCHED
M3 AGGREGATION_OVERLAP_MEASURED
M4 FIRST_OBSERVABLE_CLOCK_VALIDATED
M5 INCOMPLETE_PARENT_BAR_BLOCKED
M6 TIMEFRAME_SELECTION_PREREGISTERED
M7 RAW_VS_DEDUP_SIGNAL_COMPARISON
M8 DISTINCT_ROOT_EXCEPTION_TESTED
M9 CONFLICT_STATE_CLASSIFIED
M10 SAME_EPISODE_COMMON_SUPPORT
M11 OOS_MULTISCALE_INCREMENTALITY
M12 MULTISCALE_RESIDUAL_CANDIDATE

## Interpretation states

Q0 NESTED_TIMEFRAME_ALIAS
Q1 EARLY_CHILD_TIMING_VALUE
Q2 INCOMPLETE_PARENT_LOOKAHEAD
Q3 DISTINCT_STRUCTURAL_ROOTS
Q4 TIMEFRAME_SELECTION_BIAS
Q5 REGIME_TRANSITION_CONFLICT
Q6 MULTISCALE_RESIDUAL
Q7 NOT_EVALUABLE

## Current decision

MULTIPLE_TIMEFRAMES_EQUAL_MULTIPLE_INDEPENDENT_VOTES = FALSE.
HIGHER_TIMEFRAME_CONFIRMATION_MAY_BACKFILL = FALSE.
BEST_TIMEFRAME_AFTER_OUTCOME_ALLOWED = FALSE.
CROSS_TIMEFRAME_CONFLICT_EQUALS_TWO_INDEPENDENT_SIGNALS = FALSE.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT = 1.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement aggregation-overlap and first-observable classifier.
2. Add adversarial tests for incomplete daily bars, nested 15m/60m/daily aliases, distinct-root exceptions and ex-post timeframe selection.
3. Hand M0-M12/Q0-Q7 to D16.
4. Next D01 science: distinguish genuine structural confluence from geometric coincidence among multiple nearby zones.
