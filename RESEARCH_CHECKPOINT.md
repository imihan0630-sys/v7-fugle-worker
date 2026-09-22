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

## Capital-utilization mechanics and state-continuity audit — 2026-09-22
Further source audit separates three different causes of "idle capital" and finds an additional state-continuity limitation.

### Planned cash reserve is substantial by design
`allocateAndBuildPlans` deliberately caps aggregate planned deployment before any intraday entry test:
- 1 selected stock: target deploy ratio 35%.
- 2 selected stocks: target deploy ratio 60%.
- 3+ selected stocks: target deploy ratio 85%.
- Each stock is capped at 35% of total capital, and excess weight above the cap is **not redistributed** to other selected stocks.
- Each stock is then split 60% first tranche / 40% second tranche.

Therefore, even if every first-tranche BUY triggers, initial deployed capital is at most approximately:
- 1 stock: 21% of total capital,
- 2 stocks: 36%,
- 3+ stocks: 51%.
Actual values can be lower when the 35% single-stock cap truncates a high-weight candidate without redistribution.

This means user-observed idle cash can come from at least three distinct layers:
1. intentional reserve caused by candidate-count / concentration policy,
2. second-tranche cash reserved for later ADD,
3. cash left unused because formal BUY never triggers.
These must be measured separately. "Buy-trigger rate" alone cannot explain total cash utilization.

Reverse case:
- Deliberate reserve reduces concentration and keeps dry powder on low-opportunity days.
- Raising deployment solely because cash feels idle can mechanically increase risk without improving selection/execution alpha.
- Any future capital-utilization proposal must compare total-capital return **and** drawdown/MAE/cost, not just invested percentage.

### ADD is even more constrained than the first audit suggested
Source audit shows:
- `processSignalStateCore` requires `planDateMatches` for BUY, ADD and EARLY_ALERT.
- ADD additionally requires a finite externally supplied `firstEntryConfirmedAt` and a later completed 15m bar than the prior entry-signal bar.
- Repository search finds `firstEntryConfirmedAt` parsed/read, but the BUY signal path does not mutate the plan to set it.
- Repository search likewise finds no automatic transition of the saved plan from NONE -> FIRST -> FULL after a signal.
This is correct from an execution-integrity perspective because a push/recommendation is not proof of a fill. But it means ADD cannot become reliable without confirmed execution-state reconciliation from the user/broker/external source.

Reverse implication:
- Do **not** "fix" this by treating a sent BUY alert as an executed trade. That would fabricate holdings.
- The architectural research question is confirmed-fill state synchronization, not automatic state mutation from recommendations.

### Profit-check precedence can suppress ADD
`buildFinalDecision` checks `profit.level === "profit"` before A/B BUY. Thus once price is already at/above the first profit-check level, the final decision is PROFIT_CHECK rather than BUY/ADD even if a fresh entry pattern also exists. This is conservative and avoids adding into the first profit-taking zone, but it can further reduce second-tranche deployment.

### Daily scan vs open-position continuity
`runAfterMarketScanCore` refuses to overwrite the monitored stock configuration if **any current configured stock has positionStage != NONE**:
`OPEN_POSITION_PROTECTED：仍有持倉，不得用新選股覆蓋實際持股及原停損計畫；需先完成持倉對帳`.
When no configured open position exists, `saveStockConfig` replaces the entire current stock list with the new daily list; new after-market plans are emitted with `positionStage:"NONE"`.
Consequences:
- Correctly reconciled open positions protect their risk plan, but they also block the automatic daily replacement path.
- If real broker holdings are not reconciled into the monitored configuration, the automatic scanner can continue generating fresh NONE-state plans, but those plans cannot be treated as authoritative holdings state.
- This exposes a separation between "daily candidate monitor" and "actual portfolio state" that matters for capital-utilization and re-add research.

### ABF case-study scope correction
Repository search finds no hard-coded 3037/8046/3189/ABF-specific rule in the formal Worker. The user's 南電 partial-reduction example may therefore originate from a separate holdings/radar judgment path rather than the formal V7 `REDUCE` state machine. Do not claim the formal REDUCE implementation caused that exact historical decision without event evidence.
Use the ABF names as case studies only after the actual recommendation timestamp/context is recovered; keep formal-monitor architecture and assistant/radar discretionary guidance analytically separate.

