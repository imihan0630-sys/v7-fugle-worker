# Research Checkpoint

Checkpoint sequence: B-1 after `bc2702a8e85729ff11f0c8b7042fdcffa0a45a16`.

> Time note: prior checkpoint contained wall-clock labels ahead of actual Taipei time. This compact handoff intentionally uses a sequence label rather than inventing a new wall-clock timestamp. Git commit time is the durable ordering source.

## Continuity / baseline
- Formal Core: **LOCKED**.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback overrides remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- R01-R08 and I01-I07 remain frozen unless explicitly versioned; no R09 currently exists.
- A/B research schedules share this file as the canonical cursor. Each run must re-read latest main + this checkpoint and re-check SHA before writing; never overwrite a newer handoff.
- Ordinary findings/commits are continuation points, not stop boundaries. Human interruption only for genuine MFA/reauth/secret/permission, explicit Class B/C production decision, or true unresolved technical blocker.

## Current production research infrastructure
### V8.8.0 / V8.8.1 prospective execution Shadow
- V8.8.0 introduced sparse research-only execution snapshots: OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE, FORMAL_SIGNAL_OBSERVED.
- V8.8.1 production readback previously verified as `8.8.1-execution-coverage`; schema `execution-shadow-v2`.
- Fields from already-polled Fugle quote: openingGapPct, sessionAvgPrice / explicitly labeled VWAP proxy, best spread, five-level bid/ask depth, depthImbalance, conservative executionMarketState.
- Market state remains UNKNOWN when flags are insufficient; no claim of disposition/VI identification.
- V8.8.1 merge: `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- No A/B, ranking, Top6, 3+3, capital, entry/add/reduce/sell/stop, monitoring eligibility or push behavior change.

## Frozen research / readiness
- R01 successful vs failed breakout: priorHigh20, HELD_3D vs FAILED_CLOSE_WITHIN_3D.
- R02 Selection Alpha vs Execution Alpha: same-date cohort delta; Execution Alpha conditional on first real formal BUY. No-BUY is excluded from price-improvement distribution, not set to zero; buyTriggerRate is separate.
- R03 industry rotation/persistence.
- R04 Residual RS.
- R05 next-day Overnight vs Intraday decomposition.
- R06 Market Regime Transition.
- R07 Quiet Strength vs Attention Strength.
- R08 Two-Engine Momentum.
- I01-I07 remain frozen incremental contrasts. I03/I04 are partially nested because breakoutQualityResearch already contains 25% attention volume; attenuation is redundancy evidence, not clean causal isolation.
- Promotion review gate remains prospective/OOS only: >=60 D5 mature, >=30 prospective full snapshots, >=15 independent formal scan dates, >=2 years, >=2 regimes, purged training >=10 dates, holdout >=5 dates, direction consistency, coverage/zero-pick/redundancy/cost/overfit/date-cluster checks. Passing never auto-promotes Formal Core.

## Key formula provenance already recovered
- `positiveDayRatio20`: % positive close-to-close returns over up to latest 20 daily returns through scanDate.
- `persistenceScoreResearch = 0.35*positiveDayRatio20 + 0.25*positiveHorizonPct + 0.20*ddQuality + 0.20*maQuality`, gated by >=3 finite components. It is a composite, not a primitive.
- `breakoutQualityResearch = clamp(closePosition*35 + (1-upperShadow)*25 + clamp(volVs5/2)*25 + clamp((breakoutPct+1)/4)*15,0,100)`.
- `overheatPenaltyResearch = clamp(max(0,ret20-20)*1.6 + max(0,maDistance20Pct-12)*2.2 + max(0,ATR%-6)*5 + max(0,abs(gapPct)-4)*4,0,100)`.
- `compressionScoreResearch = clamp(100 - (range10/range20)*40 - (range5/range20)*60,0,100)`; geometric range compression, not directional volatility signal.
- Overheat thresholds are frozen research-design parameters, not proven Taiwan optima. Compression can be high in a downtrend and is not bullish by itself.

## Anti-bias / estimand constraints already established
- Same-day stocks are clustered observations; leave-one-scan-date-out diagnostics exist for I01-I07.
- Pairwise Pearson redundancy is only a coarse alarm; nonlinear redundancy can remain. Do not add post-hoc transforms before maturity.
- Shadow integrity checks archive presence, SELECTED-count agreement and BROAD_CONTROL presence, but control presence does not prove covariate balance.
- Future mature-sample Selection Alpha interpretation should inspect raw cohort balance in price, liquidity/turnover, sector, residual RS and volatility before causal language. Do not propensity-match now.
- Current Selection Alpha is an unweighted same-date descriptive cohort difference, not portfolio P&L or causal alpha.
- Cost stress 30/60/100 bps is scenario analysis only; it omits missed/no-BUY opportunity cost.

## Taiwan evidence convergence already established
- Momentum/attention/turnover are regime- and horizon-dependent; no universal `quiet better` or `high turnover better` rule.
- Market-state transitions can reverse momentum; industry persistence and residual stock strength must remain distinct.
- Monthly-revenue persistence is promising, but single spectacular prints plus large pre-event run-up can show next-day reversal while later drift remains positive. No PIT monthly-history experiment until announcement history provenance is safe.
- Analyst revision direction may be more useful than static forecast level if timestamped PIT consensus history becomes available; no 52-week-high clone due overlap/regime instability.
- Accrual/cash-flow quality is a future falsification/control candidate, not a bullish factor; older Taiwan accrual anomaly has structural-break/IFRS caveats.
- Institutional flow is confirmation/context until incremental evidence survives momentum/liquidity controls; price pressure and information are confounded.
- Attention/disposition status is endogenous and changes matching mechanics; when prospectively available it is a control/stratifier, not an alpha factor.
- Spread/depth are execution-state controls/descriptors; tick geometry matters, especially >=NT$1000 stocks. No spreadTicks implementation yet.

## New B-1 audit — R06 construct validity
Repository source `scripts/apply_v8_7_0.py` establishes the exact research market-regime classifier:
- `BULL_BROAD`: marketReturn20 >= +3% AND above-MA20 breadth >=55%.
- `BEAR_BROAD`: marketReturn20 <= -3% AND above-MA20 breadth <=45%.
- `INDEX_STRONG_BREADTH_WEAK`: marketReturn20 >=0 AND breadth <45%.
- `BREADTH_RECOVERY`: marketReturn20 <0 AND breadth >=55%.
- Otherwise `MIXED`; R06 transition analysis later excludes UNKNOWN but uses these research labels prospectively.

Reverse validation / construct warning:
1. Academic Taiwan market-state papers do **not** use these exact +3/-3 and 55/45 thresholds. Literature support is directional (state persistence/transition matters), not direct validation of this classifier.
2. The classifier mixes a 20-day index return with cross-sectional MA20 breadth. A label transition can therefore occur from either index movement or breadth crossing a hard boundary; it is not a pure latent-regime estimator.
3. `MIXED` is heterogeneous and can contain near-threshold bull/bear states plus genuinely neutral states. Do not interpret all MIXED->X transitions as equivalent economic shocks.
4. Hard boundaries create classification instability near +3/-3 or 45/55. Do not retune after outcomes. If later evidence justifies alternative thresholds/smoothing, version as a new preregistered research construct rather than rewriting R06 history.
5. R06 remains a falsification/conditioning dimension; no formal score or gate.

## New B-1 audit — Fugle avgPrice semantics
Official Fugle Developer Docs for `GET /intraday/quote/{symbol}` explicitly define `avgPrice` as **「當日成交均價」** and the same quote response exposes cumulative `total.tradeValue`, `total.tradeVolume`, `total.transaction` statistics. The migration guide maps legacy `quote.priceAvg.price` directly to v1 `avgPrice`.

Interpretation constraint:
- At FIRST_10M/FIRST_15M/FIRST_30M, `sessionAvgPrice` / `sessionVwapProxy` is a **session-to-observation-time daily average field**, not an interval-specific 10/15/30-minute VWAP.
- Keep the existing explicit proxy semantic label `FUGLE_INTRADAY_QUOTE_AVG_PRICE`; do not call it independently reconstructed VWAP.
- The docs confirm `avgPrice` is daily transaction average, but do not document the exact internal weighting formula in the field description. Therefore do not assert more than the official semantic without reconstructing from trades/aggregate value-volume.
- This is a semantics/provenance clarification only; no code change or Formal Core impact.

## First-live-session coverage constraint
- Recorder windows: OPEN_BASELINE 09:00-09:02; FIRST_10M 09:11-09:12; FIRST_15M 09:16-09:17; FIRST_30M 09:31-09:32.
- OPEN_BASELINE is early post-open, not a pure opening-auction book snapshot.
- Protected `/api/research/execution-recorder` / dashboard requires admin authorization. Do not request or expose ADMIN_TOKEN while other research remains.
- If safe public/read-only evidence cannot prove D1 rows, coverage remains UNKNOWN; never infer successful storage merely because the stage time passed.
- No directional Execution Alpha inference from one date.

## Bias / data-quality firewall
- UNKNOWN remains UNKNOWN; no BAD/0 coercion.
- No historical execution-shadow-v2 backfill.
- Independent scan date remains primary evidence unit.
- No causal claim from contemporaneous correlations.
- No outcome-driven threshold/window/holding-period retuning.
- No new factor, I08, R09, squeeze clone, 52-week-high clone, analyst factor, accrual factor, or spread normalization until provenance/maturity justifies preregistration.
- Turnover/volume can be attention proxy and conditioning variable; avoid double counting.
- Disposition/VI-specific state remains UNKNOWN unless reliable official PIT evidence distinguishes it.

## Engineering status this handoff
- Classification: research interpretation / provenance audit only (Class A documentation).
- No production code, branch, deployment, monitoring, push or Formal Core behavior changed.
- Durable ordering: this checkpoint commit supersedes the verbose prior checkpoint while preserving the current canonical state; detailed earlier evidence remains recoverable from Git history and prior research notes.

## Exact next continuation point
Priority 6 Execution Alpha remains **P2 research-readiness / coverage diagnostics**. Next A/B run must re-read latest checkpoint/main first, then:
1. If safe access exists, verify actual prospective execution-shadow-v2 storage and quantify field coverage by event type/independent date for openingGapPct, sessionAvgPrice, spreadPct, depthImbalance, executionMarketState plus UNKNOWN reasons. Do not score outcomes.
2. Audit quote `lastUpdated`, `lastTradeAt`, observedAt, frame10/frame15 barStart/barEnd semantics for stale-data/PIT contamination. A stage timestamp is not proof that underlying quote/bar was fresh.
3. Keep `sessionAvgPrice` cumulative/session-to-time; never interpret it as interval VWAP.
4. Use exact R06 classifier provenance above when conditioning later evidence, but treat literature mapping as directional only; watch threshold-boundary instability and MIXED heterogeneity.
5. Continue falsification research on persistence/attention/industry overlap rather than adding factors. Seek contradictory Taiwan evidence and market-structure breaks.
6. Audit future no-BUY opportunity-cost data feasibility (intended quantity/capital semantics and selected-plan path outcomes) without creating a metric until prospectively defined.
7. Explore PIT-valid monthly-revenue announcement-history capture only if source timestamps/history are safe; do not register an experiment yet.
8. Formal Core remains LOCKED. No B/C production change without explicit human decision.