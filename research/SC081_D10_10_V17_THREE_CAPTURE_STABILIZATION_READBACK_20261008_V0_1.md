# SC-081 — D10-10 V1.7 Three-Capture Stabilization Readback V0.1

Status: RESEARCH_ONLY / THREE_GENUINE_PROSPECTIVE_CAPTURES_ACCEPTED / APPEND_ONLY_PROVENANCE_REPAIRED / STABILIZATION_NOT_MET / KEEP_L3 / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-10
Date: 2026-10-08 Asia/Taipei
Observed main before write: 018332d67159d2aceea3e524bc55987638b0d2e2

## Purpose

Consume the first post-SC-080 canonical System2 V1.7 physical acceptance and determine whether D10-10 can advance to L4.

## Canonical physical acceptance

System2 V1.7 final merged-head physical acceptance exists.

Accepted implementation:
- PR #772;
- merge commit `14f67ddba88604e73a2488d4a561a571393f026b`;
- final implementation head `5ce2c1bffc514405dd5ce5129f436e0933c37830`;
- dedicated workflow run `37579261319`;
- artifact `11463608550`;
- artifact digest `sha256:4552781daf18eddfb9cd8595a941a144be9c64d394cefd962ee2f7b594280f16`.

Accepted state:
- captureCount = 3;
- unionVersionKeyCount = 168;
- latestCaptureVersionKeyCount = 163;
- unionMissingFromLatestCount = 5;
- earliestObservedPreserved = true;
- latestObservedPreserved = true;
- payloadConflictCount = 0;
- monthOnlyDriftVersionCount = 21;
- trailingIdenticalTransitions = 0;
- boundedStabilizationCandidate = false;
- expectedMopsKeysetComplete = false;
- noRevisionGapThroughCut = false.

## What materially improved

V1.7 repairs the cross-capture provenance defect found in V1.6:
- earliest firstObservedAt is now append-only and preserved as the minimum genuine observed time;
- latestObservedAt is stored separately;
- versions already observed remain in the union even when a later historical query omits them;
- payload identity remains immutable for repeated version keys.

Frozen:
`LATER_REOBSERVATION_CANNOT_OVERWRITE_EARLIEST_OBSERVATION`.

## What did not improve

Population membership is still unstable.

The latest capture omits five versions already observed prospectively, and all current drift remains concentrated in month-query-path evidence.

The frozen stabilization candidate requires:
- at least 4 captures;
- at least 2 identical trailing capture-to-capture transitions;
- zero provenance/payload conflicts;
- stable event-universe identity;
- correct earliest/latest observation preservation.

Current:
- captures = 3 < 4;
- trailing identical transitions = 0 < 2.

Therefore stabilization is not met.

## L4 decision

D10-10 remains L3 / 60%.

Reason:
prospective event-version observation and append-only clock provenance are now physically stronger, but the bounded expected event-key population is still not stable/complete enough to protect future event studies from selection-by-retrieval.

Permanent distinction:
`PROVENANCE_STABLE_FOR_OBSERVED_VERSIONS != POPULATION_MEMBERSHIP_STABLE`.

No L4 promotion.
No stock outcome opened.

## Exact next

SC-084:
1. do not redo the first three captures;
2. consume the next live capture seeded from the durable 168-version union;
3. preserve earliest firstObservedAt and append-only union identity;
4. require captureCount >= 4;
5. accumulate trailing identical transitions without payload conflict;
6. independently resolve month-shard/source semantics;
7. only when stabilization and source-semantics gates both pass may expectedMopsKeysetComplete be reviewed;
8. noRevisionGapThroughCut remains false until post-parent reconciliation.

Formal Core unchanged.
