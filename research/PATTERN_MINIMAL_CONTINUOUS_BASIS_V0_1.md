# D01 DL-020 — Pattern Minimal Continuous Path Basis V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ANTI_FACTOR_ZOO / FORMAL_CORE_LOCKED

## 1. Purpose

DL-019 requires lifecycle category C3 to beat a flexible continuous path basis C2.

Before that comparison is valid, C2 itself must not become a Factor Zoo.

This document freezes an outcome-blind semantic basis for Pattern path/lifecycle information.

It is:
- a dependency/de-dup ontology;
- not a PCA basis;
- not a claim of statistical orthogonality;
- not a score;
- not an alpha model.

## 2. PB1 — IMMUTABLE_BOUNDARY_GEOMETRY

Canonical source primitives:
- localLower / localUpper;
- parentLower / parentUpper;
- boundary/relation versions;
- semantic space;
- current decision-time close when legitimately available;
- ATR / price scale only as external normalization inputs.

Derived views:
- parentCenter if midpoint-defined;
- availableAirToParentLowerPct;
- distanceLocalToParentCenterPct;
- availableAirToParentLowerATR;
- geometryRelationState.

Rule:
these derived views do not become independent votes beside their source coordinates.

## 3. PB2 — PATH_EXCURSION / OCCUPANCY

Canonical continuous summaries:
- maxFavorableExtensionPostBreak;
- maxAdverseExcursion;
- cumulativeSignedDistanceFromBoundary;
- currentSignedCloseDistanceFromBoundary.

Optional retained diagnostic:
- break-bar-inclusive max favorable extension,
  only when break-bar-specific excursion is not otherwise reconstructible.

Do not add:
- average signed distance if cumulative distance + observable count already exist;
- multiple monotone normalizations of the same excursion as independent factors.

## 4. PB3 — OBSERVABILITY / EXPOSURE CLOCK

Canonical primitives:
- observableBarsSinceBreak;
- constrainedBarsSinceBreak;
- exact eligible-session date-set commitment;
- sourceBarsThrough.

Derived:
eligibleBarsSinceBreak = observableBarsSinceBreak + constrainedBarsSinceBreak
when every eligible bar is exactly one of observable or constrained under the frozen contract.

Therefore eligible / observable / constrained are not three independent features.

Observability is a validity/exposure dimension, not directional alpha by default.

## 5. PB4 — FIRST-EVENT CLOCKS

Canonical first clocks:
- localFirstBreakAt;
- firstParentZoneEntryAt;
- parentFirstBreakAt;
- parentFirstOrdinaryObservableAt;
- parentFirstPostBreakOutsideCloseAt;
- parentFirstReentryAt;
- parentFirstFailureAt;
- parentFirstReclaimAt.

Nested semantics:
- failure is a severe subtype of reentry;
- same-bar failure may share one source event group with reentry;
- reclaim does not erase prior reentry/failure;
- constrained break separates structural event clock from ordinary observability clock.

Derived durations:
- barsToReentry;
- barsToFailure;
- barsToReclaim;
- timeAbove;
- event ages.

These durations should be reconstructed from certified eligible-session ordinals + first clocks when possible rather than treated as independent source fields.

## 6. PB5 — STRUCTURAL IDENTITY / EPISODE AGE

Canonical primitives:
- relationEpisodeKey;
- localBoundaryId/version;
- parentZoneId/version;
- initial confirmed clocks;
- parentZoneAgeEligibleSessions;
- structural episode age where separately defined.

Identity/age is distinct from current price displacement.

It remains a context dimension, not automatically directional.

## 7. PB6 — DERIVED LIFECYCLE REPRESENTATION

Derived categorical views:
- geometryRelationState;
- canonical parent lifecycle;
- compoundLifecycleState;
- falseBreakoutState;
- transition labels.

These are Level-2/Level-3 representations of PB1-PB5.

They remain useful for:
- explanation;
- audit;
- UI;
- event indexing;
- transition study.

They are not primitive source dimensions.

## 8. Deterministic dependency rules

Frozen exact/nested relations:

D1:
eligibleBarsSinceBreak =
observableBarsSinceBreak + constrainedBarsSinceBreak
under complete certified exposure accounting.

D2:
parentCenter =
(parentLower + parentUpper) / 2
when midpoint semantics apply.

D3:
availableAirToParentLowerPct =
(parentLower - localUpper) / localUpper.

D4:
distanceLocalToParentCenterPct =
(parentCenter - localUpper) / localUpper.

D5:
availableAirToParentLowerATR =
(parentLower - localUpper) / ATR_asOf.

D6:
geometryRelationState is deterministic from local/parent zone coordinates.

D7:
barsToReentry/failure/reclaim are derived from certified session ordinals and first-event clocks.

D8:
compoundLifecycleState is a derived path representation when clocks + current location are complete.

D9:
failure and reentry labels on the same source close are semantically nested, not two independent confirmations.

D10:
multiple normalization units of one numerator are scaling alternatives / interactions, not source multiplicity.

## 9. Minimal predictive-basis candidate

For future D16 sensitivity, D01 preregisters one minimal continuous basis candidate:

MCPB_V0_1:
- one canonical current geometry displacement representation;
- maxFavorableExtensionPostBreak;
- maxAdverseExcursion;
- cumulativeSignedDistanceFromBoundary;
- observableBarsSinceBreak;
- constrainedBarsSinceBreak;
- first-event clock bundle or derived certified event ages;
- parentZoneAgeEligibleSessions;
- required validity/receipt references.

Choice of exact nonlinear estimator remains D16-owned.

Derived category fields are excluded from MCPB itself.

## 10. Full-C2 vs minimal-C2

Future lifecycle inference must report both:

FULL_C2:
all non-outcome complete path/clock descriptors frozen prospectively.

MINIMAL_C2:
MCPB_V0_1 with deterministic aliases removed.

Interpretation:
- C3 beats neither => categorical lifecycle redundant for prediction;
- C3 beats FULL_C2 only impossible under valid nesting and indicates model/specification issue;
- C3 beats MINIMAL_C2 but not FULL_C2 => compressed convenience / omitted continuous detail;
- C3 beats flexible FULL_C2 robustly => representation incrementality candidate requiring strong falsification.

No case creates new source novelty.

## 11. Cross-lane de-dup

Do not duplicate:
- D02 acceptance/persistence;
- D03 trend/indicator path states;
- D04 volatility primitives;
- Corporate Actions continuity/session validity;
- Target-RR target construction.

Pattern basis only owns structural geometry/path/lifecycle semantics.

## 12. Current decision

PATTERN_MINIMAL_CONTINUOUS_BASIS = FROZEN_V0_1.
C2_FACTOR_ZOO_EXPANSION = REJECTED.
DETERMINISTIC_DERIVED_FIELDS = NON_INDEPENDENT_BY_DEFAULT.
LIFECYCLE_CATEGORY = DERIVED_REPRESENTATION.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 13. Exact next continuation

1. Encode PB1-PB6 and D1-D10 into a machine-readable dependency graph.
2. Add pure dependency-audit tests for deterministic aliases/nested labels.
3. Hand FULL_C2 + MINIMAL_C2 dual sensitivity to D16.
4. Do not prune causal audit fields from prospective storage merely because they are excluded from a predictive minimal basis.
5. Keep runtime/outcome blockers unchanged.
