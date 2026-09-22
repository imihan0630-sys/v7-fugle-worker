# Research Checkpoint

Checkpoint sequence: B-2 after main `b46c9cbc4ca6a65986e2a147f6197263dba651c0`.

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

## Execution timestamp provenance / stale-data risk
Repository `scripts/apply_v8_8_0.py` computes `lastTradeAt` from `result.quote.lastUpdated`. V8.8.1 keeps `lastUpdated` but does not pass through Fugle `lastTrade.time`, `closeTime`, or `total.time` into the research payload. Official Fugle quote semantics distinguish quote update, last trade, close-price transaction, and cumulative-statistics timestamps. Existing v2 `lastTradeAt` must therefore be interpreted as quote-update provenance, not proven trade time.

### New B-2 source-path audit
Main source recovery confirms the raw `fetchQuote(symbol, env)` returns the full Fugle JSON, so `lastTrade`, `closeTime` and `total` are available at the raw quote boundary and are discarded only when `analyzeStockSmart` constructs its reduced `result.quote` object. The reduced object is shared with formal signal processing: `applyPlanValidity(..., quote)` and `processSignalStateCore` read `result.quote.isTrial`, while `executionDataStatus` separately consumes the raw quote before reduction.

Engineering classification consequence:
1. Adding fields to the reduced `result.quote` object is logically research-only data passthrough, but it modifies a shared runtime object that formal signal code also reads. Under `RESEARCH_ENGINEERING_GOVERNANCE.md`, this is **Class B shared-runtime / indirect formal-risk**, not clean Class A.
2. Therefore B does **not** modify/merge/deploy production code. A safe proposal can be prepared later, but promotion requires explicit owner review unless redesigned into a truly isolated research-only path.
3. A cleaner design candidate is to build a separate `researchQuoteProvenance` object directly from raw quote inside `analyzeStockSmart` and pass it only to the research recorder; however this still touches the shared runtime function/hook, so it must be branch-tested and treated Class B until protected formal-output invariance is demonstrated and owner approves production promotion.
4. Do not rename or rewrite historical execution-shadow-v2 rows. Any corrected future payload must be a new schema/version so pre-correction provenance remains distinguishable.
5. Formal quote freshness currently uses `lastUpdated ?? closeTime` in `executionDataStatus`. This is existing formal behavior and is explicitly outside the research correction scope; changing it would affect formal signal eligibility and is Class C unless separately researched/approved.

PIT/freshness implications remain:
- `observedAt` proves recorder wall-clock observation only.
- quote-update freshness does not prove a new trade occurred.
- Future research should distinguish `quoteUpdatedAt`, true `lastTradeAt`, and `statsUpdatedAt`; current v2 remains conservatively interpreted.

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
- Source-path audit completed. No production code/branch/deployment/formal behavior changed.
- Timestamp provenance correction is classified Class B because the proposed passthrough would touch a shared runtime result object/function used by formal signal code. No autonomous production change allowed.
- Material new finding: raw Fugle quote retains the needed timestamps until `analyzeStockSmart`; the loss occurs at the reduced `result.quote` mapping, not at `fetchQuote`.

## Exact next continuation point
1. Re-read latest checkpoint/main and re-check SHA.
2. Audit frame10/frame15 timestamp provenance: `researchBarTiming` derives bar end by adding timeframe to `frame.latest.time`; verify whether `buildBar.time` comes directly from Fugle candle `bar.date`, and distinguish calculated completion time from source-observed freshness. Record failure modes around delayed candle publication and cached prior frames.
3. Search for a safe public/read-only route, workflow artifact, or log that can establish actual execution-shadow-v2 storage coverage without ADMIN_TOKEN. If none exists, keep D1 coverage UNKNOWN; do not infer storage from elapsed stage time.
4. Continue falsification on persistence/attention/industry overlap; no new factors.
5. Audit no-BUY opportunity-cost data feasibility: intended quantity/capital, selected-plan identity, BUY trigger, future path availability; do not define/optimize a metric yet.
6. Explore PIT-valid monthly-revenue announcement history only if first-known timestamps/source vintage can be proven; current snapshot must not masquerade as historical vintage.
7. Formal Core remains LOCKED. Do not alter formal freshness semantics. No Class B/C production change without explicit human decision.