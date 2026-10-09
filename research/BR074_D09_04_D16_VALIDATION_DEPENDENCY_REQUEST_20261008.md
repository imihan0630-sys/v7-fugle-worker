# BR-074 D09-04 D16 Validation Dependency Request — 2026-10-08

Status: CROSS_ROOM_DEPENDENCY_REQUEST / OUTCOME_BLIND / NO_FORMAL_CHANGE

Requester: 07｜產業與供應鏈研究室
Validation owner: 11｜統計驗證研究室 / D16
Consumer module: D09-04 漲跌家數／Advance-Decline
Parent: research/BR074_D09_04_THREE_DATE_ADVANCE_DECLINE_D16_HANDOFF_20261008_V0_1.md
Observed main before write: b08a93df359d0b409b338d795cad8037e5049b14

## Required method receipt before outcome access

Freeze:
- independent unit = TWSE market-date breadth root;
- date clustering / equal-date or otherwise preregistered date weighting;
- D5/D20/D60 as one multiplicity family, not independent samples;
- common-support market/regime fields using only PIT-eligible pre-outcome inputs;
- explicit missingness policy for TPEx and strategy-universe breadth;
- redundancy controls against cap-weighted index direction, D09-05 Above-MA, D09-10 concentration and D09-12 breadth×regime;
- transaction-cost/slippage sensitivity if any tradable decision rule is later tested;
- no threshold/transform/horizon selection after outcome access;
- POWER_INSUFFICIENT fail-closed state when independent date N is inadequate.

## Current frozen support

Independent official TWSE market-date roots = 3.
Opened predictive/stock outcomes = 0.
Formal Core changes = 0.

## Return contract

Return:
1. method receipt path/id;
2. estimand definition;
3. date dependence/weighting rule;
4. common-support fields;
5. multiplicity family;
6. redundancy family;
7. minimum-support or power disposition;
8. outcome-access authorization state;
9. explicit POWER_INSUFFICIENT / METHOD_BLOCKED state if applicable.

Until this return exists:
`D09_04_PREDICTIVE_OUTCOME_ACCESS = CLOSED`.

Formal Core unchanged.

## Room11 D16 method return — 2026-10-10

- Method receipt: `research/ROOM11_BR074_D16_METHOD_RECEIPT_20261010.md`.
- Machine state: `research/room11_br074_method_state_20261010.json`.
- Estimand: equal-market-date TWSE breadth association with preregistered D5/D20/D60 benchmark-return family, not causal or policy alpha.
- Independent N=3; exact sign-flip minimum p=0.125 one-sided / 0.25 two-sided under ideal null assumptions.
- `POWER_INSUFFICIENT`; predictive outcome access remains `CLOSED`; no maturity or Formal change.
- Next: append official independent dates outcome-blind; later freeze real label/clock and dependence-aware test before outcomes.
