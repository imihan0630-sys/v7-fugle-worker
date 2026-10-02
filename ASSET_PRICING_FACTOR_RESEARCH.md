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
