# System 2 S2-07 MOPS Exact-Version Population V1.6

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner  
Status: RESEARCH_ONLY / PROSPECTIVE_EXACT_VERSION_CAPTURE  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Purpose

Continue from V1.5's physically READY eight-lane whole-source cut into the separate MOPS disclosure-version identity domain required by V1.4.1.

The frozen research scope remains the 23 low-volume corporate-action events across 23 unique symbols for 2026-04-05..2026-10-02:
- TWSE capital reduction: 9;
- TWSE par-value change: 1;
- TPEx capital reduction: 9;
- TPEx par-value change: 4.

V1.6 captures exact MOPS disclosure versions prospectively and gives each version immutable content identity. It does **not** certify the complete expected MOPS keyset.

## Global MOPS version identity

The historical MOPS parser exposes a local source-clock tuple:

`date | time | seqNo`.

That tuple is not globally unique across companies. V1.6 therefore freezes:

`globalVersionKey = SHA256(sourceHost + stockCode + sourceReportedAt + seqNo)`

rendered as:

`S2-MOPS-V:<64-hex>`.

The original date/time/seq key remains preserved as `sourceClockVersionKey`, but it is explicitly forbidden as the cross-symbol global identity.

## Exact-version payload hash

For each prospective version V1.6 hashes the canonical parsed row content:
- stock code;
- displayed date/time;
- sequence number;
- hidden source date/time;
- TYPEK;
- correction/cancellation hint;
- normalized parsed row text.

This is an exact-version canonical content hash, not a whole-page hash.

Same global version key + changed content hash is a hard provenance conflict.

## Prospective clock

Every accepted row requires:
- a valid certified source-reported clock;
- an actual current `observedAt`;
- `observedAt >= sourceReportedAt`;
- `firstObservedAt = observedAt` for the first current observation.

No current observation can be backdated into an earlier historical parent.

## Physical source queries

The physical probe:
1. rebuilds the frozen 23-event universe from the four exact official result lanes;
2. for each unique issuer, reads MOPS annual history plus month shards from 400 days before the official effective date through 2026-10-07;
3. filters strict issuer-owned action-family rows;
4. creates exact-version prospective observations from the month-shard union;
5. compares annual vs month-shard version populations and payload hashes;
6. preserves month-only, year-only and payload-divergence evidence.

The month-shard union is used as the more inclusive **observed** prospective population, but V1.6 deliberately leaves:
- `sourceSemanticsCertified=false`;
- `monthShardCoverageComplete=false`;
- `expectedMopsKeysetComplete=false`.

This preserves the already-observed V0.6 fact that some par-value rows are month-only.

## Readiness semantics

V1.6 may reach:

`PROSPECTIVE_MOPS_EXACT_VERSION_POPULATION_CAPTURED_COMPLETENESS_PENDING`

only when:
- frozen event distribution remains 9/1/9/4;
- all 23 symbols have query diagnostics;
- annual and month-shard transport succeed;
- the month-shard population has no pagination hint; annual-page pagination remains diagnostic because month sharding is the completeness-oriented path;
- every frozen symbol has at least one eligible action-family exact version;
- no exact-version payload conflict exists.

This state proves a genuine prospective exact-version capture, not exhaustive source completeness.

## Remaining gates

V1.6 must keep false:
- sourceSemanticsCertified;
- monthShardCoverageComplete;
- expectedMopsKeysetComplete;
- noRevisionGapThroughCut;
- preParentEvidenceCutReady;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- all strategy/selection/push/capital/order authority.

No Cron, D1/R2 mutation, Worker deploy or System1 runtime is added.

## Exact continuation

After physical V1.6:
1. inspect annual/month-shard divergences and source-clock collisions;
2. certify or reject month-shard completeness semantics without discarding month-only versions;
3. freeze the complete expected MOPS global-version keyset only after source semantics pass;
4. bind that keyset plus V1.5's source-lane manifest into the V1.4.1 pre-parent cut;
5. post-parent run bounded-complete two-point reconciliation;
6. only after `noRevisionGapThroughCut=true` bind symbol-session and technical-continuity receipts.

