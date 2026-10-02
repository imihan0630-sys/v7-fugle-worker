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
