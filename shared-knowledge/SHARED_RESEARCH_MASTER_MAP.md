# Shared Research Master Map

Updated: 2026-10-03 10:36 Asia/Taipei
Status: CANONICAL_SHARED_INDEX
Scope: Cross-system research knowledge
Formal Core impact: NONE

## Purpose

Central cross-project entrypoint for reusable Taiwan-equity knowledge. System 1 and System 2 read this before their own project-specific maps.

Existing detailed research remains in its current files; this map indexes it rather than relocating history.

## Domain map

1. K線／型態／價格結構
2. 價量關係
3. 趨勢／動能／反轉／技術指標
4. 波動率／波動狀態
5. 市場微結構／撮合／流動性
6. 法人／籌碼／槓桿／擁擠／被動資金
7. 基本面／財報／資訊動態
8. 估值
9. 產業／族群／市場廣度／輪動
10. 供應鏈／產能／庫存／原物料傳導
11. 公司行動／重大事件／事件風險
12. 期貨／選擇權／衍生品
13. 總體經濟／跨市場傳導
14. 交易成本／執行品質／Execution Alpha
15. 投資組合／風險／資金利用／部位生命週期
16. 統計驗證／PIT／Shadow／OOS／防過擬合
17. 新聞／事件半衰期／受益受害傳導
18. 市場Regime×策略互動
19. 資產定價／因子投資／市場異象
20. 行為金融／投資人注意力／市場心理
21. 公司治理／經營者／內部人／控制權品質
22. 信用市場／資本結構／融資壓力／股債傳導

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

## Curriculum expansion — D19 to D22 (2026-10-02)

Owner-approved expansion from 18 to 22 domains. **Historical snapshot at this step:** the canonical machine tracker contained 337 modules; all newly added modules began at L0 and therefore lowered aggregate curriculum maturity without reducing any prior evidence. The current canonical count is stated in the later Current Curriculum sections.

New domains:
- **D19 Asset Pricing / Factor Investing / Market Anomalies** — primary room 12. Treat factor labels as hypotheses; require neutralization/redundancy checks against existing D03/D07/D08/D09 information and D16 multiple-testing controls.
- **D20 Behavioral Finance / Investor Attention / Market Psychology** — primary room 13. Behavioral explanations require observable proxies and structural/microstructure counterfactuals; price action alone never proves investor intent.
- **D21 Corporate Governance / Management / Insider / Control Quality** — primary room 14. Preserve PIT disclosure/vintage semantics and separate from D06 ownership flow, D07 accounting fundamentals and D11 event clocks.
- **D22 Credit Markets / Capital Structure / Refinancing / Equity-Credit Transmission** — primary room 15. Prove incrementality beyond D07 accounting leverage and D13 rate context; missing bond/rating/covenant evidence remains UNKNOWN.

Approved second-level curriculum extensions:
- D07: business model, moat, unit economics/operating leverage, concentration, product lifecycle/TAM/penetration, management-guidance quality.
- D08: DCF/FCFF/FCFE, DDM, residual income, SOTP, liquidation/asset-based value.
- D12: Greeks, IV-RV spread, volatility risk premium, volatility surface/smile.
- D16: time-series, panel/cross-sectional models, regularization/feature selection, machine learning/calibration, causal inference.

Research routing only. No System 1/System 2 Formal Core, production strategy, ranking, capital, signal or notification behavior changes are authorized by this curriculum expansion.

## Curriculum expansion — approved cross-domain gaps (2026-10-02)

Owner approved the second gap audit without creating D23. **Historical transition:** the canonical curriculum remained **22 domains** and expanded from **297 to 337 modules**. All 40 newly registered modules began at L0; this lowered aggregate curriculum maturity by denominator expansion only and did not downgrade prior evidence. This is a historical transition record, not the current module count.

