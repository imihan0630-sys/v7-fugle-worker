# Shared Research Master Map

Updated: 2026-10-04 11:46 Asia/Taipei
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

The learning curriculum (22 domains / 356 modules) is a knowledge universe, not an all-domain AND-gate checklist.

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
- `shared-knowledge/STOCK_MARKET_KNOWLEDGE_LEARNING_MAP.md` is the canonical 22-domain / 356-module learning curriculum and chatroom routing dashboard.
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

## Third-round hidden overlap audit — 2026-10-03

Canonical audit:
`shared-knowledge/CURRICULUM_THIRD_ROUND_HIDDEN_OVERLAP_AUDIT_20261003_V0_1.md`

Machine-readable companion:
`shared-knowledge/curriculum_third_round_hidden_overlap_audit_20261003_v0_1.json`

This scan intentionally ignores superficial title similarity and looks for hidden overlap in shared data, mechanism, decision effect and dependency chains.

Governance result:
- 20 hidden-overlap clusters frozen.
- 4 strong consolidation candidates.
- 4 semantic split-or-merge candidates.
- 4 scope de-duplication candidates.
- 8 keep-separate dependency chains with explicit anti-double-count rules.
- Immediate retirement: NONE.

Highest structural-consolidation candidates:
- D09-13 <-> D09-14.
- D14-03 + D14-04 -> D14-17 family.
- D15-13 <-> D15-24.
- D12-14 <-> D12-15.

No module count/maturity/Formal Core change is authorized by this scan.

## H01-H04 consolidation acceptance contract — 2026-10-03

Canonical human-readable contract:
`shared-knowledge/CURRICULUM_H01_H04_CONSOLIDATION_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

Machine-readable companion:
`shared-knowledge/curriculum_h01_h04_consolidation_acceptance_contract_20261003_v0_1.json`

Frozen candidate directions:
- H01 D09-13 vs D09-14: likely merge into an expanded D09-13 Industry Structure / Competitive Dynamics owner if D09-14 cannot prove a distinct firm-strategy contract.
- H02 D14-03 + D14-04 vs D14-17: possible consolidation into a broader Signal-to-Fill / Slippage / Implementation Shortfall family, but mature D14-03/D14-04 evidence may not automatically promote the broader merged umbrella.
- H03 D15-13 vs D15-24: possible unified VaR / Expected Shortfall / Tail Risk Measures owner; VaR and ES semantics/failure modes must both survive.
- H04 D12-14 vs D12-15: likely parent-child consolidation of IV-RV proxy under the Volatility Risk Premium economic concept if no independent decision contract survives.

A Maturity Transfer Firewall is mandatory for all four candidates: no max(), average() or simple carry-forward maturity after a merge.

No merge/retirement is executed by this contract. Specialist evidence + Dependency Audit + anti-orphan verification + owner approval remain mandatory.

## H01-H04 specialist validation packets — 2026-10-03

Execution packets:
`shared-knowledge/CURRICULUM_H01_H04_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

Rooms 07, 09 and 10 can now execute H01-H04 specialist validation directly from the frozen evidence requirements. These packets do not authorize merge, retirement, maturity promotion or Formal Core changes.

## H05-H08 semantic split acceptance contract — 2026-10-03

Canonical contract:
`shared-knowledge/CURRICULUM_H05_H08_SEMANTIC_SPLIT_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

Machine-readable companion:
`shared-knowledge/curriculum_h05_h08_semantic_split_acceptance_contract_20261003_v0_1.json`

Specialist packets:
`shared-knowledge/CURRICULUM_H05_H08_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

Frozen protections:
- D07-25 vs D21-10: statement-level forensic evidence vs audit/restatement/internal-control governance evidence.
- D20-06 vs D06-06: behavioral herding cannot be inferred from crowding alone.
- D20-09 vs D03-05: behavioral overreaction cannot be inferred from price reversal alone.
- D09-11 / D17-11 / D20-11: taxonomy membership, event propagation and behavioral narrative diffusion are separate layers unless specialist evidence proves otherwise.
- Shared source rows/events use one evidence receipt and cannot become duplicate independent votes.

No curriculum count, maturity or Formal Core change.

## H09-H12 scope de-duplication acceptance contract — 2026-10-03

Canonical contract:
`shared-knowledge/CURRICULUM_H09_H12_SCOPE_DEDUP_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

Machine-readable companion:
`shared-knowledge/curriculum_h09_h12_scope_dedup_acceptance_contract_20261003_v0_1.json`

Specialist packets:
`shared-knowledge/CURRICULUM_H09_H12_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

Frozen ownership:
- D16-19 owns model-estimation/calibration methodology; D16-25 owns decision utility/uncertainty/ABSTAIN policy.
- D10-12 owns durable structural issuer exposure; D17-04/05 own event-specific attribution overlays.
- D12-07 is the simple skew/term baseline; D12-16 owns residual complex surface structure only if it adds information beyond that baseline.
- D06-09 -> D06-18 -> D14-19 -> D20-13 forms a four-layer shorting chain from observation to lending economics to execution to limits-to-arbitrage context.

No count, maturity or Formal Core change.

## H13-H20 anti-double-count acceptance contract — 2026-10-03

Canonical contract:
`shared-knowledge/CURRICULUM_H13_H20_ANTI_DOUBLE_COUNT_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

Machine-readable companion:
`shared-knowledge/curriculum_h13_h20_anti_double_count_acceptance_contract_20261003_v0_1.json`

Specialist packets:
`shared-knowledge/CURRICULUM_H13_H20_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

H13-H20 remain separate dependency chains by default. Their governance purpose is to ensure one primitive receipt, explicit producer-consumer linkage, residual incremental-value testing and no duplicate Alpha/risk vote.

No curriculum count, maturity or Formal Core change.

## Third-round H01-H20 execution registry — 2026-10-03

Canonical registry:
`shared-knowledge/CURRICULUM_THIRD_ROUND_EXECUTION_REGISTRY_20261003_V0_1.md`

Machine-readable registry:
`shared-knowledge/curriculum_third_round_execution_registry_20261003_v0_1.json`

Third-round governance packaging is complete for all H01-H20:
- H01-H04 strong consolidation;
- H05-H08 semantic split-or-merge;
- H09-H12 scope de-duplication;
- H13-H20 keep-separate dependency chains.

All 20 clusters now have frozen acceptance rules and specialist validation packets. No third-round retirement has been executed.

## Hybrid role eligibility audit — 2026-10-03

Canonical audit:
`shared-knowledge/HYBRID_ROLE_ELIGIBILITY_AUDIT_20261003_V0_1.md`

Machine-readable overlay:
`shared-knowledge/hybrid_role_eligibility_audit_20261003_v0_1.json`

