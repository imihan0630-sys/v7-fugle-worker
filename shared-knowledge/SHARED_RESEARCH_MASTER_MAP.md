# Shared Research Master Map

Updated: 2026-09-28 Asia/Taipei
Status: CANONICAL_SHARED_INDEX
Scope: Cross-system research knowledge
Formal Core impact: NONE

## Purpose

Central cross-project entrypoint for reusable Taiwan-equity knowledge. System 1 and System 2 read this before their own project-specific maps.

Existing detailed research remains in its current files; this map indexes it rather than relocating history.

## Domain map

1. Price / K-line / chart-pattern topology
2. Price-volume relationships
3. Trend / momentum / reversal
4. Volatility / volatility regime
5. Market microstructure / execution
6. Institutions / ownership / margin / SBL / crowding
7. Fundamentals / financial statements / monthly revenue
8. Valuation
9. Industry / sector / residual RS / breadth
10. Supply-chain / capacity / inventory / commodity transmission
11. Corporate actions / event risk / material information
12. Derivatives / futures / options / Taiwan VIX
13. Macro / cross-market / global regime transmission
14. Trading frictions / slippage / opportunity cost
15. Portfolio/capital-utilization research methodology
16. Statistical validation / PIT / Shadow / OOS / Factor Zoo / overfit
17. News/event half-life and beneficiary/victim transmission
18. Strategy-regime interaction research

## Cross-industry analysis framework（跨產業通用分析框架）

This framework is a reusable research method, **not a memory-industry-specific rule and not a new standalone domain/module**. It must be applicable to any industry/theme, including but not limited to CPO、PCB、ABF、AI Server、memory、semiconductor equipment、networking and future sectors.

Primary ownership:
- **D09** Industry / sector / breadth / rotation
- **D10** Supply-chain / capacity / inventory / commodity transmission

Required cross-domain links when relevant:
- **D07** fundamentals / earnings / margin / growth acceleration
- **D08** valuation / forward expectations
- **D13** global bellwether / cross-market transmission
- **D17** news / event half-life / beneficiary-victim propagation
- **D18** regime-dependent interpretation / strategy interaction

For every industry analysis, do not stop at naming a hot theme or describing one company. The reusable chain should examine, when data permits:

1. **Global bellwether / industry leader**
   - Identify the global or regional leader(s), their earnings calls, guidance, orders, product roadmap, pricing, utilization, inventory and market reaction.
   - Test whether the leader is actually a leading indicator for Taiwan names instead of assuming causality.

2. **Demand / supply / inventory / capacity**
   - Demand growth, end-market mix, supply constraints, utilization, capacity expansion, inventory days, lead times, backlog and pricing power.
   - Distinguish structural demand from short-lived shortage, restocking or speculative demand.

3. **Product mix → margin / earnings sensitivity**
   - Map product mix, ASP（平均售價）, shipment volume, gross margin, operating leverage and EPS sensitivity.
   - Do not treat all products inside one industry as economically equivalent.

4. **Upstream / downstream / asymmetric transmission**
   - Map the supply chain and identify which layer captures value, which layer bears cost pressure, where bottlenecks sit, and where substitution is possible.
   - Separate first-order beneficiaries from second-order or narrative-only beneficiaries.

5. **Global leader → Taiwan supply-chain lead-lag**
   - Test the timing and magnitude of transmission from global bellwethers to Taiwan sectors/stocks.
   - Include earnings/guidance surprise, overnight market reaction, Taiwan opening gap, subsequent continuation/reversal and residual strength after controlling for the broad market/sector.

6. **Fundamentals × valuation × price position**
   - Separate “good industry/company” from “good entry point”.
   - Evaluate whether strong fundamentals are already priced in, whether valuation has expanded, and whether price extension/RR makes the setup unattractive despite improving fundamentals.

7. **Regime-dependent interpretation**
   - The same evidence can have different implications under growth-dominant, inflation-dominant, liquidity-driven, shortage, overcapacity or recession-fear regimes.
   - Never reduce analysis to “good data = bullish / bad data = bearish”.

