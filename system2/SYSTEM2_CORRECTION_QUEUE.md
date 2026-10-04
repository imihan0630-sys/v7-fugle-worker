# System 2 Correction Queue

Updated: 2026-10-04 18:52 Asia/Taipei
Status: ACTIVE
Governance: `system2/SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md`
Machine-readable companion: `system2/SYSTEM2_CORRECTION_QUEUE.json`
Execution-lane governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Queue rules

- GitHub main is canonical.
- Every directive uses an immutable `S2-CORR-YYYYMMDD-NNN` ID.
- CRITICAL/HIGH items are not self-closed by the implementation role.
- `FIX_IMPLEMENTED` is not equivalent to `VERIFIED_CLOSED`.
- Original evidence is never deleted when status changes.
- Protected Class B/Class C or Formal-Core decisions require owner approval.
- Severity and routing are separate. Do not send every HIGH item to remediation.
- One conflict unit has one active modification owner.

## Open directives

### S2-CORR-20261004-001 — Historical daily-market backfill stalled after first 2017 TWSE annual attempt

- createdAt: 2026-10-04T15:13:33+08:00
- severity: HIGH
- status: ACKNOWLEDGED
- routingClass: DATA_LANE
- assignedLane: DATA_LANE
- assignedRoom: System 2｜歷史資料工程室
- modificationOwner: SYSTEM2_HISTORICAL_DATA_ROOM
- blockedBy: GitHub workflow_dispatch execution channel / owner login authorization if still required
- affectedScope: S2-03 Historical infrastructure / P0 2017-present TWSE+TPEx daily A1 cold history
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: System 2 historical infrastructure must physically populate and verify the staged official 2017-present Taiwan-equity daily history before it can be described as complete or used as complete full-market replay evidence.
- observedProblem: The first manual 2017 TWSE external-cold annual backfill failed closed at historical calendar resolution. After the calendar repair, manual run `36574839220` on head `df3c680d94f5b8ec06d474ba1d120e3c2ed60d58` advanced through annual source loading into cold-object persistence, then failed closed on `R2 HEAD failed: HTTP 502`. No canonical 2017 TWSE completion receipt is recorded. The R2 adapter on that run had no bounded retry for transient 5xx/transport failures; DATA_LANE has now hardened that transport path, but the annual backfill still requires a fresh latest-main execution and verification.
- evidence:
  - SYSTEM2_CHECKPOINT: run 36545375167 failed before annual ingest.
  - SYSTEM2_CHECKPOINT: repaired continuation required manual 2017 TWSE rerun, then TPEx only after TWSE coverage/hash/manifest/receipt verification.
  - GitHub Actions run `36574839220`: 2017 TWSE reached the cold-object write path and failed on `R2 HEAD failed: HTTP 502`; migrate job passed and no completion receipt was produced.
  - PR #522 / merge `7d35e8693d8ecfefd2f43fabbdde8b501f585857`: DATA_LANE added bounded R2 retry/backoff for 408/425/429/5xx and transient timeout/network failures while retaining fail-closed integrity and authorization semantics.
  - System2 Research CI `37187368126` and V8 Regression `37187368095`: SUCCESS.
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
- implementationEvidence:
  - Latest main re-read confirms repaired `system2-historical-pack-2017-backfill.yml` remains manual `workflow_dispatch`, isolated to `system2-research`, with TWSE-first/TPEX-second ordering.
  - Current annual script fast-path verifies an existing COMPLETE receipt and referenced R2 objects before accepting `ALREADY_COMPLETE`; otherwise it fetches official historical A1, builds external cold packs, writes immutable R2 objects/D1 manifests, and issues receipt-last completion.
  - Manual run `36574839220` proved the repaired calendar path reaches R2 persistence; its terminal defect was transient `R2 HEAD failed: HTTP 502`, not calendar/source-schema failure.
  - PR #522 merged as `7d35e8693d8ecfefd2f43fabbdde8b501f585857`: the R2 adapter now re-signs and performs bounded retries for 408/425/429/5xx and transient fetch timeout/network failures; 404 missing-object, 412 put-if-absent, non-retryable 4xx and immutable hash/manifest checks retain prior semantics.
  - System2 Research CI run `37187368126` and V8 Regression run `37187368095` both passed.
  - GitHub connector available to this room has read/rerun actions but no new `workflow_dispatch` action. Re-running run `36574839220` is rejected because it is bound to old head SHA `df3c680d94f5b8ec06d474ba1d120e3c2ed60d58`, before the R2 retry hardening and later schema changes.
  - Controlled browser profiles currently have no recorded GitHub sign-in, so a fresh latest-main web dispatch still requires owner login authorization.
  - Exact next executable action after GitHub browser sign-in: run `.github/workflows/system2-historical-pack-2017-backfill.yml` from latest `main` with `market=TWSE`, then independently verify receipt/manifests/R2 hashes/coverage before allowing TPEX.
