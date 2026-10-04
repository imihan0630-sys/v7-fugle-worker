# System 2 Supplemental Revision Provenance Receipt V0.3

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / REPRESENTATIVE AUTHORITY 4 OF 6
System 1 Formal Core: LOCKED

## Purpose

Version the canonical six-lane supplemental revision receipt after the physically verified 6548 TPEx par-value control.

V0.3 reuses the same blocker semantics as V0.1/V0.2. Only evidence breadth changes.

## Physical acceptance

PR #520 / `53a9680acef1a667e8f05efc0f5387fd326d47a4`:

- receipt version=`0.3-RESEARCH`
- representativeAuthorityReadyCount=4
- supplementalRevisionReadyCount=0
- revisionCoverageComplete=false

Remaining representative gaps:
- `TWSE_PAR_VALUE_CHANGE_REFERENCE`
- `TPEX_EX_RIGHT_DIVIDEND_ACTUAL`

Blocker counts remain:
- PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED = 6
- KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED = 6
- AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE = 6
- BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE = 6
- LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED = 2

## What this proves

The representative authority-routing sample now spans both exchanges and four of six required continuity lanes.

## What this does not prove

It does not prove:
- exact historical public availability;
- exact knownAt;
- bounded authority revision completeness;
- bounded revision-history completeness;
- revisionCoverageComplete;
- NO_EVENT eligibility;
- technical continuity;
- selection/push/capital/order authority.
