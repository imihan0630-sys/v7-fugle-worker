# SC-082 — D10-03 Prospective Inventory-Cycle Cohort Preregistration V0.1

Status: RESEARCH_ONLY / PROSPECTIVE_COHORT_PREREGISTERED / OUTCOMES_CLOSED / KEEP_L3 / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-03
Date: 2026-10-08 Asia/Taipei
Observed main before write: 15ed05ec7813c1451e6ce695eaa82d8e747357f1

## Purpose

Freeze the next prospective inventory-cycle cohort before future monthly data or stock outcomes are inspected.

## Source and scope rules

Every monthly row must preserve source identity, reference month, source publication clock when authenticated, capturedAt, scope type/code/taxonomy, production, sales/order, inventory, inventory ratio, units, raw hash/parser version and revision lineage.

Direct joins require identical statistical scope or a preregistered exact aggregation. Parent-industry inventory cannot be relabeled as child-industry inventory.

## Frozen state family

1. DEMAND_STRONG_INVENTORY_ABSORBING
2. DEMAND_STRONG_INVENTORY_BUILDING
3. DEMAND_WEAK_INVENTORY_BUILDING
4. DEMAND_WEAK_INVENTORY_CLEARING
5. MIXED_OR_UNKNOWN

No bullish or bearish stock label is attached.

## Transition rule

For state month t, the first future comparable receipt is t+1 under the same source/scope contract.

Inventory absorption improvement requires inventory burden to improve while the demand proxy does not deteriorate enough to make the ratio change mechanically ambiguous.

If production, sales and inventory are not aligned to the same reference month and scope, transition remains UNKNOWN.

## Historical calibration only

The existing code-26 electronic-components witness remains historical calibration:
- production and sales strongly positive YoY;
- inventory value rose faster;
- inventory ratio 70.12 versus 59.25 one year earlier;
- state = DEMAND_STRONG_INVENTORY_BUILDING.

It is not counted as a prospective cohort row because the classification followed historical source inspection.

## Negative controls

Require at least:
- one non-tech/process-industry aligned panel when same-scope current data exist;
- one production-up / inventory-burden-worse case;
- explicit demand-collapse ambiguity testing when inventory ratio falls.

Permanent rules:
- INVENTORY_DOWN != AUTOMATIC_BULLISH
- INVENTORY_UP != AUTOMATIC_BEARISH
- NOMINAL_INVENTORY_VALUE_CHANGE != PHYSICAL_INVENTORY_CHANGE
- SAME_MONTH_SCOPE_ALIGNMENT_REQUIRED

## L4 gate

D10-03 remains L3 / 60%.

Reconsider L4 only after:
1. at least two prospectively frozen independent monthly vintages under the same contract;
2. source/capture clocks and revisions preserved;
3. at least one state transition observed without classification changes;
4. one non-tech or different-chain control;
5. D16 freezes month-dependence and common-support rules before stock-return access;
6. no post-outcome state relabeling.

## Exact next

SC-083: on the next eligible official monthly inventory release, freeze the first prospective cohort row under this contract before inspecting subsequent-month or stock outcomes. Accumulate two independent monthly vintages plus one cross-industry control, then request D16 validation.

Formal Core unchanged.
