# System1 S1-S2 Shadow Execution Registry 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: S1_S2_RESEARCH_SEQUENCE_FROZEN / CLASS_A_ONLY / FORMAL_CORE_LOCKED

## Purpose

Freeze the execution order for the System1 low-BUY overfilter investigation.

## S1 — Semantic Repair

Goal:
correct research-only role semantics without changing any production gate.

Required:
- distinguish data presence from economic evidence;
- classify UNKNOWN separately from FAIL;
- produce full blocking sets;
- compute minimal-unblock class;
- preserve firstFailure only as descriptive metadata.

Completion condition:
research diagnostics can distinguish HARD / CONFIDENCE / CONTEXT / PRIMARY / SUPPORTIVE without changing Formal behavior.

## S2 — P1-A Reach Funnel

Parent contract:
`shared-knowledge/SYSTEM1_P1A_MINIMAL_BLOCKING_AND_OUTCOME_CONTRACT_20261003_V0_1.md`

Goal:
measure how far Formal-rejected rows can proceed when P1-A data-presence failures stop being interpreted as negative economic evidence.

Required funnel:
F0 -> F1 -> F2 -> F3 -> F4 -> F5 -> F6 -> F7 -> F8 -> F9.

Hard rule:
UNKNOWN is never converted to PASS.

Primary output:
`p1aRankableN`, plus blocking-class decomposition.

## S2B — Target semantic side-study

Parent:
`shared-knowledge/SYSTEM1_TARGET_AVAILABLE_FOUR_STATE_FALSIFICATION_CONTRACT_20261003_V0_1.md`

This is **not** merged into P1-A.

It runs as a separate P2 semantic study:
- TARGET_FOUND
- TARGET_NONE_SEARCH_COMPLETE
- TARGET_UNKNOWN_SOURCE
- TARGET_UNKNOWN_GEOMETRY
- derived TARGET_FOUND_TOO_CLOSE

No alternative RR substitute is authorized in V0.1.

## Outcome maturity

No economic conclusion until:
- result horizon matures;
- symbol and date-cluster outcomes are available;
- relevant Regimes are represented;
- costs/fill feasibility are available where actionable;
- matched denominator is preserved.

## Forbidden shortcuts

Do not use:
- candidate count increase as success;
- firstFailure frequency as causal attribution;
- UNKNOWN->PASS;
- missing-data imputation;
- pooled-symbol significance without date clustering;
- A/B/Sector/RR simultaneous relaxation;
- ex-post target substitute selection.

## Promotion order

1. S1 semantic repair.
2. S2 P1-A reach funnel.
3. Mature outcome join.
4. P1-A economic classification.
5. Only if positive, P1-B slow-factor Shadow.
6. P2 families remain separate.
7. Class-C proposal only after normal Formal-switch maturity gates and owner approval.

Formal Core impact: NONE.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
