# SC-079 D16 Validation Dependency Request — 2026-10-08

Status: CROSS_ROOM_DEPENDENCY_REQUEST / OUTCOME_BLIND / NO_FORMAL_CHANGE

Requester: 07｜產業與供應鏈研究室
Validation owner: 11｜統計驗證研究室 / D16
Consumer module: D10-12 產業專屬傳導模型與公司曝險映射
Parent: research/SC079_D10_12_PROSPECTIVE_MATERIAL_TRANSMISSION_D16_HANDOFF_20261008_V0_1.md
Machine parent: research/sc079_d10_12_prospective_material_transmission_d16_handoff_v0_1.json
Observed main before write: 0055dbe2d94757f63f509c5c0045875b34b1de65

## Dependency request

Freeze a D16 method receipt BEFORE any prospective stock-outcome value from SC-027/SC-036 is read.

Required frozen design:
- independent unit = MATERIAL_EVENT_VINTAGE;
- E1 and E2 are repeated vintages of one Taiwan EAF steel chain, not independent industries;
- exposed route = 2006 東和鋼鐵 / EAF / high scrap relevance;
- control = 2002 中國鋼鐵 / BF-BOF / DIFFERENT_ROUTE, explicitly not zero exposure;
- D5/D20/D60 belong to one multiplicity family and are not independent rows;
- lag 0/1/2 output-price states remain frozen;
- economic endpoints have priority over stock outcome interpretation;
- no post-outcome route remap, lag reselection, horizon reselection or UNKNOWN imputation;
- market/sector controls must be pre-outcome and PIT-consistent;
- repeated issuer/horizon observations inherit the same material-event dependence root;
- method must return POWER_INSUFFICIENT rather than relax thresholds when event N is inadequate.

## Current readiness

- prospective event vintages frozen = 2;
- independent D5 events matured in principle = 1;
- stock outcome values opened by Room07 = 0;
- E1/D5 matured by the 2026-10-07 close but is deliberately unopened;
- E2/D5 remains immature;
- D10-12 maturity remains L3/60.

## Return contract

D16 should return:
1. method-receipt path/id;
2. exact independent-unit definition;
3. common-support fields and missingness policy;
4. allowed estimand(s);
5. multiplicity family;
6. minimum event-N / power disposition, if defined;
7. outcome-access authorization state;
8. explicit METHOD_BLOCKED / POWER_INSUFFICIENT state when applicable;
9. no formula or threshold changes based on observed outcomes.

Until that return exists:
`E1_D5_OUTCOME_ACCESS = CLOSED`.

Formal Core unchanged.