New second-level knowledge coverage:
- D05: market impact, adverse selection/order-flow toxicity, queue position/order priority.
- D07: WACC/cost of capital, capital budgeting/NPV/IRR/real options, integrated three-statement forecasting, revenue/margin/OPEX drivers, working-capital/CAPEX/FCF forecasting, scenario/sensitivity analysis, revenue-recognition/accounting-policy quality, forensic-accounting red flags.
- D10: trade policy/export-control/sanctions supply-chain transmission; industrial policy/subsidy/geopolitical bottlenecks.
- D11: IPO/listing/bookbuilding, lock-up expiry, secondary offering/private placement, tender offer/going-private/delisting, spin-off/merger-arbitrage/deal-break risk.
- D13: fiscal policy, monetary transmission/financial conditions, central-bank balance sheet/system liquidity, trade/geopolitical/capital-flow transmission.
- D14: market-vs-limit/order-type choice, VWAP/TWAP/participation execution, implementation shortfall/market-impact cost, alpha decay/execution urgency.
- D15: mean-variance/efficient frontier, risk budgeting/risk parity, Black-Litterman, Kelly/fractional Kelly, tracking error/active share, performance attribution, risk attribution/information ratio.
- D16: alternative-data provenance/selection bias; NLP/LLM financial-text feature validation.
- D17: policy/regulatory event clock and surprise.
- D19: pairs trading/cointegration, residual mean reversion/cross-sectional relative value, index/benchmark construction methodology.
- D21: ESG/climate/social materiality risk.

Governance interpretation:
- These are curriculum modules, not validated alpha factors or production rules.
- No System 1/System 2 Formal Core, ranking, signal, allocation, execution or notification behavior is changed by this approval.
- Specialist rooms own evidence generation; room 00 owns only curriculum/routing synchronization.

## Third-pass curriculum refinement — 26 approved modules (2026-10-02)

Owner approved the third residual-gap audit after explicit positive/negative review. **Historical transition:** the canonical curriculum remained **22 domains** and expanded from **337 to 363 modules**. All 26 additions started at L0 and did not imply evidence, maturity promotion or production use. This is a historical transition record, not the current module count.

Approved additions:
- D05: market integrity / abnormal-trading-pattern risk. It may lower market-data/signal confidence but must never infer manipulative intent from price/order data alone.
- D06: ETF creation/redemption/AP mechanics, ETF premium-discount/tracking/liquidity, securities-lending economics.
- D07/D08: advanced accounting (tax, leases, pension/share compensation, diluted EPS, FX translation, goodwill/impairment) plus financial-institution operating metrics and valuation.
- D09: industry structure / Porter Five Forces and competition/share/barrier/substitution analysis.
- D12/D15: put-call parity, synthetic positions, option payoff strategies and derivative hedging/overlay.
- D13/D18: business-cycle indicators, capital-market expectations / long-run growth drivers and cycle-by-strategy Regime interaction.
- D14: short-sale execution, recall, forced buy-in and squeeze risk.
- D15/D16: VaR, stress/reverse-stress testing and Monte Carlo distributional validation.
- D19: liquidity premium / illiquidity factor.
- D20: limits to arbitrage / noise-trader risk.

Explicitly NOT promoted to a standalone module:
- Clearing / settlement mechanics. Relevant T+2, borrow/return and orderability details remain subordinate knowledge under D06/D14 unless future strategy scope expands to cross-market arbitrage, institutional clearing or leveraged derivatives.

Formal Core remains LOCKED. No System 1/System 2 signal, ranking, allocation, execution or notification behavior is changed by this curriculum update.

## Probabilistic decision and expectations curriculum approval (2026-10-03)

Owner approved three additional L0 modules, producing the **historical transition from 363 to 366 modules** without adding a new domain. This was the pre-retirement/pre-consolidation count; the current canonical count is lower:

- **D07-33** Intangible Capital／R&D／Innovation Accounting — calibrates interpretation of earnings, book value, ROIC and valuation for R&D/intangible-intensive businesses; not a mandatory stock filter.
- **D08-19** Reverse DCF／Market-Implied Expectations／Expectations Gap — estimates what growth/margin/cash-flow assumptions are already embedded in price; must use ranges/sensitivity and must not become a single-threshold valuation gate.
- **D16-25** Probabilistic Decision／Bayesian Updating／Uncertainty-aware Selection — studies calibrated probability, expected value, uncertainty and abstention to prevent the knowledge curriculum from becoming a serial AND-gate funnel.

Cross-system governance authority:
`shared-knowledge/PROBABILISTIC_SELECTION_GOVERNANCE_V0_1.md`

Five required decision roles:
1. HARD_INVALIDATION
2. PRIMARY_ALPHA
3. SUPPORTIVE
4. CONTEXT_ONLY
5. CONFIDENCE／UNCERTAINTY

Default for newly learned evidence remains RESEARCH_ONLY. New knowledge does not create a new selection gate by default. UNKNOWN != FAIL and UNKNOWN != 0.

System 1 remains the conservative Formal benchmark; any probabilistic redesign is Shadow challenger first.
System 2 should be designed strategy-by-strategy with a small set of primary evidence families rather than requiring all 22 domains to pass.
Formal Core remains LOCKED.

## Hybrid selection execution — owner approved 2026-10-03

Canonical execution authority:
- `shared-knowledge/PROBABILISTIC_SELECTION_GOVERNANCE_V0_1.md`
- `shared-knowledge/HYBRID_SELECTION_EXECUTION_DIRECTIVE_V0_1.md`

Execution tracks:
- **System 1:** GitHub issue #319 — Hybrid Shadow Challenger gate-role audit / anti-overfiltering. Class A Shadow implementation authorized; Production Formal remains unchanged.
- **System 2:** GitHub issue #320 — Hybrid strategy-selection contract / uncertainty channel. Research/design implementation authorized; general final-selection and live authority remain disabled.

Owner-approved forward philosophy:
minimal HARD_INVALIDATION + strategy-specific PRIMARY_ALPHA + SUPPORTIVE + CONTEXT_ONLY + separate CONFIDENCE／UNCERTAINTY + ABSTAIN when expected value is inadequate or uncertainty excessive.

The learning curriculum (22 domains / 354 modules) is a knowledge universe, not an all-domain AND-gate checklist.

## Seven-item curriculum audit and capability-preservation execution (2026-10-03)

Owner approved the re-audit of seven previously proposed deletions. The current canonical curriculum is **22 domains / 354 modules**.

Executed:
- D03-11 ROC: standalone module retired because standard ROC is exactly redundant with same-horizon retN; alias/anti-double-count ownership transferred to D03-02.
- D10-11 official-data automation: standalone curriculum module retired; automated official-source acquisition capability permanently preserved under Research Engineering / Data Source governance.
- D14-13 complete broker fee schedule semantics: standalone module retired; complete fee-schedule provenance permanently merged into D14-01.
- D21-08 governance/ESG score provenance: standalone module retired; source/version provenance transferred to D16-11 and financially material ESG/governance risk transferred to D21-13.
- D01-12 Sakata/traditional candlestick: **at this interim seven-item audit stage** it was retained as OBSERVATION / MERGE_CANDIDATE / RESEARCH_ONLY; this interim decision was later superseded by the owner-approved Observation-module consolidation below, which merged the standalone ID into D01-02 / D01-03 / D01-05 / D01-09.
- D02-07 OBV: retained as OBSERVATION / MERGE_CANDIDATE / PRICE_VOLUME_COMPARATOR_ONLY.
- D10-12 retained and renamed to Industry-specific Transmission Model／Issuer Exposure Mapping（產業專屬傳導模型與公司曝險映射）.

Canonical dependency/ownership record:
`shared-knowledge/CURRICULUM_RETIREMENT_AND_CAPABILITY_LEDGER_V0_1.md`

Historical research files and existing runtime capabilities remain preserved. Formal Core remains unchanged.

