# Behavioral Finance / Investor Attention Research

Updated: 2026-10-02 Asia/Taipei
Scope: D20
Status: RESEARCH LANE INITIALIZED / NO EVIDENCE YET

This lane studies attention, sentiment, under/overreaction, anchoring, disposition, overconfidence and herding while preserving a strict firewall against anthropomorphizing price action or claiming actor intent without evidence.

## 2026-10-02｜Foundation cluster: reference dependence, disposition and attention

### D20-01 Prospect Theory / Loss Aversion
- Foundational mechanism: outcomes are evaluated relative to a reference point rather than only final wealth; the classic model combines reference dependence, diminishing sensitivity and probability weighting.
- Research boundary: prospect theory is a descriptive decision model, not a direct stock-return signal. A stock being down, volatile or heavily traded does not identify loss aversion.
- Critical falsification: later theoretical work shows that a simple annual gain/loss implementation of prospect theory can fail to predict the disposition effect or can predict the reverse pattern. Reference-point definition, updating and realization utility matter.
- Additional caution: the universality/strength of loss aversion is debated; context and reference-point construction can change the asymmetry.
- D20 implication: every market hypothesis must pre-register the reference point, evaluation horizon, aggregation rule and observable proxy before testing.

Key references:
- Kahneman & Tversky (1979), Econometrica, Prospect Theory: An Analysis of Decision under Risk.
- Barberis & Xiong (2009), Journal of Finance, What Drives the Disposition Effect?
- Gal (2018), Journal of Consumer Psychology, critical review of loss aversion.
- Reference-Dependent Preferences review, Handbook of Behavioral Economics (2018).

### D20-02 Disposition Effect
- Definition: a higher propensity to realize gains than losses, often summarized as selling winners too readily and holding losers too long.
- U.S. evidence: Odean (1998) used 10,000 brokerage accounts and found stronger realization of gains; rebalancing and low-price transaction-cost stories did not explain the full pattern, and sold winners subsequently outperformed retained losers.
- Taiwan evidence 1: a brokerage dataset covering 53,680 individual accounts and 10,883,473 transactions from 1998-01 to 2001-09 reported PGR≈0.35 and PLR≈0.14, with a gain/loss realization ratio around 2.5.
- Taiwan evidence 2: all TWSE trading activity over the five years ending in 1999 showed aggregate investors were about twice as likely to sell when holding a gain; 84% of investors sold winners faster than losers. Mutual funds and foreign investors were notable exceptions.
- Falsification / competing explanations: tax-loss incentives, rebalancing, liquidity, transaction costs, expected mean reversion, information-based selling, investor-type heterogeneity, margin constraints and price-limit mechanics.
- Important theory check: disposition behavior should not be labeled “loss aversion” automatically because prospect-theory implementations can generate different predictions.
- Research-only candidate: aggregate unrealized capital-gain proxies may help explain momentum-like underreaction, but they require PIT-valid holdings/reference-price reconstruction and redundancy tests versus direct momentum.

Key references:
- Shefrin & Statman (1985), Journal of Finance.
- Odean (1998), Journal of Finance.
- Barber, Lee, Liu & Odean (2007), European Financial Management, Taiwan complete-market evidence.
- Grinblatt & Han (2005), Journal of Financial Economics.

### D20-04 Anchoring / Reference Dependence
- Mechanism: market participants may evaluate prices relative to salient reference points such as purchase price, expected price, recent high or historically salient levels.
- Taiwan evidence: a 2023 Taiwan-market study reports that the lottery-like-stock anomaly is concentrated among stocks farther from their 52-week highs and that investor attention conditions the anchoring relation.
- Strong redundancy warning: distance to a 52-week high is mechanically related to trend, momentum, breakout state and price position. It cannot be counted as independent behavioral alpha until residualized against D01/D03 price-family variables and D04 volatility.
- Falsification: if the apparent anchor effect disappears after controls for momentum, volatility, liquidity, sector and attention, the behavioral interpretation should be rejected or downgraded.

### D20-07 Investor Attention / Salience
- Core mechanism: bounded search means attention can change the consideration set before preferences determine the final purchase.
- General evidence: individual investors are net buyers of attention-grabbing stocks such as names in the news, abnormal-volume stocks and extreme one-day movers.
- Taiwan evidence: 2005-2009 TWSE transaction data show extreme returns attract both individuals and institutions; volume acts as a conditional attention trigger especially for individuals, and the effect weakens during the 2007 financial-crisis regime.
- More recent Taiwan evidence: Google-search-based attention proxies have been associated with higher future crash risk, especially in OTC firms and firms with higher natural-person ownership.
- Falsification: search/news/volume spikes may be responses to information, liquidity shocks, manipulation or already-moving prices. Therefore external attention proxies and endogenous market proxies must be separated.
- Incremental-value gate: abnormal volume and extreme return are already D02/D03 families; they cannot be reintroduced as a second “behavioral vote”. A D20 attention feature must add out-of-family information after controls.

### Cross-module conclusions
1. Behavioral finance is useful only when translated into observable, timestamped, falsifiable variables.
2. “Psychology” is not an excuse to anthropomorphize OHLCV.
3. Reference-point specification is the central identification problem for D20-01/02/04.
4. Attention is best modeled as a choice-set/filter mechanism, not automatically a bullish/bearish signal.
5. Taiwan evidence is strong enough for theory/mechanism/falsification maturity, but not yet for L3 because our own PIT/replay data contracts are not validated.
6. Formal Core remains unchanged.

### Next research
- D20-03 Overconfidence: separate turnover/trading-frequency proxies from information arrival, volatility and wealth effects.
- Build Taiwan PIT/replay feasibility contracts for D20-01/02/04/07.
- For attention, prioritize external/search/news exposure proxies; treat price/volume-derived proxies as comparators to avoid double counting.

## 2026-10-03｜D20-06 Herding and D20-10 Investor Sentiment

### D20-06 Herding / Social Proof
Mechanism:
- Behavioral herding means synchronized action caused by imitation, social inference, leader/follower behavior or related behavioral transmission.
- Observable crowding is not sufficient. Holdings concentration, margin concentration, institutional flow persistence and common price movement can arise from shared information, mandates or mechanical flows.

Positive Taiwan evidence:
- Chang, Cheng and Khorana (2000) report significant Taiwan herding using nonlinear return-dispersion methods.
- Demirer, Kutan and Chen (2010) show method dependence: linear CSSD is weak while nonlinear CSAD and state-space methods find stronger herding, particularly during market losses.
- Hsieh (2013) uses investor-identity intraday data and finds both institutional and individual herding, but with different subsequent return patterns, implying different information/behavior mechanisms.
- Recent Taiwan studies report time-, venue-, investor-type- and microstructure-dependent herding.
- Real-time forum stance/sentiment research in Taiwan provides a possible behavior-specific data family beyond static holdings/flow concentration.

