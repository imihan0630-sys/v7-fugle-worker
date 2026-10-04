# System 2 TPEx 6548 Par-Value Representative Control V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / REPRESENTATIVE CONTROL PROMOTION CANDIDATE
System 1 Formal Core: LOCKED

## Purpose

Promote the physically discovered 6548 長科* revision chain into a versioned TPEx par-value-change representative authority control.

Historical versions remain immutable:
- MOPS control matrix V0.3 remains the 3152-era six-control artifact;
- authority matrix V0.2 remains the 3/6 representative artifact;
- supplemental receipt V0.2 remains the 3/6 receipt.

This promotion creates:
- MOPS control matrix V0.4;
- authority provenance matrix V0.3;
- supplemental revision provenance receipt V0.3.

## Frozen issuer control

Symbol: 6548
ROC year: 111
MOPS month: 8

Base subject:
`董事會訂定股票面額變更之換發基準日`

Expected source-reported chain:
- original: 2022-08-05 17:17:38 / seqNo=2;
- correction: 2022-08-08 17:26:39 / seqNo=2.

The control requires at least one original, at least one correction/cancellation, and at least two distinct version keys.

## Frozen exchange authority control

Source:
`TPEX_PAR_VALUE_CHANGE_REFERENCE`

Required:
- symbol 6548;
- exact effective date 2022-09-05;
- direct official exchange evidence.

## Promotion target

If physical verification passes:
- MOPS control count = 7 / pass = 7;
- source-clock controls = 7 / pass = 7;
- authority controls = 7 / pass = 7;
- representative exchange lane count = 4;
- supplemental receipt representativeAuthorityReadyCount = 4.

Remaining representative gaps would then be:
- TWSE par-value change;
- TPEx ex-right/dividend.

## Boundaries

Even after PASS:
- publicAvailabilityLatencyCertified=false;
- knownAtVersionClockCertified=false;
- authorityRevisionCoverageComplete=false;
- bounded revision-history completeness=false;
- revisionCoverageComplete=false;
- noEventMayBeClaimed=false;
- technical continuity remains false;
- all trading authority remains false.
