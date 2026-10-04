# Curriculum Specialist Intake Ledger 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: ACTIVE_INTAKE_LEDGER
Scope: Third-round H01-H20 specialist validation returns
Formal Core impact: NONE

## Purpose

Track specialist evidence returns independently from chat memory.

A cluster does not become decided merely because one participating room submits a good packet.
00｜研究總控室 only performs completeness/intake checks until all required counterpart evidence exists.

## Current intake summary

- H01: **CANONICAL_UPDATE_COMPLETE / KEEP_SEPARATE + SCOPE_DEDUP_ONLY**.
- H02-H04: pending.
- H05: **PARTIAL_EVIDENCE_RECEIVED**.
- H06: **PARTIAL_EVIDENCE_RECEIVED**（05 室完成；13 室待件）。
- H07-H13: pending.
- H14: **CLOSED_NO_STRUCTURAL_CHANGE / KEEP_SEPARATE**.
- H15-H19: pending.
- H20: **PARTIAL_EVIDENCE_RECEIVED**（02 室完成；01／04 待件）。
- Actual merge/retirement decisions from returned packets: **0**.
- Formal Core changes: **0**.

## H05 intake — D07-25 vs D21-10

Received:
`research/h05_d07_25_specialist_evidence_packet_v0_1.json`

Source room:
06｜基本面與估值研究室

Intake result:
**ROOM06_PACKET_ACCEPTED / ROOM14_COUNTERPART_REQUIRED / TERMINAL_DECISION_NOT_READY**

### What passed
- D07-25 statement-level forensic ownership is explicit.
- D21-10 expected governance/control ownership is explicitly excluded from D07-25.
- Taiwan observable source families and PIT clocks are proposed.
- Shared evidence receipt schema is defined.
- Two divergent-state examples are provided.
- Competing mechanisms/falsifiers are provided.
- Anti-double-count rules with D07-07 / D07-24 / D21-10 are explicit.
- Capability-preservation map is present.
- Formal Core impact remains NONE.
- No maturity promotion is claimed.

### Why final classification remains open
The frozen H05 contract requires independent confirmation that D21-10 actually owns distinct governance/control observables and replayable clocks.

Still required from 14｜公司治理與內部人研究室:
1. audit opinion/report event semantics;
2. restatement/correction governance chronology;
3. internal-control statement/material weakness semantics;
4. CPA special internal-control review;
5. remediation chronology;
6. PIT/first-known source map;
7. D21-10 warning while D07-25 remains low/unknown;
8. shared-receipt compatibility confirmation;
9. terminal recommendation.

Until that packet arrives:
- H05 = `EVIDENCE_INSUFFICIENT_PENDING_COUNTERPART`;
- D07-25 remains L0/0%;
- D21-10 remains L0/0%;
- no scope change;
- no module count change.

## Intake state table

