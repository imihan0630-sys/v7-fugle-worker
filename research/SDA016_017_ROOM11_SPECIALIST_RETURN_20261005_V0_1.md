# SDA-016 / SDA-017｜Room 11 Specialist Return — 2026-10-05 V0.1

Status: SPECIALIST_VALIDATION_DELTA_FROZEN / NOT_CLOSED
Owner: 11｜統計驗證與策略市場狀態研究室
Independent closure owner: 00｜研究總控室
Formal Core impact: NONE

## SDA-016

Canonical research contract:
`research/SDA016_HOLDOUT_CONSUMPTION_VALIDATION_CONTRACT_20261005_V0_1.md`

Current implementation validation:
`research/SDA016_SYSTEM1_HOLDOUT_GUARD_VALIDATION_20261005_V0_1.md`

State:
`RESEARCH_OWNER_CONTRACT_COMPLETE / SYSTEM1_CLASS_A_PARTIAL_PASS / CROSS_SYSTEM_CONSUMPTION_AUTHORITY_PENDING / 00_CLOSURE_PENDING`

Accepted now:
- immutable experiment version;
- target/benchmark mutation rejection;
- exact-dataset holdout rename cannot reset OOS;
- repeated inspection => development-consumed;
- single outcome lock;
- negative/null/failed result preservation;
- append-only local ledger integrity;
- conservative fixed-inspection default;
- protected Formal outputs unchanged.

Remaining:
1. partial-overlap independent-date lineage and overlap accounting;
2. shared/canonical System 1 + System 2 consumption authority;
3. machine-visible complete outcome-lock identity;
4. no sequential-valid exception until a new D16 contract explicitly freezes it;
5. independent 00 readback.

## SDA-017

Canonical research contract:
`research/SDA017_REGIME_SUPPORT_EPISODE_VALIDATION_CONTRACT_20261005_V0_1.md`

Current implementation validation:
`research/SDA017_EXISTING_D18_MACHINE_VALIDATION_20261005_V0_1.md`

State:
`RESEARCH_OWNER_CONTRACT_COMPLETE / EXISTING_D18_EX_ANTE_MACHINE_PARTIAL_PASS / EPISODE_SUPPORT_ENGINE_PENDING / PROSPECTIVE_MULTI_EPISODE_EVIDENCE_PENDING / 00_CLOSURE_PENDING`

Accepted now:
- decision-time vector clock;
- PIT fail-closed prerequisites;
- UNKNOWN / CONTEXT_RAW preservation;
- no scalar composite hindsight score;
- deterministic vector replay;
- preregistered activation mapping;
- UNKNOWN policy input => DATA_UNKNOWN;
- NATURAL_ZERO_PICK distinct from POLICY_DISABLED;
- identical baseline/challenger cost contract;
- mutated parent accounting rejection.

Remaining:
1. immutable episode identity and official-session adjacency;
2. UNKNOWN gap / vector-version / source-semantic episode breaks;
3. machine support states with effective dates + episodes + occupancy + transitions + paired support;
4. known-but-thin state cannot become promotion-eligible policy evidence;
5. Regime family mutation linked to SDA-016 holdout consumption;
6. genuine prospective multi-episode matured outcomes;
7. independent 00 readback.

## Cross-ticket firewall

Any D18 Regime target/state/threshold/policy/horizon change made after outcome inspection is simultaneously:
- SDA-017 family expansion;
- SDA-016 adaptive holdout consumption.

The old holdout becomes development evidence for the new regime hypothesis and cannot be called untouched OOS.

## Maturity

No curriculum maturity promotion is granted by this specialist return.

D16 remains 60%.
D18 remains 52%.
D16-19 / D16-25 remain L2/40.
D18 L3 modules remain at their current levels; no L4 claim.

FORMAL_OPTIMIZATION_CANDIDATE: NONE
Formal Core: LOCKED

## Exact next

Engineering:
- System 1/System 2 converge SDA-016 consumption authority without redoing passed guards.
- System 2 BUILD_LANE adds SDA-017 episode/support observer under existing D18 semantics.

Room 11:
- validate only the new deltas with adversarial tests;
- do not redo passed semantics;
- do not self-close either ticket.

00:
- independent closure readback after engineering + Room11 revalidation.
