# Room11 D16+D18 — As-of Coverage Selection / Clock-Conditioned Sign Reversal (2026-10-10)
Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED / METHOD_FALSIFICATION_COMPLETE
Owner: 11｜統計驗證與策略市場狀態研究室
Authority: latest main, canonical tracker and D16_D18_VALIDATION_CHECKPOINT
Scope: D16-06, D16-11, D16-20, D18-04, D18-06, D18-13
No strategy action, weights, thresholds, capital, runtime or production change.

## New question (not BR-074 repetition)
Does conditioning a market-state sample on whether an official receipt was captured before a *fixed strategy decision clock* change the observed regime distribution? Could a late/unknown source clock masquerade as a market-state effect?

BR-074 already established three official TWSE market-date roots and a small-N power block. This study freezes a **different** estimand: the as-of-observable root population, not the ex-post official market-date population. The same root cannot be counted again because a second room or strategy consumes it.

## Physical parent receipts (all outcomes closed)
- 2026-10-02: research/br039_twse_advance_decline_receipt_20261002_v0_1.json; capturedAt 2026-10-02T15:48:00+08:00; up 483, down 506, flat 91, comparable 1080; exact count-derived net breadth (483-506)/1080*100 = -2.1296296296 percentage points.
- 2026-10-07: research/br040_twse_advance_decline_second_date_20261007_v0_1.json; capturedAt 2026-10-07T23:55:26+08:00; up 588, down 387, flat 99, comparable 1074; net = +18.7150837989 pp.
- 2026-10-08: research/br073_twse_advance_decline_third_date_20261008_v0_1.json; capturedAt not provided; up 425, down 540, flat 109, comparable 1074; net = -10.7076350093 pp.
- All three are TWSE stock-only descriptive roots; not TWSE+TPEx or System1 eligible universe. Original raw HTTP byte hash is not certified by these three parent receipts. No future stock/strategy outcome is opened.

## Predeclared synthetic strategy clock — illustrative, NOT an existing formal policy
At each market date 18:00 Asia/Taipei:
- 10/02: captured receipt is timestamp-admissible (15:48 <= 18:00), but raw-byte completeness and full decision-stage admissibility remain UNKNOWN.
- 10/07: recorded capture 23:55:26 is AFTER 18:00. This does not prove the official data was unavailable at 18:00; it proves this receipt **cannot certify** availability at 18:00. State NOT_PROVEN_ASOF, not BAD, zero, or proof of source outage.
- 10/08: no capturedAt; state UNKNOWN, not zero, late, or eligible.
- Timestamp-proven subset N=1, not full PIT-certified strategy-date N. Full admissible N=UNKNOWN.
- Ex-post equal-date descriptive mean across all three dates = +1.9592730533 pp.
- Timestamp-proven 18:00 subset descriptive mean = -2.1296296296 pp.
- The signs differ; this is a **coverage selection counterexample**, not an investment result or causal inference. The comparison is not a valid OOS test.
- If the clock were post-hoc changed to 23:59, two receipts would be timestamp-proven, and their mean would be +8.2927270846 pp. That choice must not be made after observing breadth values; a different decision clock is a different preregistered experiment.
- At 15:00, no captured receipt certifies availability. A zero-date sample is not a zero-breadth market.

## Four-way research hypothesis contract
H1 (capture-conditioned selection):
Support: publication/capture latency and provider transport may differ by market date and market stress; a fixed cutoff can select different market-state roots.
Falsification: collect genuinely prospective immutable source/capture timestamps at the same preregistered decision clock across independent sessions, then compare observed versus excluded/unknown date characteristics without using future strategy outcomes.
Alternative: researcher/collector scheduling or outage, not an economic regime, can explain missing receipts.
Failure: claim that a later capture proves source nonavailability at cutoff, or that an unknown timestamp is a valid zero.

H2 (incremental regime value):
Support: stock-count breadth may differ from cap-weighted index direction.
Falsification: compare predeclared breadth interaction against static, cap-weighted index, concentration, sector and liquidity baselines on identical decision dates and exposure/cost rules; group by independent date and episode.
Alternative: broad market trend, sector mix, liquidity, provider coverage and delayed captures.
Failure: apparent advantage vanishes after common-date support, or a single date/episode dominates.

H3 (statistical inference):
Support: repeated independent decision dates could eventually support uncertainty estimation.
Falsification: purged chronological holdout, episode/block bootstrap, fixed D5/D20/D60 family, multiple-test accounting, and predeclared stopping.
Alternative: multiple transforms/horizons or multiple stocks from one day create pseudo-replication.
Failure: treat three dates as thousands of independent stock observations; claim p<0.05 with N=3 from an unjustified test.

H4 (missingness and inverse weighting):
Support: a validated observation-propensity model may correct some missing-at-random coverage differences if positivity and independent-date support exist.
Falsification: show a known observation probability for each eligible date from predecision covariates, validate overlap, and compare weighted/unweighted estimates under sensitivity bounds.
Alternative: capture missingness depends on unmeasured transport incidents or market shocks (MNAR).
Failure: use inverse-propensity weights on three dates with unknown selection probabilities, or fill unknown outcome/clock with zero. Current disposition: NOT_IDENTIFIED; no weighting estimate authorized.

## Two distinct clocks, three distinct populations
1. Market date = official statistic's referenced trading date.
2. capturedAt = when this particular receipt was actually captured (upper bound on when this research process demonstrably possessed it, NOT the first public publication time).
3. decisionAt = strategy's predeclared cutoff.
Populations:
A. Ex-post official market-date roots (N=3).
B. Timestamp-proven by a fixed 18:00 cutoff (N=1).
C. Full PIT-admissible, raw/source/identity/strategy-stage validated roots (N=UNKNOWN).
Never substitute B for C. The count of consumers/horizons does not multiply N.

## Validation outcomes
- Independent arithmetic and cutoff classification performed locally with exact timezone-aware timestamps.
- Asserted: 18:00 proven subset N=1; 15:00 proven subset N=0; 23:59 proven subset N=2; unknown 10/08 remains unknown; ex-post mean +1.9592730533 pp; 18:00 proven mean -2.1296296296 pp; 23:59 proven mean +8.2927270846 pp.
- This is a small-N descriptive falsification only. No empirical alpha, no OOS/Shadow promotion, no new policy threshold.
- All proposed optimization states remain NONE.

## Exact next continuation
1. Consume a genuine immutable source-byte receipt and first-known/capture clock for 10/08 if one exists; never invent it or backdate it. Preserve separate source-availability vs collector-capture semantics.
2. Require a frozen actual strategy decisionAt before treating any official root as a strategy input. Without it, remain descriptive.
3. Accumulate independent future same-clock official TWSE roots and joint producer roots; evaluate source-clock missingness/selection before any economic outcome.
4. Keep D16-20 real treatment/control cohort and D16-17 historical membership blocked unless authoritative row-level evidence arrives. Move to the next executable D16/D18 module rather than spin on blocked sources.
5. Keep D18-06 market-level size interaction L3 feasibility separate from S0/S1 constituent-size attribution and L4 strategy-value claims.