## Observation-module consolidation — owner approved 2026-10-03

Owner instructed that safely mergeable observation modules be consolidated after Dependency Audit（依賴稽核）. The canonical curriculum is now **22 domains / 354 modules**.

Merged standalone IDs:
- D01-12 -> D01-02 / D01-03 / D01-05 / D01-09 (traditional candlestick / Sakata knowledge preserved; no independent Sakata score).
- D06-17 -> D06-16 (integrated ETF mechanics: creation/redemption/AP/premium-discount/tracking/liquidity).
- D12-18 -> D12-17 (option payoff structures / parity / synthetic positions / common strategies).
- D15-17 + D15-18 -> D15-16 (portfolio optimization method family).
- D15-20 -> D15-21 (active portfolio diagnostics + performance attribution).
- D19-14 -> D19-13 (relative-value strategy family).
- D21-06 -> D21-07 (management incentives + capital allocation quality).

D02-07 OBV remains OBSERVATION / MERGE_CANDIDATE because high redundancy is known but residual incremental information has not yet been fully falsified.

All historical research evidence and required runtime/explanatory capabilities remain preserved. Formal Core remains LOCKED.

## Shared inventory

- `shared-knowledge/SHARED_RESEARCH_INVENTORY.md` is the cross-system domain/tag inventory. It points to original evidence without relocating it.
- `shared-knowledge/STOCK_MARKET_KNOWLEDGE_LEARNING_MAP.md` is the canonical 22-domain / 354-module learning curriculum and chatroom routing dashboard.
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

### D01 shared handoff — 2026-10-01

K-line/Pattern research added an implementation-level replay/path falsification tranche in research/PATTERN_DL007_IMPLEMENTATION_AND_COUNTEREVIDENCE_V0_1.md. Reusable findings for both systems:
- multi-timeframe agreement is a topology relation, not an independent vote when scales derive from the same PRICE_OHLC root;
- boundary identity/version/coordinates and confirmation clocks are PIT/replay-critical;
- UP/DOWN mirror invariance should be tested before market outcomes because normalization alone can manufacture directional asymmetry;
- constrained price-limit sessions preserve chronology but do not prove ordinary breakout acceptance;
- 2026 Taiwan HS research supports mechanically confirmed turning-point structure but is based on data ending in 2018, so current post-2020 regime transportability remains UNKNOWN;
- 2025 Taiwan historical-high evidence rejects a universal hard resistance veto after a true break, but local-pattern equivalence and effect-size transportability remain unproven.

Status: RESEARCH_ONLY / ALPHA_UNKNOWN / NO_FORMAL_PROMOTION.

- Event transaction/disclosure clock anchor: `EVENT_TRANSACTION_AND_DISCLOSURE_CLOCK_RESEARCH.md` (D11-06 M&A/asset-event lifecycle, D11-09 recurring disclosure windows, D17-13 scheduled/unscheduled taxonomy and PIT replay clocks).

### D01 shared handoff — DL-008 multi-scale incrementality (2026-10-02)

Reusable cross-system rule:
- Source Novelty（來源新穎性） != Representation Novelty（表示新穎性） != Predictive Incrementality（預測增量）.
- Weekly OHLC derived from daily constituents is deterministic aggregation of the same PRICE_OHLC root: no new raw-source vote.
- Temporal aggregation is many-to-one and can lose path information; higher timeframe is not automatically superior.
- A cross-scale topology relation may still be a nonlinear representation candidate relative to finite baseline controls, but its predictive incrementality remains UNKNOWN until prospective/OOS residual testing.
- Reuse the shared overlap classes from Technical Indicator research; do not create separate D01 timeframe-voting semantics.
- Timeframe pair / bar alignment / relation definition belong to the multiple-testing family.
- Repeated scale snapshots do not inflate effective N.
- Pattern nested-resistance inference remains under existing PATTERN-RG2; no R09.