Specialist packets:
`shared-knowledge/HYBRID_ROLE_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

Governance result:
- 22 domain-level role-eligibility defaults frozen.
- 8 high-risk role-conflict groups frozen.
- Role Eligibility != Actual Strategy Role.
- HARD_INVALIDATION is restricted to factual source/PIT/replay, non-executability, continuity or explicit risk-authority failures.
- Execution/sizing/validation/context modules do not automatically become stock-selection Alpha.
- Behavioral/governance narratives require independent observables.
- Formal Core unchanged.

## Hybrid role execution registry — 2026-10-03

Canonical registry:
`shared-knowledge/HYBRID_ROLE_EXECUTION_REGISTRY_20261003_V0_1.md`

Machine-readable registry:
`shared-knowledge/hybrid_role_execution_registry_20261003_v0_1.json`

R01-R08 role-conflict validation groups are now registered. This is governance input for System 1 A2 and System 2 B1 only; no live role assignment or Formal change is authorized.

## Specialist intake ledger — 2026-10-03

Canonical human-readable intake:
`shared-knowledge/CURRICULUM_SPECIALIST_INTAKE_LEDGER_20261003_V0_1.md`

Machine-readable intake:
`shared-knowledge/curriculum_specialist_intake_ledger_20261003_v0_1.json`

First received third-round packet:
- H05 Room 06 complete and accepted.
- H05 Room 14 counterpart remains required.
- No terminal merge/retirement decision and no maturity change.

## Research-to-Optimization bridge audit — 2026-10-03

Canonical audit:
`shared-knowledge/RESEARCH_TO_OPTIMIZATION_BRIDGE_AUDIT_20261003_V0_1.md`

Machine-readable:
`shared-knowledge/research_to_optimization_bridge_audit_20261003_v0_1.json`

Control-plane conclusion:
- no unsurfaced EVIDENCE_READY candidate was found;
- one canonical candidate lineage remains, already owner-approved/merged/deployed;
- 13 plausible future lanes remain explicitly blocked/watchlisted;
- curriculum maturity and research infrastructure must not be mistaken for Formal optimization readiness.

## D15-19 Kelly merge-governance handoff — 2026-10-03

Specialist task packet:
`shared-knowledge/D15_19_KELLY_SPECIALIST_VALIDATION_PACKET_20261003_V0_1.md`

D16-25 is specialist-complete at L2 for curriculum merge comparison; D15-19 research is now the active missing side.
No maturity transfer, retirement or Formal change is authorized.

## System1 A2 gate-role inventory — 2026-10-03

Canonical:
`shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`

Machine-readable:
`shared-knowledge/system1_a2_gate_role_inventory_20261003_v0_1.json`

Current finding:
21 Formal fail-fast branches collapse safety, confidence, primary evidence and context/supportive evidence. P1 contains 8 likely short-horizon over-hardening candidates; P2 contains 7 secondary review gates. No Formal change is authorized.

## Room 08 special-situations / policy-event long-block — 2026-10-03

Reusable cross-system contract added:
- `SPECIAL_SITUATIONS_POLICY_EVENT_RESEARCH.md`
- `research/d11_d17_special_situations_event_clock_contract_v0_1.json`

Scope:
- D11-15 IPO / Listing / Bookbuilding
- D11-16 Lock-up Expiry / Insider Supply
- D11-17 Secondary Offering / Private Placement
- D11-18 Tender Offer / Going Private / Delisting
- D11-19 Spin-off / Merger Arbitrage / Deal-break Risk
- D17-14 Policy / Regulatory Event Clock / Surprise

Shared rule:
A special-situation or policy label is never sufficient by itself. Proposal/authorization/publication/effective/tradable/settlement/failure/revision clocks remain separate; `capturedAt` is conservative replay availability until native availability is authenticated; missing evidence remains UNKNOWN; failed/withdrawn/repriced paths remain in the research denominator.

Maturity after mechanism/falsification freeze:
- D11 = 50.5% across 19 modules.
- D17 = 41.4% across 14 modules.
- Room 08 module-weighted aggregate = 46.7%.
- Global tracker snapshot after concurrent merge verification = 33.5% across 354 modules.

No Formal Core impact. No FORMAL_OPTIMIZATION_CANDIDATE.

### D01 shared handoff — DL-015/016 RG2 clustering, estimand and observability (2026-10-03)

Reusable cross-room rules:
- one immutable parent owns one outcome vector; multiple Pattern children cannot inflate outcome N;
- primary first-pass RG2 inference requires exactly one de-duplicated relation per parent; multi-relation parents remain explicit coverage/ambiguity, never post-outcome relation selection;
- dependence dimensions are scanDate + symbol; relationEpisodeKey is longitudinal/de-dup identity;
- promotion-grade incremental value must beat B0_FULL_CONTEXT, not only price-only controls;
- first RG2 challenger is availableAirToParentLowerPct + geometryRelationState + compoundLifecycleState + parentZoneAgeEligibleSessions;
- primary target is equal-date weighted common-support B0-vs-B1 predictive-loss differential;
- freeze episode-first, episode-holdout and non-overlapping-date sensitivities before outcomes;
- D16 owns estimator / finite-sample inference / nested-model test / cluster-resampling method; D01 owns Pattern semantics and estimand target;
- shared-child v0.4 canonicalizes complete RG2 coordinates, zone age and relation/lifecycle field names;
- legacy geometryState / compoundState / availableAirPct are not canonical promotion-grade fields;
- RG2_CORE_V0_1 is DESIGN_OBSERVABLE / PROSPECTIVE_RUNTIME_BLOCKED.

Status: PREREGISTERED / OUTCOME_CLOSED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED.

### D01 shared handoff — DL-017 RG2 transition-event identity (2026-10-03)

- current lifecycle state != first transition event;
- repeated daily state snapshots do not increase event N;
- separate eventOccurredAt / eventAvailableAt / firstObservedAt;
- first-event keys exclude event date so clock revision becomes provenance conflict;
- reentry + failure on the same bar share one sourceEventGroupKey;
- local break + parent break can share the same source observation and are not independent votes;
- later transition events are append-only future evidence and never backfill earlier decision-time children;
- constrained breaks preserve structural clocks but ordinary interpretation waits for an eligible unconstrained observation;
- current state cannot reconstruct certified first clocks without complete session/continuity path;
- shared-child v0.5 is design-only; prospective clock capture remains blocked.

Status: EVENT_IDENTITY_FROZEN / TEST_EXECUTION_PENDING / OUTCOME_CLOSED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED.

### D01 shared handoff — DL-018 canonical lifecycle clock bundle (2026-10-03)

- RG2 must reuse the canonical Pattern breakout lifecycle for break/reentry/failure/reclaim clocks; do not fork definitions;
- first-event certification requires exact eligible-session date-set completeness, not count equality;
- required future commitments: expectedEligibleSessionDateSetHash and continuityBarDateSetHash with zero unresolved missing sessions;
- current shared continuity semantics already require exact date-set equality, but explicit machine-readable set commitments are an upstream extension requirement;
- RG2-specific clocks are close-based first parent-zone entry and first later post-break outside close;
- direct gap above the parent zone may have no close-based entry event;
- first post-break outside close is persistence, not acceptance or an N-bar rule;
- D01 research SHA-256 fixture hashing is not an upstream production hash decision.

Status: CLOCK_BUNDLE_DESIGN_FROZEN / UPSTREAM_RECEIPT_EXTENSION_REQUIRED / TEST_EXECUTION_PENDING / OUTCOME_CLOSED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED.


### D03 reusable rule update — 2026-10-03

Status: **TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / NOT_FORMAL_EVIDENCE**.

Reusable rules from TI-474~481:

1. **Persistence-score family rule.**
   - Current `persistenceScoreResearch` is 35% positive-day ratio + 25% ret5/10/20/60 sign consistency + 20% 20-day drawdown quality + 20% MA20/60 location.
   - All four components derive from one Close path. The composite is a path-quality summary, not an independent cross-family vote beside its own components.

2. **Path information is real but not automatically alpha.**
   - Two paths with identical ret5/10/20/60 endpoints can score 100 vs 84.25 due to daily sign frequency.
   - This proves information distinct from endpoint return level, but only at the mechanism level.

3. **Taiwan zero-return/tick/liquidity firewall.**
   - positiveDayRatio20 treats zero-return sessions as non-positive.
   - Current TWSE tiered tick sizes can mechanically alter observed zero-return frequency for the same latent percentage path.
   - Any future persistence inference must control relative tick / price tier, zeroReturnRatio20, liquidity and constrained/special-session state.

4. **Score magnitude is stepwise, not calibrated confidence.**
   - one positive day = 1.75 score points;
   - one ret-horizon sign flip = 6.25;
   - one MA20/MA60 state flip = 10;
   - 1% additional max drawdown = -1 point until the -20% floor.
   - Do not interpret raw score distance as probability distance.

5. **Literature construct separation.**
   - Chen-Hsieh-Lee (2023) momentum persistency is consecutive winner/loser membership duration, not this own-path composite.
   - Cross-sectional rank persistence remains a separate prospective-only research construct; historical duration may not be fabricated.

6. **Maturity / system rule.**
   - D03-03 is now L3/60 because Taiwan PIT data/source semantics are feasible and replay requirements are explicit.
   - System 1 / System 2 must preserve component provenance and avoid composite+component double counting.
   - No Formal change; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.


### D03 repaint-safe divergence rule — 2026-10-03

Status: **TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / OUTCOME_UNKNOWN**.

- A divergence chart may anchor geometry to `pivotAt`, but the legal signal clock is `firstObservableAt` and cannot precede `confirmedAt`.
- Primary v0.1 uses the two most recent consecutive confirmed same-type/same-scale Pattern pivots; no skipped-pivot or strongest-pair cherry-picking.
- Confirmation lag and price movement between pivot and confirmation are explicit costs; pre-confirmation movement is never post-signal alpha.
- Later pivots create new episodes; they cannot rewrite an earlier divergence episode's first-observed identity.
- Divergence is Pattern × Indicator interaction evidence. Pattern pivot geometry, RSI/KD/MACD divergence labels and pivot confirmation cannot be multiplied into independent votes without redundancy accounting.
- D03-12 is L3/60 because Pattern confirmed-swing clocks and D03 indicator state lineage are PIT-joinable under existing source/continuity/parent provenance.
- No outcome authority or Formal change. `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

### D01 shared handoff — DL-019 lifecycle redundancy (2026-10-03)

- lifecycle can contain genuine path memory relative to current geometry only;
- lifecycle remains derived from the same PRICE_OHLC root and has no new source novelty;
- frozen ladder: C0 geometry -> C1 continuous path -> C2 complete first-event-clock path -> C3 categorical lifecycle;
- promotion-grade category value must beat FLEXIBLE(C2), not merely geometry-only or linear-C2;
- same complete path + different lifecycle label is semantic contradiction;
- categories may remain valuable for explanation/audit/event indexing even if alpha incrementality is zero;
- D16 owns nonlinear estimator / finite-sample inference; D01 owns lifecycle semantics.