## 2026-10-07 S2-07 MOPS Exact-Version Population V1.6 — PHYSICAL PASS / MEMBERSHIP STABILITY BLOCKED

Implementation:
- PR #749 merged as `bc405245870d6e986cbbf709562ce93c320bb327`;
- superseded PR #742 was closed after its successful physical result was retained as an earlier prospective observation;
- latest-main dedicated V1.6 run `37548011614` / job `112556594405`: PASS;
- System2 Research CI `37548011621`: PASS;
- V8 Regression `37548011620`: PASS;
- latest artifact `11451716945`, digest `sha256:691e66ec3f279ef969b605ff8361052f4bc8c85d5b95655876b643d23786341a`.

Latest physical capture:
- frozen event scope = 23 events / 23 unique symbols;
- stable semantic event-universe hash = `b7941323ed1969a17697bc58be3d549b7e244f4dfc45b81a0bc6d5645fc305b0`;
- global MOPS version identity includes stock code + source-reported clock + seqNo;
- 161 unique global exact-version keys observed;
- all 23 frozen symbols covered;
- annual/month-shard exact keyset = 21/23 events;
- year-only versions = 7;
- month-only versions = 0;
- source-clock key collision count = 0;
- divergent latest-run events: 1441 (1 year-only) and 3086 (6 year-only);
- common annual/month versions have no payload-hash mismatch.

Repeated-capture falsification:
- prior successful V1.6 run `37547303476` / artifact `11451296954` observed 159 versions, 17/23 exact events, 9 month-only and 8 year-only;
- latest successful run observed 161 versions, 21/23 exact events, 0 month-only and 7 year-only;
- between successful runs, latest gained 9 exact-version identities and lost 7;
- common version payload mutation count = 0;
- therefore exact-version content identity is stable where the version is returned, but historical query membership is not stable enough to freeze the complete expected MOPS keyset from one capture.

Identity clarification:
- legacy V0.1 eventUniverseHash `3e31779c36582bd70378d4b393ce0d4b2510bb84fe557686a0e51d3a2f604049` included capture-specific `eventVersionId`;
- V1.6 `stableEventUniverseHash` intentionally hashes stable semantic event fields only and is not expected to equal the legacy receipt-bound hash.

Authority boundary remains locked:
- `sourceSemanticsCertified=false`;
- `monthShardCoverageComplete=false`;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preParentEvidenceCutReady=false`;
- symbol-session completeness=false;
- technical continuity=false;
- no scheduler/Cron, history mutation, selection/final-selection, push, capital or order authority;
- System1 runtime unused; Formal Core unchanged.

Durable evidence:
`system2/evidence/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. implement repeated-capture exact-version union/stability reconciliation;
2. preserve the earliest observed-at upper bound across immutable receipts, never overwrite it with a later run;
3. classify membership drift by source query path and exact version;
4. require bounded repeated-capture stabilization before any complete expected MOPS keyset freeze;
5. only then bind the MOPS keyset with the accepted V1.5 eight-lane source manifest into the V1.4.1 pre-parent cut;
6. post-parent reconcile and require `noRevisionGapThroughCut=true` before symbol-session / technical-continuity binding.



## 2026-10-08 BUILD_LANE fourth prospective capture trigger

Purpose: trigger exactly one new genuine read-only MOPS exact-version prospective capture from the current canonical implementation for V1.7 repeated-capture stabilization.

Constraints:
- prior three accepted captures remain immutable prior evidence and are not reclassified as new evidence;
- earliest observed-at provenance may not be overwritten;
- absent-from-latest union members may not be deleted;
- sourceReportedAt is not promoted to exact availableAt;
- one new capture cannot by itself freeze `expectedMopsKeysetComplete` unless the separate bounded-stabilization/source-semantics gates pass;
- no scheduler, strategy, selection, push, capital, order, System1 runtime or Formal Core authority is added.

Requested output: one new V1.6 physical artifact suitable as capture #4 input to the accepted V1.7 append-only union.
