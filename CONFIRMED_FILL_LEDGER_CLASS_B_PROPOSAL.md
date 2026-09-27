# Confirmed Fill Ledger — Class-B Production Proposal v0.1

Updated: 2026-09-27
Status: PROPOSAL_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED
Formal Core: NO DECISION IMPACT

## Purpose

Create a trustworthy, append-only Production evidence layer for confirmed position changes so future research can reconstruct actual-live holdings, heat, turnover, REDUCE/RE-ADD lifecycle and execution friction without converting monitor signals into fake fills.

This proposal is based only on the falsified/surviving `CONFIRMED_FILL_LEDGER_V0_2_1` research contract.

It does **not** change:
- after-market selection;
- A/B logic;
- Formal ranking;
- Top6 / 3+3;
- allocation;
- BUY / ADD / REDUCE / SELL / stop rules;
- monitoring or push decisions.

## Why a separate ledger is required

Current Production has two different evidence classes:

1. `v8_trade_journal_signals`
   - strategy/monitor events;
   - signal shares and observed price;
   - not broker-confirmed fills.

2. `/api/positions`
   - mutable current snapshot;
   - actualShares / averageCost / firstEntryConfirmedAt when manually reconciled;
   - not an append-only historical lifecycle.

Therefore neither may be silently repurposed as a fill ledger.

## Proposed D1 event table

Additive table only; no existing table is replaced.

```sql
CREATE TABLE IF NOT EXISTS v8_confirmed_execution_events (
  ledger_event_id TEXT PRIMARY KEY,
  ledger_epoch_id TEXT NOT NULL,
  event_kind TEXT NOT NULL CHECK(event_kind IN ('POSITION_BASELINE','FILL')),
  account_key TEXT NOT NULL,
  symbol TEXT NOT NULL,
  plan_scan_date TEXT,
  signal_event_id TEXT,
  action TEXT,
  effective_at TEXT NOT NULL,
  confirmed_at TEXT NOT NULL,
  fill_price REAL,
  filled_shares INTEGER,
  shares_before INTEGER,
  shares_after INTEGER NOT NULL,
  average_cost_after REAL,
  source TEXT NOT NULL,
  source_record_id TEXT NOT NULL,
  reconciliation_status TEXT NOT NULL CHECK(reconciliation_status IN ('CONFIRMED','CORRECTED')),
  corrects_ledger_event_id TEXT,
  payload_hash TEXT NOT NULL,
  provenance_json TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(source, source_record_id)
);
```

Recommended indexes:
- account_key + symbol + ledger_epoch_id + confirmed_at;
- account_key + symbol + ledger_epoch_id + effective_at;
- plan_scan_date + symbol;
- signal_event_id.

The implementation must prohibit ordinary application UPDATE/DELETE of this table. Corrections are new rows.

## Derived head table

A small mutable cache may be maintained:

`v8_execution_position_heads`
- account_key;
- symbol;
- ledger_epoch_id;
- head_event_id;
- shares;
- average_cost;
- ledger_health;
- head_version;
- updated_at.

This table is **not evidence**. It must be rebuildable from the immutable event ledger.

Possible health states:
- HEALTHY;
- RECONCILIATION_REQUIRED;
- UNKNOWN.

No Formal logic may read the head table in Phase A.

## Baseline semantics

For a position that exists before ledger capture begins:
- submit an explicit `POSITION_BASELINE`;
- assign a new `ledgerEpochId`;
- record accountKey, symbol, sharesAfter, averageCostAfter, effectiveAt, confirmedAt and provenance;
- do not create a synthetic BUY.

A clean first BUY with sharesBefore=0 may start a new epoch without a baseline.

ADD / REDUCE / SELL cannot start an epoch.

## FILL provenance

Every FILL requires:
- `planScanDate`;
- `ledgerEpochId`;
- accountKey and symbol;
- source + sourceRecordId;
- effectiveAt + confirmedAt;
- action;
- fillPrice;
- filledShares;
- sharesBefore + sharesAfter;
- averageCostAfter.

`signalEventId` is optional linkage only.

## API proposal

Admin-authenticated, separate from `/api/positions`.

### POST /api/execution-ledger/validate
- validation only;
- no D1 write;
- returns normalized event + errors + current-head compatibility.

