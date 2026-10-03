# D01 DL-019 — Lifecycle State vs Continuous Path Redundancy V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## 1. Research question

PATTERN-RG2 currently stores categorical lifecycle states such as:
- LOCAL_BREAK_STILL_BELOW_PARENT
- LOCAL_BREAK_ENTERED_PARENT_ZONE
- LOCAL_BREAK_AND_PARENT_FIRST_BREAK
- LOCAL_BREAK_PARENT_HOLDING_ABOVE
- LOCAL_BREAK_PARENT_REENTERED
- LOCAL_BREAK_PARENT_FAILED

D01 now asks a stricter question before any outcome join:

Does the categorical lifecycle representation contain information that is not already represented by continuous geometry/path/clock descriptors?

This is a redundancy question, not an alpha test.

## 2. First separation: current geometry vs path memory

A current snapshot such as:
- availableAirToParentLowerPct;
- distanceLocalToParentCenterPct;
- current signed close distance;
- parent-zone position

does NOT fully determine path-dependent lifecycle.

Counterexample:
Path A and Path B can end at the same current close / same parent-zone distance while:
- A never broke the parent zone;
- B broke above it, reentered, then reclaimed.

Therefore lifecycle state can contain path memory relative to a current-geometry-only baseline.

This is genuine representation novelty relative to geometry-only state.

It is NOT new raw market-source information.

## 3. Second separation: full continuous path basis vs categorical lifecycle

Once the basis includes:
- firstConfirmedBreakAt;
- firstParentZoneEntryAt;
- parentFirstBreakAt;
- parentFirstOrdinaryObservableAt;
- parentFirstPostBreakOutsideCloseAt;
- parentFirstReentryAt;
- parentFirstFailureAt;
- parentFirstReclaimAt;
- eligible / observable / constrained bars since break;
- current signed distance from boundary;
- max favorable extension;
- max adverse excursion;
- cumulative signed distance;
- zone age;
- availableAir;

the categorical lifecycle state is largely a deterministic or thresholded summary of that same path.

Therefore:

LIFECYCLE_CATEGORY != NEW_SOURCE_INFORMATION.

The future empirical question is only:
does the categorical representation improve predictive modeling beyond a sufficiently flexible continuous path basis?

## 4. Frozen redundancy ladder

C0_GEOMETRY_ONLY
- current availableAir;
- current local-to-parent distance;
- current signed close distance;
- zone age;
- current zone relation.

C1_CONTINUOUS_PATH
- C0 plus breakout-path descriptors:
  eligible/observable/constrained bars,
  max favorable extension,
  max adverse excursion,
  cumulative signed distance.

C2_CLOCK_COMPLETE_PATH
- C1 plus first break / entry / reentry / failure / reclaim clocks
  and exact eligible-session timing.

C3_CATEGORICAL_LIFECYCLE
- C2 plus geometryRelationState / compoundLifecycleState / canonical parent lifecycle state.

Primary redundancy interpretation:
- C3 vs C0 may show path-memory representation value.
- C3 vs C1 may show first-event-clock compression value.
- C3 vs C2 tests whether the category adds anything beyond the full causal path basis.

The promotion-grade lifecycle claim requires C3 incremental value over C2, not merely over C0.

## 5. Linear-baseline trap

A categorical state can appear useful against a weak linear model simply because it encodes nonlinear thresholds and interactions.

Example:
FAILED_PARENT may approximately mean:
- firstBreak exists;
- current close is below lower zone;
- firstFailure clock exists;
- reentry/failure chronology has occurred.

A one-hot category can approximate this nonlinear interaction more easily than a linear additive model.

Therefore:

C3 beating LINEAR(C2) is insufficient evidence of new information.

Future D16 validation must compare against at least one flexible continuous-basis specification capable of nonlinear effects/interactions.

D01 does not choose the final estimator.

## 6. Information interpretation classes

NO_NEW_SOURCE_INFO
- lifecycle is derived from the same PRICE_OHLC / continuity root.

PATH_MEMORY_RELATIVE_TO_GEOMETRY_ONLY
- state cannot be reconstructed from current snapshot geometry alone.

DETERMINISTIC_SUMMARY_OF_COMPLETE_PATH_BASIS
- state is reconstructible from complete clocks/path and current location.

REPRESENTATION_NONLINEARITY_CANDIDATE
- category may help a restricted model but does not prove independent information.

PREDICTIVE_INCREMENTALITY_UNKNOWN
- only future preregistered OOS/common-support analysis may resolve predictive value.

## 7. Falsification rules

Reject lifecycle as an independent challenger if:
1. C3 adds no stable value beyond C2;
2. C3 only beats a linear C2 model but not a flexible continuous-basis comparator;
3. performance depends on post-outcome state regrouping;
4. neighboring lifecycle labels are merged/split after outcomes;
5. effect vanishes after D02 acceptance / volatility / regime / liquidity controls;
6. effect is concentrated in a few symbols/episodes/dates;
7. category advantage disappears under episode-holdout or non-overlapping-date sensitivity.

If rejected:
retain lifecycle for explanation / audit / visualization,
not for scoring or promotion.

## 8. Why categories are still useful

Even if predictive incrementality is zero, lifecycle states remain useful for:
- causal audit;
- operator explanation;
- event-study indexing;
- transition-event identity;
- coverage diagnostics;
- failure/reclaim chronology;
- readable System2 UI.

Explainability value does not equal alpha value.

## 9. External evidence interpretation

Henderson et al. (2026), Finance and Stochastics,
"The support and resistance line method: an analysis via optimal stopping"
models support/resistance logic as explicitly path-dependent regime switching.

D01 interpretation:
current distance alone can be insufficient; history of boundary interaction matters.

General statistical guidance on continuous predictors consistently warns that arbitrary categorization loses information and can create unstable step-function effects.

D01 interpretation:
keep continuous path descriptors as the primary information basis; categories are compressed representations that must prove residual value rather than replace the continuous basis by default.

## 10. Outcome firewall

No market outcomes are inspected in DL-019.

No lifecycle grouping is changed based on returns.

No N-bar acceptance threshold is introduced.

No category sign is assigned.

No score / rank / gate / signal / capital / push behavior changes.

## 11. Current decision

LIFECYCLE_SOURCE_NOVELTY = NONE.
LIFECYCLE_PATH_MEMORY_VS_GEOMETRY_ONLY = YES_BY_CONSTRUCTION.
LIFECYCLE_INCREMENTALITY_VS_COMPLETE_CONTINUOUS_PATH = UNKNOWN.
CATEGORICAL_CHALLENGER_STATUS = PREREGISTERED_ONLY.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 12. Exact next continuation

1. Build an outcome-blind reconstructability helper:
   determine whether a lifecycle state is recoverable from C0, C1, or C2 basis.
2. Create adversarial pairs with identical current geometry but different path histories.
3. Create adversarial pairs with identical complete path basis and verify lifecycle cannot legitimately differ.
4. Freeze D16 handoff:
   C3 must be evaluated against flexible C2, not only linear C2.
5. Preserve all prospective/runtime blockers.
6. No outcome join / no R09 / no Formal change.
