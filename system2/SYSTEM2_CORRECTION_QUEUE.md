# System 2 Correction Queue

Updated: 2026-10-05 02:45 Asia/Taipei
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
- observedProblem: Initial 2017 backfill defects are repaired. Raw A1 data coverage is physically accepted for 2017 TWSE, 2017 TPEx, 2018 TWSE, and 2018 TPEx. Replay readiness remains PARTIAL because symbol-session UNKNOWNs, RAW continuity debt, and incomplete TPEx historical delisting-union remain. CORR-001 stays open because 2019-present market-years, the 2026 incremental path, and final full-market PIT replay are pending.
- evidence:
  - SYSTEM2_CHECKPOINT: run 36545375167 failed before annual ingest.
  - SYSTEM2_CHECKPOINT: repaired continuation required manual 2017 TWSE rerun, then TPEx only after TWSE coverage/hash/manifest/receipt verification.
  - GitHub Actions run `36574839220`: 2017 TWSE reached the cold-object write path and failed on `R2 HEAD failed: HTTP 502`; migrate job passed and no completion receipt was produced.
  - PR #522 / merge `7d35e8693d8ecfefd2f43fabbdde8b501f585857`: DATA_LANE added bounded R2 retry/backoff for 408/425/429/5xx and transient timeout/network failures while retaining fail-closed integrity and authorization semantics.
  - System2 Research CI `37187368126` and V8 Regression `37187368095`: SUCCESS.
  - SYSTEM2_BUILD_PROGRESS_MAP: S2-03 remains 🟡; full 2017-present cold history completion remains separate work.
  - SYSTEM2_MVP_SHADOW_STATUS_V0_1: 2017 full-market cold backfill is not claimed complete and staged annual population remains pending.
  - GitHub Actions run `37197090867` (#7): SUCCESS on head `7f7eda36b1de31caa01817ce3b9570af8826fe15`.
  - 2017 TWSE storage verification: 920 packs / 222,194 bars / 920 HEAD + 920 byte-GET SHA checks PASS.
  - Fresh official TWSE 2017 reconciliation: 246 sessions / 222,194 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Historical-universe expected membership sessions 222,845; 651 UNKNOWN gaps across 44 symbols retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11301298928`, digest `sha256:6b535e6d32a7f768ca55bb5fe98b504efb6a7d770a3b5a11071760d673bc6618`.
  - GitHub Actions run `37201834701` (#8): SUCCESS on head `b0a445e0cff7a4a9035cf706cc1fc8da139bd9f9`.
  - 2017 TPEx storage verification: 753 packs / 180,806 bars / 753 HEAD + 753 byte-GET SHA checks PASS.
  - Fresh official TPEx 2017 reconciliation: 246 sessions / 180,806 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Conservative TPEx universe denominator 181,264; 458 UNKNOWN symbol-session gaps retained; data coverage PASS, replay readiness PARTIAL.
  - TPEx historical delisting-union remains incomplete and is explicitly PARTIAL, not inferred complete.
  - Artifact `11304212419`, digest `sha256:48d2cac27deaacc95bb5a03ea6072dff76d39ca60804943dc6948c76fa2be20d`.
  - GitHub Actions run `37211022004` (#9): SUCCESS on head `7ad031675605d5b276a7b1d8dda244bb57048759`.
  - 2018 TWSE storage verification: 943 packs / 227,381 bars / 943 HEAD + 943 byte-GET SHA checks PASS.
  - Fresh official TWSE 2018 reconciliation: 247 sessions / 227,381 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Historical-universe expected membership sessions 227,950; 569 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11307491716`, digest `sha256:d788354ab68f9005a7b758aab36912eef9e9104b3f81df06ef7585a3e92d00ff`.
  - GitHub Actions run `37223028925` (#10): SUCCESS on head `b1ed6a60a0792ebd57bcf4c7f24bb22f893d12d0`.
  - 2018 TPEx storage verification: 773 packs / 186,350 bars / 773 HEAD + 773 byte-GET SHA checks PASS.
  - Fresh official TPEx 2018 reconciliation: 247 sessions / 186,350 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Conservative TPEx universe expected membership sessions 186,729; 379 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11311721304`, digest `sha256:84f33f09df6a04ab1980ca60b1ddaf5d11025940a3cbe3cb1e55ac62631981dd`.
  - TPEx limitation text hard-coded to 2017 in run #10 was metadata-only and corrected for future runs by merge `c7e8156c96b82a252510b3fc8f07cfd93425acd6`.
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
- verificationEvidence:
  - Run `37197090867` migrate/backfill/physical verify/artifact upload/System1 isolation: SUCCESS.
  - Completion receipt `S2HCR-98d7cf6888e3069a2a170c20dbe8acee1cd7d5cb9bc7d9afa33319eb816fe97a`: COMPLETE.
  - Manifest rolling hash `98d7cf6888e3069a2a170c20dbe8acee1cd7d5cb9bc7d9afa33319eb816fe97a`.
  - 2017 TWSE disposition: `DATA_COVERAGE_ACCEPTED_REPLAY_READINESS_PARTIAL`.
- finalDisposition: PENDING
- updatedAt: 2026-10-05T02:33:00+08:00

## Closed directives

### S2-CORR-20261004-004 — Whole-universe history/continuity gate can block all Shadow evaluation because of symbol-local UNKNOWNs

- createdAt: 2026-10-04T22:51:00+08:00
- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: none
- affectedScope: S2-07 Daily Shadow preflight / PIT-history readiness / per-symbol UNKNOWN semantics / strategy evaluation / capacity generation
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: Symbol-local missing history, continuity or required evidence must remain symbol-local INCOMPLETE/UNKNOWN when the source itself is valid. Global fail-closed blocking is reserved for defects that invalidate the whole observation universe or decision clock. System 2 must not turn one symbol's missing data into a universal no-evaluation gate.
- observedProblem: `probePitHistoryCoverageV0_1` reports READY only when historyReadyCount equals the entire current universe and continuityReadyCount equals the entire current universe. `buildDailyShadowInputPreflightV0_1` then requires historyCoverage.state=READY before any strategy evaluation or capacity write is authorized. Therefore one symbol-local history/continuity gap can block all otherwise evaluable symbols. This conflicts with the downstream strategy runtime, which already maps missing required evidence to per-symbol `INCOMPLETE/BLOCKED`, freezes incomplete decisions, and preserves incomplete prior memberships without treating UNKNOWN as negative evidence.
- evidence:
  - `daily_shadow_history_reader_v0_1.mjs`: state becomes HISTORY_COVERAGE_INCOMPLETE when historyReadyCount < currentCount and CONTINUITY_NOT_VERIFIED when continuityReadyCount < currentCount.
  - `daily_shadow_input_preflight_v0_1.mjs`: sourceAndHistoryReady requires historyCoverage.state === READY; otherwise all assessor evaluation/capacity is globally blocked.
  - `strategy_evaluator.mjs`: missing required evidence maps that symbol to strategyValidity=INCOMPLETE and entryReadiness=BLOCKED.
  - `limited_shadow_v0_1.mjs`: INCOMPLETE is a valid frozen decision state rather than a system-wide failure.
  - `SYSTEM2_LIMITED_SHADOW_PREREGISTRY_V0_1.md`: INCOMPLETE / WATCH / REJECTED / QUALIFIED_NOT_SELECTED records must all be frozen; missing REQUIRED evidence is INCOMPLETE + BLOCKED.
  - `daily_shadow_capacity_orchestrator_v0_1.mjs`: prior memberships with INCOMPLETE are preserved but are not active-monitor eligible; non-qualified new candidates are diagnosed rather than globally crashing capacity.
- riskIfUnfixed: A newly listed stock, a symbol-specific missing bar, unresolved corporate-action continuity, or one local provenance gap can indefinitely prevent all S2-07 strategy evaluation and physical `s2_capacity_runs`, producing opportunity starvation and preventing prospective Shadow evidence from accumulating even for clean symbols. This is a critical-path design contradiction rather than a legitimate zero-pick day.
- requiredCorrection:
  1. Separate global infrastructure/source integrity from symbol-level evaluation readiness.
  2. Keep global fail-closed blocking for whole-universe defects such as invalid source date, broken decision clock, source-wide corruption, unreconciled global revision ambiguity, or missing mandatory market-wide source identity.
  3. Convert symbol-local history/continuity/missing-evidence gaps into per-symbol readiness states that flow to `INCOMPLETE/BLOCKED` decisions instead of globally blocking every symbol.
  4. Allow otherwise-ready symbols to proceed through authorized assessor -> frozen decision -> ranking/capacity when their own required evidence is valid.
  5. Preserve complete accounting for every current-universe symbol: evaluated, INCOMPLETE, invalidated, excluded, or otherwise explicitly classified.
  6. Do not invent a new arbitrary market-wide coverage percentage threshold merely to make the pipeline run.
  7. Separate capacity readiness from zero-pick truth. If some symbols remain INCOMPLETE and no ready symbol is selected, do not falsely claim a clean zero-pick day; record partial/incomplete denominator semantics explicitly.
  8. Preserve per-symbol PIT, availableAt, continuity and revision guards. This correction must not downgrade evidence quality or turn UNKNOWN into PASS/0.
  9. Add regression tests for mixed universes: clean symbols + one newly listed/incomplete symbol + one continuity-blocked symbol, proving clean symbols can evaluate while incomplete symbols remain blocked and fully accounted.
- acceptanceCriteria:
  - A symbol-local history/continuity gap no longer forces all otherwise-ready symbols into INPUTS_NOT_READY.
  - Whole-universe/source-integrity failures still fail closed globally.
  - Every symbol remains denominator-accounted with explicit readiness/reason provenance.
  - INCOMPLETE symbols cannot become BUY_ELIGIBLE, ACTIVE_ENTRY_MONITOR, or capacity admissions.
  - Ready symbols can reach authorized Shadow evaluation/capacity without imputing missing evidence for blocked symbols.
  - zeroPickDay is not asserted when denominator completeness required for that claim is unresolved; partial coverage is explicit.
  - No arbitrary coverage threshold is introduced without separate preregistration/evidence.
  - System 1 Formal Core, System 2 production selection authority, live push, capital and orders remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 2 live/final-selection authority; production push/runtime; capital/order; PIT/UNKNOWN semantics; no invented thresholds.
- ownerDecisionRequired: false for restoring canonical per-symbol UNKNOWN semantics in research/shadow; any later production minimum-coverage policy remains separately owner/evidence gated.
- implementationEvidence:
  - PR #585 implemented CORR-004 and squash-merged to main as `b6dd5bff357d6c678825ca212afae6a533da68c8`.
  - `daily_shadow_history_reader_v0_1.mjs` separates aggregate coverage from `globalIntegrityState` and preserves explicit per-symbol readiness/blocker/denominator accounting.
  - `daily_shadow_input_preflight_v0_1.mjs` globally blocks only global A1/history-integrity failures and exposes symbol-local eligible/blocked accounting instead of turning local gaps into `PIT_HISTORY_GLOBAL` blockers.
  - No arbitrary whole-market coverage threshold was added; PIT/provenance/continuity UNKNOWN remains explicit and is not converted to zero/pass/neutral or forward-filled.
  - Prediction Snapshot now distinguishes `CLEAN_ZERO_PICK`, `PARTIAL_COVERAGE_NO_SELECTION`, and denominator-unknown no-selection; `zeroPickDay=null` unless the required no-selection denominator is complete.
  - Capacity allows ready admissions under partial coverage as `CAPACITY_READY_PARTIAL_COVERAGE`, while INCOMPLETE symbols remain blocked and cannot enter active monitor/capacity admission.
  - Partial denominator with no ready admission returns `CAPACITY_PARTIAL_COVERAGE_NO_SELECTION`, `capacityReceipt=null`, and writes no `s2_capacity_runs`, preventing downstream false `ZERO_PICK_ACTIVE`.
  - Mixed-universe regression covers A ready, B insufficient history, C continuity unverified, D required evidence UNKNOWN: A proceeds; B/C/D remain `INCOMPLETE/BLOCKED`; all symbols remain accounted.
  - Global-failure regression verifies source-wide revision ambiguity remains `INPUTS_NOT_READY`, with capacity/zero-pick authorization false.
  - First CI failure (`37223831928`) was an obsolete test expectation for an INCOMPLETE prior membership; second (`37223878523`) was an in-place sort of a frozen test output. Both test issues were corrected without weakening the runtime guard.
  - Final implementation head `7ee02cc98913e79fc981da4d21e39b54b48b4983`: System2 Research CI `37224012433` PASS; V8 Regression `37224012419` PASS.
  - Merged-main readback on `b6dd5bff357d6c678825ca212afae6a533da68c8` confirmed all CORR-004 runtime guards and no 95/90/80% threshold logic.
  - Protected boundaries unchanged: no System 1 Formal Core/runtime, System 2 live/final-selection authority, production push/runtime, capital/order, strategy weight, formal entry/exit threshold, or assessor-policy change.
- verificationEvidence:
  - Independent audit re-read latest main and CORR-004 runtime/tests rather than relying on remediation-room claims.
  - PR #585 is merged as b6dd5bff357d6c678825ca212afae6a533da68c8 and changed only System2 Shadow research runtime/contracts/tests plus remediation checkpoint; no System1 Formal Core/runtime or trading authority file was changed.
  - daily_shadow_history_reader_v0_1.mjs now separates descriptive aggregate coverage from globalIntegrityState and emits per-symbol readinessState, blockerCodes, evaluationInputReady and denominatorAccounted.
  - daily_shadow_input_preflight_v0_1.mjs uses global source/history integrity for global blocking while exposing symbol-local eligible/blocked lists; symbol-local HISTORY/CONTINUITY gaps no longer create PIT_HISTORY_GLOBAL blockers.
  - Mixed-universe regression proves A=ready can proceed while B=insufficient history, C=continuity unverified and D=required evidence UNKNOWN remain INCOMPLETE/BLOCKED, non-admitted and individually accounted.
  - strategy_evaluator missing-required-evidence semantics remain unchanged: symbol-local UNKNOWN cannot become BUY_ELIGIBLE and maps to INCOMPLETE/BLOCKED.
  - Global fail-closed behavior remains present for current-source errors, calendar/clock failures, history-probe/query failures, universe-accounting failures and explicit source-wide/global integrity BLOCKED states.
  - No 95%/90%/80% or other arbitrary market-wide coverage threshold was introduced; readiness remains categorical and provenance-based.
  - daily_shadow_capacity_orchestrator_v0_1.mjs emits CAPACITY_READY_PARTIAL_COVERAGE only when at least one clean symbol is legitimately admitted; INCOMPLETE symbols are not in capacity/active-monitor assignments.
  - Partial denominator with no ready admission returns CAPACITY_PARTIAL_COVERAGE_NO_SELECTION with zeroPickDay=null, capacityReceipt=null and no s2_capacity_runs persistence, preventing a false downstream ZERO_PICK_ACTIVE.
  - Prediction Snapshot independently distinguishes CLEAN_ZERO_PICK, PARTIAL_COVERAGE_NO_SELECTION and DENOMINATOR_UNKNOWN_NO_SELECTION and leaves zeroPickDay=null when denominator completeness is unresolved.
  - Denominator truth is durably preserved in s2_shadow_runs via eligible_count/accounted_count/completion_rate/state_counts_json/unaccounted_symbols_json/symbol_accounts_json and in frozen decisions. The capacity row itself is not self-describing for partial coverage, but this is a non-blocking observability hardening opportunity because denominator evidence is separately immutable at the same decision clock and partial-no-selection writes no capacity row.
  - Final implementation head 7ee02cc98913e79fc981da4d21e39b54b48b4983 passed System2 Research CI 37224012433 and V8 Regression 37224012419.
  - From PR #585 merge through audit time, 23 later main commits did not touch any CORR-004 runtime/test conflict unit; no concurrent drift invalidated the verification.
  - Independent verification receipt: `system2/evidence/s2_corr_20261004_004_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — symbol-local UNKNOWN/INCOMPLETE no longer globally blocks clean Shadow evaluation; global integrity and denominator-safe zero-pick behavior remain fail-closed.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-05T02:45:47+08:00
- updatedAt: 2026-10-05T02:45:47+08:00

### S2-CORR-20261004-003 — Correction routing governance contradiction can cause BUILD_LANE to seize work assigned to other lanes

- createdAt: 2026-10-04T20:26:00+08:00
- severity: UNKNOWN
- status: VERIFIED_CLOSED
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: none
- affectedScope: System 2 canonical correction-routing governance / SYSTEM2_MASTER / correction governance semantics / bootstrap-checkpoint-registry consistency / semantic regression guard
- detectedBy: OWNER_HANDOFF_TO_REMEDIATION_LANE
- canonicalRequirement: Execution Lane Governance is authoritative for implementation ownership. Severity is independent from routing. `routingClass / assignedLane / modificationOwner` determine the implementation owner. BUILD_LANE may execute only assigned `LOCAL_FIX / BUILD_LANE` corrections and may not seize DATA_LANE or REMEDIATION_LANE work because severity is HIGH/CRITICAL.
- observedProblem: `SYSTEM2_MASTER.md` still states that CRITICAL/HIGH directives may be implemented by the build/control room. That conflicts with `SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`. `SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md` also retains generic “builder” wording that can blur the distinction between BUILD_LANE and the formally assigned implementation lane.
- evidence:
  - SYSTEM2_MASTER: “CRITICAL/HIGH directives may be implemented by the build/control room”.
  - Execution Lane Governance: severity and routing are independent dimensions.
  - Execution Lane Governance: BUILD executes only LOCAL_FIX / BUILD_LANE items assigned to it.
  - Execution Lane Governance: BUILD must not seize DATA_LANE or REMEDIATION_LANE work merely because it is HIGH.
  - SYSTEM2_CHECKPOINT and ROOM_BOOTSTRAP_REGISTRY already carry the newer assignment semantics.
- riskIfUnfixed: A future BUILD_LANE session can cite the older Master sentence to take modification ownership from DATA_LANE or REMEDIATION_LANE, creating duplicate mutation, merge conflicts, lost evidence or false ownership/closure claims.
- requiredCorrection:
  1. Make Execution Lane Governance the explicit implementation-routing authority in SYSTEM2_MASTER.
  2. Separate severity, routing/assignment and verification authority in canonical wording.
  3. Clarify generic “builder” wording to mean the formally assigned implementation lane, not BUILD_LANE.
  4. Require formal `routingClass / assignedLane / modificationOwner` update before ownership transfer.
  5. Add a semantic regression guard preventing severity from implying BUILD ownership.
  6. Audit canonical bootstrap/checkpoint/registry surfaces for equivalent stale wording.
  7. Apply the separately authorized LOW/LOCAL_FIX documentation sync from “shared 18-domain research” to “22-domain / 354-module” without expanding runtime scope.
- acceptanceCriteria:
  - SYSTEM2_MASTER no longer states or implies CRITICAL/HIGH severity grants BUILD_LANE implementation ownership.
  - Correction Governance distinguishes the assigned implementation lane from BUILD_LANE and preserves independent closure authority.
  - Execution Lane Governance, Master, Checkpoint and ROOM_BOOTSTRAP_REGISTRY agree that BUILD executes only assigned LOCAL_FIX/BUILD_LANE corrections.
  - Ownership transfer requires a formal routing/assignment/modification-owner change.
  - CRITICAL/HIGH assigned implementation lanes may reach FIX_IMPLEMENTED, but the same implementation role cannot self-VERIFIED_CLOSED.
  - Semantic regression guard detects future severity-implies-BUILD wording.
  - SYSTEM2_BUILD_PROGRESS_MAP says 22-domain / 354-module rather than shared 18-domain research.
  - Protected System 1/System 2 trading boundaries remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 2 strategy/ranking/final-selection; capital/order; production push; production runtime.
- ownerDecisionRequired: false
- implementationEvidence:
  - Owner explicitly assigned S2-CORR-20261004-003 to REMEDIATION_LANE while latest main did not yet contain the directive; the queue record materializes that owner handoff without inventing a severity classification.
  - Repo-wide canonical scan found the direct contradiction only in SYSTEM2_MASTER and ambiguous generic “builder” wording in SYSTEM2_CORRECTION_GOVERNANCE_V0_1; SYSTEM2_CHECKPOINT and ROOM_BOOTSTRAP_REGISTRY already carried the correct assignment-gated semantics.
  - SYSTEM2_MASTER now states that severity does not grant implementation ownership; `routingClass / assignedLane / modificationOwner` determine the mutation owner; BUILD_LANE may implement only formally assigned `LOCAL_FIX / BUILD_LANE` corrections.
  - SYSTEM2_MASTER now requires a formal Correction Queue routing/assignment/modification-owner update before implementation ownership can transfer between rooms.
  - SYSTEM2_CORRECTION_GOVERNANCE_V0_1 now uses “formally assigned implementation lane” for HIGH implementation and FIX_IMPLEMENTED semantics, separates severity / implementation ownership / verification authority, and prohibits chat-based self-seizure of another lane's conflict unit.
  - CRITICAL/HIGH independent closure semantics remain intact: an assigned implementation lane may reach FIX_IMPLEMENTED, but the same implementation role cannot advance directly to VERIFIED_CLOSED.
  - SYSTEM2_BUILD_PROGRESS_MAP LOW/LOCAL_FIX drift corrected from `shared 18-domain research` to `shared 22-domain / 354-module research` only; no research/runtime authority changed.
  - Added `system2/tests/correction_routing_governance_semantics.test.mjs` to guard Master, Correction Governance, Execution Lane Governance, System2 Checkpoint, Room Bootstrap Registry and Build Progress Map against future severity-implies-BUILD drift.
  - PR #556 initial implementation head `5fc3b9c43ea0f79fe6fa5b714dae53d868ab69f2`: System2 Research CI `37202451095` PASS (20:32:36 Asia/Taipei); V8 Regression `37202451081` PASS (20:33:00 Asia/Taipei).
  - PR #556 changed-file scope is governance/documentation/test only; no production/runtime/trading logic file is changed.
  - Latest-main drift check before evidence finalization: base `d199a70b14dc56374a5f51433ee5648b5ae6ce7d` remained current; no concurrent conflict-unit drift was present.
  - Final PR #556 head `fcfabf757a0b3b5eb1241037a92bebb800ac89d4`: System2 Research CI `37202660117` PASS; V8 Regression `37202660107` PASS; mergeable=true immediately before merge.
  - PR #556 squash-merged to main as `f507b9a8714e53f9bf42235cb70824a545ffefae`.
  - Merged-main readback confirmed: stale Master severity-implies-BUILD sentence absent; severity / implementation ownership / verification authority split present; BUILD anti-seizure rules preserved in Execution Lane Governance, System2 Checkpoint and Room Bootstrap Registry; Build Progress Map reports `22-domain / 354-module`.
- verificationEvidence:
  - Independent audit re-read latest main before closure and did not rely solely on the remediation-room completion claim.
  - SYSTEM2_MASTER no longer contains the stale rule that CRITICAL/HIGH directives may be implemented by the build/control room; it now states that severity does not grant implementation ownership.
  - SYSTEM2_CORRECTION_GOVERNANCE_V0_1 explicitly separates severity, implementation ownership and verification authority, and binds mutation ownership to routingClass / assignedLane / modificationOwner.
  - SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1 still requires BUILD_LANE to execute only assigned LOCAL_FIX / BUILD_LANE items and forbids seizing DATA_LANE / REMEDIATION_LANE work merely because severity is HIGH.
  - SYSTEM2_CHECKPOINT and ROOM_BOOTSTRAP_REGISTRY retain the same assignment-gated BUILD_LANE semantics.
  - Ownership transfer now requires formal Correction Queue routingClass / assignedLane / modificationOwner changes before mutation; chat-based self-seizure is prohibited.
  - CRITICAL/HIGH independent closure semantics remain intact: the assigned implementation lane may reach FIX_IMPLEMENTED but the same implementation role cannot self-VERIFIED_CLOSED.
  - The semantic regression test system2/tests/correction_routing_governance_semantics.test.mjs directly guards Master, Correction Governance, Execution Lane Governance, Checkpoint, Room Bootstrap Registry and the research-universe wording.
  - PR #556 changed governance/documentation/test surfaces only and did not modify System1 Formal Core, System2 strategy/ranking/final-selection, capital/order, production push or production runtime.
  - PR #556 final head fcfabf757a0b3b5eb1241037a92bebb800ac89d4: System2 Research CI 37202660117 PASS and V8 Regression 37202660107 PASS.
  - Build Progress Map now uses shared 22-domain / 354-module research and the obsolete shared 18-domain wording is absent from canonical progress state.
  - Superseded audit-opening PR #554 was confirmed never merged and was closed during independent audit to prevent stale duplicate queue mutation.
  - CORR-003 severity remains UNKNOWN because canonical main never received the earlier unmerged MEDIUM classification; this explicit UNKNOWN does not affect the repaired routing semantics or closure evidence.
  - Independent verification receipt: `system2/evidence/s2_corr_20261004_003_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — routing-governance contradiction corrected; BUILD_LANE remains assignment-gated and severity does not grant cross-lane mutation ownership.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-04T20:52:58+08:00
- updatedAt: 2026-10-04T20:52:58+08:00

### S2-CORR-20261004-002 — POSITION_MONITOR target behavior is presented as current operational capability

- createdAt: 2026-10-04T16:30:15+08:00
- severity: MEDIUM
- status: VERIFIED_CLOSED
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
  - REMEDIATION_LANE accepted ownership on latest main, corrected the stale idle remediation checkpoint, and restricted conflict ownership to canonical position-readiness surfaces plus one semantic regression test.
  - Bounded repository audit found no complete authorized System 2 actual-holdings adapter/reconciliation/readback chain. Current runtime evidence is virtual-only: candidate lifecycle enforces `SIM_FILLED -> POSITION_MONITOR`; daily resonance persistence reads open `s2_positions`; MVP status explicitly says simulated open positions supply HOLD semantics and no real position/order is created.
  - Canonical readiness is now separated across MASTER / ARCHITECTURE / POSITION_MANAGEMENT / STORAGE_SCHEMA / BUILD_PROGRESS / CHECKPOINT / UI / candidate lifecycle/capacity / strategy identity: `TARGET_ONLY`, `DESIGN_APPROVED`, `VIRTUAL_POSITION_READY`, `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED`, `ACTUAL_POSITION_MONITOR_VERIFIED=false`.
  - `s2_positions` is explicitly guarded as virtual/simulated only. Quantity/cost in that table are simulation accounting, not broker ownership evidence. The schema forbids overloading it with actual holdings.
  - Actual-holding labels are fail-closed: a future authorized integration must preserve source/account scope, as-of time, reconciled quantity, cost only when sourced, confirmed-fill provenance where used, ownership provenance, reconciliation/UNKNOWN state, and durable persistence/readback.
  - Signal/trigger prices, suggested/requested shares, plan snapshots, candidate state and simulated fills are explicitly insufficient to establish actual ownership. System 1/V8 holdings cannot be silently imported.
  - Institutional UI contract now requires virtual positions to be labeled SIMULATED / VIRTUAL and forbids populating an owner actual-holdings board while `ACTUAL_POSITION_MONITOR_VERIFIED=false`.
  - Added `system2/tests/position_monitor_capability_semantics.test.mjs` to prevent regression back to false operational claims and to bind docs to current runtime/storage evidence.
  - First System2 Research CI attempt failed only because the new test regex incorrectly flagged the explicit prohibition sentence itself; the guard was corrected to assert required fail-closed wording rather than word proximity.
  - Corrected PR head `67151b901029b17b567cf1f29b4a74c349460996`: System2 Research CI run `37197332296` PASS; V8 Regression run `37197332187` PASS.
  - Final PR #536 head `d0f97bded1e88965d75b9db804cc5264e1220ebe`: System2 Research CI `37197495890` PASS; V8 Regression `37197495893` PASS; mergeable=true before merge.
  - PR #536 squash-merged to `main` as `0774a356377efc6892e72bf60c202561d227e47b`; merged-main readback preserved `FIX_IMPLEMENTED`, virtual-only storage truth, and `ACTUAL_POSITION_MONITOR_VERIFIED=false`.
  - Changed-file scope contains only System 2 canonical documentation, correction/checkpoint state and the new System 2 semantic test; no System 1 Formal Core, System 1 holdings/runtime, capital/order logic or production push file is modified.
  - Remaining UNKNOWN / future gate: no actual-holdings source is wired or physically verified. Any broker-holdings or System 1 shared-holdings integration remains `OWNER_DECISION_REQUIRED` and is not implemented by this correction.
- verificationEvidence:
  - Independent audit re-read latest main before closure (audit branch base 4b988fbb762bc5ada1b1c7d6651ad6bcc217e549) rather than relying on the remediation-room completion claim.
  - Canonical Master/Architecture/Position Management/Storage/Build Progress/Checkpoint/UI/candidate lifecycle/capacity/strategy identity surfaces consistently separate TARGET_ONLY / DESIGN_APPROVED / VIRTUAL_POSITION_READY / ACTUAL_HOLDINGS_SOURCE_NOT_WIRED / ACTUAL_POSITION_MONITOR_VERIFIED=false.
  - Latest-main search confirms the former misleading present-tense operational claims are absent from live capability statements. Remaining exact phrase occurrences are confined to correction history, explicit prohibitions/negative assertions, or the semantic regression test.
  - SYSTEM2_STORAGE_SCHEMA explicitly keeps s2_positions virtual/simulated only, forbids overloading it with actual holdings, and requires owner-authorized provenance/reconciliation before any future actual-holdings store/adapter.
  - Candidate lifecycle and current runtime evidence remain virtual-only: SIM_FILLED -> POSITION_MONITOR and resonance persistence reads s2_positions; this is not relabeled as owner actual holdings.
  - Institutional UI contract requires SIMULATED / VIRTUAL labels and forbids populating an owner actual-holdings board while ACTUAL_POSITION_MONITOR_VERIFIED=false.
  - PR #536 changed only System 2 canonical docs/state plus system2/tests/position_monitor_capability_semantics.test.mjs; no System 1 file was changed. PR #540 changed only the correction queue MD/JSON and remediation checkpoint.
  - PR #536 System2 Research CI 37197495890 PASS and V8 Regression 37197495893 PASS. PR #540 System2 Research CI 37197938887 PASS and V8 Regression 37197938899 PASS.
  - Protected boundaries remain intact: no System1 Formal Core/holdings/runtime mutation, no capital/order authority, no production push, and no inferred actual fills/holdings.
  - Residual limitation is explicit and acceptable for this correction: no actual-holdings source/reconciliation/runtime is wired or physically verified. Any future broker or System1 shared-holdings integration remains OWNER_DECISION_REQUIRED.
  - Independent verification receipt: `system2/evidence/s2_corr_20261004_002_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — capability-state mismatch corrected; actual owner-holdings monitoring remains NOT WIRED / NOT VERIFIED and is outside this closure.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-04T19:30:03+08:00
- updatedAt: 2026-10-04T19:30:03+08:00

## Next action

When the independent correction auditor identifies a material issue, append the directive here and update the JSON companion in the same change.
