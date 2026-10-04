# System 2 Supplemental Revision Provenance Receipt V0.2

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / REPRESENTATIVE AUTHORITY 3 OF 6
System 1 Formal Core: LOCKED

## Purpose

Advance the canonical PR #487 six-lane blocker receipt after the physically verified 3152 TPEx capital-reduction representative control.

V0.2 does not rewrite the V0.1 historical receipt.

It reuses the exact V0.1 blocker logic and versions only the evidence state.

## New accepted evidence

- PR #497 / `e49ed821312fd20d5f281e25e8aadc9198751d84`
  - bounded discovery identified 3152 as the only valid representative revision-chain candidate in the frozen seven-symbol set;
  - false-positive 4207 action-family contamination was removed before acceptance.
- PR #502 / `13bd801a6eeb06aa81f8ffde9ce00d794c629247`
  - MOPS revision controls 6/6 PASS;
  - 3152 cross-month Jan original + May correction PASS;
  - source-reported clock 6/6 PASS;
  - official TPEx capital-reduction effective/resume date exactly 2026-06-30;
  - authority controls 6/6 PASS;
  - representative exchange lane count=3.

## Updated representative lanes

READY:
1. TWSE ex-right/dividend;
2. TWSE capital reduction;
3. TPEx capital reduction.

Still missing representative authority routing:
1. TWSE par-value change;
2. TPEx ex-right/dividend;
3. TPEx par-value change.

Therefore expected:
- `representativeAuthorityReadyCount=3`;
- `LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED=3`.

## What did not change

The following blockers remain on all six lanes:
- public availability latency not certified;
- exact knownAt not certified;
- bounded authority revision coverage incomplete;
- bounded revision-history coverage incomplete.

Therefore:
- `supplementalRevisionReadyCount=0`;
- `authorityRevisionCoverageComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `technicalContinuityCertified=false`;
- all trading authority remains false.

## Next research order

1. expand representative-control discovery for TWSE par-value change;
2. expand representative-control discovery for TPEx ex-right/dividend;
3. expand representative-control discovery for TPEx par-value change;
4. separately collect genuinely prospective MOPS availability observations;
5. only after representative routing breadth improves, address bounded authority/revision-history completeness.

## 2026-10-04 physical V0.2 acceptance — REPRESENTATIVE AUTHORITY 3/6

PR #503 merged as `3d8d869b0bcf43d341fa333f1890a12c755fdc97`.

Checks:
- Supplemental Revision Provenance Receipt V0.2 Readonly `37182276016`: PASS.
- System2 Research CI `37182275922`: PASS.
- V8 Regression `37182275927`: PASS.
- result=`PASS_REPRESENTATIVE_AUTHORITY_3_OF_6`.

Physical receipt:
- requiredLaneCount=6;
- finalResultReadyCount=6;
- representativeAuthorityReadyCount=3;
- supplementalRevisionReadyCount=0;
- `queryIntegrityReady=true`;
- `sourceReportedClockReady=true`;
- `frozenAuthorityRoutingCoverageComplete=true`;
- `revisionCoverageComplete=false`.

Remaining representative-routing gaps:
- TWSE_PAR_VALUE_CHANGE_REFERENCE;
- TPEX_EX_RIGHT_DIVIDEND_ACTUAL;
- TPEX_PAR_VALUE_CHANGE_REFERENCE.

Blocker counts retained:
- PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED = 6;
- KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED = 6;
- AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE = 6;
- BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE = 6;
- LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED = 3.

This is a representative-evidence breadth improvement only. It does not upgrade bounded revision completeness.
