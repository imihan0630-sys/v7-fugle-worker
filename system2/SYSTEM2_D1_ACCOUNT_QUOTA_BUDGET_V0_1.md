# System 2 D1 Account Quota Budget V0.1

Updated: 2026-10-09 Asia/Taipei
Directive: `S2-CORR-20261007-003`
State: REPOSITORY_IMPLEMENTATION / PHYSICAL_MULTI_WRITER_ACCEPTANCE_PENDING

## Scope

This contract coordinates Cloudflare D1 Free daily quota across the **same Cloudflare account**, including both:
- isolated System 2 `SYSTEM2_DB`;
- System 1 `V7_DB`.

Separate database IDs do not create separate Free daily quota.

Official contract frozen by canonical evidence:
- rowsWritten: 100,000 / UTC day / account;
- rowsRead: 5,000,000 / UTC day / account;
- reset: 00:00 UTC (08:00 Asia/Taipei);
- indexed writes count toward rowsWritten;
- queries may be rejected after the account daily limit is exhausted;
- no paid-plan upgrade is authorized.

Vendor evidence:
`system2/evidence/S2_CORR_20261007_003_CLOUDFLARE_FREE_TIER_CONTRACT_20261007_V0_1.json`.

## Shared writer registry

Canonical registry:
`system2/config/d1_account_writer_registry_v0_1.json`.

Every workflow sharing `system2-isolated-d1-writer` must be registered, including read-only workflows.

Physical writers declare:
- writer ID;
- priority P0/P1/P2/P3;
- writer class;
- whether push may physically mutate D1;
- reservation model.

Unregistered physical writer = fail closed.

Priority semantics:
- P0: protected operational / launch evidence;
- P1: necessary controlled bulk data;
- P2: discretionary warmup/bootstrap;
- P3: maintenance/smoke/schema/deploy;
- READ_ONLY: no D1 mutation authority.

Concurrency remains required but is not a quota budget.

## Account usage

Before physical mutation, the gate reads Cloudflare account-wide D1 usage from GraphQL `d1AnalyticsAdaptiveGroups`.

The gate uses:
- current UTC quota day;
- account rowsWritten;
- account rowsRead;
- durable System2 reservation/result receipts.

If exact account-wide usage cannot be proven:
`QUOTA_BUDGET_DEFER`.

No synthetic remaining-quota number is permitted.

## System 1 after-market reserve

System1 23:35 / 23:55 after-market production persistence must be protected before lower-priority System2 writers.

Current canonical reserve evidence:
`system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json`.

Current state:
- two healthy after-market dates observed;
- whole-V7_DB daily max observed = 2,825 rowsWritten;
- evidence explicitly says `reserveNumberAuthorized=false`;
- `authorizedReserveRows=null`.

Therefore **2,825 is not used as a reserve**.

Until independent evidence authorizes a reserve number:
- System2 physical mutation returns `QUOTA_BUDGET_DEFER`;
- the gate does not invent a reserve;
- no billing/plan change is attempted.

A future authorized reserve evidence file may be supplied to the same gate without changing writer semantics.

## P0 reserve

Measured scheduled Daily Shadow cost:
- 13,130 rowsWritten on run 37609474459.

For P1/P2/P3 work the evaluator protects this P0 reserve unless the writer itself is P0.

Future controlled launch acceptance may supply an evidence-backed launch reserve through the same gate. Default zero means no launch acceptance is declared for that run; it is not permission to bypass a planned launch reserve.

## Recent A1 warmup

Measured physical calibration:
- 9,640 logical bars;
- 57,880 D1 rowsWritten;
- approximately 6.00x index/write amplification;
- approximately 11,576 rowsWritten per planned market date.

Rules:
- ordinary push = tests/planning only, never physical D1 history mutation;
- schedule/manual must pass account quota reservation;
- physical max dates = min(5, floor(available protected write headroom / 11,576));
- if fewer than one date fits => `QUOTA_BUDGET_DEFER`.

No arbitrary utilization percentage threshold exists.

## P2/P3 push protection

P2/P3 registry entries have `pushPhysicalAllowed=false`.

On ordinary push the gate returns:
`PUSH_READ_ONLY_ONLY`.

