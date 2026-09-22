# Research Checkpoint

Checkpoint sequence: B-4 after main `82bbd564d74581182c14f35f11b6276fa299be04`.

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

### Source-path audit
Main source recovery confirms the raw `fetchQuote(symbol, env)` returns the full Fugle JSON, so `lastTrade`, `closeTime` and `total` are available at the raw quote boundary and are discarded only when `analyzeStockSmart` constructs its reduced `result.quote` object. Adding timestamp fields to that shared reduced object is Class B shared-runtime risk. Do not modify/merge/deploy without owner review. Historical execution-shadow-v2 rows must not be renamed/reinterpreted as true trade timestamps.

## NEW A-3 — frame10/frame15 candle timestamp provenance audit (2026-09-22 11:42 Taipei)
Research question: does `researchBarTiming` carry a source-observed candle freshness timestamp, or only derive a theoretical bar completion time?

### Source evidence
1. `fetchCandles(symbol,tf,env)` returns Fugle intraday candle JSON unchanged.
2. `analyzeFrame(raw,tf,nowMs)` parses each source candle's `bar.date` as the bar start, sorts by it, and declares a bar completed when local `nowMs >= Date.parse(bar.date)+tf*60000` and the bar date is today.
3. `buildBar` copies `bar.date` directly to `frame.latest.time`; it does not create a separate source publication/update timestamp.
4. `researchBarTiming(frame,tf)` then parses `frame.latest.time` and computes `barEndAt = barStartAt + tf minutes`.

### Interpretation / falsification
- `frame.latest.time` has direct source provenance as the Fugle candle's **bar start timestamp**.
- `barEndAt` is **calculated schedule geometry**, not a source-observed publication timestamp and not proof that Fugle published/updated the completed candle exactly at that instant.
- `formal15Fresh` / `auxiliary10Fresh` currently test calculated bar end recency plus quote freshness. They establish that the latest returned bar is a recent bar whose theoretical interval has ended; they do **not** measure candle publication latency.
- Failure mode: if Fugle returns/caches a prior completed bar after the newest interval should have completed, freshness eventually fails because the calculated end becomes old; however within the allowed recency window a delayed/cached prior frame can still be classified fresh.
- Failure mode: a newly completed bar may appear after its theoretical end; `barEndAt` will still equal theoretical interval end, so `observedAt-barEndAt` conflates normal scheduling delay, API publication delay, network delay and recorder timing.
- Failure mode: `nowMs >= end` protects against using a source candle whose interval has not theoretically completed, but there is no source-side candle `updatedAt`/publication timestamp in the reduced frame to independently prove finalization freshness.

### Data-quality consequence
For execution-shadow interpretation, distinguish:
- `barStartAt`: source candle interval start (`bar.date`),
- `barEndAt`: locally derived theoretical completion,
- `observedAt`: recorder wall-clock observation,
- `candlePublishedAt`: **UNKNOWN / not captured**.
Do not label `barEndAt` as observed freshness or publication time. Do not infer exact 10m/15m data latency from it.

### Bias / redundancy checks
- This is provenance clarification only; no new factor/threshold/window and no outcome inspection, so no added Factor Zoo/data-snooping burden.
- UNKNOWN remains UNKNOWN: absent candle publication timestamp is not BAD/0.
- No look-ahead introduced; completed-bar filtering remains unchanged.
- No formal behavior, selection, monitoring, signal or push semantics changed.

### Engineering classification/status
- Documentation/source audit only; no runtime code change. Class A research finding, zero production impact.
- No branch/deployment/tests required because executable code is unchanged. Formal Core invariants unchanged by construction.

## Capital-utilization / re-entry falsification track (retained)
- Selection bottleneck vs execution bottleneck must be separated before any relaxation.
- No-BUY future winners are not automatically "missed profit"; first establish whether a feasible fill existed.
- Idle cash decomposes into intentional policy reserve, untriggered first tranche, reserved/unconfirmed second tranche, and position-state reconciliation limitations.
- `normalizePositionStage` has NONE/FIRST/FULL only; there is no semantic REDUCED/PARTIAL state. `/api/positions` reconciles confirmed execution manually/authorized and must not infer fills from alerts.
- Existing primary journal win rate is first BUY -> first SELL/STOP and cannot answer staged-capital utilization or REDUCE/re-add quality.
- Live 2026-09-22 3006 BUY is a counterexample to "execution never triggers" and also confirms one-stock first tranche uses only about 21% of total capital under current sizing.
- Historical `diagnostics_json` contains rich selection-funnel counts but is not safely publicly exposed; do not guess historical bottlenecks from anecdotes.
- A-line has an effective extra quality gate; B target/RR logic can reject clean new-high breakouts with no verifiable overhead resistance. These remain falsification hypotheses, not relaxation proposals.
- Current REJECTED_AFTER_BASE Shadow sampling is capped/sorted and is not representative for reason-specific gate attribution; do not estimate gate opportunity cost from it as if exhaustive.

