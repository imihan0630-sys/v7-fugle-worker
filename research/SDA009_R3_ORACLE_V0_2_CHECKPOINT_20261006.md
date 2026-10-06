# SDA-009 R3 Oracle V0.2 Checkpoint — 2026-10-06

Status: R3_ORACLE_V0_2_IMPLEMENTED / LOCAL_DETERMINISTIC_PASS_16 / GENUINE_RECEIPT_PENDING / FORMAL_CORE_UNCHANGED

Owner: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Observed main before checkpoint: `a8bf8a825f9bdae3d1e3b0d71d325917611d6e99`

## Implemented artifacts

- `research/sda009_r3_receipt_oracle_v0_2.mjs`
- `research/test_sda009_r3_receipt_oracle_v0_2.mjs`

## Why V0.2 is required

V0.1 was sufficient for the first semantic freeze but is too coarse for the corrected current production structure because it:
- used a generic Top6 view instead of GENERAL/THOUSAND pool-local Top3 seats;
- did not preserve self-promotion versus self-suppression direction;
- did not decompose local constituent contribution from candidate-specific max-sector-amount normalizer externality;
- did not require comparator attribution for a reported rank flip;
- did not classify capital-allocation spillover.

V0.2 addresses those gaps without changing Formal behavior.

## V0.2 fail-closed inputs

Mandatory row identity:
- scanDate;
- generationId;
- candidateSymbol;
- classificationSchemeId;
- membershipVersion;
- poolId.

Mandatory sector states:
- inclusiveSectorState;
- leaveOneOutLocalState;
- leaveOneOutSectorState.

A rank flip without rankComparatorAttribution is BLOCKED.

LOO UNKNOWN or replayTrust BLOCKED is BLOCKED.

## V0.2 classifications

Primary:
- NO_MATERIAL_SELF_EFFECT;
- SCORE_ONLY_SELF_EFFECT;
- ALLOCATION_SPILLOVER;
- RANK_FLIP;
- GATE_FLIP;
- POOL_SEAT_FLIP;
- SMALL_N_SENSITIVE;
- BLOCKED.

Directional state:
- SELF_PROMOTION;
- SELF_SUPPRESSION;
- MIXED;
- NONE;
- BLOCKED.

## Decomposition

Persist:
- localSelfContribution = inclusive sector score - frozen-normalizer LOO score;
- maxNormalizerExternality = frozen-normalizer LOO score - fully recomputed LOO score;
- fullCounterfactualDelta = inclusive sector score - fully recomputed LOO score.

This prevents cross-sector normalizer switching from being misreported as direct candidate contribution.

## Pool semantics

Only:
- GENERAL;
- THOUSAND.

Persist raw/LOO pool rank and pool Top3 state.

Generic global Top6 is not sufficient for SDA-009 seat-flip inference.

## Allocation semantics

The oracle preserves:
- candidate raw/LOO allocation NTD;
- peer allocation deltas;
- residual-cash delta;
- cap-binding state;
- flooring state.

Allocation movement is mechanical evidence only and remains D16-unassessed.

## Deterministic validation

Isolated local run:
`node test_sda009_oracle_v02.mjs`

Result:
- PASS;
- 16 assertions.

Covered:
1. no-effect;
2. local contribution decomposition;
3. max-normalizer externality;
4. self-promotion;
5. self-suppression;
6. pool-seat flip;
7. rank flip without comparator attribution blocks;
8. comparator-attributed rank flip;
9. direct candidate allocation spillover;
10. peer-only allocation spillover;
11. small-N sensitivity;
12. missing membership blocks;
13. mixed directional state;
14. GENERAL pool aggregation;
15. THOUSAND seat-flip aggregation;
16. formalDecisionImpact=false.

This proves oracle semantics only; it is not Taiwan market evidence.

## Current external blocker

00 latest independent readback still classifies SDA-009 as a true System1 S1 blocker:
- System1 candidateSelfContribution / inclusive-vs-LOO diagnostic not implemented;
- gate/rank/pool/allocation genuine receipt missing;
- classificationSchemeId / membershipVersion runtime fail-closed implementation missing;
- D16 common-support validation missing.

No ticket closure or Formal promotion is authorized.

## Maturity decision

D09 remains 57.1%.

No maturity increase:
- genuine candidate-level receipt count remains 0;
- no common-support Taiwan readback;
- no D16 economic evidence.

## Exact next

`SDA-009-R3A`: System1 implements the V0.2 Class-A diagnostic contract and emits the first genuine same-generation candidate-level receipt.

`SDA-009-R3B`: Room07 runs that receipt through `sda009_r3_receipt_oracle_v0_2.mjs`, freezes common-support directional gate/pool-seat/rank/allocation/normalizer results, and hands the immutable comparison to D16.

Do not infer no-effect from missing receipts.
