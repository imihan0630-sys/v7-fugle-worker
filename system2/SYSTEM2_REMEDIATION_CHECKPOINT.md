# System 2 Remediation Checkpoint

Updated: 2026-10-09 20:27 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IMPLEMENTED / PENDING_INDEPENDENT_REVERIFY_A7
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — shared Cloudflare-account D1 Free quota coordination.

Severity: HIGH  
Routing: REMEDIATION_LANE  
Implementation state: `FIX_IMPLEMENTED`  
Verification state: `PENDING_INDEPENDENT_REVERIFY_A7`

REMEDIATION_LANE must not mark this directive `VERIFIED_CLOSED`.

## Independent A7 challenge

Independent AUDIT_LANE PR #1000 independently accepted enumerated A5/A6 source-level fail-closed cases and reproduced:

`A7_LEGACY_PAYLOAD_HASH_ACCEPTS_MUTATED_V02_RECEIPT_METADATA`

Canonical audit evidence:
- `system2/evidence/S2_CORR003_A5_A6_INDEPENDENT_REVERIFY_A7_20261009_V0_1.json`
- `system2/tests/audit_corr003_a5a6_independent_legacy_hash_reverify_20261009_v0_1.test.mjs`
- exact-head Research CI `37924636321` PASS
- V8 Regression `37924636337` PASS
- audit performed zero physical Cloudflare IO

## A7 remediation implementation

PR #1008:
- head: `3b974b13721288ebb0f5e9a0c3c551442dd71895`
- merge: `7325d4343aecad1847ef6b176b95167d5d74705a`
- System2 Research CI `37929940237`: PASS
- V8 Regression `37929940232`: PASS
- latest-main drift before merge: 0
- no physical D1 mutation required

Durable implementation evidence:
`system2/evidence/S2_CORR_003_A7_REMEDIATION_IMPLEMENTATION_20261009_V0_1.json`

## A7 — current V0.2+ receipt identity

The production loader no longer accepts a payload-only legacy hash for a current receipt.

V0.2+ reservation/result receipts require the full immutable identity hash over:
- check_id
- check_type
- expected_payload_json
- observed_payload_json
- status

If a V0.2+ row presents the payload-only legacy hash, the ledger becomes INVALID with:
`LEDGER_LEGACY_HASH_CONTRACT_INVALID`.

The evaluator therefore remains:
`QUOTA_BUDGET_DEFER`.

## Proven historical V0.1 compatibility

Original PR #980 physically defined legacy receipts as:
- reservation schema `S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1`
- result schema `S2_D1_ACCOUNT_BUDGET_RESULT_V0_1`
- budget version `S2_D1_ACCOUNT_QUOTA_BUDGET_V0_1`
- check hash = `sha256(observed payload)`

Those historical rows are not rewritten.

Payload-only hash remains valid only when all are true:
1. payload schema is the exact V0.1 schema matching check_type;
2. budgetVersion is exactly `S2_D1_ACCOUNT_QUOTA_BUDGET_V0_1`;
3. expected payload contains exactly:
   - directiveId=`S2-CORR-20261007-003`
   - accountWide=true
   - paidUpgradeAuthorized=false
4. payload `paidUpgradeAuthorized=false`;
5. payload `system1FormalCoreChanged=false`;
6. reservation status exactly `QUOTA_RESERVATION_GRANTED`;
7. result status equals payload.resultState and is one of:
   - `RESULT_RECONCILED_ACCOUNT_DELTA`
   - `RESULT_ACCOUNT_USAGE_UNKNOWN`.

Any schema/budget/status/expected-metadata/paid flag drift invalidates legacy authentication.

## Final A7 regression

Final System2 CI replay of independent attack:

`A7_LEGACY_PAYLOAD_HASH_ACCEPTS_MUTATED_V02_RECEIPT_METADATA`
- status: SAFE
- V0.2 legacy receipt: INVALID
- tampered status: INVALID
- tampered expected payload: INVALID
- synthetic otherwise-authorized decision: `QUOTA_BUDGET_DEFER`
- actual Cloudflare IO: false

Dedicated regression:
`system2/tests/d1_account_quota_a7_legacy_hash_identity_v0_1.test.mjs`

Positive cases:
- authentic V0.2 full-identity receipt = VALID
- authentic V0.1 legacy reservation = VALID
- authentic V0.1 legacy reservation + result pair = VALID

Negative cases:
- V0.2 payload-only legacy hash
- V0.2 legacy status mutation
- V0.2 legacy expected-payload mutation
- V0.2 full-identity row with stale hash after metadata mutation
- V0.1 status drift
- V0.1 expected metadata drift/extra key
- V0.1 budget/schema drift
- V0.1 paid flag drift
- V0.1 result status mismatch

## A1-A6 preservation

The same final System2 Research CI includes prior CORR-003 suites.

Independent replay log still reports:
- A5 malformed GraphQL = PASS_FAIL_CLOSED
- A6 malformed ledger = PASS_FAIL_CLOSED
- production full-identity tamper = PASS_FAIL_CLOSED
- A7 legacy metadata spoof = SAFE

A1-A4 tests remain in the full research suite.

## System1 reserve remains fail closed

Write:
- observed whole-V7 max rowsWritten = 2,825
- `reserveNumberAuthorized=false`
- `authorizedReserveRows=null`

Read:
- `readReserveNumberAuthorized=false`
- `authorizedReadReserveRows=null`

2,825 remains observational only.

## Protected boundaries

No change to:
- System 1 Formal Core
- formal trading signals
- capital allocation
- System1 production business logic
- System2 final/live selection authority
- Cloudflare billing / paid tier

No large D1 physical mutation was used for A7.

## DATA_LANE continuation

A7 source integrity is now implemented, but physical D1 mutation remains subject to all existing account-level quota prerequisites.

DATA_LANE may continue quota-safe read-only evidence, census and offline planning.

Do not force physical writes while any of these remain unresolved:
- account usage UNKNOWN
- writer read/write cost evidence incomplete
- System1 write reserve unauthorized
- System1 read reserve unauthorized
- quota ledger integrity INVALID
- shared gate returns `QUOTA_BUDGET_DEFER`

## AUDIT_LANE exact reverify

Independently re-run from latest main:

1. V0.2 receipt with payload-only hash -> INVALID.
2. V0.2 status mutation with unchanged payload-only hash -> INVALID.
3. V0.2 expected_payload_json mutation with unchanged payload-only hash -> INVALID.
4. Authentic V0.2 full-identity receipt -> VALID.
5. Authentic historical V0.1 payload-hash reservation -> VALID.
6. Authentic historical V0.1 reservation/result pair -> VALID.
7. V0.1 metadata/schema/budget/status mutation -> INVALID.
8. Invalid A7 ledger cannot grant physical quota.
9. Re-run A1-A6 source-level regressions.
10. Confirm System1 write/read reserves remain false/null.
11. Confirm no Formal Core / production / billing mutation.

Even if A7 passes, final HIGH closure still separately requires:
- evidence-qualified System1 write/read reserve;
- bounded real multiwriter UTC-day physical grant/result/no-collision;
- later real System1 23:35/23:55 normal persistence;
- original CORR-003 physical acceptance criteria.

## Exact next continuation point

- REMEDIATION_LANE: A7 implementation complete; remain idle unless independent reverify returns an exact failed conflict unit.
- AUDIT_LANE: independently reverify A7 and prior source-level safeguards.
- DATA_LANE: continue quota-safe read-only/evidence-qualified work; physical mutation remains gate-controlled.
