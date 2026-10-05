# System 2 S2-07 Event-Specific Linkage V0.5

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE DIAGNOSTIC
System 1 Formal Core: LOCKED

## Purpose

Continue from V0.4 without treating whole-company material-information mismatch as corporate-action incompleteness.

V0.5:
1. reconciles company-year vs month-shard history only after issuer-scope + target action-family filtering;
2. preserves target-family discrepancies separately, including a distinct periodic-notice-only divergence diagnostic;
3. uses official exchange subtype/detail plus issuer chronology to construct event-specific anchor candidates;
4. searches for positive correction/cancellation evidence inside the semantic episode candidate only.

## Capital-reduction episode disambiguation

Where the official source gives a subtype:
- 退還股款 -> RETURN_CAPITAL;
- 彌補虧損 -> LOSS_OFFSET.

The issuer chronology is seeded from a subtype-aligned disclosure, preferring the matching corporate-decision row. Rows from older episodes, subsidiaries, treasury-stock reductions, restricted-stock reductions and bond-conversion notices are not allowed to create the event-specific candidate for a different episode.

## Par-value events

Par-value events remain action-family scoped. Repeated notice rows are retained as evidence. A year/month mismatch consisting only of recurring announcement-period copies is labeled diagnostically but is not silently discarded or promoted to complete.

## Promotion boundary

eventSpecificAnchorCandidate=true is diagnostic only. It is not promotion-grade linkage.

V0.5 never claims:
- revision completeness;
- NO_EVENT;
- no-cancellation from absence;
- exact knownAt;
- technical continuity;
- session completeness;
- trading authority.

Normalized subject stem is not a sufficient episode key.
