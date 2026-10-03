# System1 Zero-Pick Runtime Source-Time Provenance V0.1 — 2026-10-03

Status: CLASS-A FROZEN / CLASS-B RUNTIME INTEGRATION NOT AUTHORIZED / FORMAL CORE LOCKED

## Finding

The current selector does not expose independent raw source-event timestamps for
`featureRows` or `sectorStats`.

Both objects are already present in the same selector request before
`buildC1PopulationReceipt()` stamps its `decisionAt`.

Therefore a future Class-B capture must **not** invent source-event timestamps
for those objects.

## Frozen timestamp semantics

For feature and sector inputs:

`knownAt = decisionAt`

means only:

> this value was demonstrably present in the same decision request no later than
> the C1 decision timestamp.

It is a conservative request-local known-by upper bound.
It is **not** the exchange publication time, feed event time, fetch time or raw
provider timestamp.

The child receipt must carry provenance explicitly stating
`notSourceEventTime=true`.

## Market-consensus exception

The exact-date `V7_MARKET_CONSENSUS` reference already has an `updatedAt`
field when created.

Rules:

- use the reference only when `marketDate === scanDate`;
- preserve `updatedAt` as reference-event metadata when present;
- if that timestamp is later than C1 `decisionAt`, reject the observer source;
- a missing/wrong-date reference is represented as
  `ABSENT_OR_WRONG_DATE_AT_DECISION`;
- a wrong-date reference contributes zero sources even if its bySymbol row has a
  non-zero sourceCount;
- never query a later snapshot to repair the decision receipt.

For the comparator's PIT guard, the same-request known-by time remains
`decisionAt`. This is deliberately conservative and does not claim more timing
precision than the runtime actually has.

## Runtime adapter

Pure Class-A module:

`research/system1_zero_pick_runtime_source_adapter_v0_1.mjs`

It translates already-in-memory runtime values into
`SYSTEM1_ZERO_PICK_RANK_OBSERVER_SOURCE_V0_1` without external I/O or provider
calls.

## Boundary

This closes the timestamp-semantics design gap only.

Still not authorized:

- Worker integration;
- D1 child persistence;
- production prospective receipt generation.

Economic superiority remains UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
Formal Core remains LOCKED.
