# System 2 Remediation Checkpoint

Updated: 2026-10-09 20:24 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IN_PROGRESS / A7_LEGACY_HASH_IDENTITY_REMEDIATION
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — shared Cloudflare-account D1 Free quota coordination.

Severity: HIGH  
Routing: REMEDIATION_LANE  
Queue status: `FIX_IN_PROGRESS`  
Modification owner for A7: `SYSTEM2_REMEDIATION_ROOM`

REMEDIATION_LANE may return this HIGH correction only to `FIX_IMPLEMENTED`; it must not self-mark `VERIFIED_CLOSED`.

## Independent A7 challenge

Independent AUDIT_LANE PR #1000 / evidence on main routed one new source-level defect back to REMEDIATION:

`A7_LEGACY_PAYLOAD_HASH_ACCEPTS_MUTATED_V02_RECEIPT_METADATA`

Canonical evidence:
- `system2/evidence/S2_CORR003_A5_A6_INDEPENDENT_REVERIFY_A7_20261009_V0_1.json`
- `system2/tests/audit_corr003_a5a6_independent_legacy_hash_reverify_20261009_v0_1.test.mjs`
- exact-head Research CI `37924636321` PASS
- V8 Regression `37924636337` PASS
- A5/A6 independently PASS at enumerated source level
- A7 independently UNSAFE
- physical Cloudflare IO by audit: zero

## A7 exact failure

Current production `loadQuotaLedger` accepts either:
1. current full immutable identity hash, or
2. legacy `sha256(observed payload)`.

The legacy branch is not currently restricted to actual historical V0.1 receipts.

Therefore a payload declaring current:
`S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_2`

can retain the same payload-only hash while mutating:
- `status`, or
- `expected_payload_json`

and still reach `integrityState=VALID`.

Under synthetic otherwise-authorized reserves this can lead to `QUOTA_RESERVATION_GRANTED`.

## Required remediation

1. V0.2+ reservation/result receipts must require the full immutable identity hash:
   - check_id
   - check_type
   - expected_payload_json
   - observed_payload_json
   - status
2. Legacy payload-only hash may be accepted only for explicitly proven historical V0.1 receipt schema.
3. Legacy V0.1 acceptance must additionally require:
   - `budgetVersion=S2_D1_ACCOUNT_QUOTA_BUDGET_V0_1`
   - frozen expected metadata: directiveId/accountWide/paidUpgradeAuthorized
   - exact V0.1 schema for check type
   - reservation status exactly `QUOTA_RESERVATION_GRANTED`
   - result status exactly equals payload.resultState and is one of original V0.1 result states
   - no extra expected-metadata keys
4. Do not rewrite historical V0.1 receipts.
5. Any V0.2+ row using payload-only hash must return ledger integrity INVALID and cause `QUOTA_BUDGET_DEFER`.
6. Preserve A1-A6, same-day non-release, UTC rollover, System1 reserve false/null and no paid-tier behavior.

## Protected boundaries

No modification to:
- System1 Formal Core
- trading signals
- capital allocation
- System1 production business logic
- System2 final/live selection authority
- Cloudflare billing / paid tier

No large physical D1 mutation is required for A7 source-level remediation.

## Exact next

- Patch only the legacy-hash compatibility path and tests/docs.
- Run A7 exact attack replay plus positive authentic V0.1 legacy and V0.2 full-identity cases.
- Re-run A1-A6.
- System2 Research CI + V8 Regression.
- latest-main drift check.
- merge implementation.
- merged-main readback.
- evidence-only Queue/checkpoint update to `FIX_IMPLEMENTED / PENDING_INDEPENDENT_REVERIFY_A7`.
- return to AUDIT_LANE for independent reverify; physical closure remains separate.
