# System 2 Execution Lane Governance V0.1

Updated: 2026-10-04 Asia/Taipei
Status: ACTIVE
Scope: Parallel System 2 execution ownership
Formal Core impact: NONE
Production trading impact: NONE

## Purpose

System 2 may execute multiple work lanes in parallel without turning every defect into a cross-room handoff or allowing multiple rooms to mutate the same subsystem without coordination.

The objective is throughput with clear ownership, not maximum room count.

## Canonical lanes

### BUILD_LANE — System 2｜建置總控室
Primary responsibility:
- System 2 architecture and integration;
- strategy/ranking/regime/shadow/monitoring/UI/API/performance construction;
- ordinary defects tightly coupled to the module currently being built;
- cross-lane integration after upstream artifacts are verified.

It does not automatically take every OPEN/HIGH correction.

### DATA_LANE — System 2｜歷史資料工程室
Primary responsibility:
- TWSE/TPEx historical daily-market ingestion;
- R2/D1 historical storage, manifests, checkpoints and completion receipts;
- historical universe/listing/delisting/session coverage;
- source normalization, PIT/continuity semantics and coverage matrices;
- historical full-market replay input qualification.

It must not independently change strategy weights, ranking policy, final-selection authority, capital/order logic or System 1 Formal Core.

### REMEDIATION_LANE — System 2｜補強修復室
Primary responsibility:
- cross-module defects;
- repeated/recurrent failures;
- orphaned implementation gaps not cleanly owned by BUILD or DATA;
- false-completion remediation;
- integration breakage and accumulated technical debt;
- HIGH/CRITICAL remediation specifically routed here by the correction auditor.

It is a SWAT/remediation lane, not a generic bug queue.

### AUDIT_LANE — System 2 糾錯顧問室
Primary responsibility:
- independent detection;
- severity/routing classification;
- correction directives;
- independent closure verification.

It should not normally implement the fix it will later verify.

### OWNER_DECISION
Used when the safest resolution needs a protected strategy, Class B/Class C, production, capital, order, push, permission, secret or Formal-Core decision.

## Routing classes

Every material correction may carry one routing class:

- `LOCAL_FIX`
- `BUILD_LANE`
- `DATA_LANE`
- `REMEDIATION_LANE`
- `OWNER_DECISION_REQUIRED`

Severity and routing are independent dimensions.

Examples:
- a HIGH historical-backfill orphan belongs to DATA_LANE, not automatically REMEDIATION_LANE;
- a LOW CSS defect inside an active UI build can remain LOCAL_FIX;
- a repeated cross-module ranking/router defect may be REMEDIATION_LANE;
- a Formal Core change remains OWNER_DECISION_REQUIRED regardless of technical simplicity.

## Routing rules

### LOCAL_FIX
Use when:
- defect is small and isolated;
- the active module owner already has full context;
- handing it off would cost more than fixing it locally;
- no cross-module ownership transfer is needed.

The current owner fixes it and preserves normal test evidence. CRITICAL/HIGH closure rules still apply if the issue was formally entered into the Correction Queue.

### BUILD_LANE
Use when:
- issue is tightly coupled to active System 2 construction;
- architecture/integration context makes the build owner the lowest-risk implementer;
- the fix does not belong to historical-data ownership.

### DATA_LANE
Use when:
- the primary truth being repaired is source ingestion, historical population, coverage, storage, PIT/provenance, session continuity or replay inputs.

### REMEDIATION_LANE
Use when one or more are true:
- defect spans multiple subsystems;
- the same defect has recurred;
- a prior implementation was abandoned/orphaned and has no clean current owner;
- remediation requires concentrated diagnosis that would materially stall BUILD;
- implementation and canonical documentation diverged across modules;
- false completion must be repaired across several artifacts.

Do not route a defect here merely because it is severe.

### OWNER_DECISION_REQUIRED
Use when required by existing governance. Safe diagnostics may continue, but protected mutation waits for owner approval.

## Single active modification owner

Parallel work is allowed only with explicit modification ownership.

Rule:
**one conflict unit -> one active modification owner at a time.**

A conflict unit may be:
- one source file;
- one schema/migration family;
- one runtime module;
- one canonical contract;
- one shared checkpoint section;
- one workflow whose semantics are under active change.

Other lanes may read, analyze, test, or propose changes, but should not independently mutate the same conflict unit concurrently.

If two lanes need the same conflict unit:
1. determine the current owner;
2. either keep implementation with that owner, or record an explicit ownership transfer;
3. re-read latest main before mutation;
4. reconcile concurrent changes rather than overwriting them.

## Checkpoint ownership

- BUILD_LANE durable cursor:
  `system2/SYSTEM2_CHECKPOINT.md` for global build integration.
- DATA_LANE durable cursor:
  `system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md`.
- REMEDIATION_LANE durable cursor:
  `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md`.
- AUDIT_LANE durable queue:
  `system2/SYSTEM2_CORRECTION_QUEUE.md` + JSON companion.

DATA and REMEDIATION should not use the global System2 checkpoint as their high-frequency scratch cursor. They update it only when a durable global milestone materially changes.

## Correction Queue assignment fields

A correction directive should preserve:
- `routingClass`;
- `assignedLane`;
- `assignedRoom`;
- `modificationOwner`;
- optional `blockedBy`.

These fields do not change severity or closure authority.

## Build-room behavior with corrections

The build/control room must read the Correction Queue before substantive work.

It must:
- respect CRITICAL/HIGH blocks affecting its current dependency;
- execute only LOCAL_FIX / BUILD_LANE items assigned to it;
- not seize DATA_LANE or REMEDIATION_LANE work merely because it is HIGH;
- continue non-conflicting build work when a blocking correction belongs to another lane and the build work does not depend on the unresolved artifact.

## Data-room behavior

The historical-data room:
- consumes existing architecture/contracts rather than redesigning System 2;
- continues from the latest data checkpoint;
- records market/year completion evidence;
- keeps gaps explicit;
- marks correction work `FIX_IMPLEMENTED` only when its acceptance criteria are actually met.

## Remediation-room behavior

The remediation room:
- begins from a specific correction ID or explicitly routed remediation task;
- does not create new product scope merely to simplify a repair;
- minimizes touched conflict units;
- returns implementation evidence to the Correction Queue;
- cannot self-close CRITICAL/HIGH items.

## Audit closure independence

For CRITICAL/HIGH:
implementation lane -> `FIX_IMPLEMENTED`
then AUDIT_LANE -> `VERIFYING` -> `VERIFIED_CLOSED`.

The same implementation room must not be the sole closure authority.

## Parallelism safety

Parallel work is allowed when:
- lanes do not share an active modification owner;
- unresolved upstream data is not silently treated as complete downstream;
- main is re-read before write/merge;
- shared contract changes are explicit and version/review controlled;
- each room has a durable continuation point.

Parallelism should be reduced when shared-file contention, schema migration contention or repeated merge drift outweighs throughput gains.

## Anti-fragmentation rule

Do not create additional permanent System 2 rooms merely because a task is large.

New permanent lanes require a genuinely different ownership boundary. Current intended permanent execution structure is:
1. BUILD_LANE;
2. DATA_LANE;
3. REMEDIATION_LANE;
4. AUDIT_LANE.

This is the default ceiling unless the owner explicitly approves another durable ownership split.
