# System 2 Remediation Checkpoint

Updated: 2026-10-09 18:39 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IMPLEMENTED / PENDING_INDEPENDENT_REVERIFY_A5_A6
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — shared Cloudflare-account D1 Free quota coordination.

Severity: HIGH  
Routing: REMEDIATION_LANE  
Implementation state: `FIX_IMPLEMENTED`  
Verification state: `PENDING_INDEPENDENT_REVERIFY_A5_A6`

REMEDIATION_LANE must not mark this directive `VERIFIED_CLOSED`.

## A5/A6 independent challenge

Independent AUDIT_LANE PR #989 / merge `ff5a59e6e1cb4aec34bcac89884b58fba3bf85cd` independently passed the enumerated A1-A4 source-level cases but reproduced:

- A5 `GQL_PARTIAL_ROWS_READ_TREATED_AS_ZERO`
- A6 `MALFORMED_RESERVATION_LEDGER_ROW_SILENT_SKIP`

Canonical independent evidence:
- `system2/evidence/S2_CORR003_INDEPENDENT_POST_FIX_REVERIFY_20261009_V0_1.json`
- `system2/tests/audit_corr003_post_fix_independent_reverify_20261009_v0_1.test.mjs`

## A5/A6 remediation implementation

PR #994:
- implementation head: `c24c9a9cfb26c2854f665beb68f8a4068fd431be`
- squash merge: `0c74919d4746f27f14aec44d1841c01a4f32f12b`
- final System2 Research CI: `37918280572` PASS
- final V8 Regression: `37918280554` PASS
- no large physical D1 write test
- changed files: 5 System2 quota/doc/test files only

Durable remediation evidence:
`system2/evidence/S2_CORR_003_A5_A6_REMEDIATION_IMPLEMENTATION_20261009_V0_1.json`

## A5 — GraphQL partial metrics fail closed

The production account parser no longer converts missing fields into zero.

Every GraphQL D1 analytics group now requires:
- exact requested quota-day identity
- non-empty databaseId
- finite safe nonnegative integer rowsWritten
- finite safe nonnegative integer rowsRead
- unique date+databaseId identity

Fail closed cases include:
- missing rowsRead/rowsWritten
- null
- string metric
- negative/fractional/non-finite values
- missing/wrong date
- missing/blank databaseId
- duplicate identity
- empty groups
- missing/zero/multiple account results
- aggregate safe-integer overflow

Failure returns:
- `known=false`
- rowsWritten=null
- rowsRead=null

The evaluator therefore returns:
`QUOTA_BUDGET_DEFER / ACCOUNT_WIDE_D1_USAGE_UNKNOWN`.

Final CI replay of the independent probe:

`GQL_PARTIAL_ROWS_READ_TREATED_AS_ZERO`
- state: SAFE
- parserKnown: false
- parserRowsRead: null
- synthetic otherwise-authorized decision: `QUOTA_BUDGET_DEFER`
- Cloudflare IO: none

GraphQL freshness remains `NOT_DOCUMENTED_BY_VENDOR`; no freshness seconds, safety percentage or hidden headroom was invented.

## A6 — malformed ledger cannot disappear

The runtime ledger summarizer now returns:
- `integrityState=VALID`, or
- `integrityState=INVALID`.

Malformed/incomplete/ambiguous current-day ledger content is not skipped.

Integrity-invalid safety sentinel:
- outstandingReservedRowsWritten = 100,000
- outstandingReservedRowsRead = 5,000,000

This is a blocking sentinel, not a claim of actual consumption.

The quota evaluator also receives `ledgerIntegrityState`. Non-VALID returns:
`QUOTA_BUDGET_DEFER / D1_QUOTA_LEDGER_INTEGRITY_INVALID`.

Fail-closed cases include:
- malformed JSON
- missing runKey/quotaDay
- invalid reservation costs
- unknown check type
- duplicate reservation/result run keys
- orphan result
- malformed result metrics
- missing check identity/hash/status/expected payload in production mode
- unsupported schema/directive/budget identity
- bad check ID
- invalid timestamp
- wrong production quota-day identity

### Production receipt validation

Production loader reads:
- check_id
- check_type
- expected_payload_json
- observed_payload_json
- status
- check_hash
- check_timestamp

Before budgeting it validates:
1. structural receipt identity with `requireReceiptIdentity=true`;
2. check ID = quotaDay + runKey + receipt type;
3. selected row timestamp belongs to queried UTC-day window;
4. stored hash matches either current full immutable identity hash or bounded legacy payload hash.