| Cluster | Status | Received packet | Remaining |
|---|---|---|---|
| H01 | SPECIALIST_EVIDENCE_RECEIVED | `research/h01_d09_13_d09_14_specialist_validation_20261003_v0_1.json` + BR-051..056 | 00｜研究總控室 Dependency Audit／owner review |
| H02 | PENDING | — | specialist packet(s) |
| H03 | PENDING | — | specialist packet(s) |
| H04 | PENDING | — | specialist packet(s) |
| H05 | PARTIAL_EVIDENCE_RECEIVED | `research/h05_d07_25_specialist_evidence_packet_v0_1.json` | 14｜公司治理與內部人研究室 |
| H06 | PARTIAL_EVIDENCE_RECEIVED | `research/d06_h06_crowding_vs_herding_room05_packet_v0_1.md` | 13｜行為金融與市場心理研究室 |
| H07 | PARTIAL_EVIDENCE_RECEIVED | `research/D03_PULLBACK_REVERSAL_OBSERVABLE_PIT_V0_2.md` | 13｜行為金融與市場心理研究室 |
| H08 | PENDING | — | specialist packet(s) |
| H09 | CANONICAL_UPDATE_COMPLETE | equivalent complete Room11 evidence | — |
| H10 | PENDING | — | specialist packet(s) |
| H11 | PENDING | — | specialist packet(s) |
| H12 | PARTIAL_EVIDENCE_RECEIVED | `research/d06_securities_lending_economics_h12_v0_1.md` + rule-vintage receipt | 10｜投組風控與交易執行研究室、13｜行為金融與市場心理研究室 |
| H13 | PENDING | — | specialist packet(s) |
| H14 | CLOSED_NO_STRUCTURAL_CHANGE | Room05 packet + Room08 equivalent PIT evidence | — |
| H15 | PENDING | — | specialist packet(s) |
| H16 | PENDING | — | specialist packet(s) |
| H17 | PENDING | — | specialist packet(s) |
| H18 | PENDING | — | specialist packet(s) |
| H19 | PENDING | — | specialist packet(s) |
| H20 | PARTIAL_EVIDENCE_RECEIVED | `research/D02_H20_BREAKOUT_SPECIALIST_RETURN_V0_1.md` | 01｜K線與型態研究室、04｜波動與市場微結構研究室 |

## Intake rules

1. A specialist packet may be accepted as complete for its room without deciding the cluster.
2. Cross-room clusters require all required rooms or equivalent independent evidence.
3. 00 does not manufacture missing specialist evidence.
4. No maturity change from overlap packets alone unless the specialist room's normal maturity gate separately supports it.
5. Final structural changes still require Dependency Audit, anti-orphan check and owner approval.

## H20 intake — D01-05 / D02-03 / D04-07

Received:
`research/D02_H20_BREAKOUT_SPECIALIST_RETURN_V0_1.md`

Source room:
02｜價量研究室

Intake result:
**ROOM02_PACKET_ACCEPTED / ROOMS01_04_COUNTERPARTS_REQUIRED / TERMINAL_DECISION_NOT_READY**

### What passed
- One breakout episode is treated as one shared primitive event receipt.
- D01-05 is recognized as price-structure event identity owner.
- D02-03 owns volume-confirmation transforms only.
- D04-07 remains an external volatility-state dependency.
- PIT/replay clocks are explicit.
- Divergent-state counterexamples are present.
- Incremental-value test is preregistered.
- Anti-double-count rules are explicit.
- D02-03 remains L3/60%; no maturity inflation.
- `FORMAL_OPTIMIZATION_CANDIDATE: NONE`.

### Still required
- 01｜K線與型態研究室: D01-05 price-structure counterpart.
- 04｜波動與市場微結構研究室: D04-07 volatility-interaction counterpart.
- shared event-receipt compatibility across all three rooms.
- final Dependency Audit.

Until then:
H20 = `EVIDENCE_INSUFFICIENT_PENDING_COUNTERPARTS`.

## 15-item intake — D02-07 / D02-08

Received:
`research/D02_15_ITEM_SPECIALIST_RETURN_D02_07_D02_08_V0_1.md`

Intake result:
**SPECIALIST_RETURN_ACCEPTED / RESEARCH_ONLY / NO_STRUCTURAL_CHANGE_YET**

- D02-07 OBV: comparator/observation only; merge candidate pending residual OOS/prospective test.
- D02-08 吸籌／出貨代理：若仍只靠 OHLCV，屬強合併候選；若未來取得獨立微結構證據，才能評估是否保留為 consumer/interpretation module（使用／解釋模組）。
- Neither is a HARD_INVALIDATION or standalone PRIMARY_ALPHA by current evidence.
- No maturity change.
- No retirement/merge executed.
- `FORMAL_OPTIMIZATION_CANDIDATE: NONE`.

## D16-25 → D15-19 merge-governance intake

Received from:
11｜統計驗證與策略市場狀態研究室

Canonical inputs:
- `research/D16_D18_VALIDATION_CHECKPOINT.md`
- `research/D16_25_D15_19_MERGE_DECISION_INPUT_V0_1.md`

