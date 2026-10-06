# Asset Pricing / Factor Investing Research

Updated: 2026-10-02 Asia/Taipei
Scope: D19
Status: RESEARCH LANE INITIALIZED / NO EVIDENCE YET

This lane studies factor premia, cross-sectional anomalies and factor exposures as reusable market knowledge. It must not treat repackaged versions of existing D03/D07/D08/D09 signals as independent evidence without D16 redundancy and multiple-testing controls.


## 2026-10-02 Long-block Stage 1 — D19-01 / D19-02 theory -> falsification

### D19-01 CAPM / Beta / Alpha / Benchmark Residual

#### Core separation
1. CAPM equilibrium statement: expected excess return is linked to systematic covariance with the market portfolio, not to total volatility.
2. Beta is an exposure estimate, not an investable alpha signal by itself.
3. Jensen alpha is an intercept conditional on a selected benchmark/model. Change the benchmark or factor set and the estimated alpha can change.
4. Benchmark residual is therefore model-relative. It must not be relabeled as independent alpha until benchmark choice, factor redundancy, trading costs and OOS/Shadow evidence are controlled.

#### Positive mechanism
- Sharpe (1964) provides the equilibrium mechanism under restrictive assumptions: homogeneous expectations plus common borrowing/lending terms imply compensation for systematic market risk.
- Fama-MacBeth (1973) reported evidence broadly consistent with a positive risk-return relation in their historical NYSE sample.
- A beta/residual framework is still useful operationally as a risk decomposition layer even when CAPM is not a complete return model.

#### Falsification / counterevidence
- Roll (1977) shows that a valid CAPM test depends on the true market portfolio; using an incomplete equity index makes the test jointly about CAPM and benchmark choice.
- Fama-French (1992) report a flat beta-average-return relation in their 1963-1990 U.S. sample once size-related variation is handled.
- Frazzini-Pedersen (2014) document a low-beta/high-beta pattern consistent with leverage and margin constraints, directly contradicting the naive rule "higher beta -> higher alpha".
- Taiwan evidence is not one-directional: Chui-Wei (1998) reports a weak beta-average-return relation in Taiwan and other Pacific-Basin markets, while Sheu-Wu-Ku (1998) finds a significant conditional beta relation in Taiwan when trading volume and sales-to-price are considered. This conflict is itself evidence that beta should be treated conditionally, not as a universal stock-ranking score.

#### Measurement failure modes
- Nonsynchronous or infrequent trading biases ordinary beta estimates; Scholes-Williams (1977) and Dimson (1979) show why thin trading creates serious estimation bias.
- Taiwan implementation must therefore compare at least ordinary beta versus lead/lag-adjusted beta and test daily versus lower-frequency estimates.
- Beta window, benchmark, return adjustment, suspended/no-trade days, corporate actions and delistings must be frozen in replay.
- UNKNOWN data states must never be imputed as zero return or zero exposure.

#### PIT / replay contract before L3
- Point-in-time security universe and listing status.
- Point-in-time benchmark definition and index constituent/version semantics.
- Split/dividend/capital-action adjusted return policy with first-known timestamps.
- Risk-free-rate source and timestamp semantics.
- Shares outstanding / market-cap history where required for cross-sectional controls.
- Delisted and suspended securities retained to avoid survivorship bias.
- Store raw beta, adjusted beta, alpha, residual volatility, benchmark id, window length and observation count so every score is replayable.

#### System 1 / System 2 incremental-value assessment
- System 1: no direct BUY score promotion. Potential use is exposure/risk normalization or a guard against accidental high-beta concentration.
- System 2: stronger candidate as a neutralization layer: convert raw momentum/return signals into benchmark- or factor-residual signals, then test whether residual information survives costs and overlap with D03/D09.
- Formal optimization candidate: NO. D19-01 reaches theory/mechanism/falsification design only; Taiwan PIT replay and OOS/Shadow evidence are still missing.

#### Evidence anchors
- Sharpe (1964), Journal of Finance, DOI 10.1111/j.1540-6261.1964.tb02865.x
- Jensen (1968), Journal of Finance, DOI 10.1111/j.1540-6261.1968.tb00815.x
- Fama & MacBeth (1973), Journal of Political Economy, DOI 10.1086/260061
- Roll (1977), Journal of Financial Economics, DOI 10.1016/0304-405X(77)90009-5
- Fama & French (1992), Journal of Finance, DOI 10.1111/j.1540-6261.1992.tb04398.x
- Frazzini & Pedersen (2014), Journal of Financial Economics, DOI 10.1016/j.jfineco.2013.10.005
- Scholes & Williams (1977), Journal of Financial Economics, DOI 10.1016/0304-405X(77)90041-1
- Dimson (1979), Journal of Financial Economics, DOI 10.1016/0304-405X(79)90013-8
- Chui & Wei (1998), Pacific-Basin Finance Journal, DOI 10.1016/S0927-538X(98)00013-4
- Sheu, Wu & Ku (1998), International Review of Financial Analysis, DOI 10.1016/S1057-5219(99)80035-0

### D19-02 Size factor

#### Core definition
- Size must be defined mechanically from point-in-time equity market capitalization; use log market cap for cross-sectional work and freeze whether total or free-float capitalization is used.
- A size score is not equivalent to "small-cap is better". The empirical relation is nonlinear and often concentrated in the smallest names.

#### Positive mechanism
- Banz (1981) documents higher risk-adjusted returns for smaller firms and explicitly notes that the effect is concentrated in very small firms.
- Plausible channels include information frictions, distress/financing constraints, illiquidity compensation and limits to arbitrage.

#### Falsification / counterevidence
- Banz also states that size may only proxy for other unknown characteristics.
- Amihud (2002) shows illiquidity is stronger for small stocks and can explain time variation in small-firm premia, so a raw size factor risks re-labeling liquidity compensation.
- Taiwan evidence is inconsistent across samples and methods:
  - Chui & Wei (1998) find no significant conventional size effect for Taiwan in their Pacific-Basin comparison.
  - A 2001 NCCU thesis using 1992-2000 Taiwan data reports size, value, momentum and liquidity effects.
  - Liao (2005) finds the traditional size anomaly is sensitive to the borrowing/lending-rate assumption and questions routine use of size in emerging markets.
- Fama-French five-factor evidence shows size interacts with profitability and investment; therefore size cannot be assumed independent of D07/D08-style fundamentals.

#### PIT / replay contract before L3
- Point-in-time shares outstanding and close price on the formation date.
- Corporate actions, cash/stock dividends, capital reductions/increases and listing/delisting events.
- Market-cap vintage must not be backfilled with later restatements.
- Preserve microcap, illiquidity, turnover, price, listing-age and suspended-trading flags so the "size premium" can be decomposed rather than accepted at face value.
- Test equal-weight and value-weight portfolios separately because microcaps can dominate equal-weight results.
- Include realistic transaction-cost and capacity filters before interpreting any spread as investable alpha.

#### Redundancy tests
- Size vs liquidity/turnover (D05/D04 overlap).
- Size vs value and profitability/investment (D08/D07 overlap).
- Size vs industry/sector composition (D09 overlap).
- Size vs volatility/beta (D04/D19-01 overlap).
Only residual incremental spread after neutralization can qualify as an independent D19 signal.

#### System 1 / System 2 incremental-value assessment
- System 1: no raw small-cap bonus. At most use size as exposure/risk metadata until Taiwan PIT evidence is built.
- System 2: test size-conditioned signal performance and capacity buckets, especially whether existing momentum/resonance strategies behave differently after size/liquidity neutralization.
- Formal optimization candidate: NO. D19-02 reaches theory/mechanism/falsification design only.

#### Evidence anchors
- Banz (1981), Journal of Financial Economics, DOI 10.1016/0304-405X(81)90018-0
- Fama & French (1992), Journal of Finance, DOI 10.1111/j.1540-6261.1992.tb04398.x
- Amihud (2002), Journal of Financial Markets, DOI 10.1016/S1386-4181(01)00024-6
- Fama & French (2015), Journal of Financial Economics, DOI 10.1016/j.jfineco.2014.10.010
- Chui & Wei (1998), Pacific-Basin Finance Journal, DOI 10.1016/S0927-538X(98)00013-4
- Liao (2005), Global Business Review, DOI 10.1177/097265270400400105

### Stage 1 maturity decision
- D19-01 -> L2: mechanism + falsification + PIT/replay/data/cost/redundancy requirements defined.
- D19-02 -> L2: mechanism + falsification + PIT/replay/data/cost/redundancy requirements defined.
- D19 domain maturity -> 6.7% (2 modules at 40%, 10 modules at 0%, simple module average).
- No module promoted to L3 because a Taiwan point-in-time source map and executable replay receipt have not yet been built.
- Formal Core remains unchanged.


## 2026-10-02 Long-block Stage 2 — D19-03 / D19-04 theory -> falsification

### D19-03 Value factor

#### Core separation
1. A valuation characteristic (for example book-to-market) is an observable cross-sectional descriptor.
2. A value factor is a diversified return spread formed from valuation characteristics.
3. D08 valuation research asks whether a security appears cheap/expensive relative to fundamentals or peers; D19-03 instead asks whether a cross-sectional value exposure earns a persistent, independent premium.
4. Therefore "cheap stock" and "positive value-factor alpha" are not interchangeable.

#### Positive mechanisms
- Fama-French evidence establishes book-to-market as a strong cross-sectional return characteristic in U.S. historical samples.
- A rational interpretation is compensation for distress or other omitted systematic risks.
- Lakonishok-Shleifer-Vishny provide a behavioral alternative: investors extrapolate past growth too far, creating glamour overpricing and value underpricing.

#### Falsification / counterevidence
- Fama-French five-factor evidence shows the original value factor can become statistically redundant once profitability and investment are included in some samples. This is a direct warning against counting D08 cheapness, D07 profitability and D19 value as three independent sources of alpha.
- Taiwan evidence is mixed across sample periods and methods. Chui-Wei report no significant conventional book-to-market effect for Taiwan in their regional comparison, while later Taiwan studies report value effects under other samples/specifications.
- A recent long-history Taiwan thesis covering listed and delisted firms reports that size/value effects are heavily concentrated in small caps and stresses timely book-to-market construction; this is useful Taiwan-specific evidence but should be treated as thesis evidence rather than final peer-reviewed proof.
- Accounting staleness is a major look-ahead/stale-information risk: using a book value that was not yet public at the portfolio formation date manufactures an unrealistically clean value signal.

#### PIT / replay contract before L3
- Financial statement first-public timestamps, not fiscal-period labels alone.
- Original first-known accounting values retained separately from later restatements.
- Frozen book-equity definition, treatment of negative book equity and financial-sector accounting exceptions.
- Market-cap denominator sampled on the documented formation date.
- Corporate actions, delistings, suspensions, price limits and listing-age status preserved.
- Formation lag after public disclosure must be explicit and replayable.
- Alternative value definitions (B/M, E/P, cash-flow yield) must be declared ex ante for each experiment; selecting the best historical definition after testing is data snooping.
- Equal-weight and value-weight spreads plus realistic turnover/cost estimates must both be reported.

#### Redundancy tests
- D08 valuation: raw cheapness / peer valuation.
- D07 profitability / quality.
- D19-02 size.
- D05 liquidity / turnover.
- D09 industry composition.
Only the residual spread after these controls can be treated as an independent D19 value candidate.

#### System 1 / System 2 incremental-value assessment
- System 1: do not add a blanket "cheap = buy" score. A potential future role is valuation-context metadata or a residual valuation control.
- System 2: test sector-, size-, liquidity- and profitability-neutral value ranks as one cross-sectional sleeve, then measure incremental information versus existing D08 signals.
- Formal optimization candidate: NO. Theory, mechanisms, counterevidence and PIT design are defined; Taiwan executable PIT replay is still missing.

