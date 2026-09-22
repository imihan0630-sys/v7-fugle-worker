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

## User-raised falsification priority — 2026-09-22
New research question: the system may be under-deploying capital because selected candidates appear daily but formal BUY triggers are rare, and partial de-risking may lack a symmetric re-entry/add-back path after strength reasserts. This is a hypothesis, not a requested Formal Core change.

Required two-sided validation before any rule proposal:
1. **Selection bottleneck vs execution bottleneck**: measure daily SELECTED quality against same-date controls first. If SELECTED does not outperform controls, loosening entry is the wrong fix. If SELECTED does outperform but BUY trigger rate is low and non-triggered selected names subsequently outperform, execution gating becomes the prime suspect.
2. **No-BUY opportunity cost**: for SELECTED plans with no formal BUY, preserve D1/D3/D5/D10/D20 return/MFE/MAE and compare with BUY-triggered plans. Do not code no-BUY as zero return. Evaluate total-capital opportunity cost separately from conditional Execution Alpha.
3. **Capital utilization is diagnostic, not an optimization target**: track idle-cash share, buy-trigger rate, deployed-capital days, and total-capital return. Do not loosen rules merely to increase utilization; a high-quality strategy may rationally stay in cash.
4. **Trim / re-entry symmetry**: audit every partial reduce/sell recommendation, especially ABF holdings, with post-decision D1/D3/D5/D10 path. Test whether risk reduction avoided drawdown versus whether a later recovery/re-acceleration rule could have restored exposure. A subsequent rally alone does not prove the original trim was ex-ante wrong.
5. **State-machine hypothesis**: current behavior may be asymmetric if it has explicit de-risk triggers but weak or absent re-add triggers. Research a shadow-only state transition framework: FULL -> REDUCED -> RE-ADD_ELIGIBLE / HOLD_REDUCED / EXIT, with no production thresholds until evidence is sufficient.
6. **ABF case study**: use 3037/8046/3189 only as a falsification cohort, not a hand-tuned exception. Compare industry persistence, price path, overheat, drawdown avoided, and missed upside after trims. Do not optimize around the latest winner.
7. **One-change-at-a-time shadow tests**: if evidence points to execution scarcity, test entry-confirmation relaxation separately from selection changes. If evidence points to selection weakness, do not simultaneously alter entry rules. If evidence points to position management, keep selection/entry frozen while testing re-add logic.
8. Promotion gate: any proposed change must improve opportunity-cost-adjusted total-capital outcomes without materially worsening MAE, drawdown, false-break rate, transaction-cost stress, zero-pick behavior, or date/regime robustness. No Formal Core change without explicit human decision.

## Immediate capital-utilization / re-entry audit — 2026-09-22
Repository audit now identifies three concrete structural hypotheses behind the user's observed low entry frequency and asymmetric position management. These are **research findings, not production-change approval**.

### H1 — one-day plan validity can create execution scarcity
- After-market plans are built with `planDate = nextTradingDate(scanDate)`.
- `applyPlanValidity` suppresses BUY/ADD when `plan.planDate !== taiwanDate()`.
- Therefore every newly selected plan has only the immediately following trading day to satisfy the formal intraday entry pattern unless a later scan independently selects the same stock again into a new plan.
- This is a strong mechanical candidate for low BUY trigger frequency, especially when combined with strict 15-minute confirmation.
- Reverse case: one-day validity protects against stale setups and prevents a once-good candidate from remaining indefinitely actionable. Extending validity without revalidation could worsen chasing and stale-entry risk.
- Required test: compare same stock/day SELECTED plans that did not trigger BUY but remained technically valid/strong over D1-D3 versus plans that became invalid. Do not simply lengthen the validity window.

### H2 — entry logic is a conjunction of already-filtered setup + intraday reconfirmation
Daily selection already requires:
- A: trend + 2-15% pullback + within 4% of support + volume contraction/no sell-volume + structure intact + not late stage.
- B: trend + close >= priorHigh20*1.002 + daily volume >=1.3x prev5 + close-position >=65% + upper-shadow <=35% + not-late.
Then intraday execution requires a second, stricter sequence:
- A formal BUY only after the prior 15m bar entered the buy zone, held it, volume ratio <=0.9, reversal/strong close, followed by a current bar with higher low and bullish turn-up.
- B formal BUY requires an already confirmed breakout bar (close >= breakout*1.003, volume ratio >=1.3, strong close, upper shadow <45%), then a later retest touching the buy zone, holding >=breakout*0.997, retest volume <=1.1, bullish reversal/strong close, no long upper shadow.
- B also refuses entries above `maxChase`; A explicitly refuses to chase when price remains above the buy zone.
This is a plausible **double-filter / setup-then-perfect-entry** bottleneck.
Reverse case: the second gate may be exactly what prevents late/failed breakouts. Low frequency alone is not evidence it is wrong.
Required test: classify no-BUY plans by failed intraday clause (never touched zone / touched but no volume contraction / no reversal / price ran away above zone / stale planDate / freshness issue) and compare later D1/D3/D5 outcomes. Only the clauses whose failed cases still perform well are candidates for relaxation.

