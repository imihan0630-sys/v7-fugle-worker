# Capital Utilization / Entry Scarcity / Re-entry Falsification Plan

Date: 2026-09-22
Status: RESEARCH ONLY
Formal Core: LOCKED
Decision impact: NONE

## Why this exists

Observed problem: formal scans can surface candidates while actual BUY triggers are rare, cash can stay idle for long periods, and partial risk reductions can lack a symmetric restore-exposure path.

This note does **not** assume the system is too strict. It preregisters the questions needed to decide whether selection, execution, sizing, or position-management is the bottleneck.

## Competing hypotheses

### H-S — Selection quality is the bottleneck
If SELECTED names do not outperform same-date controls after costs/risk, low BUY frequency may be protective.

Falsification:
- SELECTED persistently outperforms same-date QUALIFIED_NOT_SELECTED / NEAR_MISS / BROAD_CONTROL on D5/D10 with acceptable MAE and date/regime robustness.

### H-E — Entry conversion is too strict
If SELECTED names have favorable forward paths but BUY-trigger rate is low, and no-BUY plans frequently offered executable planned-zone opportunities, intraday confirmation may be over-conservative.

Falsification:
- no-BUY plans have poor/unstable paths,
- or they rarely touch the planned zone,
- or their favorable results disappear after regime/date/cost controls.

### H-C — Cash reserve / sizing is the main cause
Current deployment design reserves cash mechanically:
- 1 candidate: 35% planned, first tranche 60% of that => ~21% initial total-capital exposure.
- 2 candidates: 60% planned => ~36% initial exposure if both first tranches fill.
- 3+ candidates: 85% planned => ~51% initial exposure if all first tranches fill.
- per-stock 35% cap is not redistributed.

Falsification:
- even after decomposing deliberate reserve and second-tranche reserve, untriggered first-tranche cash remains the dominant source of idle capital and has favorable opportunity paths.

### H-A — ADD / confirmed-fill state is the bottleneck
BUY alert is intentionally not treated as a fill. ADD requires confirmed FIRST state plus firstEntryConfirmedAt and same-plan-day validity.

Falsification:
- confirmed positions routinely reconcile promptly and second-tranche ADD still triggers at a healthy rate; then state reconciliation is not the main issue.

### H-R — Trim/re-entry state is asymmetric
Current formal position stages are NONE/FIRST/FULL; no REDUCED/PARTIAL state. Active ABF radar guidance emphasizes sell/reduce alerts but has no explicit ABF restore-exposure state.

Falsification:
- REDUCE events are followed mainly by weak paths / avoided drawdowns, so missing re-add would not materially hurt total-capital outcomes,
- or simple/pre-registered re-entry conditions create unacceptable whipsaw/MAE.

## 8046 case-study guardrail

2026-09-04 partial reduction occurred after a real repricing shock:
- prior-day limit-down,
- heavy institutional selling,
- BT pricing uncertainty,
- Broadcom/TOPPAN supply-chain/order-share risk.

At the same time, ABF fundamentals remained stronger than the price shock implied, so an all-out bearish conclusion was not justified.

Ex-post:
- ~1,020 sale reference to 1,165 on 2026-09-22 ≈ +14.2% upside on sold half.
- downside after the sale reference was only ~1% to the same-day low ~1,010.
- but simple re-add anchors later incurred ~3.8% to ~7.7% interim MAE before the 9/22 surge.

Therefore this single case supports studying a re-add state, not choosing a re-add threshold.

## Sector-wide reverse test

On 2026-09-22:
- 8046 ~+9.91%,
- 3037 ~+9.80%,
- 3189 ~+8.95% intraday.

Treat this as sector repricing evidence. A future re-add hypothesis must be tested with R03 industry persistence and R06 regime transition as conditioning controls. Do not create a new ABF exception from one day.

## Required decomposition

### 1. Selection path
For every SELECTED plan:
- D1/D3/D5/D10/D20 return,
- MFE/MAE,
- same-date comparator deltas,
- independent scan-date aggregation.

### 2. Entry conversion
For every SELECTED plan:
- formal BUY observed? yes/no,
- first BUY time/price if yes,
- buyTriggerRate.

Future clause-level prospective instrumentation should distinguish:
- never entered buy zone,
- entered zone but failed volume condition,
- reversal condition absent,
- second confirmation absent,
- ran above maxChase,
- stale planDate,
- freshness failure.

Do not reconstruct these clause failures from daily OHLC.

### 3. Capital exposure
Separate:
- intentional policy reserve,
- untriggered first tranche,
- reserved second tranche,
- second tranche unavailable because confirmed execution state is absent,
- actual confirmed deployed capital.

### 4. Position management
For ADD / REDUCE / SELL / STOP:
- event path,
- confirmed actual shares,
- realized weighted P&L,
- post-REDUCE MFE/MAE,
- drawdown avoided,
- upside foregone,
- hypothetical re-add only under a pre-registered rule.

## Data feasibility

Available:
- v8_trade_journal_plans: scan_date+symbol, plan_date, strategy, signal level, formal close, buy band, breakout/maxChase, allocation, first/second/total shares.
- v8_trade_journal_signals: plan_scan_date+symbol, time, type, position stage, market price, amount/shares.
- Shadow counterfactual outcomes: D1/D3/D5/D10/D20 return, MFE, MAE.

Not safely readable through public endpoints today:
- historical journal details,
- execution-shadow recorder history,
- diagnostics_json.

Keep those coverage states UNKNOWN rather than inferring from cron success.

## Statistical / governance rules

- Scan date is the primary independent evidence unit.
- No no-BUY=0-return coding.
- No winner-only case study.
- Compare multiple control cohorts.
- No gate relaxation based on raw utilization.
- Any proposed change must improve opportunity-cost-adjusted total-capital outcomes while preserving acceptable MAE/drawdown/false-break/cost/date/regime robustness.
- Change one layer at a time in Shadow.
- Do not retune existing thresholds after seeing outcomes.
- No Formal Core or automation trading-guidance change without explicit owner decision.

## External evidence constraints

Taiwan evidence supports conditional momentum, not universal continuation:
- Chen, Hsieh & Lee (2023), Pacific-Basin Finance Journal, DOI 10.1016/j.pacfin.2023.101943: persistent winners/losers behave differently from nonpersistent momentum stocks.
- Lin, Ko, Feng & Yang (2016), Pacific-Basin Finance Journal, DOI 10.1016/j.pacfin.2016.03.009: positive momentum in market continuations, reversal during market transitions.
- Ho, Hsiao, Lo & Yang (2023), Pacific-Basin Finance Journal, DOI 10.1016/j.pacfin.2023.102151: Taiwan intraday and overnight return information has opposite continuation/reversal implications.
- Barber, Lee, Liu & Odean (2007), European Financial Management, DOI 10.1111/j.1468-036X.2007.00367.x: disposition effect warns against assuming profit-taking is automatically rational, but does not invalidate rules-based risk reduction.

These studies motivate falsification controls; they do not validate our exact thresholds or state machine.
