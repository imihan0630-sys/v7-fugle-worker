# System 2 Remediation Checkpoint

Updated: 2026-10-09 16:11 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IN_PROGRESS / ADVERSARIAL_REMEDIATION
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — account-wide Cloudflare D1 Free quota coordination.

Canonical Queue on latest main had advanced to `VERIFYING` after independent audit. PR #983/#984 then reproduced four source-level closure blockers. REMEDIATION_LANE is therefore repairing only these routed conflict units and must return the ticket to `FIX_IMPLEMENTED`; it must not self-close this HIGH directive.

### Independent adversarial evidence

- PR #983 merge: `ced79512f44689b01bc792c04e468128408f4042`
- PR #984 merge: `f1511388b036b64646ce61b8ced273c10cda3b51`
- evidence: `system2/evidence/S2_CORR_003_INDEPENDENT_ADVERSARIAL_CI_ACCEPTANCE_20261009_V0_1.json`
- test: `system2/tests/d1_account_quota_adversarial_independent_audit_20261009.test.mjs`
- independent CI reproduced 4/4 counterexamples.

## Exact active conflict units

### A1 — write reservation underestimation
A FIXED_MEASURED writer must not allow a caller override below its verified conservative minimum. Under-minimum, zero, malformed or otherwise unsupported reservation must defer rather than silently clamp/grant.

### A2 — D1 read budget
Every physical reader/writer must have evidence-backed conservative rowsRead reservation semantics. Unknown read cost is not zero. Projected read usage above 5,000,000/day must defer before physical work. Account analytics lag/UNKNOWN must remain conservative.

### A3 — failed/partial writer reconciliation
A granted writer must emit result accounting on success, failure or cancellation/partial completion where the workflow can execute the finalizer. Unknown after-usage must not release the reservation. Retry/cross-day identity must be explicit.

### A4 — ledger idempotency
Duplicate check_id is idempotent only when existing check_id/check_hash/payload/status identity matches the intended receipt. Same ID with different content must fail closed. INSERT OR IGNORE alone is not acceptance.

## Protected boundaries

Forbidden:
- System 1 Formal Core / trading signal / capital allocation / production behavior changes
- System 2 final/live selection authority changes
- Cloudflare billing/paid-plan upgrade
- large physical D1 mutation tests merely to prove this patch

System1 after-market reserve stays evidence-honest:
- observed whole-V7 max 2,825 rowsWritten
- only two healthy dates
- `reserveNumberAuthorized=false`
- `authorizedReserveRows=null`
- 2,825 must not be promoted into a formal reserve.

## Execution order

1. Fix A1 write reservation minimum semantics and adversarial boundary tests.
2. Fix A2 read reservation models, hard-limit projection and unknown/lag handling.
3. Fix A3 final result receipt semantics for success/failure/partial runs and conservative outstanding reservation handling.
4. Fix A4 immutable receipt readback/idempotency conflict detection.
5. Add cross-cutting workflow/registry anti-bypass tests and GraphQL lag handling.
6. Targeted tests -> System2 Research CI -> V8 Regression.
7. latest-main drift check -> merge implementation.
8. merged-main readback.
9. Update Queue/Checkpoint/evidence to `FIX_IMPLEMENTED / PENDING_INDEPENDENT_REVERIFY`.
10. Hand exact evidence to AUDIT_LANE and bounded D1 acceptance scope to DATA_LANE.

## Current proof boundary

No new physical D1 write is required for A1-A4 implementation validation. Unit/integration/workflow-source tests are the primary remediation evidence. Physical account-day closure remains independent AUDIT/DATA evidence after safe repository correction.