### H3 — partial-reduction state is not represented
- `normalizePositionStage` recognizes only NONE, FIRST and FULL.
- `REDUCE` emits a recommendation but there is no REDUCED/PARTIAL state transition in the formal state model.
- `ADD` is only generated when `positionStage === "FIRST"`.
- A FULL position that is partially reduced therefore has no native formal path `FULL -> REDUCED -> RE-ADD`; unless external/manual plan data is deliberately rewritten to FIRST, the existing code cannot express a symmetric add-back state.
- `actualShares` is an imported field used to size REDUCE/SELL; signal emission itself does not mutate holdings or positionStage.
This strongly supports the user's concern that de-risk logic can be asymmetric.
Reverse case: automatic re-adding after every partial trim can create churn and buybacks into failed rebounds. A missing state does not prove add-back should be easy.
Required test: audit every REDUCE event with post-event D1/D3/D5/D10 MFE/MAE and compare (a) drawdown avoided, (b) upside missed, and (c) whether a pre-specified recovery pattern would have re-entered before most of the recovery without materially increasing whipsaw.

### No-BUY opportunity-cost data feasibility
Existing data are sufficient for a research-only diagnostic without inventing history:
- `v8_trade_journal_plans` stores plan identity, formal close, buy band, allocation ratio, total allocation, first/second/total shares.
- `v8_trade_journal_signals` stores first formal BUY plus ADD/REDUCE/SELL/STOP_LOSS event data.
- Shadow counterfactual infrastructure already stores SELECTED outcomes with D1/D3/D5/D10/D20 return, MFE and MAE from PIT scan-date baseline.
- Existing R02 Execution Alpha only analyzes BUY-triggered plans and explicitly excludes no-BUY plans rather than coding them as zero.
Therefore a join by `scan_date|symbol` can split SELECTED plans into BUY-triggered vs no-BUY and compare future paths without changing formal logic.

### Important estimand constraint
Do **not** call the future no-BUY comparison "missed profit" by default. A non-triggered plan that rises may have never offered a feasible fill under the intended rule. Required decomposition:
1. selection opportunity path from scan close,
2. whether the planned buy zone was ever tradable/touched,
3. whether formal confirmation was absent,
4. hypothetical relaxed-rule fill only under a preregistered alternative,
5. transaction cost / slippage and MAE.
This prevents hindsight from treating every later winner as a missed executable trade.

### Engineering classification
- Current finding is source audit / research design only: no production change.
- Adding a research-only offline diagnostic over existing journal + Shadow tables can be Class A if isolated from runtime/formal outputs.
- Changing plan validity, A/B intraday confirmation, positionStage states, ADD eligibility or REDUCE behavior is Class C Formal Core / trading behavior and requires explicit human decision after evidence.

## Exact next continuation point
1. Re-read latest checkpoint/main and re-check SHA.
2. Audit frame10/frame15 timestamp provenance: `researchBarTiming` derives bar end by adding timeframe to `frame.latest.time`; verify whether `buildBar.time` comes directly from Fugle candle `bar.date`, and distinguish calculated completion time from source-observed freshness. Record failure modes around delayed candle publication and cached prior frames.
3. Search for a safe public/read-only route, workflow artifact, or log that can establish actual execution-shadow-v2 storage coverage without ADMIN_TOKEN. If none exists, keep D1 coverage UNKNOWN; do not infer storage from elapsed stage time.
4. Continue falsification on persistence/attention/industry overlap; no new factors.
5. Audit no-BUY opportunity-cost data feasibility: intended quantity/capital, selected-plan identity, BUY trigger, future path availability; do not define/optimize a metric yet.
6. Explore PIT-valid monthly-revenue announcement history only if first-known timestamps/source vintage can be proven; current snapshot must not masquerade as historical vintage.
7. Formal Core remains LOCKED. Do not alter formal freshness semantics. No Class B/C production change without explicit human decision.