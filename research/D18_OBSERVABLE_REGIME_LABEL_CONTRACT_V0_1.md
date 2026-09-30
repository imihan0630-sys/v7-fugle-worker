# D18 Observable Regime Label Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH PROPOSAL / NOT WIRED / NO POLICY IMPACT
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Provide a deterministic, outcome-independent descriptive regime vector using already planned System 2 Taiwan-market inputs.

This contract intentionally does NOT create one universal RISK_ON/RISK_OFF score.
Each dimension remains separate so later research can test incremental strategy interaction and redundancy.

## Decision-time rule

- compute only after the frozen Taiwan after-close decision timestamp;
- all inputs must satisfy observedAt / availableAt / PIT eligibility;
- the resulting state can affect a policy no earlier than the next official tradable session;
- missing required components => UNKNOWN for that dimension, never neutral;
- current rules are frozen before any regime-policy outcome study.

## Dimension A — Trend context

Inputs:
- TAIEX close;
- ma20;
- ma20Slope5;
- return20 retained as context, not required for the V0.1 label.

Rule:
- UP_TREND_CONTEXT if close > ma20 AND ma20Slope5 > 0;
- DOWN_TREND_CONTEXT if close < ma20 AND ma20Slope5 < 0;
- RANGE_OR_MIXED otherwise;
- UNKNOWN if close / ma20 / ma20Slope5 is not PIT-ready.

Reason:
The zero/same-value boundaries are structural and do not require an outcome-derived optimization threshold.

Falsification:
- label may be redundant with stock-level trend factors;
- mixed state may dominate occupancy;
- after-close trend may have little incremental value for next-session policy;
- policy value must be tested, not assumed from label plausibility.

## Dimension B — Breadth / participation context

Inputs:
- advanceShare;
- medianReturn;
- eligibleCoveragePct.

Rule:
- BROAD_POSITIVE if advanceShare > 0.5 AND medianReturn > 0;
- BROAD_NEGATIVE if advanceShare < 0.5 AND medianReturn < 0;
- BREADTH_MIXED otherwise;
- UNKNOWN when required coverage is not prospectively valid.

Coverage:
No minimum percentage is invented in this proposal. The authoritative source/capture contract must freeze a completeness gate before outcomes.

Falsification:
- 0.5 breadth may still duplicate index trend;
- sector concentration can make broad counts economically misleading;
- equal-stock breadth can diverge from capital-weighted market conditions.

## Dimension C — Volatility direction context

Inputs:
- realizedVol5;
- realizedVol20;
- volRatio5to20.

Rule:
- VOL_EXPANDING if realizedVol5 > realizedVol20;
- VOL_CONTRACTING if realizedVol5 < realizedVol20;
- VOL_EQUAL if exactly equal;
- UNKNOWN if either volatility estimate is not PIT-ready.

This V0.1 research proposal does not create a tolerance band for VOL_NORMAL. Any epsilon band would be a new parameter/experiment and must be frozen before outcomes.

Falsification:
- short/long realized volatility is backward-looking;
- expansion can occur after the damaging move;
- high volatility can coexist with strong positive momentum;
- a binary direction label may add nothing beyond ATR/volatility factors already inside strategies.

## Dimension D — Liquidity/activity direction

Inputs:
- totalTradeValueVs20D, only after the 20 prior market snapshots are themselves frozen and valid.

Rule:
- ACTIVITY_EXPANDING if ratio > 1;
- ACTIVITY_CONTRACTING if ratio < 1;
- ACTIVITY_EQUAL if exactly 1;
- UNKNOWN until the required frozen history exists.

Semantics:
This is traded activity, not net capital inflow.

## Dimension E — Concentration

V0.1 stores raw:
- top10TradeValueShare;
- top20TradeValueShare;
- returnDispersion.

No HIGH/LOW concentration label is defined yet because no non-outcome-tuned reference distribution has been frozen.
Keep CONTEXT_RAW / UNKNOWN.

## Dimension F — Size leadership

No V0.1 label.

D18-06 remains blocked above L2 until market-cap source/vintage lineage is preserved prospectively. Trade value, price level and current reconstructed market cap are prohibited proxies.

## Dimension G — Institutional context

Store official market aggregates:
- foreignNet;
- trustNet;
- dealerNet.

No majority-vote BULLISH/BEARISH label.
Institutional flows remain descriptive context because motives and economic meaning differ.

## Dimension H — Global transmission

UNKNOWN until durable source receipts and Taiwan decision-clock alignment exist.

Do not relabel domestic weakness as GLOBAL_RISK_OFF.

## Regime vector

The research object is:

- trendContext;
- breadthContext;
- volatilityDirection;
- activityDirection;
- concentrationRaw;
- sizeLeadership = UNKNOWN;
- institutionalContextRaw;
- globalTransmission = UNKNOWN;
- overallEvidenceCompleteness.

No scalar total score is produced.

## Transition record

Store raw transitions as:
- prior official-session state;
- current state;
- prior marketDate;
- current marketDate;
- official-session continuity;
- transition = prior -> current.

No persistence/hysteresis rule is applied in V0.1.
A future 2-day/3-day confirmation rule would be a new policy experiment and cannot overwrite raw transitions.

## Complexity ladder

Research order:
1. Trend × strategy.
2. Breadth × strategy.
3. Volatility × strategy.
4. Activity × strategy.
5. Incremental pairwise interaction only after the single dimensions have enough independent-date evidence.
6. Composite risk state only if it adds OOS value beyond its components.
7. Latent HMM / Markov-switching challenger after observable-state baselines.

This prevents a combinatorial regime cube from being tuned on a small sample.

## Label-change governance

Before any outcome evidence:
- this proposal may be reviewed/revised as a new version.

After prospective outcomes begin:
- rule changes create a new regimeVersion / experiment epoch;
- old observations remain under the old version;
- no retroactive relabeling;
- state occupancy and UNKNOWN rates are reported for every version.

## Current conclusion

OBSERVABLE_REGIME_VECTOR_V0_1 = SPECIFIED / NOT_WIRED / NO_POLICY_IMPACT.

This file does not authorize a strategy gate or weight change.

## Next

1. Compare this proposal to the current System 2 source/capture fields for exact implementability.
2. If accepted in System 2 research engineering, wire only as immutable context capture first.
3. Accumulate prospective state occupancy before choosing a policy challenger.
4. Keep all Formal/System 1/System 2 strategy decisions unchanged until separate owner-approved promotion.