#### Evidence anchors
- Fama & French (1992), Journal of Finance, DOI 10.1111/j.1540-6261.1992.tb04398.x
- Lakonishok, Shleifer & Vishny (1994), Journal of Finance, DOI 10.1111/j.1540-6261.1994.tb04772.x
- Fama & French (2015), Journal of Financial Economics, DOI 10.1016/j.jfineco.2014.10.010
- Chui & Wei (1998), Pacific-Basin Finance Journal, DOI 10.1016/S0927-538X(98)00013-4

### D19-04 Cross-sectional Momentum factor

#### Core separation
1. Cross-sectional momentum ranks securities against one another on lagged performance; it is not the same object as time-series trend following.
2. D03 technical momentum/trend and D09 relative strength can contain the same raw price information. D19-04 is independent only if a factor-level, neutralized cross-sectional spread retains incremental information.
3. A classic momentum specification typically excludes the most recent short interval to reduce short-term reversal contamination, but the exact formation/skip/holding windows must be frozen before the confirmatory test rather than selected from the best backtest.

#### Positive mechanisms
- Jegadeesh-Titman document medium-horizon winner-minus-loser continuation in U.S. stocks.
- Rouwenhorst finds similar continuation across multiple international equity markets, indicating that the phenomenon is not uniquely U.S.
- Candidate mechanisms include gradual information diffusion/underreaction, investor behavior and time-varying risk exposure.

#### Falsification / counterevidence
- Momentum is not stable across market states. Daniel-Moskowitz show severe momentum crashes can occur after market declines, high volatility and sharp rebounds.
- Taiwan is a particularly important counterexample to any universal momentum claim. Taiwan studies report weak or absent ordinary momentum in some periods, positive momentum during continuing market states but reversals around transitions, and cancellation between positive intraday and negative overnight components.
- High turnover can attenuate conventional momentum; persistence-based variants may behave differently.
- A 2026 Taiwan study using 1993-2025 data and listed plus delisted firms finds volatility-scaled momentum often improves conventional strategies and that time-series momentum can be more stable than cross-sectional momentum, with much of profit coming from the winner/long side. Because it compares many specifications, multiple-testing control is mandatory before treating the best specification as evidence.

#### PIT / replay contract before L3
- Point-in-time universe including delisted names.
- Corporate-action-adjusted total-return policy fixed before ranking.
- Suspended/no-trade dates and price-limit states retained; UNKNOWN must not be converted to zero momentum.
- Formation, skip and holding windows recorded as experiment parameters.
- Market/industry/size/volatility neutralization inputs must themselves be point-in-time.
- Short-leg evidence must include contemporaneous borrowability/short-sale restrictions and realistic costs; if not available, report long-only evidence separately.
- Turnover, spread, impact and capacity estimated using information available at the formation date.
- Regime labels must be generated with contemporaneous data only; no ex-post regime labeling for a prospective rule.

#### Redundancy tests
- D03 price trend / technical momentum.
- D09 sector RS and stock RS.
- D04 volatility / microstructure.
- D18 regime interaction.
- D19-02 size.
Momentum can be called an independent D19 alpha candidate only if residualized ranks preserve OOS/Shadow value after these overlaps.

#### System 1 / System 2 incremental-value assessment
- System 1: no direct replacement of current selection logic. Momentum research is useful mainly as a diagnostic for whether existing trend/RS rules are duplicating the same exposure.
- System 2: a promising research path is long-side cross-sectional residual momentum after sector/size/volatility controls, with a regime/crash-risk gate and explicit cost model.
- Formal optimization candidate: NO. The Taiwan literature is sufficiently mixed that a direct formal rule would be premature.

#### Evidence anchors
- Jegadeesh & Titman (1993), Journal of Finance
- Rouwenhorst (1998), Journal of Finance
- Daniel & Moskowitz (2016), Journal of Financial Economics
- Lin et al. (2016), Taiwan market dynamics and momentum evidence
- Ho et al. (2023), Taiwan intraday versus overnight momentum evidence
- Chen et al. (2023), Taiwan persistence-based momentum evidence
- Huang, Pan & Wang (2026), Taiwan momentum study using 1993-2025 data

### Stage 2 maturity decision
- D19-03 -> L2: theory, competing mechanisms, Taiwan counterevidence, PIT/replay, redundancy and cost requirements defined.
- D19-04 -> L2: theory, regime/crash counterevidence, Taiwan-specific failure modes, PIT/replay, redundancy and cost requirements defined.
- D19 domain maturity -> 13.3% (four modules at 40%, eight modules at 0%, simple module average).
- D19-01 through D19-04 remain below L3 pending a shared Taiwan point-in-time source map and executable replay receipts.
- Formal Core remains unchanged.


## 2026-10-02 Long-block Stage 3 — D19-05 / D19-06 + Taiwan PIT source-map design

### D19-05 Quality / Profitability factor

#### Core separation
1. "Quality" is not a single primitive factor. It can mix profitability, accrual quality, leverage, earnings stability, growth quality and balance-sheet strength.
2. D19-05 therefore starts from narrowly defined profitability characteristics before testing broader quality composites.
3. D07 fundamental research can use profitability as a company-quality input; D19-05 asks whether a diversified, cross-sectional profitability exposure earns an independent premium after controlling for value, size, investment, industry and liquidity.
4. Different profitability numerators are not interchangeable: gross profits/assets, operating profitability/book equity, ROE and cash-based operating profitability can have materially different accounting content and anomaly overlap.

#### Positive mechanisms
- Novy-Marx (2013) finds gross profitability has cross-sectional predictive power comparable to book-to-market and that profitable firms can earn higher average returns despite higher valuations.
- Fama-French (2015) include profitability and investment factors in a five-factor model that improves on the three-factor model in their sample.
- Hou-Xue-Zhang (2015) independently motivate a profitability factor together with investment in an investment-based q-factor framework, and show broad anomaly coverage.

#### Falsification / counterevidence
- Strong profitability does not automatically imply an independent alpha. Fama-French and q-factor evidence explicitly shows that profitability and investment can absorb returns previously attributed to value or other anomalies, creating substantial factor redundancy.
- Profitability measurement is definition-sensitive. Later research shows cash-based operating profitability can outperform accrual-containing measures, so a backtest that tests many numerators and keeps the winner is vulnerable to multiple testing.
- Emerging-market evidence is weaker and less uniform than U.S. evidence. A 2018 emerging-markets study finds little evidence of profitability effects overall even though richer factor models can improve pricing.
- Taiwan-specific five-factor thesis evidence using listed and delisted firms from 1990-2020 finds profitability and investment add explanatory power, but some previously better-performing portfolios obtain worse unexplained intercepts; therefore "more factors" is not automatically "better model."
- Taiwan evidence is not yet strong enough here to choose one profitability definition as a production ranking rule.

#### PIT / replay contract before L3
- First-public timestamp of annual/quarterly financial statements.
- Original first-known values retained separately from later restatements.
- Frozen accounting formula and denominator for each tested profitability definition.
- Fiscal-year/quarter alignment and reporting lag handled explicitly.
- Financial-sector accounting treated separately or excluded under a predeclared rule.
- Negative equity, extraordinary items and merger/reorganization discontinuities flagged.
- Market-cap, industry, size, investment and value controls sampled using only contemporaneously known data.
- Any composite "quality" score must be decomposable into component contributions and must not be tuned after seeing OOS results.

#### Redundancy tests
- D07 profitability / business quality.
- D08 valuation.
- D19-02 size.
- D19-03 value.
- D19-06 investment.
- D05 liquidity and D09 industry.
Only residual incremental information can qualify as independent D19 alpha.

#### System 1 / System 2 incremental-value assessment
- System 1: no direct profitability bonus yet. More useful initially as a veto/context layer preventing value or momentum signals from being misread when accounting quality is weak.
- System 2: candidate for a neutralized profitability sleeve or conditioning variable, especially when testing whether value/momentum residuals survive profitability control.
- Formal optimization candidate: NO; Taiwan PIT replay, definition robustness and prospective evidence remain missing.

#### Evidence anchors
- Novy-Marx (2013), Journal of Financial Economics, DOI 10.1016/j.jfineco.2013.01.003
- Fama & French (2015), Journal of Financial Economics, DOI 10.1016/j.jfineco.2014.10.010
- Hou, Xue & Zhang (2015), Review of Financial Studies, DOI 10.1093/rfs/hhu068
- Emerging Markets Review (2018), size/value/profitability/investment evidence in emerging markets
- Taiwan five-factor thesis using 1990-2020 listed and delisted firms, National Central University

### D19-06 Investment / Asset Growth factor

#### Core separation
1. "Investment" can mean capital expenditure, total-asset growth, asset growth scaled by lagged assets, inventory growth, working-capital expansion or other balance-sheet changes.
2. D19-06 uses total-asset growth / investment characteristics as the broad cross-sectional family, not as a single immutable formula.
3. D07 supply/business expansion and D19-06 factor exposure are different objects: the first studies company economics; the second tests whether investment intensity produces an independent return spread.
4. In the Fama-French framework, conservative investment tends to associate with higher average returns; investment-based q-theory links expected returns jointly to profitability and investment.

#### Positive mechanisms
- Titman-Wei-Xie document lower subsequent benchmark-adjusted returns after unusually high capital investment, especially where managerial discretion is higher.
- Cooper-Gulen-Schill find annual asset growth strongly predicts future abnormal returns and survives controls for several known characteristics.
- Hou-Xue-Zhang show investment and profitability factors jointly summarize a broad set of return anomalies.
- Fama-French (2015) similarly find investment adds explanatory power in their five-factor model.

#### Falsification / counterevidence
- The return-investment relation is not universally stable. Titman-Wei-Xie themselves show the effect varies with governance/takeover conditions, which is evidence of regime/institution dependence rather than a timeless law.
- Asset growth may proxy financing, acquisitions, distress recovery, industry expansion, lifecycle or managerial behavior. Without decomposition, a "low investment wins" rule can misclassify healthy growth firms.
- Taiwan-specific five-factor evidence is especially important: one 1990-2020 thesis reports the Taiwan investment factor can have the opposite sign from the conventional Fama-French intuition, with more-investing firms earning higher returns in its sample. This directly blocks importing the U.S. conservative-investment rule into Taiwan without local PIT validation.
- Asset-growth signals are accounting-data intensive and vulnerable to restatement/look-ahead bias, mergers, spin-offs, capital reductions and denominator changes.

#### PIT / replay contract before L3
- First-public balance-sheet timestamp for total assets and all investment inputs.
- Preserve pre-restatement values available at the formation date.
- Corporate actions, mergers, spin-offs, asset transfers and accounting-standard changes explicitly flagged.
- Freeze asset-growth formula and lag convention ex ante.
- Separate organic investment from acquisition-driven balance-sheet expansion where data permits.
- Control contemporaneously for profitability, value, size, industry, leverage, financing issuance and liquidity.
- Transaction costs and capacity must be measured because high-investment/low-investment portfolios can have strong size/industry skews.

#### Redundancy tests
- D07 growth/capital expenditure/fundamentals.
- D08 valuation.
- D19-03 value and D19-05 profitability.
- D14 governance/management incentives where available.
- D15 capital structure/financing pressure where available.
- D09 industry cycle.
Only the residual investment spread after these controls can qualify as independent D19 evidence.

#### System 1 / System 2 incremental-value assessment
- System 1: do not penalize high investment mechanically. Taiwan sign uncertainty makes that unsafe.
- System 2: strong research use as an interaction/control variable with profitability and value; the key experiment is whether a joint profitability-investment state improves ranking stability rather than whether either raw factor wins alone.
- Formal optimization candidate: NO; Taiwan sign uncertainty and PIT accounting requirements are unresolved.