Falsification:
- Low return dispersion can result from common fundamentals, factor exposure, benchmark rebalancing, liquidity shocks or common risk constraints.
- High crowding can exist with behavioral herding UNKNOWN.
- Synchronized institutional action can be information-based rather than imitation.
- Market-design reforms can change measured synchronization.

Research contract:
- D06-06 owns static/flow crowding primitives.
- D20-06 must use independent behavior-specific evidence or a residual-herding test after D06, market, sector, factor, event/news, passive-flow and liquidity controls.
- Preferred tests: actor-level residual synchronization; leader/follower temporal ordering; independent social/network evidence; residual convergence after common-information controls.
- CSSD/CSAD are screening/measurement tools, not motive proof.

Decision:
- D20-06 -> L2.
- L3 blocked until a replayable Taiwan behavior-specific data stream is validated.
- No independent selection vote from the same crowding primitives.

### D20-10 Investor Sentiment
Mechanism:
- Investor sentiment is a non-fundamental optimism/pessimism state that may affect demand and prices when valuation is subjective and arbitrage is limited.
- Sentiment is not identical to attention, news tone, expected volatility, leverage, turnover or recent return.

Proxy taxonomy:
A. More direct/independent:
- investor surveys;
- investor/forum bullish-vs-bearish stance or textual emotion from a source distinct from news;
- account-level risk-taking/flow responses linked to independently measured sentiment.

B. Candidate indirect:
- overnight return where market-specific validation supports a sentiment interpretation;
- composite market-based sentiment measures after removing macro/fundamental/liquidity components.

C. Weak/non-identifying alone:
- VIX or option-implied volatility: expected volatility, not directional sentiment;
- margin balance: leverage/crowding context, not sentiment by itself;
- turnover/volume: attention/liquidity/information confounded;
- news sentiment: D17-08 event/news-text family, not an independent D20 vote.

Evidence and counterevidence:
- Baker and Wurgler show broad sentiment effects are stronger in difficult-to-value/difficult-to-arbitrage stocks, but this is a cross-sectional conditional effect rather than a universal timing rule.
- Taiwan research finds overnight return can behave as a sentiment proxy, including short-run persistence and long-run reversal, but cross-country studies show overnight return fails as a sentiment proxy in many non-US markets. Taiwan therefore requires its own validation rather than imported assumptions.
- Taiwan real-time public sentiment/stance data are associated with herding heterogeneously across investor classes and industries, supporting a distinct social-sentiment family.
- Meta-analysis of survey sentiment-return research finds non-negligible but smaller-than-reported effects and material publication/design heterogeneity.
- A 2024 proxy-validation study warns that news/text measures can contain information content rather than pure sentiment; a long-run price effect can signal information contamination.

Semantic boundaries:
- D17-08 owns news/event-text sentiment tied to publication clocks and event half-life.
- D20-10 owns broader investor sentiment only if it uses independent proxy families and behavioral falsification.
- D20-07 owns attention; search intensity without direction is attention, not sentiment.
- D12-05 owns Taiwan VIX as expected-volatility information.
- D06 owns margin/crowding primitives.
- D02/D03 own price/volume/return families.

Decision:
- D20-10 -> L2.
- L3 blocked until a Taiwan PIT/replay sentiment source is validated with first-known timing and revision policy.
- Default system role remains RESEARCH_ONLY / CONTEXT_ONLY or SUPPORTIVE until OOS/prospective evidence demonstrates incremental value.

### Shared implication
Behavioral-finance evidence must add a genuinely new observable family or residual mechanism. Re-labeling existing price, volume, flow, leverage, news or volatility inputs with a psychological name cannot create additional evidence weight.

## 2026-10-03｜D20-08 Underreaction / Post-event Drift and D20-09 Overreaction / Reversal

### D20-08 Underreaction / Post-event Drift

Mechanism:
- Underreaction is a horizon-specific failure to incorporate information fully at the first decision-relevant price.
- A valid behavioral claim requires an identified information event, a first-known timestamp, a pre-specified surprise or information-content baseline, an initial response window, and a later drift window.
- Generic momentum is not sufficient evidence because continuation can arise from trend exposure, gradual fundamental information, risk compensation, liquidity, delayed institutional flow or market-state persistence.

Taiwan evidence:
- Lin, Ko, Chen and Chu (2016) find strong earnings momentum in Taiwan and stronger profits where information arrives more continuously; results are consistent with underreaction and attention mechanisms.
- A 2026 study of record-high Taiwan monthly-revenue announcements finds next-day intraday reversal together with significant positive buy-and-hold returns over the following 20 trading days.
- The coexistence of short-horizon reversal and medium-horizon drift around the same event shows that overreaction and underreaction labels must be tied to time horizon rather than applied to an entire price path.

Required controls:
- event first-known timestamp and after-hours publication;
- surprise definition versus simple realized growth;
- pre-event return and attention;
- institutional net flow;
- market/sector return and liquidity;
- analyst revisions and common information;
- price-limit regime;
- transaction costs and short-sale feasibility.

Research contract:
- Separate event-day, next-day, 5-day, 20-day and 60-day outcomes.
- Do not infer underreaction from generic momentum.
- L3 requires a replayable Taiwan event ledger with first-known clocks and frozen outcome windows.

Decision:
- D20-08 -> L2.
- No L3 promotion.
- Formal Core unchanged.

### D20-09 Overreaction / Reversal

Mechanism:
- Behavioral overreaction means price moves beyond what the information/economic state can justify because beliefs or demand respond excessively.
- Reversal is an observable price outcome; it is not proof of overreaction.
- D03-05 remains owner of pullback/short-term reversal as a price phenomenon. D20-09 must own an independently identifiable behavioral cause.

Positive evidence:
- De Bondt and Thaler (1985) provide classic long-horizon loser/winner reversal evidence consistent with overreaction.
- Taiwan price-limit studies document overnight continuation and subsequent intraday reversal after limit moves, interpreted as delayed overreaction/correction under the historical price-limit regime.
- Yang, Chu, Ko and Lee (2018) report Taiwan continuing-overreaction portfolios, formed using signed-volume information, show intermediate continuation followed by long-term reversal; price limits appear to restrain the measured effect.
- Taiwan intraday-versus-overnight momentum research finds opposite continuation/reversal implications across return components, reinforcing horizon and market-structure dependence.
- The 2026 record-high monthly-revenue study finds short-horizon reversal after salient announcements but medium-horizon positive drift, showing that a reversal does not characterize the entire event response.

Structural counterfactuals:
- bid-ask bounce;
- liquidity provision and temporary price impact;
- dealer/inventory effects;
- forced liquidation or margin calls;
- index/passive flow;
- event correction as new information arrives;
- volatility normalization;
- price-limit mechanics;
- stale-price/opening effects.

