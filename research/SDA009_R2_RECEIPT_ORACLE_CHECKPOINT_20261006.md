# SDA-009 R2 Receipt Oracle Checkpoint 2026-10-06

Status: R2_ORACLE_IMPLEMENTED / DETERMINISTIC_TEST_PASS / GENUINE_RECEIPT_PENDING / FORMAL_CORE_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Observed main before write: `2aac345110f8bf6620d5ca6efd3e86962ebdf6b8`

## What was implemented

Research-only receipt classifier:
- `research/sda009_r2_receipt_oracle_v0_1.mjs`

Deterministic test:
- `research/test_sda009_r2_receipt_oracle_v0_1.mjs`

The classifier consumes candidate-level inclusive versus leave-one-out sector receipts and does not modify Worker, Formal ranking, Top6, allocation or trading behavior.

## Primary classifications

Each row receives one primary research classification while preserving all effect flags:
- `NO_MATERIAL_SELF_EFFECT`
- `SCORE_ONLY_SELF_EFFECT`
- `GATE_FLIP`
- `RANK_FLIP`
- `TOP6_FLIP`
- `SMALL_N_SENSITIVE`
- `BLOCKED`

Priority is fail-closed first, then small-N sensitivity, then Top6/gate/rank/score effects. All effect booleans remain visible so the primary label does not erase secondary mechanical effects.

## Fail-closed behavior

The oracle blocks interpretation when:
- scanDate, candidateSymbol, classificationSchemeId or membershipVersion is missing;
- inclusive or leave-one-out sector state is missing;
- replayTrust is BLOCKED;
- leave-one-out state is UNKNOWN.

One-peer support remains `SMALL_N_SENSITIVE` rather than being promoted as usable evidence.

## Mechanical calculations

When both sector scores are known:
`sectorScoreDelta = inclusiveSectorScore - leaveOneOutSectorScore`

If an explicit value is not supplied:
`priorityScoreDeltaFromSector = 0.14 × sectorScoreDelta`

This is a structural contribution calculation only. It is never labelled economic superiority.

Every row reports:
`economicMateriality = UNASSESSED_D16_REQUIRED`.

## Deterministic validation

Local isolated execution:
`node research/test_sda009_r2_receipt_oracle_v0_1.mjs`

Result:
- PASS
- 12 assertions
- covers no-effect, score-only, gate flip, rank flip, Top6 flip, small-N, missing membership, LOO UNKNOWN, sector-score delta, priority delta and receipt aggregation.
- `formalDecisionImpact=false` asserted.

This local test is executable semantic validation, not genuine Taiwan market evidence.

## Genuine evidence readback

Latest visible System 1 C1 Prospective Evidence run:
- run `37382689418`
- head `aa12ec58e1c2b19fd9ffc2eb7190fb0dc47c35df`
- conclusion: failure
- scanDate: `2026-10-05`
- category: `FORMAL_SCAN_NOT_CONFIRMED`
- verificationFailure: `C1_GENERATION_NOT_FOUND`
- mayCountAsZeroPick: false

Interpretation:
the missing receipt is a parent-generation availability failure. It is not evidence of zero circularity and it cannot be counted as a clean zero-pick or no-self-effect date.

## Research decision

- R2 oracle readiness: PASS.
- Genuine candidate-level SDA-009 receipt count: 0.
- D09 maturity promotion: NONE.
- Formal Core mutation: NONE.
- D16 economic/incremental interpretation: PENDING.

## Exact next

`SDA-009-R3`: once System 1 emits the first candidate-level inclusive-vs-leave-one-out receipt on a verified same-generation parent, run it through the oracle and freeze the first genuine common-support comparison. Report gateFlip/rankDelta/Top6 changes and preserve blocked/UNKNOWN rows.

Until System 1 implements the missing diagnostic and a verified C1 generation exists, do not infer no-effect from missing evidence.
