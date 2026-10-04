# System 2 Revision Authority Provenance Matrix V0.2

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / EXPANDED FROZEN AUTHORITY ROUTING
System 1 Formal Core: LOCKED

## Purpose

Extend V0.1 authority routing with the first TPEx-specific representative corporate-action revision control.

V0.2 preserves all five V0.1 controls and adds 3152 璟德.

## 3152 authority chain

Issuer role:
- MOPS/MOPSOV original cash capital-reduction decision;
- MOPS/MOPSOV later correction.

Exchange role:
- official TPEx `TPEX_CAPITAL_REDUCTION_REFERENCE`;
- same symbol 3152;
- required effective/resume date exactly 2026-06-30.

The control passes only when both issuer and exchange roles are directly observed.

## Expected representative exchange lanes after PASS

1. TWSE ex-right/dividend;
2. TWSE capital reduction;
3. TPEx capital reduction.

Expected `representativeExchangeLaneCount=3`.

The remaining representative-routing gaps are still:
- TWSE par-value change;
- TPEx ex-right/dividend;
- TPEx par-value change.

## Authority boundary

Representative-control breadth is not bounded-market revision completeness.

Even after 6/6 frozen controls PASS:
- `authorityRevisionCoverageComplete=false`;
- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- session/technical continuity remain false;
- all selection/push/capital/order/System1 authority remains false.
