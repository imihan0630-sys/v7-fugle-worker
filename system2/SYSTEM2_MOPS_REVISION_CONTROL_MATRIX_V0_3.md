# System 2 MOPS Revision Control Matrix V0.3

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / EXPANDED REPRESENTATIVE CONTROL MATRIX
System 1 Formal Core: LOCKED

## Purpose

Extend the frozen V0.2 MOPS revision control matrix without rewriting its history.

V0.3 keeps all five V0.2 controls and adds the first TPEx-specific representative revision-chain candidate physically discovered by PR #497:

- 3152 璟德;
- TPEx capital-reduction lane;
- issuer-stage cash capital-reduction decision;
- original disclosure 2026-01-20;
- correction disclosure 2026-05-28;
- official TPEx reduction effective/resume date 2026-06-30.

## Cross-month control semantics

The 3152 chain crosses calendar months.

V0.3 therefore introduces explicit multi-month control semantics rather than pretending both versions belong to one monthly query.

Frozen control:
- id: `TPEX_CAPITAL_REDUCTION_DECISION_CORRECTION_3152_2026`;
- required MOPS months: ROC115/01 and ROC115/05;
- base subject: `本公司董事會決議辦理現金減資事宜`.

A multi-month control passes only if:
- every configured month is physically readable;
- no configured month is missing;
- combined matched rows contain at least one original;
- combined matched rows contain at least one correction/cancellation;
- at least two distinct `date|time|seqNo` versions exist.

Any missing month fails closed.

## Expected 3152 source-reported chain

- original: 2026-01-20 17:14:53 / seqNo=2;
- correction: 2026-05-28 17:20:08 / seqNo=1.

These timestamps remain `sourceReportedAt`, not exact public `availableAt`.

## Promotion boundary

V0.3 may increase representative control breadth across exchanges.

It does not certify:
- bounded action-family revision completeness;
- cancellation-history completeness;
- exact public availability;
- exact knownAt;
- revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- any trading authority.

## 2026-10-04 physical V0.3 acceptance

PR #502 merged as `13bd801a6eeb06aa81f8ffde9ce00d794c629247`.

Checks:
- TPEx 3152 Representative Revision Control Readonly `37182093418`: PASS.
- System2 Research CI `37182093346`: PASS.
- V8 Regression `37182093362`: PASS.

Physical MOPS V0.3 result:
- state=`MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED`;
- controlCount=6 / passCount=6;
- crossMonthControlCount=1;
- 3152 required months=[1,5], observed months=[1,5];
- originalCount=1;
- revisionCount=1;
- distinctVersionKeyCount=2;
- source-reported clock semantics PASS 6/6.

3152 source-reported chain:
- 2026-01-20 17:14:53 / seqNo=2 / original;
- 2026-05-28 17:20:08 / seqNo=1 / correction.

Exact knownAt remains uncertified.
