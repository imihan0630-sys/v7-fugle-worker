# System 2 Remediation Checkpoint

Updated: 2026-10-05 02:25 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IMPLEMENTED / PENDING_INDEPENDENT_AUDIT
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261004-004` — Whole-universe history/continuity gate can block all Shadow evaluation because of symbol-local UNKNOWNs.

Routing:
- severity: `HIGH`
- status: `FIX_IMPLEMENTED`
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- independent verification: `PENDING_INDEPENDENT_AUDIT`
- blockedBy: none

Other corrections:
- `S2-CORR-20261004-001` remains DATA_LANE ownership and was not modified by this remediation.
- `S2-CORR-20261004-002` and `S2-CORR-20261004-003` remain independently `VERIFIED_CLOSED`.

## Implemented state

The S2-07 readiness model now separates two levels:

### 1. Global observation integrity

Global fail-closed remains in force for defects that invalidate the observation universe / clock / source contract.

Examples:
- current A1 source not READY;
- source/decision clock invalid;
- whole-universe accounting cannot be completed;
- source-wide history/revision/provenance integrity is explicitly BLOCKED;
- history source/query failures that prevent a trustworthy global probe.

These remain `INPUTS_NOT_READY` and cannot authorize capacity or zero-pick.

### 2. Symbol-local readiness

Symbol-local defects no longer block otherwise clean symbols globally.

Examples:
- insufficient PIT history / young listing;
- symbol-local continuity not verified;
- symbol-local history/revision/PIT gap;
- REQUIRED strategy evidence UNKNOWN.

These remain explicitly:
- `INCOMPLETE`;
- `BLOCKED`;
- denominator-accounted;
- not BUY_ELIGIBLE;
- not ACTIVE_ENTRY_MONITOR eligible;
- not capacity-admitted.

Ready symbols may continue through the already-authorized Shadow evaluation/ranking/capacity mechanics. No strategy threshold or assessor policy was invented.

## Changed files — implementation PR #585

PR #585 changed exactly these 13 files:

1. `system2/SYSTEM2_DAILY_SHADOW_CAPACITY_ORCHESTRATION_V0_1.md`
2. `system2/SYSTEM2_DAILY_SHADOW_INPUT_PREFLIGHT_V0_1.md`
3. `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md`
4. `system2/runtime/daily_shadow_capacity_orchestrator_v0_1.mjs`
5. `system2/runtime/daily_shadow_history_reader_v0_1.mjs`
6. `system2/runtime/daily_shadow_input_preflight_v0_1.mjs`
7. `system2/runtime/prediction_snapshot_v0_1.mjs`
8. `system2/tests/daily_shadow_capacity_orchestrator_v0_1.test.mjs`
9. `system2/tests/daily_shadow_input_preflight_v0_1.test.mjs`
10. `system2/tests/daily_shadow_input_preflight_workflow_guard.test.mjs`
11. `system2/tests/limited_shadow_run_assembler_v0_1.test.mjs`
12. `system2/tests/mixed_universe_shadow_readiness_v0_1.test.mjs`
13. `system2/tests/prediction_snapshot_v0_1.test.mjs`

Evidence-finalization branch additionally changes only:
- `system2/SYSTEM2_CORRECTION_QUEUE.md`;
- `system2/SYSTEM2_CORRECTION_QUEUE.json`;
- this remediation checkpoint.

## Runtime details

### History reader

`daily_shadow_history_reader_v0_1.mjs` now preserves:
- aggregate descriptive history/continuity coverage state;
- `globalIntegrityState`;
- `globalBlockerCodes`;
- `accountedSymbolCount`;
- `accountingComplete`;
- `symbolLocalIncompleteCount`;
- `selectionDenominatorComplete`;
- per-symbol `readinessState`, `evaluationInputReady`, `blockerCodes`, `denominatorAccounted`.

A local history/continuity/revision problem is retained on that symbol instead of becoming the global preflight gate.

### Input preflight

`daily_shadow_input_preflight_v0_1.mjs` now:
- uses global source/history integrity for global blocking;
- exposes `symbolAccounts`, `symbolLocalBlockers`, eligible and blocked symbol lists;
- permits future authorized assessor evaluation of ready symbols even if other symbols are locally incomplete;
- keeps `capacityWriteAuthorized` gated by global inputs + authorized assessor;
- keeps `zeroPickMayBeClaimed` additionally gated by complete selection denominator.

Current assessor policies remain unchanged/unfrozen where they were already unfrozen.

### Prediction zero-pick semantics

`prediction_snapshot_v0_1.mjs` now derives a selection denominator from complete Shadow run accounting.

No-selection states are separated:
- `CLEAN_ZERO_PICK` -> denominator complete -> `zeroPickDay=true`;
- `PARTIAL_COVERAGE_NO_SELECTION` -> unresolved INCOMPLETE/SOURCE_BLOCKED/SESSION_INVALID/ERROR -> `zeroPickDay=null`;
- `DENOMINATOR_UNKNOWN_NO_SELECTION` -> insufficient denominator evidence -> `zeroPickDay=null`.

### Capacity semantics

`daily_shadow_capacity_orchestrator_v0_1.mjs` now distinguishes:

- `CAPACITY_READY`
  - denominator complete with non-empty legitimate capacity.

- `CAPACITY_ZERO_PICK_READY`
  - denominator complete;
  - no surviving/admitted candidate;
  - `zeroPickDay=true`.

- `CAPACITY_READY_PARTIAL_COVERAGE`
  - some symbols unresolved/incomplete;
  - at least one clean symbol is legitimately admitted;
  - ready symbols may proceed;
  - incomplete symbols remain blocked/non-admitted;
  - `zeroPickDay=false`.

- `CAPACITY_PARTIAL_COVERAGE_NO_SELECTION`
  - denominator partial;
  - no ready admission;
  - `zeroPickDay=null`;
  - `capacityReceipt=null`;
  - **no `s2_capacity_runs` persistence**.

The no-receipt rule is deliberate: downstream 19:00 resonance currently treats an empty capacity receipt as a zero-pick pool, so partial denominator no-selection must not emit a capacity row that can become false `ZERO_PICK_ACTIVE`.

## Mixed-universe regression evidence

New:
`system2/tests/mixed_universe_shadow_readiness_v0_1.test.mjs`

Frozen fixture contains one universe with:

- A: history + continuity complete;
- B: insufficient history;
- C: continuity unverified;
- D: history/continuity complete but REQUIRED strategy evidence UNKNOWN.

Verified behavior:
- A history readiness = READY;
- B = INCOMPLETE / `INSUFFICIENT_PIT_HISTORY`;
- C = INCOMPLETE / `SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED`;
- D is mapped by the unchanged strategy evaluator to `strategyValidity=INCOMPLETE / entryReadiness=BLOCKED`;
- A can become the only admitted/active capacity symbol;
- B/C/D cannot become capacity admissions;
- B/C/D remain individually diagnosed rather than disappearing;
- all four current-universe symbols are denominator-accounted;
- partial coverage does not stop A.

## Global fail-closed evidence

The mixed-universe/preflight regression also injects a source-wide revision-integrity blocker:

- aggregate state = `SOURCE_WIDE_REVISION_AMBIGUITY`;
- `globalIntegrityState=BLOCKED`;
- global blocker = `SOURCE_WIDE_REVISION_AMBIGUITY`.

Verified:
- preflight = `INPUTS_NOT_READY`;
- `globalInputsReady=false`;
- `capacityWriteAuthorized=false`;
- `zeroPickMayBeClaimed=false`.

Current A1 source/clock validation remains unchanged; malformed/source-error/current-batch failures continue to fail closed globally.

## Zero-pick denominator evidence

Regression coverage verifies both cases:

### Clean denominator, no selection
- state = `CAPACITY_ZERO_PICK_READY`;
- `selectionDenominator.complete=true`;
- `zeroPickState=CLEAN_ZERO_PICK`;
- `zeroPickDay=true`.

### Partial denominator, no selection
- state = `CAPACITY_PARTIAL_COVERAGE_NO_SELECTION`;
- `selectionDenominator.complete=false`;
- `zeroPickState=PARTIAL_COVERAGE_NO_SELECTION`;
- `zeroPickDay=null`;
- `capacityReceipt=null`;
- no `s2_capacity_runs` operation exists.

Prediction Snapshot carries the same fail-safe denominator distinction.

## PIT / UNKNOWN preservation

This correction does not relax:
- `availableAt <= decisionTimestamp`;
- `pit_replay_eligible=1`;
- revision ambiguity detection;
- continuity state;
- source identity/provenance;
- immutable run accounting;
- strategy REQUIRED evidence UNKNOWN semantics.

It does not perform:
- UNKNOWN -> 0;
- UNKNOWN -> PASS;
- missing -> neutral;
- forward-fill;
- use of current data as historical truth.

No 95% / 90% / 80% or other market-wide coverage threshold was added.

## Test / CI evidence

Two early System2 CI failures were diagnostic and corrected without weakening the fix:

1. System2 Research CI `37223831928`:
   - old capacity test expected `CAPACITY_READY` for a prior INCOMPLETE membership;
   - expectation corrected to `CAPACITY_READY_PARTIAL_COVERAGE`.

2. System2 Research CI `37223878523`:
   - new mixed-universe test attempted an in-place `.sort()` on a frozen output array;
   - test changed to sort a copy, preserving immutability.

Final implementation head:
`7ee02cc98913e79fc981da4d21e39b54b48b4983`

- System2 Research CI `37224012433`: **PASS**
- V8 Regression `37224012419`: **PASS**
- PR #585 mergeability immediately before merge: true
- PR #585 squash merge:
  `b6dd5bff357d6c678825ca212afae6a533da68c8`

Merged-main readback confirmed all key runtime guards and no arbitrary coverage-threshold logic.

## Evidence-finalization PR

PR #586 — `System2 CORR-004: finalize remediation evidence`

- changed only Correction Queue MD/JSON + Remediation Checkpoint;
- System2 Research CI `37224314880`: **PASS**;
- V8 Regression `37224314865`: **PASS**;
- squash-merged to main as `73f284c937dd2fd626cbfe406df3fe5e8951a590`;
- merged-main Queue readback: `HIGH / FIX_IMPLEMENTED / REMEDIATION_LANE / PENDING_INDEPENDENT_AUDIT`.
## Protected boundaries

Unchanged:
- System 1 Formal Core;
- System 1 runtime;
- System 2 live/final-selection authority;
- production push/runtime;
- capital/order behavior;
- strategy weights;
- formal entry/exit thresholds;
- assessor policy.

## Remaining UNKNOWN / residual

- This correction fixes the **readiness level error**, but it does not authorize a strategy assessor or scheduled production Shadow capture.
- Current assessor readiness remains whatever the canonical assessor registry says; CORR-004 does not promote it.
- Historical/local continuity/provenance gaps may still exist for individual symbols. They are intentionally preserved as local UNKNOWN/INCOMPLETE rather than “fixed” by imputation.
- A truly source-wide revision/provenance ambiguity must be surfaced as a global integrity blocker by the upstream source/history adapter. CORR-004 preserves that fail-closed interface; it does not attempt to manufacture new source-wide evidence.
- No physical live-selection/capital/order authority was enabled or tested because it is outside scope.

## Exact next continuation point

1. Hand `S2-CORR-20261004-004` to `SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR` for independent acceptance-criteria verification.
2. AUDIT_LANE must independently verify mixed-universe continuation, symbol-local INCOMPLETE accounting, global fail-closed behavior, and denominator-aware zero-pick semantics against merged main.
3. If acceptance criteria pass, AUDIT_LANE may advance `FIX_IMPLEMENTED -> VERIFYING -> VERIFIED_CLOSED` under correction governance.
4. If a residual defect is found, reopen only the affected conflict unit and formally route it; do not weaken PIT/UNKNOWN or introduce percentage coverage thresholds.
5. REMEDIATION_LANE must not self-mark this HIGH correction `VERIFIED_CLOSED`.
