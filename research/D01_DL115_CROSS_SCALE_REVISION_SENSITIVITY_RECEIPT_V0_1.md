# D01 DL-115 — Cross-Scale Revision Sensitivity Receipt V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / CROSS_SCALE_REVISION_SENSITIVITY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze one outcome-blind receipt that reports how a source correction propagates through daily and derived higher-timeframe D01 representations.

This receipt measures representation stability, not economic performance.

## Receipt identity

Required:
- auditId;
- sourceVintageFrom;
- sourceVintageTo;
- primitiveRevisionRootIds;
- symbol;
- predictor/asOf date;
- semantic space;
- aggregationDefinitionVersions;
- detectorVersions;
- outcomeFieldsPresent=false.

## Per-scale rows

For each scale:
- timeframe;
- aggregationMode;
- derivedPeriodKey;
- constituentDateSetHash old/new;
- derivedBarHash old/new;
- R7 receipt/hash old/new if evaluable;
- featureState old/new;
- episodeId old/new;
- firstObservableAt old/new;
- revisionChangeClass;
- primitiveRevisionRootIds.

## Aggregate metrics

Report:
- primitiveRevisionRootCount;
- derivedBarRebuildCount;
- derivedBarChangedCount;
- R7ReplayedCount;
- R7RepresentationChangedCount;
- scaleCountObserved;
- rawRevisionRepresentationCount;
- effectiveIndependentRevisionRootCount.

Must satisfy:
effectiveIndependentRevisionRootCount <= primitiveRevisionRootCount.

No rule may set effectiveIndependentRevisionRootCount = rawRevisionRepresentationCount merely because multiple scales changed.

## Stability descriptors

ALL_SCALES_UNCHANGED_AFTER_REBUILD
SOME_SCALES_CHANGED
ALL_OBSERVED_SCALES_CHANGED
WINDOW_MEMBERSHIP_CHANGED
CONTINUITY_SPACE_REVISION_CHANGED
DATA_BLOCKED

These are descriptive only.

## Required stratification

Report separately by:
- primitive revision family;
- RAW_EXECUTION vs TECHNICAL_CONTINUITY;
- aggregation mode;
- D01 module.

Do not pool raw and continuity spaces.

## Downstream D16 handoff

If later OOS results are studied, attach:
- primitiveRevisionRootCount;
- cross-scale revision sensitivity state;
- source-vintage IDs;
- changed-scale set.

This allows D16 to test whether apparent pattern performance is fragile to source revision without double-counting multiple scales.

## Current decision

CROSS_SCALE_REVISION_SENSITIVITY_RECEIPT = FROZEN.
MULTI_SCALE_CHANGED_COUNT_IS_NOT_ALPHA = TRUE.
PRIMITIVE_ROOT_COUNT_AND_REPRESENTATION_COUNT_ARE_SEPARATE = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic oracle/tests for aggregation fanout, root dedup and cross-scale sensitivity.
2. Keep physical R1-R7 blocked until owner receipts arrive.
3. Do not raise D01 maturity from source-governance progress alone.