### Immediate research consequence
Before changing selection/entry rules, decompose observed idle cash into:
A. policy reserve,
B. untriggered first-tranche capital,
C. reserved second-tranche capital,
D. state-reconciliation failures that prevent ADD/re-add.
Only B supports a pure "entry gate too strict" hypothesis. C/D can instead be position-state architecture problems.


## Position reconciliation and performance-metric blind spot — 2026-09-22
Patch-chain audit (V8.1.2 + V8.5.0/V8.6.0) refines the state diagnosis.

### Confirmed execution-state reconciliation exists, but remains manual/authorized
V8.1.2 provides `/api/positions` specifically to reconcile real execution state. It may update only:
- `positionStage`,
- `actualShares`,
- `averageCost`,
- `firstEntryConfirmedAt`,
for symbols already in the current plan. It explicitly refuses to alter immutable plan fields.

This confirms that BUY alert != fill is an intentional safety property. The correct positive-side architecture is "confirmed fill -> position reconciliation -> ADD eligibility", not "BUY push -> assume filled".

However, V8.1.2 still accepts only NONE/FIRST/FULL. There is no PARTIAL/REDUCED state. Thus the earlier asymmetry finding survives the later patch chain:
- a genuine partial trim cannot be represented semantically as a distinct state,
- FULL after a partial reduction remains FULL unless manually mapped to FIRST, which would conflate "half of planned initial build" with "reduced from full",
- ADD eligibility remains tied to FIRST, not to a separately confirmed REDUCED state.

Reverse case: adding REDUCED is not automatically beneficial; the missing state only means the system cannot *test or express* a symmetric add-back policy cleanly today.

### Main performance center cannot answer the user's current question
V8.5.0 `journalTradeStats` defines the primary trade result as:
first formal BUY -> first SELL/STOP_LOSS.
ADD, REDUCE and PROFIT_CHECK are retained as events but explicitly excluded from the primary win-rate calculation.

V8.6.0 enriches that same trade-level result by strategy/grade/price class/month, but still inherits the first-BUY-to-first-full-exit return.

Therefore current win rate / average return cannot determine:
- whether staged 60/40 deployment improves total-capital return,
- how much capital remained idle by policy vs no-BUY,
- whether REDUCE protected capital or sold winners too early,
- whether a re-add path would improve realized return,
- portfolio-level exposure-days / cash drag.

This is a measurement blind spot, not proof that the trading logic is wrong.

### Required research metric separation
Future research-only diagnostics should report at least four independent layers and never collapse them into one "win rate":
1. **Selection path** — scan-close D1/D3/D5/D10/D20, regardless of fill.
2. **Entry conversion** — first-tranche BUY trigger rate and failed-clause distribution.
3. **Capital exposure** — planned allocation, first/second tranche actually eligible/confirmed, exposure-days and idle-cash decomposition.
4. **Position-management path** — REDUCE/ADD/SELL sequence, realized-weighted P&L plus post-reduce MFE/MAE.

Do not change the existing primary win-rate definition retroactively. Add a versioned research estimand beside it so historical continuity is preserved.


## Live execution counterexample and structural idle-cash confirmation — 2026-09-22
Safe public production readback at 2026-09-22 11:34 Taipei provides a useful counterexample and separates two mechanisms.

### One live formal BUY did occur
Current production plan:
- 3006 晶豪科, A拉回承接, B級.
- scan date 2026-09-21, plan date 2026-09-22, formal close 285.
- buy zone 280.59–287.08, stop 276.36, profit check/reduceAt 309.5.
- current plan allocation 35% of NT$200,000 = NT$70,000; first tranche NT$42,000 (146 shares), second tranche NT$28,000 (97 shares).
At 11:34 production readback showed:
- current price 281.5,
- fresh quote and fresh formal 15m data,
- pullback result = BUY,
- finalDecision = BUY / "A拉回承接：15分K確認，可第一筆",
- monitor status = A / 立即處理.

This is a direct counterexample to any universal claim that the execution gate never triggers. It does **not** contradict the user's month-level scarcity observation; it demonstrates why the research must estimate conversion over all plans/dates rather than rely on anecdotes.