### POST /api/execution-ledger/events
- append only;
- accepts a bounded batch;
- requires write feature flag;
- validates v0.2.1 semantics;
- enforces idempotency/conflict rules;
- validates expected predecessor/head;
- writes event(s);
- rebuilds/validates affected epoch head;
- never changes Formal plan or signal state.

### GET /api/execution-ledger/events
Read-only filtered view by account/symbol/epoch/date/asKnownAt.

### GET /api/execution-ledger/health
Coverage and chain-health summary only.

## Idempotency and conflict rules

Each submitted event includes a canonical payload hash.

1. Same `ledgerEventId` + same hash:
   - return existing receipt;
   - no new row.

2. Same `ledgerEventId` + different hash:
   - HTTP 409 conflict.

3. Same `source + sourceRecordId` + same hash:
   - idempotent readback.

4. Same `source + sourceRecordId` + different hash:
   - HTTP 409 conflict.

Never mutate the old row to make a conflict disappear.

## Concurrency / predecessor guard

Every new non-correction event should submit:
- `expectedHeadEventId` or explicit null for a new epoch.

The writer compares it with the current derived head before append.

If they differ:
- reject with conflict;
- refetch and reconcile;
- never guess ordering.

Exact D1 transaction/batch semantics must be verified in implementation tests before deployment. If atomic event+head update cannot be proven, the write path is not ready.

## Correction semantics

Correction is a new `CORRECTED` row referencing `correctsLedgerEventId`.

After a correction:
- replay the affected epoch;
- if downstream sharesBefore/after no longer chain, set head health to `RECONCILIATION_REQUIRED`;
- do not silently rewrite downstream receipts;
- keep both earlier as-known history and later corrected knowledge reconstructable via confirmedAt.

## Relationship to /api/positions

Strict rule:

**Do not auto-convert a normal /api/positions save into a baseline or fill.**

`/api/positions` stays a current snapshot/read model.

A user may explicitly create a POSITION_BASELINE through the execution-ledger path, but that is a separate intentional action with its own evidence receipt.

Later, if ledger coverage is complete and separately approved, /api/positions could be derived from the ledger. That is outside Phase A.

## Source policy

Current repository audit proves no broker order/fill connector in Production scripts.

Allowed sources:
- BROKER_IMPORT — only after a real broker connector is verified;
- MANUAL_CONFIRMED — explicit user-confirmed fill;
- VERIFIED_EXTERNAL — an external execution record with stable provenance.

Fugle market-data quotes/candles are not broker execution evidence.

## Phase-A deployment boundary

If approved, first Production implementation should be evidence-only:
- additive D1 schema;
- validation/read endpoints;
- append endpoint behind a dedicated write flag;
- no Formal read dependency;
- no automatic writes from monitor signals;
- no automatic writes from /api/positions;
- no push effect;
- no 3Min effect.

This gives a safe rollback surface.

## Rollback

- Back up Worker/Cron before deployment using existing deployment protections.
- D1 migration is additive.
- Rollback Worker code without deleting event rows.
- Disable write flag to freeze capture immediately.
- Existing Formal selection/monitoring continues independently.
- Never delete ledger evidence as part of application rollback.

## Acceptance tests before any deploy

Required deterministic tests:
1. baseline -> REDUCE chain valid;
2. zero -> BUY valid without baseline;
3. ADD/REDUCE/SELL first event rejected without baseline;
4. missing planScanDate on FILL rejected;
5. signalEventId cannot equal ledgerEventId;
6. duplicate exact event idempotent;
7. duplicate conflicting payload rejected;
8. same sourceRecordId conflict rejected;
9. stale expectedHeadEventId rejected;
10. correction append preserves pre-correction as-known state;
11. correction-induced chain break => RECONCILIATION_REQUIRED;
12. same symbol in different accounts/epochs isolated;
13. /api/positions save creates zero execution events;
14. signal generation creates zero execution events;
15. Formal output hash/invariants unchanged with ledger enabled but unused.

## Promotion boundary

This is an **evidence-infrastructure proposal**, not a Formal optimization candidate.

Implementation can improve future research quality and enable actual-live Portfolio Risk / Trading Frictions / REDUCE-RE-ADD studies, but it does not itself prove better stock selection or trading outcomes.

Status:
`CLASS_B_PRODUCTION_PROPOSAL_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED`.


## PR-051 — ledger-valid fill is not automatically sizing-attributable (2026-09-27)