8. **Falsification / PIT / replay**
   - Record the positive mechanism, competing explanation, failure conditions, first-known timestamp, PIT eligibility, replayability, missing-data UNKNOWN semantics, transaction-cost relevance and factor redundancy.
   - A famous leader/company example is evidence only after falsification and Taiwan PIT validation; anecdotal narrative alone cannot promote maturity.

System-use rule:
- Use this framework to generate research hypotheses and cross-domain dependencies for System 1 / System 2.
- Do not hard-code any industry example into Formal Core solely because a video, analyst or single cycle appears convincing.
- Prefer reusable features and transmission relationships over one-off sector stories.

## Moving-average strategy integration（均線策略跨模組整合）

Moving-average（均線）研究不得被拆成多個高度重複的「獨立因子票數」。SMA、EMA、低延遲均線、MACD 等若主要只是不同平滑／濾波形式，必須先做 redundancy（冗餘）檢查，再判斷是否有獨立增量價值。

Primary ownership:
- **D03-01** 均線排列／斜率／趨勢狀態
  - 正式子題：均線扣抵／扣抵價／未來均線斜率路徑。涵蓋 SMA 扣高／扣低、未來 1／3／5 日扣抵序列與斜率轉折預判；EMA 需依遞迴權重另行定義。此子題是均線機制拆解，不是新增獨立投票因子，必須先做冗餘與增量價值驗證。
- **D03-05** Pullback（回檔）與短期反轉
- **D03-13** 多時間框架趨勢／動能衝突

Required dependencies when the均線被用作交易流程而非單純描述指標:
- **D01-04** 支撐／壓力／區域拓樸：驗證所謂「動態支撐／壓力」是否真的優於價格結構本身。
- **D01-11** 目標價／阻力／RR 幾何：避免「趨勢正確但買點太差」。
- **D15-09** Stop-risk Geometry（停損距離風險）：若均線被拿來作停損／移動停利，需比較結構停損與固定風險。
- **D16** 統計驗證：任何「最佳均線週期」或資產／時間框架自適應參數，都必須防止 parameter snooping（參數探勘）、look-ahead（偷看未來）與多重測試。
- **D18-02** Trend vs Range（趨勢 vs 盤整）策略互動：均線策略必須驗證趨勢盤與盤整盤是否存在方向相反的效果。

Mandatory research questions:
1. 將均線用途拆成不同角色：trend direction（趨勢方向）、trend strength proxy（趨勢強弱代理）、pullback location（回檔位置）、dynamic support/resistance proxy（動態支撐／壓力代理）、trailing exit（移動出場）。不得把同一價格資訊的不同表達重複計分。
2. 固定週期 MA 與 adaptive / asset-specific horizon（自適應／標的特定週期）必須做 OOS／Shadow 驗證；不得用事後調到最貼合走勢的均線當成有效證據。
3. 「回踩均線買進」必須與純價格支撐區、ATR／波動度、量價確認與 RR 做對照，確認增量價值而非視覺巧合。
4. 「跌破均線出場／讓利潤奔跑」必須與固定停損、結構停損、時間停損及 opportunity cost（機會成本）比較。
5. SMA vs EMA vs 低延遲均線的比較，先判斷差異是否只來自 filter latency（濾波延遲）；若沒有新資訊來源，不得視為新因子家族。
6. 所有均線結論都必須分 Regime（市場狀態）、流動性、波動度與時間框架驗證；盤整市場中的 whipsaw（來回假訊號）必須是主要反證之一。

System-use rule:
- 這是一條跨模組研究整合規則，不新增第 19 領域，也不自動增加新的獨立因子權重。
- Formal Core 維持 LOCKED；只有通過 PIT、OOS／Prospective Shadow、成本、冗餘與多 Regime 驗證後，才可形成 FORMAL_OPTIMIZATION_CANDIDATE。

### Integrated knowledge candidate: Trend → Location → Momentum → Price Confirmation → Risk/Exit