## Manual continuation — 8046 trim/re-entry case and radar asymmetry (2026-09-22)

### 8046 南電 case study: trim was defensible ex ante; the unresolved issue is re-add logic
User-confirmed action context from the prior decision record: 2026-09-04 the user sold 100 shares of 8046 after a prior-day limit-down and continued weakness, while retaining 100 shares.

Contemporaneous market evidence was genuinely two-sided:
- Risk side: 2026-09-03 南電 closed limit-down at 1,080 on BT-price expectations, high-level repricing and heavy institutional selling; 2026-09-04 early trading extended weakness toward ~1,020 while the market also priced Broadcom/TOPPAN supply-chain/order-share risk.
- Fundamental counter-side: the same 2026-09-03 reporting still described ABF pricing as firm/tight and AI-driven ABF demand as structurally strong. Therefore the information set did **not** support an all-or-nothing bearish conclusion.

Ex-post price path from the 2026-09-04 reduction:
- Approximate sale reference ~1,020; same-day/post-sale low was ~1,010, so downside avoided on the sold half was only about 1% relative to that reference before the later recovery.
- 2026-09-22 intraday reached/locked 1,165 (+9.91% on the day). From 1,020 this is about +14.2% missed upside on the sold half.
- Using 2026-09-04 close 1,055 as a non-execution baseline, the subsequent low 1,015 was about -3.8% and 1,165 is about +10.4%.

These ex-post numbers are **not** proof the trim was wrong. The trim occurred under a real tail-risk/repricing shock; hindsight must not use the later limit-up as if it were known on 9/4.

### Simple re-add rules do not pass the reverse test
Several obvious hindsight re-add anchors would have suffered meaningful interim drawdown before 9/22:
- Re-add at 9/4 close 1,055: later low 1,015 ≈ -3.8% MAE; 9/22 1,165 ≈ +10.4%.
- Re-add after 9/9 strong rebound close 1,110: later low 1,025 ≈ -7.7% MAE; 9/22 1,165 ≈ +5.0%.
- Re-add after 9/16 close 1,105: later low 1,050 ≈ -5.0% MAE; 9/22 ≈ +5.4%.
- Re-add after 9/18 close 1,100: 9/21 low 1,050 ≈ -4.5% MAE; 9/22 ≈ +5.9%.

Therefore “跌深反彈/重新站回某價就加回” is not validated by this case; it would have created nontrivial whipsaw. The case supports **researching** a REDUCED→RE-ADD state, but does not yet support any specific threshold or automatic add-back rule.

### Separate architecture: assistant/radar ABF logic is also asymmetric
Current active automations were audited separately from the formal Worker:
- Fast global-holdings radar prompts explicitly preserve an **ABF sell/reduce alert** path.
- The active 12:50 bidirectional scan includes general holdings add/reduce/take-profit/stop-loss checks.
- None of the active prompts defines a specific ABF post-trim state, a REDUCED state, or an evidence-based “risk resolved → restore exposure” transition.

This is distinct from the Worker state-machine gap. It can explain why the user may repeatedly receive “續抱/不再減碼” after a partial ABF trim without an equally explicit framework for restoring the sold portion.

Reverse qualification:
- Adding an ABF-specific re-entry rule just because 8046 later hit limit-up would overfit one recent winner.
- Any recommendation-layer change affects trading guidance and is therefore treated as Class C decision logic, not an autonomous prompt edit.

### Case-level conclusion
- **Partial trim decision:** not proven wrong ex ante; contemporaneous downside evidence was real and fundamentals were mixed rather than broken.
- **Post-trim management:** current architecture lacks a symmetric, testable REDUCED→RE-ADD state both in formal Worker semantics and in ABF-specific radar guidance.
- **Evidence for a particular re-add trigger:** not yet sufficient. Simple price-reclaim anchors show 3.8–7.7% interim MAE in this one case.
- **Research priority:** build prospective position-management evidence across many REDUCE events/holdings, not tune around 8046.

## Manual continuation — coverage boundary and no-BUY join audit (2026-09-22)

