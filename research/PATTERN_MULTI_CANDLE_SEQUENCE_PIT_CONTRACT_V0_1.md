# D01 DL-083 — Multi-Candle Sequence Grammar / Overlap Dedup Contract V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / D01_03_PIT_CONTRACT / FORMAL_CORE_LOCKED

## Purpose

Replace named multi-candle pattern lists with an explicit sequence grammar over completed normalized bars.

## Sequence object

Preserve:
- sequenceId
- sourceBarIds
- startAt
- endAt
- firstObservableAt
- barCount
- relativeBodyRelations
- relativeRangeRelations
- gapRelations
- overlapRelations
- closeProgression
- highLowProgression
- directionSequence
- structuralContext
- predictorFreezeAt
- replaySafe

## Pattern aliases

Engulfing, harami, morning/evening star, three-soldiers/crows and similar names are deterministic aliases of sequence relations.

Same sourceBarIds imply same PRICE_OHLC root unless a distinct non-price root is introduced.

## Overlapping-window dedup

Sliding windows can generate many highly overlapping patterns:
bars 1-3, 2-4, 3-5.

Freeze:
- sourceBarOverlapRatio
- parentEpisodeId
- redundancyGroup

High-overlap windows do not automatically count as independent events.

## Confirmation leakage

If a three-bar pattern is only known after bar 3 closes, it cannot be used at bar 2.
A later confirming bar cannot backfill the pattern's earlier start time.

## Failure lifecycle

Preserve:
- sequence formed
- sequence confirmed
- sequence invalidated
- sequence unresolved

Do not retain only successful completed patterns.

## Comparator

G0 RAW_N_BAR_NORMALIZED_GEOMETRY
G1 NAMED_SEQUENCE_ALIAS
G2 GEOMETRY_PLUS_CONTEXT

Pattern names must beat the raw sequence representation under common support and multiplicity control.

## D16 ladder

S0 NAMED_SEQUENCE_RAW_RESULT
S1 SOURCE_BAR_LINEAGE_RECONSTRUCTED
S2 OVERLAPPING_WINDOWS_DEDUPED
S3 FIRST_OBSERVABLE_CLOCK_VALIDATED
S4 FAILED_UNRESOLVED_SEQUENCES_RETAINED
S5 RAW_N_BAR_GEOMETRY_COMPARATOR
S6 CONTEXT_CONTROLLED
S7 MULTIPLE_PATTERN_TESTING_CONTROLLED
S8 OOS_INCREMENTALITY
S9 NAME_INCREMENTAL_OR_PRESENTATION_ONLY

## Current decision

SEQUENCE_NAME_EQUALS_INDEPENDENT_ALPHA = FALSE.
OVERLAPPING_WINDOWS_EQUAL_INDEPENDENT_SAMPLES = FALSE.
PATTERN_START_TIME_EQUALS_FIRST_OBSERVABLE_TIME = FALSE.
FAILED_SEQUENCES_MAY_BE_DROPPED = FALSE.
D01_03_PIT_DATA_CONTRACT = FEASIBLE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Level implication

The module now has explicit source-bar lineage, sequence grammar, PIT observability, failure denominator and redundancy controls sufficient for L3 PIT-feasibility classification, subject to tracker governance.
