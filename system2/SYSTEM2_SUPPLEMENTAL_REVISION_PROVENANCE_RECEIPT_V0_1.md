# System 2 Supplemental Revision Provenance Receipt V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / BLOCKER_DECOMPOSITION RECEIPT
System 1 Formal Core: LOCKED

## Purpose

Convert the remaining S2-07 corporate-action revision blocker from one opaque boolean into a six-lane, machine-readable diagnosis.

Required historical final-result lanes:
- TWSE ex-right/dividend;
- TWSE capital reduction;
- TWSE par-value change;
- TPEx ex-right/dividend;
- TPEx capital reduction;
- TPEx par-value change.

The receipt separates these dimensions for every lane:

1. final-result range readiness;
2. MOPS query-integrity guards;
3. source-reported clock semantics;
4. public-availability latency evidence;
5. exact knownAt / PIT availability authorization;
6. frozen representative authority routing;
7. bounded authority revision coverage;
8. bounded revision-history coverage.

## Accepted evidence references

The current physical diagnostic may reference already merged accepted gates:
- PR #446 month-shard reconciliation;
- PR #448 multi-control reconciliation;
- PR #452 empty-month certification;
- PR #455 high-row stress;
- PR #471 source-reported clock;
- PR #475 regulator-side provenance;
- PR #480 prospective-availability observer implementation;
- PR #483 frozen cross-authority matrix.

Evidence references are provenance only. They do not turn a partial gate into a complete one.

## Current representative lane routing

Physically observed representative authority routing exists for:
- TWSE ex-right/dividend via 2467;
- TWSE capital reduction via 1459.

It is **not yet** claimed for:
- TWSE par-value change;
- any of the three TPEx required lanes.

The absence is preserved as an explicit blocker, not filled by analogy.

## Expected current result

Even when all six final-result lanes are physically ready and all MOPS transport/source-clock guards pass, current evidence must keep:

- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`;
- `authorityRevisionCoverageComplete=false`;
- bounded revision-history coverage false for all six lanes;
- `revisionCoverageComplete=false`.

Expected blocker decomposition:
- 6 lanes: public availability latency not certified;
- 6 lanes: exact knownAt not certified;
- 6 lanes: bounded authority revision coverage incomplete;
- 6 lanes: bounded revision-history coverage incomplete;
- 4 lanes: representative authority routing not yet observed.

## Why this is useful

The next work no longer needs to ask "does MOPS work?" or "are final-result endpoints readable?" Those questions have already been narrowed.

Future work can target the actual remaining gaps:
- genuine prospective MOPS availability samples;
- TWSE par-value representative authority control;
- TPEx representative correction/cancellation controls;
- bounded action-family revision/cancellation coverage rather than one-off examples.

## Authority firewall

This diagnostic receipt cannot itself authorize:
- NO_EVENT;
- symbol-session completeness;
- technical continuity;
- selection;
- push;
- capital;
- orders;
- System 1 runtime.

## 2026-10-04 physical six-lane blocker decomposition

PR #487 merged as `b75376bb4741ea6ca7eec6c7f09bd32056dcf162`.

Physical checks:
- Supplemental Revision Provenance Receipt Readonly `37181058446`: PASS.
- System2 Research CI `37181058355`: PASS.
- V8 Regression `37181058477`: PASS.
- result=`PASS_BLOCKER_DECOMPOSITION`.

Final-result physical readiness for 2026-04-05..2026-10-02:
- TWSE ex-right/dividend: 831 events, READY;
- TWSE capital reduction: 9 events, READY;
- TWSE par-value change: 1 event, READY;
- TPEx ex-right/dividend: 611 events, READY;
- TPEx capital reduction: 9 events, READY;
- TPEx par-value change: 4 events, READY.

Receipt totals:
- requiredLaneCount=6;
- finalResultReadyCount=6;
- representativeAuthorityReadyCount=2;
- supplementalRevisionReadyCount=0;
- queryIntegrityReady=true;
- sourceReportedClockReady=true;
- frozenAuthorityRoutingCoverageComplete=true;
- revisionCoverageComplete=false.

Blocker counts:
- `PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED`: 6;
- `KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED`: 6;
- `AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE`: 6;
- `BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE`: 6;
- `LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED`: 4.

The 4 representative-routing gaps are:
- TWSE par-value change;
- TPEx ex-right/dividend;
- TPEx capital reduction;
- TPEx par-value change.

This closes the question of whether the six final-result endpoints are the current blocker: they are not. Future work must target the explicit gaps above.
