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
| H02 | PARTIAL_EVIDENCE_RECEIVED | D14-03/D14-04 execution-cost child evidence | 10｜投組風控與交易執行研究室 D14-17 umbrella contract |
| H03 | PARTIAL_EVIDENCE_RECEIVED | D15-13 ES/tail-risk evidence | 10｜投組風控與交易執行研究室 D15-24 VaR sub-scope |
| H04 | OWNER_APPROVAL_REQUIRED | equivalent complete Room09 evidence | owner approval for MERGE_ELIGIBLE D12-14 → D12-15 |
| H05 | CLOSED_NO_STRUCTURAL_CHANGE | Room06 + equivalent Room14 D21-10 evidence | — |
| H06 | CLOSED_NO_STRUCTURAL_CHANGE | Room05 + Room13 complete | — |
| H07 | CLOSED_NO_STRUCTURAL_CHANGE | Room03 + Room13 complete | — |
| H08 | CLOSED_NO_STRUCTURAL_CHANGE | Room07 + Room08 + Room13 equivalent complete evidence | — |
| H09 | CANONICAL_UPDATE_COMPLETE | equivalent complete Room11 evidence | — |
| H10 | OWNER_APPROVAL_REQUIRED | Room07 + Room08 equivalent complete evidence | owner approval for SCOPE_DEDUP_ONLY |
| H11 | PARTIAL_EVIDENCE_RECEIVED | Room09 D12 surface/skew research + method QA | 09｜衍生品與國際總經研究室 residual common-parent comparison |
| H12 | PARTIAL_EVIDENCE_RECEIVED | Room05 + Room13 semantic packet | 10｜投組風控與交易執行研究室 + Room13 first live TWSE source receipt |
| H13 | CLOSED_NO_STRUCTURAL_CHANGE | equivalent Room06 + Room15 evidence | — |
| H14 | CLOSED_NO_STRUCTURAL_CHANGE | Room05 packet + Room08 equivalent PIT evidence | — |
| H15 | CLOSED_NO_STRUCTURAL_CHANGE | equivalent Room08 + Room04 evidence | — |
| H16 | CLOSED_NO_STRUCTURAL_CHANGE | equivalent Room04 + Room08 + Room01 evidence | — |
| H17 | PARTIAL_EVIDENCE_RECEIVED | Room09 D13-06 + Room15 D22-04 mechanism/source-boundary evidence | 06｜D07-18 WACC owner + 15｜D22-04 security-level replay |
| H18 | PARTIAL_EVIDENCE_RECEIVED | Room14 D21-07 mechanism/falsification evidence | 06｜基本面與估值研究室 D07-19 project-economics counterpart |
| H19 | PARTIAL_EVIDENCE_RECEIVED | Room03 D03-04 + Room12 D19-04/D19-09 mechanism evidence | 12｜資產定價與因子研究室 paired common-support redundancy/residual tests |
| H20 | CLOSED_NO_STRUCTURAL_CHANGE | Room02 formal return + equivalent Room01/04 evidence | — |

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


## H06 00-room terminal closure — 2026-10-04

Accepted:
- Room05 crowding packet;
- Room13 behavioral counterpart;
- live PTT public-source receipt;
- D20-06 PTT social-herding PIT contract.

Audit:
`shared-knowledge/CURRICULUM_H06_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

Terminal:
**KEEP_SEPARATE / BOUNDED_SOCIAL_HERDING_SUBLANE / SHARED_SOCIAL_RECEIPT_FIREWALL**

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

D06-06 remains L3/60%; D20-06 remains L3/60%. PTT actors are public forum actors only; the same social receipt cannot become independent D20-06/D20-11/D20-07 votes. No structural or Formal change.

Closure receipt:
`shared-knowledge/CURRICULUM_H06_CANONICAL_CLOSURE_RECEIPT_20261004_V0_1.md`.


## H07 00-room terminal closure — 2026-10-04

Accepted:
- Room03 observable pullback/reversal evidence;
- Room13 event-conditioned overreaction counterpart and PIT contract.

Audit:
`shared-knowledge/CURRICULUM_H07_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

Terminal:
**KEEP_SEPARATE / EVENT_CONDITIONED_OVERREACTION_PARENT_VS_REVERSAL_OUTCOME / BEHAVIORAL_CAUSE_FAIL_CLOSED**

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

