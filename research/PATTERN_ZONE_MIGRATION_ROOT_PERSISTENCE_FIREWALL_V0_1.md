# D01 DL-079 — Zone Migration / Root Persistence Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ZONE_MIGRATION_LINEAGE / FORMAL_CORE_LOCKED

## Purpose

Prevent a structurally continuous zone from being reissued as a new independent root merely because its center, width, or representation changes through time.

A support/resistance object can drift, widen, narrow, merge, or split as new predictor-time observations arrive. That evolution must preserve lineage until a preregistered root-renewal rule is satisfied.

## Canonical identity

Preserve:
- structuralRootId
- zoneVersionId
- parentZoneVersionId
- formedAt
- firstObservableAt
- versionObservableAt
- centerPrice
- lowerBound
- upperBound
- widthTicks
- sourceObservationCutoff
- updateMechanism
- predictorFreezeAt
- source/version/hash
- replaySafe

Version change does not imply root change.

## Migration classes

- SAME_ROOT_TRANSLATION
- SAME_ROOT_WIDENING
- SAME_ROOT_NARROWING
- SAME_ROOT_RESHAPE
- SAME_ROOT_MERGE
- SAME_ROOT_SPLIT
- ROOT_INVALIDATED
- NEW_ROOT_CANDIDATE
- MIGRATION_PROVENANCE_UNKNOWN

## Deterministic drift

Moving-window and adaptive transforms can shift mechanically when one old observation leaves and one new observation enters.

Examples:
- rolling moving average drift;
- volatility-scaled zone widening/narrowing;
- rolling quantile changes;
- cluster centroid update;
- execution-distribution center update.

Deterministic transform drift does not create independent information by itself.

## Root renewal test

A new root requires all of:
1. prior root has completed/inactivated under preregistered lifecycle semantics, or explicit coexistence is allowed;
2. a new root-forming observation set exists;
3. the new set is not merely a deterministic re-expression of the same parent observations;
4. firstObservableAt is known at predictor freeze;
5. minimum structural separation is satisfied under preregistered topology;
6. no future outcome is used.

Otherwise preserve structuralRootId and increment zoneVersionId only.

## Migration metrics

Freeze:
- centerShiftTicks
- centerShiftBps
- widthChangeTicks
- overlapRatio
- unionWidthTicks
- intersectionWidthTicks
- parentObservationOverlapRatio
- newObservationShare
- elapsedEligibleSessions

No arbitrary migration-strength score is defined.

## Observation-set lineage

Each zone version preserves the observation IDs that generated it.

If two consecutive versions share nearly all root-forming observations, the burden of proof is on NEW_ROOT_CANDIDATE, not SAME_ROOT.

A rolling update with one new bar is not automatically one new structural root.

## Merge / split lineage

Merge:
- child merged zone preserves all parent root IDs and does not multiply votes.

Split:
- child zones preserve merged-parent lineage;
- split alone does not create new independent evidence;
- new independent root status requires the root-renewal test.

## D16 ladder

G0 RAW_ZONE_VERSION_COUNT
G1 ROOT_VERSION_LINEAGE_RECONSTRUCTED
G2 OBSERVATION_SET_OVERLAP_MEASURED
G3 DETERMINISTIC_TRANSFORM_DRIFT_CONTROLLED
G4 MIGRATION_CLASS_IDENTIFIED
G5 MERGE_SPLIT_LINEAGE_PRESERVED
G6 ROOT_RENEWAL_RULE_PREREGISTERED
G7 FUTURE_OUTCOME_RENEWAL_BLOCKED
G8 RAW_VERSION_VS_EFFECTIVE_ROOT_COUNT_COMPARED
G9 ROOT_RENEWAL_SENSITIVITY
G10 OOS_ZONE_PERSISTENCE_TEST
G11 MIGRATION_RESIDUAL_CANDIDATE

## Interpretation states

Q0 DETERMINISTIC_WINDOW_DRIFT
Q1 VOLATILITY_WIDTH_DRIFT
Q2 CLUSTER_CENTROID_DRIFT
Q3 SAME_ROOT_PERSISTENCE
Q4 MERGE_SPLIT_REPRESENTATION_CHANGE
Q5 GENUINE_NEW_ROOT_CANDIDATE
Q6 ROOT_RENEWAL_SELECTION_BIAS
Q7 MIGRATION_PROVENANCE_UNKNOWN
Q8 NOT_EVALUABLE

## SDA

SDA-001: many zone versions from one root remain one effective price-information root.
SDA-002: root renewal and version creation require replay-safe predictor-time receipts.

## Current decision

ZONE_VERSION_EQUALS_NEW_ROOT = FALSE.
MOVING_WINDOW_DRIFT_EQUALS_NEW_INFORMATION = FALSE.
SPLIT_ZONE_EQUALS_MULTIPLE_INDEPENDENT_ROOTS = FALSE.
MERGED_ZONE_ERASES_PARENT_LINEAGE = FALSE.
EX_POST_ROOT_RENEWAL_ALLOWED = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement migration classifier and observation-overlap root-renewal guard.
2. Add adversarial tests for rolling-window drift, volatility width drift, merge/split lineage, future-outcome renewal and genuinely distinct root formation.
3. Hand G0-G11/Q0-Q8 to D16.
4. Continue DL-080: structural-break/regime-reset interaction, with online-only break receipts and no retrospective reset.
