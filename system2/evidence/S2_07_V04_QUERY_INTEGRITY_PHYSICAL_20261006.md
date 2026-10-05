# S2-07 V0.4 Per-Symbol Query-Integrity Physical Receipt

Date: 2026-10-06 Asia/Taipei
Lane: BUILD_LANE
Status: RESEARCH_ONLY / DIAGNOSTIC
System 1 Formal Core: LOCKED

## Execution
- commit: `bf94fcd267c0f87ca42df24935a4be5052247ac6`
- workflow: `System2 Bounded Revision Query Integrity V0.4 Readonly`
- run: `37376748993`
- job: `111987637837`
- conclusion: success

## Physical result
- EXACT_KEYSET_RECONCILIATION: 1 — 3591
- MONTH_SHARD_SUPERSET: 6 — 6949, 5381, 6241, 8937, 5904, 4747

All-query snapshots were stable across repeated observations. The six MONTH_SHARD_SUPERSET cases therefore remain unresolved for negative-history claims because month shards expose rows absent from the stable all-query.

## Safety boundary
No revision completeness, cancellation completeness, NO_EVENT, exact knownAt, technical continuity, session completeness, or trading authority is promoted.

Normalized subject stem remains non-authoritative supporting evidence only. Promotion-grade linkage requires event-specific disambiguation tied to official source event identity and episode-specific evidence.