D03-05 remains L3/60%; D20-09 remains L3/60%. Reversal is excluded from the D20 parent; structural alternatives must be separated or behavioral cause remains UNKNOWN. No structural or Formal change.

Closure receipt:
`shared-knowledge/CURRICULUM_H07_CANONICAL_CLOSURE_RECEIPT_20261004_V0_1.md`.


## H12 Room13 partial counterpart intake — 2026-10-04

Accepted Room13 semantic packet:
`research/d20_h12_limits_to_arbitrage_room13_packet_v0_1.md`.

What is closed on the Room13 semantic side:
- D20-13 remains context/falsification only;
- no directional vote from borrow fee, scarcity or short balance;
- requires an independently identified mispricing/anomaly parent;
- consumes D06 borrow economics and D14 execution feasibility rather than re-owning them;
- true utilization remains UNKNOWN without verified lendable-inventory denominator.

Still unresolved:
1. Room10 D14-19 short execution lifecycle counterpart;
2. first genuine outcome-blind live TWSE rate/supply receipt under the frozen D20-13 capture protocol.

Therefore H12 remains:
`PARTIAL_EVIDENCE_RECEIVED / EVIDENCE_INSUFFICIENT_PENDING_ROOM10_AND_LIVE_SOURCE_RECEIPT`.

No maturity/count/Formal change from intake.


## H05 00-room terminal closure — 2026-10-04

Accepted:
- Room06 specialist packet: `research/h05_d07_25_specialist_evidence_packet_v0_1.json`;
- equivalent independent Room14 D21-10 evidence from `CORPORATE_GOVERNANCE_INSIDER_RESEARCH.md` and checkpoint.

Audit:
`shared-knowledge/CURRICULUM_H05_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

Terminal:
**KEEP_SEPARATE / STATEMENT_ANOMALY_VS_GOVERNANCE_CONTROL_EVENT / SHARED_RESTATEMENT_EVENT_RECEIPT**

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

- D07-25 remains L0/0%; overlap closure does not substitute for its own forensic research.
- D21-10 remains L3/60%.
- original financial vintage remains valid until correction/restatement known_at; corrected values never backfill.
- one restatement/control event has one parent receipt.
- no merge, rename, count, maturity or Formal change.

Closure receipt:
`shared-knowledge/CURRICULUM_H05_CANONICAL_CLOSURE_RECEIPT_20261004_V0_1.md`.


## H11 partial intake — D12-07 vs D12-16

Accepted equivalent Room09 evidence:
- `DERIVATIVES_VOLATILITY_RESEARCH.md`;
- `DERIVATIVES_VOLATILITY_CHECKPOINT.md`;
- `research/d12_13_16_greeks_vrp_surface_semantics_spec_v0_1.json`;
- `research/d12_surface_method_v0_1_spec.json`;
- option-row validator/adversarial QA.

What is already frozen:
- D12-07 = simple interpretable skew/slope + term-structure summaries;
- D12-16 = curvature/smile/richer cross-strike-cross-maturity structure + surface-fit/quality controls;
- one option-chain parent, not duplicate ingestion;
- quote filters, method identity, no-static-arbitrage/interpolation guards;
- complexity must beat D12-07 simple summaries;
- no independent Alpha claim from method complexity.

Still missing for terminal H11:
1. one permitted raw TAIFEX option-chain parent with source identity/hash;
2. parse D12-07 and D12-16 from identical parent rows/common-support;
3. actual residual comparison after D12-07 controls;
4. divergent-state examples from source-attested data;
5. residual/incremental evidence sufficient for terminal KEEP_SEPARATE vs narrowing/merge judgment.

State:
`PARTIAL_EVIDENCE_RECEIVED / ROOM09_COMMON_PARENT_RESIDUAL_TEST_PENDING`.

No maturity/count/Formal change from intake.


## H13 00-room terminal closure — 2026-10-04

Accepted equivalent evidence:
- Room06 D07-06 accounting/balance-sheet ownership;
- Room15 D22-03 PIT component replay, version lineage and credit/funding transform contracts.

Audit:
`shared-knowledge/CURRICULUM_H13_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

Terminal:
**KEEP_SEPARATE / ACCOUNTING_PRIMITIVE_VS_CREDIT_FUNDING_TRANSFORM / SINGLE_BALANCE_SHEET_RECEIPT**

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

D07-06 remains L2/40%; D22-03 remains L3/60%. Net debt is derived; maturity wall is linked but not additive to carrying debt. No structural or Formal change.

