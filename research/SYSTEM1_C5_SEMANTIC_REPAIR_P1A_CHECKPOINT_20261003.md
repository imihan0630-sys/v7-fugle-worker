# System 1 C5 semantic repair + P1-A reach funnel checkpoint — 2026-10-03

Status: CLASS-A RESEARCH / FORMAL CORE LOCKED / NOT DEPLOYED

Authority:
- shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md
- shared-knowledge/system1_a2_gate_role_inventory_20261003_v0_1.json
- shared-knowledge/SYSTEM1_P1A_MINIMAL_BLOCKING_AND_OUTCOME_CONTRACT_20261003_V0_1.md
- shared-knowledge/SYSTEM1_S1_S2_SHADOW_EXECUTION_REGISTRY_20261003_V0_1.md

## S1 semantic repair

New module:
research/system1_c5_semantic_repair_v0_2.mjs

The V0.1 C5 role map remains replayable and is not rewritten.

V0.2 aligns research semantics to A2:
- RS_CONTEXT -> CONFIDENCE_UNCERTAINTY
- CHIP_CONCENTRATION_PRESENT -> CONFIDENCE_UNCERTAINTY
- FUNDAMENTAL_COMPONENT_COUNT -> CONFIDENCE_UNCERTAINTY
- DAILY_ABNORMALITY -> CONTEXT_ONLY
- LIQUIDITY -> CONFIDENCE_UNCERTAINTY
- SECTOR_GATE -> CONTEXT_ONLY
- TARGET_AVAILABLE -> CONFIDENCE_UNCERTAINTY

The full A2 JSON gate map is parity-tested for SHORT and SWING.

UNKNOWN remains a state, not a negative economic vote and never becomes PASS.
A verified factual FAIL on a true safety/owner hard gate remains HARD_INVALIDATION.
Safety UNKNOWN is UNKNOWN_CONTAMINATED, not HARD_BLOCKED and not admissible.

## Full blocking sets

Every Formal-rejected row receives:
- hardBlockSet
- confidenceBlockSet
- contextBlockSet
- primaryBlockSet
- supportiveBlockSet
- unknownDependencySet
- notEvaluableDependencySet
- p1aBlockSet
- safetyUnknownSet
- minimalUnblockClass
- reachStage
- sessionDate / generationId / decisionAt
- sourceVintageReceiptIds, or explicit UNAVAILABLE_IN_C1_DIAGNOSIS

formalFirstFailure is preserved only as descriptive metadata and is never causal attribution.

## S2 P1-A reach funnel

P1-A base semantic blockers:
- RS_CONTEXT
- CHIP_CONCENTRATION_PRESENT
- FINANCIAL_SOURCE_COMPLETENESS
- FUNDAMENTAL_COMPONENT_COUNT

MARKET_CAP_FLOOR is mixed:
- UNKNOWN market-cap evidence is treated as P1-A confidence uncertainty;
- verified FAIL below the known threshold remains an economic/context role for SHORT and PRIMARY_ALPHA for SWING.

Reach stages are:
F0_FORMAL_PARENT
F1_SAFETY_EVALUABLE
F2_OWNER_UNIVERSE
F3_P1A_SEMANTIC_BYPASS
F4_AB_EVALUABLE
F5_AB_PASS
F6_TARGET_RR_EVALUABLE
F7_RR_PASS
F8_GRADE_PASS
F9_RANKABLE

P1-A semantic bypass is research reach only. UNKNOWN is not changed to PASS.
p1aRankableN is not a candidate count, WATCH count or BUY count.

Required P1-A counts are produced:
- formalRejectedN
- p1aRejectedN
- p1aOnlyN
- p1aPlusContextN
- p1aPlusPrimaryN
- unknownContaminatedN
- p1aReachABN
- p1aABPassN
- p1aReachRRN
- p1aRRPassN
- p1aGradePassN
- p1aRankableN
- hardBlockedN

## Daily/post-session integration

research/system1_evidence_automation_v0_1.mjs now routes buildC5DailyReport through V0.2.
The daily schema is SYSTEM1_C5_DAILY_REPORT_V0_2.

Post-session packets therefore use the repaired A2/P1-A semantics on future genuine C1/C2 sessions.

No Production runtime, D1 schema, provider calls, Cron, signal, push, order, allocation or System2 path is changed.

## C3 no-retest status

The current research module already contains the preregistered B breakout no-retest continuation:
- completed-bar acceptance above breakout;
- no prior retest;
- maxChase;
- volume/depth/gap/limit/late-stage guards;
- remaining RR >= 2;
- next completed bar open simulated fill;
- STOP_FIRST ambiguous same-bar exit.

Therefore no duplicate C3 no-retest implementation is created in this branch.
The next C3 requirement is genuine prospective outcome evidence, not another algorithm rewrite.

## Evidence boundary

This branch cannot claim:
- that P1-A gates are economically harmful;
- that p1aRankable rows would outperform;
- that no-retest is superior;
- that more candidates are better.

Economic superiority remains UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
Formal Core remains locked.
