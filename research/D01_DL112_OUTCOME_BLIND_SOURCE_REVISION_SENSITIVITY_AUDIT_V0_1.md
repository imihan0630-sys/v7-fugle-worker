# D01 DL-112 — Outcome-Blind Source-Revision Sensitivity Audit V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / REVISION_SENSITIVITY_PROTOCOL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Measure how much a source-vintage correction changes D01 pattern representations before any future return is opened.

This is a data/representation fragility audit.
It is not an alpha test.

## Required paired replay

For every affected opportunity, replay both:
- OLD_VINTAGE_VIEW;
- NEW_VINTAGE_VIEW.

Both replays must use:
- the same detector family/version unless the revision itself requires a separately versioned detector;
- the same experiment family;
- the same predictor-date target;
- the same module;
- the same outcome-closed state.

No future returns are joined.

## Required per-opportunity comparison fields

- opportunityId;
- moduleId;
- oldSourceVintageId;
- newSourceVintageId;
- oldSourceHistoryHash;
- newSourceHistoryHash;
- oldExactSessionHash;
- newExactSessionHash;
- oldFeatureState;
- newFeatureState;
- oldCanonicalR7PayloadHash;
- newCanonicalR7PayloadHash;
- oldEpisodeId;
- newEpisodeId;
- oldFirstObservableAt;
- newFirstObservableAt;
- oldConfirmedAt;
- newConfirmedAt;
- oldInformationRoot;
- newInformationRoot;
- oldRedundancyGroup;
- newRedundancyGroup;
- revisionImpactClass.

## Outcome-free change classes

UNCHANGED_REPRESENTATION
- feature state / episode / payload / clocks unchanged.

VALUE_ONLY_CHANGE_SAME_STATE
- structure state and episode remain the same;
- deterministic feature values change.

FEATURE_STATE_CHANGE
- NO_STRUCTURE / STRUCTURE_EMITTED / DATA_BLOCKED changes.

EPISODE_IDENTITY_CHANGE
- structural episode/root changes.

CLOCK_CHANGE
- firstObservableAt or confirmedAt changes.

WINDOW_IDENTITY_CHANGE
- exact eligible session set changes.

NEWLY_EVALUABLE
- old DATA_BLOCKED becomes evaluable after pipeline repair.

NO_LONGER_EVALUABLE
- new evidence shows prior opportunity should have been blocked.

UNKNOWN_BLOCKED
- migration lineage incomplete.

## Aggregate sensitivity metrics

Report continuously:
- affectedOpportunityCount;
- unchangedRepresentationCount;
- valueOnlyChangeCount;
- featureStateChangeCount;
- episodeIdentityChangeCount;
- clockChangeCount;
- windowIdentityChangeCount;
- newlyEvaluableCount;
- noLongerEvaluableCount;
- old/new denominator hashes.

Also report rates over the complete affected denominator.

Do not choose an arbitrary threshold such as 5% or 10% to declare robustness after seeing the counts.

## Module stratification

Report separately for:
- D01-02;
- D01-03;
- D01-07;
- D01-09.

Why:
a corporate-action continuity revision can affect long-window cup/base geometry far more than one-bar candle geometry.

Pooling all modules may conceal concentrated fragility.

## Revision-family stratification

Report separately by upstream family:
- R1 membership/security identity;
- R2 price history;
- R3 session lifecycle;
- R4 corporate-action continuity;
- R5 legal reference/limit context;
- R6 disposition/matching context.

Do not use the most stable family to excuse a fragile family.

## Episode migration matrix

For each old/new vintage pair report counts:
- same episode;
- split;
- merge;
- new episode;
- dropped episode;
- unresolved.

Do not map episodes using outcome quality.

## Interpretation

A high representation-change rate means:
- historical pattern representation is sensitive to archive quality/version;
- economic performance, if later observed, must be interpreted with that fragility visible.

A low representation-change rate means:
- representation appears stable to this particular revision family/window.

Neither result proves predictive alpha.

## D16 handoff

D16 receives revision-sensitivity metadata alongside OOS evidence:
- sourceVintageId;
- revisionImpactClass;
- representationChangeClass;
- denominator migration.

This supports sensitivity/robustness analysis without allowing D16 to reconstruct hidden source history.

## Current decision

REVISION_SENSITIVITY_MUST_BE_MEASURED_BEFORE_OUTCOME_INTERPRETATION = TRUE.
REPRESENTATION_STABILITY_EQUALS_ALPHA = FALSE.
MODULE_AND_REVISION_FAMILY_STRATIFICATION_REQUIRED = TRUE.
ARBITRARY_POST_HOC_ROBUSTNESS_THRESHOLD = PROHIBITED.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
