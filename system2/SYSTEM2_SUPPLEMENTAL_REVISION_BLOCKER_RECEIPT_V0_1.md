# System 2 Supplemental Revision Blocker Receipt V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / BLOCKER_DECOMPOSITION
System 1 Formal Core: LOCKED

## Purpose

Replace the coarse statement `revisionCoverageComplete=false` with a lane-by-lane machine-readable diagnosis for the six official continuity lanes.

Required lanes:
- TWSE ex-right/dividend;
- TWSE capital reduction;
- TWSE par-value change;
- TPEx ex-right/dividend;
- TPEx capital reduction;
- TPEx par-value change.

## Evidence dimensions

Each lane is checked for:

1. final-result exact-range readiness;
2. representative issuer revision control;
3. representative authority routing control;
4. certified MOPS source-reported clock semantics;
5. prospective public-availability evidence;
6. exact knownAt version clock;
7. bounded supplemental revision-history coverage;
8. cancellation-history completeness.

A lane is complete only when every required dimension is complete.

## Current representative mapping

Only two lanes currently have exchange-specific frozen representative revision controls:

- `TWSE_EX_RIGHT_DIVIDEND_ACTUAL`
  -> 2467 dividend correction;
- `TWSE_CAPITAL_REDUCTION_REFERENCE`
  -> 1459 capital-reduction schedule correction.

No representative exchange-specific control has yet been frozen for:
- TWSE par-value change;
- TPEx ex-right/dividend;
- TPEx capital reduction;
- TPEx par-value change.

This is explicit evidence debt, not an implied failure of those sources.

## knownAt semantics

The MOPS source-reported clock is already semantically certified on the frozen controls.

However:
- historical display time != exact public availability;
- the prospective observer currently has no genuine prospective event sample;
- therefore public availability and exact knownAt remain blocked for every lane.

## Physical probe

The workflow rechecks:
- all six official final-result source/parser lanes;
- all five MOPS revision controls;
- MOPS source-clock semantics;
- retrospective leakage rejection in the availability observer;
- representative TWSE authority evidence for 2467 and 1459;
- direct SFB/FSC regulator evidence for the 1342 cancellation.

The receipt then decomposes every remaining blocker.

## Expected current result

Expected on current evidence:
- requiredLaneCount=6;
- finalResultReadyCount=6;
- representativeIssuerReadyCount=2;
- representativeAuthorityReadyCount=2;
- supplementalRevisionReadyCount=0;
- revisionCoverageComplete=false.

Expected global blockers across all six lanes:
- `PROSPECTIVE_PUBLIC_AVAILABILITY_NOT_CERTIFIED`;
- `KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED`;
- `BOUNDED_SUPPLEMENTAL_REVISION_HISTORY_NOT_PROVEN`;
- `CANCELLATION_HISTORY_NOT_COMPLETE`.

Expected additional representative-control blockers on four lanes:
- `REPRESENTATIVE_ISSUER_REVISION_CONTROL_NOT_OBSERVED`;
- `REPRESENTATIVE_AUTHORITY_ROUTE_NOT_OBSERVED`.

## Next use

This receipt determines the next research order:

1. build representative revision/authority controls for TWSE par-value change;
2. build TPEx representative controls for ex-right/dividend, capital reduction and par-value change;
3. separately accumulate genuine prospective MOPS availability observations;
4. only after representative coverage exists, design bounded interval completeness rules;
5. do not promote `revisionCoverageComplete` until all six lanes are complete.

No selection, push, capital, order or System1 authority is granted by this receipt.

## 2026-10-04 physical blocker decomposition acceptance

PR #488 merged as `fd3a6ecd128508b9deb0a07ff67e6c658c95b00d`.

Physical checks:
- Supplemental Revision Blocker Receipt Readonly `37181182912`: PASS.
- System2 Research CI `37181182863`: PASS.
- V8 Regression `37181182896`: PASS.
- result=`SUPPLEMENTAL_REVISION_BLOCKERS_DECOMPOSED`.

Observed receipt:
- requiredLaneCount=6;
- finalResultReadyCount=6;
- representativeIssuerReadyCount=2;
- representativeAuthorityReadyCount=2;
- sourceReportedVersionClockSemanticsCertified=true;
- publicAvailabilityLatencyCertified=false;
- knownAtVersionClockCertified=false;
- supplementalRevisionReadyCount=0;
- revisionCoverageComplete=false.

Blocker counts:
- PROSPECTIVE_PUBLIC_AVAILABILITY_NOT_CERTIFIED = 6;
- KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED = 6;
- BOUNDED_SUPPLEMENTAL_REVISION_HISTORY_NOT_PROVEN = 6;
- CANCELLATION_HISTORY_NOT_COMPLETE = 6;
- REPRESENTATIVE_ISSUER_REVISION_CONTROL_NOT_OBSERVED = 4;
- REPRESENTATIVE_AUTHORITY_ROUTE_NOT_OBSERVED = 4.

Representative-ready lanes:
- TWSE_EX_RIGHT_DIVIDEND_ACTUAL;
- TWSE_CAPITAL_REDUCTION_REFERENCE.

Still missing representative revision/authority controls:
- TWSE_PAR_VALUE_CHANGE_REFERENCE;
- TPEX_EX_RIGHT_DIVIDEND_ACTUAL;
- TPEX_CAPITAL_REDUCTION_REFERENCE;
- TPEX_PAR_VALUE_CHANGE_REFERENCE.