Closure receipt:
`shared-knowledge/CURRICULUM_H13_CANONICAL_CLOSURE_RECEIPT_20261004_V0_1.md`.


## H15 / H16 / H20 terminal closures — 2026-10-04

### H15
Terminal:
`KEEP_SEPARATE / EVENT_RISK_TO_VOLATILITY_TO_POST_EVENT_PATH / ONE_OPENING_GAP_RECEIPT`.

- D11-10 = event-linked overnight-gap risk.
- D04-09 = distributional tail/gap volatility state.
- D17-12 = post-gap continuation/fill/reversal path only after the initial gap observation.
- one opening gap cannot become three time-zero votes.

State: `CLOSED_NO_STRUCTURAL_CHANGE`.

### H16
Terminal:
`KEEP_SEPARATE / FOUR_LAYER_PRICE_LIMIT_CHAIN / ONE_LIMIT_EVENT_RECEIPT`.

- D05-02 = price-limit mechanics.
- D11-11 = exit/orderability transformation.
- D01-09 = chart/pattern semantics under price-limit constraints.
- D04-10 = volatility-estimator contamination.
- one limit-hit session cannot become four independent signals.

State: `CLOSED_NO_STRUCTURAL_CHANGE`.

### H20
Terminal:
`KEEP_SEPARATE / MULTI_EVIDENCE_BREAKOUT_FAMILY / NO_INDEPENDENT_COMPONENT_VOTE_UNTIL_RESIDUAL_VALUE`.

- D01-05 = breakout/failure event owner.
- D02-03 = volume-confirmation transform.
- D04-07 = volatility interaction/context transform.
- volume and volatility remain conditional/supportive until preregistered residual incremental value is demonstrated.
- one breakout event cannot receive three automatic votes.

State: `CLOSED_NO_STRUCTURAL_CHANGE`.

No module-count, maturity, Formal or runtime change from these governance closures.


## H18 / H19 partial-intake reconciliation — 2026-10-04

### H18 — D07-19 vs D21-07

Accepted Room14 side:
- D21-07 management incentives / capital-allocation quality = L2/40%;
- compensation/incentive mechanism, short-termism/metric-gaming, alignment, overconfidence/control and reverse-causality falsifiers are frozen;
- capital-allocation outcomes include R&D, capex, M&A, repurchases, dividends, financing and cash;
- raw project economics is not owned by D21-07.

Remaining Room06 delta:
- D07-19 must define project/capital-budget economics: cash-flow forecast, hurdle/discount rate, NPV, IRR limitations, mutually exclusive project ranking, real-option states, sunk-cost/abandonment/deferral/expansion semantics;
- preserve project opportunity set and first-known assumptions independently of management selection;
- demonstrate divergent states: attractive project set + poor allocation; weak project opportunity set + improved governance/incentives;
- shared project economics cannot be counted once as NPV and again as governance quality.

State:
`PARTIAL_EVIDENCE_RECEIVED / ROOM06_D07_19_PROJECT_ECONOMICS_PENDING`.

### H19 — D03-04 vs D19-04 vs D19-09

Accepted:
- D03-04 = within-security/time-series momentum continuation, L3/60%;
- D19-04 = cross-sectional momentum rank/factor semantics, L2/40%;
- D19-09 = residual/factor-neutral momentum semantics, L2/40%;
- Room12 has frozen model-relative residualization, factor-set/version sensitivity, industry-neutralization requirements and anti-double-count governance.

Still missing:
1. same-date / same-universe D03-04 vs D19-04 paired comparison;
2. proof that cross-sectional ranking adds information beyond raw within-security momentum;
3. D19-09 residual after fixed factor/market/industry neutralization;
4. factor-set/version, estimation-window, industry-vintage and residual-hash provenance;
5. costs/capacity/common-support before any independent third vote.

State:
`PARTIAL_EVIDENCE_RECEIVED / ROOM12_COMMON_SUPPORT_REDUNDANCY_RESIDUAL_TESTS_PENDING`.

No maturity/count/Formal change from either intake.


## H17 partial intake — D13-06 → D22-04 → D07-18 cost-of-capital chain

Accepted boundary:
- D13-06 = sovereign/risk-free yield-curve state;
- D22-04 = issuer-specific debt cost / refinancing spread and repricing interaction;
- D07-18 = enterprise WACC / cost-of-capital composite.

