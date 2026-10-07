# D01 DL-078 — Structural Confluence vs Geometric Coincidence Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / CONFLUENCE_TOPOLOGY / FORMAL_CORE_LOCKED

## Purpose

Separate genuine multi-root structural confluence from simple geometric coincidence among price-derived objects.

Nearby prior highs, moving averages, gaps, neckline levels, round numbers and prior swings may cluster near one price. Clustering alone does not prove independent confirmation.

## Canonical objects

For every candidate object preserve:
- objectId
- structuralRootId
- structuralEpisodeId
- informationRoot
- objectFamily
- lowerBound
- upperBound
- firstObservableAt
- predictorFreezeAt
- source/version/hash
- replaySafe

## Merge rule

Two nearby objects become one merged uncertainty object when:
- they share the same information root;
- their zones materially overlap under preregistered topology rules;
- they descend from the same structural episode or one is a deterministic transform of the other.

Merged object preserves all parent lineage.
Merge does not multiply evidence count.

## Split rule

A merged zone can split only if:
- distinct roots become observable independently;
- the split rule was preregistered;
- no future outcome is used to choose the split;
- child zones remain traceable to parent lineage.

## Genuine confluence candidate

Confluence can only be considered structurally distinct when at least two roots are independently generated under owner-certified lineage.

Examples potentially distinct:
- price structure plus independently owned liquidity context;
- price structure plus independently owned event/fundamental context.

Examples not automatically distinct:
- prior high plus neckline derived from same price sequence;
- moving average plus momentum plus breakout from same OHLC history;
- round number plus price cluster without independent mechanism evidence.

## Topology metrics

Preserve:
- overlapTicks
- overlapBps
- overlapVolatilityUnits
- centerDistanceTicks
- unionWidthTicks
- intersectionWidthTicks
- rootCount
- effectiveIndependentRootCount

No arbitrary CONFLUENCE_SCORE is frozen.

## D16 ladder

C0 RAW_CONFLUENCE_COUNT
C1 OBJECT_LINEAGE_RECONSTRUCTED
C2 SAME_ROOT_OBJECTS_DEDUPED
C3 ZONE_OVERLAP_TOPOLOGY_CONTROLLED
C4 MERGE_SPLIT_RULE_PREREGISTERED
C5 DISTINCT_ROOTS_CERTIFIED
C6 PRICE_ONLY_CONFLUENCE_REMOVED
C7 NONPRICE_ROOT_INCREMENTALITY_TESTED
C8 RAW_VS_EFFECTIVE_ROOT_COUNT_COMPARED
C9 OOS_CONFLUENCE_INCREMENTALITY
C10 MERGE_SPLIT_SENSITIVITY
C11 STRUCTURAL_CONFLUENCE_RESIDUAL_CANDIDATE

## Interpretation states

Q0 SAME_ROOT_GEOMETRIC_COINCIDENCE
Q1 DETERMINISTIC_TRANSFORM_COINCIDENCE
Q2 TOPOLOGICAL_MERGE
Q3 GENUINE_DISTINCT_ROOT_CANDIDATE
Q4 MERGE_SPLIT_SELECTION_BIAS
Q5 STRUCTURAL_CONFLUENCE_RESIDUAL
Q6 NOT_EVALUABLE

## SDA

This directly advances SDA-001 by replacing raw confluence count with effective independent root count.

SDA-002 remains active because merge/split and root certification must be predictor-time safe.

## Current decision

RAW_CONFLUENCE_COUNT_EQUALS_INDEPENDENT_EVIDENCE_COUNT = FALSE.
ZONE_OVERLAP_EQUALS_DISTINCT_CONFIRMATION = FALSE.
SAME_PRICE_HISTORY_MAY_CREATE_MULTIPLE_VOTES = FALSE.
EX_POST_MERGE_SPLIT_ALLOWED = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Implement topology overlap and root-dedup classifier.
2. Add adversarial tests for prior-high/neckline alias, moving-average/breakout alias, distinct non-price root and ex-post split.
3. Hand C0-C11/Q0-Q6 to D16.
4. Next D01 science: cluster-level topology persistence and zone migration through time without treating moving zones as new independent roots.
