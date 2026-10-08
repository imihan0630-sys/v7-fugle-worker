# D01 DL-109 — Corporate-Action Registry Revision Causality Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / CA_REGISTRY_REVISION_CAUSALITY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Classify what a later corporate-action registry revision means for an older D01 historical predictor snapshot.

The key distinction is not merely whether the archive changed.
The key distinction is when the corrected information was actually knowable.

## Revision classification

### R0 — DUPLICATE_SEMANTIC_OBSERVATION

Later capture repeats the same:
- eventKey;
- semanticHash;
- effective date;
- outcome state;
- continuity effect;
- knowledge-time semantics.

Effect:
no change to PIT predictor state.
Old R7 remains valid and immutable.

### R1 — PREEXISTING_PUBLIC_INFORMATION_BACKFILL

A newer archive introduces an event/row that was missing from the research archive, but independent source evidence proves:
firstKnownAt <= original predictor cutoff.

Interpretation:
the market could have known it then; the research data pipeline missed it.

Effect:
- original R4/R7 research receipt is DATA_PIPELINE_INCOMPLETE;
- old receipt remains immutable;
- corrected replay is required;
- prior OOS result using the incomplete archive cannot be treated as clean;
- if outcomes were already inspected, the corrected replay belongs to consumed-development analysis unless an untouched independent holdout still exists.

This is not ordinary future information leakage.
It is historical data incompleteness.

### R2 — LATE_PUBLIC_CORRECTION

The official correction/revision became available only after the original predictor cutoff:
firstKnownAt > predictor cutoff.

Effect:
- old PIT predictor must not contain the correction;
- original PIT receipt may remain PIT-valid if its contemporaneous archive/knowledge evidence was complete;
- current best-known truth may differ;
- later correction can be studied only in current-truth/sensitivity views for that historical cutoff.

A late correction cannot be backdated.

### R3 — LATE_CANCELLATION_OR_SUPERSESSION

An event was contemporaneously valid at the predictor cutoff but later cancelled or superseded.

Effect:
- historical PIT_VIEW keeps the then-current event version;
- current best-known view may show cancelled/superseded;
- old R7 cannot be rewritten to pretend the cancellation was already known.

### R4 — EFFECTIVE_DATE_CORRECTION_WITH_PREEXISTING_KNOWLEDGE

Later archive representation changes effectiveDate, but evidence proves the corrected effective date was publicly available before the predictor cutoff and the old archive parsed/stored it incorrectly.

Effect:
PIPELINE_ERROR_REQUIRES_CORRECTED_REPLAY.

### R5 — EFFECTIVE_DATE_CORRECTION_DISCLOSED_LATE

Correct effective date was only published after predictor cutoff.

Effect:
old PIT view retains the version actually knowable at cutoff.
No backdating.

### R6 — CONTINUITY_EFFECT_REVISION

Any change to split/par-value/right/dividend/capital-reduction transformation semantics.

Must classify knowledge time:
- known before cutoff -> pipeline repair;
- known after cutoff -> late correction;
- unknown -> block.

### R7 — COVERAGE_OR_AUTHORITY_UPGRADE_ONLY

Source owner later proves:
- bounded revision coverage;
- authority routing;
- empty-range semantics;
- parser completeness;
without changing the event semantic set for the window.

This may upgrade current evidence confidence.

But it may not retroactively certify the old receipt unless the proof establishes that the original archive/window itself satisfied the required bounded completeness at the original decision/research freeze.

Current certification date alone is not historical completeness.

## Completeness provenance rule

A statement like revisionCoverageComplete=true is versioned evidence.

It must bind:
- interval;
- required source lanes;
- authority source set;
- parser versions;
- revision-history cutoff;
- generatedAt/observedAt;
- knownAt semantics.

Do not use a 2026 completeness receipt as if it were a 2021-known market fact.

However:
completeness proof used for retrospective data-quality validation is allowed if it certifies the historical archive mechanics rather than adding predictor information.

The distinction must be explicit:
PREDICTOR_INFORMATION versus DATASET_VALIDATION_EVIDENCE.

## Corporate-action event identity

Reuse canonical System2 semantics:
- immutable eventVersionId;
- semanticHash;
- supersedesVersionId;
- observedAt;
- firstKnownAt;
- availableAt;
- outcomeState;
- effectiveDate;
- continuityEffect;
- actualResultVerified.

D01 consumes these fields.
D01 does not construct a second corporate-action archive.

## Replay disposition

For each revision, emit exactly one:

NO_REPLAY_NEEDED
CORRECTED_REPLAY_REQUIRED_PIPELINE_ERROR
PIT_VIEW_UNCHANGED_LATE_CORRECTION
PIT_VIEW_UNCHANGED_LATE_CANCELLATION
CURRENT_TRUTH_ONLY_UPDATE
BLOCKED_UNKNOWN_KNOWLEDGE_TIME

## Holdout implication

If a pipeline error is discovered after final-holdout outcomes were inspected:
- corrected replay may diagnose data-quality impact;
- it does not reset the final holdout to untouched;
- a fresh independent holdout/prospective period is required for a new clean confirmatory claim unless D16/00 explicitly approves a predefined error-correction policy.

## Current decision

LATE_CORRECTION_CAN_BE_BACKDATED = FALSE.
PREEXISTING_PUBLIC_BACKFILL_IS_PIPELINE_ERROR = TRUE.
CURRENT_TRUTH_EQUALS_HISTORICAL_PIT_VIEW = FALSE.
CURRENT_COMPLETENESS_CERTIFICATE_RETROACTIVELY_EQUALS_OLD_PIT_INFORMATION = FALSE.
Formal Core remains LOCKED.
