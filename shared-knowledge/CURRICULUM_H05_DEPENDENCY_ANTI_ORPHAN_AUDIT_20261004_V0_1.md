# H05 Dependency + Anti-Orphan Audit 2026-10-04 V0.1

Status: CLOSED_NO_STRUCTURAL_CHANGE
Audit base main: `da9a209176f67502103fade23b19f194c0e7ca98`
Cluster: H05 — D07-25 vs D21-10
Formal Core impact: NONE

## Accepted evidence

Room06 specialist packet:
`research/h05_d07_25_specialist_evidence_packet_v0_1.json`

Equivalent independent Room14 counterpart evidence:
- `CORPORATE_GOVERNANCE_INSIDER_RESEARCH.md`
- `CORPORATE_GOVERNANCE_INSIDER_CHECKPOINT.md`
- canonical D21-10 tracker state = L3/60% with Taiwan dual-vintage PIT feasibility validated.

The Room14 evidence independently defines:
- correction vs formal restatement;
- regulator/company initiation;
- audit-opinion deterioration;
- auditor change where governance-relevant;
- internal-control statement and material weakness;
- special CPA review;
- fraud/suspected-fraud state;
- remediation/repeated weakness chronology;
- original_report_known_at vs correction/restatement_known_at;
- original and corrected financial vintages;
- rule-vintage/materiality thresholds;
- Taiwan historical dual-vintage replay cases.

No duplicate specialist narrative is manufactured by 00-room.

## Canonical ownership

### D07-25 — statement-level forensic/anomaly interpretation

Owns:
- cross-statement anomaly combinations;
- accrual/cash-flow divergence;
- revenue/receivable, inventory/sales, margin/cash conversion inconsistencies;
- unusual persistence or one-off dependence;
- PIT statement-vintage replay;
- competing economic explanations for accounting anomalies.

It may consume D07-07 accrual primitives and D07-24 accounting-policy semantics but cannot re-own them as new raw evidence.

### D21-10 — governance/control-process event state

Owns:
- audit opinion/report event;
- restatement/correction governance chronology;
- internal-control statement/material weakness;
- CPA special review;
- audit/control remediation;
- governance-relevant auditor/control-process changes;
- event severity/cause and rule-vintage state.

## Divergent-state audit

PASS.

1. D07-25 elevated / D21-10 no event:
   statement ratios and cross-statement consistency can become abnormal while no audit/restatement/internal-control event is disclosed.

2. D21-10 warning / D07-25 low or UNKNOWN:
   a material internal-control weakness, CPA special review, governance-process failure or audit opinion deterioration can occur even when ordinary forensic ratios are not abnormal.

3. Shared restatement event:
   the event can create a D21 governance/control state while D07 measures statement-value deltas before/after the new vintage. These are child interpretations of one receipt, not two independent votes.

## PIT / dual-vintage audit

PASS.

Canonical rules:
- historical financial features use the originally-known statement vintage until the later correction/restatement becomes public;
- corrected values never backfill earlier decisions;
- correction/restatement known_at and affected fiscal periods are explicit;
- remediation is a state transition, not deletion of the original warning;
- daily after-market replay may use conservative observed_public_at when proven before the decision timestamp, while exact original first-known second may remain UNKNOWN for intraday event studies.

## Dependency Audit

Upstream/shared:
- D07-07 raw earnings-quality/accrual primitives;
- D07-24 accounting-policy/revenue-recognition semantics;
- D11 event-clock infrastructure where used;
- original/corrected statement vintages.

Downstream:
- D07-25 forensic orchestration;
- D21-10 governance/control interpretation;
- later D21-11 tunneling/minority-risk classification may consume but not duplicate raw RPT/accounting/control evidence.

Result:
`PASS_STATEMENT_VS_GOVERNANCE_EVENT_GRAPH`.

## Anti-double-count

1. one source statement/event receipt;
2. D07-07 raw accrual metric is not re-counted by D07-25 as a new primitive;
3. D07-24 accounting-policy change remains its own owner;
4. a restatement/audit/internal-control event is recorded once;
5. D07-25 child view = statement anomaly/delta context;
6. D21-10 child view = audit/control/governance event/remediation state;
7. a combined System score may not count the same restatement once as forensic Alpha and again as independent governance Alpha without residualization.

Result:
`PASS_SHARED_RESTATEMENT_EVENT_RECEIPT`.

## Anti-orphan

KEEP_SEPARATE preserves:
- statement-anomaly combinations without governance events;
- governance/control warnings without abnormal forensic ratios;
- dual-vintage financial replay;
- audit/control remediation chronology.

Result:
`PASS_NO_ORPHAN`.

## Maturity firewall

- D07-25 remains L0/0%.
- D21-10 remains L3/60%.
- no maturity transfer from D21-10 to D07-25.
- this overlap audit itself adds no D07-25 research maturity.

## Terminal classification

`KEEP_SEPARATE / STATEMENT_ANOMALY_VS_GOVERNANCE_CONTROL_EVENT / SHARED_RESTATEMENT_EVENT_RECEIPT`

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

No merge, retirement, rename, count, maturity, System1/System2 Formal or runtime change.