Status: LIFECYCLE_REDUNDANCY_SPEC_FROZEN / TEST_EXECUTION_PENDING / OUTCOME_CLOSED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED.

### D01 shared handoff — DL-020 minimal continuous Pattern basis (2026-10-03)

- Pattern C2 is decomposed into PB1 geometry, PB2 path excursion, PB3 exposure/observability, PB4 first-event clocks, PB5 structural identity/age, PB6 derived lifecycle representation;
- exact aliases / nested transforms remain useful views but are not independent votes;
- eligible = observable + constrained under complete accounting;
- geometry/lifecycle categorical states are derived from lower-level structural/path information when the basis is complete;
- availableAirPct / centerDistancePct / ATR-normalized air are scaling/reference alternatives of shared geometry, not three source families;
- future lifecycle inference must report flexible FULL_C2 and flexible MINIMAL_C2 sensitivity;
- predictive minimal basis does not authorize deletion of audit/provenance fields from prospective storage.

Status: MINIMAL_PATH_BASIS_FROZEN / TEST_EXECUTION_PENDING / OUTCOME_CLOSED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED.

### D01 shared handoff — DL-021 first-event clock PIT/censoring (2026-10-03)

- decision-time Pattern predictors may use only event clocks occurred/available/observed by the parent cutoff;
- not-yet-occurred is right-censored through asOf, not age=0 and not UNKNOWN;
- future first-event dates are outcome-side information and never backfill earlier decision-time children;
- age zero means event occurred on the current eligible session;
- first-event timing can carry path-order memory beyond aggregate excursions but has no new source novelty;
- same-bar reentry+failure remain nested and share one source-event group;
- continuous eligible-session age is primary; arbitrary N-bar duration buckets are rejected by default;
- D16/statistical validation owns future censored-event estimator choice.

Status: FIRST_EVENT_PIT_SPEC_FROZEN / TEST_EXECUTION_PENDING / OUTCOME_CLOSED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED.

## Room 08 continuation — D11-15 L3 IPO PIT + D17-14 clock-lane evidence — 2026-10-03

Room 08 added two durable receipts:
- `research/d11_15_ipo_pit_receipt_v0_1.json`
- `research/d17_14_policy_clock_receipt_v0_1.json`

Shared conclusions:
- D11-15 IPO/Listing/Bookbuilding advances L2 -> L3 for Taiwan date-level PIT/source feasibility. Withdrawn/reapplied cases remain part of the population; historical intraday first-known is still UNKNOWN.
- D17-14 policy clock sublane is date-level PIT-feasible, but the full module stays L2 because policy Surprise requires a separately archived ex-ante expectation source.
- Publication, legal effective date and market observability are different clocks. Retroactive legal effect cannot backdate information.
- No outcome evidence and no Formal Core impact.

Current Room 08 canonical maturity after this update:
- D11 = 51.6%
- D17 = 41.4%
- Room 08 module-weighted = 47.3%

### D01 shared handoff — DL-022~027 recurrent Pattern path governance (2026-10-03)

Reusable rules:
- complete first-event order is derived from certified event clocks/source groups; do not count clocks + order + lifecycle as independent confirmations;
- repeated cycles add longitudinal path memory beyond first events but remain the same PRICE_OHLC source family;
- repeated event count does not increase independent N and must carry observable/constrained exposure;
- failure is nested severity inside return groups; coarse RETURN/RECLAIM alternation is mostly deterministic;
- repeated-cycle features are time-varying: only later immutable parents may consume history already known by their cutoff;
- NOT_YET_AT_REPEAT_RISK is not zero events;
- repeated-cycle frequency must be controlled for volatility, zone width, tick/price resolution, liquidity, constrained sessions, D02 acceptance and regime;
- true structural zones should be challenged by parent-specific non-anchor horizontal mechanism controls built only from pre-confirmation causal data;
- pseudo-zones are mechanism negative controls, not guaranteed-null placebos;
- no post-outcome control selection/pruning.

Status: DL022_027_SPEC_FROZEN / ALL_NEW_TESTS_EXECUTION_PENDING / OUTCOME_CLOSED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED.


### D03 multi-timeframe / continuation / pullback rule — 2026-10-03

Status: **PIT_FEASIBILITY_ADVANCED / OUTCOMES_CLOSED / FORMAL_LOCKED**.

Reusable cross-system rules from TI-491~525:

1. **Multi-timeframe causal clocks.**
   - Preserve barStartAt, barEndAt and featureKnownAt separately.
   - Weekly is calendar-aware aggregation of eligible Daily bars; partial Weekly and completed Weekly are different causal states.
   - Daily LIVE is PROVISIONAL; FINAL plus independent close confirmation is CONFIRMED.
   - Current zero-extra-call M15 path covers 17/18 regular-session slots (09:00..13:00 starts, through 13:15) and does not observe the 13:15–13:30 closing bar. Never impute a closing-M15 state.
   - Weekly/Daily/M15 alignment is hierarchical context, not independent vote counting.

2. **Momentum continuation construct firewall.**
   - D03-02 owns current return/momentum level; D03-03 owns persistence; D03-04 owns the post-decision continuation/reversal relation.
   - Rolling future retN sign retention is rejected as a primary continuation outcome because it reuses pre-decision observations.
   - Primary continuation outcomes must be exact post-parent D5/D10/D20 return plus MFE/MAE under symbol-session/corporate-action provenance.
   - Winner-rank retention and economic forward return are separate outcomes.

3. **Pullback/reversal ownership firewall.**
   - Generic short-term reversal is rejected/redundant with the existing A/PULLBACK structure + 15m confirmation.
   - Pullback depth is not pullback cause.
   - Pullback origin is diagnostic/moderator only and consumes owner-lane receipts.
   - Liquidity-pressure origin stays UNKNOWN without D05 pressure/depth/price-response/replenishment/capture-completeness evidence; candle morphology is not a substitute.

4. **Maturity.**
   - D03-13 L3/60, bounded intraday coverage explicit.
   - D03-04 L3/60, non-overlapping forward-outcome contract explicit.
   - D03-05 remains L2/40 because origin attribution is data-gated.
   - Active 12-module D03 aggregate = 55.0%.
   - Raw-byte prospective source gate remains 2/3; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

## Curriculum coverage audit — 2026-10-03

Canonical audit:
`shared-knowledge/CURRICULUM_COVERAGE_AUDIT_20261003_V0_1.md`

Machine-readable registry:
`shared-knowledge/curriculum_coverage_audit_20261003_v0_1.json`

Mainline purpose:
- identify missing knowledge families;
- identify scopes that are too narrow;
- identify research that exists but lacks an active curriculum owner;
- avoid automatic module-count growth.

First pass:
- 12 candidates;
- 0 module additions;
- 0 new domains;
- no 23rd domain justified yet.

Coverage-A high priority routes to D01, D05, D07, D10, D12, D20, D21 and D22 owner rooms.



## Curriculum Coverage-A specialist execution — 2026-10-03

Canonical packet:
`shared-knowledge/CURRICULUM_COVERAGE_A_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

Execution registry:
- `shared-knowledge/CURRICULUM_COVERAGE_EXECUTION_REGISTRY_20261003_V0_1.md`
- `shared-knowledge/curriculum_coverage_execution_registry_20261003_v0_1.json`

Current state:
- Coverage-A eight high-priority candidates have executable specialist packets.
- All eight are `PENDING_SPECIALIST_RETURN`.
- Coverage-B remains queued.
- No specialist return has yet changed the curriculum.
- Canonical curriculum remains 22 domains / 354 active modules.
- Latest tracker maturity at packet creation: 36.3%.
- Formal Core remains LOCKED.

00｜研究總控室 next action:
intake the first Coverage-A specialist return, then perform Dependency Audit, overlap recheck, anti-orphan validation and owner-approval gating before any atomic curriculum update.


## Curriculum Coverage-B specialist execution — 2026-10-03

Canonical packet:
`shared-knowledge/CURRICULUM_COVERAGE_B_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

Current state:
- COV-03 → 05｜法人與籌碼研究室: PENDING_SPECIALIST_RETURN.
- COV-05 → 06｜基本面與估值研究室: PENDING_SPECIALIST_RETURN.
- COV-08 → 11｜統計驗證與策略市場狀態研究室: PENDING_SPECIALIST_RETURN.
- COV-09 → 12｜資產定價與因子研究室: PENDING_SPECIALIST_RETURN.
- No curriculum structural change is authorized by packet creation.
- Canonical curriculum remains 22 domains / 354 active modules at packet creation.
- Formal Core remains LOCKED.


## Curriculum Coverage pre-intake evidence — 2026-10-03

