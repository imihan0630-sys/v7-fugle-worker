# System 2 Remediation Checkpoint

Updated: 2026-10-09 14:08 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IN_PROGRESS
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — System2 isolated D1 writers lack global free-tier daily write-budget coordination.

Routing:
- severity: `HIGH`
- status: `FIX_IN_PROGRESS`
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- blockedBy: none

## Canonical incident

Cloudflare Workers Free D1 quota is account-wide, not database-local:
- rows written/day: 100,000;
- rows read/day: 5,000,000;
- reset: 00:00 UTC / 08:00 Asia/Taipei.

Observed 2026-10-07 account analytics:
- SYSTEM2_DB rowsWritten = 124,629;
- V7_DB rowsWritten = 1,869;
- account total = 126,498;
- System1 after-market primary/recovery business execution was invoked but persistence failed on D1 quota.

Known high-write System2 examples:
- Recent A1 Hot History Warmup = 57,880 rowsWritten for 9,640 logical bars (~6.00x amplification);
- scheduled Daily Shadow = 13,130 rowsWritten;
- later Daily Shadow push = 1,296 rowsWritten;
- annual historical samples ~5.8k–7.4k rowsWritten.

Concurrency group `system2-isolated-d1-writer` serializes mutation but does not reserve finite daily quota.

## Required implementation boundary

Implement one shared UTC-day account-level D1 budget/reservation/priority contract that:
- protects P0 launch/operational work;
- explicitly protects System1 23:35/23:55 after-market persistence headroom;
- protects scheduled System2 Daily Shadow / launch-critical acceptance before P1/P2/P3 work;
- uses measured D1 `rows_written` / `rows_read` and conservative reservations;
- never invents exact remaining usage when account-wide usage is unknown;
- supports explicit `QUOTA_BUDGET_DEFER` before predictable Cloudflare hard rejection;
- makes Recent A1 warmup quota-adaptive and blocks ordinary push physical mutation;
- makes P2/P3 ordinary push paths read-only/test-only unless explicitly authorized;
- persists compact reservation/result receipts without creating a high-write ledger;
- requires every physical isolated System2 D1 writer to be registered with writerClass/priority/quota behavior;
- preserves historical resume/immutability and Daily Shadow semantics;
- never triggers paid-plan/billing mutation.

## Protected boundaries

Do not modify:
- System 1 Formal Core;
- System 1 trading logic;
- System 2 PIT/UNKNOWN/provenance semantics;
- System 2 strategy/ranking/final-selection semantics;
- production push/capital/order authority;
- Cloudflare billing/plan.

System1 integration in this correction is limited to protecting measured after-market D1 persistence quota at the shared account-budget layer; no Formal Core/runtime business logic change is authorized.

## Initial execution order

1. Inventory every workflow permitted to mutate System2 D1 and its current trigger surface.
2. Read existing quota/lease/infrastructure-check primitives and any System1 after-market quota evidence.
3. Define shared Free-tier contract + writer registry + priority/reservation model.
4. Implement gate before physical mutation in all registered writer classes.
5. Disable ordinary push mutation for Recent A1 warmup and P2/P3 maintenance/smoke writers.
6. Add quota-adaptive warmup batch sizing using measured rowsWritten-per-date amplification.
7. Add deterministic multi-writer/day regression including scheduled Daily Shadow + later push + warmup/bulk and explicit System1 reserve.
8. Run targeted tests -> System2 Research CI -> V8 Regression.
9. latest-main drift check -> merge -> merged-main readback.
10. Stop at `FIX_IMPLEMENTED`; hand to AUDIT_LANE and notify DATA_LANE to perform 2026-10-08 physical acceptance/continuation evidence.

## Required evidence at completion

- changed files;
- writer registry coverage;
- official quota contract/version/source;
- priority/reservation model;
- System1 reserve provenance;
- warmup push guard and adaptive-date evidence;
- multi-writer deterministic budget regression;
- explicit unknown-usage fail-conservative behavior;
- protected-boundary regression;
- System2 CI + V8 Regression;
- remaining UNKNOWN;
- exact DATA_LANE physical acceptance continuation point;
- exact AUDIT_LANE handoff.
