# D02 PVE-274 — H003 baseline symmetry and freshness gate

Date: 2026-10-08 Asia/Taipei
Status: RESEARCH_GATE_DEFECT_CERTIFIED / RESEARCH_ONLY_OVERLAY_FROZEN / NO_PRODUCTION_CHANGE / NO_MATURITY_CHANGE

## Finding

The frozen H003 comparison is:
- P = PRICE_ONLY_RESPONSE = price geometry only;
- PV = PRICE_PLUS_VOLUME_RESPONSE = the same price geometry + volume effort.

The V8.11 research implementation derives price-volume response fields from same-slot historical baselines:
- pvSlotRvol20 uses slotVolumeMedian20;
- pvSlotRangeExpansion20 and pvSignedProgress20 use slotRangeMedian20;
- both medians come from pvBaselineStats() over prior same-slot sessions.

The legacy PVE-242 H003 lane gate verifies same feature bar, H003 clean-event labeling and future clock, but does not itself prove either historical baseline is fresh.

Therefore H003 has a possible contamination path distinct from H20:
a stale shared price-range baseline can contaminate both P and PV, while a stale volume baseline can contaminate only the PV increment. Either condition invalidates the intended incremental contrast.

## Frozen rule

A future H003 row is admissible only when:
- P and PV use identical price geometry and identical eligible rows;
- the only challenger increment is volume effort;
- both price-range and volume same-slot baselines are independently clean, >=20 valid histories, exact-slot valid, strictly prior and fresh to the authoritative expected comparable slot;
- corporate-action continuity and exact-provider provenance are proven;
- current/future leakage is excluded;
- P/PV baseline dates are symmetric;
- outcomes remain strictly future and identical between P and PV.

## Scope

No outcome access, maturity promotion, Production runtime, Formal Core or trading authority is granted.