Intake result:
**D16_SIDE_SPECIALIST_COMPLETE_AT_L2 / D15_SPECIALIST_RESEARCH_REQUIRED**

What is now closed on the D16 side:
- target/horizon/action-conditioning;
- PIT outcome maturity semantics;
- base-rate/prior;
- Bayesian double-counting firewall;
- probability calibration vs discrimination;
- proper scoring/reliability;
- uncertainty channels;
- Regime/distribution shift;
- ABSTAIN risk-coverage;
- after-cost utility semantics;
- population/selection-bias firewall;
- date-clustering/pseudo-replication firewall;
- PredictiveDecisionReceipt handoff;
- sizing firewall.

What remains:
10｜投組風控與交易執行研究室 must independently research D15-19:
- Kelly/log-growth objective;
- full vs fractional Kelly;
- parameter-estimation risk;
- correlated multi-position Kelly;
- drawdown/ruin constraints;
- liquidity/cost/capacity;
- comparison with fixed-risk, capped sizing, risk budgeting and D15-16 Portfolio Optimization;
- anti-orphan capability mapping.

Current structural view:
- Option A: keep D16-25 and D15-19 separate.
- Option B: absorb D15-19 into D15-16, keep D16-25 upstream.
- Option C: direct merge into expanded D16-25 — currently least natural unless D16 is deliberately expanded into allocation.
- Option D: split-transfer: predictive belief/calibration → D16-25; Kelly sizing mechanics → D15-16/D15 family.

No final merge decision.
D16-25 remains L2/40%.
`FORMAL_OPTIMIZATION_CANDIDATE: NONE`.
Formal Core unchanged.



## H01 intake — D09-13 vs D09-14

Received from:
07｜產業與供應鏈研究室

Canonical packet:
`research/h01_d09_13_d09_14_specialist_validation_20261003_v0_1.json`

Supporting receipts:
- `research/br051_taiwan_foundry_industry_structure_pit_v0_1.json`
- `research/br052_issuer_competitive_action_pit_v0_1.json`
- `research/br053_taiwan_steel_industry_structure_control_v0_1.json`
- `research/br054_cross_industry_competitive_action_failure_control_v0_1.json`
- `research/br055_taiwan_pcb_industry_structure_control_v0_1.json`
- `research/br056_strategic_action_native_outcome_contract_v0_1.json`

Intake result:
**ROOM07_SPECIALIST_PACKET_COMPLETE / KEEP_SEPARATE_PROPOSED / 00_DEPENDENCY_AUDIT_AND OWNER REVIEW REQUIRED**

What passed:
- concept ownership matrix;
- industry-level vs issuer-action unit separation;
- shared vs unique observable families;
- three divergent-state families;
- unique D09-14 strategic-action PIT/replay lifecycle;
- Taiwan foundry, steel and PCB industry controls;
- non-semiconductor firm-action evidence;
- failed/suspended strategic-action negative control;
- native action-outcome states;
- anti-double-count and capability-preservation rules;
- Formal Core impact NONE.

Specialist terminal recommendation:
`KEEP_SEPARATE`

Proposed ownership boundary:
- D09-13: industry × product/geographic market definition × vintage.
- D09-14: issuer × strategic action × implementation/outcome stage × vintage.

Maturity:
- D09-13 stays L3/60%.
- D09-14 stays L3/60%.
- Intake/overlap validation itself adds no maturity.

Still required:
1. 00 Dependency Audit;
2. anti-orphan review;
3. owner review of scope wording/routing;
4. atomic governance update only if approved.

Until then:
- no merge/retirement;
- no module-count change;
- no Formal Core change;
- `FORMAL_OPTIMIZATION_CANDIDATE: NONE`.


## H01 00-room Dependency / anti-orphan closure — 2026-10-04

Canonical audit:
- `shared-knowledge/CURRICULUM_H01_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`
- `shared-knowledge/curriculum_h01_dependency_anti_orphan_audit_20261004_v0_1.json`