### Today's path illustrates what the two-bar gate is doing
Relevant 15m sequence:
- 09:00 opened 288.5 and sold down; early session was weak.
- 10:15 close 280, volume ratio 0.76, still bearish.
- 10:45 close 280, volume ratio 0.65, still bearish.
- 11:00 close 281.5, volume ratio 0.36, strong close + bullish reversal/engulfing.
- 11:15 close 282.5 with low 281 > prior low 279.5, bullish, volume ratio 0.8.
The formal A logic therefore waited through the opening weakness and only triggered after stabilization/higher-low confirmation.

Positive interpretation: the gate avoided buying near the 288.5 opening price and waited for evidence of stabilization around 281–282.
Reverse interpretation: if many future winners recover after a single reversal bar, the second-bar confirmation may delay entries unnecessarily. One day cannot decide this.

Required future clause-level test:
- identify first time zone touch occurs,
- first valid low-volume reversal bar,
- first higher-low confirmation,
- formal BUY time,
- post-trigger MFE/MAE.
Compare the incremental value of each step prospectively; do not remove a clause because one stock would have entered earlier.

### Structural idle cash is independently confirmed
Yesterday's formal recommendation selected only this one stock. Public capital plan:
- total capital NT$200,000,
- planned investment NT$70,000,
- remaining cash NT$130,000,
- first tranche NT$42,000,
- second tranche NT$28,000.
So even on a day with a valid candidate **and** a successful first BUY trigger, the first tranche uses only ~21% of total capital. This confirms that a substantial portion of cash idleness is intentional allocation architecture, not solely failed entry signals.

Research implication:
- month-level capital utilization must decompose policy reserve vs failed first-entry conversion vs unconfirmed/reserved second tranche.
- do not loosen entry rules to solve cash reserve created by sizing policy.


## Selection-funnel observability and two-sided literature check — 2026-09-22
### Historical selection bottleneck data already exist
Source audit confirms every formal after-market scan builds a rich `diagnostics` object containing:
- scanned / with60Days / baseEligible / rrEligible,
- A/B channel counts,
- exclusion-reason counts,
- up to 12 near misses,
- per-condition pass/fail and "only missing this one condition" counts for A and B,
- final 3+3 pool usage and unused slots.
V8.5.0 persists the entire object as `diagnostics_json` in `v8_trade_journal_days`.

However:
- current `/api/journal` intentionally does not select/expose `diagnostics_json`,
- public `/api/recommendations` intentionally omits full diagnostics and only exposes selected recommendations/capital plan,
- no current safe public route exposes historical daily funnel reasons.

Therefore we should **not** guess whether selection itself is too strict from today's selectedCount. The evidence required to answer that question already exists in D1 but is protected/unexposed.
No ADMIN_TOKEN request is necessary while other research remains.

Future Class A candidate, only if justified:
- an isolated research aggregate that reads historical `diagnostics_json` and returns date-aggregated counts/rates only (no secrets, no formal output changes).
- Before implementing, confirm isolation from shared runtime and preserve historical definitions; do not retune gates from the aggregate itself.

### Literature supports selective persistence, but also supplies the reverse case
Taiwan-specific evidence converges on a conditional, not universal, momentum/re-entry thesis:
- Chen, Hsieh & Lee (2023), Pacific-Basin Finance Journal, explicitly revisit Taiwan momentum through winner/loser **persistency**. This supports testing whether strength that persists is materially different from one-off strength.
- Lin, Ko, Feng & Yang (2016), Pacific-Basin Finance Journal, show Taiwan momentum depends on **market dynamics/state continuation vs transition**. This argues against a universal "re-add after recovery" rule.
- Ho, Hsiao, Lo & Yang (2023), Pacific-Basin Finance Journal, separate intraday and overnight return information in Taiwan. This reinforces that entry timing/path cannot be collapsed into a single momentum score.
- Barber, Lee, Liu & Odean (2007) document a Taiwan disposition effect: investors are substantially more prone to realize gains than losses. This is a relevant falsification warning for partial-profit logic because "locking profit" can reflect a sell-winners-early bias.

Important reverse qualifications:
1. Persistency papers do not validate our exact persistenceScoreResearch formula or a REDUCED->RE-ADD threshold.
2. Market-state evidence says a rule that works in continuation states can reverse in transition states.
3. Disposition-effect evidence is behavioral and historical; it does not prove a rules-based partial trim is irrational, especially when the trim reduces drawdown.
4. Intraday/overnight decomposition implies that an apparently strong close/recovery can have different next-session behavior; do not infer re-entry quality from close-to-close return alone.

