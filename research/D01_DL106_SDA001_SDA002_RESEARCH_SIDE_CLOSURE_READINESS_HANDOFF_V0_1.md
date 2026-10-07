# D01 DL-106 — SDA-001 / SDA-002 Research-Side Closure-Readiness Handoff V0.1

Updated: 2026-10-08 Asia/Taipei
Status: D01_RESEARCH_SIDE_RECONCILED / TICKETS_NOT_CLOSED / FORMAL_CORE_LOCKED

## Purpose

Provide 00 audit owner a current D01-only readback so already completed research controls are not repeatedly reassigned while cross-system and validation gates remain open.

This file does not close SDA-001 or SDA-002.

## SDA-001 — same-root PRICE_OHLC multi-vote

### D01 research controls now frozen

1. informationRoot / representation family
- D01 price geometry remains rooted in PRICE_OHLC.
- named labels do not become new source information.

2. alias dedup
- multiple names on the same bar/sequence/base/gap root have one effective representation root.
- alias count cannot multiply sample size, vote, score or degrees of freedom.

3. common-parent comparators
- D01-02 named candle vs continuous one-bar OHLC geometry;
- D01-03 named sequence vs ordered N-bar geometry;
- D01-07 cup/base/handle vs prior-trend + compression + generic-breakout geometry;
- D01-09 named gap/limit pattern vs raw gap + legal limit/reference context.

4. cross-module redundancy graph
- exact duplicate;
- nested shared root;
- overlapping shared root;
- same episode different label;
- shared mechanical context;
- distinct-root candidate.

5. cross-scale firewall
- higher timeframe derived from the same bars does not create a new raw information vote.
- scale/timeframe agreement is not a vote count.

6. new structural root != independent evidence
- co-located or new structural roots remain within PRICE_OHLC until D16 residual incrementality proves otherwise.

### D01 research-side status

D01_SDA001_RESEARCH_SEMANTICS = COMPLETE_FOR_CURRENT_SCOPE.

This means:
D01 has frozen the representation/dedup/common-parent semantics requested by the queue.

It does not mean the ticket is closed.

### Remaining SDA-001 gates outside D01 research

- cross-domain D01/D02/D03 residual/common-parent integration;
- System1/System2 machine enforcement wherever still incomplete;
- genuine raw-vote vs deduped-vote receipts across real strategy decisions;
- D16 residual incrementality;
- 00 independent closure.

SDA_001_STATUS = REMEDIATION_IN_PROGRESS.

## SDA-002 — pattern hindsight / future-pivot confirmation

### D01 research controls now frozen

1. label-independent continuous geometry.
2. firstObservableAt / confirmedAt / predictorFreezeAt separation.
3. retest bar cannot certify its own predictor.
4. future suffix cannot rewrite earlier lifecycle state.
5. failure/reentry/reclaim lifecycle clocks retained.
6. negative / failed / expired / unresolved / no-structure states retained.
7. immutable episode/root/version lineage.
8. R7 outcome-field firewall.
9. detector-version migration is append-only.
10. post-outcome detector version swaps are prohibited and counted as search.
11. prefix invariance is a mandatory replay test.
12. cross-version split/merge/new/drop episode mappings are outcome-blind.

### Test-execution reconciliation

Earlier 00/queue readbacks cited recent D01 adversarial suites as TEST_EXECUTION_PENDING.

Current D01 checkpoint now records:
- deterministic V8-equivalent execution through DL-105 = 341 / 341 PASS.

Therefore the older blocker:
LATEST_D01_RESEARCH_TEST_EXECUTION_PENDING
is no longer the correct description for the current D01 research suite.

Limits:
- native Node parity is not claimed;
- genuine physical R7 replay evidence is not yet available;
- no prospective/OOS economic outcome is opened.

### D01 research-side status

D01_SDA002_CAUSAL_RESEARCH_SEMANTICS = COMPLETE_FOR_CURRENT_SCOPE.
D01_SDA002_DETERMINISTIC_EQUIVALENT_TESTS = PASS_341_OF_341.
D01_SDA002_PHYSICAL_REPLAY_RECEIPT = PENDING.

### Remaining SDA-002 gates outside D01 research

- exact physical 1101/2021-06-15 R1-R6 bundle;
- first genuine replay-safe R7 receipt;
- System1/System2 future-pivot/immutable-episode enforcement;
- D16 validation where required;
- 00 independent closure.

SDA_002_STATUS = REMEDIATION_IN_PROGRESS.

## Formal isolation

Neither research-side completeness statement changes:
- Formal eligibility;
- ranking;
- Top6;
- score/weight;
- capital;
- entry/add/reduce/sell/stop;
- notification;
- production observer wiring.

Formal Core remains LOCKED.

## Handoff rule

00 may credit:
- D01 SDA-001 semantics complete for current research scope;
- D01 SDA-002 causal semantics complete for current research scope;
- latest deterministic equivalent suite no longer pending.

00 must not credit:
- physical replay evidence not yet produced;
- D16 incrementality not yet observed;
- cross-system engineering gates not yet proved;
- ticket CLOSED.

## Exact next continuation

Prepare a D16-ready but outcome-locked first-wave handoff so no statistical design decisions need to be invented after R1-R7 evidence arrives.
