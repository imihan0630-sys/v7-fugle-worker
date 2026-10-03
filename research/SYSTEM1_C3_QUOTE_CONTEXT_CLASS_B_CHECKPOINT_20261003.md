# System 1 C3 quote-context Class-B checkpoint — 2026-10-03

Status: DRAFT PR #327 / NOT MERGED / NOT DEPLOYED / FORMAL CORE LOCKED
Parent research: PR #323 evidence automation.

## Candidate scope

V8.15.3 adds prospective research evidence only:
- C1 selection-time receipt adds ret20, maDistance20Pct and lateStage already known at the Formal decision timestamp.
- C1 derived geometry adds A support and B breakout anchors while preserving the existing entry/stop/target derivation.
- C3 Shadow-only capture is reduced to max 3 names.
- At each of the existing 17 completed-15m slots, each C3 name may use one 15m candle request plus one quote request.
- Extra provider budget remains max 6 calls/slot and 102/session.
- Aggregate projected Fugle usage remains capped at 50/min before any C3 call.

## Quote semantics

Stored quote context is raw evidence:
- top-five bids/asks;
- bidDepth5 / askDepth5 / depthImbalance;
- best bid/ask and spread;
- previous close / open / average price;
- quote timestamp;
- trading-halt / trial / continuous / delayed-open / delayed-close / limit-halt flags;
- executionMarketState derived from those explicit flags.

No raw quote field is converted into a new 0-100 depthScore.
isLimitUpHalt is not re-labelled as a generic “stock is at limit-up” fact.
Strict C3 remains INPUT_BLOCKED wherever the experiment contract requires a semantic that this raw evidence does not prove.

## Contract compatibility

Research capture contract is upgraded to SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2.
The sampler, registration builder, scheduled collector and candidate runtime use:
- maxShadowSymbols=3;
- providerBudgetCallsPerSession=102;
- candle + quote call accounting.

Formal-monitored symbols remain excluded from extra C3 capture and reuse existing PV research evidence.

## Governance boundary

No A/B, rank, gate threshold, 3+3+3 quota, capital, FIRST/ADD/REDUCE/SELL, Formal monitoring target, push, order or System2 authority changes.

PR #327 must remain unmerged until:
1. exact-head Regression / Repair / isolated review pass;
2. runtime build proves Formal paths unchanged;
3. owner explicitly approves Class-B deployment.

Passing fixture tests alone is not alpha evidence and is not Formal-switch authority.


## Exact-head validation closure

Validated head: `84a927d5410a2eb3240a65619b769b3a2b17dbfc`.

- System1 isolated offline review run 37088760481: PASS.
- V8 Repair CI run 37088760433: PASS.
- V8 Regression run 37088760437: PASS.
- V8.15.3 is actually applied after V8.15.2 in every validated build chain.
- The isolated review allowlist was widened only for the two C1 research-receipt projection helpers
  `c1ProjectFeature` and `c1DerivedState`, plus previously approved research plumbing.
  No selector, ranker, signal, capital, order or push function was allowlisted.
- The registration/sampler/runtime contract is aligned at
  `SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2`.
- Full-load research envelope remains 3 Shadow-only names ×
  (1 completed 15m candle + 1 raw Quote) × 17 slots = 102 extra provider calls/session.
- Aggregate C3 guard remains projected total <=50/min.
- No Cloudflare deploy occurred from this validation.
- PR #327 remains Draft, clean, unmerged and undeployed.

This PASS proves engineering separation and contract consistency only.
It does not prove C3 economic superiority and does not authorize Formal changes.