00-room result:
**KEEP_SEPARATE / SCOPE_DEDUP_ONLY / OWNER_APPROVAL_REQUIRED**

Passed:
- Dependency Audit;
- D10 and D11/D17 producer/consumer boundary;
- anti-double-count shared-parent receipt firewall;
- anti-orphan capability inventory;
- divergent-state requirement;
- maturity firewall;
- Formal Core isolation.

Proposed canonical cleanup:
- D09-13 → `Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）`;
- D09-14 → `Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動）`;
- both remain L3/60%;
- no module-count change;
- D09-13 owns industry structural state;
- D09-14 owns issuer-specific strategic-action lifecycle;
- shared market-share/capacity/price/margin evidence remains one parent receipt.

No canonical tracker/router/module wording is changed until explicit owner approval.


## H01 owner approval + canonical update — 2026-10-04

Owner decision: **APPROVED**.

State:
- H01 → **CANONICAL_UPDATE_COMPLETE**.

Executed:
- D09-13 renamed/scoped to `Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）`;
- D09-14 renamed/scoped to `Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動）`;
- D09-13 = industry structural owner;
- D09-14 = issuer strategic-action lifecycle owner;
- shared parent evidence cannot generate two independent votes.

Both remain L3/60%. No module-count or Formal Core change.


## H06 intake — D06-06 Crowding vs D20-06 Herding / Social Proof

Received:
`research/d06_h06_crowding_vs_herding_room05_packet_v0_1.md`

Source:
05｜法人與籌碼研究室

Intake result:
**ROOM05_PACKET_ACCEPTED / ROOM13_COUNTERPART_REQUIRED / TERMINAL_DECISION_NOT_READY**

What passed:
- D06-06 observable crowding ownership;
- structural controls and counterfactuals;
- divergent-state examples;
- anti-double-count rule;
- no intent inference from crowding;
- no maturity promotion;
- Formal Core unchanged.

Still required from 13｜行為金融與市場心理研究室:
- independent behavior-specific observable or replayable residual-herding design;
- common-information / factor / passive-flow / liquidity controls;
- leader/follower or social/network evidence when PIT-capable;
- proof that D20-06 is not merely a narrative relabel of D06-06.

Existing D20-06 research is useful but still states that replayable independent behavioral data is not proven. Therefore H06 remains:
`EVIDENCE_INSUFFICIENT_PENDING_ROOM13_COUNTERPART`.


## H14 00-room closure — D06-11 vs D11-14

Accepted:
- Room05 packet: `research/d06_h14_index_event_vs_passive_flow_room05_packet_v0_1.md`;
- equivalent independent Room08 evidence: `INDEX_ADJUSTMENT_PASSIVE_FLOW_RESEARCH.md` + `research/d11_index_adjustment_pit_receipt_v0_1.json`.

00-room audit:
- `shared-knowledge/CURRICULUM_H14_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`;
- `shared-knowledge/curriculum_h14_dependency_anti_orphan_audit_20261004_v0_1.json`.

Terminal result:
**KEEP_SEPARATE / PRODUCER_CONSUMER_EVENT_FLOW_BOUNDARY / SINGLE_EVENT_RECEIPT**

- D11-14 owns index-event identity and announcement/effective lifecycle.
- D06-11 owns realized passive/index fund flow.
- D06-16 owns ETF mechanics.
- event-imputed flow is not an independent vote;
- missing realized flow remains UNKNOWN;
- D06-11 stays L2/40%;
- D11-14 stays L3/60%;
- no merge, retirement, rename, count or Formal change.

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.


## H09 00-room audit — D16-19 vs D16-25

Equivalent Room11 specialist evidence accepted:
- `research/D16_16_19_MODEL_VALIDATION_CLUSTER_20261004_V0_1.md`;
- `research/D16_D18_VALIDATION_CHECKPOINT.md`;
- `research/D16_25_D15_19_MERGE_DECISION_INPUT_V0_1.md`.

