# Behavioral Finance / Investor Attention Checkpoint

Updated: 2026-10-02 23:19 Asia/Taipei
Scope: D20｜行為金融／投資人注意力／市場心理
Status: FOUNDATION_CLUSTER_L2 / D20-01_02_04_07 / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D20.
- Behavioral labels are mechanisms/hypotheses, not licenses to infer unobservable investor intent from OHLCV.
- Require positive mechanism, counterevidence, PIT/replay, data-quality, redundancy, costs and incremental-value checks.
- Behavioral proxies derived from price/volume must not receive duplicate factor credit against D01/D02/D03/D04/D05.

## Durable progress｜2026-10-02
- D20-01 Prospect Theory / Loss Aversion: L0 -> L2.
  - Reference dependence and loss asymmetry are useful hypothesis structures.
  - Falsification established: prospect theory does not mechanically imply the disposition effect; predictions depend on reference-point/evaluation implementation, and universal loss-aversion claims are contested.
- D20-02 Disposition Effect: L0 -> L2.
  - U.S. and Taiwan account/trade evidence reviewed.
  - Taiwan evidence includes heterogeneous behavior by investor type; mutual funds/foreign investors are important counterexamples in complete-market evidence.
  - Structural alternatives and data requirements frozen.
- D20-04 Anchoring / Reference Dependence: L0 -> L2.
  - Taiwan 52-week-high/attention evidence reviewed.
  - Redundancy firewall established against momentum, breakout, MA-distance, volatility and price-position families.
- D20-07 Investor Attention / Salience: L0 -> L2.
  - General and Taiwan transaction evidence reviewed, including regime heterogeneity.
  - External attention proxies must be separated from endogenous price/volume proxies.
- D20 aggregate maturity: 13.3%.
- No L3 promotion: our own replayable Taiwan PIT data contracts are not yet validated.
- Formal Core unchanged.

## Exact next continuation
1. Start D20-03 Overconfidence from theory -> observable proxies -> competing structural explanations -> falsification.
2. In parallel, build Taiwan PIT/replay feasibility contracts for D20-01/02/04/07:
   - explicit reference-point definition and update rule;
   - holdings/cost-basis or defensible aggregate reference-price reconstruction;
   - investor-type segmentation where available;
   - first-known timestamps and replayability;
   - external attention proxies separated from endogenous return/volume proxies;
   - redundancy controls versus price, volume, momentum, volatility, microstructure and event/news families.
3. Do not promote to L3 until those data contracts are verifiably available and replayable.

## Canonical overlay 2026-10-03 21:40 Asia/Taipei
- Canonical tracker: all D20-01 through D20-13 are L2 / 40%.
- D20 aggregate maturity: 40.0%.
- Foundation phase complete: mechanism + falsification only.
- Next phase: L2 -> L3 Taiwan PIT/replay feasibility.
- Priority: D20-08 event drift, D20-06 herding identifiability, D20-10 investor sentiment, D20-13 arbitrage constraints, D20-11 narrative diffusion.
- Do not repeat L0/L1 foundation work.
- Formal Core unchanged.

## Canonical overlay 2026-10-04 03:05 Asia/Taipei
- D20-08 monthly-revenue event-clock validation advanced; maturity remains L2 / 40%.
- Official correction workflow supports a version chain: correction disclosure contains before/after values, followed by revenue re-announcement.
- TWSE company-information records show correction disclosures with publication timestamps to the second.
- correction_first_known is a viable clock candidate.
- original issuer_submission_first_known remains unresolved for large-scale replay and must not be inferred from filing deadlines or aggregate snapshot dates.
- Historical original and corrected values must remain separate vintages.
- Next: audit at least 30 correction events across market segments, years and publication times; trace each correction to its original revenue version and measure timestamp coverage.
- If the original clock remains unavailable, record the source blocker and rotate to D20-06 data feasibility.
- Formal Core remains locked; no optimization candidate.