- Ledger: `shared-knowledge/CURRICULUM_COVERAGE_PREINTAKE_EVIDENCE_LEDGER_20261003_V0_1.md`.
- COV-02 / D05: PARTIAL_EVIDENCE_RECEIVED.
- COV-07 / D12: PARTIAL_EVIDENCE_RECEIVED.
- COV-08 / D16: PARTIAL_EVIDENCE_RECEIVED.
- Accepted specialist returns: 0 / 12.
- Canonical curriculum remains 22 domains / 354 active modules.
- Formal Core remains LOCKED.


## Curriculum Coverage pre-intake second harvest — 2026-10-03

Additional partial evidence:
- COV-01 / D01 → PARTIAL_EVIDENCE_RECEIVED.
- COV-09 / D19 → PARTIAL_EVIDENCE_RECEIVED.
- COV-10 / D20 → PARTIAL_EVIDENCE_RECEIVED.

Combined partial evidence: 6 / 12 candidates.
Accepted specialist returns: 0 / 12.
Canonical curriculum remains 22 domains / 354 active modules.
Formal Core remains LOCKED.


## Curriculum Coverage pre-intake third harvest — 2026-10-03

- COV-11 / D21 → PARTIAL_EVIDENCE_RECEIVED.
- Combined partial evidence: 7 / 12 candidates.
- Accepted specialist returns: 0 / 12.
- Canonical curriculum remains 22 domains / 354 active modules.
- Formal Core remains LOCKED.


## Curriculum Coverage pre-intake fourth harvest — 2026-10-03

- COV-06 / D10 → PARTIAL_EVIDENCE_RECEIVED.
- Combined partial evidence: 8 / 12 candidates.
- Still pending without accepted partial evidence: COV-03, COV-04, COV-05, COV-12.
- Accepted specialist returns: 0 / 12.
- Canonical curriculum remains 22 domains / 354 active modules.
- Formal Core remains LOCKED.


## Curriculum Coverage pending evidence deficit matrix — 2026-10-03

Canonical matrix:
`shared-knowledge/CURRICULUM_COVERAGE_PENDING_EVIDENCE_DEFICIT_MATRIX_20261003_V0_1.md`

Current pre-intake distribution:
- PARTIAL_EVIDENCE_RECEIVED: 8 / 12.
- PENDING_SPECIALIST_RETURN without accepted partial evidence: COV-03, COV-04, COV-05, COV-12.
- RETURN_ACCEPTED_FOR_INTAKE: 0 / 12.

Canonical curriculum remains 22 domains / 354 active modules.
Formal Core remains LOCKED.


## Coverage specialist return intake contract — 2026-10-03

Canonical template:
`shared-knowledge/CURRICULUM_COVERAGE_SPECIALIST_RETURN_INTAKE_TEMPLATE_20261003_V0_1.md`

Machine schema:
`shared-knowledge/curriculum_coverage_specialist_return_schema_v0_1.json`

Purpose:
standardize the first formal handoff from specialist rooms to 00｜研究總控室.
No curriculum structural change is implied by return acceptance.


## Coverage governance state machine — 2026-10-03

Canonical contract:
`shared-knowledge/CURRICULUM_COVERAGE_GOVERNANCE_STATE_MACHINE_V0_1.md`

Machine graph:
`shared-knowledge/curriculum_coverage_governance_state_machine_v0_1.json`

State progression is now formally constrained. No curriculum structural change may bypass the frozen transition graph.

## 2026-10-03 late continuation — D11-16 lockup source gap + D11-17 private-placement L3

Room 08 durable additions:
- `research/d11_16_lockup_source_gap_receipt_v0_1.json`
- `research/d11_17_private_placement_pit_receipt_v0_1.json`

Reusable rules:
- Lock-up expiry is potential supply only; release eligibility, custody withdrawal, transfer declaration and realized sale are different states.
- A source that does not cover an issuer yields UNKNOWN, not NO_SALE.
- Private-placement authorization, pricing, payment, delivery, restricted holding, public issuance and listing are separate PIT clocks.
- Failed/rescheduled private-placement rounds stay in the denominator.
- Registered-issued, listed-common, tradable and private-placement share spaces remain non-interchangeable.

Canonical Room08 maturity after this continuation:
- D11 = 52.6%
- D17 = 41.4%
- Room08 module-weighted = 47.9%
- global tracker = 37.8% across 354 modules.

Formal Core unchanged. No FORMAL_OPTIMIZATION_CANDIDATE.

## 2026-10-03 late continuation — D11-18 tender-offer L3

Added: `research/d11_18_tender_offer_pit_receipt_v0_1.json`.

Reusable tender-offer rule:
- filing/announcement, condition achievement, regulatory approval, extension, period expiry, actual transaction, payment/settlement and delisting are distinct states;
- extension/correction appends a new version and never rewrites the original state;
- oversubscription creates allocation/return mechanics;
- offer spread is not risk-free convergence;
- failed offers must enter future outcome denominators.

D11-18 = L3 Taiwan PIT/source feasibility. Failed-tender negative control remains required before L4.
Current Room08: D11=53.7%, D17=41.4%, module-weighted=48.5%.


### D03 observable pullback/reversal rule — 2026-10-04

Status: **TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / ORIGIN_OPTIONAL**.

Owner-approved H07 separates:
- D03-05 observable pullback/reversal price phenomenon;
- D20-09 behavioral overreaction cause;
- D05/D08/D09/D18 causal/context owner receipts.

Reusable rule:
1. Observable episode existence does not require causal-origin certainty.
2. Daily parent may reuse frozen A/PULLBACK geometry; completed M15 episode chronology must use exact contiguous expected slots.
3. Zone entry/reversal seed is not confirmation. Confirmation requires a later completed bar with higher-low + bullish turn-up.
4. Signal time is confirmation-bar known-at, never backdated to the pullback low.
5. Failed zone-break/down-volume states are first-class and episode history is append-only.
6. Missing owner-cause evidence => UNKNOWN_ORIGIN; candle morphology never proves liquidity pressure.
7. Generic short-term reversal factor remains rejected/redundant.
8. D03-05 is L3/60 for the observable phenomenon only; no alpha/Formal claim.

Raw source-version 3/3 is a necessary source-clock gate, not sufficient proof of full Technical Indicator R1/R4/R5 readiness. Immutable parent, TECHNICAL_CONTINUITY, symbol-session/price-limit and state-construction gates remain separate.


### D03 primary queue preregistration rule — 2026-10-04

Status: **OUTCOME_CLOSED / PREREGISTERED / NOT_EXECUTABLE**.

Reusable governance:
- D03 raw source-version 3/3 is necessary but not sufficient for Technical Indicator inference.
- System2 2026-10-02 diagnostic/source hashes are not receipt-equivalent to the frozen D03 raw observer and do not change the D03 denominator from 2/3.
- After 3/3, full Technical observer readiness still requires immutable Level-B parent keyset/generation, shared TECHNICAL_CONTINUITY, symbol-session/price-limit provenance, exact attempt accounting, frozen stateConstructionMode and replay/prefix parity.
- TI-005 executes before TI-006 when/if inference gates open.
- TI-005 tests B2 rolling-range information and RSI14 signed-return balance through K0→K4 nested common-support models; no zone/threshold vote.
- TI-006 tests normalized DIF and non-alias MACD transition/curvature through M0→M3; zero-line/EMA-alignment and crossover/Histogram-sign aliases are excluded.
- Primary outcome family is D5 return/MFE/MAE; D10/D20 are registered secondary and cannot rescue failed D5.
- D16 must freeze the dependence-aware estimator/method receipt before outcomes.
- Minimum inference floors remain D5 mature >=60, prospective complete >=30, independent scan dates >=15, >=2 Regimes, purged train >=10 dates, holdout >=5 dates plus coverage/zero-pick/redundancy/cost/overfit gates.
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.


## AOKD external sweep V0.2 — 2026-10-04

New discovery only: 37 topic triages / 31 requested families; Layer A35/B1/C1/D0. No new specialist-ready or confirmed true-gap candidate. AOKD-05 material filing-delta = scope-extension research, corpus/clock/owner triage pending. AOKD-06 B2B payment behavior = Taiwan historical PIT data blocked; inspected detail API is US-only. Existing AOKD01–04 states preserved; D07-33 exists but expected A01 specialist-return path not found at read; 00 reconcile without new COV.

Canonical report: `shared-knowledge/AOKD_EXTERNAL_SWEEP_20261004_V0_2.md`.
Full registry: `shared-knowledge/aokd_external_sweep_registry_20261004_v0_2.json`.
Exact 00 cursor: `shared-knowledge/AOKD_00_CONTINUATION_CHECKPOINT_20261004_V0_2.md`.
After A06, three meaningful follow-up rounds found no additional retained families; bounded sweep temporarily saturated, not universal literature completeness. Counterevidence, full owner scopes, data/clock/missingness/licensing limits and incremental-test gates are recorded. Mostly abstract/documentation-level evidence; no Taiwan alpha/OOS claim. Next: source receipts and existing-owner scope triage, not Coverage promotion.

