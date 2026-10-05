# Stock Selection Audit Dashboard V0.1

Updated: 2026-10-06 Asia/Taipei
Status: ACTIVE_REMEDIATION_AND_VALIDATION
Owner: 00｜研究總控室
Formal Core impact: NONE
Queue: `shared-knowledge/stock_selection_audit_queue_v0_1.json`

## Current snapshot

- Tickets: 21
- Domains covered: 22
- CRITICAL: 5
- HIGH: 14
- MEDIUM: 2
- REMEDIATION_IN_PROGRESS: 15
- VALIDATION_PENDING: 4
- BLOCKED_DEPENDENCY: 2
- ROUTED: 0
- CLOSED: 0

The important change from the first baseline is that SDA-009 is no longer merely routed: Room07 has frozen the leave-one-out D09 semantics and engineering is now pending.

## Queue dashboard

| Ticket | Severity | Status | Domains | Current readiness / blocker |
|---|---|---|---|---|
| SDA-001 | CRITICAL | REMEDIATION_IN_PROGRESS | D01, D02, D03 | SYSTEM1_CLASS_A_MERGED_PASS_D03_READBACK_PASS_WITH_SCHEMA_GAPS_SYSTEM2_AND_GENUINE_RECEIPT_PENDING |
| SDA-002 | HIGH | REMEDIATION_IN_PROGRESS | D01 | D01_CAUSAL_HINDSIGHT_FIREWALL_DEEPENED_LATEST_ADVERSARIAL_TEST_EXECUTION_PENDING |
| SDA-003 | HIGH | VALIDATION_PENDING | D02 | LIVE_15M_OBSERVABILITY_PROVEN_H001_FAIL_CLOSED_RUNTIME_AND_PROVENANCE_BLOCKERS_BEFORE_CLEAN_RESIDUAL_EVIDENCE |
| SDA-004 | CRITICAL | REMEDIATION_IN_PROGRESS | D03 | SYSTEM1_ALIAS_PARAMETER_GUARD_MERGED_D03_MAPPING_PASS_SYSTEM2_D16_AND_GENUINE_RECEIPT_PENDING |
| SDA-005 | HIGH | VALIDATION_PENDING | D04 | RESEARCH_ANTI_DOUBLE_COUNT_COMPLETE_PROSPECTIVE_INCREMENTAL_EVIDENCE_PENDING |
| SDA-006 | HIGH | REMEDIATION_IN_PROGRESS | D05 | OBSERVABILITY_FIREWALL_EXISTS_EXECUTION_CAPACITY_RECEIPTS_PENDING |
| SDA-007 | HIGH | REMEDIATION_IN_PROGRESS | D06 | D06_LEARNING_SEMANTIC_REMEDIATION_COMPLETE_ENGINEERING_LINEAGE_AND_D16_INCREMENTALITY_PENDING |
| SDA-008 | HIGH | REMEDIATION_IN_PROGRESS | D07, D08 | D08_SURVIVORSHIP_GUARD_STRONG_CROSS_DOMAIN_FINANCIAL_VINTAGE_COVERAGE_PENDING |
| SDA-009 | CRITICAL | REMEDIATION_IN_PROGRESS | D09 | D09_LEAVE_ONE_OUT_SEMANTICS_FROZEN_SYSTEM1_DIAGNOSTIC_PENDING |
| SDA-010 | HIGH | BLOCKED_DEPENDENCY | D10, D17 | RESEARCH_BOUNDARY_READY_OWNER_GATES_AND_VERSIONED_GRAPH_EVIDENCE_PENDING |
| SDA-011 | HIGH | REMEDIATION_IN_PROGRESS | D11, D17 | FIRST_KNOWN_GOVERNANCE_EXISTS_CANONICAL_EVENT_STORY_DEDUP_AND_SOURCE_COVERAGE_PENDING |
| SDA-012 | HIGH | BLOCKED_DEPENDENCY | D12 | SAME_PARENT_AND_ROLL_RESEARCH_STRONG_OWNER_GATES_AND_PROSPECTIVE_INCREMENTALITY_PENDING |
| SDA-013 | HIGH | REMEDIATION_IN_PROGRESS | D13, D18 | REVISION_AND_CLOCK_FIREWALL_STRONG_CANONICAL_RECEIPT_AND_INCREMENTAL_EVIDENCE_PENDING |
| SDA-014 | HIGH | VALIDATION_PENDING | D14 | RESEARCH_EXECUTION_CONTRACT_STRONG_PROSPECTIVE_BROKER_RECEIPTS_PENDING |
| SDA-015 | HIGH | REMEDIATION_IN_PROGRESS | D15 | PLAN_TIME_SEMANTIC_FIREWALL_STRONG_PRETRADE_RISK_VERSION_AND_PROSPECTIVE_ATTRIBUTION_PENDING |
| SDA-016 | CRITICAL | REMEDIATION_IN_PROGRESS | D16 | ROOM11_V0_2_ORACLE_FROZEN_SYSTEM1_PARTIAL_PASS_SHARED_CROSS_SYSTEM_AUTHORITY_PENDING |
| SDA-017 | CRITICAL | REMEDIATION_IN_PROGRESS | D18 | ROOM11_V0_2_ORACLE_FROZEN_EXISTING_D18_MACHINE_PARTIAL_PASS_EPISODE_SUPPORT_ENGINE_PENDING |
| SDA-018 | HIGH | REMEDIATION_IN_PROGRESS | D19 | FACTOR_ZOO_GOVERNANCE_STRONG_FACTOR_RECEIPTS_AND_CHALLENGER_OOS_PENDING |
| SDA-019 | HIGH | VALIDATION_PENDING | D20 | BEHAVIOR_IDENTIFIABILITY_FIREWALL_STRONG_PRIMARY_PROSPECTIVE_AND_RESIDUAL_EVIDENCE_PENDING |
| SDA-020 | MEDIUM | REMEDIATION_IN_PROGRESS | D21 | HINDSIGHT_FIREWALL_STRONG_INSIDER_PLEDGE_CLOCK_AND_SYSTEM_LINEAGE_PENDING |
| SDA-021 | MEDIUM | REMEDIATION_IN_PROGRESS | D22 | CREDIT_LAYER_AND_PROVENANCE_FIREWALL_STRONG_SAME_POP_BASELINE_MARKET_CREDIT_AND_RECOVERY_EVIDENCE_PENDING |

