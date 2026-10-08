# BR-075 D09-08 D16 Validation Dependency Request — 2026-10-08

Status: CROSS_ROOM_DEPENDENCY_REQUEST / OUTCOME_BLIND / NO_FORMAL_CHANGE
Requester: 07｜產業與供應鏈研究室
Validation owner: 11｜統計驗證研究室 / D16
Consumer: D09-08 大型股vs小型股領導
Parent: research/BR075_D09_08_SIZE_LEADERSHIP_D16_PREREG_20261008_V0_1.md
Observed main before write: 89875235dfe1ec7672bf186eee1b2ae97382f92e

## Return needed

Freeze a method receipt before any predictive use.

Required:
- independent unit = common-complete size-TRI market date;
- D1/D5/D20/D60 treated as repeated horizons, not independent rows;
- common total-return basis across Taiwan50/MidCap100/SmallCap300;
- sector mix, effective membership, liquidity, non-trading/limit, breadth, concentration and PIT-clean regime controls;
- explicit PARTIAL/UNKNOWN policy;
- no price-index/TRI splicing;
- no future membership or future factor values;
- POWER_INSUFFICIENT when complete-date support is inadequate.

Current complete-date N = 1.
Opened predictive outcomes = 0.

Until return:
`D09_08_PREDICTIVE_OUTCOME_ACCESS = CLOSED`.

Formal Core unchanged.