Baseline read: 22 domains / 354 modules / 41.5% maturity at ca844efda3809050238986acb1a160e2d439a428. Maturity movement belongs to parallel rooms; this docs-only checkpoint does not change tracker, owner, modules, domains, Formal behavior or runtime. Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE NONE. Research 07:20:54–07:40:28 Taipei; Git commit timestamps record checkpoint persistence.

## 2026-10-04 continuation — D11-19 merger-arbitrage / deal-break L3

Added: `research/d11_19_merger_arbitrage_pit_receipt_v0_1.json`.

Reusable rules:
- transaction-state ownership stays in D11-06; D11-19 must not create a duplicate event vote;
- deal consideration is versioned: original exchange ratio/consideration and later revised terms are different known-at states;
- deal cancellation, transaction-structure change, extension and close append new lifecycle states;
- deal spread is not expected return without success probability, time, funding, taxes/fees/slippage, hedge/borrow and break-loss assumptions;
- demerger/spin-off parent, child and stub claims remain separate; unsourced child tradability/entitlement stays UNKNOWN.

D11-19 = L3 Taiwan PIT/source feasibility.
Room08 after this update: D11=54.7%, D17=41.4%, module-weighted=49.1%.
Formal Core unchanged.


## COV-04 / COV-05 owner-approved canonical execution — 2026-10-04

Owner explicitly approved both structural dispositions after 00-room specialist-return Intake, Dependency Audit, overlap recheck, anti-double-count and anti-orphan review.

Executed:
- **COV-04 → ADD_MODULE**: created **D07-34 Dividend / Payout Policy & Sustainability（股利／配發政策與永續性）**, starting at **L0 / 0%**. It owns payout source / earnings-CFO-FCF coverage / retention / frequency / cut-suspension / sustainability semantics, while raw earnings/cash flow/leverage stay with D07-02/05/06, dividend event clocks stay with D11, and capital-allocation governance stays with D21.
- **COV-05 → EXTEND_EXISTING_SCOPE**: expanded **D08-06** into the coordinated **EV/EBITDA / EV/Sales / P/S** enterprise-and-sales multiple family. D08-06 remains **L2 / 40%**; P/S and EV/Sales sub-capabilities do **not** inherit L2 evidence and still require their own PIT/replay/Shadow/OOS validation.

Canonical post-update curriculum:
- domains: 22
- active modules: 355
- weighted maturity: 42.3%
- D07: 34 modules / 14.1%
- D08: 19 modules / 27.4%

Pre-update latest-main snapshot at execution time:
- active modules: 354
- weighted maturity: 42.4%

The small aggregate maturity decrease versus the immediately prior tracker is denominator expansion from the new L0 module, not research regression.

Canonical receipts:
- `shared-knowledge/CURRICULUM_COV04_COV05_CANONICAL_UPDATE_RECEIPT_20261004_V0_1.md`
- `shared-knowledge/curriculum_cov04_cov05_canonical_update_receipt_20261004_v0_1.json`

Formal Core remains LOCKED. No System 1 / System 2 Formal behavior change is authorized.


## COV-03 owner-approved canonical execution — 2026-10-04

Owner explicitly approved COV-03 after 00-room formal Intake, Dependency Audit, overlap recheck, anti-double-count and anti-orphan review.

Executed:
- **COV-03 → ADD_MODULE**: created **D06-19 Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）** at **L0 / 0%**, owned by D06 / 05｜法人與籌碼研究室.
- D06-19 owns only directly identified natural-person participation / ownership / channel activity and future direct directional flow when a true source exists.
- Margin financing, day trading, odd-lot activity, broker-branch activity and total-minus-institution residuals are forbidden substitutes for direct retail identity/flow.
- Domestic natural-person stock×date directional flow remains UNKNOWN until a PIT-safe authoritative source contract exists.
- D20 behavioral interpretations may consume the same primitive receipt but may not create a duplicate independent vote.
- Retired ID D06-17 remains absorbed into D06-16 and was not reused.

Canonical post-update curriculum:
- domains: 22
- active modules: **356**
- weighted maturity: **43.4%**
- D06: **18 modules / 45.6%**

The maturity decrease is denominator expansion from a new L0 module, not loss of prior evidence. Formal Core, System1 Formal and System2 Formal remain unchanged.


## H01 owner-approved canonical scope cleanup — 2026-10-04

Owner approved the 00-room H01 Dependency / anti-orphan audit.

Terminal governance result:
- **KEEP_SEPARATE**;
- implementation = **SCOPE_DEDUP_ONLY**;
- no retirement, module-count change, maturity change or Formal Core change.

Canonical ownership:
- **D09-13 Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）** — industry × explicit product/geographic market definition × vintage; owns market-share level/distribution, rivalry, entry barriers, substitution, bargaining power and industry capacity/price/margin structure.
- **D09-14 Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動）** — issuer × observable strategic action × implementation stage × vintage; owns firm-specific action lifecycle, including capacity preemption, product/technology/geography positioning, alliance/M&A/vertical integration, competitor response and attributable post-action position change.

Anti-double-count:
- market-share, capacity, price, margin, customer and supplier observations have one parent evidence receipt;
- without firm-specific action fields, the observation belongs only to D09-13;
- D09-14 may link attributable post-action change as an outcome, not cast a duplicate simultaneous factor;
- D10 physical-capacity evidence and D11/D17 event clocks remain dependencies, not duplicated ownership.

Both modules remain L3/60%.
This section supersedes earlier H01 language that treated merger into D09-13 as the likely outcome.

### D11/D17 shared handoff — lock-up transition replay + policy expectation source (2026-10-04)

Reusable cross-system findings:
- D11-16: the TWSE 2026-01-09 Taiwan Innovation Board amendment creates a mandatory rule-version/transition boundary for historical replay. For qualifying already-listed domestic TIB issuers, legal release eligibility still does not equal actual custody withdrawal; issuer application and TWSE-approved releasable quantity/date can be an intervening official state.
- D11-16 remains L2. Required chain remains issuer qualification/custody quantity -> transition applicability -> release approval/withdrawal -> transfer pre-declaration -> subsequent official holdings/untransferred state. Missing API/source coverage is UNKNOWN, never NO_SALE.
- D17-14: two independent 2026 CBC decisions now have dated Reuters ex-ante forecast distributions before the decision and compatible official CBC realization records. The missing expectation-source feasibility blocker is closed.
- Preserve the full expectation distribution. Do not choose mean/median/mode or a scalar surprise functional after observing the policy decision or equity returns.
- CBC macro-policy state and controls remain D13-owned; D17 owns event identity, expectation/surprise clock and transmission evidence. No double factor vote.
- D17-14 advances L2 -> L3 for Taiwan PIT/source feasibility only. Both historical witnesses matched the modal expectation; no policy-event alpha or equity-return outcome is claimed.
- Future L4 work requires prospective capturedAt/version archives, preregistered surprise functional/event-zero/horizons, common-support controls, costs and OOS/Shadow evidence.

Room 08 current formal maturity after this handoff:
- D11 = 54.7% across 19 modules.
- D17 = 42.9% across 14 modules.
- Room 08 module-weighted aggregate = 49.7% across 33 modules.

Evidence:
- `research/d11_16_lockup_transition_deepening_receipt_v0_2.json`
- `research/d17_14_expectation_source_receipt_v0_1.json`

Formal Core unchanged. Outcome joins remain closed.


## COV-02 owner-approved canonical scope extension — 2026-10-04

COV-02 is structurally closed.

- Target: D05-06.
- Canonical name: `Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`.
- Action: `EXTEND_EXISTING_SCOPE`.
- Module count: unchanged.
- D05-06 maturity: L2 / 40%, unchanged.
- Scope: opening + closing auction mechanics, explicit auction-phase states, prospective trial/indicative observations when actually captured, and final auction state.
- Historical pre-close imbalance remains UNKNOWN where no timestamped source exists; never reconstruct from final close/volume.
- One auction episode uses one D05-06 parent primitive. D05-14 integrity, D14 execution, D11/D17 event clocks and D02 EOD volume are consumers/context, not independent duplicate votes.
- System1/System2 Formal behavior: unchanged.
- Formal Core: LOCKED.


## H14 canonical no-structural-change closure — 2026-10-04

H14 (D06-11 vs D11-14) is closed as:
`KEEP_SEPARATE / PRODUCER_CONSUMER_EVENT_FLOW_BOUNDARY / SINGLE_EVENT_RECEIPT`.

Canonical boundary:
- D11-14 owns index-adjustment event identity, announcement/effective lifecycle and event revision/version semantics.
- D06-11 owns realized passive/index fund flow and rebalancing stock/flow.
- D06-16 owns ETF creation/redemption/AP/PCF/tracking mechanics.

Anti-double-count:
- one D11-14 eventReceiptId;
- D06-11 flow may be incremental only when measured beyond event expectation;
- event-imputed flow is not an independent vote;
- missing realized flow remains UNKNOWN;
- downstream price/volume/auction/execution transforms do not clone the parent event.

