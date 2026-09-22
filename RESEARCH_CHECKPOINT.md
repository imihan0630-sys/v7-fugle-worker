# Research Checkpoint

Checkpoint sequence: A-2 after main `dcfb7c2206b2bb8aff6c3763b9daf6edbecc943f`.

## Continuity / baseline
- Formal Core: **LOCKED**. Production Worker `fugle-test`; actual Production readback overrides chat/version memory.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow. Missing evidence remains UNKNOWN, never BAD/0.
- R01-R08 and I01-I07 remain frozen; no R09/I08. A/B schedules share this file as canonical cursor and must re-read/re-check SHA before writes.
- V8.8.1 production research infrastructure was previously verified as `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`, V8.8.0 rollback baseline. No formal selection/ranking/Top6/3+3/capital/trading/monitoring/push behavior changed.

## Frozen research / maturity
- R01 breakout hold/fail; R02 Selection vs Execution Alpha; R03 industry persistence; R04 Residual RS; R05 overnight/intraday; R06 regime transition; R07 Quiet vs Attention; R08 Two-Engine Momentum.
- I01-I07 frozen. I03/I04 partly nested because breakoutQualityResearch already contains 25% volume/attention.
- Promotion review remains prospective/OOS only: >=60 D5 mature, >=30 prospective full snapshots, >=15 independent scan dates, >=2 years, >=2 regimes, purged training >=10 dates, holdout >=5 dates, direction consistency plus coverage/zero-pick/redundancy/cost/overfit/date-cluster checks. Passing never auto-promotes.
- Same-date stocks are clustered observations. Selection Alpha is descriptive same-date cohort difference, not causal alpha or portfolio P&L. Control presence does not prove covariate balance; inspect price/liquidity/sector/residual-RS/volatility balance when mature.

## Recovered formula provenance
- `positiveDayRatio20`: positive close-to-close fraction over up to latest 20 returns through scanDate.
- `persistenceScoreResearch = .35*positiveDayRatio20 + .25*positiveHorizonPct + .20*ddQuality + .20*maQuality`, gated by >=3 finite components; composite, not primitive.
- `breakoutQualityResearch = clamp(closePosition*35 + (1-upperShadow)*25 + clamp(volVs5/2)*25 + clamp((breakoutPct+1)/4)*15,0,100)`.
- `overheatPenaltyResearch = clamp(max(0,ret20-20)*1.6 + max(0,maDistance20Pct-12)*2.2 + max(0,ATR%-6)*5 + max(0,abs(gapPct)-4)*4,0,100)`.
- `compressionScoreResearch = clamp(100-(range10/range20)*40-(range5/range20)*60,0,100)`; geometric compression, not bullish direction.

## R06 construct-validity constraint
Exact research classifier from repository: BULL_BROAD marketReturn20>=3% & breadth>=55%; BEAR_BROAD <=-3% & <=45%; INDEX_STRONG_BREADTH_WEAK return>=0 & breadth<45%; BREADTH_RECOVERY return<0 & breadth>=55%; otherwise MIXED. Literature supports state-dependence directionally but not these exact thresholds. MIXED is heterogeneous and hard boundaries are unstable near cutoffs. Do not retune after outcomes; any alternative must be a newly preregistered construct.

## Fugle avgPrice semantics
Official Fugle stock intraday quote docs define `avgPrice` as 當日成交均價. At FIRST_10M/15M/30M, `sessionAvgPrice` / `sessionVwapProxy` is cumulative/session-to-observation-time, not interval VWAP. Keep semantic label `FUGLE_INTRADAY_QUOTE_AVG_PRICE`; do not claim independently reconstructed VWAP without value/volume reconstruction.

## New A-2 audit — execution timestamp provenance / stale-data risk
Repository `scripts/apply_v8_8_0.py` currently computes:
`const lastTradeAt=researchIsoFromQuoteTimestamp(result?.quote?.lastUpdated);`
and stores that value as payload `lastTradeAt`. V8.8.1 passthrough retains `lastUpdated` but does not pass through Fugle `lastTrade.time` or `closeTime`.

