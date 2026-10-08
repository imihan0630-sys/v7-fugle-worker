# D01 DL-113 — Cross-Scale Source-Revision Propagation Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / CROSS_SCALE_REVISION_PROPAGATION_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how one primitive daily-source revision propagates into deterministic higher-timeframe bars and cross-scale pattern observations.

This extends the existing rule:
higher-timeframe aggregation of the same PRICE_OHLC root is not a new raw information vote.

New question:
if one daily source row is corrected and that correction changes daily, weekly, monthly or rolling derived bars, how many independent revisions exist?

Answer:
one primitive revision root may fan out into many derived revisions, but fanout count is not independent evidence count.

## Primitive revision root

Each source correction receives:
- primitiveRevisionRootId;
- market;
- symbol;
- primitiveDate;
- oldSourceRowHash;
- newSourceRowHash;
- oldSourceVintageId;
- newSourceVintageId;
- revisionImpactClass;
- knowledge-time classification.

A primitive root represents one lowest-level corrected source fact or one owner-certified atomic source event.

## Derived aggregation lineage

Every derived bar affected by the primitive revision records:
- aggregationReceiptId;
- aggregationDefinitionVersion;
- timeframe;
- aggregationMode;
- derivedPeriodKey;
- orderedConstituentBarIds;
- constituentSourceHistoryHash;
- derivedBarHash;
- primitiveRevisionRootIds;
- firstObservableAt;
- availableAt;
- semanticSpace.

Derived bars never erase primitive lineage.

## Aggregation modes

CALENDAR_WEEK
- each eligible daily bar belongs to one calendar-week aggregate under a fixed calendar/timezone rule.

CALENDAR_MONTH
- each eligible daily bar belongs to one calendar-month aggregate.

ROLLING_N_ELIGIBLE_SESSIONS
- one corrected daily bar may affect multiple rolling windows.
- all affected rolling windows still share the same primitive revision root.

CUSTOM_BOUNDARY
- only allowed when the aggregation boundary definition is preregistered and versioned.

## OHLC propagation

For a fixed aggregate:
- open = first eligible constituent open;
- high = max constituent high;
- low = min constituent low;
- close = last eligible constituent close.

A corrected daily bar does not automatically imply the derived OHLC changed.

Required procedure:
1. rebuild the aggregate from the revised constituent set;
2. recompute the derived bar hash;
3. compare old vs new derived bar;
4. classify changed/unchanged.

Example:
a middle-session close correction that is neither aggregate open, close, high nor low can leave weekly OHLC unchanged.

Therefore:
PRIMITIVE_REVISION_OCCURRED != DERIVED_BAR_CHANGED.

## Session-set revisions

If R1/R3 revision changes the eligible constituent date set:
- aggregation membership must be rebuilt;
- first/last eligible bar may change;
- open/close can change even when individual source prices do not;
- aggregationBoundaryVersion and constituent date-set commitment must be checked.

A changed session set can affect every aggregation scale that contains the changed session boundary.

## Corporate-action continuity revisions

When a TECHNICAL_CONTINUITY transform revision changes one or more daily continuity bars:
- higher-timeframe continuity aggregates must be regenerated from the revised daily continuity space;
- RAW_EXECUTION higher-timeframe aggregates remain separate;
- do not mix raw and continuity constituents inside one aggregate.

One corporate-action revision can therefore fan out across scales while retaining one source-revision lineage family.

## Volume-only revisions

If only daily volume changes and the D01 derived price bar consumes only OHLC:
- price-derived higher-timeframe bar hash may remain unchanged;
- D01 price-pattern replay is not required solely because volume changed;
- D02-owned volume aggregations/context may need replay.

## Clock semantics

Higher-timeframe firstObservableAt is constrained by the last required constituent bar and the timeframe completion rule.

A later source correction does not backdate the corrected aggregate into the old historical predictor.

For historical PIT replay:
- use the vintage legal for that predictor;
- corrected current-truth aggregate is a separate version.

## Cross-scale revision classes

PRIMITIVE_CHANGED_DERIVED_UNCHANGED
PRIMITIVE_CHANGED_DERIVED_CHANGED
SESSION_SET_CHANGED_AGGREGATE_CHANGED
CONTINUITY_REVISION_PROPAGATED
VOLUME_ONLY_PRICE_AGGREGATE_UNCHANGED
AGGREGATION_DEFINITION_CHANGED
UNKNOWN_BLOCKED

## Current decision

ONE_PRIMITIVE_REVISION_MAY_FAN_OUT_TO_MANY_DERIVED_BARS = TRUE.
FANOUT_COUNT_EQUALS_INDEPENDENT_EVIDENCE_COUNT = FALSE.
DERIVED_REPLAY_REQUIRES_ACTUAL_AGGREGATE_OR_MEMBERSHIP_CHANGE = TRUE.
RAW_AND_CONTINUITY_AGGREGATION_SPACES_MUST_NOT_BE_MIXED = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