H07 ownership firewall:
- D03-05 owns observable reversal geometry and PIT replay.
- D20-09 can remain separate only if it can detect behavioral/event-expectation evidence before or independently of the completed reversal.
- Prior extreme return + later reversal alone is a narrative relabel and cannot become a second vote.
- Shared return/volume rows are recorded once.

Decision:
- D20-09 -> L2.
- No L3 promotion until a Taiwan PIT-valid causal proxy survives structural alternatives.
- Formal Core unchanged.

### Joint implication
The same event can display:
1. an immediate attention-driven overshoot;
2. short-horizon reversal;
3. incomplete medium-horizon information incorporation;
4. later drift.

Therefore D20-08 and D20-09 must be modeled as horizon-specific hypotheses with explicit event clocks, not opposite one-word labels assigned to a whole chart.

## 2026-10-03｜D20-05 Representativeness / Recency

### Mechanism
- Representativeness is a belief-formation heuristic in which a recent pattern is treated as representative of an underlying state or type, with insufficient weighting of base rates.
- Recency/extrapolation places excessive weight on recent observations when forming expectations.
- Neither mechanism is identified by recent return strength alone.

### Integrated behavioral models
- Barberis, Shleifer and Vishny (1998) show that conservatism and representativeness can jointly generate underreaction to isolated news and overreaction after repeated similar news.
- Daniel, Hirshleifer and Subrahmanyam (1998) show that continuing overreaction can generate short-run momentum and later long-run reversal; therefore positive autocorrelation is not uniquely an underreaction signature.
- Modern extrapolation evidence shows that investor expectations often rise after past returns, while direct expectation measures can disagree sharply across investor groups.

### Taiwan evidence
- Hao, Chu, Ho and Ko (2016) compare 52-week-high anchoring and recency in Taiwan. Results are mixed: recency profitability depends materially on era and market state, while anchoring and recency can coexist.
- This evidence rejects a universal recency factor. A price-history construction can be useful as a hypothesis proxy but remains highly overlapping with momentum, anchoring, price position and regime.
- Taiwan event evidence from D20-08/D20-09 also shows that short-horizon reversal and medium-horizon continuation can coexist, making a single recent-return label inadequate.

### Direct/near-direct evidence hierarchy
Stronger:
- investor expectation surveys linked to actual behavior;
- administrative trade data linked to independently measured extrapolative forecast bias;
- repeated belief updates around controlled or well-identified information sequences.

Weaker:
- chronological ordering of past returns;
- nearness/date of the 52-week high;
- recent winner/loser status;
- raw momentum/reversal.

### Structural and overlap controls
Any D20-05 proxy must be compared with:
- D20-04 anchoring;
- D20-08 underreaction;
- D20-09 overreaction;
- D03 direct momentum/reversal;
- volatility and regime;
- valuation/fundamental changes;
- attention and news/event salience.

### Decision
- D20-05 -> L2.
- Remains OBSERVATION / RESEARCH_ONLY.
- Price-only proxies are not sufficient for L3.
- If no independent expectation/behavior observable or residual incrementality survives, prepare a merge proposal into the D20 behavior-response family rather than preserve a duplicate factor.
- Formal Core unchanged.

## H07 Room-13 evidence contribution — D03-05 vs D20-09

### Semantic ownership
- D03-05 owns observable pullback / short-term reversal geometry.
- D20-09 owns behavioral overreaction only when a causal/behavioral mechanism is independently identifiable.

### Shared observables
Past return, reversal magnitude, OHLCV, volatility and price-limit state are shared controls/phenomena, not independent votes.

### D20-09 unique evidence candidates
- event expectation gap combined with overshoot/correction;
- investor-type order-flow or behavioral response that temporally precedes reversal;
- independently measured sentiment/attention state that predicts overshoot after controlling event fundamentals;
- continuing-overreaction constructions that survive liquidity, price-limit and direct-momentum controls.

### Alternative explanations
Bid-ask bounce, inventory effects, liquidity provision, forced flow, event correction, volatility normalization, stale opening prices and price-limit mechanics.

### Divergent-state examples
1. Reversal without behavioral overreaction: temporary liquidity pressure is mechanically corrected.
2. Behavioral overreaction possible before completed reversal: identifiable event/expectation evidence plus excessive demand relative to fundamentals.
3. Continuing price movement with eventual correction: overreaction can coexist with short-run momentum.
4. Event-day overshoot followed by medium-term drift: short-horizon overreaction and longer-horizon underreaction can coexist.

### Terminal specialist view
KEEP_SEPARATE_CONDITIONAL_ON_BEHAVIOR_IDENTIFIABILITY / PHENOMENON_CAUSE_FIREWALL.
If D20-09 is operationalized only as extreme prior return plus later reversal, it should be narrowed/merged rather than receive an independent behavioral vote.
Formal Core unchanged.

## 2026-10-03｜D20-11 Narrative / Theme Diffusion and D20-13 Limits to Arbitrage / Noise-trader Risk

### D20-11 Narrative / Theme Diffusion

Mechanism:
- Narrative diffusion requires transmission of stories, language, stance, attention or belief frames across people or communities.
- Theme membership is not narrative diffusion.
- Event/news propagation is not narrative diffusion by itself.
- Common price movement is not narrative diffusion.

Evidence:
- Shiller's narrative-economics framework treats narratives as contagious stories whose spread can affect economic decisions.
- Earlier survey evidence documents word-of-mouth diffusion of investment attention.
- Taiwan real-time forum research shows public sentiment and bullish/bearish stance interact with herding heterogeneously across investor classes and industries, demonstrating that social text can provide a behavior-specific data family beyond static theme membership.
- Modern narrative/crash-belief research shows that language and stories can alter beliefs, but narrative measures are highly vulnerable to information contamination and hindsight leakage.

H08 three-layer firewall:
1. D09-11 = theme/company/industry taxonomy and membership.
2. D17-11 = dated event/news propagation with first-known clock and event half-life.
3. D20-11 = behavioral narrative/social diffusion only when language/topic/attention propagation adds an independent observable after controlling D09/D17.

Required D20-11 observables:
- topic or phrase propagation over time;
- stance/emotion/narrative intensity from a distinct social/community source;
- network or source-to-source diffusion ordering;
- persistence/amplification after fundamental event and structural supply-chain controls.

Falsifiers:
- static theme label only;
- same headline copied across sites;
- supply-chain membership alone;
- price comovement without text/social propagation;
- event propagation fully explained by fundamentals.

Decision:
- D20-11 -> L2.
- No L3 until a PIT/replay social-language/topic stream with first-known and revision semantics is validated.
- Formal Core unchanged.

### D20-13 Limits to Arbitrage / Noise-trader Risk

