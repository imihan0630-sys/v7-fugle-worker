# System 2 S2-07 MOPS Repeated-Capture Union Stability V1.7

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner  
Status: RESEARCH_ONLY / APPEND_ONLY_PROVENANCE_REPAIR  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Purpose

Continue from accepted V1.6 after three genuine prospective captures proved two facts simultaneously:

1. exact-version payload identity is stable when a version is returned;
2. historical MOPS query membership is not stable enough for any single capture to be the expected-keyset oracle.

The three-capture readback also found a concrete implementation defect: V1.6 recomputes `firstObservedAt` on every capture instead of preserving the earliest genuine observation across immutable receipts.

V1.7 repairs that provenance layer without promoting completeness or trading authority.

## Append-only union

The union is keyed by V1.6 stock-code-scoped global `versionKey`.

For every exact version V1.7 preserves:

- immutable payload hash;
- stock code and source-reported clock;
- earliest `firstObservedAt = min(all genuine observedAt)`;
- separate `latestObservedAt = max(all genuine observedAt)`;
- every capture in which the version appeared;
- every capture in which the version was absent;
- every observed source query reference and query-path class.

A later capture may extend the union but may never delete an already observed version or replace its earliest observation time.

## Absence semantics

A missing row in a later historical query is **membership drift**, not proof that the version never existed.

Therefore every union version freezes:

`absenceMeansNonexistence=false`.

Versions observed prospectively in an earlier receipt remain in the append-only union even when the current capture does not return them.

## Payload conflict rule

The same global `versionKey` with a different exact-version payload hash is a hard blocker:

`CROSS_CAPTURE_PAYLOAD_CONFLICT`.

Stable payload identity may not be generalized into stable population membership.

## Query-path classification

Every observation preserves its V1.6 `sourceQueryRef`.

V1.7 classifies the path as:
- `MONTH` for month-shard observations;
- `ANNUAL` for annual-all queries;
- `OTHER/UNKNOWN` otherwise.

This lets the system localize churn without treating source-path absence as economic or corporate-action information.

## Stabilization candidate

V1.7 implements a conservative **research-only candidate gate**:

- at least 4 captures;
- at least 2 identical trailing capture-to-capture transitions;
- zero provenance/payload conflicts;
- stable event-universe identity;
- correct earliest/latest observation preservation.

Passing this gate yields only:

`MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_CANDIDATE`.

It does **not** automatically authorize `expectedMopsKeysetComplete=true`. Source semantics and the owner completeness gate remain separate.

## Physical execution

The dedicated read-only workflow:

1. downloads the three already accepted immutable V1.6 artifacts;
2. runs a fresh fourth V1.6 live capture;
3. reconciles all four receipts into one append-only V1.7 union;
4. verifies earliest-observed preservation, payload identity and query-path drift;
5. uploads a V1.7 physical receipt.

Historical artifact IDs used for the initial physical bridge:
- 11451296954;
- 11451716945;
- 11451992365.

No Cron, D1/R2 mutation, Worker deployment, selection, notification or order path is introduced.

## Locked downstream gates

V1.7 always keeps false:

- sourceSemanticsCertified;
- monthShardCoverageComplete;
- expectedMopsKeysetComplete;
- noRevisionGapThroughCut;
- preParentEvidenceCutReady;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- strategy/selection/push/capital/order authority.

## Exact continuation

After V1.7 physical acceptance:

1. persist the accepted union receipt as the durable next-capture seed;
2. continue bounded repeated captures without overwriting earliest observation clocks;
3. require stabilization evidence across the configured trailing window;
4. independently resolve month-shard/source semantics;
5. only after both provenance stability and source semantics pass may an expected MOPS keyset be frozen;
6. bind that keyset with V1.5 source-lane manifest into the V1.4.1 pre-parent cut;
7. post-parent reconcile and require `noRevisionGapThroughCut=true` before symbol-session / TECHNICAL_CONTINUITY promotion.
