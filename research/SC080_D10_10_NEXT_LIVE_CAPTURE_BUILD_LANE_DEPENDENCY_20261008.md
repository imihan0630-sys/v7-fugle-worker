# SC-080 D10-10 Next Live Capture BUILD_LANE Dependency Request — 2026-10-08

Status: CROSS_LANE_DEPENDENCY_REQUEST / RESEARCH_ONLY / NO_TRADING_AUTHORITY / FORMAL_CORE_UNCHANGED
Requester: 07｜產業與供應鏈研究室
Consumer module: D10-10 供應鏈事件PIT時間戳
Engineering owner: System2 BUILD_LANE
Observed main before write: f73ee06d3e9ac256b3c80039577d99234cdab62f

## Existing accepted seed

Use the accepted V1.7 append-only union as the only starting seed.
Frozen seed: captureCount=3; unionVersionKeyCount=168; latestCaptureVersionKeyCount=163; unionMissingFromLatestCount=5; payloadConflictCount=0; earliestObservedPreserved=true; latestObservedPreserved=true; trailingIdenticalTransitions=0; boundedStabilizationCandidate=false.
Accepted evidence: system2/evidence/S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7_PHYSICAL_20261007.json

## Requested engineering delta

Add exactly the next genuine live MOPS exact-version capture against the durable 168-version union seed.
Do not redownload/reclassify the first three captures as new evidence.
Do not reuse the superseded PR-head fourth capture as final-code acceptance.
Do not overwrite earliest firstObservedAt.
Do not delete union members absent from the latest query.
Do not promote sourceReportedAt to exact availableAt.
Do not freeze expectedMopsKeysetComplete from one additional capture unless its separate gate actually passes.
Do not change System1 Formal Core, strategy, selection, push, capital or order authority.

## Required returned receipt

Return final merged implementation identity, workflow run/job/artifact id and digest, captureCount>=4, current observedAt, latest capture version-key count, append-only union count, union missing-from-latest count, membership delta, payloadConflictCount, earliest/latest preservation, trailingIdenticalTransitions, stable event-universe identity, boundedStabilizationCandidate, query-path drift, and expected-keyset status.

## Room07 acceptance

Workflow green alone is insufficient.
Accept only a genuine new capture with incremented captureCount, append-only provenance preserved, zero payload conflict and no authority expansion.
If membership still drifts, preserve that as valid negative evidence.

## L4 boundary

This dependency alone does not promote D10-10 to L4.
Room07 will reassess trailing stability, expected-keyset readiness, source/month-shard semantics and real-event-plus-NULL coverage after the returned receipt.

Formal Core unchanged.
