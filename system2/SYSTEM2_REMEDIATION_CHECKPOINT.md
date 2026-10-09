# System 2 Remediation Checkpoint

Updated: 2026-10-09 18:23 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IN_PROGRESS / A5_A6_FAIL_CLOSED_REMEDIATION
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — shared Cloudflare-account D1 Free quota coordination.

Severity: HIGH  
Routing: REMEDIATION_LANE  
Queue status: `FIX_IN_PROGRESS`  
Modification owner for A5/A6: `SYSTEM2_REMEDIATION_ROOM`

REMEDIATION_LANE must return this HIGH correction only to `FIX_IMPLEMENTED`; it must not self-mark `VERIFIED_CLOSED`.

## Independent A5/A6 challenge

Independent AUDIT_LANE reverify PR #989 / main merge `ff5a59e6e1cb4aec34bcac89884b58fba3bf85cd` independently passed the enumerated A1-A4 source cases and reproduced two new fail-open defects:

### A5 — GraphQL partial sum coerced to known zero

Conflict unit:
`system2/scripts/run_d1_account_quota_gate_v0_1.mjs`

Observed:
- synthetic HTTP 200 GraphQL account group had `sum.rowsWritten=2000` but missing `sum.rowsRead`;
- current parser used numeric fallback and returned `known=true / rowsRead=0`;
- under synthetic otherwise-authorized reserves, P0 Daily Shadow could receive `QUOTA_RESERVATION_GRANTED`.

Required:
- each returned D1 analytics group must have complete, finite, nonnegative integer `rowsRead` and `rowsWritten`;
- date/database identity must be complete and unambiguous;
- missing/null/string/negative/fractional/non-finite/duplicate-identity/partial groups must make account usage UNKNOWN;
- UNKNOWN account usage must remain `QUOTA_BUDGET_DEFER`;
- do not invent vendor freshness or a hidden safety percentage.

### A6 — malformed same-day ledger row silently disappeared

Conflict unit:
`system2/runtime/d1_account_quota_budget_v0_1.mjs`

Observed:
- same-day reservation row with malformed `observed_payload_json` was caught then silently skipped;
- outstanding rowsWritten/rowsRead became zero;
- synthetic otherwise-authorized P0 evaluation could then grant.

Required:
- malformed/incomplete/invalid same-day reservation/result rows must create explicit ledger-integrity UNKNOWN/BLOCKED semantics;
- unknown reservation cost must never be coerced to zero;
- production load must validate receipt identity, allowed version/type, UTC quota-day association and receipt hash/readback integrity before budget calculation;
- duplicate or structurally ambiguous reservation/result identities must fail closed;
- same-day integrity failure must not manufacture headroom.

Canonical independent evidence:
- `system2/evidence/S2_CORR003_INDEPENDENT_POST_FIX_REVERIFY_20261009_V0_1.json`
- `system2/tests/audit_corr003_post_fix_independent_reverify_20261009_v0_1.test.mjs`
- System2 Research CI `37915666601` PASS / 273 test files
- V8 Regression `37915666467` PASS
- physical Cloudflare IO by audit: zero

## A1-A4 status

A1-A4 source-level enumerated cases remain PASS after PR #985:
- A1 verified write floor
- A2 read-cost contract/hard cap
- A3 failure/partial result finalizer + same-day non-release
- A4 duplicate exact-identity conflict

A5/A6 remediation must not weaken A1-A4.

## System1 protected reserve remains UNKNOWN

Write:
- observed whole-V7 max rowsWritten = 2,825
- healthy dates = 2
- `reserveNumberAuthorized=false`
- `authorizedReserveRows=null`

Read:
- `readReserveNumberAuthorized=false`
- `authorizedReadReserveRows=null`

Do not promote 2,825 or fabricate a read reserve.

## Protected boundaries

Do not modify:
- System 1 Formal Core
- formal trading signals
- capital allocation
- System1 production business behavior
- System2 final/live selection authority
- Cloudflare billing / paid tier

Do not run large physical D1 mutation tests merely to prove A5/A6.

## Execution order

1. Harden GraphQL parser for complete identity + strict rowsRead/rowsWritten metrics.
2. Harden same-day ledger summarizer to surface explicit integrity failure rather than skip/coerce.
3. Add production ledger identity/version/hash validation before summary.
4. Add A5 adversarial matrix: missing/null/string/negative/fractional/non-finite metric, missing date/databaseId, duplicate identity, valid multi-db aggregate.
5. Add A6 adversarial matrix: malformed JSON, missing runKey/quotaDay/cost, wrong schema/type/day identity, duplicate runKey ambiguity, malformed result, invalid hash/readback.
6. Re-run prior A1-A4 tests to prove no regression.
7. Targeted tests -> System2 Research CI -> V8 Regression.
8. latest-main drift check -> merge implementation -> merged-main readback.
9. Evidence-only Queue/checkpoint update to `FIX_IMPLEMENTED / PENDING_INDEPENDENT_REVERIFY_A5_A6`.
10. Hand back to AUDIT_LANE; DATA_LANE remains read-only/evidence-qualified until all physical prerequisites are proven.

## Physical proof boundary

A5/A6 are source/integrity fail-closed defects and can be fixed/tested offline without consuming D1 quota.

Physical closure of CORR-003 still separately requires:
- evidence-qualified System1 write/read reserves;
- bounded real multiwriter UTC-day grant/result/no-collision evidence;
- later real System1 23:35/23:55 normal business persistence;
- original physical acceptance criteria;
- independent AUDIT_LANE closure.