Mechanism:
- Mispricing can persist because arbitrage is risky, capital intensive, capacity constrained and exposed to further price divergence before convergence.
- Noise-trader risk means rational traders face the possibility that mispricing worsens before it corrects.
- Professional arbitrage may be constrained by investor withdrawals, leverage, margin, short-sale availability and execution frictions.

Foundational evidence:
- Shleifer and Vishny show that delegated professional arbitrage can become least effective precisely when mispricing becomes extreme.
- De Long, Shleifer, Summers and Waldmann show that noise-trader beliefs can affect prices and create risk borne by rational investors.
- Positive-feedback traders can even make front-running by rational speculators destabilizing rather than automatically correcting prices.

Taiwan evidence:
- Taiwan short-sale research finds heavily shorted stocks subsequently underperform, and overvaluation is more persistent where short-sale constraints and opinion dispersion coexist.
- Taiwan evidence on short-selling restrictions finds restrictions can raise return volatility in some regimes rather than stabilize prices.
- More recent Taiwan shorting-flow research finds shorting flows contain incremental information under local uptick-rule and price-limit settings.
- These findings support studying arbitrage capacity and constraint state, but do not imply a universal long/short signal.

H12 four-layer ownership:
1. D06-09 = observed borrowing / actual short-flow state.
2. D06-18 = borrow availability / fee / utilization economics.
3. D14-19 = short-position execution, recall, forced buy-in and exit feasibility.
4. D20-13 = economic theory of why mispricing may survive those constraints plus noise-trader risk.

Falsifiers:
- high short interest can reflect informed negative information rather than binding arbitrage constraints;
- high margin/borrowing balances do not identify mispricing;
- price limits and short-sale rules can change both information production and execution;
- arbitrage constraints may be irrelevant when mispricing direction itself is not identified.

Decision:
- D20-13 -> L2.
- No L3 until Taiwan PIT/replay borrow-supply/cost/capacity and constraint-state data are jointly validated.
- Formal Core unchanged.

## D20 foundation milestone

All 13 D20 modules have reached L2 mechanism-plus-falsification maturity.
This does NOT mean the behavioral factors are production-ready.
The next stage is exclusively L2 -> L3 Taiwan PIT/replay feasibility and identifiability validation.
No module may be promoted by literature alone.

## 2026-10-04｜D20-08 台股月營收事件時鐘與可重播性稽核

### 本輪問題
`D20-08` 已完成反應不足與事件後漂移的機制／反證基礎，本輪不重做理論，而是檢查台股月營收能否形成第三級所需的時點一致事件資料鏈。

### 官方來源可行性
- 公開資訊觀測站具有「月營業收入」查詢入口，且系統資料由公司輸入後公開。
- 證交所公開發行公司資訊申報教材明定月營收申報期限原則為次月十日前，遇例假日順延；特殊災害或特殊情事可依主管機關公告調整。
- 政府資料開放平台的上市、上櫃與公開發行公司每月營業收入資料集至少提供「出表日期、資料年月、公司代號、公司名稱、產業別、當月／上月／去年同月營收、比較增減、累計營收、備註」等欄位。
- 上述彙總資料足以驗證營收數值與橫斷面資料結構，但「出表日期」不能自動等同每一家公司原始申報的精確首次公開時間。

### 關鍵時鐘切割
1. `reference_month`：營收所屬年月。
2. `issuer_submission_first_known`：公司首次把該月營收送入公開資訊觀測站、可被市場取得的時間；這才是事件研究優先時鐘。
3. `correction_first_known`：後續更正版本首次公開時間；更正不得覆寫原始版本。
4. `aggregate_snapshot_date`：證交所／櫃買／政府開放資料彙總出表日期，只能當彙總快照版本。
5. `deadline_date`：法規／申報規則最後期限；不能用最後期限倒填個別公司的首次公開時間。

### 驚喜變數分層
- 第一層可直接重建：年增率、月增率、累計年增率，以及相對公司自身歷史分布的標準化變化。
- 第二層條件式：若有在事件前已封存的分析師預估或公司指引，可計算預期差。
- 缺乏事件前預期檔案時，`surprise_vs_consensus` 必須保持 `UNKNOWN`；實際年增率高不能自動叫「正向驚喜」。

### 可交易事件日規則
- 若首次公開時間在當日開盤前，當日可作第一個完整市場反應日。
- 若在盤中公開，需保留分鐘級時間且避免把公告前報酬算入事件反應。
- 若在收盤後、休市日或週末公開，下一個交易日才是第一個可完整反應日。
- 若歷史來源只能證明日期而不能證明時間，日內歸屬必須 `UNKNOWN`，不可自行假設收盤前或收盤後。

### 第三級升級缺口
目前官方來源已證明「事件家族存在、欄位可取得、申報期限可定義」，但尚未證明可大量重建每家公司歷史 `issuer_submission_first_known` 時間與所有更正版本。因此本輪不能把 `D20-08` 升為第三級。

### 強制反證與偏誤控制
- 時點一致：只使用事件當時已知的版本；彙總表後來修正值不得回填。
- 樣本外與走動式驗證：事件窗、驚喜定義、分組門檻必須先凍結，再依時間向前驗證。
- 選擇偏誤：不得只挑營收創高或大幅成長公司；全體符合資料品質條件者都需進母體。
- 存活者偏誤：下市、轉板、停止交易與後來消失公司不能從歷史母體刪除。
- 多重測試／資料探勘：一日、五日、二十日、六十日等視窗必須事先分主次，不能事後挑最好看的視窗。
- 因子冗餘：控制事件前動能、異常成交量、產業報酬、法人流、波動、規模與流動性；否則漂移不能歸因於行為反應不足。
- 成本：若研究延伸為策略，需納入成交成本、漲跌停、停牌與無法成交狀態。
- 市場狀態：至少區分高低波動、牛熊、流動性與制度版本；效果若只在單一狀態成立，不得宣稱普遍性。

### 本輪結論
`D20-08` 的台股月營收事件資料鏈由「概念可行」推進到「官方來源與時鐘語意已定義」，但精確歷史首次公開時間與版本鏈尚未完成可重播驗證。維持第二級 40%，狀態更新為資料契約已凍結、首次公開時間證據待補。正式核心維持鎖定，未形成正式優化候選。

## 2026-10-04｜D20-08 月營收更正鏈與事件時鐘第二階段驗證

### 新增可驗證證據
- 證交所資訊申報教材明確規定：月營收更正時，先以重大訊息揭露更正前、後數據，再重新公告月營收。這表示「原始版本 → 更正重大訊息 → 更正後月營收」不是研究者自行假設，而是正式申報流程。
- 證交所個股資訊可保存重大訊息的發表日期與秒級時間，且可觀察實際月營收更正案例。2026 年已有多個案例顯示更正重大訊息帶有明確發表時間。
- 因此 correction_first_known 可以由重大訊息時間建立高可信事件時鐘；原始 issuer_submission_first_known 是否同樣可由公開歷史資料大量、穩定取得，仍未證明。