Maturity unchanged:
- D06-11 L2/40%;
- D11-14 L3/60%.

No merge, retirement, rename, module-count or Formal Core change.

Audit:
`shared-knowledge/CURRICULUM_H14_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

H06 is separately PARTIAL_EVIDENCE_RECEIVED from Room05; Room13 independent behavioral counterpart remains required.


## H09 owner-approved canonical scope de-dup — 2026-10-04

H09 is structurally closed as:
`KEEP_SEPARATE / SCOPE_DEDUP_ONLY`.

Canonical ownership:
- D16-19 = model estimation / calibration implementation and diagnostics producer;
- D16-25 = calibrated-belief decision-policy consumer.

Shared interface:
`CalibrationReceipt → PredictiveDecisionReceipt`.

Anti-double-count:
- one calibrated probability/distribution authority per modelVersion × calibrationVersion × target × horizon × population;
- D16-25 may consume calibration-quality metadata and abstain, but cannot fit a second calibrator or count Brier/log-loss/reliability twice;
- ranking discrimination, probability calibration and trading utility remain separate estimands;
- D15 sizing cannot invent a downstream probability authority.

Both modules remain L2/40%. Names, module count, aggregate maturity, System1/System2 Formal behavior and production runtime are unchanged.

Audit:
`shared-knowledge/CURRICULUM_H09_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.


### D03 TPEx continuity-source / Bollinger acceptance rule — 2026-10-04

Status: **BOUNDED_PHYSICAL_SOURCE_PASS / ACCEPTANCE_LOGIC_PASS / GENUINE_PARENT_PENDING**.

Reusable rules from TI-594~610:

1. **TPEx halt/resumption machine source**
   - official action `bulletin/sprcHis`;
   - 2026 mainboard bounded JSON population = 30/30;
   - official CSV has the identical 30-key population;
   - valid source-local zero is HTTP/schema-valid `stat=ok` with zero rows/total, never a transport failure.

2. **TPEx price-reset sources**
   - `bulletin/exDailyQ`: ex-right/ex-dividend actual-result source, physically 587/587 rows in the frozen 2026-07-01..2026-10-04 interval with JSON/CSV equivalence;
   - `bulletin/revivt`: capital-reduction resumption/reference source, physically 11/11 rows in the frozen 2026-01-01..2026-10-04 interval with JSON/CSV equivalence;
   - these sources provide official reference-price/reset fields needed to avoid treating mechanical resets as ordinary price momentum.

3. **Knowledge-time firewall**
   - shared continuity archive may use `PROSPECTIVE_OBSERVED`;
   - source `fetchedAt` is a conservative knowledge-time upper bound only when captured no later than parent cutoff;
   - later capture never backfills prior parent truth.

4. **Bollinger L3 acceptance rule**
   - reuse the shared V8.17 immutable parent identity;
   - require exactly 20 eligible TECHNICAL_CONTINUITY closes, population standard deviation, no missing/duplicate sessions, source-known-at <= parent-known-at, corporate-action resolution and explicit constrained-state provenance;
   - every expected parent must have exactly one attempt; UNKNOWN/BLOCKED are persisted states, not missing rows;
   - dedicated outcome-blind workflow `37182674404` physically passes the acceptance fixtures.

5. **Maturity firewall**
   - source capability + synthetic acceptance PASS do not substitute for the first genuine post-deployment parent generation;
   - D03-10 remains L2/40 and D03 remains 56.7% until a genuine parent run is COMPLETE;
   - if Bollinger reaches L3, D03 becomes 58.3%;
   - ADX requires an additional canonical recursive replay/trusted-state gate and would move D03 to 60.0% only if that gate passes.

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.


## H06 / H07 canonical no-structural-change closures — 2026-10-04

### H06
`KEEP_SEPARATE / BOUNDED_SOCIAL_HERDING_SUBLANE / SHARED_SOCIAL_RECEIPT_FIREWALL`.

- D06-06 owns observable crowding.
- D20-06 owns bounded public-forum social-herding only when independent PIT-capable behavior evidence survives common-news/topic/attention/market-sector controls.
- PTT handles are public forum actors, not brokerage investors.
- one social receipt cannot generate independent D20-06/D20-11/D20-07 votes.
- both D06-06 and D20-06 remain L3/60%.
- state = CLOSED_NO_STRUCTURAL_CHANGE.

Audit:
`shared-knowledge/CURRICULUM_H06_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

### H07
`KEEP_SEPARATE / EVENT_CONDITIONED_OVERREACTION_PARENT_VS_REVERSAL_OUTCOME / BEHAVIORAL_CAUSE_FAIL_CLOSED`.

- D03-05 owns observable pullback/reversal price path.
- D20-09 owns only the event-conditioned initial-response parent when valid event/expectation evidence exists.
- later reversal is excluded from the D20 parent and joins only as D03-owned outcome/path evidence.
- structural alternatives unresolved => behavioral cause UNKNOWN.
- D03-05 and D20-09 remain L3/60%.
- state = CLOSED_NO_STRUCTURAL_CHANGE.

Audit:
`shared-knowledge/CURRICULUM_H07_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

### H12 current state
Room05 + Room13 semantic evidence accepted, but cluster remains partial.
Remaining:
- Room10 D14-19 short execution lifecycle;
- first genuine live TWSE rate/supply receipt for D20-13.


## H05 canonical no-structural-change closure — 2026-10-04

H05 closed as:
`KEEP_SEPARATE / STATEMENT_ANOMALY_VS_GOVERNANCE_CONTROL_EVENT / SHARED_RESTATEMENT_EVENT_RECEIPT`.

- D07-25 owns statement-level forensic anomaly combinations and PIT statement-vintage replay.
- D21-10 owns audit/restatement/internal-control governance/control event chronology and remediation.
- raw accruals remain D07-07; accounting-policy semantics remain D07-24.
- one restatement/control event has one parent receipt; child views do not become independent duplicate votes.
- original financial values remain historical truth until correction/restatement known_at.
- D07-25 remains L0/0%; D21-10 remains L3/60%.

