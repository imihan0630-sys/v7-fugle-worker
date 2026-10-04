# System 2 Remediation Checkpoint

Updated: 2026-10-04 18:52 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IN_PROGRESS
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Mission

Serve as System 2's concentrated remediation/SWAT lane for defects that should not remain inside ordinary build flow.

Primary scope:
- cross-module defects;
- recurring failures;
- orphaned implementation gaps with no cleaner owner;
- false-completion remediation;
- integration breakage;
- technical debt explicitly routed from the Correction Queue.

This room is not a generic bug inbox.

## Active correction

`S2-CORR-20261004-002` — POSITION_MONITOR target behavior is presented as current operational capability.

Routing:
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- severity: `MEDIUM`
- working status: `FIX_IN_PROGRESS`
- blockedBy: none

`S2-CORR-20261004-001` remains DATA_LANE ownership and is not touched by this room.

## Diagnosis frozen so far

Latest-main repository audit distinguishes three different truths that had been blurred together:

1. **Target/design truth**
   - Owner-approved Position Management architecture requires actual holdings to eventually live outside candidate/entry-monitor capacity and to support symmetric HOLD / REDUCE / EXIT / ADD / RE-ADD / RESTORE decisions.
   - This is an approved target invariant, not evidence that actual holdings are wired today.

2. **Physically implemented System 2 truth**
   - `s2_positions` is explicitly defined as System 2 virtual/simulated positions only.
   - Candidate lifecycle implements `SIM_FILLED -> POSITION_MONITOR`.
   - Daily resonance persistence reads open `s2_positions` to provide simulated-position HOLD/EXIT lifecycle context.
   - System 2 execution simulation produces simulated fills/outcomes.
   - Existing MVP documentation already states no real position or order is created.

3. **Not implemented / not proven**
   - no authorized System 2 actual-holdings source contract found;
   - no broker-holdings adapter for System 2 found;
   - no end-to-end actual-holdings reconciliation path found;
   - no physically verified actual quantity/cost/fill/ownership provenance readback found;
   - no authority exists to silently import System 1/V8 holdings;
   - signal price, suggested shares, plan snapshots or simulated fills cannot establish actual ownership.

Current readiness classification:
- `TARGET_ONLY`: actual-holdings continuous POSITION_MONITOR target behavior.
- `DESIGN_APPROVED`: symmetric actual-vs-desired exposure architecture and capacity exclusion rule.
- `VIRTUAL_POSITION_READY`: simulated fills / `s2_positions` / virtual POSITION_MONITOR lifecycle.
- `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED`: current actual-holdings ingestion/reconciliation state.
- `ACTUAL_POSITION_MONITOR_VERIFIED`: false.

## Active conflict units

This correction currently owns semantic/readiness edits only in:
- `system2/SYSTEM2_MASTER.md`
- `system2/SYSTEM2_ARCHITECTURE.md`
- `system2/SYSTEM2_POSITION_MANAGEMENT_ARCHITECTURE.md`
- `system2/SYSTEM2_STORAGE_SCHEMA.md`
- `system2/SYSTEM2_BUILD_PROGRESS_MAP.md`
- `system2/SYSTEM2_CHECKPOINT.md`
- `system2/SYSTEM2_INSTITUTIONAL_MONITORING_UI_V0_1.md`
- `system2/SYSTEM2_CANDIDATE_LIFECYCLE_CONTRACT_V0_1.md`
- correction queue MD/JSON
- this remediation checkpoint
- one targeted semantic regression test if needed.

No System 1/V8 source, holdings/runtime, Formal Core, production push, capital/order behavior, strategy thresholds or Class B/Class C behavior is in scope.

## Required fail-closed actual-holdings gate

Before any System 2 surface may label a position as an **actual holding**, a future owner-authorized integration must provide and preserve at minimum:
- authorized source identity/account scope;
- observation/as-of timestamp and source provenance;
- reconciled quantity;
- cost basis only when actually sourced/reconciled;
- confirmed fill provenance where fills are used;
- ownership provenance;
- reconciliation state and conflict/UNKNOWN semantics;
- persistence/readback evidence;
- explicit separation from virtual/simulated `s2_positions`.

A future System 1 shared-holdings or broker-holdings integration is `OWNER_DECISION_REQUIRED` before implementation.

## Tests / evidence

Completed diagnosis evidence:
- bounded repository search found only simulated/virtual `s2_positions` lifecycle reads inside System 2 runtime;
- `SYSTEM2_STORAGE_SCHEMA.md` says `s2_positions` are System 2 virtual positions only and never V8 live holdings;
- `SYSTEM2_MVP_SHADOW_STATUS_V0_1.md` says existing simulated open positions supply HOLD semantics and no real position/order is created;
- no complete System 2 actual-holdings adapter/reconciliation/readback chain was found.

Pending:
- canonical semantic edits;
- targeted semantic regression test;
- System2 Research CI;
- V8 Regression;
- final latest-main/readback reconciliation;
- Correction Queue implementationEvidence update.

## Closure rule

Because this is a MEDIUM correction, implementation evidence may be recorded when the semantic/readiness fix is merged. Do not claim the entire Position Monitor operationally complete. Actual holdings integration remains unimplemented until separately authorized and physically verified.

## Exact next continuation point

Apply the minimum canonical semantic/readiness edits so every affected surface distinguishes:
`TARGET_ONLY / DESIGN_APPROVED / VIRTUAL_POSITION_READY / ACTUAL_HOLDINGS_SOURCE_NOT_WIRED / ACTUAL_POSITION_MONITOR_VERIFIED=false`.

Then add/run targeted semantic regression coverage, run System2 Research CI and V8 Regression, re-read canonical files from the final PR head, update `S2-CORR-20261004-002` implementationEvidence/status, and merge only after checks pass.