#### Evidence anchors
- Titman, Wei & Xie (2004), Journal of Financial and Quantitative Analysis
- Cooper, Gulen & Schill (2008), Journal of Finance, DOI 10.1111/j.1540-6261.2008.01370.x
- Fama & French (2015), Journal of Financial Economics, DOI 10.1016/j.jfineco.2014.10.010
- Hou, Xue & Zhang (2015), Review of Financial Studies, DOI 10.1093/rfs/hhu068
- Taiwan five-factor thesis using 1990-2020 listed and delisted firms, National Central University

### Shared Taiwan PIT source-map design for D19-01 through D19-06

#### Market / return layer
- TWSE official historical trading pages provide security-level daily trading data, but public web coverage differs by dataset/start date. Source availability must be stored as metadata rather than assumed complete.
- TWSE trading-halt history is available from October 2011; earlier halt/suspension semantics therefore require another archival source or remain UNKNOWN.
- TPEx must be included separately for OTC/Mainboard history so the research universe is not TWSE-only.
- Delisted securities must remain in the universe history; any source incapable of reconstructing them is unsuitable as the sole L3 source.

#### Shares / market-cap layer
- TWSE Data E-Shop "Basic Information of All Stocks" contains daily shares outstanding and related security fields from 2004-03-01, but it is a paid historical product. This is a viable authoritative source candidate, not evidence that the historical data have already been ingested.
- For earlier periods or TPEx, source coverage must be mapped separately before a 2017-present or longer replay is certified.

#### Fundamental / first-known layer
- MOPS filings are the preferred official publication anchor for financial-statement availability. Research storage must capture filing/publication timestamp and first-known values; period-end date alone is insufficient.
- Official TWSE valuation pages explicitly state that earnings data come from the most recent four quarters filed in MOPS, which supports the linkage but does not replace a historical first-known filing archive.

#### Risk-free-rate layer
- Taiwan Central Bank publishes historical interest-rate files and current/historical five-leading-bank deposit rates. The exact research proxy (for example one-year deposit or an overnight money-market rate) must be fixed per experiment and its public release timestamp retained.
- A proxy choice is a model assumption, not a fact; sensitivity to alternative risk-free proxies should be reported for beta/alpha work.

#### Cost / tradability layer
- Trading halt, day-trading eligibility, margin/short-sale restrictions, liquidity and turnover must be date-vintaged.
- Short-leg research must not assume borrowability from today's rules.
- When a historical field is unavailable, mark UNKNOWN rather than zero/eligible.

#### L3 gate implication
This source map establishes feasibility and known coverage gaps only. No D19-01..06 module is promoted to L3 until an executable Taiwan PIT dataset slice is built, replayed, and checked for first-known timestamps, delisted/suspended names and no-look-ahead behavior.

### Stage 3 maturity decision
- D19-05 -> L2: factor definition, mechanisms, counterevidence, accounting/PIT and redundancy requirements defined.
- D19-06 -> L2: factor definition, mechanisms, Taiwan sign counterevidence, accounting/PIT and redundancy requirements defined.
- D19 domain maturity -> 20.0% (six modules at 40%, six modules at 0%, simple module average).
- Shared Taiwan PIT source map designed; no L3 promotion yet because no executable ingestion/replay receipt exists.
- Formal Core remains unchanged.


## 2026-10-03 Long-block Stage 4 — D19-07 / D19-08 / D19-09 / D19-10

### D19-07 Low Volatility（低波動）／Low Beta（低貝塔）因子

#### Core separation
1. Low Volatility（低波動）是總報酬變異的橫截面特徵；Low Beta（低貝塔）是相對市場系統性敏感度。兩者相關但不等價。
2. D19-07 與 D19-01 的 Beta（貝塔）估計及 D04 的 Volatility（波動）研究不得重複投票；D19-07 只研究低風險曝險是否形成獨立資產定價溢酬。
3. 任何低風險候選都必須先控制 Size（規模）、Liquidity（流動性）、Industry（產業）、Momentum（動能）、Market Beta（市場貝塔）與既有波動特徵。

#### Positive mechanisms
- Leverage constraints（槓桿限制）與 benchmark-oriented demand（基準導向需求）可使無法或不願使用槓桿的投資者偏好高 Beta（高貝塔）股票，形成高 Beta（高貝塔）相對高估、低 Beta（低貝塔）相對低估的可能機制。
- Lottery preference（彩券偏好）、attention（注意力）與 delegated management（委託管理）亦可使高波動股票被過度追逐。
- Taiwan evidence（台灣證據）顯示低波動報酬關係可能隨 funding-liquidity regime（資金流動性狀態）改變，表示機制具有狀態依賴性。

#### Falsification / failure modes
- 低波動並非固定方向的 Alpha（超額報酬）。不同資金流動性與市場狀態下，低波動／高波動報酬排序可能反轉。
- 若低波動效果在控制 Size（規模）、Liquidity（流動性）、Value（價值）、Momentum（動能）、Industry（產業）後消失，就應視為既有因子的重新包裝。
- 低波動策略可能集中大型防禦股並產生產業、利率與估值曝險；若未中性化，不能把組合結果解讀成純低波動溢酬。
- 使用 ex-post regime（事後市場狀態）切樣會製造不可重播的假穩健性。

#### PIT / replay contract before L3
- 固定 volatility window（波動估計窗）、return adjustment（報酬調整）與 Beta window（貝塔估計窗）。
- benchmark（基準）、risk-free proxy（無風險利率代理）、公司行動、停牌／無成交、下市與上市狀態必須 PIT（時點一致）。
- 同時保存 total volatility（總波動）、market beta（市場貝塔）、residual volatility（殘差波動）、size（規模）、liquidity（流動性）、industry（產業）與 regime（市場狀態）以供冗餘檢查。
- 必須比較 equal-weight（等權）與 value-weight（市值加權）、長多與可執行的多空版本，並納入 turnover（換手）、spread（價差）、impact（市場衝擊）與 capacity（容量）。

#### System 1 / System 2 implication
- System 1：不得新增固定「低波動加分」或「低 Beta（低貝塔）加分」。
- System 2：可研究 neutralized low-risk residual（中性化低風險殘差）作為風險狀態或候選排序輔助，但只有 OOS（樣本外）／Shadow（影子）增量證據才能升級。
- Formal optimization candidate（正式優化候選）：NO（否）。

### D19-08 Idiosyncratic Volatility（特質波動）異象

#### Core separation
1. Idiosyncratic volatility（特質波動）是相對指定資產定價模型後的殘差波動，不是「公司自己的真實風險」的無模型量測。
2. 模型改變，residual（殘差）與 idiosyncratic volatility（特質波動）也會改變，因此 D19-08 必須與 D19-10 的因子曝險／共線性治理綁定。
3. D19-08 不得與 D04 total volatility（總波動）或 D19-07 low volatility（低波動）重複加權。

#### Positive mechanisms
- 經典實證曾發現高 idiosyncratic volatility（特質波動）股票未來平均報酬偏低。
- Candidate explanations（候選解釋）包含 diversification constraints（分散限制）、lottery demand（彩券需求）、limits to arbitrage（套利限制）與 mispricing（錯價）。

#### Falsification / counterevidence
- 結果對資料頻率、portfolio weighting（投組加權）、breakpoints（分組切點）、價格／規模／流動性篩選高度敏感。
- 若用 expected idiosyncratic volatility（預期特質波動）而不是 lagged realized idiosyncratic volatility（落後已實現特質波動），文獻可得到相反方向。
- microstructure noise（市場微結構噪音）與 bid-ask effects（買賣價差效應）可能污染特質波動估計。
- Taiwan evidence（台灣證據）顯示關係具有 funding-liquidity regime dependence（資金流動性狀態依賴），不支持固定方向規則。

#### Required controls
- Size（規模）、Beta（貝塔）、total volatility（總波動）、Liquidity（流動性）、Industry（產業）、Momentum（動能）及極端報酬／MAX-like（類最大單日報酬）特徵。
- contemporaneous short-sale constraints（當時放空限制）與交易成本。
- 模型規格、估計窗、最少有效觀測數與缺失處理必須 preregistered（事前登錄）。

#### System 1 / System 2 implication
- System 1：僅能研究風險診斷，不得成為獨立買進票數。
- System 2：先建立 residual IVOL（殘差特質波動）研究欄位，再與 D19-07、D04 做增量資訊檢驗。
- Governance role（治理角色）維持 OWNER_APPROVED / OBSERVATION / RESEARCH_ONLY / RESIDUAL_ALPHA_UNPROVEN。
- Formal optimization candidate（正式優化候選）：NO（否）。

### D19-09 Residual Momentum（殘差動能）／Factor Neutralization（因子中性化）

#### Core separation
1. Residual momentum（殘差動能）是先以指定因子模型拆除共同因子報酬，再以剩餘報酬建立動能排序；它不是一般 total-return momentum（總報酬動能）的別名。
2. time-series residualization（時間序列殘差化）與 cross-sectional neutralization（橫截面中性化）是不同操作：前者估計每檔股票相對因子模型的殘差報酬，後者在同一截面扣除產業／規模／風格曝險。兩者不得混稱。
3. Residual（殘差）永遠 model-relative（相對模型）；若漏掉重要共同因子，所謂「個股殘差」仍可能只是 omitted factor exposure（遺漏因子曝險）。

#### Positive evidence
- Blitz、Huij、Martens（2011）發現以 residual stock returns（股票殘差報酬）排序可大幅降低傳統動能策略對 Fama-French factors（法瑪－法蘭奇因子）的時變曝險，並在其樣本中得到較高且較穩定的風險調整後報酬。
- 台灣 2015 年碩士論文對 residual momentum（殘差動能）與 recent 52-week momentum（近期五十二週動能）皆找到顯著 Fama-French alpha（法瑪－法蘭奇超額報酬），但沒有明確證據證明其中一種支配另一種。
- 2026 年台灣因子動能研究顯示，產業中立與相互涵蓋後，部分表面因子動能顯著減弱，提示「中性化後仍有效」才是增量價值的真正測試。

#### Falsification / failure modes
- neutralization model risk（中性化模型風險）：換因子集合、估計窗或基準即可改變 residual（殘差）。
- omitted-factor contamination（遺漏因子污染）：若模型未含產業、規模、價值、獲利、投資、低風險與流動性等重要共同來源，殘差不是獨立 Alpha（超額報酬）。
- sequential orthogonalization（順序正交化）具有 order dependence（順序依賴）；不同因子先後順序可能得到不同殘差。
- Taiwan industry momentum（台灣產業動能）可能是重要共同來源；若殘差動能在產業中立後消失，就不得視為獨立股票選擇能力。
- 高換手與估計誤差可能使理論改善在交易成本後消失。

#### PIT / replay contract before L3
- 因子報酬、股票報酬、因子曝險估計窗、benchmark id（基準識別碼）、industry classification vintage（產業分類版本）皆需 PIT（時點一致）。
- 每次殘差化保存 factor set id（因子集合識別碼）、factor version（因子版本）、estimation window（估計窗）、minimum observations（最少觀測數）、coefficient vector（係數向量）、residual hash（殘差雜湊）與 as-of timestamp（截至時間）。
- 必須同時保留 raw momentum（原始動能）與 residual momentum（殘差動能），用 paired OOS（成對樣本外）測試確認增量，而非各自看單一回測。
- 產業／規模／Beta（貝塔）／波動／流動性控制均使用 formation date（形成日）當時可知資料。
- long-only（僅做多）與 long-short（多空）結果分離；沒有歷史可借券證據時，short leg（空方腿）不得假定可成交。

#### System 1 / System 2 implication
- System 1：暫不新增殘差動能票數；先用於診斷現有 D03／D09 動能與相對強弱到底承載多少共同因子曝險。
- System 2：D19-09 是較有價值的研究候選，但應採 paired comparator（成對比較器）：raw momentum（原始動能）對 residual momentum（殘差動能），並要求 turnover-adjusted（換手調整）、cost-adjusted（成本調整）與 multi-regime（多市場狀態）增量。
- Formal optimization candidate（正式優化候選）：NO（否）；尚缺台股 PIT（時點一致）可執行重播與 OOS（樣本外）證據。