### 版本鏈資料契約
每筆月營收事件至少保存：
1. issuer / security id。
2. reference_month。
3. original_value 與 original_first_known；無法證明時間時標 UNKNOWN。
4. correction_notice_first_known：更正重大訊息的實際公開時間。
5. correction_before_value / correction_after_value。
6. corrected_revenue_first_known：重新公告後數值首次可知時間；若只能證明重大訊息時間，不得把兩者強行視為同一秒。
7. source_url / retrieval_time / source_type。
8. revision_sequence：同月份若多次更正，依首次可知順序累積，不覆寫前版。

### 可交易語意
- 更正重大訊息在盤中出現：更正前的市場歷史仍使用舊版本；更正後才允許新版本進入資訊集合。
- 更正重大訊息在收盤後出現：當日收盤以前不得使用更正值；下一交易日才可把更正值視為完整可交易資訊。
- 若只有更正日期、沒有時間：事件歸屬保持 UNKNOWN，不進入需要日內切割的主樣本。
- 研究資料庫必須同時保存「當時可知值」與「最終修正值」，避免回溯資料庫把歷史錯誤值消失後造成 look-ahead。

### 對 D20-08 的含義
- 月營收「更正版本」的 first-known 可行性已由官方流程與實例獲得明顯支持。
- 月營收「原始版本」的大規模 first-known 時間仍是主要缺口；目前不能因更正鏈可重建就推論所有原始公告時間也可重建。
- 因此 L3 升級條件仍未達成。

### 下一驗證
A. 建立至少 30 個月營收更正事件的樣本，跨上市／上櫃、盤中／盤後、不同年份與制度期，檢查時間欄位覆蓋率。
B. 對每個更正事件追溯原始月營收版本，測試能否從公開來源還原 original_first_known。
C. 凍結 coverage gate：只有當原始與更正 first-known 具有足夠覆蓋率、來源可追溯、版本不覆寫，才允許進入 L3 replay。
D. 在 coverage gate 前，不計算事件後 1/5/20/60 日績效，不做門檻搜尋，避免先看結果再調資料契約。

### 結論
D20-08 維持 L2 / 40%。研究狀態由單純事件資料待建，推進為「月營收事件時鐘契約已凍結；更正鏈 first-known 官方證據成立；原始申報 first-known 大樣本覆蓋仍待驗證」。Formal Core unchanged；FORMAL_OPTIMIZATION_CANDIDATE = NONE。

## 2026-10-04｜D20-06 台股從眾可辨識資料可行性第二階段

### 證據分層
台灣文獻顯示，真正能辨識從眾的研究多依賴投資人類型、交易方向、時間先後或委託簿，而不是單純橫斷面報酬離散度。機構與個人投資人的從眾方向、資訊含量與後續報酬可以不同，代表「市場同步」不足以識別同一心理機制。

### 可辨識候選
1. 投資人類型交易：外資、投信、自營商與個人交易若能保留方向、時間與股票層級，可測試同類投資人是否在控制共同資訊後仍有領先／跟隨結構。
2. 高頻委託與成交：研究文獻使用台灣交易所盤中交易與委託簿辨識機構與個人的從眾及交易雜訊；這是較接近直接行為證據的資料族。
3. 社群立場：公開社群可形成散戶情緒／多空立場候選，但聲量爆發往往由共同新聞驅動，因此必須先控制事件與新聞來源，不能把同時討論同一事件直接叫從眾。

### 結構性替代解釋
- 共同公開資訊同時改變多人交易。
- 機構遵循相同基準、風險模型、指數或授權限制。
- 被動資金再平衡造成同方向交易。
- 流動性衝擊與價格追蹤造成表面領先／跟隨。
- 產業共同因子與市場狀態造成橫斷面同步。
- 同一券商／共同委託執行造成交易聚集，但不代表社會模仿。

### 可重播閘門
第三級最低需求不是「文獻證明台灣有從眾」，而是本系統能取得具有時點一致、投資人分類與方向性的可重播資料。公開三大法人日買賣超只能提供類別淨額，無法辨識類別內個體彼此跟隨；因此只能作弱代理或控制，不足以單獨升級。
社群資料若無穩定歷史存檔、貼文首次時間、刪文／編輯版本與帳號去重規則，也不得升級。

### 偏誤與驗證
- 樣本外與走動式驗證：從眾量測公式、時間窗與門檻先凍結。
- 選擇偏誤：不得只挑高聲量或極端交易日。
- 存活者偏誤：社群帳號、股票與投資人類型歷史消失不能回溯刪除。
- 多重測試：買／賣、不同投資人類型與不同時間窗需預先分主次。
- 因子冗餘：先控制 D06 擁擠、法人流、D17 事件新聞、D20-07 注意力、D20-10 情緒與 D02/D03 價量。
- 市場狀態：制度改變、危機與流動性狀態可能改變從眾方向與資訊含量。

### 結論
D20-06 維持 L2 / 40%。台灣研究證明「可辨識從眾需要投資人類型與時序資料」這條方法論成立，但目前本系統尚未證明擁有足夠的個體／高頻投資人資料或可重播社群版本鏈。公開類別淨額與價格同步不得取代直接行為證據。Formal Core unchanged；FORMAL_OPTIMIZATION_CANDIDATE = NONE。

## 2026-10-04｜D20 Taiwan PIT Feasibility Promotion Audit — Seven L3 Promotions

Canonical maturity rule:
- L2 = mechanism and falsification defined.
- L3 = Taiwan point-in-time data feasibility validated.
- L3 does not claim predictive alpha, OOS efficacy, profitability or Formal eligibility.

### D20-02 Disposition Effect -> L3
Validated scope is deliberately narrow: TWSE short-side disposition research.
- Official TWSE data distinguish actual securities-lending short sales from securities borrowing.
- TWT93U exposes prior/current SBL short-sale balance, sell, return, adjustment and next-session limit by date.
- Taiwan 2024 literature measures short covering relative to short-sale capital-gains overhang and finds a disposition effect among short sellers.
- A causal research contract can preserve date, price, prior/current short balance, new short sales, covering/returns, adjustments, rule vintage and formula version.
- Direct long-account PGR/PLR and full TPEx parity remain UNKNOWN.
Decision: L3 for the bounded TWSE short-side observable sublane; alpha remains UNKNOWN.

### D20-04 Anchoring / Reference Dependence -> L3
- Taiwan literature explicitly studies the ratio to the 52-week high as an anchoring reference.
- Existing validated TWSE/TPEx daily historical source contracts can causally reconstruct the last 252 eligible-session high, current-price/high ratio and high occurrence date.
- Corporate-action or missing-session continuity uncertainty fails closed to BLOCKED/UNKNOWN.
- Momentum, breakout, MA-distance and volatility remain mandatory redundancy controls.
Decision: L3 data feasibility; no claim that the 52-week-high proxy is independent alpha.