Source context: owner-supplied full upper/lower recordings of YouTube video `YsYFrWVwAq4`.  
Status: **RESEARCH_CANDIDATE / PRELIMINARY_BIDIRECTIONAL_CHECKED / NOT_FORMAL_EVIDENCE**.  
The video is treated as hypothesis material. It does not upgrade D01/D03/D15/D16/D18 maturity by itself.

#### 1. Reusable architecture distilled from the complete video

The useful knowledge is not “EMA16/64 is magic”. The reusable architecture is a **sequential gate**:

1. **Trend direction gate**
   - Use fast/slow moving-average direction plus price location to identify the dominant trend.
   - Video implementation: EMA16 and EMA64.
   - Moving averages are a **direction filter**, not a standalone BUY trigger.

2. **Location gate**
   - Wait for price to return toward an identifiable support/resistance or pullback area.
   - Avoid buying solely because an oscillator crosses while price location is poor.

3. **Momentum gate**
   - Require momentum to align again with the intended direction.
   - Video implementation: LazyBear Impulse MACD.
   - Momentum is a timing/filter layer, not an independent investment thesis.

4. **Price-confirmation gate**
   - Wait for an explicit key K-bar or breakout-style price confirmation before entry.
   - Set stop/risk at entry.
   - “Key K” must be translated into an explicit repaint-safe / PIT-safe rule before testing; hindsight visual labeling is forbidden.

5. **Trend-continuation / hold logic**
   - If the trend remains valid and explicit exit deterioration is absent, continue holding rather than repeatedly selling normal pullbacks.
   - Missing the first impulse is not permission to chase.

6. **Extension control**
   - When price is excessively extended away from the fast trend reference, do not chase the first wave.
   - Wait for distance normalization / pullback and a second qualified opportunity.
   - This is conceptually related to maxChase / lateStage / MA-distance controls and must be tested for incremental value rather than duplicated.

7. **Reversal discipline**
   - A moving-average trend system is not a bottom/top picker.
   - Do not infer reversal merely because price has fallen/risen a lot; require trend structure + momentum + price confirmation.

8. **Range / whipsaw failure state**
   - Sideways/choppy markets are a first-class failure mode.
   - A higher timeframe may be used as a pre-specified context/filter, but switching timeframe only after seeing a failed lower-timeframe trade is prohibited hindsight adaptation.

9. **Exit deterioration gate**
   - Video example waits for multiple deterioration conditions, including:
     - price breaks below EMA16 and the fast trend bends down;
     - EMA16/64 dead cross;
     - Impulse MACD dead cross.
   - In our system this is **not three independent votes**. These signals share the same underlying price family and must be modeled as a within-family state machine / deterioration gate with redundancy control.

#### 2. What is genuinely different from current knowledge

- **EMA16/64 ratio**: worth testing as a parameter challenger, not adopting as a default.
- **Impulse MACD**: not identical to standard MACD. Its smoothed High/Low envelope + zero-lag EMA construction suppresses movement inside the envelope and can act as a range/noise filter. It remains a composite price-derived candidate until it adds value beyond direct trend, MA distance, volatility/range and standard MACD controls.
- **Sequential gate design**: direction → location → momentum → price confirmation is more useful than majority voting among correlated indicators.
- **Explicit failure handling**: extension, trend reversal and range/whipsaw are part of the strategy contract, not after-the-fact excuses.
- **Hold/exit symmetry**: entry and exit should be evaluated as a lifecycle, including MFE/MAE and opportunity cost, rather than optimizing entries only.

#### 3. Preliminary positive-side checks

- Rob Carver has publicly discussed 16/64 as a reasonable EWMAC pair and uses a fast/slow ratio of roughly 1:4 within a family of trend rules.
- The factor-of-four rationale is mainly about keeping adjacent crossover rules from becoming nearly identical and improving diversification across trend speeds.
- Taiwan-market academic evidence exists that moving-average timing can have positive conditional value; reported effects vary across firm life-cycle, information uncertainty, size/liquidity and market regimes.
- LazyBear Impulse MACD's published construction genuinely differs from standard MACD by adding a smoothed High/Low envelope and suppressing in-envelope impulses, providing a plausible noise-filter mechanism.

