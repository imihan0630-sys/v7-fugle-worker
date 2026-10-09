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