- verificationEvidence: PENDING
- finalDisposition: PENDING
- updatedAt: 2026-10-04T15:58:20+08:00



### S2-CORR-20261004-002 — POSITION_MONITOR target behavior is presented as current operational capability

- createdAt: 2026-10-04T16:30:15+08:00
- severity: MEDIUM
- status: FIX_IN_PROGRESS
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: none
- affectedScope: System 2 position-management documentation / storage/runtime capability state / UI-readiness semantics
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: Canonical documentation must distinguish approved target architecture from physically implemented/runtime-verified capability. Actual holdings must not be claimed as continuously monitored unless an authorized actual-holdings source, reconciliation path, persistence/runtime behavior and evidence exist.
- observedProblem: SYSTEM2_MASTER and SYSTEM2_ARCHITECTURE state in present tense that actual holdings are continuously monitored in a dedicated POSITION_MONITOR. SYSTEM2_CHECKPOINT describes the position-management architecture as owner-approved with exact thresholds still unfrozen. SYSTEM2_STORAGE_SCHEMA defines s2_positions as System 2 virtual positions only and explicitly not V8 live holdings. Repository search found candidate lifecycle and resonance reads of virtual s2_positions, but no complete authorized actual-holdings ingestion/reconciliation runtime contract or physical evidence that user actual holdings are continuously monitored by System 2.
- evidence:
  - SYSTEM2_MASTER: "Actual holdings are continuously monitored in a dedicated POSITION_MONITOR".
  - SYSTEM2_ARCHITECTURE: "Existing positions are continuously monitored in POSITION_MONITOR".
  - SYSTEM2_CHECKPOINT: position-management architecture is owner-approved; exact thresholds remain unfrozen pending Shadow validation.
  - SYSTEM2_STORAGE_SCHEMA: s2_positions = System 2 virtual positions only; never V8 live holdings.
  - Existing runtime references query s2_positions for simulated/open System 2 position lifecycle; no complete actual-holdings source/reconciliation runtime was found in the bounded audit.
- riskIfUnfixed: The owner and downstream modules can mistake a future architecture invariant for a currently operational capability, causing false-completion claims, UI mislabeling, or later position/capital research to assume actual holdings provenance that does not exist.
- requiredCorrection:
  1. Reconcile canonical wording so target architecture, virtual/simulated position support and physically operational actual-holdings monitoring are separate states.
  2. Define the authorized source/reconciliation contract required before System 2 may call a position "actual holding".
  3. Ensure storage/API/UI/runtime cannot relabel s2_positions virtual positions as actual holdings.
  4. If an actual-holdings adapter already exists under another path, surface its exact provenance, tests and physical readback instead of duplicating it.
  5. Add explicit readiness state such as TARGET_ONLY / VIRTUAL_POSITION_READY / ACTUAL_HOLDINGS_SOURCE_NOT_WIRED / ACTUAL_POSITION_MONITOR_VERIFIED.
- acceptanceCriteria:
  - SYSTEM2_MASTER, SYSTEM2_ARCHITECTURE, POSITION_MANAGEMENT contract, storage schema and build/progress surfaces describe the same capability state.
  - Virtual/simulated positions remain distinguishable from owner actual holdings.
  - No UI/API/runtime claims actual holdings are monitored unless actual-holdings source + reconciliation + physical evidence are present.
  - Any future actual-holdings source preserves fill/quantity/cost/reconciliation provenance and does not silently import System 1/V8 holdings without explicit authorization.
  - System 1 Formal Core, capital/order behavior and production monitoring remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 1 holdings/runtime; System 2 capital/order authority; production push; no inferred fills/holdings.
- ownerDecisionRequired: false for semantic reconciliation and research-only readiness contract; true later if a protected shared/live holdings integration is proposed.
- implementationEvidence:
  - REMEDIATION_LANE accepted ownership on latest main and corrected its stale idle checkpoint before semantic mutation.
  - Bounded System 2 audit confirms the physically implemented path is simulated only: candidate lifecycle enforces SIM_FILLED -> POSITION_MONITOR, daily resonance persistence reads open s2_positions, and s2_positions is canonically virtual-only.
  - No complete authorized System 2 actual-holdings source/reconciliation/runtime/readback chain was found; no broker holdings adapter or verified actual quantity/cost/fill/ownership provenance was found in System 2.
  - Existing MVP status already states simulated open positions provide HOLD semantics and no real position/order is created.
  - Current repair will separate TARGET_ONLY / DESIGN_APPROVED / VIRTUAL_POSITION_READY / ACTUAL_HOLDINGS_SOURCE_NOT_WIRED / ACTUAL_POSITION_MONITOR_VERIFIED semantics and fail closed on any future actual-holding label without provenance/reconciliation evidence.
- verificationEvidence: PENDING
- finalDisposition: PENDING
- updatedAt: 2026-10-04T18:52:00+08:00


## Closed directives

None at activation.

## Next action

When the independent correction auditor identifies a material issue, append the directive here and update the JSON companion in the same change.
