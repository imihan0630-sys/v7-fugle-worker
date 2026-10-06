# System 2 S2-07 MOPS Repeated-Capture Stability V1.6.1

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner  
Status: RESEARCH_ONLY / REPEATED_CAPTURE_STABILITY  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Why V1.6.1 exists

V1.6 physically proved that exact-version content identity can be hashed safely, but two successful runs minutes apart did not return the same historical MOPS membership:

- first successful capture: 159 exact versions;
- second successful capture: 161 exact versions;
- second-minus-first: 9 versions;
- first-minus-second: 7 versions;
- common exact-version payload mutations: 0.

Therefore a single successful query cannot be treated as a complete expected MOPS keyset.

## Repeated-capture contract

V1.6.1 reconciles two or more immutable prospective captures under the same stable event-universe hash.

For every global exact-version key it preserves:
- immutable payload hash;
- earliest observed-at across all receipts;
- latest observed-at;
- capture count in which the version appeared;
- whether it appeared in every capture.

For every adjacent capture pair it computes:
- added version keys;
- removed version keys;
- membership-stable / drift state.

A later capture is never allowed to overwrite an earlier observation clock.

## Hard blockers

Reconciliation is blocked when:
- any input capture is not ready;
- stable event-universe hashes differ;
- capture timestamps duplicate;
- exact-version identity/hash/clock is invalid;
- the same global version key has different payload hashes across captures.

## Tail stability

V1.6.1 defines a configurable repeated-capture tail requirement. The default research requirement is three consecutive captures with identical membership.

Even when the tail is stable, V1.6.1 still does **not** certify:
- source semantics;
- month-shard completeness;
- complete expected MOPS keyset;
- noRevisionGapThroughCut.

Stability is necessary evidence, not sufficient evidence.

## Physical probe

The dedicated workflow reconstructs the frozen 23-event / 23-symbol low-volume universe once, then performs two full prospective month-shard passes across the event-specific 400-day windows through 2026-10-07.

Each pass requires:
- all month-shard transport ready;
- no pagination hint;
- all 23 frozen symbols represented by at least one strict issuer-owned action-family exact version;
- no within-capture payload conflict.

The two passes are then reconciled by the V1.6.1 contract.

Both physical outcomes are acceptable research results:
- membership drift observed; or
- pair stable but more captures required.

Neither outcome may promote trading authority.

## Authority boundary

V1.6.1 keeps false:
- sourceSemanticsCertified;
- monthShardCoverageComplete;
- expectedMopsKeysetComplete;
- noRevisionGapThroughCut;
- preParentEvidenceCutReady;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- selection/final-selection/push/capital/order authority.

No Cron, D1/R2 mutation, Worker deploy or System1 runtime is added.

## Exact continuation

After physical V1.6.1:
1. retain the union population and earliest-observed clock;
2. continue repeated captures until a bounded stable tail exists or instability is structurally characterized;
3. separately resolve source semantics for versions that appear/disappear by query path;
4. only after both stability and source semantics pass may a complete expected MOPS keyset be frozen;
5. then bind to the V1.5 source-lane cut and proceed to post-parent no-revision-gap reconciliation.