### D19-10 Factor Exposure（因子曝險）／Multicollinearity（多重共線性）

#### Core separation
1. 多個因子高度相關時，模型可能仍有預測力，但 individual coefficient attribution（單一係數歸因）會變得不穩定；「模型能預測」不等於「每個因子都獨立有價值」。
2. 因子治理的核心是 incremental information（增量資訊）與 redundancy（冗餘），不是把更多顯著因子疊進同一分數。
3. orthogonalization（正交化）是工具，不是自動真相。順序式正交化可能有 leader bias（領先因子偏誤）與 order dependence（順序依賴）。

#### Positive evidence / methods
- Factor-zoo（因子動物園）研究顯示，高維既有因子控制後，多數新因子可被判為冗餘；只有少數仍提供額外解釋力。
- Green、Hand、Zhang 類型的 simultaneous-characteristic analysis（多特徵同時分析）與 Feng、Giglio、Xiu 類型的 high-dimensional model selection（高維模型選擇）提供「新因子必須在既有因子集合之外仍有增量」的正式框架。
- latent-factor methods（潛在因子方法）亦顯示大量特徵資訊可以被較少維度摘要，支持 dimension reduction（降維）而非無限制增加投票因子。

#### Falsification / failure modes
- pairwise correlation（兩兩相關）低不代表不存在多重共線性；一個因子可能由多個其他因子線性組合高度解釋。
- VIF-like diagnostics（類變異膨脹診斷）只能辨識線性共線性，不能證明經濟冗餘或樣本外冗餘。
- regularization（正則化）與機器學習可改善預測，但被選中的變數集合可能不穩定；預測穩定性與經濟歸因必須分開。
- in-sample orthogonalization（樣本內正交化）若用全期係數會洩漏未來；所有正交化係數必須 rolling（滾動）或 expanding-window（擴張視窗）且只用當時已知資料。
- 因子數愈多，多重測試與 data snooping（資料探勘）風險愈高；不能用一般單一檢定門檻直接宣告獨立 Alpha（超額報酬）。

#### D19 governance contract
- 每個候選因子建立 exposure matrix（曝險矩陣）、pairwise correlation（兩兩相關）、partial correlation（偏相關）、cross-sectional residual R2（橫截面殘差解釋度）、spanning test（涵蓋檢定）與 OOS incremental metric（樣本外增量指標）。
- 同一資訊家族原則上只允許一個 PRIMARY_ALPHA（主要超額報酬）候選；其餘降為 context（情境）、risk control（風險控制）、comparator（比較器）或 merge candidate（合併候選）。
- 若不同中性化順序給出不同方向或不同顯著性，狀態必須標記 MODEL_SENSITIVE（模型敏感），不得升級。
- 必須以 cost-adjusted（成本調整）與 capacity-adjusted（容量調整）後的 OOS（樣本外）增量作最終比較，不以樣本內 t-stat（t統計量）單獨決策。

#### System 1 / System 2 implication
- System 1：D19-10 更適合作為 anti-double-count（防重複計票）治理層，而不是新選股因子。
- System 2：應把它實作成 factor attribution / neutralization audit（因子歸因／中性化稽核）研究層，對所有策略候選輸出共線性、殘差增量與模型敏感性。
- Formal optimization candidate（正式優化候選）：NO（否）；目前是研究治理框架，不是 Formal Core（正式核心）變更。

### Minimal executable Taiwan PIT（台股時點一致） replay slice — updated engineering assessment

現有 System2（系統二）歷史冷資料層已具備可直接利用的基礎：
- historical cold rows（歷史冷資料列）保存 observedAt（觀測時間）、availableAt（可用時間）、barHash（價格列雜湊）與 source provenance（來源溯源）。
- survivorship registry（存活者控制股票池登錄）可依指定 registry id（登錄識別碼）重播，且不把未來下市日期暴露給過去。
- cold loader（冷資料載入器）已可接 PIT Replay（時點重播）與 partitioned bulk backtest（分割大量回測）。
- completion receipt（完成收據）採 immutable / rerun-safe（不可變／可安全重跑）設計。

但 D19 升 L3（第三級）仍缺 factor-layer receipt（因子層收據）。最低可執行切片需額外產生：
1. universeReceipt（股票池收據）：形成日、上市／上櫃、停牌、下市、有效會員資格。
2. returnReceipt（報酬收據）：調整價政策、公司行動、無成交語意與資料來源。
3. factorInputReceipt（因子輸入收據）：市值、股本、財報 first-known（首次可知）、benchmark（基準）、risk-free proxy（無風險利率代理）及其 availableAt（可用時間）。
4. neutralizationReceipt（中性化收據）：因子集合版本、係數、估計窗、有效樣本數與殘差雜湊。
5. costReceipt（成本收據）：turnover（換手）、spread（價差）／slippage proxy（滑價代理）、borrowability（可借券性）若涉及空方。
6. replayReceipt（重播收據）：上述收據雜湊、輸出排序、結果雜湊與程式版本。

目前 price-history / universe infrastructure（價格歷史／股票池基礎）已足以支援「研究切片設計與測試」，但完整 2017 全市場冷資料回填尚未被正式宣稱完成，因此本輪仍不得把任何 D19 模組提升到 L3（第三級）。

### Stage 4 maturity decision
- D19-07 -> L2 / 40%.
- D19-08 -> L2 / 40%; governance role remains research-only and residual-alpha-unproven.
- D19-09 -> L2 / 40%.
- D19-10 -> L2 / 40%.
- With the current 15-module D19 curriculum, domain simple-average maturity becomes 26.7% (10 modules at 40%, 5 modules at 0%).
- No L3 promotion: executable Taiwan factor-layer PIT replay receipts are still missing.
- Formal Core remains unchanged and locked.

### Evidence anchors added in Stage 4
- Blitz, Huij & Martens (2011), Journal of Empirical Finance, DOI 10.1016/j.jempfin.2011.01.003.
- 徐斌瑋（2015），國立成功大學碩士論文：台股殘餘動能相對近期五十二週動能。
- 林祐祥（2026），國立成功大學碩士論文：因子動能—以台灣市場為例。
- Feng, Giglio & Xiu (2020), Journal of Finance, Taming the Factor Zoo.
- Green, Hand & Zhang (2017), Review of Financial Studies, independent stock-return characteristics.
- Hou, Xue & Zhang (2020), Review of Financial Studies, Replicating Anomalies.


## 2026-10-03 Long-block Stage 5 — D19-11 / D19-12

### D19-11 Factor Crowding（因子擁擠）／Capacity（容量）／Turnover（換手）

#### Core separation
1. Crowding（擁擠）不是單純「很多人知道同一因子」。它必須有可觀測的共同持倉、共同交易方向、有限流動性或套利資本約束等證據。
2. Capacity（容量）不是固定的資產規模上限；它取決於 turnover（換手）、market depth（市場深度）、spread（價差）、impact（市場衝擊）、participation rate（參與率）、交易時間與可接受的 alpha decay（超額報酬衰減）。
3. Turnover（換手）同時是成本來源與訊號更新頻率的結果，不能直接解讀成策略品質差。
4. D19-11 與 D05 liquidity / microstructure（流動性／市場微結構）、D14 execution cost（交易執行成本）、D15 portfolio risk（投組風控）有強依賴，但本模組只研究「因子策略本身的擁擠、容量與換手如何改變可實現因子報酬」。

#### Positive mechanisms
- 當大量資金同時追逐相同 factor exposure（因子曝險）時，進場可能先把價格推向有利方向，但後續 expected return（預期報酬）會因估值擁擠與套利資本飽和而下降。
- 市場壓力或 funding shock（融資衝擊）時，擁擠策略可能同時去槓桿，形成 correlated unwind（相關性平倉）與非線性 market impact（市場衝擊）。
- Factor crowding（因子擁擠）研究顯示，直接持倉擁擠指標對價值、動能、carry（利差／持有收益）等策略未來報酬可呈負向預測，支持「擁擠會壓低未來溢酬」的候選機制。
- Smart-beta capacity（智慧貝塔容量）研究顯示，不同因子因換手與交易成本不同，容量可相差數量級；momentum（動能）通常較受交易成本／容量限制，而低換手因子容量較大。

#### Falsification / failure modes
- high ownership concentration（高持倉集中）可能是對基本面或既有高預期報酬的合理反應，未必代表即將反轉。
- popularity proxy（熱門代理）如搜尋量、ETF（指數股票型基金）規模或新聞熱度，不等於真實因子部位擁擠。
- crowding measure（擁擠指標）若以事後完整持倉或基金季報回推，容易產生 reporting lag（揭露延遲）與 look-ahead（偷看未來）問題。
- capacity estimate（容量估計）若只用平均成交量，不含 spread（價差）、impact（市場衝擊）、極端日流動性與成交參與率，會系統性高估可交易規模。
- 因子報酬衰減可能來自估值改變、景氣狀態或因子定義漂移，不可把所有衰退歸因於 crowding（擁擠）。

#### PIT / replay contract before L3
- crowding inputs（擁擠輸入）只能使用形成日當時已公開的持倉／資金流／交易資料；有揭露延遲就用 availableAt（可用時間）而不是 period-end（期末日）。
- factor portfolio holdings（因子投組持倉）需保存版本、再平衡日、權重、換手與每檔股票交易需求。
- capacity simulation（容量模擬）至少要有 participation-rate grid（參與率網格）、spread/slippage（價差／滑價）、impact curve（衝擊曲線）、多日執行與 stressed-liquidity（壓力流動性）情境。
- 需分離 gross alpha（毛超額報酬）、implementation shortfall（執行落差）與 net alpha（淨超額報酬）。
- 若無真正 fund-position / flow（基金部位／資金流）PIT（時點一致）資料，crowding（擁擠）只能標 UNKNOWN（未知）或 proxy-only（僅代理），不得假裝有直接擁擠證據。

#### System 1 / System 2 implication
- System 1：目前不應新增「熱門因子扣分」；先把 D19-11 當成本／容量警示與風險情境。
- System 2：適合在策略層建立 capacity envelope（容量包絡）與 turnover budget（換手預算），讓每個策略回測同時報告毛績效與成本後可實現績效。
- 只有可觀測的 PIT（時點一致）擁擠資料與成本後 OOS（樣本外）預測改善，才可能形成獨立因子候選。
- Formal optimization candidate（正式優化候選）：NO（否）。

### D19-12 Seasonality（季節性）／Calendar Anomalies（日曆異象）

#### Core separation
1. Calendar effect（日曆效應）是以事前固定的日期規則形成可重播假說，不是看完整歷史圖後挑「哪一天常漲」。
2. weekday（星期）、turn-of-month（月初月底）、month-of-year（月分）、pre-holiday（假日前）、post-holiday（假日後）、Lunar-calendar（農曆）與 settlement/rebalance（結算／再平衡）效應屬不同假說，必須分開登錄。
3. 日曆變數可能只是 tax（稅務）、institutional flow（機構資金流）、payday（薪資流）、index rebalance（指數再平衡）、holiday closure（休市）或 sentiment（情緒）的代理；必須與 D13 行為金融、D11 事件與 D05 微結構建立競爭解釋。

#### Taiwan evidence
- 台灣研究曾發現 weekday（日別）、holiday（假日）、turn-of-month（月初月底）、monthly（月分）等日曆異象，但效果會隨市場、樣本期與檢定基準改變，且部分效果隨時間下降。
- 台灣 January effect（一月效應）文獻顯示制度與投資人結構會改變結果，甚至在市場自由化後出現 reverse January effect（反向一月效應）。
- 2016 年台灣 holiday-seasonality（假日季節性）研究發現不同文化假日與休市安排對不同投資人群體的交易／情緒代理影響並不一致。
- 因此台灣存在「曾被觀察到的日曆模式」不等於今天存在穩定可交易溢酬。