Tampered hash:
`LEDGER_CHECK_HASH_MISMATCH`.

Final CI replay of the independent probe:

`MALFORMED_RESERVATION_LEDGER_ROW_SILENT_SKIP`
- state: SAFE
- conservativeReservedRowsWritten: 100000
- conservativeReservedRowsRead: 5000000
- synthetic otherwise-authorized decision: `QUOTA_BUDGET_DEFER`
- Cloudflare IO: none

## UTC rollover compatibility

A legitimate prior-UTC-day reservation can still be excluded by generic/offline summarization.

Production current-day ledger loading remains strict because its D1 SELECT is already bounded to the current UTC-day window. A current-day physical row whose receipt identity points to the wrong reservation day is invalid.

This preserves A3 retry/rollover semantics without weakening A6.

## A1-A4 regression state

Final CI log also confirms:
- `sourceLevelA1A4=PASS_FOR_ENUMERATED_CASES`
- 13 physical writers remain registered/gated
- prior A1-A4 regression suites remain green

No A1-A4 protection was removed.

## System1 reserve remains fail closed

Write:
- observed whole-V7 max rowsWritten = 2,825
- healthy dates = 2
- `reserveNumberAuthorized=false`
- `authorizedReserveRows=null`

Read:
- `readReserveNumberAuthorized=false`
- `authorizedReadReserveRows=null`

Do not promote 2,825 or fabricate a read reserve.

## Concurrent DATA_LANE work

PR #996 only changed:
- `system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md`
- `system2/evidence/S2_OCT09_ACCOUNT_D1_GRAPHQL_READONLY_PHYSICAL_USAGE_ACCEPTANCE_20261009_V0_1.json`

It did not modify A5/A6 runtime/script/test conflict units.

## Protected boundaries

No change to:
- System 1 Formal Core
- formal trading signals
- capital allocation
- System1 production business behavior
- System2 final/live selection authority
- Cloudflare billing / paid tier

No large D1 mutation test was performed to prove A5/A6.

## DATA_LANE continuation

DATA_LANE may continue:
- read-only account/D1 evidence when rowsRead headroom is proven;
- Oct08 36-key / 11,843-key read-only census under strict read guards;
- offline missing-key repair planning;
- conflict quarantine;
- PIT / immutability validation.

Physical D1 mutation remains blocked unless all are true:
1. registered physical writer
2. evidence-qualified write cost
3. evidence-qualified read cost
4. known conservative account usage
5. evidence-authorized System1 write reserve
6. evidence-authorized System1 read reserve
7. `ledgerIntegrityState=VALID`
8. shared gate returns `QUOTA_RESERVATION_GRANTED`

Do not bypass:
- `ACCOUNT_WIDE_D1_USAGE_UNKNOWN`
- `READ_COST_EVIDENCE_REQUIRED`
- `D1_QUOTA_LEDGER_INTEGRITY_INVALID`
- `QUOTA_BUDGET_DEFER`

## AUDIT_LANE exact reverify

Independently re-run from latest main:

1. A5 missing rowsRead / rowsWritten.
2. A5 null/string/negative/fractional/non-finite metric cases.
3. A5 missing/wrong date, missing databaseId, duplicate identity and account-cardinality cases.
4. Verify all A5 failures return known=false and cannot grant physical mutation.
5. A6 malformed JSON and missing reservation identity/cost.
6. A6 duplicate runKey, orphan/malformed result.
7. A6 production check ID/schema/timestamp/hash tamper cases.
8. Verify malformed A6 state cannot yield outstanding 0 or grant.
9. Verify legitimate UTC rollover remains supported.
10. Re-run A1-A4 enumerated boundaries.
11. Confirm System1 write/read reserve remains false/null.
12. Confirm no Formal Core / production / billing change.

Even if A5/A6 source reverify passes, final HIGH closure still requires:
- evidence-qualified System1 write/read reserve;
- bounded real multiwriter UTC-day physical grant/result/no-collision;
- later real System1 23:35/23:55 normal persistence;
- original CORR-003 physical acceptance criteria.

## Exact next continuation point

- REMEDIATION_LANE: A5/A6 implementation complete; remain idle unless independent reverify returns an exact failed conflict unit.
- AUDIT_LANE: independently reverify A5/A6 and prior A1-A4 from latest main.
- DATA_LANE: continue only read-only/evidence-qualified quota work; do not force physical writes.
