# D01 DL-084 — Cup/Base/Handle Geometry / Completion-Hindsight Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / D01_07_PIT_CONTRACT / FORMAL_CORE_LOCKED

## Purpose

Convert cup, rounded base and handle patterns from retrospective visual templates into evolving structural episodes.

## Base episode

Preserve:
- baseEpisodeId
- priorTrendReceipt
- baseStartCandidateAt
- leftRimCandidate
- troughCandidate
- rightRimCandidate
- handleCandidateStart
- necklineZone
- depthPct
- durationEligibleSessions
- symmetryMetrics
- curvatureMetrics
- contractionMetrics
- handleDepth
- firstObservableAt
- confirmedAt
- invalidatedAt
- predictorFreezeAt
- status

## Lifecycle

States:
- BASE_CANDIDATE
- LEFT_SIDE_FORMED
- TROUGH_CANDIDATE
- RIGHT_SIDE_DEVELOPING
- RIM_RETEST
- HANDLE_CANDIDATE
- BREAKOUT_CANDIDATE
- CONFIRMED
- FAILED
- EXPIRED
- DATA_BLOCKED

A completed cup cannot be backpainted onto the date of its eventual left edge.

## Flexible-shape firewall

Curvature, symmetry, depth, duration and handle thresholds create a large researcher-degrees-of-freedom surface.

Freeze candidate parameter families before outcomes.
Allow NO_VALID_TEMPLATE.

No ex-post resizing to make a chart "look like" a cup.

## Competing mechanisms

- gradual supply absorption / volatility contraction;
- generic trend continuation;
- mean reversion from oversold depth;
- market/sector trend;
- simple rolling-range compression;
- visual-template overfit.

Cup/base alpha is not assumed beyond simpler controls.

## Comparator

G0 PRICE_TREND_AND_RANGE_COMPRESSION_BASELINE
G1 NORMALIZED_BASE_GEOMETRY
G2 BASE_PLUS_HANDLE_GEOMETRY

Require incremental value beyond prior trend, volatility contraction, range compression and generic breakout.

## D16 ladder

B0 RETROSPECTIVE_TEMPLATE_RESULT
B1 LIFECYCLE_REPLAY_RECONSTRUCTED
B2 FIRST_OBSERVABLE_CLOCK_VALIDATED
B3 PARAMETER_FAMILY_PREREGISTERED
B4 FAILED_EXPIRED_BASES_RETAINED
B5 PRIOR_TREND_CONTROLLED
B6 RANGE_COMPRESSION_CONTROLLED
B7 GENERIC_BREAKOUT_CONTROLLED
B8 SECTOR_MARKET_CONTEXT_CONTROLLED
B9 MULTIPLE_TEMPLATE_TESTING_CONTROLLED
B10 OOS_BASE_INCREMENTALITY
B11 BASE_PATTERN_RESIDUAL_CANDIDATE

## Current decision

COMPLETED_CUP_MAY_BE_BACKPAINTED = FALSE.
VISUAL_SIMILARITY_EQUALS_ALPHA = FALSE.
HANDLE_AUTOMATICALLY_ADDS_INDEPENDENT_VOTE = FALSE.
FAILED_BASES_MAY_BE_DROPPED = FALSE.
D01_07_PIT_DATA_CONTRACT = FEASIBLE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Level implication

The module now has an online lifecycle, failure states, parameter multiplicity controls and point-in-time feature contract sufficient for L3 PIT-feasibility classification, subject to tracker governance.