### D20-05 Representativeness / Recency -> L3
- Taiwan evidence separates nearness to the 52-week high from recency of the date on which the high occurred and finds strong regime/time dependence.
- The 52-week-high date and eligible sessions since that high are causally reconstructable from the validated daily price source.
- A dated Taiwan monthly survey archive can provide an independent expectation/sentiment receipt for future extrapolation tests.
- The same survey receipt cannot be counted independently under both D20-05 and D20-10.
Decision: L3 for research diagnostics; module remains OBSERVATION/RESEARCH_ONLY and identifiability remains unproven.

### D20-07 Investor Attention / Salience -> L3
- TWSE exposes an official machine-readable current attention-stock endpoint.
- TPEx provides authoritative attention-stock public/history sources; current integration gaps are not source absence.
- Exchange designation is treated as an observable salience event, not direct psychology and not directional alpha.
- Preserve designation/source date, capture clock, rule vintage and raw/source hash.
- Where intraday first-known is unavailable, replay eligibility begins conservatively at the next eligible session.
- Pre-designation abnormal return/volume and rule-trigger variables are controls because designation is endogenous to abnormal activity.
Decision: L3 for the exchange-salience-event sublane; causal effect remains UNKNOWN.

### D20-08 Underreaction / Post-event Drift -> L3
- D11-09 and D17-13 already validate Taiwan recurring-disclosure and scheduled/unscheduled event-clock feasibility.
- D20-08 consumes only events with valid sourcePublishedAt/capturedAt and exact replay eligibility.
- Future D1/D5/D20 outcome sessions are non-overlapping post-event windows with symbol-session/corporate-action guards.
- Historical monthly-revenue rows lacking original first-known timing remain UNKNOWN/excluded; statutory deadlines may not be backfilled as publication timestamps.
Decision: L3 for the valid-event-clock sublane; the original historical monthly-revenue clock remains partial and no drift alpha is claimed.

### D20-10 Investor Sentiment -> L3
- Cathay Financial Holdings publishes a monthly Taiwan economic-confidence survey archive with dated releases.
- The survey directly publishes stock-market optimism and risk-preference indices, plus survey windows/sample metadata in current releases.
- This source is distinct from news text, VIX, margin balance and raw price/volume.
- If exact publication time is absent, conservative replay knownAt is the next Taiwan session after the dated public release.
- No daily interpolation may create information between monthly releases.
Decision: L3 for market-level monthly sentiment context; OOS efficacy remains unknown.

### D20-12 Behavioral-vs-Structural Falsification -> L3
A replayable identification-receipt contract is now feasible using canonical Taiwan source families.
For each behavioral hypothesis preserve on one common cutoff:
1. behavioral target proxy receipt;
2. required structural/microstructure alternative-explanation receipts;
3. shared primitive receipt links to prevent duplicate votes;
4. source/version/knownAt/capturedAt;
5. missingness and UNKNOWN state;
6. formula/rule version;
7. common-support eligibility.
The contract can be instantiated immediately for the L3-ready D20-02/04/05/07/08/10 lanes.
Decision: L3 source/replay feasibility for the falsification framework; outcome joins remain closed.

### Modules intentionally not promoted
- D20-01: independent reference-point / investor cost-basis source not yet validated.
- D20-03: direct overconfidence identifiability remains unresolved.
- D20-06: replayable investor-identity/leader-follower or independent social-network source remains unproven.
- D20-09: price reversal is PIT-feasible under D03-05, but an independent behavioral-overreaction causal proxy has not yet passed the source gate.
- D20-11: no canonical PIT/replay social-language narrative-diffusion source.
- D20-13: upstream borrow-fee/availability/utilization data contract remains L2; true utilization and cross-market parity remain incomplete.

### Milestone
D20 now has 7 L3 modules and 6 L2 modules.
Aggregate D20 maturity = 50.8%.
Formal Core unchanged.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## 2026-10-04｜D20 L4 Prospective Evidence Phase

### Maturity decision
No module advances to L4 in this tranche.

Canonical rule:
L4 requires genuine Prospective Shadow or OOS evidence. Preregistration, source feasibility, historical reconstruction or retrospective literature are not sufficient.

### Contamination firewall
A development pilot combined dated Cathay monthly Taiwan sentiment releases from 2025-12 through 2026-09 with adjusted 0050 price paths.

Because both predictor values and future outcomes were inspected before the prospective design was frozen, this cohort is permanently classified:
DEVELOPMENT_ONLY_CONTAMINATED / NOT_PROMOTION_GRADE.

It cannot later be relabeled as OOS or Prospective Shadow.

### Development-pilot falsification
Using a conservative first-trading-session-after-release anchor:
- sentiment LEVEL and month-over-month CHANGE behave as empirically distinct objects;
- the tiny contaminated sample does not support a naive unconditional "higher sentiment => higher subsequent return" interpretation;
- sentiment levels show moderate negative descriptive correlations with D5/D20 adjusted-0050 returns in this small sample, while month-to-month changes show weak/mixed forward associations;
- no statistical, causal or alpha claim is allowed because the sample is tiny, regime concentrated, proxy-specific and contaminated.

This result is useful only for design:
1. test LEVEL and CHANGE separately;
2. do not preregister a bullish sign;
3. control prior market return and volatility;
4. use TAIEX as the primary broad-market outcome once prospectively captured;
5. keep adjusted 0050 as a secondary tradable-market proxy.

Machine evidence:
- research/d20_10_contaminated_development_pilot_v0_1.json

### Prospective preregistration
Frozen before future eligible outcomes:
- research/d20_l4_prospective_shadow_prereg_v0_1.json
- research/D20_L4_PROSPECTIVE_SHADOW_PREREG_20261004_V0_1.md

Eligible lanes:
- D20-02 TWSE short-side disposition;
- D20-04 52-week reference point;
- D20-05 recency conditional on reference point/momentum;
- D20-07 exchange salience designation;
- D20-08 valid first-known event drift;
- D20-10 monthly investor sentiment;
- D20-12 structural falsification.

### Frozen minimum evidence gates
D20-10:
- 6 independent post-freeze monthly releases;
- at least two materially different market regimes;
- immutable parent receipts;
- D5/D20 primary broad-market outcomes.

D20-07:
- 20 independent dates;
- 100 treated designation events;
- matched common-support controls;
- pre-designation return/turnover/volatility controls.

D20-04 / D20-05:
- 12 independent weekly parent dates;
- continuous/rank primary specification;
- no outcome-tuned bucket search;
- D20-05 must add residual information beyond D20-04 and D03 or become narrowing/merge eligible.

D20-02:
- 12 independent weekly TWSE parents;
- short capital-gains-overhang and covering states frozen before outcomes;
- long-account PGR/PLR and TPEx parity remain UNKNOWN.

