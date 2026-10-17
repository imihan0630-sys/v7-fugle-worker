# Room04 D04/D05 — fixed-session missingness and rank partial identification (2026-10-17)
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED / NO_L4_CREDIT.
Authority: latest main tracker updated 2026-10-17 09:26 Taipei; D04 58.0%, D05 54.3%, overall 47.9%. First Wave-1 modules D04-03/04/07 and D05-03/04/09 stay L3.
Parent: research/D04_D05_L4_WAVE1_PREREGISTRATION_20261004_V0_1.md. This is a new diagnostic, NOT a modification of frozen L4 hypotheses or a new threshold.

## Source-level finding
Read main research/system1_c3_live_depth_prereg_v0_1.mjs (blob 955fbf64acdc5c2f96e64681d436f54e933b1990) and research/system1_c3_live_depth_readiness_v0_1.mjs (blob 413ec2f560a8b4c8305f9bfe65895e18779583f0).
The normalizer selects the latest up to 20 observed same-symbol/same-slot historical rows, requiring at least 10; it computes ECDF midrank=(count_less+0.5*count_equal)/observedN. A READY vector is not an independently verified 20-official-session complete denominator, source-PIT admission, or economic success.
Prior Room04 work already identified sparse baseline coverage. The NEW finding is a mathematically sharp, outcome-blind interval for the fixed-calendar alternative, and its non-transferability to realized volatility.

## D05-03/04/09 — sharp partial-identification bound
Predefine N officially verified prior trading sessions and same-symbol/same-slot raw observations on n of those sessions. Let m=N-n be unobserved, x=current depth, k=observed values <x and t=observed ties. The full N-session ECDF midrank lies within:
lower=100*(k+0.5*t)/N; upper=100*(k+0.5*t+m)/N.
Every missing observation contributes an unknown value in [0,1] to the midrank numerator; extremes are attainable. This interval does not assign zeros or BAD to missing rows.
For spread quality defined as 100-spreadPercentile, reverse the spread-rank interval endpoints.
Synthetic example: observed [4,8,10,14], x=10, n=4, m=2: observed midrank 62.5%, complete-six-session possible rank [41.666667%,75%]. With n=12, m=8 and observed rank 50%, complete-20-session rank [30%,70%].
Critical scope: this fixed-official-session estimand is NOT the same as the production research normalizer's last-20-observed estimand if the latter includes older out-of-window dates. Never attach the new interval to that existing READY score without reconciling exact date membership. The official calendar itself must have an external immutable verified receipt; synthetic weekday dates do not establish it.

Support: bounded descriptive ranks prevent false point certainty. Counterevidence: missingness concentrated in volatile/illiquid/auction states makes the observed baseline selection-biased, and the bounds do not identify outcomes or actual fills. Alternatives: tick size, matching phase, provider outage, suspension, quote staleness and sampling. Failure conditions: no official date receipt, source first-known/capture clock, same native bid/ask snapshot, or complete same-slot coverage. No actual market-impact, queue, true OFI, toxicity or intent inference.

## D04-03/04/07 — missing OHLC cannot be repaired by a rank interval
For three closes [100, UNKNOWN, 100], filling UNKNOWN with 100 gives zero squared log-return average; filling it with 1000 or 10000 gives increasingly large values. Without authenticated historical price-limit/reference/CA bounds, there is no justified finite upper bound for true realized volatility. This is a mathematical counterexample, not a claim that Taiwan stocks have no exchange price limits.
Support: complete causal windows can measure contraction/expansion. Counterevidence: missing extreme days produce false contraction or misleading shock persistence. Alternatives: price limits, suspensions, corporate actions and common market shocks. Failure: missing real consecutive OHLC, official sessions, historical CA versions, first-known timestamps or frozen common support. D04-07 shares the original breakout event with D01; never double-count the event.

## Evidence and statistical gates
Locally executed a NEW 46-case rank/contract/exhaustive-two-missing-value suite plus 4 D04 missing-price counterexamples: 50/50 passed. All synthetic mathematical tests, zero true prospective dates, zero OOS/Shadow performance claims. Existing 27/44/68-case prior tests were not rerun. No 15m order book reconstructed from daily candles.
PIT: source observed/captured/first-known, parent frozen, and outcome strictly later must be independently verified. OOS/Walk-forward: any material switch to a fixed-20-official-day estimator needs a new preregistration and a fresh prospective clock. Bias/overfit/multiple-testing: no post-outcome threshold search; preserve all missing dates/reasons and date/episode clustering. Redundancy: depth/spread from one native snapshot are one parent evidence family, not independent votes. Cost/liquidity/regime: displayed depth != executable fill; request D16 dependence/MDE review before economic interpretation.
No Formal Core change, no ranking/weights/trading/notification change, no new FORMAL_OPTIMIZATION_CANDIDATE.

## Exact next continuation
1. D05: obtain verified official prior-20 session calendar and immutable original quote/depth receipts by symbol/slot, freeze n/m and missing reasons, report bound width and exact common support, separately test original last-20-observed estimand. Without native receipts, UNKNOWN.
2. D04: obtain complete 61-day original OHLC, independently audited corporate-action vintages and first-known times; only then compute true RV/ATR and compare raw/candidate price spaces. Without them, UNKNOWN.
3. Before L4 efficacy interpretation, route actual prospective frozen parents to D16 for dependence/MDE/cost. Do not rewrite historical Shadow or promote maturity from synthetic tests.