Accepted safeguards:
- legacy coupon != current market yield != prospective refinancing cost;
- issuer spread requires currency/duration-consistent benchmark matching;
- one risk-free shock cannot be counted again as issuer credit spread and again as WACC;
- WACC must combine distinct debt/equity/capital-structure inputs rather than copy the Treasury move.

Still missing:
1. D07-18 is L0/0 and needs its own WACC/discount-rate/COE/COD ownership contract;
2. D22-04 needs issuer-security-date historical replay with trade/quote/reference/fair-value provenance and matched benchmark;
3. D13-06 still lacks multidate strict clean source-attested coverage;
4. divergent-state empirical receipts must show stable risk-free + widening issuer spread, rising risk-free + stable spread, and WACC change through equity/capital-structure channel.

State:
`PARTIAL_EVIDENCE_RECEIVED / D07_18_AND_D22_04_REPLAY_GATES_PENDING`.

No maturity/count/Formal change.


## H02 / H03 partial intake + H04 consolidation audit — 2026-10-04

### H02 — D14-03 + D14-04 vs D14-17
Accepted:
- D14-03 signal-price vs fill-price measurement identity = L3/60%;
- D14-04 slippage child metric family = L2/40%;
- current execution-cost ontology already separates explicit, implicit and opportunity costs.

Still missing:
- D14-17 is L0/0 and needs the broader implementation-shortfall / market-impact umbrella contract;
- benchmark taxonomy, cost decomposition tree, partial fill/delay/opportunity cost, replay/schema ownership and D14-12 downstream interface must be explicit;
- no consolidation until D14-17 itself proves capability preservation.

State:
`PARTIAL_EVIDENCE_RECEIVED / D14_17_UMBRELLA_CONTRACT_PENDING`.

### H03 — D15-13 vs D15-24
Accepted:
- D15-13 Expected Shortfall / Tail Risk = L2/40%;
- ES semantic firewall and historical-source prerequisites are frozen.

Still missing:
- D15-24 VaR = L0/0;
- common portfolio/horizon/confidence contract;
- parametric vs historical VaR assumptions;
- VaR tail-blindness / subadditivity / model-risk counterexamples;
- explicit relationship to ES and D16-23 stress testing;
- merged maturity map.

State:
`PARTIAL_EVIDENCE_RECEIVED / D15_24_VAR_SUBSCOPE_PENDING`.

### H04 — D12-14 vs D12-15
Equivalent complete Room09 evidence accepted.

00 audit:
`shared-knowledge/CURRICULUM_H04_CONSOLIDATION_AUDIT_20261004_V0_1.md`.

Recommendation:
**MERGE_ELIGIBLE / D12-15 survivor / D12-14 child proxy family**.

Proposed survivor name:
`Volatility Risk Premium／IV-RV Proxies 波動率風險溢酬與 IV-RV 代理`.

Both remain L2/40 until approval and canonical execution.
Current state:
`OWNER_APPROVAL_REQUIRED`.

No canonical retirement, count, maturity or Formal change has occurred yet.


## H08 closure + H10 scope-de-dup audit — 2026-10-04

### H08
Audit:
`shared-knowledge/CURRICULUM_H08_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

Terminal:
**KEEP_SEPARATE / MEMBERSHIP_VS_EVENT_PROPAGATION_VS_NARRATIVE_DIFFUSION / SHARED_LINEAGE_FIREWALL**

State:
`CLOSED_NO_STRUCTURAL_CHANGE`.

- D09-11 = effective-dated theme/industry/issuer membership bridge.
- D17-11 = event/news propagation with first-known and event half-life.
- D20-11 = independent social-language/topic/stance narrative diffusion.
- one theme/headline/social parent cannot become three independent votes.
- maturity unchanged.

### H10
Audit:
`shared-knowledge/CURRICULUM_H10_SCOPE_DEDUP_AUDIT_20261004_V0_1.md`.

Recommendation:
**KEEP_SEPARATE / SCOPE_DEDUP_ONLY / STRUCTURAL_EXPOSURE_PRODUCER_TO_EVENT_ATTRIBUTION_CONSUMERS**

Proposed canonical ownership:
- D10-12 = structural exposure graph producer.
- D17-04 = event-specific direct-attribution consumer.
- D17-05 = event-specific second-order path consumer.

Current state:
`OWNER_APPROVAL_REQUIRED`.

No rename, module-count, maturity, Formal or runtime change before approval.
