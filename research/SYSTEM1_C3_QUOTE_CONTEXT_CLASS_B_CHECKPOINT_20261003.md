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


## Null-depth hardening

A downstream Class-A falsification test exposed a JavaScript coercion hazard:
`null >= 0` is true. The C3 evidence audit now rejects selection depth when it
is null, undefined, or negative. A permanent regression fixture requires
`SELECTION_DEPTH_UNVERIFIED` and `INPUT_BLOCKED` for null depth.

This correction narrows eligibility; it does not relax any gate or alter Formal behavior.


## Latest exact-head revalidation after null-depth hardening

Validated head: `9ac012fdc2d0846cdf72e28fe1fa88b043d37649`.

- V8 Regression run 37089507323: PASS.
- V8 Repair CI run 37089507325: PASS.
- System1 isolated offline repair review run 37089507319: PASS.
- This revalidation includes the null-depth fail-closed correction; missing selection depth remains INPUT_BLOCKED.
- PR #327 was temporarily retargeted to main only to trigger the repository's main-target CI, then returned to parent PR #323.
- No Cloudflare deployment occurred.
- No Formal selector/ranker/signal/capital/order/push authority was changed.
- V8.15.3 remains a Class-B deployment candidate only.


## Quote freshness and explicit limit-price hardening

Before deployment review, the raw Quote contract was tightened further:

- quote symbol and trading date must match the active C3 symbol/session;
- Fugle lastUpdated/closeTime is normalized from Unix microseconds;
- missing timestamp, future timestamp beyond 5 seconds, or quote age beyond the existing LIVE_STALE_SECONDS contract is rejected as C3_CAPTURE_QUOTE_STALE_OR_INVALID;
- trial quotes and halted quotes are rejected for C3 entry evidence;
- raw isLimitUpPrice and isLimitDownPrice are preserved when Fugle explicitly supplies boolean values;
- isLimitUpHalt/isLimitDownHalt remain separate fields and are not relabelled;
- raw displayed depth remains raw evidence and is never converted into a new depthScore.

This hardening narrows acceptable evidence only. It does not alter Formal monitoring, selection, signal, push, order or capital behavior.


## Owner Class-B deployment approval

On 2026-10-03 Asia/Taipei, the owner explicitly approved proceeding with the V8.15.3 Class-B merge and production deployment after the dependent PR #323 research layer was merged and validated.

This approval covers only the research evidence-capture plumbing described in PR #327. It does not authorize any Formal admission, ranking, A/B, 3+3+3, capital, signal, push, order, or System2 change.

A fresh exact-head CI cycle against post-PR-323 main is required before merge.
