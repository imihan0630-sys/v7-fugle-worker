# D01 DL-114 — Revision-Root Lineage and Cross-Scale Dedup Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / REVISION_ROOT_DEDUP_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent one low-level correction from creating multiple apparent confirmations merely because the same corrected price history is represented at several scales.

## Revision lineage graph

Node types:
- PRIMITIVE_SOURCE_REVISION;
- DERIVED_BAR_REVISION;
- R7_REPRESENTATION_REVISION;
- CONTEXT_RECEIPT_REVISION.

Edges:
- DERIVED_FROM_PRIMITIVE_REVISION;
- DERIVED_FROM_DERIVED_BAR;
- AFFECTS_R7_REPRESENTATION;
- SHARES_SOURCE_REVISION_ROOT.

Every downstream revision preserves the full primitiveRevisionRootId set.

## Independent revision accounting

For one parent decision:
- rawDerivedRevisionCount = number of changed derived bars / pattern receipts;
- primitiveRevisionRootCount = number of unique primitive source revisions;
- effectiveIndependentRevisionRootCount = primitiveRevisionRootCount by default.

It is prohibited to infer:
3 revised timeframes = 3 independent new facts.

## Multi-root revisions

A weekly/monthly aggregate can be affected by several corrected daily bars.

Then:
primitiveRevisionRootCount may be >1.

This still does not establish predictive independence.
It only counts distinct source-correction roots.

If multiple primitive roots come from one higher-level authority correction episode:
preserve authorityEpisodeId / corporateActionEventKey so D16 can avoid treating an administrative batch as independent replications.

## Scale topology

Daily / weekly / monthly / rolling representations derived from the same PRICE_OHLC constituents remain in the same PRICE_OHLC information family.

Cross-scale agreement after revision may reveal:
- robustness of representation;
- sensitivity to aggregation;
- topology persistence.

It does not create extra alpha votes.

## Revision-induced confluence trap

Example:
one corrected daily high causes:
- daily breakout state change;
- weekly candle label change;
- monthly resistance geometry change.

These are three representation changes from one primitive price correction.

The correct diagnostic is:
rawRepresentationRevisionCount=3
effectiveIndependentRevisionRootCount=1

unless additional independent source roots exist.

## Duplicate versus nested revision edges

EXACT_REVISION_DUPLICATE
- same primitive root set and same source bar set.

NESTED_REVISION_ROOT
- one representation's primitive root set is a subset of another.

OVERLAPPING_REVISION_ROOT
- root sets overlap partially.

DISJOINT_REVISION_ROOT_CANDIDATE
- no primitive roots overlap.

Even DISJOINT_REVISION_ROOT_CANDIDATE is not automatically independent predictive information; it only means distinct correction roots.

## Current decision

REVISION_FANOUT_IS_NOT_NEW_INFORMATION = TRUE.
CROSS_SCALE_REVISION_DEDUP_USES_PRIMITIVE_ROOTS = TRUE.
PRICE_OHLC_INFORMATION_ROOT_REMAINS_SHARED = TRUE.
D16_OWNS_ANY_FUTURE_INCREMENTALITY_CLAIM = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