### Actual execution-shadow-v2 storage coverage remains UNKNOWN from safe public reads
Read-only production audit found:
- Public monitor root returns live monitor state, current plan, bars, quote, finalDecision and cron SUCCESS.
- It does **not** expose the `executionResearchRecorder` write result because V8.8.0 stores the public KV summary before the research recorder runs; the recorder result is only returned from that monitor invocation and is not persisted into the public KV payload.
- `/api/research/execution-recorder?days=5` returns 401 without admin authorization.
- `/api/journal?days=60` also returns 401; no alternate public performance endpoint was found.
Therefore elapsed stage time, cron success and presence of a live BUY must **not** be treated as proof that D1 execution-shadow rows were stored. Keep D1 recorder coverage UNKNOWN until an authorized/safe read exists.

This is a useful firewall result: do not solve evidence scarcity by requesting/exposing ADMIN_TOKEN while other research can continue.

### No-BUY opportunity-cost join is structurally feasible
The production schema confirms a stable PIT identity and the exact available fields.

`v8_trade_journal_plans`, key `(scan_date,symbol)`, stores:
- `plan_date`, strategy, signal level,
- formal close / buyLow / buyHigh / breakout / maxChase / stop,
- allocation ratio / total allocation,
- firstShares / secondShares / totalShares,
- reward-risk and selected reason.

`v8_trade_journal_signals` stores:
- `plan_scan_date`, `plan_date`, trade date, occurred_at,
- symbol, signal type, position stage,
- market price, signal amount, signal shares, reason/instruction.
There is an index on `(plan_scan_date,symbol,occurred_at)`.

Existing Shadow outcomes use the same scan-date + symbol identity and already provide forward D1/D3/D5/D10/D20 return/MFE/MAE from the scan-date baseline.

Thus the research join can safely classify:
- SELECTED + first formal BUY observed,
- SELECTED + no formal BUY observed,
without coding no-BUY as zero.

### What the current data still cannot prove
A no-BUY plan with positive future return is not automatically an executable missed trade. The existing plan/signal tables do **not** by themselves preserve every minute/bar-level reason why entry failed over the plan day.

A valid decomposition must therefore keep separate:
1. scan-date selection path,
2. plan allocation at risk,
3. formal BUY conversion,
4. whether price entered/touched the planned zone,
5. whether confirmation clauses failed,
6. future path / MAE,
7. any hypothetical alternative fill only if a future alternative rule is preregistered.

Items 4-5 require either existing execution-shadow/bar evidence when coverage is available or future clause-level prospective instrumentation. Do not infer them from daily OHLC after the fact.

### Estimand warning
The current `journalTradeStats` already reports `buyTriggerRate = buyTriggeredPlans / selectedPlans`. That is the correct first diagnostic for conversion scarcity, but it is not capital utilization and not opportunity-cost-adjusted return.
No single new score is defined here; field feasibility only.

## Manual continuation — ABF sector repricing falsification (2026-09-22)

Today's move is not an 8046-only anomaly:
- 8046 南電 reached 1,165, +9.91%.
- 3037 欣興 reached 1,120, +9.80%.
- 3189 景碩 was around 901, +8.95% in the same morning.
This is a broad ABF/IC-substrate repricing day rather than a single-stock idiosyncratic rebound.

Implication for the 8046 post-trim question:
- A re-add framework based only on 8046 reclaiming one price level would ignore sector information and would have been vulnerable to the whipsaws already observed between 9/4 and 9/21.
- If a future REDUCED→RE-ADD hypothesis is researched, existing R03 industry persistence and R06 regime transition should be used as **conditioning/falsification controls**, not as new votes to stack.
- A sector-wide recovery/repricing event may be more informative than a one-stock bounce, but one 2026-09-22 sector surge is insufficient to define a threshold.

Reverse case:
- Sector-wide strength can itself be an attention/late-stage shock and can reverse, especially in Taiwan where momentum is state-dependent.
- Therefore today's broad ABF surge supports investigating sector-confirmed re-entry, but it does not validate “ABF strong day = buy back.”

No ABF-specific formal rule or automation prompt is changed.

## Manual continuation — intraday clock gate audit (2026-09-22)

A source-level timing audit found a strong mechanical constraint that can reduce formal entry frequency even when a daily candidate is valid.

### Formal A/B BUY is structurally impossible before about 10:45 Taipei
`buildBar` computes intraday `volumeRatio` only when a bar has **five prior same-day bars**.
For 15-minute bars:
- 09:00, 09:15, 09:30, 09:45, 10:00 bars have `volumeRatio=null`.
- The first bar with a comparable five-bar volume baseline is the 10:15 bar, which completes at 10:30.