D20-08:
- 12 independent event dates;
- first-known/capturedAt required;
- D1/D5/D20 windows fixed before outcomes;
- unresolved historical event clocks remain excluded/UNKNOWN.

D20-12:
- at least 20 independent prospective discriminating cases;
- target behavioral proxy and structural counterfactual receipts must share a common cutoff.

### Governance consequence
The next valid evidence comes only from post-freeze observations. More theory or retrospective outcome inspection cannot increase D20 maturity.

D20 remains 50.8%.
Formal Core unchanged.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## 2026-10-04｜D20-01 and D20-09 bounded PIT promotions; D20-13 held at L2

### D20-01 Prospect Theory / Loss Aversion — bounded short-side reference dependence

The original blocker was the absence of a replayable investor reference point or cost basis.

That blocker is now partially resolved by the already-validated D20-02 TWSE short-side receipt:
- referencePriceShort;
- shortCapitalGainsOverhang;
- new short sales;
- covering/returns;
- prior/current short balance;
- source/rule lineage.

This supports a bounded, causal test of reference-dependent behavior around zero short PnL:
- compare covering behavior on the gain side versus the loss side of the same reconstructed reference;
- preserve the full continuous distance from the reference point;
- control size, liquidity, volatility, new shorting, institutional ownership, borrow economics and regime.

Important falsification:
- asymmetric covering does not uniquely identify pure loss aversion;
- realization utility, risk controls, recalls, information and transaction frictions can create similar asymmetry;
- the same primitive is shared with D20-02 and cannot become an extra directional vote;
- long-account PGR/PLR remains UNKNOWN.

Decision:
D20-01 -> L3 for the TWSE short-side reference-dependence sublane only.
Pure loss aversion remains UNIDENTIFIED.
Formal Core unchanged.

### D20-09 Overreaction / Reversal — event-conditioned initial-response sublane

The H07 firewall remains:
- D03-05 owns observable pullback/reversal;
- D20-09 can own only a behavioral/event-conditioned cause.

Existing source families now jointly make a bounded PIT lane feasible:
1. D20-08 / D17-13 provide event first-known and replay clocks;
2. event information content/surprise can be frozen before price outcomes, otherwise UNKNOWN;
3. D03-05 provides completed Fugle 15m bar clocks with exact slot-continuity rules;
4. D20-07 attention and D20-10 sentiment may enter as optional context, never mandatory backfilled inputs.

Decision-time diagnostic:
EVENT_CONDITIONED_INITIAL_RESPONSE_RESIDUAL.

The parent stores only:
- event clock;
- frozen surprise value/version;
- pre-event path;
- first 15m/30m market-sector residual response;
- liquidity/volatility/price-limit/context state.

Later reversal is excluded from the parent and joins only after the horizon closes.

Structural falsifiers remain:
bid-ask bounce, opening imbalance, temporary liquidity impact, forced flow, price-limit mechanics, volatility normalization, sector/market shock and later new information.

Taiwan evidence is consistent with this decomposition: 2026 record-high monthly-revenue research documents next-day intraday reversal alongside later positive drift, so a single reversal label cannot identify the full behavioral path.

Decision:
D20-09 -> L3 for the event-conditioned initial-response data-feasibility lane.
Behavioral overreaction cause remains unproven until prospective structural discrimination.
Formal Core unchanged.

### D20-13 Limits to Arbitrage — no promotion

Official TWSE rules verify that public securities-lending information can include:
- fixed rate;
- executed quantities;
- unexecuted lending/borrowing quantities;
- competitive-bid execution rates;
- best-five lending and borrowing rate/quantity depth.

This is sufficient to define a bounded TWSE displayed borrowing-scarcity/cost state.

However, D20-13 remains L2 because:
- upstream D06-18 has not yet captured the first verified live post-contract rate/supply receipt on a genuine trading day;
- displayed lending supply is not total lendable inventory;
- borrowing and lending quote persistence differ;
- negotiated lending dominates total market activity, so public competitive/fixed books are not whole-market supply;
- true utilization remains UNKNOWN;
- TPEx parity remains incomplete.

Status:
L3_READY_PENDING_FIRST_VERIFIED_LIVE_TWSE_RATE_SUPPLY_RECEIPT.

No outcome, alpha, L4 or Formal claim.

## 2026-10-04｜D20-06 / D20-11 public-forum PIT promotion

### Live source verification
A live PTT Stock-board Atom feed was successfully fetched and exposed current article URLs, article publication/update clocks, author identifiers and content previews.
A live article page exposed:
- public author handle;
- original post time to second;
- push / boo / arrow participant handles;
- comment time to minute;
- explicit article edit markers with edit time to second.

Durable source receipt:
research/d20_ptt_social_source_live_receipt_20261004_v0_1.json

Conservative replay rule:
capturedAt is the system-observable first-known clock. Source-stated post/comment/edit times remain provenance and may not backdate observability before the first successful capture.
Snapshots append; later edit/deletion states do not rewrite prior captured versions.
Historical completeness before the first verified capture is not claimed.

### D20-11 Narrative / Theme Diffusion -> L3
Bounded scope:
PTT Stock public-forum narrative diffusion only.

Valid observables:
- topic / phrase state;
- stance distribution;
- distinct-participant count;
- diffusion transition counts;
- narrative persistence / half-life when source coverage permits.

Ownership firewall:
- D09-11 owns theme / company / industry membership.
- D17-11 owns underlying dated news/event propagation.
- D20-07 owns attention/salience volume context.
- D20-11 owns only residual social-language narrative diffusion beyond those controls.

Copied headlines, raw post volume, static theme membership and price co-movement are not independent narrative evidence.

Privacy guard:
public handles may be used transiently for within-window de-duplication only. Derived research receipts retain aggregate counts/transitions and do not create named-user psychology or influence profiles.

Decision:
D20-11 -> L3 Taiwan PIT data feasibility.
No L4, alpha or Formal claim.

### D20-06 Herding / Social Proof -> L3
Bounded scope:
aggregate social-herding / stance-convergence in the PTT Stock public-forum stream.

PTT handles are public forum actors only, not verified brokerage investors or natural-person trading accounts.
Push / boo / arrow is reaction to the post, not stock stance.

The behavioral transform must be aggregate:
- stance histogram;
- distinct participant count;
- sequence transition counts;
- adoption/convergence statistics.

Only residual convergence after common-news, topic, attention, market and sector controls may be interpreted as bounded social-herding evidence.

Taiwan literature support:
2025 Taiwan research using real-time, high-frequency public sentiment/stance plus intraday transaction data reports that public sentiment and stance significantly relate to herding, with heterogeneous effects across investor types and industries. This supports the data family but does not validate our PTT effect size or direction.

