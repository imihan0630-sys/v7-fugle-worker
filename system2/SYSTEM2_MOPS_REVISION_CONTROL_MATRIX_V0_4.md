# System 2 MOPS Revision Control Matrix V0.4

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / EXPANDED REPRESENTATIVE CONTROL MATRIX
System 1 Formal Core: LOCKED

## Purpose

Version the MOPS revision-control matrix after the physically verified 6548 長科* TPEx par-value-change chain.

V0.4 preserves every V0.3 control and adds:

- controlId: `TPEX_PAR_VALUE_CHANGE_CORRECTION_6548_2022`
- exchange: TPEx
- lane: `TPEX_PAR_VALUE_CHANGE_REFERENCE`
- action family: PAR_VALUE_CHANGE
- MOPS ROC year 111 / month 8
- base subject: `董事會訂定股票面額變更之換發基準日`

## Frozen issuer chain

Physical PR #520 evidence:

- original: 2022-08-05 17:17:38 / seqNo=2
- correction: 2022-08-08 17:26:39 / seqNo=2
- originalCount=1
- revisionCount=1
- distinctVersionKeyCount=2

The source clock is certified only as `sourceReportedAt`; exact public `availableAt` / `knownAt` remains uncertified.

## Physical acceptance

PR #520 merged as `53a9680acef1a667e8f05efc0f5387fd326d47a4`.

Checks:
- TPEx 6548 Representative Control Readonly `37186973562`: PASS.
- System2 Research CI `37186973572`: PASS.
- V8 Regression `37186973575`: PASS.

Physical result:
- controlCount=7
- passCount=7
- state=`MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED_V0_4`
- source clock passCount=7
- `knownAtVersionClockCertified=false`

## Boundary

V0.4 increases representative breadth only.

Still false:
- boundedIntervalCoverageComplete
- actionFamilyCoverageComplete
- cancellationHistoryComplete
- knownAtVersionClockCertified
- revisionCoverageComplete
- NO_EVENT
- technical continuity
- all trading authority
