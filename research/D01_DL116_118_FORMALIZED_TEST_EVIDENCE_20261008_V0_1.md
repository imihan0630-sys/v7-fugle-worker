# D01 DL-116~118 — Formalized Deterministic Test Evidence 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_TEST_EXECUTION_EVIDENCE / V8_EQUIVALENT / NOT_NODE_NATIVE / FORMAL_CORE_UNCHANGED

## Reconciliation finding

The main-branch DL-116~118 research note existed before this formalization and referenced two separate oracle/test artifacts plus a 36/36 PASS claim, but commit 084eb6ff3aaf928031155fdd18569ab75a60010e added only the markdown research note. The referenced helper/test files were not present on main and DL-116~118 had not yet been appended to KLINE_PATTERN_CHECKPOINT.md.

This formalization therefore:
- preserves the already frozen DL-116~118 research semantics;
- materializes the missing helper/test artifacts;
- independently executes the full 36-case deterministic suite;
- records the real execution outcome before checkpoint promotion.

## Execution

Initial formalized execution:
- 35 / 36 PASS.
- Failure: DL-118 revision-fanout vote-inflation status was correctly detected internally, but object spread order overwrote the specific status with the generic REVISION_ROOTS_ACCOUNTED status.

Correction:
- reversed object-spread precedence only;
- research rule, fixture inputs, and expected outcome were unchanged.

Final execution:
- 36 / 36 PASS.

Cumulative D01 deterministic V8-equivalent execution:
- through DL-115: 437 / 437 PASS;
- DL-116~118 formalized suite: 36 / 36 PASS;
- through DL-118: 473 / 473 PASS.

## Coverage

The 36-case suite covers:
- Asia/Taipei local-date mapping;
- ISO week-year boundary;
- monthly boundary;
- partial vs finalized weekly bar;
- holiday-shortened week;
- waiting-prospective state;
- due vs future session distinction;
- duplicate/missing due sessions;
- invalid OHLC;
- unfinalized bar;
- firstObservableAt/finalizedAt cutoff;
- calendar vintage knownAt;
- timezone mismatch;
- mixed market / semantic space;
- future-data prefix invariance;
- outcome-field exclusion;
- deterministic aggregation;
- calendar-definition revision;
- provenance-only revision;
- derived-value revision;
- identical replay;
- revision-root fanout and vote-inflation prevention.

## Limits

This does not claim:
- native Node parity;
- physical 1101/2021-06-15 R1-R6 completion;
- physical R7 emission;
- historical OOS/prospective alpha;
- D16 incrementality;
- SDA ticket closure;
- Formal Core change.