Counterevidence:
older PTT Stock studies report inconsistent return-prediction signs across stocks/horizons. Forum discussion volume or stance therefore has no assumed directional alpha.

Privacy guard:
no persistent named-user leader/follower, persuasion or psychology score.

Decision:
D20-06 -> L3 Taiwan PIT data feasibility for the bounded public-forum aggregate sublane.
No claim of brokerage-account herding.
No L4, alpha or Formal claim.

### D20-03 Overconfidence remains L2
The same PTT source can prospectively preserve explicit numerical forecasts/targets.
However:
- forecast error is not overconfidence;
- most posts do not expose subjective probability or confidence intervals;
- public posting is not verified trading behavior;
- selection, reputation incentives, sarcasm and edits can confound calibration.

Therefore D20-03 remains L2 until a near-direct confidence/uncertainty observable with replayable lineage exists.

### L4 prospective extension
D20-06 and D20-11 were added to the prospective preregistration at 2026-10-04 14:06:56 Asia/Taipei.
Only social aggregate parents first captured after that extension are promotion-eligible.
Pages inspected before the extension are source-feasibility evidence only.

Current D20 maturity: 56.9%.
Formal Core unchanged.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## 2026-10-04｜D20-03 explicit-confidence calibration -> L3

A narrower direct-expression route resolves the data-feasibility blocker without inferring psychology from market activity.

### Source-feasible observations
PTT Stock structured target posts can expose:
- explicit long/short classification;
- target price;
- stop price;
- forecast horizon when stated;
- explicit certainty language;
- explicit probability/percentage language;
- explicit self-reported hit-rate or skill claims.

These are captured under the same append-only PTT source contract used by D20-06/D20-11.

### Valid interpretation
The L3 lane measures public expressed-confidence calibration at article/aggregate level.

It does NOT establish:
- private psychological trait overconfidence;
- actual brokerage trading;
- account-level risk-taking;
- general Taiwan-investor overconfidence.

Forecast error alone is not overconfidence.
A qualifying confidence row requires explicit confidence/uncertainty evidence; turnover, margin, recent return, posting frequency and target error are forbidden substitutes.

### Falsification
Public statements may be strategic, performative, selective or sarcastic.
Self-reported hit rates may be incomplete or unverifiable.
Published forecasts are selected rather than a representative sample of all beliefs.
Therefore the lane remains OBSERVATION / RESEARCH_ONLY.

### Privacy
No named-user confidence, psychology, skill or influence score is produced.
Derived evidence is aggregate by confidence class, date/topic/regime and frozen forecast horizon.

### Decision
D20-03 -> L3 Taiwan PIT data feasibility for the bounded public explicit-confidence calibration sublane.
No L4, alpha or Formal claim.

### L4 extension
Prospective preregistration extended at 2026-10-04 14:12:14 Asia/Taipei.
Only qualifying forecasts first captured after that extension are promotion-eligible.
Previously inspected posts are L3 source examples only.

Current D20 maturity: 58.5%.
Only D20-13 remains L2.

## 2026-10-04｜First genuine D20 L4 prospective parent collection

The first post-freeze social parent was captured after the D20-06/D20-11 preregistration cutoff and before any future market outcome.

Evidence receipt:
- `research/d20_social_prospective_parent_20261004_001.json`
- one participant;
- zero replies at capture;
- explicit market-bullish language coexisting with explicit uncertainty;
- no future price or engagement outcome stored.

Bias control:
The zero-engagement parent is retained. Selecting only active/high-reply threads would create attention-conditioned selection bias.

D20-03 taxonomy falsification:
The first observed post contained explicit uncertainty not representable in the prior frozen confidence classes. The observed post is permanently ineligible for retrospective reclassification. A new explicit-uncertainty class is effective only for later first-observed posts:
- `research/d20_03_confidence_taxonomy_amendment_v0_2.json`

Aggregate-only classifier:
- `research/d20_social_topic_stance_classifier_v0_1.json`
- no named-user psychology, skill, influence or leader/follower score.

Prospective coverage:
- D20-06 = 1/50 parents, 1/20 independent dates;
- D20-11 = 1/50 parents, 1/20 independent dates;
- D20-03 = 0/100 qualifying parents, 0/20 independent dates.

D20-13 weekend source dry-run:
- official TWSE securities-borrowing information source is accessible;
- dynamic MIS generic extraction returned empty content;
- exact free live rate/depth machine endpoint remains unresolved;
- no weekend snapshot is eligible for L3.

Artifact:
- `research/d20_13_weekend_source_dry_run_20261004_v0_1.json`

Maturity decision:
D20 remains 58.5%. The run adds genuine prospective evidence collection, not enough independent dates/parents for L4.
Formal Core unchanged.

## 2026-10-04｜Social source fingerprint self-falsification and repair

The first prospective social pipeline exposed a source-identity defect before any L4 promotion.

V0.1 failure:
- the parent fingerprint hashed the connector/tool envelope rather than canonical page content only;
- repeated fetches therefore produced different fingerprints even when no post-parent edit/reply was observable;
- the apparent fingerprint DIFF could not be interpreted as source-content change.

Governance response:
- never rewrite parent 001;
- append invalidation receipt;
- remove parent 001 from promotion-grade coverage;
- freeze V0.2 before re-baselining.

V0.2:
- parse the connector result;
- hash only normalized canonical page text;
- remove transport latency/cache/tool-envelope fields;
- use SHA-256 over UTF-8 normalized content;
- derive a separate receipt hash from URL + capturedAt + content hash + schema version.

Rebased parent:
`D20SOC-20261004-002`.

Immediate repeatability:
PASS — identical canonical page content produced identical SHA-256.

This is a pipeline-quality result, not an alpha result.
D20 maturity remains 58.5%.

## 2026-10-04｜Primary social sampling-clock selection-bias audit

A prospective sample can still be biased if the researcher chooses the capture time opportunistically.

Therefore the manual post-freeze parent D20SOC-20261004-002 is retained as valid source/process evidence but removed from PRIMARY L4 sample-size counts.

A deterministic primary sampling contract is now frozen:
- primary social capture occurs only in an actually executed Room13 fixed :10 scheduled research run;
- if central rotation disables Room13 or a scheduled capture does not execute, that interval is UNKNOWN and is not backfilled;
- because the Atom feed is a finite latest-entry window, adjacent valid snapshots require overlap continuity or another pre-frozen continuity proof;
- every first-observed entry in a valid snapshot is included regardless of engagement, topic, stance or future outcome;
- zero-reply / zero-adoption observations remain in the cohort.

Artifact:
`research/d20_social_sampling_coverage_contract_v0_1.json`

Primary coverage is reset to zero for D20-03, D20-06 and D20-11.
Secondary process evidence remains one source-valid parent for D20-06/D20-11.

This is a stricter evidence decision, not lost research progress.
D20 maturity remains 58.5%.
Formal Core unchanged.
