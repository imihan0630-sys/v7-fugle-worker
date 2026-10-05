# S2-07 Bounded Revision Event Linkage Physical Receipt

Date: 2026-10-05 Asia/Taipei
Lane: BUILD_LANE
Status: RESEARCH_ONLY / DIAGNOSTIC
System 1 Formal Core: LOCKED

## Authoritative execution

- Commit: `fc3eac9e35fe6eacf8fef9805e6578ed91fe1701`
- Workflow: `System2 Bounded Revision Event Linkage V0.2 Readonly`
- Run: `37287352394`
- Job: `111689298076`
- Workflow conclusion: success
- Unit test step: PASS
- Physical probe step: PASS
- Read-only isolation guard: PASS

## Physical result

- eventCount = 23
- REVISION_CHAIN_OBSERVED = 6
- AMBIGUOUS_MULTIPLE_ACTION_GROUPS = 15
- AMBIGUOUS_MULTIPLE_VERSION_CHAINS = 2
- resolvedCount = 6
- ambiguousCount = 17

Flags retained false:
- eventLinkageCoverageComplete
- boundedRevisionHistoryCoverageComplete
- correctionHistoryComplete
- cancellationHistoryComplete
- knownAtVersionClockCertified
- revisionCoverageComplete

## Semantic boundary

The six observed revision chains are bounded diagnostic evidence only. Seventeen events remain unresolved / ambiguous. This receipt does not establish revision completeness, NO_EVENT, exact knownAt, technical continuity, session completeness, or any trading authority.

A missing cancellation row is not negative proof of no cancellation.

Normalized subject stem is an unsafe sole episode key: the same issuer may have multiple corporate-action episodes whose disclosure titles normalize to the same or similar stems. Promotion-grade linkage therefore requires an event-specific anchor / disambiguation layer in addition to any subject text similarity.

## Exact continuation

17 ambiguous events -> per-symbol query-integrity -> event-specific linkage disambiguation -> cancellation/no-cancellation evidence -> shared suspension/resumption + symbol-session integration -> RAW A1 lineage.
