# System1 Zero-Pick Rank-Input Observer V0.1 — 2026-10-03

Status: CLASS-A PURE PROTOTYPE / FORMAL CORE LOCKED / NO WORKER OR D1 INTEGRATION

Parent proposal:
`shared-knowledge/SYSTEM1_ZERO_PICK_RANK_CAPTURE_CLASS_B_PROPOSAL_20261003_V0_1.md`

## Implemented

Pure research constructor:
`research/system1_zero_pick_rank_input_observer_v0_1.mjs`

Dedicated test:
`tests/test_system1_zero_pick_rank_input_observer_v0_1.mjs`

The observer:
- accepts only explicit same-scan source values;
- requires PIT source-known timestamps;
- computes the frozen V7.5.30-style counterfactual priority decomposition;
- preserves the six-field comparator tuple;
- freezes same-pool preSortOrdinal;
- emits a deterministic tuple fingerprint through an injected hash function;
- marks the result as counterfactual research input, never actual Formal rank;
- returns INCOMPLETE and no comparator input when required fields are missing;
- treats a real numeric zero as a value, not as missing;
- performs zero provider calls;
- performs zero D1 writes.

## Semantic guard

This prototype does not call `scoreCandidate()`.
It does not call `applyMarketConsensus()`.
It does not mutate any Formal result.

Its sole purpose is to prove that a future approved Class-B runtime capture can
be isolated as an evidence observer.

## Current boundary

Safe Class-A software preparation is now complete for the zero-pick path:

1. data-gap proof;
2. frozen pure comparator;
3. Class-B capture proposal;
4. pure rank-input observer prototype.

Still blocked:
- Worker integration;
- D1 persistence;
- prospective production receipt;
- zero-pick challenger outcome comparison.

Those require owner-approved Class-B implementation and then genuine future data.

Economic superiority remains UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