The Confirmed Fill Ledger v0.2.1 correctly keeps `signalEventId` optional for general holdings evidence. That is necessary because baselines and externally/manual-originated fills may not have a Formal signal.

However, Portfolio Risk execution research needs a stricter second-layer classifier.

A fill is `ATTRIBUTION_ELIGIBLE` only when:
- `fill.signalEventId` exactly matches a durable signal event;
- action is compatible with signal type;
- symbol matches;
- planScanDate matches;
- fill effectiveAt is not earlier than signal occurredAt.

A ledger-valid fill without signalEventId is now explicitly:
`UNATTRIBUTED_EXECUTION`.

It may still update actual holdings, but it is excluded from:
- PriorityScore sizing realized-edge analysis;
- signal-to-fill slippage attribution;
- trigger-to-fill latency attribution.

This preserves a clean distinction:
`position accounting evidence != strategy-attribution evidence`.

Artifacts:
`research/execution_attribution_linkage_v0_1.mjs`;
`research/execution_attribution_linkage_spec_v0_1.json`.

Status:
`ATTRIBUTION_CLASSIFIER_READY / CLASS_B_LEDGER_PROPOSAL_NEEDS_RESEARCH_ELIGIBILITY_ADDENDUM`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-052 — linked fill friction is measurable; fill-rate/partial-fill is not (2026-09-27)

After PR-051 separates ledger validity from signal attribution, PR-052 freezes the next execution boundary.

For a positively linked signal + confirmed fill pair, research can measure:
- signal occurrence -> fill effective time latency;
- fill effective time -> confirmation time lag;
- side-aware signal-price vs fill-price slippage;
- confirmed filled shares.

Adverse slippage is defined as:
- BUY/ADD: `(fillPrice - signalPrice) / signalPrice`;
- SELL/REDUCE: `(signalPrice - fillPrice) / signalPrice`.

Positive means adverse; negative means favorable.

### Critical non-identifiability

Filled shares alone do **not** identify:
- whether an order was actually submitted;
- submitted order quantity;
- fill probability;
- partial-fill fraction;
- cancel/replace path.

A system suggestion of 148 shares followed by a confirmed 100-share fill does not prove a 100/148 partial fill. The user may have intentionally submitted only 100 shares.

Therefore fill-rate research requires a separate broker/order receipt layer with:
- stable order id;
- submittedAt;
- side/action;
- submitted shares;
- order type/limit price where relevant;
- broker acknowledgement/status history;
- stable linkage to signalEventId and fill events.

The Confirmed Fill Ledger remains sufficient for actual position state and, when signal-linked, signal-to-fill slippage/latency. It is not sufficient for order fill-rate inference.

Artifacts:
`research/linked_fill_friction_v0_1.mjs`;
`research/linked_fill_friction_semantics_v0_1.json`.

Status:
`FILL_FRICTION_MEASURABLE_IF_LINKED / ORDER_FILL_RATE_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-056 — ADD trigger is allocation-invariant only conditional on independently proven FIRST state (2026-09-27)

A source audit of the second-entry path shows that ADD eligibility itself does not read:
- PriorityScore;
- allocationRatio;
- totalAllocation;
- secondAmount;
- secondShares.

The ADD branch is entered only after the common price/K-line decision reaches `buy`, the maxChase guard passes, and `positionStage === FIRST`.

Only after that eligibility is satisfied are `secondAmount` and `secondShares` attached to the ADD signal.

### Critical condition

This is **conditional invariance**, not unconditional invariance.

A counterfactual allocator may reuse the observed ADD trigger timestamp only when both execution paths have independently and validly reached FIRST.

The current path's FIRST state must never be copied into the comparator by assumption.

Thus full two-stage execution research requires:
1. independently orderable comparator FIRST;
2. attributed/valid first-fill state for the comparator execution model;
3. then shared ADD trigger timing under identical non-sizing plan/code/market-data conditions;
4. comparator secondAmount/secondShares recomputed separately;
5. fill/slippage/cost evidence handled separately.

Artifact:
`research/add_trigger_conditional_invariance_v0_1.json`.

Test:
`tests/test_add_trigger_conditional_invariance_v0_1.mjs`.

Status:
`ADD_TRIGGER_CONDITIONALLY_ALLOCATION_INVARIANT / FIRST_STATE_EXECUTION_GATED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