A-line:
- Formal BUY requires the **previous** complete 15m bar to have `volumeRatio<=0.9`, plus reversal/strong close, followed by a current higher-low/turn-up bar.
- At 10:30 the previous 10:00 bar still has no volume ratio.
- Earliest possible formal A BUY is therefore the 10:45 evaluation, using 10:15 as the setup bar and 10:30 as confirmation.

B-line:
- Confirmed breakout requires `volumeRatio>=1.3`, so the earliest possible confirmed 15m breakout bar is 10:15 (known at 10:30).
- The same bar cannot simultaneously be the formal retest because formal retest requires volume <=1.1; a later bar is required.
- Earliest possible formal B BUY is therefore also about 10:45.

This means the first ~105 minutes from the 09:00 open through the 10:45 decision are effectively **calibration / observation only** for formal BUY, despite the plan being valid for only one trading day.

### Positive interpretation
- Opening volume is structurally abnormal. Waiting until five same-day 15m bars exist avoids comparing a 09:00 opening-auction-heavy bar against an unstable baseline.
- The two-bar confirmation further avoids buying initial opening weakness; today's 3006 example illustrates this benefit.

### Reverse interpretation / scarcity risk
- Strong A recoveries or B breakouts that complete their best risk/reward entry before 10:45 can become too extended, miss the buy zone, or hit maxChase before formal eligibility starts.
- Because plan validity expires after the same next trading day, there is no later-day recovery of that missed opportunity unless the stock is independently reselected.
- This timing constraint can therefore interact multiplicatively with one-day validity and no-chase rules; it is not merely one extra condition.

### Important reverse check: B recent-bar memory is NOT the formal bug initially suspected
`analyzeFrame` keeps the last 12 bars. A 15m session through the final monitored completed bar has 17 completed bars; the last 12 begin at index 5, exactly the first bar whose five-bar volume ratio is valid (10:15).
Thus every 15m bar that could legally qualify as a volume-confirmed B breakout remains in `frame15.recent` through the final formal monitoring window. The 12-bar memory is therefore internally aligned with the volume-baseline design for formal B logic.
Do not misdiagnose the recent-array length as a late-day B memory bug.

### Required falsification before any timing change
Use prospective early-session Shadow data to compare:
1. candidates whose favorable path occurred before 10:45 but formal BUY could not yet occur,
2. candidates that remained in the zone and later confirmed,
3. candidates whose early move failed/reversed before 10:45.

If early would-be entries have materially worse MAE/false-break outcomes, the delay is protective. If favorable executable entries are repeatedly lost with no compensating risk reduction, then the timing/baseline design deserves a versioned alternative study.

No same-day volume baseline, entry time, plan validity, A/B trigger, or Formal Core rule is changed.

## Manual continuation — early-window Shadow observability gap (2026-09-22)

The newly identified 10:45 earliest-entry clock gate is **not fully testable with the current execution-shadow stage schedule**.

Current sparse events:
- OPEN_BASELINE ~09:00-09:02
- FIRST_10M_COMPLETE ~09:11-09:12
- FIRST_15M_COMPLETE ~09:16-09:17
- FIRST_30M_COMPLETE ~09:31-09:32
- FORMAL_SIGNAL_OBSERVED when a formal signal exists

But the formal A/B BUY clock cannot become eligible until ~10:45 because the first comparable 15m volume-ratio bar is 10:15 and a subsequent confirming/retest bar is required.

Therefore the critical interval **09:32–10:44** is unobserved by scheduled execution-shadow events for plans that never produce a formal signal. Current Shadow can show the opening state and eventual formal signals, but cannot reliably distinguish:
- early favorable move that became too extended before eligibility,
- early failed move that the delay correctly filtered,
- candidate that remained tradable into the formal window.

### Research-only instrumentation candidate
If/when recorder storage is verified, a zero-additional-market-call extension could add sparse research-only stages using the monitor result already computed:
- FIRST_60M_COMPLETE (~10:01)
- FIRST_90M_COMPLETE (~10:31)
- ENTRY_ELIGIBILITY_BASELINE (~10:46, after the first possible two-bar 15m decision)

These snapshots would preserve the actual 15m bar sequence around the hidden clock gate without changing entry logic, ranking, signals, push, capital or trading.

### Reverse / engineering constraint
- Do not add stages merely because the clock-gate hypothesis sounds plausible; first verify the current recorder is actually writing D1 rows.
- Extra D1 writes increase research storage and should remain sparse.
- Any implementation must remain fail-open and use already-fetched monitor results; no extra Fugle calls.
- This is a possible Class A research instrumentation change only after recorder-storage observability is established. No implementation performed in this turn.

