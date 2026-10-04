# System 2 Remediation Checkpoint

Updated: 2026-10-05 05:58 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IMPLEMENTED / PENDING_INDEPENDENT_AUDIT
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261005-001` — Capacity persistence loses partial-denominator provenance before downstream resonance/performance.

Routing:
- severity: `MEDIUM`
- status: `FIX_IMPLEMENTED`
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- verification: `PENDING_INDEPENDENT_AUDIT`
- blockedBy: none

## Implementation summary

The capacity/resonance provenance chain now preserves CORR-004 denominator truth end-to-end:

Shadow run accounting
→ canonical `shadowAccountingHash`
→ capacity denominator provenance
→ capacity receipt/hash
→ `s2_capacity_runs.counts_json`
→ exact capacity ID+hash resonance linkage
→ bounded watch-pool provenance/hash
→ refresh audit / operations API / UI
→ immutable resonance comparison frame.

No date/clock-only heuristic join is used for the provenance linkage.

## Changed files — implementation PR #601

1. `system2/SYSTEM2_DAILY_RESONANCE_GLOBAL_INTEGRATION_V0_1.md`
2. `system2/SYSTEM2_DAILY_SHADOW_CAPACITY_ORCHESTRATION_V0_1.md`
3. `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md`
4. `system2/SYSTEM2_RESONANCE_COMPARISON_FRAME_V0_1.md`
5. `system2/SYSTEM2_STORAGE_SCHEMA.md`
6. `system2/deploy/resonance_page.mjs`
7. `system2/runtime/candidate_capacity_receipt.mjs`
8. `system2/runtime/daily_resonance_integration_v0_1.mjs`
9. `system2/runtime/daily_resonance_operations_v0_1.mjs`
10. `system2/runtime/daily_resonance_persistence_v0_1.mjs`
11. `system2/runtime/daily_shadow_capacity_orchestrator_v0_1.mjs`
12. `system2/runtime/resonance_comparison_frame_v0_1.mjs`
13. `system2/runtime/storage_rows.mjs`
14. `system2/tests/candidate_capacity_receipt.test.mjs`
15. `system2/tests/daily_resonance_integration_v0_1.test.mjs`
16. `system2/tests/daily_resonance_pool_freshness_audit_v0_1.test.mjs`
17. `system2/tests/daily_shadow_capacity_orchestrator_v0_1.test.mjs`
18. `system2/tests/mixed_universe_shadow_readiness_v0_1.test.mjs`
19. `system2/tests/resonance_comparison_frame_v0_1.test.mjs`
20. `system2/tests/storage_rows.test.mjs`

## Schema / provenance versions

Physical isolated D1 schema:
- remains `1.1`;
- no D1 migration required;
- no production schema push performed.

Logical receipt/provenance versions:
- capacity receipt: `S2_CAPACITY_V0_2`;
- denominator provenance: `S2_SELECTION_DENOMINATOR_PROVENANCE_V0_1`;
- resonance watch-pool object: `SYSTEM2_RESONANCE_WATCH_POOL_V0_2`.

The existing `s2_capacity_runs.counts_json` is the backward-compatible persistence envelope for the new provenance payload.

## Hash semantics

New capacity receipt identity commits to denominator provenance.

The receipt includes:
- denominator state: `COMPLETE / PARTIAL / UNKNOWN`;
- `unresolvedCount`;
- `unresolvedByState`;
- denominator blocker codes;
- contributing Shadow runs:
  - strategy ID/version;
  - immutable Shadow `runId`;
  - canonical `shadowAccountingHash = sha256(shadowRunReceipt)`;
  - `runFingerprintHash` when available;
- denominator `provenanceHash`.

`capacityHash` is calculated only after this provenance object is in the receipt base.

Therefore:
- same admissions + COMPLETE denominator;
- same admissions + PARTIAL denominator;

cannot share the same provenance hash/capacity hash.

The capacity orchestrator also verifies an existing Shadow fingerprint accounting hash when one is supplied; mismatch fails closed.

## Backward compatibility / legacy rows

No existing capacity row is rewritten.

For a legacy V0.1 `s2_capacity_runs` row without `counts_json.selectionDenominator`:
- denominator state = `UNKNOWN`;
- blocker = `LEGACY_PROVENANCE_INCOMPLETE`;
- legacy provenance flag = true;
- it is never inferred COMPLETE.

Malformed new provenance state/hash fails closed rather than being silently promoted.

## Resonance downstream readback

The 19:00 capacity reader now reads `counts_json` and capacity schema version.

Persisted active pools resolve upstream provenance through an exact immutable relation:

`pool.source_capacity_run_id == capacity.capacity_run_id`
AND
`pool.source_capacity_hash == capacity.capacity_hash`

This is not a `marketDate + decisionTimestamp` heuristic join.

The bounded pool object carries:
- `sourceDenominatorState`;
- `sourceDenominatorProvenanceHash`;
- full `sourceDenominatorProvenance`.

The pool hash commits to those fields.

Downstream exposure:
- refresh audit `diagnostics_json` records denominator state/hash;
- operations API exposes upstream capacity and active-pool denominator provenance;
- resonance UI displays `母體 COMPLETE/PARTIAL/UNKNOWN`;
- resonance comparison frame includes source denominator state/hash/full provenance, so later performance/comparison/promotion analysis can distinguish complete vs partial selection coverage.

## CORR-004 invariants preserved

Still true:
- PARTIAL denominator + clean ready admissions may proceed to capacity/bounded monitor.
- INCOMPLETE symbols remain blocked/non-admitted.
- PARTIAL denominator + no ready selection:
  - `zeroPickDay=null`;
  - `capacityReceipt=null`;
  - no `s2_capacity_runs`.
- no arbitrary 80/90/95% or other coverage threshold.
- denominator state is provenance/context, not a newly invented trading threshold.

## Regression / test evidence

Coverage includes:
- candidate capacity receipt: same admitted symbols under COMPLETE vs PARTIAL -> distinct denominator provenance hash and capacity hash;
- storage serializer: denominator provenance survives into `counts_json`;
- capacity orchestrator: Shadow run IDs/accounting linkage present in new capacity receipt;
- mixed-universe CORR-004 regression remains intact;
- resonance integration: same symbol assignments expose COMPLETE vs PARTIAL pool provenance and distinct pool hash;
- legacy capacity read: UNKNOWN / `LEGACY_PROVENANCE_INCOMPLETE`;
- active pool readback: exact capacity linkage exposes PARTIAL provenance;
- comparison frame: upstream PARTIAL provenance survives immutable frame construction;
- partial-no-selection: still no capacity persistence.

Implementation head:
`b0e8f0b29c8c2d6a23d863d30091252abc519c6d`

Formal checks:
- System2 Research CI `37238471951`: **PASS**
- V8 Regression `37238471968`: **PASS**
- PR #601 mergeability before merge: true
- latest-main drift before merge: zero
- PR #601 squash merge:
  `1aa5bc86a4e4b47178b890e70c5542562202e752`

Merged-main readback confirmed all runtime/provenance guards above.

## Remaining UNKNOWN / residual

- Legacy capacity rows cannot retroactively recover denominator provenance that was never persisted; they intentionally remain UNKNOWN.
- This correction does not authorize using COMPLETE/PARTIAL/UNKNOWN as a new live admission threshold.
- It does not upgrade assessor policy, selection authority, live push, capital/order authority or strategy thresholds.
- No physical production/runtime deployment was performed; repository logic and CI/regression evidence are the current implementation evidence.
- Future performance/promotion logic may consume this provenance, but any policy that conditions promotion/trading on it requires its own preregistration/evidence/owner governance.

## Protected boundaries

Unchanged:
- System 1 Formal Core;
- System 1 runtime;
- System 2 final/live selection authority;
- production push/runtime;
- capital/order;
- strategy weights;
- strategy thresholds;
- assessor policy;
- CORR-004 UNKNOWN/PARTIAL semantics.

## Exact next continuation point

After this evidence checkpoint is merged, hand `S2-CORR-20261005-001` to `SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR`.

AUDIT_LANE should independently verify:
1. capacity hash really commits to denominator provenance;
2. Shadow run ID/accounting hashes are immutable and reconstructable;
3. legacy rows resolve UNKNOWN, not COMPLETE;
4. exact capacity ID+hash linkage survives resonance readback;
5. COMPLETE/PARTIAL same-admission cases remain distinguishable in pool/comparison evidence;
6. CORR-004 partial-ready and partial-no-selection semantics remain unchanged;
7. no coverage threshold or protected authority was introduced.

REMEDIATION_LANE must not self-mark this correction `VERIFIED_CLOSED`. If audit finds a defect, reopen only the affected conflict unit.
