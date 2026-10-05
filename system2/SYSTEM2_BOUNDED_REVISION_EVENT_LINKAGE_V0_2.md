# System 2 Bounded Revision Event-to-Version Linkage V0.2

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / EVENT LINKAGE DIAGNOSTIC
System 1 Formal Core: LOCKED

## Purpose

Advance the frozen 23-event low-volume census into event-to-issuer-version linkage without prematurely claiming revision-history completeness.

For each final-result event, classify the observed issuer action-family rows into:
- REVISION_CHAIN_OBSERVED;
- CANCELLATION_CHAIN_OBSERVED;
- SINGLE_VERSION_NO_REVISION_HINT_QUERY_SUPPORTED;
- AMBIGUOUS_MULTIPLE_VERSION_CHAINS;
- AMBIGUOUS_MULTIPLE_ACTION_GROUPS;
- QUERY_INTEGRITY_NOT_SUPPORTED;
- NO_PRE_EFFECTIVE_ACTION_FAMILY_ROWS.

## Query-integrity support

A negative no-revision classification is allowed only when:
- both company-year queries are transport-ready;
- parser completed;
- no pagination hint was observed;
- the maximum yearly row count does not exceed the already physically verified MOPSOV high-row source-contract envelope of 391 rows.

This is source-contract-supported negative evidence, not exact per-symbol month-shard reconciliation.

Any ambiguous event remains unresolved and must be targeted by a narrower follow-up probe.

## Linkage rule

Issuer rows are grouped by a conservative normalized subject stem after removing disclosure boilerplate and explicit correction labels.

A revision chain requires:
- at least one original row;
- at least one correction row;
- at least two distinct date/time/seqNo versions.

Cancellation is tracked separately and never inferred from the absence of a correction.

## Promotion boundary

V0.2 may establish eventLinkageCoverageComplete only when every bounded event is classified into a resolved linkage state.

It does not by itself set:
- boundedRevisionHistoryCoverageComplete;
- correctionHistoryComplete;
- cancellationHistoryComplete;
- exact public knownAt;
- revisionCoverageComplete.

The next gate uses unresolved events to decide where direct month-shard or authority-side follow-up is necessary.


## Physical execution freeze — run 37287352394

The readonly workflow on commit `fc3eac9e35fe6eacf8fef9805e6578ed91fe1701` completed successfully and produced:
- eventCount: 23;
- REVISION_CHAIN_OBSERVED: 6;
- AMBIGUOUS_MULTIPLE_ACTION_GROUPS: 15;
- AMBIGUOUS_MULTIPLE_VERSION_CHAINS: 2;
- resolvedCount: 6;
- ambiguousCount: 17.

All completeness / exact-clock flags remain false: `eventLinkageCoverageComplete`, `boundedRevisionHistoryCoverageComplete`, `correctionHistoryComplete`, `cancellationHistoryComplete`, `knownAtVersionClockCertified`, and `revisionCoverageComplete`.

Promotion caution: normalized subject stem alone must never be used as sufficient evidence that two rows belong to the same corporate-action episode. Any future promotion-grade linkage must add an event-specific anchor / disambiguation layer.
