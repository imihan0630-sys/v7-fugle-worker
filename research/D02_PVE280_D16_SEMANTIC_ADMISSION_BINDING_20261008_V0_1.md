# D02 PVE-280 — D16 semantic-governance dataset binding

Date: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / SEMANTIC_DOWNSTREAM_DATASET_SUBSTITUTION_DEFECT_CERTIFIED / BINDING_FROZEN / NO_MATURITY_CHANGE

## Finding

D02-01's existing semantic admission gate is structurally strong at row level:
- prospective capture;
- daily SHARES versus intraday regular-lot LOTS;
- zero versus missing;
- suspension/non-symbol session handling;
- UNIT_SCALE and SUPPLY_CHANGE semantics;
- known-at clocks;
- frozen governed versus ungoverned counterfactual.

The gap is downstream identity, not semantic logic.

evaluateD0201SemanticDataset() reports counts and eligible receipts but does not commit the admitted dataset with an immutable dataset hash. The D16 V0.2 receipt guard can therefore validate a semantic receipt under the correct admissionVersion without proving that its input rows are exactly the rows admitted by D02-01.

## PVE-280 binding

For D02-01:SEMANTIC_GOVERNANCE, D16 consumption additionally requires:
- exact D02_01_L4_SEMANTIC_ADMISSION_V0_1 receipt identity;
- l4SemanticEvidenceAdmissionReady=true and fatalIntegrity=false;
- outcome-blind pre-outcome creation;
- immutable admission receipt hash;
- immutable admitted dataset hash;
- exact equality admittedDatasetHash == d16InputDatasetHash;
- admitted row count bound to D16 common-support input count.

PVE-280 composes with D16 V0.2 and does not alter the D02-01 semantic row contract.

No economic outcome access, maturity promotion or Formal Core change is authorized.
