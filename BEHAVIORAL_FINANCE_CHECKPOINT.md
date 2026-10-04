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

## Canonical overlay 2026-10-04 03:05 Asia/Taipei — D20-06
- Taiwan herding evidence confirms that investor-type, direction and timing data materially improve behavioral identification.
- Public investor-category net flows are weak proxies because they cannot identify within-category imitation or leader/follower structure.
- Intraday transaction/order-book data with investor classification are strong candidates, but system-accessible PIT/replay availability is not yet proven.
- Social stance is also only a candidate unless first-known, edit/delete history, account deduplication and common-news controls are replayable.
- D20-06 remains L2 / 40%; no L3 promotion.
- Next: inventory actually accessible investor-type/high-frequency/social data. If no independent replayable source exists, retain UNKNOWN and do not create a duplicate crowding factor.
- Formal Core remains locked; no optimization candidate.

## Canonical overlay 2026-10-04 07:31 Asia/Taipei — D20 crossed 50%
- D20 aggregate maturity: 50.8%.
- L3 / 60%: D20-02, D20-04, D20-05, D20-07, D20-08, D20-10, D20-12.
- L2 / 40% retained: D20-01, D20-03, D20-06, D20-09, D20-11, D20-13.
- Promotion meaning is Taiwan PIT/replay data feasibility only; no alpha, OOS or Formal claim.
- D20-02 promotion is bounded to the TWSE short-side disposition sublane; direct long-account PGR/PLR remains UNKNOWN.
- D20-04/D20-05 use validated Taiwan daily history with corporate-action/session fail-closed guards.
- D20-07 uses official exchange attention designation as a salience-event source with endogeneity controls.
- D20-08 uses only valid D11-09/D17-13 event receipts; unresolved original monthly-revenue first-known rows stay UNKNOWN.
- D20-10 uses dated monthly Taiwan investor-survey releases; no daily interpolation.
- D20-12 freezes a common-cutoff falsification receipt linking behavioral proxy and structural counterfactuals without duplicate primitive votes.
- Formal Core remains locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Exact next: accumulate outcome-blind replay/coverage receipts for the seven L3 lanes. Do not force the six remaining L2 modules upward unless their independent source/identifiability blockers are truly resolved.

## Canonical overlay 2026-10-04 08:52 Asia/Taipei — L4 prospective phase frozen
- D20 maturity remains 50.8%; no L4 promotion.
- Canonical L4 prerequisite: genuine post-preregistration Prospective Shadow or valid OOS evidence.
- New preregistration:
  - research/d20_l4_prospective_shadow_prereg_v0_1.json
  - research/D20_L4_PROSPECTIVE_SHADOW_PREREG_20261004_V0_1.md
- 2025-12 through 2026-09 Cathay monthly sentiment × adjusted-0050 pilot is permanently quarantined:
  DEVELOPMENT_ONLY_CONTAMINATED / NOT_PROMOTION_GRADE.
- Development pilot is useful only as falsification/design evidence: sentiment LEVEL and CHANGE are separated; no bullish sign is assumed; prior market return/volatility become mandatory controls.
- Promotion-grade parent collection starts only after the 2026-10-04 08:52 freeze.
- D20-10 minimum L4 gate: 6 independent post-freeze monthly releases and >=2 regimes.
- D20-07: >=20 independent dates and >=100 treated events with matched controls.
- D20-04/05: >=12 independent weekly dates; D20-05 must survive D20-04/D03 residual controls.
- D20-02: >=12 independent weekly TWSE short-side dates; TPEx/long-account gaps remain UNKNOWN.
- D20-08: >=12 independent event dates with valid first-known/capture clocks and frozen D1/D5/D20 windows.
- D20-12: >=20 prospective discriminating cases with common-cutoff structural counterfactuals.
- Exact next: collect immutable post-freeze parent receipts only. Do not open each parent’s outcome until the parent/specification fingerprint is frozen. No historical Shadow fabrication.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Canonical overlay 2026-10-04 11:40 Asia/Taipei — D20 53.8%
- D20 aggregate maturity: 53.8%.
- L3 / 60%: D20-01, D20-02, D20-04, D20-05, D20-07, D20-08, D20-09, D20-10, D20-12.
- L2 / 40%: D20-03, D20-06, D20-11, D20-13.
- D20-01 promotion is bounded to TWSE short-side reference dependence using the exact D20-02 short-position/reference-price receipt. Pure loss aversion is NOT identified; no duplicate vote.
- D20-09 promotion is bounded to event-conditioned initial-response residuals using valid event clocks/surprise plus completed causal 15m bars. D03-05 still owns observable reversal; later reversal is forbidden from the parent.
- D20-13 is L3-ready but remains L2 until the first genuine trading-day TWSE rate/displayed-supply receipt validates the frozen source contract. True utilization remains UNKNOWN.
- D20-03 stays L2 because turnover/margin/volume cannot identify overconfidence.
- D20-06 stays L2; new D06-19 owns any future direct natural-person primitive, but stock×date natural-person directional flow is currently UNKNOWN.
- D20-11 stays L2 because no versioned replayable social-language narrative-diffusion stream is validated.
- L4 preregistration was extended at 2026-10-04 11:40 to cover D20-01 and D20-09 prospectively. No L4 promotion.
- Remaining blocker audit: research/d20_remaining_l2_blocker_audit_20261004_v0_1.json
- Exact next: on the next valid Taiwan trading day, first try to close D20-13 L3 with the frozen live TWSE borrow-rate/displayed-supply receipt. In parallel begin post-freeze parent capture for all nine L3 lanes. No historical Shadow fabrication.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## D20-13 first-live source capture freeze｜2026-10-04 11:40 Asia/Taipei
- Protocol: research/d20_13_first_live_twse_borrow_constraint_capture_v0_1.json
- TWSE SBL service hours verified as 09:00-15:30.
- First genuine post-freeze trading day target slots are fixed at 09:15, 12:00 and 15:20 Asia/Taipei, each with ±5-minute tolerance.
- Missing capture inside a slot stays MISSING/UNKNOWN; no later substitute snapshot.
- Purpose is source/PIT certification only. Outcomes remain locked.
- D20-13 remains L2 until at least one genuine slot receipt passes source/timestamp/schema/hash/UNKNOWN checks.