#### Falsification / data-mining controls
- D19-12 是高 data-mining（資料探勘）風險模組；若掃描大量日期窗、星期、月份與農曆事件後只保留最佳結果，幾乎必然製造假陽性。
- 所有假說必須 preregistered（事前登錄）：事件定義、視窗、方向、持有期、基準、樣本內／樣本外切割與成本模型。
- 多個日曆假說同時測試時必須做 multiple-testing adjustment（多重檢定調整）或 false-discovery control（錯誤發現控制）。
- holiday effect（假日效應）必須用「實際交易日與休市表」而非固定公曆日期；颱風停市、臨時休市、補班／補假與農曆移動日期均需版本化。
- 若效果只存在早期樣本、微型股、極低流動性股票或未計成本組合，不能轉成一般選股規則。

#### PIT / replay contract before L3
- official trading calendar vintage（官方交易日曆版本）、holiday type（假日類型）、market closure reason（休市原因）與 announcedAt（公告時間）需可追溯。
- corporate actions（公司行動）、index rebalance（指數再平衡）、月／季底機構流、財報／營收公告群聚需作替代解釋控制。
- 以 rolling OOS（滾動樣本外）檢驗異象是否衰減；至少分多年度、多 Regime（市場狀態）、大型／中小型、流動性層級。
- 報告 effect size（效果量）、hit rate（命中率）、net return after cost（成本後淨報酬）與 independent event count（獨立事件數），不能只報 p-value（顯著機率值）。

#### System 1 / System 2 implication
- System 1：不得新增「某月／某星期固定加分」或通用交易 Gate（門檻）。
- System 2：可將事前登錄的 calendar state（日曆狀態）作 conditioning variable（條件變數）或風險情境，只有長期 OOS（樣本外）及成本後穩健才研究成策略。
- Governance role（治理角色）維持 OWNER_APPROVED / OBSERVATION / RESEARCH_ONLY / HIGH_DATA_MINING_RISK。
- Formal optimization candidate（正式優化候選）：NO（否）。

### Stage 5 maturity decision
- D19-11 -> L2 / 40%.
- D19-12 -> L2 / 40%; governance role remains research-only / high-data-mining-risk.
- With the current 15-module D19 curriculum, domain simple-average maturity becomes 32.0% (12 modules at 40%, 3 modules at 0%).
- No L3 promotion: factor-layer PIT replay receipts and prospective/OOS evidence remain missing.
- Formal Core remains unchanged and locked.

### Evidence anchors added in Stage 5
- Kang, Rouwenhorst & Tang (2021), Crowding and Factor Returns.
- Ratcliffe, Miranda & Ang (2017), Capacity of Smart Beta Strategies: A Transaction Cost Perspective.
- Yang (2016), Emerging Markets Review, Calendar trading of Taiwan stock market.
- Shiu, Lee & Gleason (2014), Journal of Multinational Financial Management, Institutional shareholdings and the January effects in Taiwan.
- 劉張旭（2010），國立臺灣大學碩士論文：日曆異常效應—國際主要股票市場之比較研究。


## 2026-10-04 Long-block Stage 6 — D19-13 / D19-15 / D19-16 + factor-layer PIT adapter contract

### D19-13 Relative Value／Pairs Trading／Cointegration／Residual Mean Reversion相對價值、配對交易、共整合與殘差均值回歸

#### Core separation
1. Relative-value research is a strategy family, not a generic long-only factor vote.
2. Correlation is not cointegration. A stationary or mean-reverting residual depends on the hedge-ratio / factor model used to define the spread.
3. Residual mean reversion must be separated from common market, industry, size, value, beta and liquidity exposure.

#### Positive mechanism / Taiwan evidence
- Cointegrated pairs can support a market-relative convergence hypothesis when the spread relationship is stable and both legs are executable.
- Taiwan evidence using tick data from top TAIEX names identifies structural breaks in cointegration relationships as a material pairs-trading failure mode and shows value in earlier break detection.
- Later Taiwan evidence combines structural-break awareness, market-closing risk and transaction costs, reinforcing that pair selection alone is insufficient.

#### Falsification / failure modes
- Formation-period cointegration can fail in the trading period; structural breaks are not nuisance noise.
- Large pair searches create multiple-testing and data-snooping risk.
- Non-synchronous trading, stale prices, halts, price limits and thin liquidity can create false convergence/divergence.
- Short legs require PIT borrowability, borrow cost and recall/forced-buy-in semantics; theoretical shorts cannot be assumed executable.
- Pair overlap can concentrate risk in a small set of names.

#### PIT / replay contract before L3
- Preserve pair-definition version, formation window, cointegration test/version, hedge-ratio method, residual formula, break-detection rule and entry/exit bands.
- Store both-leg universe eligibility, bars, continuity, borrowability/cost and cost assumptions at decision time.
- Pair-level receipt hashes both symbol receipts plus model/version inputs; if either leg is PIT-incomplete, the pair is not L3-eligible.
- Report pair overlap and single-name concentration.

#### System implication
- System 1: no generic long-only score from D19-13.
- System 2: dedicated relative-value strategy family with its own ranking, capacity and execution contract.
- Formal optimization candidate: NO.

#### Evidence anchors
- Huang et al. (2020), IEEE BigComp, DOI 10.1109/BigComp48618.2020.00-73.
- Lu et al. (2021/2022), Journal of Supercomputing, DOI 10.1007/s11227-021-04013-x.

### D19-15 Index／Benchmark Construction／Methodology指數與基準建構方法

#### Core separation
1. Benchmark choice is part of the asset-pricing model. Alpha, beta, tracking error and residuals are benchmark-relative.
2. Current constituents cannot be used to reconstruct historical benchmarks without vintage evidence.
3. Price-return, total-return, free-float weighting, capping, buffer, rebalance and reconstitution rules can change benchmark paths and factor residuals.

#### Falsification / failure modes
- Using today's constituents historically introduces survivorship/look-ahead bias.
- Picking a benchmark ex post to maximize alpha is model-selection/data-snooping bias.
- Announcement time and effective time differ; future-effective membership cannot be leaked into earlier decisions.
- Missing historical constituent/weight data remains UNKNOWN if the research claim depends on the original benchmark.

#### PIT / replay contract before L3
- Required: benchmarkId, methodologyVersion, announcementAt, effectiveFrom/effectiveTo, constituentVintage, weightVintage, returnType and sourceHash.
- Membership/weight resolution must be deterministic and fail closed on overlapping or conflicting vintages.
- Benchmark-return construction emits a receipt hash used by D19-01 beta/alpha and D19-09 residual momentum.

#### System implication
- System 1: diagnostic/governance only.
- System 2: shared benchmark receipt layer; not a direct stock-selection vote.
- Formal optimization candidate: NO.

### D19-16 Liquidity Premium／Illiquidity Factor流動性溢酬與非流動性因子

#### Core separation
1. Trading liquidity as executability/friction is distinct from a cross-sectional liquidity premium.
2. Amihud-style return-to-volume ratios can mix illiquidity, volume/mispricing, overnight-return effects and price-limit structure.
3. Independent liquidity-premium claims require neutralization against size, value, volatility, turnover, spread, industry, momentum and distress exposures.

#### Positive / counter evidence from Taiwan
- Recent Taiwan evidence covering TWSE and TPE finds a time-weighted daytime Amihud variant that excludes overnight returns and incorporates recency has stronger pricing association than conventional variants.
- A 2023 Taiwan decomposition finds the illiquidity-related component itself has no pricing ability while mispricing/trading-volume effects can dominate under Taiwan price-limit structure.
- Taiwan OTC evidence documents common market/industry liquidity components, so stock liquidity is partly systematic.
- Interpretation and sign are therefore measurement- and market-structure-sensitive.

#### Falsification / failure modes
- Proxy choice can change the result; overnight-return contamination is material in Taiwan.
- Illiquidity portfolios can be dominated by small, distressed or hard-to-trade names.
- Price limits, halts and zero-trade days alter the meaning of price-impact proxies.
- Statistical pricing before costs can disappear after spread/impact/capacity costs.
- If residual liquidity alpha vanishes after controls, classify as redundant.

#### PIT / replay contract before L3
- Record liquidityProxyId/version, numerator/denominator definitions, overnight handling, return window, volume/value units, zero-volume semantics and price-limit/halt handling.
- Inputs must be available by decisionTimestamp and linked to bar / market-status hashes.
- Store residualization model/version and controls.
- Net-return claims must use the same cost/impact assumptions as the factor test.

#### System implication
- System 1: liquidity remains eligibility/execution/risk context; no more-illiquid-is-more-bullish score.
- System 2: residual-liquidity premium remains research-only pending Taiwan PIT replay, neutralization, cost and OOS multi-regime validation.
- Formal optimization candidate: NO.

#### Evidence anchors
- Lin, Ko & Lu (2023), Pacific-Basin Finance Journal, DOI 10.1016/j.pacfin.2023.101984.
- Lee, Lien, Sheu & Yang (2024/2025), Pacific-Basin Finance Journal, DOI 10.1016/j.pacfin.2024.102483.
- Lee et al. (2006), International Review of Financial Analysis, Common factors in liquidity: Evidence from Taiwan's OTC stock market.

### Factor-layer PIT adapter contract — research specification V0.1

#### Existing reusable System2 infrastructure confirmed
- system2/runtime/pit_replay_v0_1.mjs fail-closes on differing eligible revisions, gates by availableAt <= decisionTimestamp and emits deterministic replayHash.
- system2/runtime/historical_universe_registry_v0_1.mjs plus cold-loader membership provides date-effective historical universe membership without exposing future delisting dates.
- system2/runtime/historical_cold_pack_store_v0_1.mjs restores provenance, observedAt, conservative availableAt and barHash and exposes loaders to bulk backtests.
- system2/runtime/bulk_backtest_runner_v0_1.mjs partitions the full universe, builds PIT replay windows, supports checkpoint/resume and rolling digests, and blocks unauthorized SELECTED generation.
- system2/SYSTEM2_FACTOR_ENGINE_CONTRACT.md and system2/src/contracts.ts already define UNKNOWN/KNOWN semantics, source provenance and factor versioning.

#### Gap confirmed
The six D19 factor-layer receipt types currently exist only as research requirements. No repository implementation named universeReceipt, returnReceipt, factorInputReceipt, neutralizationReceipt, costReceipt or replayReceipt exists. Existing cold replay alone therefore does not satisfy D19 L3.

#### Minimal implementation boundary
A new research-only adapter should sit above existing cold loaders and PIT replay, not replace them. It should consume historical universe membership, PIT replay windows / primitive bars, and optional factor-specific PIT inputs, then emit immutable factor-layer receipts.

Recommended V0.1 responsibilities:
1. universeReceipt: run/date/decisionTimestamp/registryId + exact eligible membership hashes, exclusions/UNKNOWN reasons and membership digest.
2. returnReceipt: symbol/date/priceSpace + input bar hashes, continuity/company-action policy version, raw/adjusted return definition, missing/no-trade semantics and return digest.
3. factorInputReceipt: factorId/version + each required input reference, observedAt/availableAt/firstKnownAt where applicable, state/UNKNOWN reason and input digest.
4. neutralizationReceipt: factor set/version, benchmark/industry vintages, estimation window, valid sample count, coefficients/transformation metadata, residual digest and model-sensitive warning.
5. costReceipt: fee/tax/slippage/impact/turnover/borrowability assumptions with source/version and UNKNOWN semantics.
6. replayReceipt: hashes of all upstream receipts + code/schema version + output hash; identical inputs must produce identical hash.

#### Fail-closed requirements
- No fabricated firstKnownAt / availableAt.
- Missing required factor input => INCOMPLETE/UNKNOWN, not zero.
- Revision ambiguity, overlapping universe membership or conflicting benchmark vintage => fail closed.
- Historical short leg without PIT borrowability evidence => executable-short UNKNOWN/blocked, not assumed available.
- Research adapter may emit research observations/receipts only; it cannot authorize SELECTED, production ranking, Formal Core changes or live trading.

