# D01 DL-088~091 — Deterministic Research Test Execution Evidence 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_TEST_EXECUTION_EVIDENCE / NOT_NODE_NATIVE / FORMAL_CORE_UNCHANGED

## Execution method

JavaScript helper/test pairs were fetched from the research branch and executed in an independent V8 isolate.

Only environment adaptations were applied:
- ESM import/export removed for isolate execution;
- node:assert/strict replaced with equivalent strict equality/truth assertions;
- console output suppressed.

No research rule, fixture expectation, or pass criterion was changed.

## Results

DL-088~090 data-readiness oracle:
- first attempt stopped because the isolate did not expose structuredClone;
- this was an environment-compatibility failure, not a research-rule assertion failure;
- the test was rewritten to use ordinary object copies without changing expected semantics;
- final result: 14 / 14 PASS.

DL-091 receipt-bundle oracle:
- 15 / 15 PASS.

This tranche:
29 / 29 PASS.

Cumulative deterministic equivalent D01 execution:
- through DL-087: 188 / 188 PASS;
- DL-088~091: 29 / 29 PASS;
- through DL-091: 217 / 217 PASS.

## Limits

This does not claim:
- native Node environment parity;
- historical OOS result evidence;
- prospective Shadow evidence;
- D16 incrementality;
- complete System2 historical replay readiness;
- SDA-001 or SDA-002 closure;
- Formal Core promotion.