#### 4. Preliminary negative-side / falsification checks

- Carver has also stated that his preference for 16/64 over nearby alternatives is **not statistically significant**. Therefore 16/64 cannot be promoted as a privileged or universal pair.
- The 1:4 ratio is partly a **portfolio/diversification design choice across crossover speeds**, not proof that 16/64 is the optimal single-stock timing rule.
- Moving-average and MACD-family signals are lagging price transforms and can be highly redundant. Reduced lag does not create new information for free; lower lag can trade off against higher noise/whipsaw.
- Sideways markets generate repeated crossover whipsaws; this is both theoretically expected and explicitly visible in the supplied video.
- “Switch to a larger timeframe” can become hidden parameter snooping unless the timeframe relation is frozen ex ante and validated OOS/prospectively.
- “Key K” and “support/resistance” are vulnerable to hindsight labeling unless exact causal definitions and first-known timing are frozen.
- Three exit conditions derived from price/MA/MACD do not constitute true cross-family confluence.
- Any apparent improvement can disappear after transaction costs, missed-opportunity cost, multiple-testing correction and exact common-support comparison.

#### 5. Research contract before any optimization

Baselines:
- direct return / trend persistence;
- simple price-vs-MA state;
- common MA structures already used by System 1/System 2;
- standard MACD;
- price-structure support/resistance;
- pullback / breakout confirmation;
- existing maxChase / lateStage / MA-distance controls.

Challengers:
- EMA16/64 trend state;
- EMA16/64 + Impulse MACD;
- + explicit price-confirmation K/bar rule;
- + pre-specified multi-timeframe regime filter;
- + lifecycle exit/deterioration gate.

Required outcomes:
- false-confirmation rate;
- follow-through;
- MFE / MAE;
- after-cost return;
- whipsaw count;
- holding-period stability;
- missed-opportunity cost;
- zero-pick / coverage impact;
- incremental value after redundancy controls.

Required stratification:
- Trend vs Range;
- high/low volatility;
- liquidity;
- price-extension state;
- timeframe;
- market regime.

Promotion gate:
- PIT-safe formula and first-known timing;
- exact common-support baseline;
- OOS and/or Prospective Shadow;
- multiple-testing / parameter-snooping control;
- transaction-cost and opportunity-cost sensitivity;
- independent dates / multiple regimes;
- no duplicate evidence weighting.

#### 6. Routing / ownership

- Primary owner: **D03** trend / momentum / technical indicators.
- Dependencies:
  - **D01** price structure, support/resistance, key-K / breakout confirmation;
  - **D02** price-volume confirmation as an optional challenger, not assumed necessary;
  - **D14** execution and transaction-cost sensitivity;
  - **D15** stop / exit / holding lifecycle geometry;
  - **D16** PIT / OOS / Shadow / multiple testing / redundancy;
  - **D18** Trend-vs-Range and multi-timeframe regime interaction.

Formal Core remains LOCKED.  
This candidate can become a `FORMAL_OPTIMIZATION_CANDIDATE` only after the specialist rooms produce reproducible positive **and** negative evidence and it survives the above gates.

## Shared inventory

- `shared-knowledge/SHARED_RESEARCH_INVENTORY.md` is the cross-system domain/tag inventory. It points to original evidence without relocating it.
- `shared-knowledge/STOCK_MARKET_KNOWLEDGE_LEARNING_MAP.md` is the canonical 18-domain / 226-module learning curriculum and chatroom routing dashboard.
- `research/stock_market_learning_tracker_v0_1.json` is the machine-readable maturity tracker for that curriculum.
- `shared-knowledge/LEARNING_ROOM_ROUTER.md` is the mandatory public routing file every learning chat reads to know its assigned domains, modules, learning scope, progress and checkpoints.

## Existing canonical anchors

