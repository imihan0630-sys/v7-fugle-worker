# System1 S1 Observation-aware Role Checkpoint — 2026-10-03

Status: CLASS-A RESEARCH-ONLY / PR #360 DRAFT / CI GREEN / FORMAL CORE LOCKED
Branch: `research/system1-s1-observation-aware-role-v0-1`
Validated head: `bcf6386ea02157682061647dc6dd5693695fb7e3`

Parent governance:
- `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`
- `shared-knowledge/SYSTEM1_P1A_MINIMAL_BLOCKING_AND_OUTCOME_CONTRACT_20261003_V0_1.md`
- `shared-knowledge/SYSTEM1_S1_S2_SHADOW_EXECUTION_REGISTRY_20261003_V0_1.md`

## Implemented

Research-only C5 now uses an observation-aware role resolver.

Key semantics:
- gate identity alone no longer determines all roles;
- UNKNOWN / NOT_EVALUABLE becomes CONFIDENCE_UNCERTAINTY except true safety authority;
- ANNOUNCEMENT_RISK is HARD only for verified FAIL, not for missing source state;
- MARKET_CAP_FLOOR UNKNOWN is uncertainty while known threshold failure keeps its strategy-specific economic role;
- RS_CONTEXT, CHIP_CONCENTRATION_PRESENT, FINANCIAL_SOURCE_COMPLETENESS and FUNDAMENTAL_COMPONENT_COUNT are treated as P1-A confidence/data-presence candidates under the frozen contract.

C5 output schema advances to:
`SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2`

Added diagnostics:
- full hard/confidence/context/primary/supportive blocking sets;
- unknown / not-evaluable dependency sets;
- minimal-unblock class;
- F0-F9 reach stage;
- confidenceOnlyRejectedN;
- contextOnlyRejectedN;
- P1-A decomposition;
- p1aReachABN / p1aABPassN;
- p1aReachRRN / p1aRRPassN;
- p1aGradePassN;
- p1aRankableN;
- unknownContaminatedN;
- hardBlockedN.

Hard rule:
`p1aRankableN` is diagnostic only and is never a candidate, WATCH or BUY count.

## Fixture coverage

Dedicated tests now verify:
- known economic FAIL vs UNKNOWN role separation;
- ANNOUNCEMENT_RISK UNKNOWN != HARD FAIL;
- MARKET_CAP missing != known threshold failure;
- P1-A-only row can reach F9_RANKABLE only when all non-P1-A dependencies are valid;
- dependent NOT_EVALUABLE state forces UNKNOWN_CONTAMINATED;
- P1-A + AB failure becomes P1A_PLUS_PRIMARY;
- UNKNOWN never becomes PASS.

## Daily evidence automation

Existing C5 daily report remains backward-compatible and now also exposes:
- confidence/context-only rejection counts;
- P1-A counts and reach funnel;
- minimal-unblock classes;
- reach-stage distribution;
- NOT_EVALUABLE gate counts;
- resolver version.

No scheduled collection or production runtime authority is added.

## CI receipts

Validated head `bcf6386ea02157682061647dc6dd5693695fb7e3`:

- V8 Regression Tests run `37106130638`: PASS
- V8 Repair CI run `37106130646`: PASS
- System1 C1 C2 isolated offline repair review run `37106130620`: PASS

An earlier head failed only because the helper timezone regex was accidentally double-escaped during the research refactor. The branch was corrected before this checkpoint; no main/production mutation occurred from that failure.

## Formal firewall

Unchanged:
- `Worker.js`;
- Formal A/B;
- RR >= 2;
- Grade B >= 65;
- ranking comparator;
- 3+3 / Top6;
- allocation;
- BUY / ADD / REDUCE / SELL;
- push;
- orders;
- production runtime.

Formal Core impact: **NONE**
FORMAL_OPTIMIZATION_CANDIDATE: **NONE**

## Exact continuation

1. Merge only as Class-A research-only diagnostics.
2. Wait for the first genuine complete prospective C1/C2 population.
3. Run S1/C5 V0.2 on the exact full matched denominator.
4. Report blocking classes and F0-F9 reach; do not infer economics from counts.
5. Mature outcomes by independent date clusters.
6. Only after P1-A economic classification may P1-B slow-factor Shadow begin.
