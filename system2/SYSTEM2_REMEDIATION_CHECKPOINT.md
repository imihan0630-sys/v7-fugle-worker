# System 2 Remediation Checkpoint

Updated: 2026-10-04 19:00 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IMPLEMENTED / PENDING_INDEPENDENT_AUDIT
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Mission

Serve as System 2's concentrated remediation/SWAT lane for cross-module, recurrent, orphaned, false-completion and explicitly routed remediation work. This room is not a generic bug inbox.

## Active correction

`S2-CORR-20261004-002` — POSITION_MONITOR target behavior is presented as current operational capability.

Routing:
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- severity: `MEDIUM`
- implementation status: `FIX_IMPLEMENTED`
- independent verification: `PENDING_INDEPENDENT_AUDIT`
- blockedBy: none

`S2-CORR-20261004-001` remains DATA_LANE ownership and was not touched.

## Implemented state

Canonical capability/readiness is now separated into:

- `TARGET_ONLY`: continuous owner actual-holdings monitoring target behavior.
- `DESIGN_APPROVED`: actual-vs-desired exposure, capacity exclusion and symmetric HOLD / REDUCE / EXIT / ADD / RE-ADD / RESTORE architecture.
- `VIRTUAL_POSITION_READY`: simulated fills, virtual `s2_positions`, `SIM_FILLED -> POSITION_MONITOR`, and current simulated-position resonance HOLD/EXIT context.
- `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED`: no authorized System 2 actual-holdings ingestion/reconciliation adapter is physically verified.
- `ACTUAL_POSITION_MONITOR_VERIFIED=false`.

Current literal `POSITION_MONITOR` runtime state must therefore be interpreted as virtual/simulated unless a future separately authorized actual-holdings provenance contract is introduced and verified.

## Not implemented / remaining UNKNOWN

The correction intentionally does **not** implement:
- broker holdings integration;
- System 1/V8 shared holdings import;
- actual-holdings reconciliation;
- actual quantity/cost/fill/ownership readback;
- actual capital/order authority;
- production push changes.

No complete authorized System 2 actual-holdings adapter/reconciliation/readback chain was found in the bounded repository audit.

## Actual-holding fail-closed gate

A future System 2 surface may call a position an **actual holding** only after owner-authorized integration preserves:
- source identity and account scope;
- position as-of / observation timestamp;
- reconciled quantity;
- cost basis only when actually sourced/reconciled;
- confirmed fill provenance if fill history is used;
- ownership provenance;
- reconciliation status, conflicts and UNKNOWN semantics;
- durable persistence/readback evidence.

Signal price, trigger price, suggested/requested shares, plan snapshot, candidate state, simulated fill and virtual `s2_positions` rows are insufficient to establish actual ownership.

Any broker-holdings or System 1 shared-holdings integration is `OWNER_DECISION_REQUIRED`.

## Conflict units changed

- `system2/SYSTEM2_MASTER.md`
- `system2/SYSTEM2_ARCHITECTURE.md`
- `system2/SYSTEM2_POSITION_MANAGEMENT_ARCHITECTURE.md`
- `system2/SYSTEM2_STORAGE_SCHEMA.md`
- `system2/SYSTEM2_BUILD_PROGRESS_MAP.md`
- `system2/SYSTEM2_CHECKPOINT.md`
- `system2/SYSTEM2_INSTITUTIONAL_MONITORING_UI_V0_1.md`
- `system2/SYSTEM2_CANDIDATE_LIFECYCLE_CONTRACT_V0_1.md`
- `system2/SYSTEM2_CANDIDATE_CAPACITY_CONTRACT_V0_1.md`
- `system2/SYSTEM2_STRATEGY_IDENTITY_CARDS.md`
- `system2/SYSTEM2_CORRECTION_QUEUE.md`
- `system2/SYSTEM2_CORRECTION_QUEUE.json`
- this remediation checkpoint
- `system2/tests/position_monitor_capability_semantics.test.mjs`

No System 1 Formal Core, System 1 holdings/runtime, capital/order logic, production push or Class B/Class C behavior was changed.

## Tests / physical evidence

PR: `#536` — `System2 CORR-002: separate virtual positions from actual holdings readiness` — merged to `main` as `0774a356377efc6892e72bf60c202561d227e47b`.

Semantic readback:
- all five readiness states present;
- old misleading present-tense actual-holdings claims removed from Master/Architecture;
- storage confirms `s2_positions` virtual/simulated only;
- UI contract fails closed on actual-holdings labels;
- candidate lifecycle states current `POSITION_MONITOR` is simulated/virtual;
- Correction Queue MD/JSON agree on `FIX_IMPLEMENTED`.

Targeted regression:
- added `system2/tests/position_monitor_capability_semantics.test.mjs`.
- first CI attempt exposed a test-regex false positive against the explicit prohibition sentence; the test itself was corrected rather than weakening the semantic guard.

Corrected semantic head `67151b901029b17b567cf1f29b4a74c349460996`:
- System2 Research CI `37197332296`: PASS.
- V8 Regression `37197332187`: PASS.

Final PR head `d0f97bded1e88965d75b9db804cc5264e1220ebe` after queue/checkpoint evidence updates:
- System2 Research CI `37197495890`: PASS.
- V8 Regression `37197495893`: PASS.
- PR #536 mergeability: true before merge.
- Squash merge to main: `0774a356377efc6892e72bf60c202561d227e47b`.

Merged-main readback confirms `S2-CORR-20261004-002` = `FIX_IMPLEMENTED`, assignedLane=`REMEDIATION_LANE`, verificationEvidence=`PENDING_INDEPENDENT_AUDIT`, and all canonical readiness guards remain present.

## Closure / owner gate

This correction fixes readiness truth; it does **not** prove the actual Position Monitor operational.

Do not claim:
- actual holdings are currently monitored;
- actual holdings reconciliation exists;
- quantity/cost/fill provenance exists;
- Position Monitor is fully complete.

Future actual-holdings integration remains `OWNER_DECISION_REQUIRED`.

## Exact next continuation point

1. Hand `S2-CORR-20261004-002` to `SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR` for independent acceptance-criteria verification.
2. If the auditor confirms the implementation evidence, it may advance through `VERIFYING` to `VERIFIED_CLOSED` under correction governance.
3. If the auditor finds a semantic/runtime gap, reopen only the affected conflict unit and return it to REMEDIATION_LANE; do not broaden into a new holdings integration.
4. Do not start any broker/System1 holdings integration without a separate owner decision; that future work remains `OWNER_DECISION_REQUIRED`.