#### First executable slice recommendation
Start with D19-04 cross-sectional momentum plus D19-07 low-volatility/low-beta because both primarily depend on already-qualified PIT daily bars and universe membership, and can test return/beta/volatility/neutralization receipt mechanics without waiting for first-known accounting ingestion. Accounting-heavy D19-03/05/06 should follow only after first-known financial ingestion exists.

#### L3 decision
No D19 module is promoted to L3 in Stage 6. Next gate: executable code + deterministic receipt tests + an actual Taiwan PIT replay receipt on at least one frozen historical date/universe.

### Stage 6 maturity decision
- D19-13 -> L2 / 40%.
- D19-15 -> L2 / 40%.
- D19-16 -> L2 / 40%.
- All 15 active D19 modules are now L2 / 40%; domain simple-average maturity = 40.0%.
- Formal Core remains unchanged and locked.
- No formal optimization candidate.


## 2026-10-04 Long-block Stage 7 — executable factor-layer receipts + real-source negative L3 gate

### Engineering result
- PR #439 merged to main as `76f5ef80dbf0654a033a0a780b065ebfabbf0e30`.
- Added `system2/runtime/d19_factor_receipt_adapter_v0_1.mjs` implementing deterministic research-only universeReceipt, returnReceipt, factorInputReceipt, neutralizationReceipt, costReceipt and replayReceipt builders.
- Added `system2/tests/d19_factor_receipt_adapter_v0_1.test.mjs` covering deterministic hash stability, input-order independence, duplicate-universe rejection, future availableAt rejection, required UNKNOWN preservation, upstream-hash propagation and incomplete-cost blocking.
- Added `system2/scripts/d19_factor_receipt_real_source_smoke_v0_1.mjs` and a dedicated read-only official-source workflow.
- Receipt-chain completeness and L3 data-feasibility eligibility are separate states. A complete six-receipt chain cannot self-promote when explicit eligibility blockers remain.

### Physical validation
- System2 Research CI run `37165603677`: PASS.
- V8 Regression run `37165603710`: PASS.
- D19 official real-source smoke run `37165603790`: PASS_NEGATIVE_L3_GATE with production isolation PASS.
- Frozen interval: 2026-08-03 through 2026-08-31, 21 official trading dates.
- TWSE official history succeeded with 22,810 full-market rows across the interval; bounded witness symbols 2330 and 2454 each had complete 21-session rows.
- Observed 20-session features from official rows: 2330 momentum +1.4768% and realized volatility 1.3581%; 2454 momentum +0.3836% and realized volatility 2.8175%.
- Last-row availableAt was 2026-08-31T05:30:00Z for both bounded TWSE witnesses, before the frozen decisionTimestamp 2026-08-31T05:40:00Z.
- Real-source receipt chain was deterministic across reordered inputs/capture time and produced replay receipt hash `24e0751adeef3b9b0405c1ea4d57554ba8245cfd77a921304465ec0e5a205a52`.

### Negative evidence / why D19 does NOT advance to L3
The physical smoke deliberately returned l3DataFeasibilityEligible=false. The remaining blockers are substantive rather than cosmetic:
1. BOUNDED_UNIVERSE_NOT_HISTORICAL_REGISTRY — the successful witness uses a bounded official-source set, not a date-vintaged historical-registry universe denominator.
2. CORPORATE_ACTION_CONTINUITY_UNVERIFIED — raw daily bars still carry continuityState UNVERIFIED; a momentum or volatility factor cannot claim robust historical continuity across corporate actions from this smoke alone.
3. INDUSTRY_NEUTRALIZATION_NOT_PROVEN — the smoke only proves within-market centering, not date-vintaged industry neutralization.
4. D03_D09_REDUNDANCY_NOT_PROVEN — D19-04 has not yet demonstrated residual information beyond existing trend/momentum and industry/rotation families.
5. COST_PROVENANCE_MODELED_TRANSPORT_ONLY — the cost receipt is an engineering transport placeholder, not a claim of actual/net factor performance.
6. TPEX_OFFICIAL_HISTORICAL_SOURCE_UNAVAILABLE — during physical run 37165603790, both current and legacy TPEx official historical A1 transports returned HTTP 520 for 2026-08-03. The run preserved this as a blocker instead of fabricating rows or treating missing TPEx as zero.

### Scientific implication
- This stage materially improves engineering readiness but does not justify a maturity promotion.
- D19-04 remains L2 / 40%. The next possible promotion would move one module from 40% to 60%, taking the 15-module D19 average from 40.0% to about 41.3%, but only after all L3 blockers applicable to that module are closed with a real frozen-date replay receipt.
- D19-07 also remains L2 because low-beta requires a benchmark/beta-estimation contract beyond the current 21-session raw-volatility witness; observed volatility alone is not proof of low-beta feasibility.
- Formal Core remains unchanged and locked. No ranking, threshold, production runtime, selection authority, push, capital or live-trading behavior changed.

### Exact next evidence program
1. Replace bounded-universe smoke membership with an actual historical-universe registry snapshot and deterministic membership receipt.
2. Bind corporate-action continuity evidence to the exact D19 replay bars without rewriting raw history.
3. Recover or replace the currently failing official TPEx historical transport only with a physically validated official source; until then TPEx remains SOURCE_UNAVAILABLE/UNKNOWN.
4. Add date-vintaged industry membership and run industry neutralization.
5. Run paired D03/D09 redundancy controls on identical PIT dates/universe.
6. Replace transport-only cost placeholder with a versioned D14-compatible research cost scenario whose provenance quality is explicit.
7. Re-run D19-04. Only a zero-blocker deterministic replay receipt can trigger an L3 readiness review; no automatic promotion.


## 2026-10-04 Long-block Stage 8 — full TWSE universe reconciliation + TPEx negative transport experiment

### D19-04 full-universe evidence materially advanced without maturity inflation
PR #460 merged to main as `1a7b6e7e8d8552953f909f4ee1448733a1daf643`.

The research-only coverage lane reconstructs a survivorship-controlled TWSE historical registry from official current-list, new-listing and delisting sources, freezes the 2026-08-31 snapshot, joins every member to the official 2026-08-03..2026-08-31 daily-history range, and forces each member into KNOWN or explicit UNKNOWN rather than silently dropping incomplete names.

Physical evidence:
- D19 TWSE full-universe workflow `37172684933`: PASS_TWSE_FULL_UNIVERSE_COVERAGE_NEGATIVE_L3_GATE.
- System2 Research CI `37172684904`: PASS.
- V8 Regression `37172684903`: PASS.
- official trading dates: 21.
- TWSE historical daily source rows: 22,810.
- registry membership: 1,101; replay-eligible: 1,101; current: 1,089; delisted: 12; unknownStart: 0.
- 2026-08-31 snapshot denominator: 1,089.
- D19-04 20-session momentum input: 1,064 KNOWN / 25 explicit UNKNOWN = 97.7043% KNOWN coverage.

UNKNOWN decomposition:
- 2 recent listings: RECENT_LISTING_INSUFFICIENT_LOOKBACK.
- 6 names: INCOMPLETE_SESSION_ROWS_REQUIRES_SESSION_PROVENANCE.
- 17 names: NULL_OR_INVALID_CLOSE_REQUIRES_TRADING_STATE_PROVENANCE.
- missing source-row hash was not observed in the UNKNOWN sample.

Interpretation:
- the old generic BOUNDED_UNIVERSE_NOT_HISTORICAL_REGISTRY blocker is no longer accurate for TWSE;
- TWSE historical membership and denominator reconciliation are physically demonstrated;
- this does NOT prove full-Taiwan D19 coverage because TPEx historical-universe/source replay remains unresolved;
- the 23 non-recent-listing UNKNOWN names now define a precise symbol-session/trading-state evidence target rather than an unstructured missing-data problem;
- no forward fill, pseudo-bar or UNKNOWN->0 conversion is authorized.

### TPEx transport revalidation was a negative experiment
PR #459 tested three official historical-quote transports:
1. current o=json query shape;
2. former response=json same-endpoint fallback;
3. legacy JSON fallback.

D19 real-source smoke `37172219750` preserved HTTP 520 on all three. System2 Research CI `37172219759` and V8 Regression `37172219828` passed, proving fail-closed behavior and isolation but not source recovery. PR #459 was therefore closed without merge.

Counterevidence prevents an incorrect conclusion that TPEx historical data never existed: the earlier read-only full-market benchmark successfully read 18,646 TPEx stock-day rows over the same 2026-08-03..2026-08-31 period, average 887.90 names/day. However that benchmark did not persist the full-market rows into replayable cold history. Historical success is feasibility evidence, not a substitute for current immutable replay evidence.

### Corporate-action continuity blocker narrowed, not cleared
System2 S2-07 has physically verified TWSE/TPEx official corporate-action source/parser structure and exact requested-range identity, and the immutable continuity archive core exists. But certification remains locked. NO_EVENT cannot be inferred from an empty query until PIT universe completeness, revision/correction coverage, exact-range source coverage, missing-date accounting, empty-range semantics and symbol-session suspension/resumption completeness are all established.

Therefore D19 must not relabel RAW history as TECHNICAL_CONTINUITY or interpret missing action evidence as no action.

### Cost blocker narrowed only on statutory tax semantics
Current official Taiwan guidance confirms ordinary stock sale tax at 0.3% and eligible same-day offset stock sale tax at 0.15% through 2027-12-31. Broker commissions remain broker-specific. D14 governance requires rate, minimum, calculation method, rounding policy, execution channel, executed notional and verified schedule provenance before a commission can be labeled MODELED; actual owner-account commission remains UNKNOWN. A market-reference rate alone is insufficient.

Thus the D19 engineering zero-cost placeholder can now be rejected more precisely:
- statutory tax-rate provenance: available;
- owner-specific commission: UNKNOWN;
- slippage/turnover/execution scenario: still must be frozen;
- no actual-net claim is allowed.

### Current blocker reconciliation
Machine-readable reconciliation:
`research/d19_04_l3_blocker_reconciliation_20261004_v0_1.json`.

Current gate state:
- Historical universe: PARTIAL_PASS — TWSE resolved; TPEx unresolved.
- Factor-input coverage: PARTIAL_PASS — 1,064/1,089 KNOWN; 25 explicit UNKNOWN; no silent omission.
- Corporate-action continuity: PARTIAL_PASS_SOURCE_PARSER_ONLY — certification blocked.
- PIT industry neutralization: BLOCKED.
- D03/D09 redundancy: BLOCKED.
- Cost provenance: PARTIAL_PASS_TAX_ONLY.
- TPEx historical replay source: BLOCKED_CURRENT_TRANSPORT.

D19-04 remains L2 / 40%. No L3 promotion. The evidence improved the precision and executability of the blockers, not the maturity tier.

### Exact next
1. Attach authoritative symbol-session/trading-state evidence to the 23 non-recent-listing TWSE UNKNOWN names and preserve the two recent listings as legitimate insufficient-lookback states.
2. Build a TPEx date-vintaged historical-universe receipt and a replay path that can consume immutable persisted official history without requiring today's live endpoint to be healthy.
3. Bind corporate-action continuity receipts to exact D19 formation windows.
4. Add PIT industry-vintage membership.
5. Run D03/D09 paired redundancy controls on the identical frozen universe/date.
6. Freeze D14-compatible explicit cost scenarios; actual account commission stays UNKNOWN unless directly evidenced.
7. Only a full-Taiwan zero-applicable-blocker deterministic replay triggers L3 readiness review; no automatic promotion.


