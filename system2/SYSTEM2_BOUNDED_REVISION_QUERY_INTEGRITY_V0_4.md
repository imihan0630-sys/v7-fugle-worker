# System 2 Bounded Revision Query Integrity V0.4

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / QUERY-INTEGRITY DIAGNOSTIC
Lane: BUILD_LANE
System 1 Formal Core: LOCKED

## Purpose

Diagnose the seven V0.3 symbols where the MOPSOV company-year `month=all` keyset did not exactly reconcile with the union of month shards over the same bounded pre-effective interval.

Targets: 3591, 6949, 5381, 6241, 8937, 5904, 4747.

For each symbol the readonly probe collects:
- three independent `month=all` snapshots around the month-shard scan;
- the bounded month-shard union;
- transport and visible-pagination checks;
- exact date/time/seqNo keyset differences;
- row samples for one-sided keys.

## Diagnostic states

- EXACT_KEYSET_RECONCILIATION
- ALL_QUERY_NONDETERMINISTIC
- MONTH_SHARD_SUPERSET
- ALL_QUERY_SUPERSET
- BIDIRECTIONAL_KEYSET_MISMATCH
- PAGINATION_HINT_OBSERVED
- TRANSPORT_NOT_READY

No state establishes revision completeness, exact knownAt, NO_EVENT, technical continuity, session completeness, or trading authority.

## Next step

Use the physical mismatch type to decide whether the per-symbol integrity gate can be repaired by a stable query contract or must remain unresolved. Event-specific linkage disambiguation remains a separate gate and cannot be inferred from query-integrity alone.