Status: EXECUTABLE_SPEC_WRITTEN / TEST_EXECUTION_PENDING / OUTCOME_CLOSED / FORMAL_CORE_LOCKED.

### D01 shared handoff — DL-009 PATTERN-RG2 nested resistance (2026-10-02)

Reusable rules:
- keep local Pattern trigger boundary distinct from priorHigh20 comparator;
- inherit BASE k=2/120 and MAJOR k=3/260 eligible-session scales; never retune them from outcomes;
- simple 260-session high is a mandatory redundancy comparator for structural-zone claims;
- availableAir is continuous context, never a hard veto by itself;
- separate local-break-below-parent / entered-parent / parent-first-break / hold / reentry / failure states;
- future parent zones cannot be backfilled into historical decisions;
- round-price proximity is a confound control, not an added score;
- one structural relation episode may have many daily snapshots but one independent relation identity.

PATTERN-RG2 remains OUTCOME_CLOSED / ALPHA_UNKNOWN / FORMAL_CORE_LOCKED.

### D01 shared handoff — DL-010 RG2 executable semantics / ownership (2026-10-02)

- RG2 research now has a threshold-free relation calculator and 12 defined adversarial cases; execution receipt is still pending.
- Negative availableAir is preserved and unsigned; no hard resistance veto.
- Cross-lane ownership is frozen: Pattern geometry, Corporate Actions continuity, D02 acceptance, Target-RR target construction, round-price proximity, Microstructure execution mechanics, and Technical-Indicator timeframe taxonomy remain separate canonical owners.
- Do not fork those definitions in System 2; consume the shared objects instead.
Status: RG2_SPEC_EXECUTABLE / TEST_EXECUTION_PENDING / OUTCOME_CLOSED / FORMAL_LOCKED.

### D01 shared handoff — DL-011 Pattern shared-parent schema reconciliation (2026-10-02)

- Legacy Pattern parent_snapshot_hash linkage remains valid for old isolated QA but is superseded for promotion-grade parent authority.
- Future Pattern evidence must attach to the shared immutable decision-state parent using parentDecisionReceiptId + captureGeneration + parentScopeId + semanticFingerprint.
- Pattern requires one ROOT attempt per expected parent and zero/many deterministic episode children; episode count never replaces parent coverage.
- Multi-scale and RG2 provenance fields belong in the Pattern payload, not in a new parent universe.
- Later weekly/15m information cannot backfill an earlier decision-time parent.
- No runtime/D1 wiring is authorized.
Status: DESIGN_RECONCILED / RUNTIME_NOT_IMPLEMENTED / OUTCOME_CLOSED / FORMAL_LOCKED.

### D01 shared handoff — DL-012 Pattern child identity (2026-10-02)

- Pattern uses one ROOT attempt per immutable decision parent plus zero/many deterministic item rows.
- Structural episode identity excludes named-label/lifecycle changes; same anchors remain one episode.
- RG2 relation identity excludes current availableAir/lifecycle state; same local/parent boundary versions remain one relation.
- Same item identity with changed immutable geometry is PROVENANCE_CONFLICT.
- Outcome fields never enter decision-time child identity.
- Tests are authored but execution receipt is still pending.
Status: CHILD_IDENTITY_DESIGN_FROZEN / TEST_EXECUTION_PENDING / RUNTIME_NO_GO / FORMAL_LOCKED.

### D01 shared handoff — DL-013 equal-horizon / boundary sensitivity (2026-10-02)

- Higher-timeframe value must first beat equivalent daily clock-horizon and simple long-horizon geometry controls.
- Shifted bar boundaries are robustness controls, not guaranteed-null placebos.
- featureAgeEligibleSessions and aggregationBoundaryVersion are mandatory provenance for future cross-scale evidence.
- Non-comparable feature-age/session cases remain explicit, never force-paired.
- No post-outcome timeframe/boundary search.
Status: CONTROL_SPEC_FROZEN / OUTCOME_CLOSED / FORMAL_LOCKED.