The non-mutating path performs no Cloudflare D1 call.

Examples covered:
- Recent A1 warmup;
- bounded hot-history bootstrap;
- real-source physical smoke;
- historical D1 physical smoke;
- resonance deploy D1 schema mutation.

For resonance deploy specifically:
- Worker/UI deployment may continue;
- push schema check is read-only;
- if schema is not ready and no quota reservation exists, `ensure_system2_d1_ready.mjs` fails with `D1_SCHEMA_MUTATION_REQUIRES_QUOTA_RESERVATION`;
- manual schema mutation requires a granted quota reservation.

## Reservation ledger

No new D1 table is introduced.

Existing `s2_infrastructure_checks` stores compact:
- `SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1`;
- `SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1`.

Reservation/result identity is tied to:
- UTC quota day;
- GitHub run/attempt;
- registered writer ID.

A reservation records:
- account usage before;
- writer priority/class;
- requested rowsWritten/rowsRead;
- System1 reserve;
- P0 reserve;
- outstanding System2 reservations;
- projected account totals;
- no-paid-upgrade flag.

Result reconciliation records:
- account rowsWritten/read after;
- account delta upper bound;
- link to reservation receipt.

### Ledger write overhead

`s2_infrastructure_checks` has:
- table row;
- PRIMARY KEY;
- UNIQUE `check_hash`;
- secondary `check_timestamp, check_type` index.

One inserted receipt can therefore touch four write structures.
Reservation + result reserve eight rowsWritten in the quota model.

## Historical/manual workflows

Where physical write cost is not sufficiently measured, registry model is `CALLER_REQUIRED`.

Manual execution must provide a conservative evidence-backed rowsWritten reservation. Missing/zero estimate:
`QUOTA_BUDGET_DEFER`.

This is deliberate. Unknown cost is not converted to a guessed safe number.

Annual history has a measured default reservation from accepted samples; caller may override with stronger evidence for a larger/special run.

## Operational states

- `QUOTA_RESERVATION_GRANTED`
- `QUOTA_BUDGET_DEFER`
- `PUSH_READ_ONLY_ONLY`
- `READ_ONLY_ALLOWED`

Quota deferral is infrastructure/cost governance, not a source-quality failure.

## Protected boundaries

This implementation does not change:
- System 1 Formal Core;
- System 1 23:35 / 23:55 formal business logic;
- System 2 strategy/ranking/final-selection semantics;
- PIT/UNKNOWN/history immutability;
- live push/capital/order authority;
- Cloudflare billing/plan.

No automatic paid-tier upgrade code exists.

## Acceptance still required

Repository implementation/CI is not physical closure.

DATA_LANE next physical acceptance must use this gate for the 2026-10-08 historical acceptance continuation and retain:
- gate reservation/defer artifact;
- account D1 analytics before/after;
- writer receipt;
- no quota hard-rejection;
- historical PIT/immutability evidence.

Independent AUDIT_LANE closure additionally requires a bounded future multi-writer UTC day or equivalent physical evidence, and a real later trading-day System1 after-market receipt showing normal persistence with no quota rejection.


## V0.2 adversarial hardening — PR #983/#984 follow-up

Independent adversarial CI reproduced four closure blockers after the original V0.1 implementation. V0.2 closes those source-level bypasses while preserving the original account-wide/free-tier design.

### A1 — measured write cost is a hard lower bound

For `FIXED_MEASURED` writers:
- the registry measurement is the minimum permitted rowsWritten reservation;
- a caller may supply a larger conservative reservation;
- a caller may not lower the verified minimum;
- 0, 1, or any value below the verified minimum returns `QUOTA_BUDGET_DEFER` with `WRITER_WRITE_RESERVATION_BELOW_VERIFIED_MINIMUM`.

Example:
- annual history verified write floor = 7,358 rowsWritten;
- manual `quota_reservation_rows=1` cannot replace 7,358.

For `CALLER_REQUIRED` writers, a numeric caller input is not proof by itself. The registry must contain an evidence-backed minimum and evidence reference before caller values can grant physical mutation. Missing evidence remains fail closed.

### A2 — read-cost reservation is mandatory

