# SDA-009 System 1 Diagnostic Handoff 2026-10-06

Status: READY_FOR_SYSTEM1_CLASS_A_DIAGNOSTIC_IMPLEMENTATION
Owner source room: 07｜產業與供應鏈研究室
Engineering owner: System 1
Audit ticket: `SDA-009`
Observed main: `ee664dac5008a5a7bc77f01fdaf2550ee1b572d0`
Formal Core impact authorized: NONE

## Objective

Implement candidate-specific inclusive-versus-leave-one-out D09 sector diagnostics on genuine same-generation selection inputs, without changing Formal A/B eligibility, sector gate, priorityScore, ranking, Top6, capital or trading behavior.

## Authoritative research inputs

Read:
1. `research/sda009_d09_leave_one_out_circularity_contract_v0_1.json`
2. `research/SDA009_D09_LEAVE_ONE_OUT_CIRCULARITY_CONTRACT_V0_1.md`
3. `research/SDA009_R1_REPLAY_PREFLIGHT_20261005_V0_1.md`
4. `research/SDA009_R2_RECEIPT_ORACLE_CHECKPOINT_20261006.md`
5. `research/sda009_r2_receipt_oracle_v0_1.mjs`
6. `shared-knowledge/STOCK_SELECTION_SHADOW_LAUNCH_GATE_V0_1.md`

## Minimum machine-visible output

For each candidate on a verified same-generation parent:
- scanDate;
- generationId;
- candidateSymbol;
- classificationSchemeId;
- membershipVersion;
- inclusiveSectorState;
- leaveOneOutSectorState;
- candidateSelfContribution;
- supportState;
- replayTrust;
- priorityScoreDeltaFromSector;
- gateFlip;
- rawRank;
- leaveOneOutDiagnosticRank;
- rawTop6;
- leaveOneOutTop6;
- warmupPriorityDelta where applicable.

The leave-one-out sector score must recompute the candidate-specific cross-sector max-amount normalizer after candidate removal.

## Required fail-closed behavior

- zero peers => leave-one-out state UNKNOWN;
- zero history-ready peers => 20-day activity UNKNOWN;
- one peer => SMALL_N_SENSITIVE;
- missing/ambiguous membershipVersion or classificationSchemeId => BLOCKED;
- incomplete lineage must remain visible; do not silently drop the row.

## Protected outputs

The implementation must prove no change to:
- Formal A/B eligibility;
- Formal sector gate;
- Formal priorityScore;
- Formal ranking;
- Formal Top6;
- allocation/capital;
- BUY/ADD/REDUCE/SELL/STOP;
- 15m semantics;
- notifications/orders;
- production trading behavior.

This is diagnostic-only Class A unless the implementation introduces shared schema/runtime risk; any Formal behavior replacement is Class C and requires explicit owner approval.

## Acceptance tests

At minimum:
1. candidate removal flips breadth gate;
2. candidate removal flips avgChange gate;
3. candidate removal flips amount-activity gate;
4. candidate-specific maxAmount normalizer is recomputed;
5. zero-peer and zero-history-ready cases remain UNKNOWN;
6. one-peer case is SMALL_N_SENSITIVE;
7. existing 20-day excluding-self sectorReturn20 behavior is preserved;
8. raw Formal selection is byte-for-byte or semantically identical before/after diagnostic instrumentation;
9. genuine receipt binds verified generationId/source parent;
10. receipt can be consumed by `research/sda009_r2_receipt_oracle_v0_1.mjs`.

## Current genuine evidence blocker

Latest visible System 1 C1 evidence run `37382689418` failed with:
- scanDate `2026-10-05`;
- `FORMAL_SCAN_NOT_CONFIRMED`;
- `C1_GENERATION_NOT_FOUND`;
- mayCountAsZeroPick=false.

Do not treat that run as no-self-effect evidence.

## Return contract

Return:
- files changed;
- A/B/C classification;
- deterministic tests;
- protected-output comparison;
- first genuine receipt if available;
- remaining blocker;
- exact next action.

## Exact next

Implement the Class-A diagnostic, then emit the first verified genuine candidate-level receipt. Room07 will consume that receipt through the R2 oracle and advance to `SDA-009-R3` common-support readback; D16 follows for economic/incremental validation.