### D01 shared handoff — DL-014 Pattern fingerprint semantics (2026-10-02)

- Separate immutable structural identity fingerprint from evolving as-of observation payload hash.
- Same item key + changed immutable structural fingerprint is a provenance conflict.
- Same structural episode across later parent/as-of may legitimately have a new observation hash.
- ROOT commits to the episode-item keyset; episode count never replaces parent coverage.
- Outcome/later revisions never enter decision-time fingerprints.
Status: FINGERPRINT_SPEC_FROZEN / RUNTIME_NO_GO / OUTCOME_CLOSED / FORMAL_LOCKED.


### D03 reusable rule update — 2026-10-02

Status: **MECHANISM_AND_FALSIFICATION_DEFINED / NOT_FORMAL_EVIDENCE**.

Reusable cross-system rules from TI-460~473:

1. **ROC duplication firewall.**
   - For identical horizon and price space, standard percent ROC = `100 * retN`.
   - Common Momentum index = `ROC + 100`.
   - Same-horizon log return = `ln(1 + ROC/100)`, preserving rank order for positive prices.
   - Therefore these representations must not receive separate votes/weights. Smoothed/delta ROC remains a same-price-family residual candidate only.

2. **Raw price-difference scale firewall.**
   - `C_t-C_(t-n)` is nominal-price-scale confounded; it can rank a high-priced +10% stock above a low-priced +15% stock.
   - Normalizing by lagged price collapses back to ROC/retN.

3. **EMA64 state-lineage firewall.**
   - Standard EMA64 has mean sample age 31.5 bars, half-life ≈22.179 bars and ~73.677 bars to reduce old-state influence to 10%.
   - A 65-bar local SMA-seeded EMA64 is not assumed replay-equivalent to a canonical long-history EMA64.
   - Future System 2 EMA16/64 resonance evidence must preserve formulaVersion, stateConstructionMode, initializationAnchor, continuity/source/session versions and stateLineageId.

4. **EMA16/64 + Impulse MACD confluence rule.**
   - These are not exact aliases, but both are PRICE_OHLC-derived filters.
   - Agreement begins as within-family confirmation / partial redundancy, not independent cross-family confluence.
   - Residual value must survive direct returns, trend persistence, structure, volatility/Regime, cost and OOS/Shadow checks.

5. **Prospective receipt discipline.**
   - 2026-10-02 TWSE/TPEx session content is publicly present, but extracted chat fetch output is not treated as origin raw-byte observer evidence.
   - The preregistered source/version gate remains 2/3 until receipt-equivalent raw capture exists.

System-use rule:
- System 1 / System 2 must not double-count retN/ROC/Momentum-index/log-return aliases;
- System 2 must not reconstruct EMA64 from an arbitrary short rolling window for promotion-grade evidence without parity proof;
- Formal Core remains LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

## Owner-approved 15-item curriculum governance — 2026-10-03

Canonical detail:
`shared-knowledge/CURRICULUM_15_ITEM_DEPENDENCY_AUDIT_20261003_V0_1.md`

Owner-approved outcome after positive/negative review and Dependency Audit:
- Curriculum keep: D05-13, D19-13.
- Keep with role limitation to context/capability: D06-15, D14-16, D14-19, D21-02.
- Observation / RESEARCH_ONLY: D02-07, D02-08, D12-08, D19-08, D19-12, D19-16, D20-03, D20-05.
- Validation-then-strong-merge candidate: D15-19.
- Immediate retirement: NONE.

Cross-dependency freezes:
- D14-19 / D06-18 / D20-13 remain separate layers: borrow economics -> limits to arbitrage -> actual short execution.
- D12-08 remains separate from D12-09 and D12-13 until signed dealer-position identifiability and prospective evidence are established.
- D15-19 is not merged until D16-25 probability calibration / uncertainty work and position-sizing comparisons are sufficiently mature.

No module count or maturity change. Curriculum remains 22 domains / 354 modules. Formal Core remains LOCKED. No new Hard Gate is authorized.