Audit:
`shared-knowledge/CURRICULUM_H05_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.


## H13 canonical no-structural-change closure — 2026-10-04

H13 closed as:
`KEEP_SEPARATE / ACCOUNTING_PRIMITIVE_VS_CREDIT_FUNDING_TRANSFORM / SINGLE_BALANCE_SHEET_RECEIPT`.

- D07-06 owns accounting balance-sheet/leverage primitives and industry applicability.
- D22-03 owns credit/funding transformations after liquidity-quality classification, including derived net debt and maturity/funding context.
- one accounting receipt; no duplicate credit vote from the same debt/equity/cash fields.
- later financial-statement revisions append new vintages and never backfill earlier known states.
- D07-06 remains L2/40%; D22-03 remains L3/60%.

Audit:
`shared-knowledge/CURRICULUM_H13_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md`.

### D11/D17 shared handoff — event gap, exit constraint and cross-day republication (2026-10-04)

Reusable cross-system findings from 08｜事件與新聞研究室:

1. D11-10 event-linked overnight gap risk
- Taiwan official daily OHLC replay plus PIT-valid event clocks and the D11-12 corporate-action/reference-price firewall make event-to-next-open gap construction source-feasible.
- D04-09 remains owner of tail/gap volatility state; D17-12 owns post-gap continuation/reversal. The opening gap is one shared primitive observation, not multiple directional votes.
- Mechanical corporate-action resets, unresolved action/reference continuity, missing/synthetic Open and unresolved suspension provenance fail closed to UNKNOWN/BLOCKED.
- D11-10 = L3 Taiwan PIT/source feasible; alpha and L4/OOS remain unknown/closed.

2. D11-11 price-limit multi-day exit constraint
- D05-02 owns exchange price-limit mechanics; D04-10 owns volatility-estimator contamination; D11-11 owns only the executability/exit-constraint transformation.
- Timestamped best bid/ask, top-five depth and limit/halt/trial/delayed state make prospective bounded exit-constraint observation feasible.
- A lower-limit close does not prove that a sell order could not execute. Actual fill requires order/fill evidence. Historical OHLC does not reconstruct historical queue/fill state.
- D11-11 = L3 Taiwan PIT/source feasible with prospective-only executability qualification; no generic bearish gate.

3. D17-09 duplicate/same-event clustering
- Independent official source captures on 2026-09-28 and 2026-10-04 physically show 2072, 6949, 4530 and 4747 recurring on later daily publication dates with the same prior fact dates and explicit multi-month announcement periods.
- Therefore daily source row identity != economic event identity, and row/article counts cannot become independent confirmation counts without clustering.
- Prior-only rows that disappear from a later daily snapshot remain UNKNOWN_WINDOW_EVICTION_OR_SOURCE_REMOVAL_OR_CORRECTION, not cancellation evidence.
- D17-09 = L3 Taiwan PIT/source feasible for republication-aware clustering; native publisher correction/supersession lineage remains UNKNOWN.

Evidence:
- `research/d11_10_11_event_gap_exit_pit_audit_20261004_v0_1.json`
- `research/d17_official_disclosure_crossday_receipt_20261004_v0_1.json`
- successful read-only capture run `37183990727`, artifact `11295807935`
- `.github/workflows/research-d17-official-disclosure-capture-readonly.yml`

Current Room 08 formal maturity after these promotions:
- D11 = 56.8% across 19 modules.
- D17 = 44.3% across 14 modules.
- Room 08 module-weighted aggregate = 51.5% across 33 modules.

D11-16, D17-01, D17-02 and D11-08 remain below L3 for their distinct unresolved source/realization/completeness gates. Formal Core unchanged. Outcome joins remain closed.


## H15 / H16 / H20 canonical no-structural-change closures — 2026-10-04

### H15
`KEEP_SEPARATE / EVENT_RISK_TO_VOLATILITY_TO_POST_EVENT_PATH / ONE_OPENING_GAP_RECEIPT`.

- D11-10 owns event-linked overnight-gap risk.
- D04-09 owns tail/gap volatility state.
- D17-12 owns only post-gap continuation/fill/reversal path.
- one opening gap cannot become three time-zero votes.

### H16
`KEEP_SEPARATE / FOUR_LAYER_PRICE_LIMIT_CHAIN / ONE_LIMIT_EVENT_RECEIPT`.

- D05-02 owns exchange mechanics.
- D11-11 owns exit/orderability.
- D01-09 owns chart/pattern semantics.
- D04-10 owns volatility-estimator contamination.
- only factual strategy-specific orderability may support a hard execution constraint.

### H20
`KEEP_SEPARATE / MULTI_EVIDENCE_BREAKOUT_FAMILY / NO_INDEPENDENT_COMPONENT_VOTE_UNTIL_RESIDUAL_VALUE`.

- D01-05 owns breakout/failure price-structure event identity.
- D02-03 owns volume-confirmation transform.
- D04-07 owns volatility interaction/context.
- one breakout episode has one parent receipt.
- volume/volatility do not become independent votes until preregistered residual incremental value passes.

All three states:
`CLOSED_NO_STRUCTURAL_CHANGE`.

No maturity transfer, module-count change, Formal or runtime impact.


## H17 / H18 / H19 partial dependency states — 2026-10-04

### H17 — cost-of-capital chain
State:
`PARTIAL_EVIDENCE_RECEIVED / D07_18_AND_D22_04_REPLAY_GATES_PENDING`.

Accepted:
- D13-06 = sovereign/risk-free curve.
- D22-04 = issuer debt-cost/refinancing spread.
- D07-18 = enterprise WACC/cost-of-capital composite owner.

Remaining:
D07-18 own theory/contract, D22-04 issuer-security-date replay, D13-06 multidate strict source attestation, empirical divergent states.

### H18 — project economics vs management allocation
State:
`PARTIAL_EVIDENCE_RECEIVED / ROOM06_D07_19_PROJECT_ECONOMICS_PENDING`.

Accepted:
D21-07 management incentives/capital-allocation-quality mechanism and falsification.

Remaining:
D07-19 project/capital-budget economics, PIT opportunity-set assumptions and project-quality-vs-management-allocation divergent states.

### H19 — momentum family
State:
`PARTIAL_EVIDENCE_RECEIVED / COMMON_SUPPORT_REDUNDANCY_RESIDUAL_TESTS_PENDING`.

Accepted:
- D03-04 = time-series/within-security momentum.
- D19-04 = cross-sectional momentum rank.
- D19-09 = residual/factor-neutral momentum.

Remaining:
same-date/same-universe D03-vs-D19-04 comparison, fixed-factor/industry residualization for D19-09, provenance, costs and capacity.

No maturity/count/Formal change from these governance states.


## H08 canonical closure + H10 scope-de-dup gate — 2026-10-04

H08 closed:
`KEEP_SEPARATE / MEMBERSHIP_VS_EVENT_PROPAGATION_VS_NARRATIVE_DIFFUSION / SHARED_LINEAGE_FIREWALL`.

- D09-11 = effective-dated theme/industry/issuer membership bridge.
- D17-11 = event/news propagation with first-known/half-life.
- D20-11 = independent social-language/topic/stance diffusion.
- one theme/headline/social lineage cannot become three independent votes.

H10 audit:
`KEEP_SEPARATE / SCOPE_DEDUP_ONLY / STRUCTURAL_EXPOSURE_PRODUCER_TO_EVENT_ATTRIBUTION_CONSUMERS`.

Proposed canonical boundary pending owner approval:
- D10-12 = structural exposure graph producer.
- D17-04 = event-specific direct-attribution consumer.
- D17-05 = event-specific second-order event-path consumer.
- D17 must reference D10 exposure edges rather than rebuild a second graph from headlines.

No maturity/count/Formal change before H10 approval.


## 00 governance state reconciliation — hidden overlap + coverage 2026-10-04

Hidden-overlap H01-H20 control plane now has no generic PENDING states.
Every cluster is one of:
- canonical update complete;
- closed no structural change;
- owner approval required;
- evidence-specific partial with exact blocker.

Current owner-decision gates from this sweep:
- H04: MERGE_ELIGIBLE, proposed D12-15 survivor with D12-14 child proxy family.
- H10: KEEP_SEPARATE / SCOPE_DEDUP_ONLY, D10-12 structural exposure producer -> D17-04/05 event-attribution consumers.

Coverage control plane:
- complete: COV-02/03/04/05;
- partial: COV-01/06/07/08/09/10/11;
- pending formal specialist return: COV-12 only.

This reconciliation changes no System1/System2 Formal behavior and creates no maturity by bookkeeping.


### D03 pre-parent source-cut reusable rule — 2026-10-04

Reusable cross-system rule:

1. **Observed-by-cutoff vs latency precision are different questions.**
   - An exact prospectively observed version with `firstObservedAt <= decisionKnownAt` can be used as a conservative availability-by-cutoff fact.
   - A prior NOT_OBSERVED observation within five minutes improves publication-latency precision but is not inherently required merely to prove availability before the decision.

2. **Selected-only pre-decision source capture is invalid when the selected population is created by the decision run itself.**
   - Required source evidence must be market-wide/exchange-wide or full eligible-universe before the decision.
   - Post-selection querying may not be backdated.

3. **Source-cut eligibility is fail-closed.**
   - Required market-wide lanes, payload hashes, parser/range identity, exact prospective version keyset, cutoff clock, no truncation/budget loss, no UNKNOWN required lane and owner-certified no-revision-gap must all reconcile.

4. **Event-driven source engineering is empirically plausible but not yet authorized.**
   - Physical D03 capacity run `37190871367` observed 294 official corporate-action events over 31 event-bearing dates, max 33 events on one effective date, for 2026-08-15..2026-10-02.
   - This is a capacity clue, not a request-budget or completeness certificate.

5. **D03 does not fork shared continuity ownership.**
   - Shared owner must implement/certify the cutoff-safe source cut.
   - Current Bollinger/ADX acceptance semantics remain unchanged until a separately versioned owner contract says otherwise.

No Formal, runtime or maturity change is granted by this reusable rule.


### D03 cutoff-safe continuity update — 2026-10-04 18:56

Status: **PHYSICAL_CONTRACT_PASS / GENUINE_PARENT_RUNTIME_PENDING / OUTCOMES_CLOSED**.

Reusable cross-lane rules:

1. **Decision cutoff beats receipt timestamp.**
   - A later decisionAt/capturedAt/parent-known timestamp cannot establish whether a source fact was available when Formal inputs froze.
   - Promotion-grade causality requires physical decisionCutoffAt or an owner-approved cryptographically equivalent input-freeze receipt.
   - Historical generations without it remain LEGACY_DECISION_CUTOFF_UNKNOWN.

2. **Effective V8.17 audited cutoff boundary.**
   - Read-only run 37196768178 physically built the effective V8.17 Worker and passed the existing C1/C2 review 95/95.
   - The last observed Formal-affecting async input is the STOCKS_KV V7_MARKET_CONSENSUS read, not totalCapital.
   - After market-consensus read and before synchronous selectTomorrowCandidates there are zero external/async reads.
   - Current C1 has decisionAt but not decisionCutoffAt.
   - Owner implementation candidate = immediately after market-consensus read, before selector; newer runtimes must be re-audited.

3. **Evidence cut / computation clock separation.**
   - Facts must be frozen before decisionCutoffAt.
   - A deterministic continuity receipt may be materialized later only from the immutable pre-cut fact set.
   - No post-cut/unbound fact is allowed.
   - Market-wide source-cut manifest and symbol transform-input manifest are distinct provenance layers.

4. **No-revision-gap rule.**
   - Post-parent bounded reconciliation may certify a candidate cut only if no pre-cut version was omitted/mutated/lost.
   - A genuinely later version reported after the cutoff is later information and does not retroactively invalidate the cut.
   - D03 cannot self-certify owner completeness.

5. **Indicator promotion order.**
   - Bollinger remains L2 until a genuine cutoff-bearing parent + owner continuity cut + complete parent attempts exist.
   - ADX additionally requires canonical-anchor FULL_REPLAY.
   - No maturity or Formal change from contract tests alone.

D03 current maturity = 56.7%.
Next honest thresholds: Bollinger L3 -> 58.3%; ADX L3 -> 60.0%.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.

### D17 shared handoff — source lineage and post-event path (2026-10-04 evening)

Room 08 added two reusable L3 feasibility results.

1. D17-10 source-lineage cross-validation:
- field-level independence matters more than URL count;
- 2537 construction-fire case separates independently corroborated event occurrence from issuer-origin insurance/materiality statements later redistributed by media;
- 7827 HCB303 shows copied MOPS disclosure pages remain one primary lineage;
- historical page publication clocks cannot be backdated into strategy firstKnownAt; conservative capture clocks remain required;
- D17-01 production licensing and D17-02 true first-availability remain separate blockers.

2. D17-12 post-event path:
- H15 boundary is enforced: opening gap is one shared primitive;
- D11-10 owns event-linked gap/stop-risk transformation;
- D04-09 owns tail/gap volatility transformation;
- D17-12 owns only subsequent post-open continuation/fill/reversal path;
- validated Taiwan official daily OHLC supports historical close/D1/D3/D5 replay with corporate-action/limit/suspension guards;
- 15m/30m path remains prospective-only and cannot be fabricated from daily OHLC.

Weekend after-hours source coverage also completed in workflow run `37197636375`: TWSE and TPEx each expected 2 polls and observed 2 polls, with stable payload hashes. This improves coverage receipts but does not authenticate API first-availability time or justify D17-01/02 promotion.

Evidence:
- `research/d17_after_hours_coverage_receipt_20261004_v0_1.json`
- `research/d17_10_cross_source_lineage_receipt_20261004_v0_1.json`
- `research/d17_12_post_event_path_pit_audit_20261004_v0_1.json`

Current Room 08 maturity after this continuation:
- D11 = 56.8%.
- D17 = 47.1%.
- Room 08 = 52.7% across 33 modules.

Formal Core unchanged. Outcome joins remain closed.

### D17 shared handoff — direct exposure, sector propagation and connected disclosure semantics (2026-10-04 late evening)

Room 08 reusable findings:

1. Connected material-disclosure source:
- `FCNT000004` physically exposes item ID, symbol, second-level timestamp, title, original MOPS URL and structured description fields.
- exact `target_id` replay works on recent and correction items;
- correction item coexistence is physically observed rather than silent overwrite;
- `timestamp_start` did not return raw rows in the tested query, and older/newer ID serialization is inconsistent;
- source timestamp still does not authenticate strategy first availability;
- no canonical licensed general-news content class is exposed.
Therefore D11-08 and D17-01/02 remain L2.

2. D17-04 direct exposure:
- source-feasible frozen chain: EVENT -> ECONOMIC_PRIMITIVE -> FIRM_EXPOSURE -> FINANCIAL_TRANSMISSION -> EFFECTIVE_TIMING;
- 2537 fire = direct adverse physical exposure, net financial effect UNKNOWN after insurance/materiality uncertainty;
- 7827 HCB303 IND approval = direct regulatory progress, not product approval/revenue/validated efficacy;
- 6461 restricted employee shares = direct issuer event with offsetting incentive/dilution channels;
- direct exposure does not force a stock direction.
D17-04 = L3 Taiwan PIT/source feasible; outcomes closed.

3. D17-11 event-specific sector propagation:
- D09 owns PIT industry classification and persistent sector state;
- D10 owns causal economic/supply-chain edges;
- D17 owns only event-specific propagation into a peer set frozen before outcomes;
- current-source biotechnology witness includes 7827, 6461, 1795, 6472 and 4162;
- same-industry membership and peer co-movement are not causal same-sign evidence;
- competition, substitution, attention-only and UNKNOWN states remain explicit.
D17-11 = L3 Taiwan PIT/source feasible; outcomes closed.

4. Explicit blockers:
- D17-03 half-life still depends on a trustworthy availability origin clock;
- D17-05 second-order supply-chain propagation remains dependent on D10-01 graph maturity;
- D17-06/07 require broader ex-ante expectation evidence;
- D17-08 remains blocked by canonical licensed general-news source readiness.

Evidence:
- `research/d17_material_disclosure_connected_source_audit_20261004_v0_1.json`
- `research/d17_04_direct_exposure_pit_audit_20261004_v0_1.json`
- `research/d17_11_sector_propagation_pit_audit_20261004_v0_1.json`

Current Room 08 maturity:
- D11 = 56.8%.
- D17 = 50.0%.
- Room 08 = 53.9% across 33 modules.

Formal Core unchanged. Outcome joins remain closed.


### D03 decision-cutoff provenance engineering rule — 2026-10-05

Status: **ENGINEERING_CANDIDATE_CI_PASS / PRODUCTION_NOT_AUTHORIZED**.

Reusable rule:
- decision cutoff belongs to the immutable Formal decision parent, not to a research child or membership copy;
- current audited boundary is after the final `V7_MARKET_CONSENSUS` read and before synchronous selection;
- additive cutoff provenance may persist through immutable C1 `header_json` with no dedicated D1 scalar column;
- same-generation changed cutoff must conflict;
- historical cutoff backfill is prohibited;
- CI/fixture success does not equal a genuine prospective parent generation;
- promotion remains blocked until a real post-deploy session has cutoff-bearing parent + certified cutoff-safe continuity + complete observer reconciliation;
- PR #600 is draft/open/unmerged; Formal Core remains locked.

### D11/D17 shared handoff — expectation states, preopen window turnover and 6921 lock-up deepening (2026-10-05 morning)

Room 08 reusable findings:

1. D17-06 expectation/surprise:
- preserve four source classes separately: full ex-ante distribution, categorical conditional scenario set, authorization-with-unquantified-magnitude, and no-valid-expectation UNKNOWN;
- numeric surprise is permitted only when expected/realized objects are compatible and the functional is preregistered;
- 7827 HCB303 demonstrates categorical scenario realization;
- 6461 restricted shares demonstrate that an authorization ceiling is not an expected magnitude;
- D17-06 = L3 Taiwan PIT/source feasible; no cross-family surprise score or alpha claim.

2. D17-07 priced-in:
- true incorporation fraction is latent;
- replay only the pre-event expectation-evidence state: LOW / PARTIAL / HIGH / CONFLICTED / UNKNOWN;
- 7827 = high verified expectation evidence with uncertain branch;
- 6461 = partial expectation evidence;
- 2537 fire = low covered-lane prior expectation evidence for an unscheduled occurrence;
- post-event returns, prior price rise and repeated article counts cannot backfill the state;
- D17-07 = L3 Taiwan PIT/source feasible for evidence-state construction only.

3. Preopen official-disclosure capture:
- workflow run `37243049741` completed at 2026-10-05 07:14-07:16 Asia/Taipei with 2/2 expected polls per source;
- TWSE current feed rolled from the prior five-row payload to three rows with a different raw hash;
- TPEx remained stable at four rows;
- later absence from a current snapshot therefore cannot mean cancellation/no event;
- no newly arriving row was observed inside the fixed-cadence window, so D17-02 and D11-08 remain L2;
- one fully observed source lane is insufficient for D11-13 NO_KNOWN_EVENT.

4. D11-16 6921 issuer deepening:
- 6921 listed on 2025-12-23;
- pre-listing 2023/2024 connected financial ratios do not support the Article 4 profitable-issuer shortcut, so the bounded theoretical replay uses the standard Article 35 schedule;
- first theoretical 1/4 release eligibility = 2026-06-23;
- actual custody withdrawal remains unproven;
- a separate 2025-12-16 over-allotment declaration by 嘉澤端子工業 for 10,000 shares is exactly consistent with later holding reduction from 4,732,059 to 4,722,059;
- that declaration predates listing and is supply-realization evidence only, never lock-up-expiry evidence;
- D11-16 stays L2 until original custody quantity plus actual TWSE-approved release/TDCC withdrawal and authenticated post-eligibility transfer/untransferred chain are captured.

Evidence:
- `research/d17_06_expectation_surprise_pit_audit_20261005_v0_1.json`
- `research/d17_07_priced_in_evidence_state_audit_20261005_v0_1.json`
- `research/d17_preopen_rolling_window_receipt_20261005_v0_1.json`
- `research/d11_16_issuer_realization_deepening_20261005_v0_3.json`

Current Room 08 maturity:
- D11 = 56.8%.
- D17 = 52.9%.
- Room 08 = 55.2% across 33 modules.

Formal Core unchanged. Outcome joins remain closed.
