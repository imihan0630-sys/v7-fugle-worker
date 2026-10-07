# System1 SDA-016 T48｜Generation-set Finalization Class-B Proposal — 2026-10-07

Status: CLASS-B PROPOSAL READY / IMPLEMENTATION NOT AUTHORIZED
Formal Core: LOCKED
System2 impact: NONE

## Objective

Add a prospective, append-only authority proving when one System1 scanDate's immutable C1 generation inventory is complete for research consumption.

This closes SDA016-T48 only. It does not change Formal parent identity, which remains V8.20 explicit Formal→C1 binding.

## Verified runtime facts

1. V8.19 observed producer classes:
   - AFTER_MARKET_SCAN_PIPELINE
   - STAGE_SELECTION_ROUTE
   - DIRECT_SAFE_PERSISTENCE_CALLER
2. Runtime call-site inspection shows production persistence is explicitly wired from:
   - normal after-market flow;
   - protected stage-selection route.
3. DIRECT_SAFE_PERSISTENCE_CALLER is a defensive default, not an identified independent production route in the current patch chain.
4. Historical stage-selection does not create retrospective C1 generations because persistCompletedC1Safe requires taiwanDate(now) == scanDate and the receipt decision clock to remain prospective for that same session.
5. Therefore a prior scanDate can be finalized after Taiwan date rollover once all same-date producer activity is terminal.

## Proposed minimal Class-B implementation

### 1. Immutable producer registry

Frozen registry version:
SYSTEM1_C1_PRODUCER_REGISTRY_V0_1

Entries:
- AFTER_MARKET_SCAN_PIPELINE
  - eligible=true
  - source=runAfterMarketScanCore
  - normal window includes 23:35 production scan and guarded 23:45 recovery
- STAGE_SELECTION_ROUTE
  - eligible=true only for same-date prospective C1 persistence
  - protected administrative route
  - historical recovery can alter operational selection but cannot backfill C1
- DIRECT_SAFE_PERSISTENCE_CALLER
  - eligible=false for promotion-grade finalization unless a concrete production call site is registered
  - presence as a default parameter is not evidence of an active producer

Any future new eligible call site requires a new producerRegistryVersion before promotion-grade finalization.

### 2. Append-only D1 receipt

New table:
trade_research_c1_generation_finalizations

Primary identity:
finalization_receipt_id PRIMARY KEY
scan_date UNIQUE

No UPDATE.
No DELETE.
No historical backfill.

Stored receipt includes all fields frozen in SDA016_GENERATION_SET_FINALIZATION_CONTRACT_20261007_V0_1 plus receipt JSON/digest.

### 3. Finalization timing

Preferred normal execution:
after Taiwan date rollover and before the existing 00:10 System1 C1 Prospective Evidence collector.

A finalizer may write only when:
- target scanDate is the immediately previous Taiwan trading session;
- all same-date allowed producer windows are closed;
- no same-date producer execution is still active or pending;
- generation inventory is non-truncated;
- integrityComplete=true;
- modernOriginCoverageComplete=true;
- every explicit Formal→C1 binding for scanDate points inside the canonical set;
- producer registry hash matches the frozen implementation;
- current date is later than scanDate, preventing same-day stage-selection C1 creation under the existing prospective guard.

If any prerequisite is unknown, no receipt is written.

### 4. Late generation defense

Before any C1 generation insert for a scanDate, research-side code checks whether a finalization receipt already exists.

If finalization exists:
- do not silently rewrite finalization;
- research generation persistence fails closed with POST_FINALIZATION_GENERATION_VIOLATION;
- Formal business behavior remains fail-open;
- no plan rollback, trade, push, or allocation effect.

This guard is research provenance only.

### 5. Protected readback

GET /api/research/c1-generation-finalization?scanDate=YYYY-MM-DD

Returns:
- exact append-only receipt;
- canonical generation-set digest;
- linked Formal binding IDs;
- verification result;
- postFinalizationViolationCount;
- historicalBackfillPerformed=false.

Admin authorization required.

## Proposed version

Candidate runtime:
8.21.0-c1-generation-set-finalization

V8.20 Formal→C1 parent semantics remain unchanged.

## Deterministic acceptance

Must pass T48-F01..F10 from the already merged offline oracle, plus integration cases:

- no receipt before Taiwan date rollover;
- no receipt while 23:45 recovery remains pending;
- same-date stage-selection before rollover prevents premature closure;
- historical stage-selection cannot synthesize C1;
- exact V8.20 binding must point inside final set;
- late C1 insert after finalization is rejected as research evidence only;
- Formal selection/config/delivery parity;
- provider-call delta = 0;
- System2 untouched.

## Files expected in implementation tranche

Candidate-only:
- research/system1_c1_generation_finalization_v8_21_0.mjs
- scripts/apply_v8_21_0.py
- tests/test_system1_c1_generation_finalization_v8_21_0.mjs
- migration/schema additions in guarded patch
- protected route
- a scheduled/read-only finalization trigger placed before 00:10 collector
- Regression / Repair / C1-C2 isolated review wiring
- deployment receipt and rollback evidence

## Explicitly unchanged

- A/B
- scoreCandidate
- Formal comparator
- Top6 / 3+3
- capital and sizing
- BUY / ADD / REDUCE / SELL / STOP
- 15-minute confirmation
- monitoring
- push/order
- System2

## Approval boundary

This document does not authorize runtime implementation.

Owner approval required for:
- new append-only D1 table;
- runtime pre-insert finalization guard;
- finalization writer/readback route;
- scheduler/workflow integration;
- V8.21 candidate branch and PR.

Separate owner approval is still required later for PR merge + Production deployment.

## Operational recovery independence

System1 does not need V8.21 in order to resume ordinary Formal selection.

Operational recovery remains gated by the next genuine normal session:
official quality -> Formal scan -> C1 -> V8.20 binding -> 00:10 prospective readback.

T48/V8.21 is a research-completeness hardening item, not a blocker for ordinary Formal business operation.