Canonical audit:
- `shared-knowledge/CURRICULUM_H09_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`;
- `shared-knowledge/curriculum_h09_dependency_anti_orphan_audit_20261004_v0_1.json`.

00-room result:
**KEEP_SEPARATE / SCOPE_DEDUP_ONLY / OWNER_APPROVAL_REQUIRED**

Ownership proposal:
- D16-19 owns model/calibrator fitting, calibration implementation, probability-quality diagnostics, model/calibration drift and immutable CalibrationReceipt production.
- D16-25 consumes calibrated probabilities/distributions + calibration-quality metadata and owns prior/Bayesian decision update, uncertainty, expected utility, risk-coverage and ABSTAIN.
- D16-25 may require calibration quality but cannot fit a second calibrator or create a second probability authority.

Maturity remains:
- D16-19 L2/40%;
- D16-25 L2/40%.

No rename, count, maturity or Formal change before approval.


## H07 intake — D03-05 Pullback/Reversal vs D20-09 Behavioral Overreaction

Accepted Room03 evidence:
`research/D03_PULLBACK_REVERSAL_OBSERVABLE_PIT_V0_2.md`.

What is closed on the D03 side:
- observable pullback/reversal episode ownership;
- PIT-safe daily parent + 15m causal state sequence;
- confirmation clock;
- failed-reversal states;
- UNKNOWN origin allowed;
- D03 does not infer behavioral overreaction from the price episode.

State:
`PARTIAL_EVIDENCE_RECEIVED / ROOM13_COUNTERPART_REQUIRED`.

Room13 must still prove D20-09 adds independent behavioral/event-expectation evidence beyond price reversal and falsifies microstructure/liquidity/forced-flow/event-correction alternatives. Without that, D20-09 remains narrowing/merge-eligible rather than a second vote.


## H12 intake — four-layer shorting ontology

Accepted Room05 evidence:
- `research/d06_securities_lending_economics_h12_v0_1.md`;
- `research/d06_18_borrow_fee_identifiability_rule_vintage_v0_1.md`.

Room05 side establishes:
- D06-09 observed borrowing/short quantities as primitive owner;
- D06-18 fee / displayed supply-demand / availability / scarcity economics;
- utilization requires a verified lendable-inventory denominator;
- borrowing != shorting;
- one linked lending receipt / no duplicate bearish votes;
- 2026-06-01 rule-vintage guard for fee settlement/payment clocks;
- divergent D06-09 vs D06-18 states.

State:
`PARTIAL_EVIDENCE_RECEIVED / ROOMS10_13_COUNTERPARTS_REQUIRED`.

Still required:
- Room10: D14-19 establish/maintain/recall/forced-buy-in/exit feasibility state machine and strategy-specific factual HARD_INVALIDATION boundary;
- Room13: D20-13 limits-to-arbitrage context that consumes D06/D14 constraints without becoming another directional vote.

No maturity/count/Formal change from intake.


## H09 owner approval + canonical update — 2026-10-04

Owner decision: **APPROVED**.

State:
`OWNER_APPROVAL_REQUIRED → CANONICAL_UPDATE_COMPLETE`.

Executed:
- D16-19 scope now explicitly owns model/calibrator fitting, probability-quality diagnostics, model/calibration drift and immutable CalibrationReceipt production.
- D16-25 scope now explicitly consumes calibrated probabilities/distributions and owns prior/Bayesian update, uncertainty, utility, risk-coverage and ABSTAIN.
- D16-25 cannot fit a second calibrator or create a second probability authority.
- both remain L2/40%;
- names unchanged;
- no module-count or aggregate-maturity change;
- Formal Core unchanged.

Canonical receipt is recorded separately.


H09 canonical receipts:
- `shared-knowledge/CURRICULUM_H09_CANONICAL_UPDATE_RECEIPT_20261004_V0_1.md`
- `shared-knowledge/curriculum_h09_canonical_update_receipt_20261004_v0_1.json`
