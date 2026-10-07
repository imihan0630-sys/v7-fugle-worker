# D01 DL-081~085 — Evidence Ledger V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / SOURCE_LINEAGE_FROZEN

## Synthesis

### Single- and multi-candle patterns
- Empirical literature is mixed: some filtered candlestick approaches report predictive value, while other strict out-of-sample or cost-aware audits find weak or non-deployable value.
- This supports morphology-first representation and explicit raw-OHLC comparators rather than accepting traditional names as independent alpha.
- Overlapping sequence windows and large pattern libraries create multiplicity and redundancy risks.

Relevant identifiers:
- PMCID PMC8345893 / PMID 34358269 — filtered candlestick pattern recognition study.
- arXiv 2605.17724 — strict walk-forward OHLCV sequence study reporting no significant OOS edge in the tested setup.
- arXiv 2607.20093 — broad retail-signal audit with strict multiplicity/economic gates.
- arXiv 1811.06766 — discrete false-discovery-rate control across large technical-rule families.

### Base / cup / handle
- Chart-pattern research supports testing pattern geometry, but parameter freedom and retrospective completion are major risks.
- Generic breakout, trend and range-compression controls are required before claiming pattern-specific incrementality.

Relevant identifiers:
- PMCID PMC3871165 / PMID 24376577 — scaling/volatility of breakouts and breakdowns.
- arXiv 1807.03192 — learned technical pattern filters versus preset technical features.
- arXiv 1706.05283 — quantitative search of chart-pattern representations.

### Gaps and price limits
- Opening-gap research treats gaps as adjustment to new information, supporting event/context decomposition.
- Price-limit research documents delayed/censored price-discovery effects and continuation/reversal heterogeneity.
- Limit-order-book gap research shows liquidity gaps are distinct from overnight/opening gaps.

Relevant identifiers:
- PMCID PMC10017064 / PMID 37362597 — stock opening price gaps and adjustment to new information.
- arXiv 1803.09422 — cooling-off effect of price limits.
- PMCID PMC4395215 / PMID 25874716 — price-limit hit dynamics.
- PMCID PMC10289463 / PMID 37352309 — price-limit reform and delayed price discovery.
- arXiv 1405.1247 — limit-order-book price gaps.

### Taiwan market structure
- TWSE official investor/trading material confirms ordinary stocks use daily price limits and distinguishes opening/closing call auction from continuous intraday matching.
- Earlier D01 canonical firewalls already route corporate actions, suspensions/resumptions, disposition securities and price-limit contamination.

No evidence in this ledger authorizes pattern alpha or Formal Core promotion.
