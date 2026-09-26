# System 2 Performance and Frozen Decision Spec

Updated: 2026-09-26
Status: DESIGN V0.1

## Purpose

Every daily strategy output must be frozen at decision time so future performance can be measured without hindsight edits.

## Decision snapshot

Required fields include:
- decisionId
- decisionTimestamp
- marketDate
- strategyId
- strategyVersion
- symbol/company
- rank
- totalScore
- factor-group scores
- factor raw inputs and versions
- regime state
- selection reasons
- exclusions/warnings
- entryZoneLow/High
- triggerPrice
- stopPrice
- target(s)
- maxHoldingHorizon
- thesis / invalidation conditions
- source/availableAt metadata
- unknown fields

Once published, the snapshot is immutable. Corrections create a new correction record, not silent overwrite.

## Signal price vs simulated fill

Signal/trigger price is not automatically a fill.

Simulated execution must define:
- whether the next tradable bar touched/crossed the trigger;
- gap/open handling;
- limit-up/limit-down feasibility;
- liquidity/volume feasibility;
- slippage;
- fees and Taiwan taxes;
- ambiguous same-bar stop/target ordering.

Unknown sequencing remains AMBIGUOUS rather than choosing the favorable outcome.

## Independent strategy portfolios

Each strategy is evaluated using comparable starting capital and documented sizing rules. Cross-strategy comparisons must not mix unequal capital assumptions without normalization.

## Metrics

At minimum:
- total/annualized/monthly return;
- win rate;
- average win/loss;
- payoff ratio;
- expectancy;
- profit factor;
- max drawdown;
- volatility/downside risk;
- MFE/MAE;
- average holding period;
- turnover and costs;
- capital utilization;
- selected -> triggered conversion;
- triggered -> profitable conversion;
- zero-pick days;
- regime/industry concentration;
- strategy correlation.

## Versioning

Strategy versions are immutable. A changed weight, threshold, floor, factor definition, regime gate or execution assumption creates a new version.

Old and new versions may run in parallel Shadow comparison.

## Anti-bias controls

- point-in-time inputs only;
- no survivor-only universe;
- corporate-action adjustment provenance;
- no retroactive signal rewriting;
- purged forward holdout/OOS;
- independent-date clustering;
- multiple-testing/factor-zoo accounting;
- realistic costs/slippage;
- report failed and zero-pick periods.

## Interpretation

Performance determines evidence, not guaranteed future profit. Monthly P/L may be tracked as an outcome, but strategy logic is not loosened merely to hit a monthly income target.
