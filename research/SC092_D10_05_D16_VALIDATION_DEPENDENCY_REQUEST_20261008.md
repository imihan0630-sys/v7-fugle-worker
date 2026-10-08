# SC-092 D10-05 D16 Validation Dependency Request — 2026-10-08

Status: CROSS_ROOM_DEPENDENCY_REQUEST / OUTCOME_BLIND / NO_FORMAL_CHANGE

Requester: 07｜產業與供應鏈研究室
Validation owner: 11｜統計驗證研究室 / D16
Consumer module: D10-05 原物料／報價傳導
Parent: research/SC092_D10_05_MATERIAL_PRICE_COHORT_D16_HANDOFF_20261008_V0_1.md
Observed main before write: 4612ead7704deac2d5328582eae8d9804fefd30c

## Method receipt required before any outcome access

Independent unit = MATERIAL_PRICE_VINTAGE.
Cluster repeated vintages by supply-chain / industry route.
Do not treat lag0/lag1/lag2 as independent observations.
Preserve 2006 EAF versus 2002 BF-BOF as different-route contrast, not zero-exposure control.
Freeze common-support demand/sector/market fields before outcomes.
Preserve UNKNOWN for inventory, electricity, yield, freight, product mix and contract terms.
Multiplicity family includes lag0/1/2 economic endpoints and D5/D20/D60 market endpoints.
No post-outcome route remap, lag reselection or horizon reselection.
Return POWER_INSUFFICIENT when event/chain N is inadequate.

## Current evidence

Prospective monthly vintages = 2.
Independent chains = 1.
Room07 stock outcomes opened = 0.
Room07 realized issuer-margin endpoints opened = 0.
D10-05 remains L3/60.

## Return contract

Return method-receipt id/path, event/chain dependence, admissible estimands, common-support fields, multiplicity family, minimum-N/power disposition, outcome-access authorization, and explicit BLOCKED/POWER_INSUFFICIENT state when applicable.

Formal Core unchanged.