## Second-round curriculum overlap audit — 2026-10-03

Canonical audit:
`shared-knowledge/CURRICULUM_SECOND_ROUND_OVERLAP_AUDIT_20261003_V0_1.md`

Governance result after scanning all 354 active modules:
- Immediate retirement: NONE.
- Strong future merge candidate: D15-21 <-> D15-22.
- Semantic split-or-merge candidate: D07-17 <-> D21-12.
- Scope de-duplication without full retirement: D16-11 <-> D16-21.
- Fourteen additional high-overlap pairs are retained with explicit producer/consumer, source-family, component/composite, horizon, unit-of-analysis or strategy-interaction boundaries.

No module count, maturity or Formal Core behavior changes. Specialist rooms own validation before any future merge proposal.

## Priority overlap merge acceptance contract — 2026-10-03

Canonical human-readable contract:
`shared-knowledge/CURRICULUM_OVERLAP_MERGE_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

Machine-readable companion:
`shared-knowledge/curriculum_overlap_merge_acceptance_contract_20261003_v0_1.json`

Frozen before specialist results:
- D15-21 vs D15-22 requires a three-way ownership check with D15-16. D15-16 owns pre-trade construction/optimization; D15-21 owns benchmark-relative diagnostics/attribution. D15-22 survives separately only if it proves a third non-duplicated contract.
- D07-17 vs D21-12 may stay separate only if guidance-content quality and governance credibility have distinct observables, decision roles and falsification tests; otherwise a merge proposal is required.
- D16-11 owns generic provenance primitives. D16-21 should retain only alternative-data-specific selection/coverage/leakage/model-drift validation if that residual scope is real.

Allowed terminal governance classifications are MERGE_ELIGIBLE, KEEP_SEPARATE, SCOPE_DEDUP_ONLY and EVIDENCE_INSUFFICIENT.

No module retirement is authorized by the contract itself. Specialist evidence + Dependency Audit + owner approval remain mandatory.

## D16-25 specialist maturity synchronization — 2026-10-03

11｜統計驗證與策略市場狀態研究室 completed the D16-25 conceptual/executable validation contract and explicitly advanced D16-25 from L0 / 0% to **L2 / 40%**.

Evidence owner:
`research/D16_D18_VALIDATION_CHECKPOINT.md`

Supporting artifacts:
- `research/D16_25_PROBABILISTIC_DECISION_RESEARCH_V0_1.md`
- `research/d16_25_probabilistic_decision_contract_v0_1.json`
- `research/D16_25_D15_19_MERGE_DECISION_INPUT_V0_1.md`

Governance synchronization only:
- D16 aggregate maturity becomes **45.6%**.
- Overall 354-module curriculum maturity becomes **32.6%**.
- L3 remains closed because genuine complete Taiwan PIT prediction/outcome/calibration evidence is still missing.
- D15-19 merge/retirement remains NOT EXECUTED.
- Formal Core remains unchanged.

## Priority-B overlap acceptance contract — 2026-10-03

Canonical human-readable contract:
`shared-knowledge/CURRICULUM_PRIORITY_B_OVERLAP_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

Machine-readable companion:
`shared-knowledge/curriculum_priority_b_overlap_acceptance_contract_20261003_v0_1.json`

All 14 Priority-B overlap pairs now have frozen acceptance criteria before specialist evidence returns.

Default posture:
**KEEP_SEPARATE unless strict semantic subsumption is proven.**

Main governance protections:
- producer/consumer boundaries must not be collapsed merely because the same data flows through both modules;
- primitive-state and composite/pattern/strategy-interaction modules must not double-count the same evidence;
- source-family clocks remain separate where failure/revision/latency semantics differ;
- latent behavioral/microstructure mechanisms require observables beyond the primitive input;
- a merge cannot orphan historical evidence, replay, runtime, UI or risk capabilities.

No module count or maturity change. Formal Core remains LOCKED.