Every registered writer declares `readReservationModel`.

Known physical measurements:
- Daily Shadow Diagnostic: 583,256 rowsRead from run 37609474459;
- Recent A1 Hot History Warmup: 1,047,112 rowsRead from run 37550201160 / job 112563652301.

Unknown writer read cost:
- state = `READ_COST_EVIDENCE_REQUIRED`;
- caller value 0 is not interpreted as zero cost;
- caller value alone cannot create evidence;
- physical mutation remains `QUOTA_BUDGET_DEFER` until a verified read-cost floor is registered.

The account projection includes:
- current account rowsRead lower-bound observation;
- all same-UTC-day outstanding System2 read reservations;
- evidence-authorized System1 read reserve;
- protected Daily Shadow read reserve for lower-priority writers;
- writer requested/verified read reservation.

Projected rowsRead above 5,000,000/day returns `ROWS_READ_DAILY_BUDGET_EXCEEDED` before physical mutation.

### System1 read reserve remains UNKNOWN

The System1 after-market evidence file now distinguishes write and read reserve evidence.

Current state remains:
- write reserve not authorized;
- read reserve not authorized;
- observed 2,825 rowsWritten is not promoted into a write reserve;
- no System1 rowsRead value is fabricated.

Either missing reserve keeps System2 physical mutation fail conservative.

### GraphQL analytics lag / freshness policy

Cloudflare documents D1 rowsRead/rowsWritten metrics via GraphQL Analytics but does not provide this contract with a guaranteed real-time freshness bound.

Therefore V0.2 treats GraphQL daily totals as:
`ACCOUNT_DAILY_AGGREGATE_LOWER_BOUND`

Mitigation:
- same-UTC-day reservations are never released early;
- result receipts do not release reservations even after success;
- the gate takes max(current GraphQL value, prior max observed result-receipt value);
- UNKNOWN account usage remains `QUOTA_BUDGET_DEFER`;
- actual observed cost above reservation is recorded as `RESULT_RESERVATION_OVERRUN_NON_RELEASING`.

This favors temporary over-reservation over false headroom.

### A3 — success/failure/partial result accounting

Every physical writer result finalizer uses:
`always() && steps.quota.outputs.physical_allowed == 'true'`

Every result action receives:
`execution_outcome: ${{ job.status }}`

A result receipt is attempted for:
- success;
- failure after partial mutation;
- other terminal job states where GitHub executes the finalizer.

Result receipts preserve:
- original reservation identity;
- execution outcome;
- before/after account lower-bound observations when available;
- read/write upper-bound deltas;
- overrun state;
- cross-UTC-day state.

If after-usage is unknown, the result is explicitly `USAGE_UNKNOWN_NON_RELEASING`.

Same-day reservations are never released before 00:00 UTC. Retry attempts therefore reserve independently and cannot reclaim uncertain prior consumption. UTC-day rollover naturally ends the prior day accounting window.

### A4 — immutable ledger duplicate semantics

`INSERT OR IGNORE` is no longer accepted as proof by itself.

Before/after ledger persistence, the gate reads the exact `check_id` and verifies:
- check_id;
- check_type;
- expected_payload_json;
- observed_payload_json;
- status;
- check_hash.

Exact identity:
`SKIPPED_IDENTICAL_EXISTING_RECEIPT`

Same ID with changed hash/payload/status/type:
`D1_QUOTA_LEDGER_IDEMPOTENCY_CONFLICT`

An ignored insert without exact readback is a hard error:
`D1_QUOTA_LEDGER_RECEIPT_READBACK_MISSING`

The V0.2 receipt hash commits to check ID, check type, expected payload, observed payload and status.

## V0.2 physical-proof boundary

A1–A4 can be proven through deterministic source/unit/workflow tests without intentionally consuming large D1 quota.

Repository-level remediation does not itself certify:
- evidence-qualified System1 write/read reserves;
- a bounded real multiwriter account-day;
- later successful real System1 23:35/23:55 persistence;
- DATA_LANE 2026-10-08 write promotion.

Those remain independent physical acceptance items. A HIGH correction remains non-closable by REMEDIATION_LANE.


