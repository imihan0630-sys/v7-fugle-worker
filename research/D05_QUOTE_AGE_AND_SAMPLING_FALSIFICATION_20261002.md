# D05 sampling, quote freshness and bounded collector gate — 2026-10-02

Status: SOURCE_REVALIDATED / MEASUREMENT_FALSIFICATION_FROZEN / LIVE_CAPTURE_NOT_AUTHORIZED  
Owner: 04｜波動與市場微結構研究室 (D05)  
Formal Core: LOCKED; zero policy/notification/capital changes

## Fresh source revalidation

As of 2026-10-02:
- TWSE normal continuous matching runs 09:00-13:25; opening/closing use call auction; VI temporarily changes matching mechanism. Official source: https://www.twse.com.tw/zh/products/system/trading.html
- Fugle STOCK WebSocket Books documents a time, top-five bids/asks, isContinuous and isTrial but **does not document a book-event sequence**. https://developer.fugle.tw/docs/data/websocket-api/market-data-channels/books/
- Fugle STOCK WebSocket Trades documents time and serial plus bid/ask/price/size and session/limit flags. https://developer.fugle.tw/docs/data/websocket-api/market-data-channels/trades/
- Fugle pricing (updated 2026-09-30) documents 5 Basic, 300 Developer, 2000 Advanced simultaneous stock WebSocket subscriptions and 1/2/2 connections; one symbol × one channel consumes one subscription. Actual owner's plan, quota usage, entitlement and live data rights remain UNKNOWN. https://developer.fugle.tw/docs/pricing/

Latest repo evidence:
- the owner-authorized bounded System2 Daily Resonance Worker, D1, HTTP Quote and Cron are physically active, research-only;
- current runtime uses bounded five-minute REST Quote refresh for up to 9 PRESELECTED symbols, not a prospectively persisted raw Books+Trades event ledger;
- repository search found no live stock Books+Trades collector/sequence ledger;
- `FUGLE_API_KEY` present for existing REST quote use does not prove unallocated WebSocket entitlement.

Never relabel five-minute quote snapshots as one-second event history or infer unobserved queue additions/cancellations.

## MS-063 — finer-sampling variance has no deterministic direction

For two adjacent log returns `a` and `b`:

- fine-grid realized sum = `a² + b²`;
- coarser aggregate realized sum = `(a+b)² = a² + b² + 2ab`;
- fine minus coarse = `-2ab`.

If returns alternate (opposite signs), fine-grid RV exceeds coarse-grid RV. If same-direction moves persist, coarse-grid RV exceeds fine-grid RV. Therefore a steep 1s→5s signature is **consistent with** microstructure noise but is not independently proof of it.

A high-frequency noise diagnosis must jointly examine:
- transaction versus two-sided midquote RV on exact same causal windows;
- spreadTicks and spreadBps;
- quote age / last provider time;
- trade/book message intensity;
- lagged return autocovariance;
- tick/price tier, session state and volatile event cohorts.

Never select frequency by after-cost strategy return.

## MS-064 — quote-age missingness may be endogenous to stress

A bucket with the last quote carried forward is not a freshly observed quote. A reconnect or provider stall during fast markets may generate a deceptively stable last-value line even as price discovery continues.

Thus `NO_NEW_BOOK_MESSAGE` is not equivalent to `NO_EXCHANGE_BOOK_CHANGE`.

Outcome-blind capture QA:
- preserve connection ID and reconnectSegmentId;
- preserve provider timestamp and local receive timestamp separately;
- preserve lastBookProviderTime, bookAgeMs and the bucket's observation/carry-forward mode;
- mark any interval crossing reconnect/session/mechanism boundary ineligible for naive midquote-RV inference;
- record every EXCLUDED/MISSING bucket in the coverage denominator (including volatile periods);
- never treat absence of books as zero imbalance/zero volatility;
- pre-register any quote-age tolerance before strategy outcomes.

Primary inferential cohort: normal continuous two-sided books. Keep opening/closing call, VI/trial, limit-constrained, odd-lot and unknown separate.

## MS-065 — common support is mandatory for the 1s/5s/15s test

Three cadences cannot be compared on three different implicitly retained samples.

Freeze the same causal 15-second windows where 1s, 5s and 15s candidates all have the required quality. Compare all three on the INTERSECTION of qualified windows; separately report full-universe coverage and discarded-window reason counts.

Run two analyses:
1. Matched-window estimator/state fidelity, answering the measurement question.
2. Full-window coverage and missing-not-at-random diagnostics, answering whether the matched sample is representative.

If fidelity is strong only because stressed 1s windows were discarded, 5s is not promoted as operationally sufficient.

Use E0 event/message counts alongside seconds; provider messages are **not** certified exchange-event counts.

## Minimal bounded pilot and budget guard

One regular-lot symbol with Books + Trades requires 2 subscriptions. If actually on Basic and no other subscriptions are used, at most two such symbols fit the nominal five-subscription limit; actual availability is UNKNOWN.

The normal 09:00-13:25 continuous session has 15,900 seconds:
- 1s = 15,900 diagnostic buckets per stock-day;
- 5s = 3,180 buckets;
- 15s = 1,060 buckets.

These are **grid counts**, not trade/book-event count or storage cost. Raw event volume and actual provider-message rate can exceed bucket count; compression/cost cannot be inferred from the grid alone.

Pilot authority: design and synthetic Class-A validation only until the owner's actual subscription allocation and independent Collector design are explicitly authorized under applicable governance. Do not add a second Worker Cron, paid service, extra provider tier, live WebSocket subscription or bulk R2 retention under this research note.

## Frozen nested falsification

B0: activity + session + tick + midquote local volatility (not transaction RV).
B1: B0 + spread/top1 depth.
B2: B1 + snapshotDeltaPressureProxy × price response × persistence.
B3: B2 + one top-five aggregate block.

Keep Q1 price formation, Q2 breakout path and Q3 executable fill/slippage distinct.
Only E2 10m/15m robust retention after multiple independent dates, cost, coverage, controls and OOS/Shadow may create a candidate for owner review. Failure at E0/E1 does not justify changing Formal BUY.

No new PIT event data acquired. D05 remains 46%.
