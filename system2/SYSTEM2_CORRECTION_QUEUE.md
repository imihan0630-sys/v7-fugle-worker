# System 2 Correction Queue

Updated: 2026-10-04 15:13 Asia/Taipei
Status: ACTIVE
Governance: `system2/SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md`
Machine-readable companion: `system2/SYSTEM2_CORRECTION_QUEUE.json`

## Queue rules

- GitHub main is canonical.
- Every directive uses an immutable `S2-CORR-YYYYMMDD-NNN` ID.
- CRITICAL/HIGH items are not self-closed by the implementation role.
- `FIX_IMPLEMENTED` is not equivalent to `VERIFIED_CLOSED`.
- Original evidence is never deleted when status changes.
- Protected Class B/Class C or Formal-Core decisions require owner approval.

## Open directives

### S2-CORR-20261004-001 — Historical daily-market backfill stalled after first 2017 TWSE annual attempt

- createdAt: 2026-10-04T15:13:33+08:00
- severity: HIGH
- status: OPEN
- affectedScope: S2-03 Historical infrastructure / P0 2017-present TWSE+TPEx daily A1 cold history
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: System 2 historical infrastructure must physically populate and verify the staged official 2017-present Taiwan-equity daily history before it can be described as complete or used as complete full-market replay evidence.
- observedProblem: The first manual 2017 TWSE external-cold annual backfill failed closed at historical calendar resolution before annual market-data ingest. The calendar source was subsequently repaired/revalidated, and the checkpoint explicitly required a manual TWSE-only rerun. No later canonical completion receipt is recorded, while subsequent System 2 work continued on other lanes. Current build progress still marks S2-03 yellow and states that full 2017-present cold-history completion remains separate work.
- evidence:
  - SYSTEM2_CHECKPOINT: run 36545375167 failed before annual ingest.
  - SYSTEM2_CHECKPOINT: repaired continuation required manual 2017 TWSE rerun, then TPEx only after TWSE coverage/hash/manifest/receipt verification.
  - SYSTEM2_BUILD_PROGRESS_MAP: S2-03 remains 🟡; full 2017-present cold history completion remains separate work.
  - SYSTEM2_MVP_SHADOW_STATUS_V0_1: 2017 full-market cold backfill is not claimed complete and staged annual population remains pending.
- riskIfUnfixed: Historical replay, factor validation, multi-year backtests, regime robustness and strategy comparison can be mistaken for being backed by a complete market history when only bounded/smoke datasets exist. This creates a false-completion and evidence-coverage risk on a P0 dependency.
- requiredCorrection:
  1. Resume from the repaired historical-calendar implementation; do not restart architecture design.
  2. Execute manual isolated 2017 TWSE annual cold backfill.
  3. Verify R2 object hashes, D1 manifests/checkpoints/completion receipt, expected symbol/date coverage, survivorship/delisting membership, UNKNOWN/continuity states and immutable rerun behavior.
  4. Only after TWSE 2017 is independently accepted, execute and verify 2017 TPEx.
  5. Continue year-by-year through the authorized Core Base horizon to present, preserving yearly completion receipts and explicit gaps.
  6. Produce an aggregate coverage matrix showing market × year × expected sessions × symbols × bars × missing/UNKNOWN causes.
  7. Run the first real full-market PIT replay only after the required history slice is physically qualified.
  8. Keep incomplete years/markets visibly incomplete; never infer completion from code/tests/smoke packs.
- acceptanceCriteria:
  - 2017 TWSE completion receipt physically exists and independently reconciles to manifests/R2 objects and coverage expectations.
  - 2017 TPEx is accepted under the same standard after TWSE.
  - Each later year has a durable market-specific completion or explicit blocked/deferred receipt.
  - Aggregate 2017-present coverage is machine-readable and identifies all unresolved gaps rather than coercing them to zero/pass.
  - A full-market replay consumes only verified historical registry/cold packs with PIT/continuity guards.
  - System 1 Formal Core and production runtime remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 2 live selection authority; production push; capital/order impact; no retrospective data relabeled as prospective evidence.
- ownerDecisionRequired: false for the currently authorized isolated research backfill/resumption; any new paid source, new permissions, secrets, production/runtime change or protected Class B/C change requires owner approval.
- implementationEvidence: PENDING
- verificationEvidence: PENDING
- finalDisposition: PENDING
- updatedAt: 2026-10-04T15:13:33+08:00


## Closed directives

None at activation.

## Next action

When the independent correction auditor identifies a material issue, append the directive here and update the JSON companion in the same change.
