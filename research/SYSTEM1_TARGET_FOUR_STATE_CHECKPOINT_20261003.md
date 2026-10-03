# System1 TARGET_AVAILABLE Four-State Checkpoint — 2026-10-03

Status: CLASS-A RESEARCH-ONLY / PR #362 MERGED / CI GREEN / FORMAL CORE LOCKED
Merge commit:
`3948da9f6722844ee26f3a9dbe6340ed0a21e49b`

Parent contract:
`shared-knowledge/SYSTEM1_TARGET_AVAILABLE_FOUR_STATE_FALSIFICATION_CONTRACT_20261003_V0_1.md`

## Implemented

Research observer now emits a parallel target semantic side channel:

- `TARGET_FOUND`
- `TARGET_NONE_SEARCH_COMPLETE`
- `TARGET_UNKNOWN_SOURCE`
- `TARGET_UNKNOWN_GEOMETRY`

The side channel requires explicit source/provenance/search-completeness/geometry evidence.

Critical firewall:
legacy `TARGET_AVAILABLE` gate behavior remains unchanged.

In particular:
legacy `targetState:"NONE"` still produces:
`TARGET_AVAILABLE = FAIL / NO_VERIFIABLE_RESISTANCE`

The new four-state classification is research metadata only and cannot change RR or admission.

## Conservative legacy handling

A legacy `NONE` row does **not** become `TARGET_NONE_SEARCH_COMPLETE` automatically.

It becomes:
- `TARGET_UNKNOWN_SOURCE` if provenance is not verified;
- `TARGET_UNKNOWN_GEOMETRY` if search completeness or geometry is not verified;
- `TARGET_NONE_SEARCH_COMPLETE` only when all required evidence is explicit.

This prevents historical NONE from being backfilled into a cleaner semantic category after outcomes are known.

## Deterministic fixture coverage

Tests verify:
1. verified FOUND -> `TARGET_FOUND`;
2. verified search-complete NONE -> `TARGET_NONE_SEARCH_COMPLETE`;
3. legacy gate remains FAIL for NONE;
4. missing provenance -> `TARGET_UNKNOWN_SOURCE`;
5. incomplete search -> `TARGET_UNKNOWN_GEOMETRY`;
6. no Formal result changes.

## CI receipts

Validated PR head:
`9c401397a0b9361100e24b526472b0ae1bb91b81`

- Formal Gate Overlap Observer Research run `37106548264`: PASS
- V8 Regression Tests run `37106548319`: PASS
- V8 Repair CI run `37106548282`: PASS

## Formal firewall

Unchanged:
- `Worker.js` SHA remains `24fd61d7b8dfd5610c40cc67a2b6807dd622bd73`;
- nearestRealResistance();
- RR >= 2;
- A/B;
- Grade;
- ranking;
- 3+3 / Top6;
- allocation;
- BUY / ADD / REDUCE / SELL;
- push/orders.

Formal Core impact: **NONE**
FORMAL_OPTIMIZATION_CANDIDATE: **NONE**

## Exact continuation

1. Start collecting explicit target provenance/search-completeness receipts on future complete C1/C2 generations.
2. Do not reclassify old NONE rows unless their provenance/search completeness was already frozen contemporaneously.
3. Accumulate A and B separately.
4. Join mature outcomes only after state classification is frozen.
5. Test whether genuine `TARGET_NONE_SEARCH_COMPLETE` is:
   - immaterial,
   - neutral/redundant,
   - harmful,
   - or an opportunity-bearing state.
6. No replacement target/RR method until a separate preregistered Shadow experiment exists.