The current System 1 research corpus is the initial evidence base. Important anchors include:
- `RESEARCH_MASTER_MAP.md`
- `RESEARCH_CHECKPOINT.md`
- `DEEP_LEARNING_CHECKPOINT.md`
- `TREND_MOMENTUM_REVERSAL_RESEARCH.md`
- `VOLATILITY_REGIME_RESEARCH.md`
- `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`
- `CORPORATE_ACTIONS_CAPITAL_SUPPLY_RESEARCH.md`
- `TRADING_FRICTIONS_RESEARCH.md`
- dedicated price-volume and pattern research/checkpoints registered by the System 1 master map
- `research/research_master_map.json`

These files are not duplicated into this folder. Their evidence remains authoritative.

## System pointers

- System 1 master: `RESEARCH_MASTER_MAP.md`
- System 1 governance: `RESEARCH_ENGINEERING_GOVERNANCE.md`
- System 2 master: `system2/SYSTEM2_MASTER.md`
- System 2 bridge: `system2/SYSTEM2_BRIDGE_FROM_V8.md`

## Shared routing rule

A new finding enters this shared map only when it is reusable market knowledge. System-specific implementation details stay in the owning system.

## Current bootstrap status

SHARED_NETWORK_VERSION = 0.1
SYSTEM1_CONNECTED = true
SYSTEM2_CONNECTED = true
HISTORICAL_RELOCATION_REQUIRED = false
FORMAL_CORE_CHANGED = false

Inventory task completed in `shared-knowledge/SHARED_RESEARCH_INVENTORY.md`.

Next task: map reusable lanes to exact machine-readable fields, missing fields, PIT availability and candidate System 2 factor IDs.

- Event/news transmission anchor: `NEWS_EVENT_TRANSMISSION_RESEARCH.md` (D17 sentiment, novelty, duplicate-event clustering, PIT semantics).

- Index adjustment/passive-flow anchor: `INDEX_ADJUSTMENT_PASSIVE_FLOW_RESEARCH.md` (D11-14 Taiwan PIT event clocks, passive-flow mechanism, falsification and OOS contract).

- Capital-structure event-state anchor: `CAPITAL_STRUCTURE_EVENT_STATE_MACHINE_RESEARCH.md` (D11-04 convertible-bond lifecycle, D11-05 treasury-stock authorization/execution/disposition, D17-06 expectation-vs-realization dependency).


### D03 reusable rule update — 2026-10-01

Status: **MECHANISM_AND_FALSIFICATION_DEFINED / NOT_FORMAL_EVIDENCE**.

Two exact/shared rules from D03 TI-453~459 are reusable by both System 1 and System 2:

1. **SMA deduction-price redundancy firewall.** For an n-period SMA, `SMA_n(t)-SMA_n(t-1)=(C_t-C_(t-n))/n`. Therefore current SMA slope direction, current close versus the outgoing/deduction close and the sign of the same-horizon close return are algebraically linked. They must not be counted as independent factor votes. Future deduction sequences are conditional scenario thresholds because future incoming closes remain unknown.

2. **ADX is a trend-quality candidate, not an independent directional vote.** ADX is signless trend strength; direction belongs to +DI/-DI or another direction layer. ADX and Impulse MACD are structurally different but both transform OHLC trend/range information, so an EMA16/64 + Impulse + ADX stack has a high shared-family redundancy prior. ADX begins as a moderator/diagnostic and needs residual incremental-value evidence beyond direct trend, ATR/regime, trend persistence, structure and Impulse before any optimization proposal.

Additional engineering constraint: the prior ~65-bar readiness result for KD/RSI/MACD cannot be inherited by ADX14. Deterministic warm-up falsification showed a material 65-bar initialization difference while 150 bars nearly converged to the full-history value in the witness. Any ADX capture must freeze formulaVersion and warm-up semantics first.

System-use rule:
- do not add duplicate score weight for SMA slope + deduction state + same-horizon retN;
- do not treat ADX as the third vote in a correlated trend-indicator confluence;
- preserve Trend -> Location -> Momentum -> Price Confirmation -> Risk/Exit architecture, with ADX only as a prospective trend-quality moderator unless residual evidence survives PIT/OOS/Shadow, cost, redundancy and multi-Regime gates;
- Formal Core remains LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.
