# D06-18 -> D20-13 live lending receipt handoff — 2026-10-07

Status: UPSTREAM_RECEIPT_AVAILABLE / D20_OWNER_REASSESSMENT_REQUIRED / RESEARCH_ONLY / FORMAL_CORE_LOCKED

## Upstream receipt

`research/d06_18_twse_sbl_live_slot_20261007_v0_1.json`

Room 05 completed the preregistered TWSE 15:20 ±5 minute live lending capture on 2026-10-07.

Capture window:
`2026-10-07T15:15:02+08:00` to `2026-10-07T15:21:05+08:00`.

All five frozen securities matched and the rendered page visibly certified 2026-10-07.

A non-null competitive-bid cost observation was captured for 3532 台勝科:
- transaction family: competitive bid;
- recall term: 3-day;
- match time: 14:57:19.04;
- total/latest quantity: 13;
- latest fee: 4.00%;
- displayed lend/borrow quantity at capture: 0 / 0.

## Semantic boundary

The receipt supports a bounded `TWSE_DISPLAYED_BORROW_SCARCITY_AND_COST_STATE` style construct.

It does NOT establish:
- true utilization;
- total lendable inventory;
- market-wide shorting constraint;
- TPEx parity;
- bearish motive;
- predictive alpha.

Displayed zero depth after a match is not zero total supply.

## Room 05 decision

D06-18 is promoted from L2/40 to L3/60 for bounded TWSE PIT/source feasibility only.

## D20 ownership boundary

This handoff does not promote D20-13 automatically. Room 13 should re-read its own readiness contract and decide whether the now-available upstream receipt satisfies its frozen L3 gate. It must preserve one-primitive/one-receipt semantics and may not turn the same lending observation into duplicate bearish votes.

## Exact next for D20 owner

Re-evaluate `research/d20_13_twse_borrow_constraint_l3_readiness_v0_1.json` against the new upstream receipt. Keep true utilization and cross-market claims UNKNOWN.