Research implication:
- Any add-back hypothesis must require evidence of persistent strength and survive R06 regime-transition checks.
- Any trim critique must compare upside missed **and** downside/drawdown avoided.
- No new factor, no production change.


## Hidden selection asymmetries / stacked-conservatism audit — 2026-09-22
Source-level algebra reveals several non-obvious selection constraints that can reduce opportunity even before intraday confirmation. These are candidates for falsification, **not proposed relaxations**.

### A-line has a second hidden quality gate; B-line effectively does not
Formal grade thresholds are A>=80, B>=65. For A:
`setupQuality = 70 - 3*abs(pullbackPct-7) - 3*supportDistancePct + volumeBonus`,
where volumeBonus=12 only when today's volume/prev5 <=0.9, otherwise 4.

A daily setup can pass the explicit broad rules (pullback 2–15%, support distance <=4%, volume condition, structure, trend, not-late) yet still be rejected as C-grade:
- if volumeTodayVsPrev5 <=0.9, B-grade requires
  `abs(pullback-7) + supportDistance <= 5.67`.
- otherwise B-grade requires
  `abs(pullback-7) + supportDistance <= 3.0`.
Example: a valid A setup with pullback 12%, support distance 1%, and strong volume contraction gets quality 64 and is rejected despite all six A checks passing.

By contrast, for B:
`setupQuality = 55 + min(25,volVs5*8) + closePosition*20 - upperShadow*25`.
At the weakest values that still satisfy the B setup itself (vol=1.3, closePosition=0.65, upperShadow=0.35), quality is ~69.65, already above B-grade 65.
Therefore the "策略品質低於B級" hard filter is structurally an additional A-line gate but is nearly redundant for valid B setups.

Research implication:
- A/B opportunity scarcity must be measured separately.
- If A near-miss outcomes show that pass-but-C names perform similarly to B-grade A names, the hidden A gate may be redundant.
- Reverse case: the quality gate may isolate only the best support geometry and intentionally prevent loose "technically valid" pullbacks. Do not change without outcome comparison.

### RR target logic creates an anti-new-high asymmetry for B
B entry reference is `priorHigh20*1.003`.
`nearestRealResistance` only accepts a target > entry*1.01 from targetPrice, priorHigh20, priorHigh60, or older pivot highs.
For a B breakout:
- priorHigh20 can never be the target because it is below the entry.
- if the stock is breaking above its 60-day high and has no external targetPrice / older overhead pivot >1% above entry, the function returns null.
- that candidate is hard-rejected as "上方無可驗證實質壓力，無法計算真實RR".

Thus a clean new-high breakout can be rejected **because it has no overhead resistance from which to calculate RR**, whereas an A pullback with overhead resistance can calculate RR normally.
This is logically conservative but potentially anti-momentum.

Positive interpretation: refusing an unverifiable target prevents invented upside and preserves honest RR.
Reverse interpretation: absence of overhead resistance is not evidence of low reward; it can be characteristic of genuine price discovery/new-high momentum. Treating "unknown target" as automatic rejection may systematically discard exactly the strongest B cases.

Required falsification:
- isolate rejected-after-base cases whose sole later-stage failure is `target===null`,
- compare D1/D3/D5/D10 path, MFE/MAE and false-break rate against accepted B cases,
- never invent an ATR/multiple target after observing winners. Any alternative exit/target framework would require a newly preregistered Class C proposal.

### Strong-day / limit-up candidates face stacked anti-chase protection
Before A/B setup evaluation, `abs(changePercent)>=9.8%` is a hard reject.
B also requires ret20<=30 / not-late and then next day refuses price above maxChase while demanding a retest and reconfirmation.
This stack can materially reduce participation in fast momentum episodes.

Reverse evidence already in the research record:
- Taiwan price-limit mechanics can generate magnet/attention effects and distort apparent momentum near limits.
- extreme-strength literature is not uniformly bullish; extreme absolute strength can attenuate conventional momentum.
Therefore removing the 9.8% guard because a later limit-up winner was missed would be classic outcome-driven overfitting.

