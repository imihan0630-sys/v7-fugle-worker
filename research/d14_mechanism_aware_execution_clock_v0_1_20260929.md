# D14 Mechanism-Aware Execution Clock Contract v0.1

Date: 2026-09-29 Asia/Taipei
Status: RESEARCH_ONLY / FALSIFICATION_FROZEN / FORMAL_CORE_LOCKED

## Scope
D14-07 signal-to-fill latency, D14-08 odd-lot/regular-lot execution, D14-14 call-auction/special matching. This is an evidence contract only. It changes no Formal rule.

## Finding
Raw signal-to-fill elapsed time is not execution latency by itself. Taiwan intraday odd-lot orders may be entered from 09:00, but the first executable call auction is 09:10 and subsequent auctions are periodic. A volatility interruption can further delay a match. Therefore market-mechanism waiting must not be attributed to strategy/broker execution quality.

Freeze four causal clocks per action leg:
- decisionKnownAt
- mechanismEligibleAt
- submitAt
- fillAt

Derived diagnostics:
- rawLatency = fillAt - decisionKnownAt
- preEligibilityWait = max(0, mechanismEligibleAt - decisionKnownAt)
- decisionToSubmitLatency = submitAt - decisionKnownAt
- postEligibilityLatency = fillAt - max(decisionKnownAt, mechanismEligibleAt)
- submitToFillLatency = fillAt - submitAt

All clocks remain UNKNOWN unless positively evidenced. mechanismEligibleAt must be mechanism/event aware; do not hard-code 09:10 when a volatility interruption or other matching-state evidence applies.

## Mixed-lot rule
For intended quantity Q:
- regularShares = floor(Q/1000)*1000
- oddLotShares = Q mod 1000

Regular and odd-lot legs keep independent benchmark provenance, mechanism clocks, submission/fill lifecycle and explicit costs. Parent implementation shortfall may aggregate NTD costs only after all required legs are valid. Latency remains a vector; no weighted composite latency score is authorized.

## Falsification
Reject these shortcuts:
1. regular-lot quote as odd-lot executable benchmark;
2. raw latency comparison as proof odd-lot execution is worse;
3. pre-09:10 odd-lot simulated disclosure as actual executable fill evidence;
4. missing odd-lot evidence imputed from a valid regular leg;
5. fast fill = good execution or slow fill = bad execution without price improvement, non-fill and opportunity-cost context.

## Taiwan PIT feasibility
Official TWSE material establishes:
- intraday odd-lot order entry 09:00-13:30;
- first call auction 09:10;
- five-second periodic call auctions under the current regime;
- simulated disclosures before 09:10 are not executions;
- a volatility interruption can delay a match by two minutes;
- TWSE sells historical intraday odd-lot five-level order-book data from 2020-10-26 and publishes a 2026-effective file format.

This establishes a Taiwan PIT-capable source path for mechanism-aware odd-lot research, but does not establish our own prospective receipt completeness or a 2026 cost effect size.

Official sources:
- https://www.twse.com.tw/en/products/system/trading.html
- https://eshop.twse.com.tw/en/product/detail/0000000080da7fa70182335acb98009e

## Promotion decision
D14-07 and D14-08 remain L2/40 for now. Source feasibility alone is insufficient under governance: our prospective mechanism-matched receipt pipeline has not yet proven deterministic capture/replay across independent dates. D14-14 also remains L2.

## Exact next continuation
Define an isolated prospective mixed-lot receipt schema and deterministic validator that fail closed on:
- mechanism mismatch;
- missing decision/eligibility/submit/fill provenance;
- parent quantity mismatch;
- replacement double-counting;
- simulated pre-open/pre-first-auction data misclassified as fills.

Then accumulate independent dates before any L3/L4 promotion. No Formal optimization candidate.