### Stage 8 addendum — TWSE UNKNOWN cannot be self-resolved inside D19
A repository-wide source audit after the full-universe smoke found the shared continuity lane still declares `suspensionCoverageComplete=false` and `symbolSessionCompletenessCertified=false`. Consequently, the 23 non-recent-listing TWSE UNKNOWN observations are not evidence of suspension by themselves. Missing or null daily values may reflect suspension/no-trade, source semantics or another constrained state; D19 may not infer the cause locally. The correct dependency is the shared exchange-complete symbol-session receipt. Until that owner certifies the lane, these observations remain UNKNOWN.

This is a useful falsification: 97.7043% KNOWN factor coverage is not equivalent to 100% classified tradability coverage.


## 2026-10-04 Long-block Stage 9 — TWSE symbol-session diagnostics + invalid-close falsification

### Authoritative temporary-suspension evidence
Research-only PR #463 merged as `67ff5fca7544954ed12cb59449b6dae046c012b6`.

Physical workflow `37173192811` queried the official TWSE historical suspended-trading report for 2026-08-03 through 2026-08-31 and returned HTTP 200 / upstream OK with raw payload hash `072e88890972ebbfed3d64a82ec0bbeee22044ec21a3146aaac3ca989d50f7c0`.

The official result contained two ordinary-equity rows, both already present in the D19-04 UNKNOWN set:
- 1218: suspended 2026-08-13 08:00 and resumed 2026-08-14 08:00.
- 1909: suspended 2026-08-12 08:00 and resumed 2026-08-13 08:00.

This is positive symbol-session provenance for those exact dates. It does not certify that a non-match is NO_SUSPENSION and does not make the shared exchange-complete symbol-session gate complete.

### Six incomplete-row names are no longer an undifferentiated source-loss bucket
The six Stage-8 cases with fewer than 21 daily rows were separately matched during this research round to official TWSE stop-trading / capital-reduction / share-transfer / par-value-change notices:
- 1563, 1589, 2867, 6176, 6949, 8105.

Their missing daily rows are therefore consistent with documented non-trading/event windows rather than silent omission from the official market history source. However this classification evidence is not yet a single immutable D19 raw-byte receipt with complete revision/version lineage, so D19 does not promote these names to fully certified continuity states.

### Remaining invalid-close cohort: source presence is not valid price formation
Research-only PR #464 merged as `c8945c76e2cc4cd72faecaa4cd6d09a0b7077eb1`.

Physical workflow `37173376110` re-read the official 2026-08-03 through 2026-08-31 TWSE history for the remaining 15 invalid-close symbols:
1213, 1341, 1443, 1472, 1516, 1538, 2254, 2321, 2712, 4190, 5906, 6955, 8101, 8482, 9110.

Across those 15 names:
- invalid-close rows = 50;
- OFFICIAL_ZERO_TRADE_ROW = 11;
- UNRESOLVED_INVALID_CLOSE_ROW = 39.

The 11 zero-trade rows have zero volume, zero trade value, zero transactions and null OHLC. They are observed official rows, not missing-source rows.

The 39 unresolved rows are more important counterevidence: official rows contain positive volume / trade value / transaction counts while OHLC is null. Positive trading activity therefore cannot be used as a substitute for a valid official close, and these observations cannot be forward-filled or reconstructed from turnover.

### D19-04 observation-semantics falsification
The Stage-8 assumption that every factor member should have one valid close on each of the 21 market sessions is too coarse.

A cross-sectional momentum replay needs an explicit symbol-session / observation-state contract separating at least:
1. ELIGIBLE_VALID_PRICE_SESSION — valid PIT close with source provenance;
2. VERIFIED_NONTRADING_OR_EXCLUDED_SESSION — official suspension, stop-trading, listing-age or other positively evidenced non-tradability;
3. OFFICIAL_ZERO_TRADE_ROW — source row exists but no trade/price formation;
4. UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE — activity fields are positive but no admissible close exists;
5. SOURCE_UNKNOWN — required evidence itself unavailable.

The lookback must be defined in terms of predeclared valid observations and causal symbol-session semantics, not by silently forward-filling a fixed number of market-calendar sessions. Any change from a 20-session calendar-return convention to a valid-observation convention must itself be preregistered and sensitivity-tested because it changes factor economics for illiquid/suspended names.

### Liquidity / stale-price falsification
This stage materially strengthens the D19-04 and D19-16 dependency:
- low activity / stale prices can manufacture apparent momentum or suppress volatility;
- no-trade and invalid-close states are not interchangeable with zero return;
- treating previous close as today's observed close would inject a synthetic return path;
- excluding these names without a frozen eligibility rule can create selection bias.

Therefore D19-04 L3 must preserve the full denominator, publish eligibility/exclusion/UNKNOWN counts, and show sensitivity to stale-price / minimum-valid-observation rules.

### Redundancy and cost gates remain genuine
A current repository audit found no compatible same-date full-universe PIT D03/D09 evidence lane that can yet support the required D19-04 paired redundancy test without classification/look-back contamination. D03/D09 redundancy therefore remains BLOCKED rather than being approximated with current labels.

D14 cost evidence still supports date-valid statutory transaction-tax provenance, but owner-specific commission, slippage and turnover/execution semantics remain insufficient for a true net factor-return receipt. A zero-cost engineering placeholder remains prohibited as performance evidence.

### Stage 9 maturity decision
D19-04 remains L2 / 40%. D19 aggregate remains 40.0%.

This stage did not earn L3 because:
- TPEx date-vintaged universe + replayable history is still unresolved;
- the 39 positive-activity/no-OHLC rows remain unresolved price/session semantics;
- shared corporate-action/symbol-session completeness is not globally certified;
- PIT industry vintage is unavailable;
- D03/D09 paired redundancy is not executable on compatible PIT inputs;
- D14-compatible cost provenance is incomplete.

Formal Core remains LOCKED. No FORMAL_OPTIMIZATION_CANDIDATE.

### Exact next after Stage 9
1. Freeze a D19-04 valid-observation / symbol-session contract without forward fill and with explicit stale-price handling.
2. Reconcile the 39 positive-activity/no-OHLC rows against authoritative price/session-type semantics; unresolved observations stay UNKNOWN.
3. Archive immutable receipt-equivalent source evidence for the six documented stop-trading/event cases.
4. Build a TPEx date-vintaged universe receipt and source-independent replay from immutable persisted official history or a newly physically validated official source.
5. Acquire PIT industry classification and run industry neutralization.
6. Execute D03/D09 paired redundancy controls on the identical frozen universe/date once compatible PIT inputs exist.
7. Freeze a D14-compatible cost scenario with explicit component quality; owner-account actual commission stays UNKNOWN unless directly evidenced.
8. Only a deterministic full-Taiwan replay with zero applicable L3 blockers triggers readiness review; no automatic promotion.


## 2026-10-04 Long-block Stage 10 — valid-observation contract + dual-official-source price-absence reconciliation

### Durable implementation
- PR #489 merged as `81145020202f2806f754007062ae6a60d2979760`.
- Added `research/d19_04_valid_observation_contract_v0_1.json` and `system2/runtime/d19_valid_observation_adapter_v0_1.mjs`.
- D19-04 symbol-session observations are now explicit states rather than implicit missing-value handling: ELIGIBLE_VALID_PRICE_SESSION, VERIFIED_NONTRADING_OR_EXCLUDED_SESSION, OFFICIAL_ZERO_TRADE_ROW, UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE and SOURCE_UNKNOWN.
- Forward fill, previous-close substitution, positive-activity-to-price reconstruction and zero-trade-to-zero-return conversion are prohibited.
- D19 cannot infer suspension locally. VERIFIED_NONTRADING_OR_EXCLUDED_SESSION requires an external authoritative evidence receipt with source hash and reason code.
- Two preregistered research comparators are frozen: `CALENDAR_20_STRICT_V0_1` and `VALID_OBSERVATION_20_V0_1`. The latter requires an explicit maximum calendar-span parameter and is sensitivity research, not a silent redefinition of momentum.

### Shared source-adapter defect found and repaired
- The live TWSE STOCK_DAY individual-security monthly history uses ROC-calendar row dates such as 115/08/03, while the existing shared monthly-history adapter test had only exercised Gregorian 2026/09/01 fixtures.
- PR #489 therefore also extends the TWSE monthly-history date parser to accept both Gregorian and ROC formats and adds a regression fixture. This is source compatibility only; it does not change factor semantics.

### Physical validation
- System2 Research CI `37181597861`: PASS.
- V8 Regression `37181597874`: PASS.
- V8 Repair CI `37181597908`: PASS.
- D19 real-source valid-observation workflow `37181597868`: PASS; production isolation PASS.
- Primary full-market TWSE replay again reproduced exactly 50 non-price observations across the 15 targeted symbols: 11 OFFICIAL_ZERO_TRADE_ROW and 39 UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE. Deterministic primary evidence hash: `37d7a2d4922ae857ac9c62ede85a98e8f9fcbe3c75f085d2d776e3d13b0111d4`.

### Second official-source falsification of the single-endpoint-missing-data hypothesis
- The same 50 dates/symbols were independently queried through TWSE STOCK_DAY monthly individual-security history.
- All 50 had a corresponding alternate official row but still no admissible close: ALTERNATE_OFFICIAL_ROW_WITHOUT_VALID_CLOSE = 50.
- The 39 primary rows with positive trading activity yielded zero alternate-source valid closes: resolvedWithAlternateClose = 0; stillWithoutOfficialClose = 39.
- Volume shares, trade value and transaction count matched exactly across the two official source interfaces for 50/50 rows.
- Deterministic cross-source evidence hash: `5e2670ceab44650e7609b604c12bd19fb57d2fb92f2857f7cc4355c3ead878e3`.
- This materially falsifies the hypothesis that the 39 rows are merely a MI_INDEX single-endpoint omission recoverable from STOCK_DAY. The price-availability question is now stronger: two official source interfaces agree that activity exists while no admissible daily close is present. The exact transaction-mechanism cause remains unresolved and must not be invented.

### Scientific consequence
- The 39 rows remain unusable as price observations. They are not zero returns and they must not receive stale prior closes.
- A strict 21-market-session momentum clock will intentionally classify affected windows as incomplete.
- A valid-price-observation clock is permitted only as a preregistered comparator with an explicit maximum calendar span; its potential stale-information selection bias must be reported rather than hidden.
- The Stage-9 factor-input coverage blocker is therefore narrowed from ambiguous missing-price semantics to explicit official non-price observations plus shared symbol-session/continuity requirements.
- No D19 module is promoted to L3 from this result. D19 remains 40.0% because TPEx replay, full shared continuity certification, PIT industry neutralization, D03/D09 redundancy and D14-compatible cost evidence remain open.

### Exact next evidence program
1. Physically test the existing official TPEx individual-security monthly-history route as an alternate source-independent replay primitive; current full-market daily routes remain HTTP 520.
2. If the TPEx monthly route is physically readable, separate source feasibility from population/scale completeness: do not call a bounded smoke a full-market replay.
3. Archive immutable receipt-equivalent source evidence for the six documented TWSE stop-trading/structural-event cases and bind shared continuity receipts to exact formation windows.
4. Acquire date-vintaged PIT industry membership before neutralization.
5. Execute paired D03/D09 redundancy only on identical PIT date/universe inputs.
6. Freeze a D14-compatible component-wise cost scenario; owner-account commission remains UNKNOWN unless directly evidenced.
7. Only a deterministic full-Taiwan replay with zero applicable blockers triggers an L3 readiness review; no automatic promotion.


## 2026-10-04 Long-block Stage 11 — TPEx current-route recovery + source-unit correction

### What changed
- PR #500 merged as `26688826553ef20212a5341d766f9666d3f19890`.
- The retired TPEx `st43_result.php` route is no longer used by the shared monthly-history adapter.
- The current official individual-security history route is `/www/zh-tw/afterTrading/tradingStock` with JSON response.
- Shared adapter provenance now uses `TPEX_TRADING_STOCK_MONTHLY`.
- A hidden unit-semantics defect was corrected: TPEx source fields are 成交張數 and 成交仟元, so source volume is multiplied by 1,000 into shares and source trade value is multiplied by 1,000 into NTD before entering normalized fields.
- Unit lineage is preserved in sourceFields as LOT_1000_SHARES / THOUSAND_NTD plus explicit multipliers.

