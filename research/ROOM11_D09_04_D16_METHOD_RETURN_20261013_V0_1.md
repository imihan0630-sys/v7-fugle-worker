# Room11 D16 method return for D09-04 three-date TWSE breadth — 2026-10-13

Status: RESEARCH_ONLY / METHOD_FROZEN / OUTCOME_ACCESS_CLOSED / POWER_INSUFFICIENT
Owner: 11｜統計驗證與策略市場狀態研究室
Request: `research/BR074_D09_04_D16_VALIDATION_DEPENDENCY_REQUEST_20261008.md`
Formal Core: LOCKED. No live strategy, policy, weight, threshold, runtime or deployment change.

## Real-source readback (main faa40eefc276079960532122e928e44cf2161cfb)
Three official TWSE Stocks-column source-root receipts, not three independent trials of a trading strategy:
- 2026-10-02: `research/br039_twse_advance_decline_receipt_20261002_v0_1.json`, up 483, down 506, flat 91, comparable 1080; capturedAt 15:48:00 Asia/Taipei.
- 2026-10-07: `research/br040_twse_advance_decline_second_date_20261007_v0_1.json`, up 588, down 387, flat 99, comparable 1074; capturedAt 23:55:26 Asia/Taipei.
- 2026-10-08: `research/br073_twse_advance_decline_third_date_20261008_v0_1.json`, up 425, down 540, flat 109, comparable 1074; source capture/firstKnown clock UNKNOWN.

All three source count identities verified from actual committed receipt JSON. 17 bounded read-only consistency checks passed, no real future outcomes read. A missing capture clock is UNKNOWN, never zero, never a fabricated 15:30 availability.

## Critical additional clock falsification
The receipts establish observed historical stock breadth, but NOT that the same information was known at a hypothetical 15:30 Taiwan decision clock on its trade date:
- Oct 02 first documented capture is 15:48, later than 15:30.
- Oct 07 first documented capture is 23:55:26, later than 15:30.
- Oct 08 has no durable capturedAt in the cited receipt; it cannot prove any decision-time eligibility.
A capture after 15:30 does NOT prove that the exchange had not published earlier; it simply does not prove availability at 15:30. Treat all three same-date 15:30 eligibility states as UNKNOWN / NOT_PROVEN, not as invalid official observations. Reuse at a later decision clock requires a separately pinned as-of receipt, not retroactive inference.

## Requested D16 method return (nine fields)
1. Method receipt: this document; machine receipt `research/ROOM11_D09_04_D16_METHOD_RETURN_20261013_V0_1.json`.
2. Estimand: source-valid descriptive TWSE-only daily comparable-stock breadth `(up-down)/(up+down+flat)`. Any future predictive estimand requires a separately frozen target identifier, index/strategy return basis, official session calendar and D5/D20/D60 horizon convention BEFORE outcomes open. Do not silently change the estimand to whole Taiwan or Formal-eligible universe.
3. Independent unit: one TWSE market-date source root; each eligible date equal-weighted. Same-date symbol rows, multiple horizons, multiple consumers and transforms do not increase independent N. Serial dependence, overlapping horizons and regime episodes must be diagnosed on the date series, not iid stock rows.
4. Common-support: exact marketDate, market scope, comparable denominator, source hash/receipt, firstKnown/availableAt bound, frozen decision clock, official index context, PIT regime snapshot/version, strategy-universe identity if used, explicit TPEx state and missingness. Do not join to same-date pre-availability data.
5. Multiplicity: D5/D20/D60 form one family with all variants/thresholds and repeated inspections recorded. Choose primary target and correction method before any future-outcome access; no after-the-fact best-horizon reporting.
6. Redundancy: compare with contemporaneous cap-weighted index direction, D09-05 above-MA, D09-10 concentration, D09-12 breadth × regime, and pre-existing sector/volatility context on identical eligible dates. The observed index/breadth direction disagreements on Oct 02 and Oct 07 prove nonidentity, NOT incremental predictive value.
7. Support/power: N=3 independent market dates in the handoff; `POWER_INSUFFICIENT`. No numerical significance, confidence interval, predictive/OOS superiority, L4 promotion or tradable policy claim is authorized. Do not invent a universal minimum N; freeze target precision, dependence and power before deciding a support gate.
8. Outcome access: `CLOSED`; no D5/D20/D60 future return, selected-stock outcome, rank, position, or regime-policy PnL opened. At least the three historical 15:30 PIT eligibility claims are `NOT_PROVEN`.
9. Current disposition: `METHOD_FROZEN / POWER_INSUFFICIENT / SAME_DAY_DECISION_CLOCK_NOT_PROVEN`. The next action is new independent official roots with exact response/capture clocks and separate prior-decision eligibility; freeze a target/benchmark/cost family before any outcome-opening review.

## Mechanism, falsification, alternatives, failure
Support: cross-sectional up/down participation can reveal index concentration hidden by capitalization-weighted movement.
Falsification: two sign disagreements in three days are descriptive; after index, above-MA, concentration, regime, dependence, cost and multiplicity controls the residual may be zero.
Alternative: capitalization concentration, holiday/session selection, delayed observation, N/A exclusions, or different universes may explain divergence.
Failure: future state backfill, absent firstKnown bound treated as timely, TPEx/strategy denominator conflation, duplicate-date inflation, outcome-selected threshold/horizon, or lack of common support.

## Exact next continuation
1. Return this frozen method to the D09-04 request without opening outcomes; Room07 continues new genuine official TWSE source-date receipts.
2. Verify any new receipt has exact `capturedAt`, response hash, source date and firstKnown/decision clock; distinguish post-close descriptive availability from a same-day 15:30 trading decision.
3. Recheck genuine C1 CalibrationReceipt (D16-25), same-cut TWSE treatment/control population (D16-20), D18-04 CLEAR_NO_ACTION U2B pair, and D16-17 historical row-level membership; move to next executable lane if blocked.
4. Keep D16=65.6%, D18=54.7%, aggregate=47.9% until tracker-grade physical acceptance. No `FORMAL_OPTIMIZATION_CANDIDATE`.
