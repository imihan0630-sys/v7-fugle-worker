# System 1 P1-A safety-capture demand decomposition — 2026-10-03

Status: CLASS-A RESEARCH / FORMAL CORE LOCKED / NO CLASS-B AUTHORIZATION

Parents:
- SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_CONTRACT_20261003_V0_1
- research/system1_p1a_conditional_reach_v0_1.mjs
- shared-knowledge/SYSTEM1_S2_CAPTURE_BRIDGE_CLASS_B_PROPOSAL_20261003_V0_1.md

## Purpose

Conditional P1-A F9 only answers whether unresolved safety evidence could matter.
Before any Class-B safety capture is proposed, quantify which safety families
actually create incremental conditional F9 upper-bound demand.

This module measures engineering evidence demand. It does not classify economic
materiality and does not authorize capture.

## Implementation

New module:
research/system1_p1a_safety_capture_demand_v0_1.mjs

Schema:
SYSTEM1_P1A_SAFETY_CAPTURE_DEMAND_V0_1

Matched inputs:
- SYSTEM1_C5_SEMANTIC_REPAIR_V0_2
- SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_V0_1
with identical sessionDate, generationId and strategy.

## Denominators

Reported separately:
- formalRejectedN
- p1aRowsN
- strictF9N
- conditionalF9N
- incrementalConditionalF9N
- conditionalF9WithSafetyUnknownN
- conditionalF9WithoutSafetyUnknownN

Incremental conditional F9 means:
conditional F9 is true AND strict F9 is false.

Thus rows already rankable under strict evidence do not create fake safety
capture demand.

## Safety-family demand

Canonical families only:
- SOURCE_AUTHENTICITY
- SESSION_CONTINUITY
- CORPORATE_ACTION_CONTINUITY
- EXECUTION_FEASIBILITY
- ACCOUNT_RISK

For each family:
- unresolved among all P1-A rows;
- unresolved among conditional F9 rows;
- unresolved among incremental conditional F9 rows;
- corresponding percentages.

Combination distributions are also recorded for:
- all P1-A;
- conditional F9;
- incremental conditional F9.

Verified safety FAIL is not an unresolved demand family.

## Materiality boundary

No numeric materiality threshold exists in the frozen parent contract.
This module therefore never invents one.

Demand states:
- NO_P1A_ROWS
- NO_INCREMENTAL_SAFETY_CAPTURE_DEMAND_OBSERVED
- INCREMENTAL_SAFETY_CAPTURE_DEMAND_MEASURED_THRESHOLD_NOT_FROZEN

Always:
- materialityThresholdStatus = NOT_FROZEN
- materialityClassification = UNCLASSIFIED_THRESHOLD_NOT_FROZEN
- captureLaneAuthorization = NONE
- classBImplementationAuthorized = false

Positive engineering demand does not authorize B1 safety capture.

## C5 Daily integration

buildC5DailyReport is versioned to:
SYSTEM1_C5_DAILY_REPORT_V0_4

It now includes:
- strict SHORT/SWING;
- conditional SHORT/SWING;
- safetyCaptureDemandShort / safetyCaptureDemandSwing.

Post-session evidence therefore identifies which safety receipts would be
needed if future prospective counts justify a Class-B proposal.

## Non-authorizations

- no safety UNKNOWN -> PASS mutation;
- no candidate/WATCH/BUY authority;
- no safety capture persistence;
- no Worker/D1/API/Cron/provider change;
- no Formal gate/ranking/capital/signal/order change;
- no System2 change.

Economic superiority remains UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