## Launch-critical readback

### SDA-001
System 1 PR #608 is merged. Class-A lineage/dedup Shadow diagnostics exist and D03 mapping readback passes conservatively. Three diagnostic schema gaps, first genuine-session receipt, System2 matching diagnostic and D16 incrementality remain.

### SDA-004
System 1 alias/parameter-family guard is merged and D03 mapping passes. Genuine-session evidence, System2 corresponding consumption behavior and D16 multiplicity/residual evidence remain.

### SDA-009
Room07 leave-one-out semantics are frozen. System1 inclusive-vs-LOO candidate-self-contribution / gate / rank / Top6 diagnostic remains.

### SDA-016
Room11 V0.2 oracle has 30 blocking tests. System1 exact-dataset/mutation guard is a partial pass only. Shared cross-system consumption authority, overlap/footprint/release lineage and independent 00 closure remain.

### SDA-017
Room11 V0.2 oracle has 40 blocking tests. Existing D18 fixed-semantic machine is a partial pass only. System2 episode/support observer, learned-fit clock lineage, prospective multi-episode evidence and independent 00 closure remain.

## Launch HIGH readback

- SDA-002: D01 causal/hindsight firewall continues to deepen, but newest adversarial suites remain TEST_EXECUTION_PENDING.
- SDA-003: live 15m observability is physically proven; no clean H001 event because baseline, raw provenance and runtime/session continuity fail closed.
- SDA-007: D06 learning semantic remediation is complete; machine receipt-lineage enforcement and D16 residual validation remain.
- SDA-005 / SDA-014 / SDA-019 remain validation-driven.
- SDA-006 / SDA-008 / SDA-011 / SDA-013 / SDA-015 / SDA-018 remain remediation-driven.
- SDA-010 / SDA-012 remain behind protected owner/dependency gates.

## Current operating rule

00 does not restart accepted research.

On every returned commit/receipt:
1. map it to one or more SDA tickets;
2. compare only against frozen `remainingDelta`;
3. credit durable work;
4. advance status only if the lifecycle gate is actually met;
5. require D16 validation where applicable;
6. preserve independent 00 closure for SDA-016/SDA-017;
7. never treat maturity percentage, documentation, synthetic fixtures or a single unit-test pass as ticket closure.

Formal A/B, ranking, Top6, weights, thresholds, capital and trading behavior remain locked unless separately owner-approved.