## NEW B-4 — persistence / attention / industry-overlap redundancy audit (2026-09-22 12:15 Taipei)

### Frozen-definition audit
The experiment registry already creates an important anti-double-counting structure:
- R03 is a **sector-state** construct: adjacent formal research-date Top5 industry overlap, longest Top5 streak, and regime transitions.
- R04 is a **stock-within-sector** construct: `price.residualSectorRs20`, explicitly intended to separate stock strength from sector return.
- R07/R08 use `price.residualSectorRs20` as strength and `volume.volumeTodayVsPrev5` as the attention proxy, split by same-date cross-sectional medians.
Therefore R03 sector persistence and R07/R08 stock attention are not independent momentum votes by construction; they are different levels of the same broad momentum environment and must be conditioned jointly rather than stacked.

### Redundancy / alternative-mechanism falsification
Three alternative explanations must remain live when future results mature:
1. apparent R03 persistence alpha may simply be sector beta/industry continuation; R04 already preregisters the falsifier that Residual RS can fully explain it;
2. apparent R07/R08 attention alpha may be a by-product of breakout-quality volume because `breakoutQualityResearch` already allocates 25% to `volVs5`; this is an explicit redundancy risk, not independent confirmation;
3. a sector-wide repricing day can simultaneously raise industry persistence, residual strength for leaders and relative volume, producing correlated labels on the same scan date. Treating those labels as separate evidence would create pseudo-replication and Factor-Zoo inflation.

### Required mature-sample diagnostics — no new experiment
When prospective samples become sufficient, keep the existing frozen experiments and report conditional diagnostics rather than inventing thresholds:
- R03 outcome by sector-persistence state **within Residual-RS HIGH/LOW**;
- R07/R08 Quiet vs Attention comparison **within sector-persistence state**, where sample size permits;
- compare attention proxy against existing `breakoutQualityResearch`/volume component before claiming incremental information;
- retain scan date as the independent clustering unit and report whether any apparent effect disappears under leave-one-date-out checks.
If cells are sparse, mark UNKNOWN/ACCUMULATING; do not pool them merely to obtain significance.

### Bias / governance consequence
- No new factor, score, threshold, window, classification, or experiment ID is created; this is a falsification/redundancy plan for frozen R03/R04/R07/R08.
- Selection bias remains material because Shadow cohorts arise from the formal candidate funnel; cohort comparisons are descriptive unless balance is demonstrated.
- Date clustering is especially important because sector-wide attention shocks label many stocks simultaneously.
- Transaction costs remain downstream mandatory checks; high-attention continuation can look attractive gross while being worse after spread/slippage/chase costs.
- No outcome inspection was used to choose a winning subgroup. No look-ahead, historical Shadow fabrication, market-source substitution, or UNKNOWN coercion introduced.
- Engineering status: documentation-only Class A research progress; executable code and Formal Core unchanged.

## Bias / data-quality firewall
UNKNOWN stays UNKNOWN; no historical execution-shadow backfill; independent scan date is primary evidence unit; no causal claims from contemporaneous correlation; no outcome-driven threshold/window retuning; watch selection bias, look-ahead, data snooping, market-source bias, Factor Zoo, overfit, coverage, zero-pick, costs and date clustering.

## Engineering status this handoff
- A-3 candle timestamp provenance audit retained.
- B-4 redundancy/falsification audit completed and checkpointed.
- No production code/branch/deployment/formal behavior changed.
- R01-R08/I01-I07 unchanged; no R09/I08 created.
- Execution-shadow D1 storage coverage remains UNKNOWN without a safe authorized read.
- Timestamp correction to true quote trade time remains Class B if it touches shared runtime; no promotion performed.

## Exact next continuation point
1. Re-read latest checkpoint/main and re-check SHA before any write.
2. Continue from the frozen R03/R04/R07/R08 redundancy plan: inspect whether existing machine-readable diagnostics already expose the conditional fields needed for sector-persistence × residual-RS × attention analysis. Do not add a new experiment or threshold.
3. If fields are not already observable, classify any proposed instrumentation before coding; prefer isolated Class A research output and do not touch shared formal runtime paths.
4. Explore PIT-valid monthly-revenue announcement history only if first-known timestamps/source vintage can be proven; current snapshot must not masquerade as historical vintage.
5. Keep early-window Shadow instrumentation deferred until actual execution-shadow-v2 recorder storage is safely verified.
6. Formal Core remains LOCKED. No Class B/C production change without explicit human decision.