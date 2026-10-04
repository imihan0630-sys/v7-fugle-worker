# System 2 Remediation Checkpoint

Updated: 2026-10-05 05:52 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IN_PROGRESS
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261005-001` — Capacity persistence loses partial-denominator provenance before downstream resonance/performance.

Routing:
- severity: `MEDIUM`
- status: `FIX_IN_PROGRESS`
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- blockedBy: none

## Canonical problem statement

CORR-004 correctly allows clean admissions to continue under a PARTIAL selection denominator and keeps partial-no-selection fail-safe. The remaining defect is persistence/provenance loss:

- `candidate_capacity_receipt.mjs` does not commit denominator state/accounting provenance into the capacity identity/hash.
- `toCapacityRunRow` therefore persists no denominator state, unresolved accounting, Shadow-run identity or accounting hash.
- the 19:00 resonance path reads only the persisted capacity row, so COMPLETE vs PARTIAL vs legacy UNKNOWN cannot be recovered from the capacity artifact itself.
- downstream pool/comparison/UI/performance evidence can therefore lose the coverage context even when the original Shadow runs still exist.

## Required correction boundary

New capacity persistence must preserve:
- denominator state: `COMPLETE / PARTIAL / UNKNOWN`;
- unresolved count;
- unresolved-by-state;
- denominator blocker codes;
- immutable contributing Shadow-run provenance;
- Shadow accounting hash / equivalent immutable receipt identity;
- explicit backward-compatible legacy semantics: missing provenance = `UNKNOWN / LEGACY_PROVENANCE_INCOMPLETE`.

Capacity identity/hash must commit to this provenance.

Resonance pool provenance must carry the upstream denominator state/link so downstream comparison/UI/performance/promotion evidence can distinguish COMPLETE, PARTIAL and legacy UNKNOWN.

## CORR-004 invariants that must not regress

- PARTIAL denominator + clean ready admissions may continue to Shadow/capacity/bounded monitoring.
- INCOMPLETE symbols remain BLOCKED and cannot become BUY_ELIGIBLE / ACTIVE_ENTRY_MONITOR / capacity admissions.
- PARTIAL denominator + no ready selection remains:
  - `zeroPickDay=null`;
  - `capacityReceipt=null`;
  - no `s2_capacity_runs`.
- no arbitrary 95%/90%/80% or other coverage threshold.
- PIT/UNKNOWN semantics remain unchanged.

## Protected boundaries

Do not modify:
- System 1 Formal Core;
- System 1 runtime;
- System 2 final/live selection authority;
- production push/runtime;
- capital/order behavior;
- strategy weights;
- strategy thresholds;
- assessor policy.

## Initial conflict units

Owned for this correction:
- capacity receipt/provenance construction;
- `s2_capacity_runs` schema/persistence/readback semantics;
- resonance capacity reader / pool provenance persistence;
- resonance comparison/read models/UI exposure only as needed to preserve provenance;
- related System 2 tests/contracts/docs;
- Correction Queue evidence and this checkpoint.

## Required regression evidence

Pending:
- same admitted symbols + COMPLETE denominator vs PARTIAL denominator persist distinguishable provenance;
- capacity hash/identity differs or otherwise cryptographically commits to denominator provenance;
- explicit immutable Shadow-run IDs/accounting hashes persisted;
- resonance pool reads COMPLETE vs PARTIAL distinction;
- legacy capacity row without provenance reads `UNKNOWN / LEGACY_PROVENANCE_INCOMPLETE`;
- partial denominator + no selection still writes no `s2_capacity_runs`;
- no protected authority change;
- targeted tests;
- System2 Research CI;
- V8 Regression;
- latest-main drift/readback.

## Exact next continuation point

1. Read current `s2_capacity_runs` / resonance-pool schema and migrations.
2. Trace capacity row whitelist/persistence batch, capacity readback, pool row persistence, comparison frame and UI/read models.
3. Implement the smallest backward-compatible provenance extension that commits denominator provenance into capacity identity and propagates it downstream.
4. Add complete-vs-partial same-admission and legacy-row regression tests.
5. Run targeted tests -> System2 Research CI -> V8 Regression.
6. Re-read latest main and reconcile concurrent Queue/checkpoint changes without overwriting other lanes.
7. Update CORR-001 to `FIX_IMPLEMENTED` only after durable evidence is merged.
8. Hand back to AUDIT_LANE; do not self-mark `VERIFIED_CLOSED`.
