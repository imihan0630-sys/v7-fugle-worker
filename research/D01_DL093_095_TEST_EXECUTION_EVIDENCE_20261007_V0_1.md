# D01 DL-093~095 — Deterministic Research Test Execution Evidence 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_TEST_EXECUTION_EVIDENCE / NOT_NODE_NATIVE / FORMAL_CORE_UNCHANGED

## Execution

The DL-093 and DL-095 helper/test pairs were fetched from the research branch and executed in an independent V8-equivalent isolate.

Environment adaptations only:
- ESM import/export removed for isolate execution;
- node:assert/strict replaced with strict-equivalent equality/truth assertions;
- console output suppressed.

No fixture expectation, research rule, acceptance state, cutoff, witness identity, or fail-closed criterion was changed.

## Results

DL-093 pre-outcome witness oracle:
- 16 / 16 PASS.

DL-095 owner-return acceptance oracle:
- 18 / 18 PASS.

This tranche:
- 34 / 34 PASS.

Cumulative D01 deterministic equivalent execution:
- through DL-092: 229 / 229 PASS;
- DL-093~095: 34 / 34 PASS;
- through DL-095: 263 / 263 PASS.

## Limits

This does not claim:
- native Node parity;
- a physically complete R1-R6 owner-return bundle;
- R7 composability PASS;
- historical OOS results;
- prospective Shadow results;
- D16 incrementality;
- SDA-001 or SDA-002 closure;
- Formal Core promotion.