## A5/A6 independent fail-open hardening

Independent AUDIT_LANE PR #989 reproduced two additional source-level fail-open defects after A1-A4 passed enumerated reverify. These are repaired in the same HIGH correction and do not alter the original Free-tier architecture.

### A5 — partial GraphQL metrics are UNKNOWN, never zero

The account-wide GraphQL parser requires exactly one account result and at least one D1 analytics group.

Every returned group must contain:
- `dimensions.date` exactly equal to the requested UTC quota day;
- a non-empty `dimensions.databaseId`;
- `sum.rowsWritten` as a JavaScript finite safe nonnegative integer number;
- `sum.rowsRead` as a JavaScript finite safe nonnegative integer number.

The parser rejects as UNKNOWN:
- missing rowsRead or rowsWritten;
- null metrics;
- numeric strings;
- negative/fractional/non-finite values;
- missing/wrong date;
- missing/blank databaseId;
- duplicate date+databaseId identity;
- missing/empty/multiple account groups;
- empty analytics groups;
- aggregate safe-integer overflow.

There is no `|| 0` fallback for quota usage.

Any such case returns:
- `known=false`;
- rowsWritten = null;
- rowsRead = null;

and the quota evaluator returns `QUOTA_BUDGET_DEFER / ACCOUNT_WIDE_D1_USAGE_UNKNOWN`.

GraphQL freshness remains `NOT_DOCUMENTED_BY_VENDOR`; this hardening does not invent freshness seconds, safety percentages or hidden headroom.

### A6 — malformed same-day ledger cannot disappear

Quota ledger summarization now returns an explicit:
- `integrityState=VALID`, or
- `integrityState=INVALID`.

Malformed/incomplete/ambiguous same-day ledger content is never skipped.

Integrity-invalid examples:
- unparsable observed payload JSON;
- missing runKey;
- invalid/missing quotaDay;
- missing/non-numeric reservation rowsWritten/rowsRead;
- wrong-day reservation;
- unknown check type;
- duplicate reservation/result runKey;
- result without matching reservation;
- malformed result after-usage metrics;
- production receipt missing check ID/hash/status/expected payload;
- unsupported receipt schema/directive/budget identity;
- check ID inconsistent with quotaDay/runKey/type;
- invalid check timestamp.

On ledger integrity failure the summarizer conservatively saturates:
- outstandingReservedRowsWritten = 100,000;
- outstandingReservedRowsRead = 5,000,000;

and marks:
`SATURATE_ACCOUNT_HARD_LIMIT_ON_LEDGER_INTEGRITY_FAILURE`.

This is a safety blocking sentinel, not a claim that those rows were actually consumed.

The production gate also passes `ledgerIntegrityState` to the evaluator; any value other than VALID explicitly returns:
`QUOTA_BUDGET_DEFER / D1_QUOTA_LEDGER_INTEGRITY_INVALID`.

### Production receipt identity/hash verification

The production ledger SELECT reads:
- check_id;
- check_type;
- expected_payload_json;
- observed_payload_json;
- status;
- check_hash;
- check_timestamp.

Before budgeting:
1. structural/receipt identity validation is performed with `requireReceiptIdentity=true`;
2. check ID must equal `S2-D1-BUDGET:<payload quotaDay>:<runKey>:<RESERVATION|RESULT>`;
3. timestamp must belong to the current queried UTC-day SELECT window;
4. the stored check hash must match either:
   - current full immutable identity hash (ID/type/expected payload/observed payload/status), or
   - the explicitly supported legacy payload hash for pre-A4 receipts.

A hash mismatch blocks with `LEDGER_CHECK_HASH_MISMATCH`.

Legacy compatibility is intentionally bounded; malformed legacy data does not receive permissive defaults.

## A5/A6 physical-proof boundary

A5/A6 correctness is validated with deterministic in-memory HTTP/ledger adversarial tests and does not require spending scarce D1 quota.

The existing real account physical evidence remains unchanged:
- prior real GraphQL usage read + safe quota defer is positive infrastructure evidence;
- it is not a substitute for bounded future multiwriter physical acceptance.

System1 write/read reserves remain unauthorized/null and 2,825 remains observational only.
