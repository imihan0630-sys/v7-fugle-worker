# System 2 Supplemental Revision Provenance Receipt V0.5

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / REPRESENTATIVE AUTHORITY 5 OF 6 WITH FINAL-GAP DISPOSITION
System 1 Formal Core: LOCKED

## Purpose

Version V0.4 without rewriting its 5/6 history.

V0.5 adds one new semantic fact:

the remaining TWSE par-value representative search is formally dispositioned after multiple official historical routes were exhausted without establishing a valid revision control.

## What remains unchanged

- representativeAuthorityReadyCount = 5;
- representative-routing blocker count remains 1;
- representativeRoutingCoverageComplete = false;
- supplementalRevisionReadyCount remains 0;
- exact knownAt remains uncertified;
- bounded authority/revision-history coverage remains incomplete;
- revisionCoverageComplete = false.

## What is new

- representativeRoutingResearchDispositionComplete = true;
- representativeRoutingDispositionedGapCount = 1;
- remainingRepresentativeGap = TWSE_PAR_VALUE_CHANGE_REFERENCE;
- remainingRepresentativeGapDisposition =
  `HISTORICAL_CONTROL_NOT_ESTABLISHED_WITHIN_EXHAUSTED_OFFICIAL_PATHS`;
- blindRepresentativeSearchRepeatAuthorized = false;
- reopenRepresentativeSearchOnNewOfficialEvidence = true.

This allows research to stop repeatedly searching the same exhausted routes while preserving the true 5/6 evidence state.

## 2026-10-05 physical V0.5 acceptance

PR #598 / `1ec7e3be4581b722ef5cbc2ab66e8d8d163365e2` physically verified Supplemental Revision Provenance Receipt V0.5.

Frozen state:
- `representativeAuthorityReadyCount=5`;
- `representativeRoutingResearchDispositionComplete=true`;
- `representativeRoutingDispositionedGapCount=1`;
- `representativeRoutingCoverageComplete=false`;
- `LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED=1`.

Remaining gap:
`TWSE_PAR_VALUE_CHANGE_REFERENCE`
with disposition:
`HISTORICAL_CONTROL_NOT_ESTABLISHED_WITHIN_EXHAUSTED_OFFICIAL_PATHS`.

All six lanes still retain:
- PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED;
- KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED;
- AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE;
- BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE.

Therefore `revisionCoverageComplete=false` and all trading authority remains false.