Official Fugle stock `GET /intraday/quote/{symbol}` documentation distinguishes these fields:
- `lastUpdated`: 最後更新時間 (quote's last update time),
- `lastTrade.time`: 最後一筆成交時間,
- `closeTime`: last/close-price transaction time,
- `total.time`: cumulative statistics timestamp.
The docs also expose `lastTrade` independently from book updates and trial state. Therefore `lastUpdated` is **not semantically proven to be a trade timestamp**. Naming the transformed `lastUpdated` value `lastTradeAt` overstates provenance and can hide stale-trade vs fresh-book differences.

PIT/freshness implications:
1. `observedAt` proves recorder wall-clock observation only; it does not prove quote trade freshness.
2. A fresh `lastUpdated` may reflect a quote/book update rather than a new trade; execution-price freshness must not be inferred from it alone.
3. Future research coverage should distinguish `quoteUpdatedAt` from true `lastTradeAt` and, if captured, `statsUpdatedAt` (`total.time`).
4. Existing prospective v2 rows must be interpreted conservatively: current payload `lastTradeAt` is actually quote-update provenance until schema/code is versioned. Do not rewrite historical rows or pretend corrected provenance existed earlier.
5. This is a research-data-quality issue, not evidence that formal monitoring is wrong. Formal Core remains untouched.

Engineering classification: a future isolated correction that only adds/renames research snapshot provenance fields can be Class A if formal quote freshness/monitoring semantics are not touched. Before implementation, freeze protected formal outputs and regression-test invariants. Do not change shared quote freshness logic as part of that patch.

## First-live-session / coverage constraints
- Recorder windows: OPEN_BASELINE 09:00-09:02; FIRST_10M 09:11-09:12; FIRST_15M 09:16-09:17; FIRST_30M 09:31-09:32. OPEN_BASELINE is early post-open, not pure auction snapshot.
- Protected recorder API requires admin authorization. Do not request/expose ADMIN_TOKEN while other research remains. Without safe read evidence, D1 coverage is UNKNOWN; stage time does not prove storage.
- No directional Execution Alpha inference from one date. Cost stress 30/60/100bps omits missed/no-BUY opportunity cost.

## Taiwan evidence / falsification convergence
- Taiwan momentum is state/horizon dependent. Evidence supports persistence-conditioned momentum, intraday continuation vs overnight reversal, and market-state dependence, while other Taiwan evidence shows momentum-gap failure under local price-limit structure. This argues against a universal attention/turnover or generic momentum rule.
- Do not add turnover, 52-week-high, analyst, accrual, spread-normalization, squeeze, R09 or I08 factors now. Institutional flow remains context until incremental evidence survives momentum/liquidity controls.

## Bias / data-quality firewall
UNKNOWN stays UNKNOWN; no historical execution-shadow backfill; independent scan date is primary evidence unit; no causal claims from contemporaneous correlation; no outcome-driven threshold/window retuning; watch selection bias, look-ahead, data snooping, market-source bias, Factor Zoo, overfit, coverage, zero-pick, costs and date clustering.

## Engineering status this handoff
- Class A documentation/provenance audit only. No production code/branch/deployment/formal behavior changed this run.
- New material finding: current research payload misnames quote `lastUpdated` as `lastTradeAt`; treat existing field as quote-update provenance until a separately versioned research-only correction is implemented and validated.

## Exact next continuation point
1. Re-read latest checkpoint/main and re-check SHA.
2. Inspect the formal quote-fetch mapping to confirm whether Fugle `lastTrade`, `closeTime`, `total.time` are currently discarded before `result.quote`; determine the smallest isolated Class A passthrough/schema-v3 correction that adds `quoteUpdatedAt`, true `lastTradeAt`, and optionally `statsUpdatedAt` without changing formal freshness logic.
3. Before any code write, compare protected formal outputs and classify shared-runtime risk. If isolation is not clean, downgrade to Class B proposal only.
4. If safe access exists, quantify actual execution-shadow-v2 field coverage by event/date and UNKNOWN reasons; otherwise keep storage coverage UNKNOWN.
5. Audit frame10/frame15 barStart/barEnd freshness against observedAt; bar completion timestamp is not automatically source freshness.
6. Continue falsification on persistence/attention/industry overlap; no new factors.
7. Audit no-BUY opportunity-cost data feasibility without defining a metric yet; explore PIT-valid monthly-revenue announcement history only if timestamps are safe.
8. Formal Core remains LOCKED; no B/C production change without explicit human decision.