Required test:
- compare near-limit rejected cohort against ordinary B candidates across regimes and post-2015 microstructure,
- separately measure continuation, next-day reversal and MAE,
- no threshold retuning from the current sample.

### Liquidity policy is materially stricter than the global coarse filter
The formal code uses 20-day average volume >=1,000 lots for sub-NT$1,000 stocks (300 lots for >=NT$1,000), plus extra market-cap/liquidity constraints. This is stricter/different from the coarse global exclusion rule of 5-day average volume >=500.
This may be deliberate execution-risk protection, but it is another possible selection-funnel reducer. Historical `diagnostics_json` can show whether it is actually binding before any debate over changing it.

### Net interpretation
The system is not merely "one strict BUY trigger." It contains stacked conservatism at:
1. universe/liquidity/data completeness,
2. sector/fundamental gates,
3. A/B setup,
4. A-specific effective quality tightening,
5. verifiable-RR requirement,
6. extreme-day avoidance,
7. one-day plan validity,
8. two-step intraday confirmation,
9. staged capital deployment.
The correct research task is to identify which layer rejects names that later have favorable **risk-adjusted executable paths**, rather than loosening all layers together.


## Shadow archive coverage limitation for the new bottleneck questions — 2026-09-22
Audit of V8.7.2 shows the existing Shadow Candidate Archive is valuable but **not sufficient to answer all newly raised gate-specific questions without bias**.

Current prospective archive construction:
- SELECTED: all selected names.
- QUALIFIED_NOT_SELECTED: up to 6 per pool.
- NEAR_MISS: up to 6 per pool, drawn only from names failing the A/B setup formation step.
- REJECTED_AFTER_BASE: up to 6 per pool from base-passed later-stage rejects.
- BROAD_CONTROL: up to 6 per pool via stable-hash sampling.

Critical limitation:
`REJECTED_AFTER_BASE` is sorted by exclusion-reason text then symbol before taking only 6 per pool. Therefore it is not a representative sample of all later-stage failures and can systematically omit specific reasons such as:
- no verifiable resistance / target null,
- RR <2,
- A setup pass but quality grade C,
- fundamental/sector/ATR later-stage failures.

The current archive was designed for broad anti-selection-bias comparison, not reason-specific gate attribution.

Consequence for current research:
1. Do not estimate "how much opportunity the RR gate / A-quality gate loses" from the current REJECTED_AFTER_BASE cohort as if it were exhaustive.
2. Historical `diagnostics_json` can quantify how often each rejection reason binds, but it does not preserve full per-stock future-path identity for every reject.
3. Reason-specific causal/falsification work needs a prospective, preregistered sampling scheme or exhaustive lightweight identity archive.

Possible future Class A instrumentation, **not yet implemented**:
- preserve aggregate per-reason counts daily,
- for each frozen rejection reason retain a deterministic reason-stratified sample with explicit sampling probability/limit,
- or persist only minimal identity + scan baseline for all post-base rejects if D1/CPU cost is proven acceptable.
Do not change sampling after seeing which reason looks profitable.
Any instrumentation must remain research-only, fail-open, no ranking/plan/push/trade impact.

This prevents a second-order selection bias: using a convenience subset of rejected candidates to decide which gate to relax.


## Exact next continuation point
1. Re-read latest checkpoint/main and re-check SHA.
2. Audit frame10/frame15 timestamp provenance: `researchBarTiming` derives bar end by adding timeframe to `frame.latest.time`; verify whether `buildBar.time` comes directly from Fugle candle `bar.date`, and distinguish calculated completion time from source-observed freshness. Record failure modes around delayed candle publication and cached prior frames.
3. Search for a safe public/read-only route, workflow artifact, or log that can establish actual execution-shadow-v2 storage coverage without ADMIN_TOKEN. If none exists, keep D1 coverage UNKNOWN; do not infer storage from elapsed stage time.
4. Continue falsification on persistence/attention/industry overlap; no new factors.
5. Audit no-BUY opportunity-cost data feasibility: intended quantity/capital, selected-plan identity, BUY trigger, future path availability; do not define/optimize a metric yet.
6. Explore PIT-valid monthly-revenue announcement history only if first-known timestamps/source vintage can be proven; current snapshot must not masquerade as historical vintage.
7. Formal Core remains LOCKED. Do not alter formal freshness semantics. No Class B/C production change without explicit human decision.