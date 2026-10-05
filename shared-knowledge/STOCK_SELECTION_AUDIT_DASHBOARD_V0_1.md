# Stock Selection Audit Dashboard V0.1

Updated: 2026-10-06 Asia/Taipei
Status: ACTIVE_REMEDIATION_AND_VALIDATION
Owner: 00｜研究總控室
Formal Core impact: NONE
Queue: shared-knowledge/stock_selection_audit_queue_v0_1.json

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
| SDA-012 | HIGH | BLOCKED_DEPENDENCY | D12 | SAME_PARENT_AND_ROLL_RESEARCH_STRONG_SAME_EFFECTIVE_DATE_LANE_FEASIBLE_OWNER_GATES_AND_COMMON_SUPPORT_PENDING |
| SDA-013 | HIGH | REMEDIATION_IN_PROGRESS | D13, D18 | REVISION_AND_CLOCK_FIREWALL_DEEPENED_CROSS_MARKET_DATE_MATCHING_REJECTED_CANONICAL_RECEIPT_PENDING |
| SDA-014 | HIGH | VALIDATION_PENDING | D14 | RESEARCH_EXECUTION_CONTRACT_STRONG_PROSPECTIVE_BROKER_RECEIPTS_PENDING |
| SDA-015 | HIGH | REMEDIATION_IN_PROGRESS | D15 | PLAN_TIME_SEMANTIC_FIREWALL_STRONG_PRETRADE_RISK_VERSION_AND_PROSPECTIVE_ATTRIBUTION_PENDING |
| SDA-016 | CRITICAL | REMEDIATION_IN_PROGRESS | D16 | ROOM11_V0_2_ORACLE_FROZEN_SYSTEM1_PARTIAL_PASS_SHARED_CROSS_SYSTEM_AUTHORITY_PENDING |
| SDA-017 | CRITICAL | REMEDIATION_IN_PROGRESS | D18 | ROOM11_V0_2_ORACLE_FROZEN_EXISTING_D18_MACHINE_PARTIAL_PASS_EPISODE_SUPPORT_ENGINE_PENDING |
| SDA-018 | HIGH | REMEDIATION_IN_PROGRESS | D19 | FACTOR_ZOO_GOVERNANCE_STRONG_D19_12_SCHEDULED_CALENDAR_KNOWNAT_FIRST_RECEIPT_CHALLENGER_OOS_PENDING |
| SDA-019 | HIGH | VALIDATION_PENDING | D20 | FIRST_PRIMARY_SOCIAL_PARENT_DURABLE_COVERAGE_AND_RESIDUAL_EVIDENCE_IMMATURE_D20_13_LIVE_SOURCE_PENDING |
| SDA-020 | MEDIUM | REMEDIATION_IN_PROGRESS | D21 | HINDSIGHT_FIREWALL_STRONG_INSIDER_PLEDGE_CLOCK_AND_SYSTEM_LINEAGE_PENDING |
| SDA-021 | MEDIUM | REMEDIATION_IN_PROGRESS | D22 | CREDIT_LAYER_AND_PROVENANCE_FIREWALL_STRONG_SAME_POP_BASELINE_MARKET_CREDIT_AND_RECOVERY_EVIDENCE_PENDING |

## Latest incremental intake

Receipt:
shared-knowledge/STOCK_SELECTION_AUDIT_INCREMENTAL_INTAKE_20261006_V0_2.md

Newly credited:
- SDA-019: first deterministic primary social parent is durable; evidence remains far below coverage gates and D20-13 live source remains missing.
- SDA-018: first bounded scheduled annual-calendar knownAt witness is durable; it is source-clock evidence only, not factor efficacy.
- SDA-013: cross-market calendar-date matching is explicitly rejected; first-eligible-Taiwan-decision clock semantics are strengthened.
- SDA-012: a same-effective-date derivatives lane is feasible, but protected H04/H11/COV-07 and common-support gates remain.
- D07-18 WACC: no new ticket; it is classified as a composite consumer of existing D13/D22/D07 parents and must not create an independent vote when later consumed by D08 or a system.
- System2 S2-07 query-integrity progress does not count as SDA-016/017 remediation.

## Launch-critical summary

- SDA-001: System1 PR #608 merged; schema deltas + genuine receipt + System2 + D16 remain.
- SDA-004: System1 alias/parameter core guard merged; genuine receipt + System2 + D16 remain.
- SDA-009: D09 leave-one-out semantics frozen; System1 diagnostic pending.
- SDA-016: Room11 V0.2 T01-T30 contract; shared cross-system consumption authority pending.
- SDA-017: Room11 V0.2 T01-T40 contract; System2 episode/support observer + prospective multi-episode evidence pending.

## Operating rule

Every new commit/receipt is checked for:
1. which SDA ticket it actually addresses;
2. whether it satisfies a frozen remaining delta;
3. whether it merely improves knowledge/source feasibility rather than Alpha validation;
4. whether it creates a cross-domain duplicate-vote risk;
5. whether unrelated progress is being accidentally credited to the wrong ticket.

No ticket is closed by maturity percentage, documentation volume, synthetic fixtures or unrelated System progress.
Formal Core remains locked unless separately owner-approved.
