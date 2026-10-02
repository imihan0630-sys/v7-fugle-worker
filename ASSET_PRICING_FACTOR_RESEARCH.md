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