### Physical evidence
- Final TPEx smoke run `37182305258`: PASS.
- System2 Research CI `37182305255`: PASS.
- V8 Regression `37182305271`: PASS.
- TWSE dual-source regression `37182305264`: PASS, confirming the shared-adapter repair did not break Stage-10 TWSE evidence.
- Production isolation: PASS.

Bounded TPEx August-2026 witnesses:
- 3105: 21 rows, 21 valid closes, 2026-08-03..2026-08-31, first close 311, last close 447.5; first normalized volume 18,433,000 shares and trade value NT$5,750,298,000.
- 6488: 21 rows, 21 valid closes, 2026-08-03..2026-08-31, first close 866, last close 912; first normalized volume 15,388,000 shares and trade value NT$13,694,380,000.
- Content evidence hash: `ce1a0c5665fdd9f3ceb7d12a5d72d8337b61e03de3e39e3ba1c2a3698e0aa160`.

### Counterevidence and reliability boundary
- The same current route was physically observed returning HTTP 200 JSON on one run and HTTP 403 Cloudflare blocking on another hosted-runner attempt.
- Therefore source route/schema/unit feasibility is established, but hosted-runner transport reliability is NOT certified.
- A live transport failure must never be interpreted as an empty historical month.
- The current monthly route is a bounded alternate replay primitive candidate; it is not evidence that the full TPEx date-vintaged universe has been populated, persisted or replayed.
- Historical endpoint publication timestamps remain unproven; conservative session-close availability is a research convention rather than evidence of historical endpoint publication time.

### D19-04 blocker consequence
- The old blocker phrase “TPEx historical source unavailable” is now too broad.
- Correct decomposition:
  1. TPEx source route/schema/unit semantics = PARTIAL_PASS / physically readable on bounded witnesses.
  2. TPEx hosted-runner transport reliability = BLOCKED_INTERMITTENT_403.
  3. TPEx date-vintaged historical-universe denominator = BLOCKED.
  4. TPEx scalable persisted full-market replay = BLOCKED.
- D19-04 remains L2 / 40%; D19 aggregate remains 40.0%.
- No Formal Core, production runtime, ranking, threshold, capital, push or live-trading behavior changed.

### Exact next evidence program
1. Build TPEx date-vintaged historical-universe membership from authoritative current+delisted provenance.
2. Use source-independent immutable persistence so replay does not depend on the live TPEx endpoint being healthy on every run.
3. Scale beyond bounded 3105/6488 only after rate/transport behavior is made rerun-safe and missing transport is preserved as UNKNOWN, never empty history.
4. Continue shared continuity-window receipt binding for TWSE/TPEx.
5. Acquire PIT industry vintage, run D03/D09 paired redundancy, and freeze D14-compatible component-wise cost evidence.
6. Only a zero-applicable-blocker full-Taiwan deterministic replay may trigger L3 readiness review; no automatic promotion.


## 2026-10-04 Long-block Stage 12 — D19-12 bounded date-intrinsic calendar PIT promotion
- Canonical receipt: `research/d19_12_date_intrinsic_calendar_pit_receipt_20261004_v0_1.json`.
- D19-12 advances from L2/40 to L3/60 for bounded TWSE date-intrinsic states only: WEEKDAY and MONTH_OF_YEAR.
- Executable lineage reuses the existing official historical TWSE calendar runtime/tests and the physically verified 2017 market-year evidence: 246 official sessions, 222,194 official rows, exact cold/fresh reconciliation, zero source-row-hash mismatch.
- WEEKDAY and MONTH_OF_YEAR are determined by the same marketDate and require no future-session knowledge. Historical replay remains conservatively consumed after session-close finality.
- Excluded from the promoted scope: HOLIDAY, PRE_HOLIDAY, POST_HOLIDAY, TURN_OF_MONTH, LUNAR_CALENDAR, SETTLEMENT_OR_INDEX_REBALANCE. These still require their own historical calendar-vintage / announcement or event-source clocks.
- No return outcomes were opened. No bullish/bearish sign, calendar threshold, score or Formal rule is authorized.
- Counterevidence remains binding: calendar effects can decay/reverse and the family has severe multiple-testing/data-mining risk.
- D19 aggregate becomes 41.3%; one active module is L3/60 and fourteen remain L2/40.
- Exact next: add at least one independent historical year under identical WEEKDAY/MONTH_OF_YEAR semantics; separately seek historical known-at evidence for holiday/turn-of-month states; no L4 without prospective/OOS, costs, multiple-testing and robustness.


## 2026-10-05 Long-block Stage 13 — D19-12 independent-year date-intrinsic PIT robustness

### Durable evidence
- PR #603 merged as `32a6adc155eda8c1a500baf73346c55170de4a7b`.
- Canonical robustness receipt: `research/d19_12_date_intrinsic_calendar_pit_receipt_20261005_v0_2.json`.
- System2 Research CI `37243300685`: PASS.
- V8 Regression `37243300702`: PASS.
- D19-12 multi-year smoke `37243300721`: PASS_D19_12_DATE_INTRINSIC_MULTI_YEAR_PIT.
- Multi-year state hash: `fed1ca6c7f9e9edd1d3a366c1de3c1ecf0618578f1d80ff317e0409bde590557`.
- Receipt hash: `5b9124396eb9d93e5af31e2ff8aede322d7a7b5fab328043066d69f6dc0320b7`.

### Independent-year physical replay
2017:
- official sessions = 246;
- first/last official trading date = 2017-01-03 / 2017-12-29;
- fresh official rows = cold rows = 222,194;
- missing/extra/source-row-hash mismatch = 0/0/0;
- weekday-state hash = `856342c9806eb3464d21ad76821c46ec3c08c7f2841791f9dfe8e4e346212cc6`.

2018:
- official sessions = 247;
- first/last official trading date = 2018-01-02 / 2018-12-28;
- fresh official rows = cold rows = 227,381;
- missing/extra/source-row-hash mismatch = 0/0/0;
- weekday/month state hash = `18d7af407780ddaf8c3e597c7b8e55dfeeee1beafa54454d5fabc7861d9b6db0`.

### Important falsification of a naive weekday assumption
- 2017 contains 3 Saturday trading sessions.
- 2018 contains 2 Saturday trading sessions.
- Therefore a Taiwan weekday-seasonality implementation must classify the weekday of the actual official marketDate and must not hard-code Monday-Friday only.
- Weekend calendar days that are not official sessions remain absent; Saturday sessions that are official sessions remain valid observations.

### Maturity decision
- D19-12 remains L3 / 60%.
- This stage strengthens cross-year PIT robustness but does not satisfy L4 because no prospective/OOS return outcome, cost-adjusted effect, multiple-testing correction or multi-regime efficacy evidence is opened.
- Existing L3 promoted scope remains only WEEKDAY and MONTH_OF_YEAR.
- HOLIDAY / PRE_HOLIDAY / POST_HOLIDAY / TURN_OF_MONTH / LUNAR_CALENDAR / SETTLEMENT_OR_INDEX_REBALANCE remain source-clock gated.
- Formal Core unchanged; no FORMAL_OPTIMIZATION_CANDIDATE.

### Exact next after Stage 13
1. Establish historical calendar-vintage / announcedAt evidence for at least one bounded annual holiday schedule before expanding HOLIDAY/PRE_HOLIDAY/POST_HOLIDAY or TURN_OF_MONTH L3 scope.
2. Treat annual schedule knownAt separately from emergency closures/typhoon closures, which require event-specific clocks.
3. Keep lunar and settlement/index-rebalance families separately source-gated.
4. Continue D19-04 only by consuming DATA_LANE TPEx/universe/continuity outputs; do not duplicate that engineering.
5. No L4 without prospective/OOS outcomes, costs, multiple-testing control and robustness.


## 2026-10-06 Long-block Stage 14 — D19-12 annual-calendar vintage regime falsification

### New official evidence
- TWSE Data E-Shop publication dated 2018-11-22 publishes the 2019 holiday schedule before the 2019 effective year.
- TWSE governance material records the regime change source as 2018-09-13 letter 臺證交字第1070017873號: from 2019 onward, weekend make-up workdays are not trading or settlement days.
- This creates a bounded cross-year falsification against 2018, whose verified official-session replay contains two Saturday trading sessions.

### Scientific consequence
- Annual calendar state is versioned market infrastructure, not a timeless weekday rule.
- A PIT holiday/pre-holiday/post-holiday replay must bind effectiveYear + publishedAt/announcedAt + market-calendar regime version + actual official session calendar. A current rule must not be backfilled into 2018, and 2018 Saturday semantics must not be forward-filled into 2019.
- Scheduled annual holidays and emergency/typhoon closures remain separate clocks. Emergency closures remain UNKNOWN until event-specific evidence is available.
- Post-period Fact Book/session-count evidence may validate final totals but cannot substitute for historical known-at evidence.
- The existing 2018 knownAt receipt remains evidence-only because immutable source bytes/sourceHash and a zero-difference state reconciliation have not yet been frozen.

### Maturity decision
- D19-12 remains L3 / 60% only for bounded WEEKDAY and MONTH_OF_YEAR states.
- D19 aggregate remains 41.3%.
- HOLIDAY / PRE_HOLIDAY / POST_HOLIDAY / TURN_OF_MONTH are not promoted by this stage.
- No return outcome, cost-adjusted efficacy, multiple-testing-controlled result, OOS/prospective evidence, or Formal rule is opened.
- Formal Core unchanged; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

### Exact next after Stage 14
1. Freeze immutable bytes/sourceHash for the 2018 annual calendar publication and preserve its 2017-12-15 publication clock.
2. Build a versioned 2018 scheduled-calendar state set and reconcile it date-by-date against the verified 247-session official calendar; unexplained rows remain UNKNOWN.
3. Add the 2019 pre-effective-year schedule plus the 2018-09-13 regime-change notice as an explicit cross-year negative-control fixture; verify that weekend make-up workdays do not inherit 2018 trading semantics.
4. Only after zero applicable provenance/replay blockers may HOLIDAY/PRE_HOLIDAY/POST_HOLIDAY receive a bounded L3 readiness review; no automatic promotion.
5. TURN_OF_MONTH remains separately gated because its state may depend on future official sessions around month-end; lunar/settlement/rebalance families remain source-clock gated.


## 2026-10-07 Long-block Stage 15 — D19-13/D19-16 Taiwan cost and liquidity falsification
- Canonical evidence receipt: `research/d19_stage15_cost_liquidity_falsification_receipt_20261007_v0_1.md`.
- D19-13: Taiwan pairs-trading evidence provides a strong transaction-cost falsification witness. Pair-search breadth is part of the multiple-testing family; pair/model/version, formation window, hedge ratio, structural breaks, two-leg tradability, borrowability, costs and overlap must be preregistered. Remains L2/40.
- D19-16: Taiwan evidence supports studying illiquidity pricing but is heterogeneous across controls, market direction and metric definition. Liquidity-as-signal is separated from liquidity-as-execution-friction. Baseline Amihud, ex-overnight, recency-aware and up/down-market variants form a preregistered comparator family. Remains L2/40.
- First complete factor-layer PIT chain is selected by upstream receipt readiness, not observed performance. Mandatory chain remains universeReceipt -> returnReceipt -> factorInputReceipt -> neutralizationReceipt -> costReceipt -> replayReceipt; missing mandatory evidence stays UNKNOWN.
- D19 remains 41.3%; no L3/L4 promotion; Formal Core unchanged; FORMAL_OPTIMIZATION_CANDIDATE=NONE.
- Exact next: machine-readable D19-13 preregistration receipt; machine-readable D19-16 PIT input receipt; D19-15 benchmark PIT receipt; then select the first executable factor-layer PIT chain before outcome inspection.
