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
- no pagination hint appears;
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
