# System 2 Remediation Checkpoint

Updated: 2026-10-09 16:30 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IMPLEMENTED / PENDING_INDEPENDENT_REVERIFY
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — shared Cloudflare-account D1 Free quota coordination.

Severity: HIGH  
Routing: REMEDIATION_LANE  
Implementation state: `FIX_IMPLEMENTED`  
Verification state: `PENDING_INDEPENDENT_REVERIFY_AFTER_A1_A4`

REMEDIATION_LANE must not mark this directive `VERIFIED_CLOSED`.

## Independent challenge that reopened the fix

PR #983 / #984 independently reproduced 4/4 closure blockers:
- A1 measured write reservation could be undercut;
- A2 physical read cost could be treated as zero near 5M/day;
- A3 failed/partial writers skipped result receipts;
- A4 duplicate ledger receipt identity was not proven.

Canonical audit evidence remains immutable:
- `system2/evidence/S2_CORR_003_INDEPENDENT_ADVERSARIAL_CI_ACCEPTANCE_20261009_V0_1.json`
- `system2/tests/d1_account_quota_adversarial_independent_audit_20261009.test.mjs`

## Remediation implementation

PR #985:
- head: `0aa9311720dbe50b9e8482855cfe43c901ee8a03`
- merge: `a5977af950ed7902a4ac4d965edc18dd62ca30d2`
- System2 Research CI `37905200346`: PASS
- V8 Regression `37905200365`: PASS
- latest-main drift before merge: 0

Durable implementation evidence:
`system2/evidence/S2_CORR_003_A1_A4_REMEDIATION_IMPLEMENTATION_20261009_V0_1.json`

## A1 — write reservation floor

`FIXED_MEASURED` is now a minimum, not a replaceable default.

Annual measured floor:
- 7,358 rowsWritten

Regression:
- 0 / 1 / 7,357 -> `QUOTA_BUDGET_DEFER`
- 7,358 / higher -> may proceed only if every other reservation prerequisite is evidence-qualified

`CALLER_REQUIRED` values without registry evidence/minimum do not establish safe cost.

## A2 — read budget

Registry version:
`S2_D1_ACCOUNT_WRITER_REGISTRY_V0_2`

All 16 shared writer workflows declare read reservation semantics.

Measured physical read floors:
- Daily Shadow: 583,256 rowsRead — run 37609474459
- Recent A1: 1,047,112 rowsRead — run 37550201160 / job 112563652301

Other physical writers:
`READ_COST_EVIDENCE_REQUIRED`

Unknown read cost is never zero.

Account read projection includes:
- current account GraphQL lower-bound observation
- outstanding same-day System2 read reservations
- System1 read reserve
- protected P0 Daily Shadow read reserve for lower-priority work
- current writer reservation

Above 5,000,000 rowsRead/day -> fail before mutation.

### GraphQL freshness

Cloudflare documents D1 rowsRead/rowsWritten GraphQL metrics but no project-usable guaranteed realtime freshness bound was found.

Policy:
- GraphQL = lower-bound observation
- do not invent lag seconds or hidden safety percentage
- retain max prior observed ledger usage
- never release same-day reservation before UTC reset

## A3 — result evidence on failure/partial execution

13/13 physical writer workflows now use:
`always() && steps.quota.outputs.physical_allowed == 'true'`

All bind:
`execution_outcome: ${{ job.status }}`

Result receipt records success/failure/partial/unknown/cross-day states when finalizer executes.

Reservation policy:
`NEVER_RELEASE_BEFORE_UTC_RESET`

Tests cover:
- failed/partial result
- unknown after-usage
- reservation overrun
- retry
- UTC-day rollover

## A4 — immutable duplicate receipt identity

Before/after persistence, exact `check_id` is read back.

Idempotent only when all match:
- check_id
- check_type
- expected_payload_json
- observed_payload_json
- status
- check_hash

Conflict:
`D1_QUOTA_LEDGER_IDEMPOTENCY_CONFLICT`

Missing exact readback:
`D1_QUOTA_LEDGER_RECEIPT_READBACK_MISSING`

## System1 protected reserve remains fail-closed

Write reserve:
- healthy dates = 2
- observed max = 2,825
- `reserveNumberAuthorized=false`
- `authorizedReserveRows=null`

Read reserve:
- `readReserveNumberAuthorized=false`
- `authorizedReadReserveRows=null`

2,825 is not promoted to a formal reserve. No read value is fabricated.

## Protected boundaries

No change to:
- System 1 Formal Core
- formal trading signals
- capital allocation
- production business behavior
- System 2 final/live selection authority
- Cloudflare billing or paid tier

No large D1 physical mutation was run merely to validate A1-A4.

## DATA_LANE continuation

Historical data room may continue:
- quota-budgeted read-only D1 evidence;
- 36-key / 11,843-key Oct08 read-only census when account rowsRead headroom is proven;
- offline missing-key/conflict/PIT planning.

Physical write remains blocked unless **all** are true:
1. registered physical writer;
2. evidence-qualified write floor;
3. evidence-qualified read floor;
4. known conservative account usage;
5. evidence-authorized System1 write reserve;
6. evidence-authorized System1 read reserve;
7. shared quota gate grants `QUOTA_RESERVATION_GRANTED`.

Do not bypass `READ_COST_EVIDENCE_REQUIRED` or `QUOTA_BUDGET_DEFER`.

## AUDIT_LANE exact reverify

Independently re-run:
1. A1 1-row annual override and exact write-floor boundary.
2. A2 4,999,999 rowsRead scenario, measured Daily Shadow boundary and unknown-read writer.
3. A3 all 13 failure finalizers, partial/unknown/non-release/retry/cross-day behavior.
4. A4 exact duplicate vs altered payload/hash/status/type.
5. GraphQL lower-bound/lag mitigation.
6. System1 write/read reserves remain unauthorized/null.
7. no System1 Formal Core/production/billing mutation.

Even if source reverify passes, final HIGH closure still requires the previously frozen physical multiwriter/System1 after-market acceptance evidence.

## Exact next continuation point

- REMEDIATION_LANE: implementation complete; remain idle unless independent reverify returns a specific failed conflict unit.
- AUDIT_LANE: independently reverify A1-A4 from latest main.
- DATA_LANE: proceed only with read-only/evidence-qualified quota work; do not force physical writes without proven read/write/account/System1 reserves.
