# Hybrid Role Execution Registry 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: ROLE_ELIGIBILITY_GOVERNANCE_COMPLETE / SPECIALIST_VALIDATION_PENDING
Formal Core impact: NONE

## Purpose

Single registry for the eight Hybrid role-conflict validation groups created by the curriculum role eligibility audit.

Parent governance:
- `shared-knowledge/HYBRID_SELECTION_EXECUTION_DIRECTIVE_V0_1.md`
- `shared-knowledge/PROBABILISTIC_SELECTION_GOVERNANCE_V0_1.md`
- `shared-knowledge/HYBRID_ROLE_ELIGIBILITY_AUDIT_20261003_V0_1.md`
- `shared-knowledge/HYBRID_ROLE_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

## Registry

| ID | Risk family | Rooms | Status |
|---|---|---|---|
| R01 | DATA_INTEGRITY_PIT_PROVENANCE | 11 + source rooms | VALIDATION_PENDING |
| R02 | EXECUTION_ORDERABILITY | 04 + 10 + 08 | VALIDATION_PENDING |
| R03 | PORTFOLIO_RISK_SIZING | 10 | VALIDATION_PENDING |
| R04 | MACRO_REGIME | 09 + 11 | VALIDATION_PENDING |
| R05 | BEHAVIORAL_GOVERNANCE_IDENTIFIABILITY | 13 + 14 + source rooms | VALIDATION_PENDING |
| R06 | FLOW_LENDING_CROWDING | 05 + 10 + 12 + 13 | VALIDATION_PENDING |
| R07 | CORPORATE_ACTION_EVENT_CONTINUITY | 08 + 10 | VALIDATION_PENDING |
| R08 | VALIDATION_DECISION_ARCHITECTURE | 11 | VALIDATION_PENDING |

## Integration boundary

### System 1
This registry is a governance input to Track A2 Gate Role Inventory.
It does not classify or change any current production gate by itself.
The System 1 execution room must read the actual latest Formal gate definitions and map them against this eligibility overlay.

### System 2
This registry is a governance input to Track B1 machine-readable role maps.
Each strategy still chooses its own evidence families and actual roles.
No universal 354-module score or vote is permitted.

## Completion criteria

A role-conflict group is complete only when:
1. module/evidence family roles are explicit;
2. forbidden automatic roles are explicit;
3. strategy/horizon dependence is explicit;
4. UNKNOWN handling is explicit;
5. redundancy/shared-receipt ownership is explicit;
6. HARD_INVALIDATION burden of proof is documented where relevant;
7. PRIMARY_ALPHA burden of proof is documented where relevant;
8. Formal Core remains unchanged unless separately approved.

## Current state

R01-R08 specialist validation pending.
Curriculum module count and maturity are unchanged.
