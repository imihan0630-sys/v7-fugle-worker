# D03 Bollinger First Genuine Parent Acceptance V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / EXECUTABLE_ACCEPTANCE_LOGIC_READY / PHYSICAL_PARENT_PENDING
Formal Core: LOCKED

## Purpose

Make the next genuine post-V8.17 Bollinger L3 decision mechanical instead of redesigning the gate after data arrive.

This artifact does not create a parent, continuity receipt or maturity promotion.

## TI-606 — exact parent identity consumed

A future attempt is keyed by the already-deployed shared Shadow parent identity:
- scanDate;
- captureGeneration;
- symbol;
- parentSnapshotHash;
- parent knownAt.

No D03-specific parent is allowed.

## TI-607 — exact finite-window input gate

For Bollinger20x2:
- exactly 20 expected eligible symbol sessions;
- exactly 20 source bars;
- date sets identical;
- no duplicate date;
- positive finite Close;
- each bar symbol-session verified;
- TECHNICAL_CONTINUITY true;
- corporate-action continuity resolved;
- zero unresolved missing sessions/events;
- source/receipt capture no later than parent knownAt;
- formulaVersion fixed to `BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1`;
- stdDefinition fixed to POPULATION.

Missing/late/mismatched evidence fails closed.

## TI-608 — constrained sessions remain visible

A continuity-valid window with price-limit-constrained bars may be:
`VALID_BUT_CONSTRAINED`.

It can prove data feasibility while remaining excluded from ordinary unconstrained interpretation.

Constraint does not become missing data and is not silently ignored.

## TI-609 — complete parent attempt accounting

A run is COMPLETE only when:
- every expected parent key has exactly one attempt;
- no duplicate attempt;
- no orphan attempt;
- attempt count equals expected parent count.

VALID, VALID_BUT_CONSTRAINED, DATA_BLOCKED and UNKNOWN are all persisted outcomes.

A run with 1,799/1,800 attempts is INCOMPLETE even if every persisted row is numerically valid.

## TI-610 — maturity remains physical-parent gated

Deterministic fixture proves the acceptance logic:
- clean exact 20-session window -> VALID;
- capture after parent -> DATA_BLOCKED;
- missing bar -> DATA_BLOCKED;
- duplicate date -> DATA_BLOCKED;
- constrained bar -> VALID_BUT_CONSTRAINED;
- missing expected parent attempt -> INCOMPLETE;
- complete expected set with UNKNOWN preserved -> COMPLETE.

This closes the acceptance-logic design gap only.

D03-10 remains L2/40 until at least one genuine post-deployment Taiwan parent generation and its physical continuity attempts are read back under this contract.

D03 remains 56.7%.

Durable files:
- `research/d03_bollinger_l3_acceptance_v0_1.mjs`
- `tests/test_d03_bollinger_l3_acceptance_v0_1.mjs`
